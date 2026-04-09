// controllers/profileController.js
const supabase = require('../config/database');
const GitHubService = require('../services/githubService');
const AnalysisService = require('../services/analysisService');

class ProfileController {
  constructor() {
    this.analysisService = new AnalysisService();

    // 🔥 bind methods so `this` is always the controller instance
    this.getProfileSummary = this.getProfileSummary.bind(this);
    this.getUserRepos = this.getUserRepos.bind(this);
    this.getUserStats = this.getUserStats.bind(this);
    this.getUserContributionHistory = this.getUserContributionHistory.bind(this);
    this.getUserTechStack = this.getUserTechStack.bind(this);
    this.updateUserTechStack = this.updateUserTechStack.bind(this);
  }

  async getProfileSummary(req, res) {
    try {
      const userId = req.user.userId;

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Supabase error (getProfileSummary):', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const githubService = new GitHubService(
        user.github_access_token,
        user.github_username
      );

      let repos = [];
      let events = [];

      const [reposResult, eventsResult] = await Promise.allSettled([
        githubService.getUserRepositories(),
        githubService.getUserContributionActivity()
      ]);

      if (reposResult.status === 'fulfilled') {
        repos = reposResult.value;
        console.log(`[ProfileController] Successfully fetched ${repos.length} repositories`);
      } else {
        console.warn('[ProfileController] Could not fetch repos:', reposResult.reason?.message);
      }

      if (eventsResult.status === 'fulfilled') {
        events = eventsResult.value;
        console.log(`[ProfileController] Successfully fetched ${events.length} events`);
      } else {
        console.warn('[ProfileController] Could not fetch user events (non-critical):', eventsResult.reason?.message);
        events = [];
      }

      console.log('[ProfileController] Running profile analysis...');
      // ✅ now `this.analysisService` works
      const analysis = this.analysisService.analyzeUserProfile(repos, events);
      console.log('[ProfileController] Analysis completed:', {
        totalRepos: analysis.totalRepos,
        techStackCount: analysis.techStack?.length,
        domainsCount: analysis.domains?.length
      });

      const { error: updateError } = await supabase
        .from('users')
        .update({
          profile_data: analysis,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Supabase error (update profile_data):', updateError);
      } else {
        console.log('[ProfileController] Profile data saved to database');
      }

      res.json({
        profile: {
          username: user.github_username,
          email: user.github_email,
          avatarUrl: user.avatar_url,
          ...analysis
        }
      });
    } catch (error) {
      console.error('Profile summary error:', error);
      res.status(500).json({ error: 'Failed to fetch profile summary' });
    }
  }

  async getUserRepos(req, res) {
    try {
      const userId = req.user.userId;

      const { data: user, error } = await supabase
        .from('users')
        .select('github_access_token')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Supabase error (getUserRepos):', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const githubService = new GitHubService(user.github_access_token);
      const repos = await githubService.getUserRepositories();

      res.json({ repositories: repos });
    } catch (error) {
      console.error('Fetch repos error:', error.message);
      res.status(500).json({ error: 'Failed to fetch repositories' });
    }
  }

  async getUserStats(req, res) {
    try {
      const userId = req.user.userId;

      const { data: user, error } = await supabase
        .from('users')
        .select('profile_data')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Supabase error (getUserStats):', error);
        return res.status(500).json({ error: 'Failed to fetch user stats' });
      }

      if (!user || !user.profile_data) {
        return res.status(404).json({
          error: 'Profile data not found. Please refresh your profile.'
        });
      }

      res.json({ stats: user.profile_data });
    } catch (error) {
      console.error('Fetch stats error:', error.message);
      res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
  }

  async getUserContributionHistory(req, res) {
    try {
      const userId = req.user.userId;

      console.log('[ProfileController] Fetching contribution history for user:', userId);

      const { data: user, error } = await supabase
        .from('users')
        .select('github_access_token, github_username')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[ProfileController] Supabase error:', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const githubService = new GitHubService(user.github_access_token, user.github_username);

      // Use GraphQL API to get accurate contribution calendar
      const { totalContributions, contributionsByDate } = await githubService.getContributionCalendar();

      console.log(`[ProfileController] Fetched ${totalContributions} total contributions via GraphQL`);

      res.json({
        contributions: contributionsByDate,
        totalDays: Object.keys(contributionsByDate).length,
        totalContributions
      });
    } catch (error) {
      console.error('[ProfileController] Contribution history error:', error);
      res.status(500).json({ error: 'Failed to fetch contribution history' });
    }
  }

  processContributionEvents(events) {
    const contributions = {};
    const today = new Date();

    // Initialize last 365 days with 0 contributions
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      contributions[dateStr] = 0;
    }

    // Count contributions from events
    events.forEach(event => {
      const eventDate = new Date(event.created_at);
      const dateStr = eventDate.toISOString().split('T')[0];

      // Only count relevant contribution events
      const contributionEvents = [
        'PushEvent',
        'PullRequestEvent',
        'IssuesEvent',
        'IssueCommentEvent',
        'PullRequestReviewEvent',
        'PullRequestReviewCommentEvent',
        'CreateEvent',
        'CommitCommentEvent'
      ];

      if (contributionEvents.includes(event.type) && contributions.hasOwnProperty(dateStr)) {
        // Count commits in PushEvent
        if (event.type === 'PushEvent' && event.payload?.commits) {
          contributions[dateStr] += event.payload.commits.length;
        } else {
          contributions[dateStr] += 1;
        }
      }
    });

    return contributions;
  }

  async getUserTechStack(req, res) {
    try {
      const userId = req.user.userId;

      console.log('[ProfileController] Fetching tech stack for user:', userId);

      const { data: user, error } = await supabase
        .from('users')
        .select('profile_data, user_techstack')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[ProfileController] Supabase error:', error);
        return res.status(500).json({ error: 'Failed to fetch user tech stack' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Combine GitHub-detected tech stack with custom tech stack
      const githubTechStack = user.profile_data?.techStack || [];
      const customTechStack = user.user_techstack?.customTech || [];

      res.json({
        githubDetected: githubTechStack,
        customTechnologies: customTechStack,
        combined: [...githubTechStack, ...customTechStack.map(tech => ({
          language: tech.name,
          proficiency: tech.proficiency,
          category: tech.category,
          isCustom: true
        }))]
      });
    } catch (error) {
      console.error('[ProfileController] Tech stack fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch tech stack' });
    }
  }

  async updateUserTechStack(req, res) {
    try {
      const userId = req.user.userId;
      const { customTech } = req.body;

      console.log('[ProfileController] Updating tech stack for user:', userId);

      // Validate input
      if (!Array.isArray(customTech)) {
        return res.status(400).json({ error: 'customTech must be an array' });
      }

      // Validate each tech entry
      for (const tech of customTech) {
        if (!tech.name || typeof tech.name !== 'string') {
          return res.status(400).json({ error: 'Each technology must have a name' });
        }
        if (!tech.proficiency || !['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(tech.proficiency)) {
          return res.status(400).json({ error: 'Invalid proficiency level' });
        }
        if (!tech.category || typeof tech.category !== 'string') {
          return res.status(400).json({ error: 'Each technology must have a category' });
        }
      }

      // Update user tech stack
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          user_techstack: { customTech },
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('user_techstack')
        .single();

      if (error) {
        console.error('[ProfileController] Supabase error:', error);
        return res.status(500).json({ error: 'Failed to update tech stack' });
      }

      console.log('[ProfileController] Tech stack updated successfully');

      res.json({
        message: 'Tech stack updated successfully',
        customTechnologies: updatedUser.user_techstack.customTech
      });
    } catch (error) {
      console.error('[ProfileController] Tech stack update error:', error);
      res.status(500).json({ error: 'Failed to update tech stack' });
    }
  }
}

module.exports = new ProfileController();
