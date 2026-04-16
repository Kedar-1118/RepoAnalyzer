import apiClient, { API_URL } from './apiClient';

export const authService = {
    // Initiate GitHub OAuth
    initiateGitHubAuth: async () => {
        try {
            const response = await apiClient.get('/auth/github');
            if (response.data.authUrl) {
                window.location.href = response.data.authUrl;
            }
        } catch (error) {
            console.error('Failed to initiate GitHub auth:', error);
            throw error;
        }
    },

    // Verify token
    verifyToken: async () => {
        const response = await apiClient.get('/auth/verify');
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },
};

export const profileService = {
    // Get profile summary
    getSummary: async () => {
        const response = await apiClient.get('/profile/summary');
        return response.data;
    },

    // Get user repos
    getRepos: async () => {
        const response = await apiClient.get('/profile/repos');
        return response.data;
    },

    // Get user stats
    getStats: async () => {
        const response = await apiClient.get('/profile/stats');
        return response.data;
    },

    // Get contribution history
    getContributions: async () => {
        const response = await apiClient.get('/profile/contributions');
        return response.data;
    },

    // Get user tech stack
    getTechStack: async () => {
        const response = await apiClient.get('/profile/techstack');
        return response.data;
    },

    // Update user tech stack
    updateTechStack: async (customTech) => {
        const response = await apiClient.put('/profile/techstack', { customTech });
        return response.data;
    },
};

export const recommendationService = {
    // Get recommended repositories
    getRecommendations: async (params = {}) => {
        console.log('[API] Fetching recommendations with params:', params);
        const response = await apiClient.get('/recommend/repos', { params });
        console.log('[API] Received recommendations:', response.data);
        return response.data;
    },
};

export const searchService = {
    // Search repositories
    searchRepos: async (params = {}) => {
        const response = await apiClient.get('/search/repos', { params });
        return response.data;
    },
};

export const savedService = {
    // Get saved repositories
    getSaved: async () => {
        const response = await apiClient.get('/saved/list');
        return response.data;
    },

    // Add repository to saved
    addSaved: async (repo) => {
        // Transform repo data to match backend expectations
        const repoData = {
            repoFullName: repo.full_name || repo.fullName || `${repo.owner?.login}/${repo.name}`,
            repoData: {
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name || repo.fullName,
                description: repo.description,
                html_url: repo.html_url || repo.htmlUrl,
                language: repo.language,
                stargazers_count: repo.stargazers_count || repo.stargazersCount,
                forks_count: repo.forks_count || repo.forksCount,
                open_issues_count: repo.open_issues_count || repo.openIssuesCount,
                topics: repo.topics,
                owner: repo.owner
            },
            matchScore: repo.matchScore || 0,
            notes: ''
        };
        const response = await apiClient.post('/saved/add', repoData);
        return response.data;
    },

    // Remove repository from saved
    removeSaved: async (repo) => {
        // Backend expects repoFullName, not repoId
        const repoFullName = repo.full_name || repo.fullName || `${repo.owner?.login}/${repo.name}`;
        const response = await apiClient.post('/saved/remove', { repoFullName });
        return response.data;
    },

    // Update saved repository
    updateSaved: async (repoId, updates) => {
        const response = await apiClient.put('/saved/update', { repoId, ...updates });
        return response.data;
    },
};

export const issueService = {
    // Get recommended issues
    getRecommendations: async (params = {}) => {
        console.log('[API] Fetching issue recommendations with params:', params);
        const response = await apiClient.get('/issues/recommendations', { params });
        console.log('[API] Received issues:', response.data);
        return response.data;
    },
};

// API Discovery service for backend awareness
export const systemService = {
    // Get API routes documentation
    getApiRoutes: async () => {
        try {
            const response = await apiClient.get('/');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch API routes:', error);
            return null;
        }
    },

    // Check backend health
    checkHealth: async () => {
        try {
            const response = await apiClient.get('/');
            return { status: 'connected', data: response.data };
        } catch (error) {
            return { status: 'disconnected', error: error.message };
        }
    },
};

export const analyzeService = {
    // Run deep RAG analysis on a repository
    analyzeRepo: async (repoUrl, developerSkills = '') => {
        const response = await apiClient.post('/analyze/repo', {
            repo_url: repoUrl,
            developer_skills: developerSkills,
        });
        return response.data;
    },

    // Check RAG service health
    getHealth: async () => {
        const response = await apiClient.get('/analyze/health');
        return response.data;
    },

    // Get RAG cache stats
    getCacheStats: async () => {
        const response = await apiClient.get('/analyze/cache/stats');
        return response.data;
    },
};

export const bulkAnalysisService = {
    // Start a new batch analysis
    startBatch: async (usernames, batchName = '') => {
        const response = await apiClient.post('/bulk-analysis/start', { usernames, batchName });
        return response.data;
    },

    // Get all batches
    getBatches: async () => {
        const response = await apiClient.get('/bulk-analysis/batches');
        return response.data;
    },

    // Get batch detail with candidates
    getBatch: async (batchId) => {
        const response = await apiClient.get(`/bulk-analysis/batch/${batchId}`);
        return response.data;
    },

    // Export batch results
    exportBatch: async (batchId) => {
        const response = await apiClient.get(`/bulk-analysis/batch/${batchId}/export`);
        return response.data;
    },
};

export const candidateService = {
    // Get full candidate profile analysis
    getCandidate: async (username) => {
        const response = await apiClient.get(`/candidates/${username}`);
        return response.data;
    },

    // Trigger deep AI analysis
    analyzeCandidate: async (username) => {
        const response = await apiClient.post(`/candidates/${username}/analyze`);
        return response.data;
    },
};

export const recruiterService = {
    searchCandidates: async (params = {}) => {
        const response = await apiClient.get('/recruiter/search', { params });
        return response.data;
    },
    enrichBatch: async (usernames) => {
        const response = await apiClient.post('/recruiter/search/enrich/batch', { usernames });
        return response.data;
    },
    getProfile: async (username) => {
        const response = await apiClient.get(`/recruiter/profile/${username}`);
        return response.data;
    },
    getReport: async (username) => {
        const response = await apiClient.get(`/recruiter/reports/${username}`);
        return response.data;
    },
    getShortlist: async () => {
        const response = await apiClient.get('/recruiter/shortlist');
        return response.data;
    },
    addToShortlist: async (candidateData) => {
        const response = await apiClient.post('/recruiter/shortlist', candidateData);
        return response.data;
    },
    removeFromShortlist: async (username) => {
        const response = await apiClient.delete(`/recruiter/shortlist/${username}`);
        return response.data;
    }
};
