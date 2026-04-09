import { Star, Trash2 } from 'lucide-react';
import { useSavedRepos, useRemoveSavedRepo } from '../hooks/useApi';
import useToastStore from '../store/toastStore';
import RepoCard from '../components/RepoCard';

const Saved = () => {
    const { data: savedReposData, isLoading } = useSavedRepos();
    const removeSaved = useRemoveSavedRepo();
    const toast = useToastStore();

    // Extract repositories array from API response
    const savedRepos = savedReposData?.repositories || [];

    const handleRemove = (repo) => {
        try {
            removeSaved.mutate(repo, {
                onSuccess: () => {
                    toast.success(`Removed ${repo.name} from saved repositories`);
                },
                onError: (error) => {
                    toast.error(`Failed to remove repository: ${error.message}`);
                }
            });
        } catch (error) {
            toast.error('Failed to remove repository');
        }
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
                <div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text flex items-center space-x-2">
                        <Star className="w-8 h-8 text-yellow-500 dark:text-dark-primary" />
                        <span>Saved Repositories</span>
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        Your bookmarked projects ({savedRepos.length})
                    </p>
                </div>

                {/* Saved Repos */}
                {savedRepos && savedRepos.length > 0 ? (
                    <div className="space-y-4">
                        {savedRepos.map((repo) => (
                            <RepoCard
                                key={repo.id}
                                repo={repo}
                                showSaveButton={false}
                                clickable={false}
                                customAction={
                                    <button
                                        onClick={() => handleRemove(repo)}
                                        className="ml-4 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg flex-shrink-0"
                                        title="Remove from saved"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <Star className="w-16 h-16 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                            No saved repositories yet
                        </h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Start exploring and save repositories you're interested in!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Saved;
