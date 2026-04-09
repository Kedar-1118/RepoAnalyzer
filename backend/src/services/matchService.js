// services/matchService.js
const AnalysisService = require('./analysisService');

/**
 * MatchService
 * - Calculates match scores between user profiles and repositories
 * - Filters repositories based on difficulty, activity, and contributor-friendliness
 * - Generates personalized repository recommendations
 */
class MatchService {
  constructor() {
    this.analysisService = new AnalysisService();
  }

  /**
   * Generate repository recommendations for a user
   * @param {Object} userProfile - User's analyzed profile with tech stack and domains
   * @param {Array} candidateRepos - Array of repository objects from GitHub
   * @param {Object} options - Options like { limit: 30 }
   * @returns {Array} Sorted array of repos with match scores
   */
  async generateRecommendations(userProfile, candidateRepos, options = {}) {
    try {
      if (!candidateRepos || candidateRepos.length === 0) {
        console.warn('[MatchService] No candidate repositories provided');
        return [];
      }

      if (!userProfile) {
        console.warn('[MatchService] No user profile provided');
        return [];
      }

      console.log(`[MatchService] Scoring ${candidateRepos.length} repositories for recommendations`);

      const scored = candidateRepos.map(repo => {
        const score = this.calculateMatchScore(userProfile, repo);
        return {
          ...repo,
          matchScore: score.total,
          scoreBreakdown: score.breakdown
        };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);

      const limit = options.limit || 30;
      const recommendations = scored.slice(0, limit);

      console.log(`[MatchService] Generated ${recommendations.length} recommendations (top ${limit})`);
      if (recommendations.length > 0) {
        console.log(`[MatchService] Top match: ${recommendations[0].full_name} (score: ${recommendations[0].matchScore})`);
      }

      return recommendations;
    } catch (error) {
      console.error('[MatchService] Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Calculate match score between user profile and a repository
   * @param {Object} userProfile - User's profile data
   * @param {Object} repo - Repository object from GitHub
   * @returns {Object} { total: number, breakdown: object }
   */
  calculateMatchScore(userProfile, repo) {
    try {
      const techMatch = this.calculateTechStackMatch(userProfile, repo);
      const recency = this.analysisService.calculateRecencyScore(repo.updated_at);
      const popularity = this.analysisService.calculatePopularityScore(
        repo.stargazers_count,
        repo.forks_count,
        repo.watchers_count
      );
      const contributorFriendly = this.analysisService.assessContributorFriendliness(repo);
      const domainMatch = this.calculateDomainMatch(userProfile, repo);

      const weights = {
        techMatch: 0.35,
        recency: 0.20,
        popularity: 0.10,
        contributorFriendly: 0.25,
        domainMatch: 0.10
      };

      const total = Math.round(
        (techMatch * weights.techMatch) +
        (recency * weights.recency) +
        (popularity * weights.popularity) +
        (contributorFriendly * weights.contributorFriendly) +
        (domainMatch * weights.domainMatch)
      );

      return {
        total,
        breakdown: {
          techMatch: Math.round(techMatch),
          recency: Math.round(recency),
          popularity: Math.round(popularity),
          contributorFriendly: Math.round(contributorFriendly),
          domainMatch: Math.round(domainMatch)
        }
      };
    } catch (error) {
      console.error('[MatchService] Error calculating match score:', error);
      return { total: 0, breakdown: {} };
    }
  }

  /**
   * Calculate how well a repository's language matches the user's tech stack
   * @param {Object} userProfile - User profile with techStack array
   * @param {Object} repo - Repository object
   * @returns {number} Score from 0-100
   */
  calculateTechStackMatch(userProfile, repo) {
    if (!userProfile.techStack || userProfile.techStack.length === 0) {
      return 50; // Neutral score if no tech stack data
    }

    const userLanguages = userProfile.techStack.map(tech => tech.language.toLowerCase());
    const repoLanguage = (repo.language || '').toLowerCase();

    if (!repoLanguage) {
      return 30; // Lower score for repos without language
    }

    // Primary language match (strongest signal)
    const primaryMatch = userLanguages[0] === repoLanguage;
    if (primaryMatch) {
      return 100;
    }

    // Top 3 languages match
    const secondaryMatch = userLanguages.slice(0, 3).includes(repoLanguage);
    if (secondaryMatch) {
      return 75;
    }

    // Any known language match
    const tertiaryMatch = userLanguages.includes(repoLanguage);
    if (tertiaryMatch) {
      return 50;
    }

    // No match
    return 25;
  }

  /**
   * Calculate domain/topic match between user interests and repository
   * @param {Object} userProfile - User profile with domains array
   * @param {Object} repo - Repository object
   * @returns {number} Score from 0-100
   */
  calculateDomainMatch(userProfile, repo) {
    if (!userProfile.domains || userProfile.domains.length === 0) {
      return 50; // Neutral if no domain data
    }

    const userDomains = userProfile.domains.map(d => d.domain.toLowerCase());
    const repoTopics = (repo.topics || []).map(t => t.toLowerCase());
    const repoDescription = (repo.description || '').toLowerCase();
    const repoName = repo.name.toLowerCase();

    const searchText = `${repoName} ${repoDescription} ${repoTopics.join(' ')}`;

    let matchCount = 0;
    userDomains.forEach(domain => {
      if (searchText.includes(domain)) {
        matchCount++;
      }
    });

    if (matchCount === 0) return 30;
    if (matchCount === 1) return 60;
    if (matchCount === 2) return 80;
    return 100;
  }

  /**
   * Filter repos by difficulty level
   * @param {Array} repos - Array of repositories
   * @param {string} difficulty - 'beginner', 'intermediate', 'expert', or 'all'
   * @returns {Array} Filtered repositories
   */
  filterByDifficulty(repos, difficulty) {
    if (!difficulty || difficulty === 'all') {
      return repos;
    }

    return repos.filter(repo => {
      const stars = repo.stargazers_count;
      const hasGoodFirstIssue = (repo.topics || []).some(t =>
        t.toLowerCase().includes('good-first-issue') ||
        t.toLowerCase().includes('beginner')
      );

      if (difficulty === 'beginner') {
        return stars < 5000 || hasGoodFirstIssue;
      } else if (difficulty === 'intermediate') {
        return stars >= 1000 && stars < 20000;
      } else if (difficulty === 'expert') {
        return stars >= 10000;
      }

      return true;
    });
  }

  /**
   * Filter repos by recent activity
   * @param {Array} repos - Array of repositories
   * @param {number} minActivityDays - Max days since last update
   * @returns {Array} Active repositories
   */
  filterByActivity(repos, minActivityDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - minActivityDays);

    const filtered = repos.filter(repo => {
      const lastUpdate = new Date(repo.updated_at);
      return lastUpdate >= cutoffDate;
    });

    console.log(`[MatchService] Filtered ${repos.length} repos to ${filtered.length} active within ${minActivityDays} days`);
    return filtered;
  }

  /**
   * Filter repos by contributor-friendliness
   * @param {Array} repos - Array of repositories
   * @returns {Array} Contributor-friendly repositories
   */
  filterByContributorFriendliness(repos) {
    const filtered = repos.filter(repo => {
      return repo.has_issues && repo.open_issues_count > 0;
    });

    console.log(`[MatchService] Filtered ${repos.length} repos to ${filtered.length} contributor-friendly repos`);
    return filtered;
  }
}

module.exports = MatchService;
