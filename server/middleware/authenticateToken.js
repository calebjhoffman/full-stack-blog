import jwt from 'jsonwebtoken';

export default function authenticateToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.sendStatus(403);
  }
}
