const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils/authMiddleware');
const ctrl = require('../controllers/userController');

router.use(requireAuth);

router.get('/profile', ctrl.getProfile);
router.post('/profile', ctrl.updateProfile);
router.post('/settings', ctrl.updateSettings);
router.get('/notifications', ctrl.getNotifications);
router.post('/notifications', ctrl.addNotification);
router.post('/notifications/:idx/read', ctrl.markNotificationRead);

module.exports = router;


