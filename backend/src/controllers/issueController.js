// controllers/issueController.js
const supabase = require('../config/database');
const GitHubService = require('../services/githubService');
const IssueService = require('../services/issueService');
const MatchService = require('../services/matchService');

class IssueController {
    constructor() {
        this.issueService = new IssueService();
        this.matchService = new MatchService();
        this.getRecommendedIssues = this.getRecommendedIssues.bind(this);
    }

    async getRecommendedIssues(req, res) {
        try {
            const userId = req.user.userId;
            const {
                difficulty = 'all',
                language,
                labels,
                limit = 30,
                refresh = false
            } = req.query;

            console.log('[IssueController] Fetching issues for user:', userId);

            const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
            if (!user) return res.status(404).json({ error: 'User not found' });

            const userProfile = user.profile_data;
            if (!userProfile || !userProfile.techStack) {
                return res.status(400).json({ error: 'Profile not analyzed. Visit /profile/summary first.' });
            }

            const githubService = new GitHubService(user.github_access_token);
            const searchFilters = {
                language: language || userProfile.techStack[0]?.language,
                minStars: 100,
                goodFirstIssue: difficulty === 'beginner',
                helpWanted: true,
                limit: 50
            };

            const candidateRepos = await githubService.searchRepositories('', searchFilters);
            let filteredRepos = this.matchService.filterByActivity(candidateRepos, 90);
            filteredRepos = this.matchService.filterByContributorFriendliness(filteredRepos);

            const labelArray = labels ? labels.split(',') : [];
            const recommendedIssues = await this.issueService.getRecommendedIssues(
                userProfile,
                filteredRepos,
                githubService,
                { difficulty, language, labels: labelArray, limit: parseInt(limit) }
            );

            res.json({
                issues: recommendedIssues.map(issue => ({
                    id: issue.id,
                    number: issue.number,
                    title: issue.title,
                    body: issue.body,
                    state: issue.state,
                    labels: issue.labels,
                    createdAt: issue.created_at,
                    updatedAt: issue.updated_at,
                    comments: issue.comments,
                    htmlUrl: issue.html_url,
                    repository: issue.repository,
                    matchScore: issue.matchScore,
                    scoreBreakdown: issue.scoreBreakdown,
                    user: { login: issue.user.login, avatar_url: issue.user.avatar_url }
                })),
                cached: false,
                total: recommendedIssues.length
            });
        } catch (error) {
            console.error('[IssueController] Error:', error);
            res.status(500).json({ error: 'Failed to get issues', details: error.message });
        }
    }
}

module.exports = new IssueController();
