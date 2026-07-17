import os
import jwt
from fastapi import Header, HTTPException

JWT_SECRET = os.getenv('JWT_SECRET', 'careercraft-jwt-secret-2024-secure-key')


def generate_token(user_id: str) -> str:
    return jwt.encode({'userId': user_id}, JWT_SECRET, algorithm='HS256')


def verify_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.PyJWTError:
        return None


def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='No token provided')
    token = authorization.split(' ')[1]
    decoded = verify_token(token)
    if not decoded:
        raise HTTPException(status_code=401, detail='Invalid or expired token')
    return decoded['userId']
