const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isDbReady } = require('../utils/db');
const memory = require('../utils/memoryStore');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_TTL_SECONDS = 60 * 60 * 8;

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

function userId(user) {
  return user.id || user._id?.toString();
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const emailNorm = email.toLowerCase();
    let user;
    if (isDbReady()) {
      user = await User.findOne({ email: emailNorm });
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      if (user.passwordHash) {
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      user = memory.findUserByEmail(emailNorm);
      if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
      user = memory.publicUser(user);
    }

    const token = signToken({ sub: userId(user), email: user.email });
    res.status(200).json({ success: true, data: { token, user } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const emailNorm = email.toLowerCase();

    if (isDbReady()) {
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
      const token = signToken({ sub: userId(user), email: user.email });
      return res.status(201).json({ success: true, data: { token, user } });
    }

    if (memory.findUserByEmail(emailNorm)) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const created = memory.createUserRecord({
      email: emailNorm,
      name: name || emailNorm.split('@')[0],
      passwordHash,
    });
    const token = signToken({ sub: created.id, email: created.email });
    res.status(201).json({ success: true, data: { token, user: memory.publicUser(created) } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  if (isDbReady()) {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  }
  const user = memory.publicUser(memory.findUserById(req.userId));
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
};

exports.getPreferences = async (req, res) => {
  if (isDbReady()) {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user.preferences || {} });
  }
  const user = memory.findUserById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user.preferences || {} });
};

exports.savePreferences = async (req, res) => {
  const prefs = req.body || {};
  if (isDbReady()) {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { preferences: { ...prefs } } },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user.preferences || {} });
  }
  const user = memory.updateUser(req.userId, { preferences: prefs });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user.preferences || {} });
};
