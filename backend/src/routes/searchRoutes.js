const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/repos', authenticateToken, recommendationController.searchRepositories);

module.exports = router;
