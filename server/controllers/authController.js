const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const emailNorm = email.toLowerCase();
    let user = await User.findOne({ email: emailNorm });
    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await User.create({
        email: emailNorm,
        name: emailNorm.split('@')[0],
        passwordHash,
        role: 'free',
        subscription: { tier: 'free', status: 'active' },
      });
    } else {
      if (user.passwordHash) {
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const token = signToken({ sub: user.id, email: user.email });
    res.status(200).json({ success: true, data: { token, user } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const emailNorm = email.toLowerCase();
    const exists = await User.findOne({ email: emailNorm });
    if (exists) return res.status(409).json({ success: false, message: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: emailNorm,
      name: name || emailNorm.split('@')[0],
      passwordHash,
      role: 'free',
      subscription: { tier: 'free', status: 'active' },
    });
    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({ success: true, data: { token, user } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
};

exports.getPreferences = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user.preferences || {} });
};

exports.savePreferences = async (req, res) => {
  const prefs = req.body || {};
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { preferences: { ...prefs } } },
    { new: true }
  );
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user.preferences || {} });
};


