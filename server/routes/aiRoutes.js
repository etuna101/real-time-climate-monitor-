const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Get AI insights
router.get('/insights', aiController.getInsights);

// Ask question to AI
router.post('/ask', aiController.askQuestion);

// Generate report
router.post('/generate-report', aiController.generateReport);

// Get correlation between metrics
router.get('/correlation', aiController.getCorrelation);

// Get predictions
router.get('/predictions/:metric', aiController.getPredictions);

module.exports = router;
