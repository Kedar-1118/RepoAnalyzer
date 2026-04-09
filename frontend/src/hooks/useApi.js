import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    authService,
    profileService,
    recommendationService,
    searchService,
    savedService,
    issueService,
    systemService,
} from '../services/api';
import useAuthStore from '../store/authStore';

// Auth hooks
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
    });
};

// Profile hooks
export const useProfileSummary = () => {
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

// Recommendation hooks
export const useRecommendations = (params = {}) => {
    return useQuery({
        queryKey: ['recommendations', params],
        queryFn: () => recommendationService.getRecommendations(params),
        staleTime: 0, // Always fetch fresh data
        enabled: true, // Always enabled, even with empty params
    });
};

// Search hooks
export const useSearchRepos = (params = {}) => {
    return useQuery({
        queryKey: ['search', params],
        queryFn: () => searchService.searchRepos(params),
        enabled: Object.keys(params).length > 0,
    });
};

// Issue recommendation hooks
export const useRecommendedIssues = (params = {}) => {
    return useQuery({
        queryKey: ['issues', 'recommendations', params],
        queryFn: () => issueService.getRecommendations(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Saved repositories hooks
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

// System hooks
export const useApiRoutes = () => {
    return useQuery({
        queryKey: ['system', 'routes'],
        queryFn: systemService.getApiRoutes,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useBackendHealth = () => {
    return useQuery({
        queryKey: ['system', 'health'],
        queryFn: systemService.checkHealth,
        refetchInterval: 30000, // Check every 30 seconds
    });
};
