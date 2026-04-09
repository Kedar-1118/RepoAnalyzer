const axios = require('axios');
const logger = require('../config/logger');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8001';

/**
 * Proxy a full RAG deep-analysis request to the Python microservice.
 * POST /analyze/repo
 * Body: { repo_url: string, developer_skills?: string }
 */
const analyzeRepo = async (req, res) => {
    try {
        const { repo_url, developer_skills } = req.body;

        if (!repo_url) {
            return res.status(400).json({ error: 'repo_url is required' });
        }

        logger.info(`[Analyze] Starting deep analysis for: ${repo_url}`);

        const response = await axios.post(
            `${RAG_SERVICE_URL}/api/analyze`,
            {
                repo_url,
                developer_skills: developer_skills || '',
            },
            {
                timeout: 300000, // 5 minute timeout — RAG pipeline can take a while
                headers: { 'Content-Type': 'application/json' },
            }
        );

        logger.info(`[Analyze] Deep analysis complete for: ${repo_url}`);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            // The Python service returned an error
            logger.error('[Analyze] RAG service error:', {
                status: error.response.status,
                data: error.response.data,
            });
            return res.status(error.response.status).json({
                error: 'RAG analysis failed',
                detail: error.response.data?.detail || error.response.data,
            });
        }

        if (error.code === 'ECONNREFUSED') {
            logger.error('[Analyze] RAG service is not running');
            return res.status(503).json({
                error: 'RAG service unavailable',
                detail: `Cannot connect to RAG service at ${RAG_SERVICE_URL}. Make sure the Python RAG microservice is running.`,
            });
        }

        logger.error('[Analyze] Unexpected error:', { error: error.message });
        res.status(500).json({ error: 'Internal server error', detail: error.message });
    }
};

/**
 * Proxy health check to the RAG microservice.
 * GET /analyze/health
 */
const getHealth = async (req, res) => {
    try {
        const response = await axios.get(`${RAG_SERVICE_URL}/api/health`, {
            timeout: 5000,
        });
        res.json({ rag_service: 'connected', ...response.data });
    } catch (error) {
        res.json({
            rag_service: 'disconnected',
            error: error.code === 'ECONNREFUSED'
                ? `Cannot connect to RAG service at ${RAG_SERVICE_URL}`
                : error.message,
        });
    }
};

/**
 * Proxy cache stats request to the RAG microservice.
 * GET /analyze/cache/stats
 */
const getCacheStats = async (req, res) => {
    try {
        const response = await axios.get(`${RAG_SERVICE_URL}/api/cache/stats`, {
            timeout: 5000,
        });
        res.json(response.data);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'RAG service unavailable',
                detail: `Cannot connect to RAG service at ${RAG_SERVICE_URL}`,
            });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    analyzeRepo,
    getHealth,
    getCacheStats,
};
