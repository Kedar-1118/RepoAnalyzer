// routes/issueRoutes.js
const express = require('express');
const issueController = require('../controllers/issueController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get recommended issues
router.get('/recommendations', authenticateToken, issueController.getRecommendedIssues);

module.exports = router;
