// controllers/savedController.js
const supabase = require('../config/database');

class SavedController {
  constructor() {
    // Bind methods to ensure correct 'this' context
    this.addSavedRepository = this.addSavedRepository.bind(this);
    this.removeSavedRepository = this.removeSavedRepository.bind(this);
    this.listSavedRepositories = this.listSavedRepositories.bind(this);
    this.updateSavedRepository = this.updateSavedRepository.bind(this);
  }

  async addSavedRepository(req, res) {
    try {
      const userId = req.user.userId;
      const { repoFullName, repoData, matchScore, notes } = req.body;

      console.log('[SavedController] Adding repository:', { userId, repoFullName });

      if (!repoFullName) {
        return res.status(400).json({ error: 'Repository full name is required' });
      }

      const { data: existingSave, error: checkError } = await supabase
        .from('saved_repositories')
        .select('id')
        .eq('user_id', userId)
        .eq('repo_full_name', repoFullName)
        .maybeSingle();

      if (checkError) {
        console.error('[SavedController] Error checking existing save:', checkError);
        return res.status(500).json({ error: 'Failed to check existing repository' });
      }

      if (existingSave) {
        console.log('[SavedController] Repository already saved');
        return res.status(400).json({ error: 'Repository already saved' });
      }

      const { data: savedRepo, error } = await supabase
        .from('saved_repositories')
        .insert({
          user_id: userId,
          repo_full_name: repoFullName,
          repo_data: repoData || {},
          match_score: matchScore || 0,
          notes: notes || ''
        })
        .select()
        .single();

      if (error) {
        console.error('[SavedController] Error saving repository:', error);
        throw error;
      }

      console.log('[SavedController] Repository saved successfully');
      res.status(201).json({
        message: 'Repository saved successfully',
        savedRepository: savedRepo
      });
    } catch (error) {
      console.error('[SavedController] Add saved repository error:', error);
      res.status(500).json({ error: 'Failed to save repository' });
    }
  }

  async removeSavedRepository(req, res) {
    try {
      const userId = req.user.userId;
      const { repoFullName } = req.body;

      console.log('[SavedController] Removing repository:', { userId, repoFullName });

      if (!repoFullName) {
        return res.status(400).json({ error: 'Repository full name is required' });
      }

      const { error } = await supabase
        .from('saved_repositories')
        .delete()
        .eq('user_id', userId)
        .eq('repo_full_name', repoFullName);

      if (error) {
        console.error('[SavedController] Error removing repository:', error);
        throw error;
      }

      console.log('[SavedController] Repository removed successfully');
      res.json({ message: 'Repository removed successfully' });
    } catch (error) {
      console.error('[SavedController] Remove saved repository error:', error);
      res.status(500).json({ error: 'Failed to remove repository' });
    }
  }

  async listSavedRepositories(req, res) {
    try {
      const userId = req.user.userId;
      const { sortBy = 'created_at', order = 'desc', limit = 50 } = req.query;

      console.log('[SavedController] Listing saved repositories:', { userId, sortBy, order, limit });

      const validSortFields = ['created_at', 'match_score', 'repo_full_name'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';

      const { data: savedRepos, error } = await supabase
        .from('saved_repositories')
        .select('*')
        .eq('user_id', userId)
        .order(sortField, { ascending: order === 'asc' })
        .limit(parseInt(limit));

      if (error) {
        console.error('[SavedController] Error listing saved repositories:', error);
        throw error;
      }

      console.log(`[SavedController] Found ${savedRepos.length} saved repositories`);

      // Transform the saved repos to have actual repo data
      const repositories = savedRepos.map(repo => ({
        ...repo.repo_data, // Spread the actual GitHub repo data
        id: repo.repo_data?.id || repo.id,
        savedId: repo.id, // Keep the saved record ID
        matchScore: repo.match_score,
        notes: repo.notes,
        savedAt: repo.created_at,
        // Ensure these fields from repo_data if available
        name: repo.repo_data?.name,
        fullName: repo.repo_data?.fullName || repo.repo_data?.full_name || repo.repo_full_name,
        full_name: repo.repo_data?.full_name || repo.repo_full_name,
        description: repo.repo_data?.description,
        language: repo.repo_data?.language,
        stargazersCount: repo.repo_data?.stargazersCount || repo.repo_data?.stargazers_count,
        stargazers_count: repo.repo_data?.stargazers_count || repo.repo_data?.stargazersCount,
        forksCount: repo.repo_data?.forksCount || repo.repo_data?.forks_count,
        forks_count: repo.repo_data?.forks_count || repo.repo_data?.forksCount,
        openIssuesCount: repo.repo_data?.openIssuesCount || repo.repo_data?.open_issues_count,
        open_issues_count: repo.repo_data?.open_issues_count || repo.repo_data?.openIssuesCount,
        topics: repo.repo_data?.topics,
        htmlUrl: repo.repo_data?.htmlUrl || repo.repo_data?.html_url,
        html_url: repo.repo_data?.html_url || repo.repo_data?.htmlUrl,
        owner: repo.repo_data?.owner
      }));

      res.json({
        repositories,  // Changed from savedRepositories to repositories to match frontend expectations
        total: savedRepos.length
      });
    } catch (error) {
      console.error('[SavedController] List saved repositories error:', error);
      res.status(500).json({ error: 'Failed to fetch saved repositories' });
    }
  }

  async updateSavedRepository(req, res) {
    try {
      const userId = req.user.userId;
      const { repoFullName, notes } = req.body;

      console.log('[SavedController] Updating repository notes:', { userId, repoFullName });

      if (!repoFullName) {
        return res.status(400).json({ error: 'Repository full name is required' });
      }

      const { data: updatedRepo, error } = await supabase
        .from('saved_repositories')
        .update({ notes: notes || '' })
        .eq('user_id', userId)
        .eq('repo_full_name', repoFullName)
        .select()
        .single();

      if (error) {
        console.error('[SavedController] Error updating repository:', error);
        throw error;
      }

      console.log('[SavedController] Repository updated successfully');
      res.json({
        message: 'Repository updated successfully',
        savedRepository: updatedRepo
      });
    } catch (error) {
      console.error('[SavedController] Update saved repository error:', error);
      res.status(500).json({ error: 'Failed to update repository' });
    }
  }
}

module.exports = new SavedController();
