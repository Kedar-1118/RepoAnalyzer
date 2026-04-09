const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/github', authController.initiateGitHubAuth);
router.get('/callback', authController.handleGitHubCallback);
router.post('/logout', authenticateToken, authController.logout);
router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router;
