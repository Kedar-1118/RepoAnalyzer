// controllers/repositoryController.js
const GitHubService = require('../services/githubService');
const AnalysisService = require('../services/analysisService');
const supabase = require('../config/database');

class RepositoryController {
    constructor() {
        this.analysisService = new AnalysisService();
        this.analyzeRepo = this.analyzeRepo.bind(this);
    }

    /**
     * Analyze a specific repository
     * GET /api/recommendations/:owner/:repo/analyze
     */
    async analyzeRepo(req, res) {
        try {
            const { owner, repo } = req.params;
            const userId = req.user.userId;

            console.log(`[RepositoryController] Analyzing repo: ${owner}/${repo} for user: ${userId}`);

            // Get user's GitHub token
            const { data: user } = await supabase
                .from('users')
                .select('github_access_token')
                .eq('id', userId)
                .single();

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const githubService = new GitHubService(user.github_access_token);

            // Fetch repository details
            const [repoDetails, languages, issues] = await Promise.all([
                githubService.getRepositoryDetails(owner, repo),
                this.fetchLanguages(githubService, owner, repo),
                githubService.getRepositoryIssues(owner, repo, 'good first issue,help wanted')
            ]);

            // Analyze repository
            const analysis = this.analysisService.analyzeRepository(repoDetails);

            // Transform languages for pie chart
            const languageData = Object.entries(languages).map(([name, bytes]) => ({
                name,
                value: bytes
            }));

            // Generate AI insights
            const aiInsights = this.generateAIInsights(repoDetails, analysis, languageData);

            // Get beginner-friendly issues
            const beginnerIssues = issues.slice(0, 5).map(issue => ({
                id: issue.id,
                number: issue.number,
                title: issue.title,
                url: issue.html_url,
                labels: issue.labels.map(l => l.name),
                comments: issue.comments,
                createdAt: issue.created_at
            }));

            res.json({
                repository: {
                    name: repoDetails.name,
                    fullName: repoDetails.full_name,
                    description: repoDetails.description,
                    url: repoDetails.html_url,
                    stars: repoDetails.stargazers_count,
                    forks: repoDetails.forks_count,
                    openIssues: repoDetails.open_issues_count,
                    language: repoDetails.language,
                    topics: repoDetails.topics || [],
                    createdAt: repoDetails.created_at,
                    updatedAt: repoDetails.updated_at,
                },
                languages: languageData,
                analysis: {
                    recencyScore: analysis.recencyScore,
                    popularityScore: analysis.popularityScore,
                    contributorFriendliness: analysis.contributorFriendliness,
                    overallScore: Math.round(analysis.overallScore)
                },
                aiInsights,
                beginnerIssues
            });

        } catch (error) {
            console.error('[RepositoryController] Error analyzing repository:', error);
            res.status(500).json({
                error: 'Failed to analyze repository',
                details: error.message
            });
        }
    }

    /**
     * Fetch language distribution for a repository
     */
    async fetchLanguages(githubService, owner, repo) {
        try {
            const response = await githubService.getRepositoryDetails(owner, repo);
            return response.languages || {};
        } catch (error) {
            console.error(`[RepositoryController] Error fetching languages: ${error.message}`);
            return {};
        }
    }

    /**
     * Generate AI-powered insights about the repository
     */
    generateAIInsights(repo, analysis) {
        const insights = [];

        // Beginner-friendliness insight
        if (analysis.contributorFriendliness > 70) {
            insights.push({
                type: 'beginner-friendly',
                title: 'Great for Beginners',
                description: 'This repository has excellent documentation and actively welcomes new contributors with beginner-friendly issues.'
            });
        } else if (analysis.contributorFriendliness < 40) {
            insights.push({
                type: 'advanced',
                title: 'Advanced Project',
                description: 'This project may require more experience. Consider starting with smaller contributions to familiarize yourself with the codebase.'
            });
        }

        // Activity insight
        if (analysis.recencyScore > 80) {
            insights.push({
                type: 'active',
                title: 'Highly Active',
                description: 'This repository is actively maintained with recent updates, making it a great choice for contributions.'
            });
        } else if (analysis.recencyScore < 40) {
            insights.push({
                type: 'inactive',
                title: 'Less Active',
                description: 'This repository hasn\'t been updated recently. Check if the project is still maintained before contributing.'
            });
        }

        // Popularity insight
        const stars = repo.stargazers_count;
        if (stars > 10000) {
            insights.push({
                type: 'popular',
                title: 'Highly Popular',
                description: `With ${stars.toLocaleString()} stars, this is a well-established project in the community.`
            });
        } else if (stars > 1000) {
            insights.push({
                type: 'growing',
                title: 'Growing Community',
                description: 'This project has a solid community and is gaining traction.'
            });
        }

        // Issue count insight
        if (repo.open_issues_count > 0) {
            insights.push({
                type: 'opportunities',
                title: 'Contribution Opportunities',
                description: `There are ${repo.open_issues_count} open issues. Look for ones labeled "good first issue" or "help wanted".`
            });
        }

        // Language insight
        if (repo.language) {
            insights.push({
                type: 'technology',
                title: `Primary Language: ${repo.language}`,
                description: `This project is primarily written in ${repo.language}. Make sure you're comfortable with this technology.`
            });
        }

        // Generate summary
        const summary = this.generateSummary(repo, analysis);

        return {
            summary,
            insights,
            scores: {
                recency: analysis.recencyScore,
                popularity: analysis.popularityScore,
                beginner_friendly: analysis.contributorFriendliness,
                overall: Math.round(analysis.overallScore)
            }
        };
    }

    /**
     * Generate a natural language summary
     */
    generateSummary(repo, analysis) {
        const friendliness = analysis.contributorFriendliness > 70
            ? 'very welcoming to new contributors'
            : analysis.contributorFriendliness > 40
                ? 'moderately accessible for contributors'
                : 'better suited for experienced developers';

        const activity = analysis.recencyScore > 70
            ? 'actively maintained'
            : analysis.recencyScore > 40
                ? 'occasionally updated'
                : 'not recently updated';

        const popularity = repo.stargazers_count > 5000
            ? 'highly popular'
            : repo.stargazers_count > 1000
                ? 'well-established'
                : 'growing';

        return `${repo.name} is a ${popularity} ${repo.language || 'multi-language'} project that is ${activity}. ` +
            `The repository is ${friendliness}, with ${repo.open_issues_count} open issues available for contribution. ` +
            `Overall, this project scores ${Math.round(analysis.overallScore)}/100 for open-source contribution opportunities.`;
    }
}

module.exports = new RepositoryController();
