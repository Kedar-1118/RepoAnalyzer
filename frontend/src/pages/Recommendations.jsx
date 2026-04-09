import { useState, useMemo } from 'react';
import { TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { useRecommendations, useAddSavedRepo, useRemoveSavedRepo, useSavedRepos } from '../hooks/useApi';
import useToastStore from '../store/toastStore';
import RepoAnalysisModal from '../components/RepoAnalysisModal';
import RepoCard from '../components/RepoCard';
import Pagination from '../components/Pagination';

const Recommendations = () => {
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const REPOS_PER_PAGE = 10;
    const MAX_REPOS = 40;

    // Separate state for form inputs vs applied filters
    const [filterInputs, setFilterInputs] = useState({
        language: '',
        minStars: '',
        domain: '',
    });

    const [appliedFilters, setAppliedFilters] = useState({
        language: '',
        minStars: '',
        domain: '',
    });

    const { data: recommendationsData, isLoading, refetch } = useRecommendations(appliedFilters);
    const { data: savedReposData } = useSavedRepos();
    const addSaved = useAddSavedRepo();
    const removeSaved = useRemoveSavedRepo();
    const toast = useToastStore();

    // Extract actual data from API responses and limit to 40 repos
    const allRecommendations = recommendationsData?.recommendations || [];
    const recommendations = useMemo(() => allRecommendations.slice(0, MAX_REPOS), [allRecommendations]);
    const savedRepos = savedReposData?.repositories || [];

    // Calculate pagination
    const totalPages = Math.ceil(recommendations.length / REPOS_PER_PAGE);
    const paginatedRecommendations = useMemo(() => {
        const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
        const endIndex = startIndex + REPOS_PER_PAGE;
        return recommendations.slice(startIndex, endIndex);
    }, [recommendations, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [showFilters, setShowFilters] = useState(false);

    const isSaved = (repoId) => {
        return savedRepos?.some(repo => repo.id === repoId);
    };

    const handleToggleSave = (repo) => {
        if (isSaved(repo.id)) {
            removeSaved.mutate(repo);
        } else {
            addSaved.mutate(repo);
        }
    };

    const handleApplyFilters = () => {
        console.log('[Recommendations] Applying filters:', filterInputs);
        setAppliedFilters({ ...filterInputs }); // Create new object to ensure React sees the change
    };

    const handleClearFilters = () => {
        console.log('[Recommendations] Clearing filters');
        setFilterInputs({ language: '', minStars: '', domain: '' });
        setAppliedFilters({ language: '', minStars: '', domain: '' });
    };

    const handleRefresh = async () => {
        toast.info('Refreshing recommendations...');
        await refetch();
        toast.success('Recommendations updated!');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text flex items-center space-x-2">
                            <TrendingUp className="w-8 h-8 text-light-accent dark:text-dark-primary" />
                            <span>Recommended Repositories</span>
                        </h1>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                            Projects matched to your skills and interests
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="btn-primary flex items-center space-x-2"
                            title="Refresh recommendations"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <Filter className="w-4 h-4" />
                            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="card p-6 animate-slide-in">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                            Filter Recommendations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., JavaScript, Python"
                                    className="input"
                                    value={filterInputs.language}
                                    onChange={(e) => setFilterInputs({ ...filterInputs, language: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                    Minimum Stars
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 100"
                                    className="input"
                                    value={filterInputs.minStars}
                                    onChange={(e) => setFilterInputs({ ...filterInputs, minStars: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                    Domain
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., web, ml, devops"
                                    className="input"
                                    value={filterInputs.domain}
                                    onChange={(e) => setFilterInputs({ ...filterInputs, domain: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleApplyFilters}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Apply Filters</span>
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className="btn-secondary"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Recommendations List */}
                <div className="space-y-4">
                    {recommendations?.length === 0 ? (
                        <div className="card p-12 text-center">
                            <TrendingUp className="w-16 h-16 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
                            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                                No recommendations yet
                            </h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                We're analyzing your profile to find the perfect matches!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-6">
                                {paginatedRecommendations?.map((repo) => (
                                    <RepoCard
                                        key={repo.id}
                                        repo={repo}
                                        onClick={() => setSelectedRepo(repo)}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>

                {/* Analysis Modal */}
                {selectedRepo && (
                    <RepoAnalysisModal
                        repo={selectedRepo}
                        onClose={() => setSelectedRepo(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Recommendations;
