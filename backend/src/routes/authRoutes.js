const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/github', authController.initiateGitHubAuth);
router.get('/callback', authController.handleGitHubCallback);
// Logout does NOT require authentication — the cookie might already be expired.
// The endpoint simply clears the cookie regardless.
router.post('/logout', authController.logout);
router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router;
