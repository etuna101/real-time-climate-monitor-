const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireRole } = require('../utils/authMiddleware');

// All admin routes require auth and admin role
router.use(requireAuth, requireRole(['admin']));

// List users with basic filters
router.get('/users', async (req, res) => {
  try {
    const { tier, country, q } = req.query;
    const filter = {};
    if (tier) filter['subscription.tier'] = tier;
    if (country) filter['profile.country'] = country;
    if (q) filter.$or = [ { email: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') } ];
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(200).lean();
    res.status(200).json({ success: true, data: users });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user role/subscription
router.post('/users/:id', async (req, res) => {
  try {
    const { role, subscription } = req.body;
    const update = {};
    if (role) update.role = role;
    if (subscription) update.subscription = subscription;
    const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


