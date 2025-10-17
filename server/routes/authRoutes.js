const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../utils/authMiddleware');

// Public
router.post('/login', authController.login);
router.post('/register', authController.register);

// Authenticated
router.get('/me', requireAuth, authController.me);
router.get('/preferences', requireAuth, authController.getPreferences);
router.post('/preferences', requireAuth, authController.savePreferences);

module.exports = router;


