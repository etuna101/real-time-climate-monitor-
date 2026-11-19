const User = require('../models/User');
const { isDbReady } = require('../utils/db');
const memory = require('../utils/memoryStore');

exports.getProfile = async (req, res) => {
  try {
    if (isDbReady()) {
      const user = await User.findById(req.userId).lean();
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, data: user });
    }
    const user = memory.publicUser(memory.findUserById(req.userId));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, profile } = req.body;
    if (isDbReady()) {
      const update = {};
      if (name) update.name = name;
      if (profile) update.profile = profile;
      const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, data: user });
    }
    const user = memory.updateUser(req.userId, { name, profile });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: memory.publicUser(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { preferences } = req.body;
    if (isDbReady()) {
      const user = await User.findByIdAndUpdate(req.userId, { $set: { preferences } }, { new: true });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, data: user.preferences });
    }
    const user = memory.updateUser(req.userId, { preferences });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user.preferences });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    if (isDbReady()) {
      const user = await User.findById(req.userId).lean();
      return res.status(200).json({ success: true, data: user?.notifications || [] });
    }
    const user = memory.findUserById(req.userId);
    res.status(200).json({ success: true, data: user?.notifications || [] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (isDbReady()) {
      const doc = await User.findByIdAndUpdate(
        req.userId,
        { $push: { notifications: { title, body, createdAt: new Date(), read: false } } },
        { new: true }
      );
      if (!doc) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(201).json({ success: true, data: doc.notifications.slice(-1)[0] });
    }
    const user = memory.findUserById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const note = { title, body, createdAt: new Date(), read: false };
    memory.updateUser(req.userId, { notifications: [...(user.notifications || []), note] });
    res.status(201).json({ success: true, data: note });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { idx } = req.params;
    if (isDbReady()) {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (!Array.isArray(user.notifications) || !user.notifications[idx]) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      user.notifications[idx].read = true;
      await user.save();
      return res.status(200).json({ success: true });
    }
    const user = memory.findUserById(req.userId);
    if (!user || !user.notifications?.[idx]) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    const notifications = user.notifications.map((n, i) => (String(i) === String(idx) ? { ...n, read: true } : n));
    memory.updateUser(req.userId, { notifications });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
