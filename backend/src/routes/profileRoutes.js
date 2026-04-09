const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticateToken, profileController.getProfileSummary);
router.get('/repos', authenticateToken, profileController.getUserRepos);
router.get('/stats', authenticateToken, profileController.getUserStats);
router.get('/contributions', authenticateToken, profileController.getUserContributionHistory);
router.get('/techstack', authenticateToken, profileController.getUserTechStack);
router.put('/techstack', authenticateToken, profileController.updateUserTechStack);

module.exports = router;
