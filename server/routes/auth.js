import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, year, college, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const db = await getDb();

    const existing = db.exec(`SELECT id FROM users WHERE email = ?`, { bind: [email.toLowerCase()] });
    if (existing.length > 0 && existing[0].values.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    db.run(
      `INSERT INTO users (id, name, email, password_hash, year, college, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email.toLowerCase(), passwordHash, year || 1, college || '', avatar || '🧑‍🎓']
    );
    db.run(
      `INSERT INTO progress (user_id) VALUES (?)`,
      [id]
    );
    saveDb();

    const token = generateToken(id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id, name, email: email.toLowerCase(), year: year || 1, college: college || '', avatar: avatar || '🧑‍🎓', streak: 0, totalScore: 0, badges: [] }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await getDb();

    const result = db.exec(
      `SELECT id, name, email, password_hash, year, college, avatar, streak, total_score, badges, joined_at FROM users WHERE email = ?`,
      { bind: [email.toLowerCase()] }
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const row = result[0].values[0];
    const [id, name, userEmail, passwordHash, year, college, avatar, streak, totalScore, badgesStr, joinedAt] = row;

    const isValid = await bcrypt.compare(password, passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(id);
    const badges = JSON.parse(badgesStr || '[]');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id, name, email: userEmail, year, college, avatar,
        streak: streak || 0, totalScore: totalScore || 0, badges, joinedAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const db = await getDb();
    const result = db.exec(`SELECT id FROM users WHERE email = ?`, { bind: [email.toLowerCase()] });

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    const userId = result[0].values[0][0];
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000).toISOString();

    db.run(
      `INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
      [uuidv4(), userId, resetToken, expiresAt]
    );
    saveDb();

    const tempPassword = Math.random().toString(36).slice(-8) + 'A1';
    const tempHash = await bcrypt.hash(tempPassword, 12);
    db.run(`UPDATE users SET password_hash = ? WHERE id = ?`, [tempHash, userId]);
    saveDb();

    res.json({
      message: 'Password reset successful',
      tempPassword,
      note: 'In production, this would be sent via email. For demo purposes, here is your temporary password.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec(
      `SELECT id, name, email, year, college, avatar, streak, total_score, badges, joined_at FROM users WHERE id = ?`,
      { bind: [req.userId] }
    );
    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const row = result[0].values[0];
    const [id, name, email, year, college, avatar, streak, totalScore, badgesStr, joinedAt] = row;
    const badges = JSON.parse(badgesStr || '[]');

    const progResult = db.exec(
      `SELECT hr_completed, hr_score, hr_total, tech_completed, tech_score, tech_total, gd_completed, gd_score, gd_total, apt_completed, apt_score, apt_total FROM progress WHERE user_id = ?`,
      { bind: [req.userId] }
    );

    let progress = null;
    if (progResult.length > 0 && progResult[0].values.length > 0) {
      const p = progResult[0].values[0];
      progress = {
        hr: { completed: p[0], averageScore: p[1], total: p[2] },
        technical: { completed: p[3], averageScore: p[4], total: p[5] },
        gd: { completed: p[6], averageScore: p[7], total: p[8] },
        aptitude: { completed: p[9], averageScore: p[10], total: p[11] },
      };
    }

    res.json({
      user: { id, name, email, year, college, avatar, streak: streak || 0, totalScore: totalScore || 0, badges, joinedAt },
      progress
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// PUT /api/auth/profile - update profile data
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { streak, totalScore, badges, progress } = req.body;
    const db = await getDb();

    if (streak !== undefined || totalScore !== undefined || badges !== undefined) {
      const current = db.exec(
        `SELECT streak, total_score, badges FROM users WHERE id = ?`,
        { bind: [req.userId] }
      );
      if (current.length > 0 && current[0].values.length > 0) {
        const c = current[0].values[0];
        const newStreak = streak ?? c[0];
        const newScore = totalScore ?? c[1];
        const newBadges = badges ? JSON.stringify(badges) : c[2];
        db.run(
          `UPDATE users SET streak = ?, total_score = ?, badges = ? WHERE id = ?`,
          [newStreak, newScore, newBadges, req.userId]
        );
      }
    }

    if (progress) {
      const existing = db.exec(`SELECT user_id FROM progress WHERE user_id = ?`, { bind: [req.userId] });
      if (existing.length > 0 && existing[0].values.length > 0) {
        db.run(
          `UPDATE progress SET hr_completed=?, hr_score=?, hr_total=?, tech_completed=?, tech_score=?, tech_total=?, gd_completed=?, gd_score=?, gd_total=?, apt_completed=?, apt_score=?, apt_total=? WHERE user_id=?`,
          [
            progress.hr?.completed ?? 0, progress.hr?.averageScore ?? 0, progress.hr?.total ?? 30,
            progress.technical?.completed ?? 0, progress.technical?.averageScore ?? 0, progress.technical?.total ?? 30,
            progress.gd?.completed ?? 0, progress.gd?.averageScore ?? 0, progress.gd?.total ?? 10,
            progress.aptitude?.completed ?? 0, progress.aptitude?.averageScore ?? 0, progress.aptitude?.total ?? 30,
            req.userId
          ]
        );
      }
    }

    saveDb();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

export default router;
