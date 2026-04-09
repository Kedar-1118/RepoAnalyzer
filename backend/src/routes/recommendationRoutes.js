const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const repositoryController = require('../controllers/repositoryController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/repos', authenticateToken, recommendationController.getRecommendations);
router.get('/repos/:owner/:repo/analyze', authenticateToken, repositoryController.analyzeRepo);

module.exports = router;
