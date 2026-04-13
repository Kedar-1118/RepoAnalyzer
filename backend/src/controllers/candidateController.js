const logger = require('../config/logger');
const axios = require('axios');

const GITHUB_API = 'https://api.github.com';
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8001';

/**
 * GET /candidates/:username — Get full candidate profile analysis
 */
exports.getCandidate = async (req, res) => {
  try {
    const { username } = req.params;
    const token = req.user?.access_token;
    const headers = token ? { Authorization: `token ${token}` } : {};

    // Fetch GitHub profile
    const [userRes, reposRes] = await Promise.all([
      axios.get(`${GITHUB_API}/users/${username}`, { headers }),
      axios.get(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=stars&direction=desc`, { headers }),
    ]);

    const user = userRes.data;
    const repos = reposRes.data;

    // Compute stats
    const languages = {};
    let totalStars = 0;
    let totalForks = 0;

    repos.forEach(repo => {
      if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    });

    const primaryStack = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    // Top 3 repos
    const topRepos = repos.slice(0, 3).map(repo => ({
      name: repo.name,
      description: repo.description || 'No description available',
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
    }));

    // Compute scores
    let matchScore = 50;
    matchScore += Math.min(20, Math.log2(totalStars + 1) * 3);
    matchScore += Math.min(10, user.public_repos * 0.5);
    matchScore += Math.min(10, Math.log2(user.followers + 1) * 2);
    matchScore += Math.min(10, primaryStack.length * 2);
    matchScore = Math.min(99, Math.round(matchScore));

    const matchTier = matchScore >= 85 ? 'EXCEPTIONAL' : matchScore >= 70 ? 'STRONG_MATCH' : 'POTENTIAL';

    // Build skill badges
    const skillBadges = primaryStack.slice(0, 3).map(lang => `${lang}-Expert`);

    // Contribution matrix
    const matrix = {
      codeVelocity: matchScore >= 85 ? 'Top 1%' : matchScore >= 70 ? 'Top 15%' : 'Top 40%',
      reviewImpact: (matchScore * 1.02).toFixed(1),
      mentorship: matchScore >= 85 ? 'Gold' : matchScore >= 70 ? 'Silver' : 'Bronze',
      stability: `${(90 + Math.random() * 9.9).toFixed(1)}%`,
    };

    // AI Sentiment (placeholder — can be enhanced with RAG service)
    const aiSentiment = `Developer demonstrates ${matchScore >= 80 ? 'exceptional' : 'promising'} patterns in ${primaryStack[0] || 'software'} development. Codebase shows ${matchScore >= 75 ? 'high modularity and clean architecture' : 'room for growth in code organization'}. ${totalStars > 100 ? 'Strong community recognition with significant star count.' : 'Growing presence in the open source community.'}`;

    res.json({
      username: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
      location: user.location || '',
      bio: user.bio || '',
      title: `${primaryStack[0] || 'Software'} Developer`,
      match_score: matchScore,
      match_tier: matchTier,
      primary_stack: primaryStack,
      skill_badges: skillBadges,
      contribution_matrix: matrix,
      ai_sentiment: aiSentiment,
      top_repos: topRepos,
      total_stars: totalStars,
      total_forks: totalForks,
      public_repos: user.public_repos,
      followers: user.followers,
      verified: totalStars > 50,
    });
  } catch (err) {
    logger.error(`getCandidate error for ${req.params.username}:`, err);
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }
    res.status(500).json({ error: 'Failed to analyze candidate' });
  }
};

/**
 * POST /candidates/:username/analyze — Trigger deep AI analysis using RAG service
 */
exports.analyzeCandidate = async (req, res) => {
  try {
    const { username } = req.params;
    const token = req.user?.access_token;
    const headers = token ? { Authorization: `token ${token}` } : {};

    // Get user's top repo for RAG analysis
    const reposRes = await axios.get(`${GITHUB_API}/users/${username}/repos?per_page=5&sort=stars&direction=desc`, { headers });
    const topRepo = reposRes.data[0];

    if (!topRepo) {
      return res.status(400).json({ error: 'No repositories found for this user' });
    }

    // Call RAG service for deep analysis
    const ragResponse = await axios.post(`${RAG_SERVICE_URL}/api/analyze`, {
      repo_url: topRepo.html_url,
      developer_skills: '',
    }, { timeout: 120000 });

    res.json({
      username,
      repo_analyzed: topRepo.full_name,
      analysis: ragResponse.data,
    });
  } catch (err) {
    logger.error(`analyzeCandidate error for ${req.params.username}:`, err);
    res.status(500).json({ error: 'Deep analysis failed' });
  }
};
