import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    authService,
    profileService,
    recommendationService,
    searchService,
    savedService,
    issueService,
    systemService,
    analyzeService,
    bulkAnalysisService,
    candidateService,
    recruiterService,
} from '../services/api';
import useAuthStore from '../store/authStore';

// === Auth Hooks ===

export const useVerifyToken = () => {
    return useQuery({
        queryKey: ['auth', 'verify'],
        queryFn: authService.verifyToken,
        retry: false,
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const logout = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logout();
            queryClient.clear();
            window.location.href = '/';
        },
        onError: () => {
            // Even if the backend call fails, clear local state so the user isn't stuck
            logout();
            queryClient.clear();
            window.location.href = '/';
        },
    });
};

// === Profile Hooks ===

export const useProfileSummary = () => {
    return useQuery({
        queryKey: ['profile', 'summary'],
        queryFn: profileService.getSummary,
    });
};

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile', 'summary'],
        queryFn: profileService.getSummary,
    });
};

export const useProfileRepos = () => {
    return useQuery({
        queryKey: ['profile', 'repos'],
        queryFn: profileService.getRepos,
    });
};

export const useProfileStats = () => {
    return useQuery({
        queryKey: ['profile', 'stats'],
        queryFn: profileService.getStats,
    });
};

export const useProfileContributions = () => {
    return useQuery({
        queryKey: ['profile', 'contributions'],
        queryFn: profileService.getContributions,
    });
};

export const useUserTechStack = () => {
    return useQuery({
        queryKey: ['profile', 'techstack'],
        queryFn: profileService.getTechStack,
    });
};

export const useUpdateTechStack = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: profileService.updateTechStack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', 'techstack'] });
            queryClient.invalidateQueries({ queryKey: ['profile', 'summary'] });
        },
    });
};

// === Recommendation Hooks ===

export const useRecommendations = (params = {}) => {
    return useQuery({
        queryKey: ['recommendations', params],
        queryFn: () => recommendationService.getRecommendations(params),
        staleTime: 0,
        enabled: true,
    });
};

// === Search Hooks ===

export const useSearchReposQuery = (params = {}) => {
    return useQuery({
        queryKey: ['search', params],
        queryFn: () => searchService.searchRepos(params),
        enabled: Object.keys(params).length > 0,
    });
};

export const useSearchRepos = () => {
    return useMutation({
        mutationFn: (params) => searchService.searchRepos(params),
    });
};

// === Issues Hooks ===

export const useRecommendedIssues = (params = {}) => {
    return useQuery({
        queryKey: ['issues', 'recommendations', params],
        queryFn: () => issueService.getRecommendations(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useIssues = (params = {}) => {
    return useQuery({
        queryKey: ['issues', 'recommendations', params],
        queryFn: () => issueService.getRecommendations(params),
        staleTime: 5 * 60 * 1000,
    });
};

// === Saved Repositories Hooks ===

export const useSavedRepos = () => {
    return useQuery({
        queryKey: ['saved'],
        queryFn: savedService.getSaved,
    });
};

export const useAddSavedRepo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: savedService.addSaved,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved'] });
        },
    });
};

export const useRemoveSavedRepo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: savedService.removeSaved,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved'] });
        },
    });
};

export const useUpdateSavedRepo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ repoId, updates }) => savedService.updateSaved(repoId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saved'] });
        },
    });
};

// === Deep Analysis Hooks ===

export const useAnalyzeRepo = () => {
    return useMutation({
        mutationFn: ({ repoUrl, skills }) => analyzeService.analyzeRepo(repoUrl, skills),
    });
};

// === Bulk Analysis Hooks ===

export const useBulkBatches = () => {
    return useQuery({
        queryKey: ['bulk-analysis', 'batches'],
        queryFn: bulkAnalysisService.getBatches,
    });
};

export const useBulkBatchDetail = (batchId) => {
    return useQuery({
        queryKey: ['bulk-analysis', 'batch', batchId],
        queryFn: () => bulkAnalysisService.getBatch(batchId),
        enabled: !!batchId,
    });
};

export const useStartBatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ usernames, batchName }) => bulkAnalysisService.startBatch(usernames, batchName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bulk-analysis'] });
        },
    });
};

// === Candidate Hooks ===

export const useCandidate = (username) => {
    return useQuery({
        queryKey: ['candidate', username],
        queryFn: () => candidateService.getCandidate(username),
        enabled: !!username,
    });
};

export const useAnalyzeCandidate = () => {
    return useMutation({
        mutationFn: (username) => candidateService.analyzeCandidate(username),
    });
};

// === System Hooks ===

export const useApiRoutes = () => {
    return useQuery({
        queryKey: ['system', 'routes'],
        queryFn: systemService.getApiRoutes,
        staleTime: 1000 * 60 * 5,
    });
};

export const useBackendHealth = () => {
    return useQuery({
        queryKey: ['system', 'health'],
        queryFn: systemService.checkHealth,
        refetchInterval: 30000,
    });
};

// === Recruiter Hooks ===

export const useRecruiterSearch = (params = {}) => {
    return useQuery({
        queryKey: ['recruiter', 'search', params],
        queryFn: () => recruiterService.searchCandidates(params),
        enabled: Object.keys(params).length > 0,
    });
};

export const useRecruiterEnrichBatch = () => {
    return useMutation({
        mutationFn: (usernames) => recruiterService.enrichBatch(usernames),
    });
};

export const useRecruiterProfile = (username) => {
    return useQuery({
        queryKey: ['recruiter', 'profile', username],
        queryFn: () => recruiterService.getProfile(username),
        enabled: !!username,
    });
};

export const useRecruiterShortlist = () => {
    return useQuery({
        queryKey: ['recruiter', 'shortlist'],
        queryFn: recruiterService.getShortlist,
    });
};

export const useRecruiterAddToShortlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => recruiterService.addToShortlist(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruiter', 'shortlist'] });
        },
    });
};

export const useRecruiterRemoveFromShortlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (username) => recruiterService.removeFromShortlist(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruiter', 'shortlist'] });
        },
    });
};
