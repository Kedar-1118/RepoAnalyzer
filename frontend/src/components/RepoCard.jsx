import { useAddSavedRepo, useRemoveSavedRepo, useSavedRepos } from '../hooks/useApi';
import MatchScoreDonut from './MatchScoreDonut';

const RepoCard = ({
    repo,
    onClick,
    showSaveButton = true,
    customAction = null,
    className = ''
}) => {
    const { data: savedReposData } = useSavedRepos();
    const addSaved = useAddSavedRepo();
    const removeSaved = useRemoveSavedRepo();

    // Extract repositories array from API response
    const savedRepos = savedReposData?.repositories || savedReposData || [];
    const isSaved = savedRepos.some(saved =>
        saved.id === repo.id ||
        (saved.full_name && repo.full_name && saved.full_name === repo.full_name) ||
        (saved.fullName && repo.fullName && saved.fullName === repo.fullName)
    );

    const handleToggleSave = (e) => {
        e.stopPropagation(); // Prevent card click when saving
        e.preventDefault();
        if (isSaved) {
            removeSaved.mutate(repo.id);
        } else {
            addSaved.mutate(repo);
        }
    };

    const icons = ['architecture', 'database', 'psychology', 'terminal'];
    // Deterministic random icon based on name length
    const iconIndex = (repo.name || "").length % icons.length;

    return (
        <div className={`group relative overflow-hidden bg-surface-container-low rounded-[1rem] p-8 transition-all hover:bg-surface-container-high glow-border-hover ${className}`}>
            {/* Match Donut */}
            {(repo.matchScore || repo.match_score) && (
                <div className="absolute top-6 right-6">
                    <MatchScoreDonut score={Math.round(repo.matchScore || repo.match_score)} size={56} />
                </div>
            )}

            <div className="flex flex-col h-full">
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-[0.75rem] bg-gradient-to-br from-surface-variant to-background flex items-center justify-center border border-outline-variant/10 flex-shrink-0">
                        <span className={`material-symbols-outlined ${iconIndex === 0 ? 'text-primary' : iconIndex === 1 ? 'text-tertiary' : 'text-secondary'}`}>
                            {icons[iconIndex]}
                        </span>
                    </div>
                    <div className="pr-16">
                        <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            {repo.name || repo.fullName || repo.full_name}
                        </h3>
                        <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest line-clamp-1">
                            {repo.owner?.login || repo.owner || 'Open Source'}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-8 leading-relaxed flex-1">
                    {repo.description || 'An open-source repository.'}
                </p>

                {/* Tags + Action */}
                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {(repo.topics?.length ? repo.topics : repo.language ? [repo.language] : ['Open Source']).slice(0, 3).map((tag, j) => (
                            <span key={j} className={`px-3 py-1 bg-surface-container-highest text-[10px] font-bold rounded-full uppercase tracking-tighter ${j === 0 ? 'text-secondary' : j === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">star</span>
                            <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
                                {(repo.stargazersCount || repo.stargazers_count || 0).toLocaleString()} Stars
                            </span>
                            {repo.language && (
                                <>
                                    <span className="mx-1 text-outline-variant">•</span>
                                    <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">{repo.language}</span>
                                </>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {customAction ? (
                                customAction
                            ) : showSaveButton ? (
                                <button
                                    onClick={handleToggleSave}
                                    className={`p-2 rounded-full transition-all hover:bg-surface-container-highest flex-shrink-0 ${isSaved ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                                    title={isSaved ? 'Remove from saved' : 'Save repository'}
                                >
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "" }}>bookmark</span>
                                </button>
                            ) : null}

                            {onClick && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onClick(e); }} 
                                    className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all flex items-center justify-center"
                                    title="Deep Analysis"
                                >
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepoCard;
