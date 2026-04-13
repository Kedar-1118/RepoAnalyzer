const express = require('express');
const router = express.Router();
const bulkAnalysisController = require('../controllers/bulkAnalysisController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Start a new batch analysis
router.post('/start', bulkAnalysisController.startBatch);

// Get all batches for the current user
router.get('/batches', bulkAnalysisController.getBatches);

// Get batch detail with candidates
router.get('/batch/:id', bulkAnalysisController.getBatchDetail);

// Export batch results
router.get('/batch/:id/export', bulkAnalysisController.exportBatch);

module.exports = router;
