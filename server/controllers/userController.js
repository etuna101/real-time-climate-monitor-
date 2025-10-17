const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, profile } = req.body;
    const update = {};
    if (name) update.name = name;
    if (profile) update.profile = profile;
    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { $set: { preferences } }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user.preferences });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Minimal notifications stored on user doc for now
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    const notifications = user?.notifications || [];
    res.status(200).json({ success: true, data: notifications });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const { title, body } = req.body;
    const doc = await User.findByIdAndUpdate(
      req.userId,
      { $push: { notifications: { title, body, createdAt: new Date(), read: false } } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(201).json({ success: true, data: doc.notifications.slice(-1)[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { idx } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!Array.isArray(user.notifications) || !user.notifications[idx]) return res.status(404).json({ success: false, message: 'Notification not found' });
    user.notifications[idx].read = true;
    await user.save();
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


