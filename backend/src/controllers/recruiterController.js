const GitHubService = require('../services/githubService');
const recruiterService = require('../services/recruiterService');
const pool = require('../config/database');
const logger = require('../config/logger');

// Structure response helper
const buildResponse = (status, data, message, meta = {}) => {
  return { status, data, message, meta };
};

class RecruiterController {
  
  async searchCandidates(req, res) {
    try {
      const { q, language, location, followers, repos, sort, order, limit, page } = req.query;
      const githubService = new GitHubService(req.user.access_token || process.env.GITHUB_TOKEN);

      const filters = {
        language, location, followers, repos,
        sort, order, limit: parseInt(limit) || 20, page: parseInt(page) || 1
      };

      const result = await githubService.searchUsers(q, filters);

      res.status(200).json(buildResponse('success', result.items, 'Successfully fetched basic candidates', {
        pagination: { page: filters.page, limit: filters.limit, total: result.total_count }
      }));
    } catch (error) {
      logger.error('Search Candidates Error:', error.message);
      res.status(500).json(buildResponse('error', null, 'Failed to discover candidates'));
    }
  }

  async enrichBatch(req, res) {
    try {
      const { usernames } = req.body;
      const token = req.user.access_token || process.env.GITHUB_TOKEN;

      if (!Array.isArray(usernames) || usernames.length === 0) {
        return res.status(400).json(buildResponse('error', null, 'Please provide an array of usernames'));
      }

      // Concurrently enrich all candidates using recruiterService
      const enrichmentPromises = usernames.map(async (username) => {
        const enriched = await recruiterService.enrichCandidate(username, token);
        return { username, ...enriched };
      });

      const results = await Promise.allSettled(enrichmentPromises);

      const data = results.map(r => r.status === 'fulfilled' ? r.value : { username: null, degraded: true, error: r.reason?.message });

      res.status(200).json(buildResponse('success', data, 'Batch enrichment processed'));
    } catch (error) {
       logger.error('Batch Enrichment Error:', error.message);
       res.status(500).json(buildResponse('error', null, 'Failed to process batch enrichment'));
    }
  }

  async getProfile(req, res) {
    try {
      const { username } = req.params;
      const token = req.user.access_token || process.env.GITHUB_TOKEN;
      const githubService = new GitHubService(token);

      // Fetch standard info
      const profile = await githubService.getUserProfile(); // Wait, getUserProfile tries to fetch `me`. Needs to fetch 'username'
      const { data: userProfile } = await require('axios').get(`https://api.github.com/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch enriched data explicitly
      const enrichedData = await recruiterService.enrichCandidate(username, token);

      const responseData = {
        basic: userProfile,
        analysis: enrichedData
      };

      const status = enrichedData.degraded ? 'degraded' : 'success';
      const message = enrichedData.degraded ? 'Candidate loaded partially without full AI analysis' : 'Profile analysis full';

      res.status(200).json(buildResponse(status, responseData, message));
    } catch (error) {
      res.status(500).json(buildResponse('error', null, 'Failed to fetch candidate profile'));
    }
  }

  async getShortlist(req, res) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM shortlisted_candidates WHERE recruiter_id = $1 ORDER BY created_at DESC', 
        [req.user.userId]
      );
      res.status(200).json(buildResponse('success', rows, 'Shortlist retrieved successfully'));
    } catch (error) {
      res.status(500).json(buildResponse('error', null, 'Failed to retrieve shortlist'));
    }
  }

  async addToShortlist(req, res) {
    try {
      const { candidate_username, score, skills, repo_count, candidate_data } = req.body;
      const recruiter_id = req.user.userId;

      const query = `
        INSERT INTO shortlisted_candidates (recruiter_id, candidate_username, score, skills, repo_count, candidate_data)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (recruiter_id, candidate_username) DO NOTHING
        RETURNING *
      `;
      
      const { rows } = await pool.query(query, [
        recruiter_id, candidate_username, score || 0, 
        JSON.stringify(skills || []), repo_count || 0, JSON.stringify(candidate_data || {})
      ]);

      if (rows.length === 0) {
        return res.status(409).json(buildResponse('error', null, 'Candidate already in shortlist'));
      }

      res.status(201).json(buildResponse('success', rows[0], 'Added to shortlist'));
    } catch (error) {
      logger.error('Shortlist Addition Error:', error);
      res.status(500).json(buildResponse('error', null, 'Failed to add to shortlist'));
    }
  }

  async removeFromShortlist(req, res) {
    try {
      const recruiter_id = req.user.userId;
      const { username } = req.params;

      await pool.query('DELETE FROM shortlisted_candidates WHERE recruiter_id = $1 AND candidate_username = $2', [recruiter_id, username]);
      res.status(200).json(buildResponse('success', null, 'Removed from shortlist'));
    } catch (error) {
      res.status(500).json(buildResponse('error', null, 'Failed to remove from shortlist'));
    }
  }

  async getReport(req, res) {
    // Acts basically exactly like getProfile but could return PDF buffer or different format.
    // For now we just return formatted JSON explicitly
    this.getProfile(req, res);
  }
}

module.exports = new RecruiterController();
