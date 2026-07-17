import re
import os
import json
import uuid
from datetime import datetime, timedelta
import bcrypt
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import get_db
from middleware.auth import generate_token, get_current_user

router = APIRouter(prefix='/api/auth')


class RegisterBody(BaseModel):
    name: str
    email: str
    password: str
    year: int = 1
    college: str = ''
    avatar: str = '🧑‍🎓'


class LoginBody(BaseModel):
    email: str
    password: str


class ForgotPasswordBody(BaseModel):
    email: str


class UpdateProfileBody(BaseModel):
    streak: int | None = None
    totalScore: int | None = None
    badges: list | None = None
    progress: dict | None = None


@router.post('/register', status_code=201)
async def register(body: RegisterBody):
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail='Password must be at least 6 characters')
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', body.email):
        raise HTTPException(status_code=400, detail='Invalid email format')

    conn = get_db()
    email_lower = body.email.lower()
    existing = conn.execute('SELECT id FROM users WHERE email = ?', (email_lower,)).fetchone()
    if existing:
        raise HTTPException(status_code=409, detail='Email already registered')

    user_id = str(uuid.uuid4())
    password_hash = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt(12)).decode()

    conn.execute(
        'INSERT INTO users (id, name, email, password_hash, year, college, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (user_id, body.name, email_lower, password_hash, body.year, body.college, body.avatar)
    )
    conn.execute('INSERT INTO progress (user_id) VALUES (?)', (user_id,))
    conn.commit()

    token = generate_token(user_id)
    return {
        'message': 'Registration successful',
        'token': token,
        'user': {
            'id': user_id, 'name': body.name, 'email': email_lower,
            'year': body.year, 'college': body.college, 'avatar': body.avatar,
            'streak': 0, 'totalScore': 0, 'badges': []
        }
    }


@router.post('/login')
async def login(body: LoginBody):
    if not body.email or not body.password:
        raise HTTPException(status_code=400, detail='Email and password are required')

    conn = get_db()
    row = conn.execute(
        'SELECT id, name, email, password_hash, year, college, avatar, streak, total_score, badges, joined_at FROM users WHERE email = ?',
        (body.email.lower(),)
    ).fetchone()
    if not row:
        raise HTTPException(status_code=401, detail='Invalid email or password')

    if not bcrypt.checkpw(body.password.encode(), row['password_hash'].encode()):
        raise HTTPException(status_code=401, detail='Invalid email or password')

    token = generate_token(row['id'])
    badges = json.loads(row['badges'] or '[]')
    return {
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': row['id'], 'name': row['name'], 'email': row['email'],
            'year': row['year'], 'college': row['college'], 'avatar': row['avatar'],
            'streak': row['streak'] or 0, 'totalScore': row['total_score'] or 0,
            'badges': badges, 'joinedAt': row['joined_at']
        }
    }


@router.post('/forgot-password')
async def forgot_password(body: ForgotPasswordBody):
    conn = get_db()
    row = conn.execute('SELECT id FROM users WHERE email = ?', (body.email.lower(),)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail='No account found with this email')

    reset_token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=1)
    conn.execute(
        'INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)',
        (str(uuid.uuid4()), row['id'], reset_token, expires_at.isoformat())
    )

    temp_password = os.urandom(6).hex() + 'A1'
    temp_hash = bcrypt.hashpw(temp_password.encode(), bcrypt.gensalt(12)).decode()
    conn.execute('UPDATE users SET password_hash = ? WHERE id = ?', (temp_hash, row['id']))
    conn.commit()

    return {
        'message': 'Password reset successful',
        'tempPassword': temp_password,
        'note': 'In production, this would be sent via email. For demo purposes, here is your temporary password.'
    }


@router.get('/profile')
async def get_profile(user_id: str = Depends(get_current_user)):
    conn = get_db()
    row = conn.execute(
        'SELECT id, name, email, year, college, avatar, streak, total_score, badges, joined_at FROM users WHERE id = ?',
        (user_id,)
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail='User not found')

    badges = json.loads(row['badges'] or '[]')
    user_data = {
        'id': row['id'], 'name': row['name'], 'email': row['email'],
        'year': row['year'], 'college': row['college'], 'avatar': row['avatar'],
        'streak': row['streak'] or 0, 'totalScore': row['total_score'] or 0,
        'badges': badges, 'joinedAt': row['joined_at']
    }

    prog = conn.execute(
        'SELECT hr_completed, hr_score, hr_total, tech_completed, tech_score, tech_total, gd_completed, gd_score, gd_total, apt_completed, apt_score, apt_total FROM progress WHERE user_id = ?',
        (user_id,)
    ).fetchone()

    progress = None
    if prog:
        progress = {
            'hr': {'completed': prog[0], 'averageScore': prog[1], 'total': prog[2]},
            'technical': {'completed': prog[3], 'averageScore': prog[4], 'total': prog[5]},
            'gd': {'completed': prog[6], 'averageScore': prog[7], 'total': prog[8]},
            'aptitude': {'completed': prog[9], 'averageScore': prog[10], 'total': prog[11]},
        }

    return {'user': user_data, 'progress': progress}


@router.put('/profile')
async def update_profile(body: UpdateProfileBody, user_id: str = Depends(get_current_user)):
    conn = get_db()
    if body.streak is not None or body.totalScore is not None or body.badges is not None:
        current = conn.execute(
            'SELECT streak, total_score, badges FROM users WHERE id = ?', (user_id,)
        ).fetchone()
        if current:
            new_streak = body.streak if body.streak is not None else current['streak']
            new_score = body.totalScore if body.totalScore is not None else current['total_score']
            new_badges = json.dumps(body.badges) if body.badges is not None else current['badges']
            conn.execute(
                'UPDATE users SET streak = ?, total_score = ?, badges = ? WHERE id = ?',
                (new_streak, new_score, new_badges, user_id)
            )

    if body.progress:
        p = body.progress
        existing = conn.execute('SELECT user_id FROM progress WHERE user_id = ?', (user_id,)).fetchone()
        if existing:
            conn.execute(
                '''UPDATE progress SET
                    hr_completed=?, hr_score=?, hr_total=?,
                    tech_completed=?, tech_score=?, tech_total=?,
                    gd_completed=?, gd_score=?, gd_total=?,
                    apt_completed=?, apt_score=?, apt_total=?
                WHERE user_id=?''',
                (
                    p.get('hr', {}).get('completed', 0), p.get('hr', {}).get('averageScore', 0), p.get('hr', {}).get('total', 30),
                    p.get('technical', {}).get('completed', 0), p.get('technical', {}).get('averageScore', 0), p.get('technical', {}).get('total', 30),
                    p.get('gd', {}).get('completed', 0), p.get('gd', {}).get('averageScore', 0), p.get('gd', {}).get('total', 10),
                    p.get('aptitude', {}).get('completed', 0), p.get('aptitude', {}).get('averageScore', 0), p.get('aptitude', {}).get('total', 30),
                    user_id
                )
            )

    conn.commit()
    return {'message': 'Profile updated'}
