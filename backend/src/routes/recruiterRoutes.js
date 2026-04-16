const express = require('express');
const recruiterController = require('../controllers/recruiterController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All recruiter routes require both authentication and the 'recruiter' role
router.use(authenticateToken);
router.use(authorizeRole('recruiter'));

// Discovery
router.get('/search', recruiterController.searchCandidates);
router.post('/search/enrich/batch', recruiterController.enrichBatch);

// Evaluation
router.get('/profile/:username', recruiterController.getProfile);
router.get('/reports/:username', recruiterController.getReport);

// Shortlisting
router.get('/shortlist', recruiterController.getShortlist);
router.post('/shortlist', recruiterController.addToShortlist);
router.delete('/shortlist/:username', recruiterController.removeFromShortlist);

module.exports = router;
