// services/issueService.js
const GitHubService = require('./githubService');
const AnalysisService = require('./analysisService');

/**
 * IssueService
 * - Fetches issues from repositories
 * - Scores issues based on user profile and difficulty
 * - Provides intelligent issue recommendations
 */
class IssueService {
    constructor() {
        this.analysisService = new AnalysisService();
    }

    /**
     * Fetch and recommend issues based on user profile and preferences
     * @param {Object} userProfile - User's analyzed profile
     * @param {Array} repositories - Array of repository objects
     * @param {Object} githubService - GitHubService instance with user's token
     * @param {Object} options - Filtering options
     * @returns {Array} Scored and sorted issues
     */
    async getRecommendedIssues(userProfile, repositories, githubService, options = {}) {
        try {
            const {
                difficulty = 'all',
                language = null,
                labels = [],
                limit = 50,
                includeLabels = ['good first issue', 'help wanted', 'bug', 'enhancement']
            } = options;

            console.log(`[IssueService] Fetching issues from ${repositories.length} repositories`);

            // Fetch issues from repositories in parallel
            const issuePromises = repositories.slice(0, 20).map(async (repo) => {
                try {
                    const [owner, name] = repo.full_name.split('/');

                    // Fetch issues with labels
                    const labelFilter = includeLabels.join(',');
                    const issues = await githubService.getRepositoryIssues(owner, name, labelFilter);

                    // Attach repository metadata to each issue
                    return issues.map(issue => ({
                        ...issue,
                        repository: {
                            name: repo.name,
                            full_name: repo.full_name,
                            language: repo.language,
                            stargazers_count: repo.stargazers_count,
                            html_url: repo.html_url,
                            description: repo.description
                        }
                    }));
                } catch (error) {
                    console.error(`[IssueService] Error fetching issues from ${repo.full_name}:`, error.message);
                    return [];
                }
            });

            const issueArrays = await Promise.all(issuePromises);
            let allIssues = issueArrays.flat();

            console.log(`[IssueService] Fetched ${allIssues.length} total issues`);

            // Filter by language if specified
            if (language) {
                allIssues = allIssues.filter(issue =>
                    issue.repository.language?.toLowerCase() === language.toLowerCase()
                );
            }

            // Filter by specific labels if provided
            if (labels.length > 0) {
                allIssues = allIssues.filter(issue => {
                    const issueLabels = issue.labels.map(l => l.name.toLowerCase());
                    return labels.some(label => issueLabels.includes(label.toLowerCase()));
                });
            }

            // Filter by difficulty
            if (difficulty !== 'all') {
                allIssues = this.filterByDifficulty(allIssues, difficulty);
            }

            // Score each issue
            const scoredIssues = allIssues.map(issue => {
                const score = this.calculateIssueScore(userProfile, issue);
                return {
                    ...issue,
                    matchScore: score.total,
                    scoreBreakdown: score.breakdown
                };
            });

            // Sort by match score
            scoredIssues.sort((a, b) => b.matchScore - a.matchScore);

            // Return top N issues
            const recommendedIssues = scoredIssues.slice(0, limit);

            console.log(`[IssueService] Returning ${recommendedIssues.length} recommended issues`);
            return recommendedIssues;
        } catch (error) {
            console.error('[IssueService] Error getting recommended issues:', error);
            throw error;
        }
    }

    /**
     * Calculate match score for an issue
     * @param {Object} userProfile - User's profile data
     * @param {Object} issue - Issue object with repository metadata
     * @returns {Object} { total: number, breakdown: object }
     */
    calculateIssueScore(userProfile, issue) {
        try {
            // Language match score
            const languageMatch = this.calculateLanguageMatch(userProfile, issue.repository.language);

            // Difficulty score (easier issues score higher for beginners)
            const difficultyScore = this.calculateDifficultyScore(issue);

            // Engagement score (recent, active issues score higher)
            const engagementScore = this.calculateEngagementScore(issue);

            // Label relevance score
            const labelScore = this.calculateLabelRelevanceScore(issue);

            // Repository popularity (moderate is better than too high or too low)
            const popularityScore = this.calculateRepoPopularityScore(issue.repository);

            const weights = {
                languageMatch: 0.30,
                difficultyScore: 0.25,
                engagementScore: 0.20,
                labelScore: 0.15,
                popularityScore: 0.10
            };

            const total = Math.round(
                (languageMatch * weights.languageMatch) +
                (difficultyScore * weights.difficultyScore) +
                (engagementScore * weights.engagementScore) +
                (labelScore * weights.labelScore) +
                (popularityScore * weights.popularityScore)
            );

            return {
                total,
                breakdown: {
                    languageMatch: Math.round(languageMatch),
                    difficultyScore: Math.round(difficultyScore),
                    engagementScore: Math.round(engagementScore),
                    labelScore: Math.round(labelScore),
                    popularityScore: Math.round(popularityScore)
                }
            };
        } catch (error) {
            console.error('[IssueService] Error calculating issue score:', error);
            return { total: 0, breakdown: {} };
        }
    }

    /**
     * Calculate language match score
     */
    calculateLanguageMatch(userProfile, repoLanguage) {
        if (!userProfile.techStack || userProfile.techStack.length === 0) {
            return 50;
        }

        const userLanguages = userProfile.techStack.map(tech => tech.language.toLowerCase());
        const language = (repoLanguage || '').toLowerCase();

        if (!language) return 30;

        // Primary language match
        if (userLanguages[0] === language) return 100;

        // Top 3 languages
        if (userLanguages.slice(0, 3).includes(language)) return 75;

        // Any known language
        if (userLanguages.includes(language)) return 50;

        return 25;
    }

    /**
     * Calculate difficulty score based on issue labels and metrics
     */
    calculateDifficultyScore(issue) {
        const labels = issue.labels.map(l => l.name.toLowerCase());

        // Good first issue gets highest score
        if (labels.some(l => l.includes('good first issue') || l.includes('good-first-issue'))) {
            return 100;
        }

        // Help wanted is good for beginners
        if (labels.some(l => l.includes('help wanted') || l.includes('help-wanted'))) {
            return 85;
        }

        // Bug fixes are generally approachable
        if (labels.some(l => l.includes('bug'))) {
            return 70;
        }

        // Documentation issues are beginner-friendly
        if (labels.some(l => l.includes('documentation') || l.includes('docs'))) {
            return 80;
        }

        // Enhancement/feature requests vary in difficulty
        if (labels.some(l => l.includes('enhancement') || l.includes('feature'))) {
            return 60;
        }

        return 50;
    }

    /**
     * Calculate engagement score based on issue age and activity
     */
    calculateEngagementScore(issue) {
        const now = new Date();
        const createdAt = new Date(issue.created_at);
        const updatedAt = new Date(issue.updated_at);

        const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);
        const daysSinceUpdate = (now - updatedAt) / (1000 * 60 * 60 * 24);

        let score = 50;

        // Recent issues are better
        if (ageInDays < 7) score += 30;
        else if (ageInDays < 30) score += 20;
        else if (ageInDays < 90) score += 10;
        else if (ageInDays > 180) score -= 20; // Very old issues might be stale

        // Recently updated is good
        if (daysSinceUpdate < 7) score += 20;
        else if (daysSinceUpdate > 60) score -= 10; // Inactive discussions

        // Comment count indicates engagement
        const comments = issue.comments || 0;
        if (comments > 0 && comments < 5) score += 15; // Some discussion but not overwhelming
        else if (comments >= 5 && comments < 15) score += 5;
        else if (comments > 20) score -= 10; // Too much discussion might mean complex

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate label relevance score
     */
    calculateLabelRelevanceScore(issue) {
        const labels = issue.labels.map(l => l.name.toLowerCase());

        const positiveLabels = [
            'good first issue', 'good-first-issue', 'beginner', 'starter',
            'help wanted', 'help-wanted', 'documentation', 'docs',
            'easy', 'low-hanging-fruit'
        ];

        const negativeLabels = [
            'wontfix', 'duplicate', 'invalid', 'blocked',
            'architecture', 'breaking-change', 'security'
        ];

        let score = 50;

        labels.forEach(label => {
            if (positiveLabels.some(pl => label.includes(pl))) {
                score += 15;
            }
            if (negativeLabels.some(nl => label.includes(nl))) {
                score -= 30;
            }
        });

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate repository popularity score
     */
    calculateRepoPopularityScore(repository) {
        const stars = repository.stargazers_count || 0;

        // Sweet spot is 100-10000 stars
        if (stars >= 100 && stars <= 1000) return 100;
        if (stars > 1000 && stars <= 5000) return 90;
        if (stars > 5000 && stars <= 10000) return 80;
        if (stars > 10000 && stars <= 50000) return 70;
        if (stars < 100 && stars >= 50) return 70;
        if (stars < 50) return 50;
        return 60; // Very popular repos might be harder to contribute to
    }

    /**
     * Filter issues by difficulty level
     */
    filterByDifficulty(issues, difficulty) {
        return issues.filter(issue => {
            const labels = issue.labels.map(l => l.name.toLowerCase());

            if (difficulty === 'beginner') {
                return labels.some(l =>
                    l.includes('good first issue') ||
                    l.includes('good-first-issue') ||
                    l.includes('beginner') ||
                    l.includes('easy') ||
                    l.includes('starter')
                );
            } else if (difficulty === 'intermediate') {
                return !labels.some(l =>
                    l.includes('good first issue') ||
                    l.includes('good-first-issue') ||
                    l.includes('expert') ||
                    l.includes('advanced')
                );
            } else if (difficulty === 'advanced') {
                return labels.some(l =>
                    l.includes('expert') ||
                    l.includes('advanced') ||
                    l.includes('architecture')
                );
            }

            return true;
        });
    }
}

module.exports = IssueService;
