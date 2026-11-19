const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

exports.requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.requireRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).lean();
      if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
      if (!roles.includes(user.role)) return res.status(403).json({ success: false, message: 'Forbidden' });
      next();
    } catch (e) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
};


