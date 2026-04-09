const supabase = require('../config/database');
const GitHubService = require('../services/githubService');
const MatchService = require('../services/matchService');

class RecommendationController {
  constructor() {
    this.matchService = new MatchService();

    // Bind methods to ensure correct 'this' context
    this.getRecommendations = this.getRecommendations.bind(this);
    this.searchRepositories = this.searchRepositories.bind(this);
  }

  async getRecommendations(req, res) {
    try {
      const userId = req.user.userId;
      const {
        difficulty,
        language,
        minStars,
        maxStars,
        domain,
        limit = 30,
        refresh = false
      } = req.query;

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if filters are applied
      const hasFilters = language || minStars || maxStars || domain || difficulty;

      // Only use cache if no filters and not forcing refresh
      if (!refresh && !hasFilters) {
        console.log('[RecommendationController] Checking cache for user:', userId);
        const { data: cachedRecommendations } = await supabase
          .from('user_recommendations')
          .select('*')
          .eq('user_id', userId)
          .gt('expires_at', new Date().toISOString())
          .order('match_score', { ascending: false })
          .limit(parseInt(limit));

        if (cachedRecommendations && cachedRecommendations.length > 0) {
          console.log(`[RecommendationController] Returning ${cachedRecommendations.length} cached recommendations`);
          return res.json({
            recommendations: cachedRecommendations.map(r => ({
              ...r.recommendation_data,
              matchScore: r.match_score,
              cachedAt: r.created_at
            })),
            cached: true
          });
        }
      } else if (hasFilters) {
        console.log('[RecommendationController] Filters detected, skipping cache:', { language, minStars, maxStars, domain, difficulty });
      }

      const userProfile = user.profile_data;

      if (!userProfile || !userProfile.techStack) {
        return res.status(400).json({
          error: 'Profile not analyzed yet. Please visit /profile/summary first.'
        });
      }

      const githubService = new GitHubService(user.github_access_token);

      const searchFilters = {
        language: language || (userProfile.techStack[0]?.language),
        minStars: minStars ? parseInt(minStars) : 100,
        goodFirstIssue: difficulty === 'beginner',
        helpWanted: true,
        limit: 100
      };

      console.log('[RecommendationController] Searching for repositories with filters:', searchFilters);
      const candidateRepos = await githubService.searchRepositories('', searchFilters);
      console.log(`[RecommendationController] Found ${candidateRepos.length} candidate repositories`);

      let filteredRepos = candidateRepos;

      if (difficulty) {
        filteredRepos = this.matchService.filterByDifficulty(filteredRepos, difficulty);
      }

      filteredRepos = this.matchService.filterByActivity(filteredRepos, 90);
      filteredRepos = this.matchService.filterByContributorFriendliness(filteredRepos);

      if (maxStars) {
        const before = filteredRepos.length;
        filteredRepos = filteredRepos.filter(r => r.stargazers_count <= parseInt(maxStars));
        console.log(`[RecommendationController] Filtered by maxStars (${maxStars}): ${before} -> ${filteredRepos.length}`);
      }

      if (domain) {
        const before = filteredRepos.length;
        filteredRepos = filteredRepos.filter(r => {
          const topics = (r.topics || []).map(t => t.toLowerCase());
          const description = (r.description || '').toLowerCase();
          return topics.includes(domain.toLowerCase()) || description.includes(domain.toLowerCase());
        });
        console.log(`[RecommendationController] Filtered by domain (${domain}): ${before} -> ${filteredRepos.length}`);
      }

      const recommendations = await this.matchService.generateRecommendations(
        userProfile,
        filteredRepos,
        { limit: parseInt(limit) }
      );

      const recommendationsToCache = recommendations.slice(0, 50).map(repo => ({
        user_id: userId,
        repo_full_name: repo.full_name,
        match_score: repo.matchScore,
        recommendation_data: repo,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }));

      if (recommendationsToCache.length > 0) {
        await supabase
          .from('user_recommendations')
          .delete()
          .eq('user_id', userId);

        await supabase
          .from('user_recommendations')
          .insert(recommendationsToCache);
      }

      res.json({
        recommendations: recommendations.map(r => ({
          id: r.id,
          name: r.name,
          fullName: r.full_name,
          description: r.description,
          language: r.language,
          stargazersCount: r.stargazers_count,
          forksCount: r.forks_count,
          openIssuesCount: r.open_issues_count,
          topics: r.topics,
          htmlUrl: r.html_url,
          matchScore: r.matchScore,
          scoreBreakdown: r.scoreBreakdown,
          updatedAt: r.updated_at
        })),
        cached: false
      });
    } catch (error) {
      console.error('Recommendations error:', error.message);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  }

  async searchRepositories(req, res) {
    try {
      const userId = req.user.userId;
      const {
        query,
        language,
        topics,
        minStars,
        sort,
        limit = 30
      } = req.query;

      console.log('[SearchController] Search request:', { userId, query, language, topics, minStars, sort, limit });

      const { data: user, error } = await supabase
        .from('users')
        .select('github_access_token')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[SearchController] Supabase error:', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const githubService = new GitHubService(user.github_access_token);

      const filters = {
        language,
        topics: topics ? topics.split(',') : undefined,
        minStars: minStars ? parseInt(minStars) : undefined,
        sort,
        limit: parseInt(limit)
      };

      console.log('[SearchController] Searching GitHub with query:', query, 'filters:', filters);
      const repos = await githubService.searchRepositories(query, filters);
      console.log(`[SearchController] Found ${repos.length} repositories`);

      res.json({
        repositories: repos.map(r => ({
          id: r.id,
          name: r.name,
          fullName: r.full_name,
          description: r.description,
          language: r.language,
          stargazersCount: r.stargazers_count,
          forksCount: r.forks_count,
          openIssuesCount: r.open_issues_count,
          topics: r.topics,
          htmlUrl: r.html_url,
          owner: r.owner,
          updatedAt: r.updated_at
        }))
      });
    } catch (error) {
      console.error('[SearchController] Search error:', error);
      res.status(500).json({ error: 'Failed to search repositories' });
    }
  }
}

module.exports = new RecommendationController();
