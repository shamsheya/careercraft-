import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'careercraft-jwt-secret-2024-secure-key';

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.userId = decoded.userId;
  next();
}
