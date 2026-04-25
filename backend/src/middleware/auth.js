const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // 1. Prefer httpOnly cookie
  let token = req.cookies?.session_token;

  // 2. Fall back to Authorization header (for mobile / external clients)
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Clear the stale cookie so the browser stops sending it
      res.clearCookie('session_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: requires ${role} access` });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
