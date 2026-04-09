const express = require('express');
const analyzeController = require('../controllers/analyzeController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Deep analysis via RAG pipeline (authenticated)
router.post('/repo', authenticateToken, analyzeController.analyzeRepo);

// RAG service health check (public — useful for system status page)
router.get('/health', analyzeController.getHealth);

// RAG cache stats (authenticated)
router.get('/cache/stats', authenticateToken, analyzeController.getCacheStats);

module.exports = router;
