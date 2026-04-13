const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get full candidate profile analysis
router.get('/:username', candidateController.getCandidate);

// Trigger deep AI analysis for a candidate
router.post('/:username/analyze', candidateController.analyzeCandidate);

module.exports = router;
