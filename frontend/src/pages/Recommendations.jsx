import { useRecommendations } from '../hooks/useApi';
import MatchScoreDonut from '../components/MatchScoreDonut';
import Footer from '../components/Footer';

const Recommendations = () => {
  const { data: recsData, isLoading } = useRecommendations();
  const repos = recsData?.recommendations || recsData || [];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label text-[10px] uppercase tracking-widest text-tertiary font-bold">
            {repos.length} New Matches Found
          </span>
        </div>
        <h1 className="font-headline text-5xl lg:text-6xl font-extrabold tracking-tighter text-on-surface mb-4 leading-none">
          Architectural <br />
          <span className="text-primary italic">Precision</span> Matches.
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg font-light leading-relaxed">
          Our analyzer has mapped your contribution signature to these high-affinity repositories.
        </p>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <button className="px-6 py-2 bg-primary text-on-primary font-bold rounded-full text-sm">All Affinity</button>
        <button className="px-6 py-2 border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-full text-sm">JavaScript</button>
        <button className="px-6 py-2 border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-full text-sm">Python</button>
        <button className="px-6 py-2 border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-all rounded-full text-sm">AI Infrastructure</button>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Sort by:</span>
          <select className="bg-surface-container-low border-none text-xs font-bold text-primary rounded-full px-4 py-2 focus:ring-0">
            <option>Match Score</option>
            <option>Stars</option>
            <option>Activity</option>
          </select>
        </div>
      </div>

      {/* Repo Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo, i) => (
            <div key={i} className={`group relative overflow-hidden bg-surface-container-low rounded-[1rem] p-8 transition-all hover:bg-surface-container-high glow-border-hover ${i === 2 ? 'lg:row-span-2' : ''}`}>
              {/* Match Donut */}
              <div className="absolute top-6 right-6">
                <MatchScoreDonut score={repo.match_score ? Math.round(repo.match_score) : 85 - i * 7} size={56} />
              </div>

              <div className="flex flex-col h-full">
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-[0.75rem] bg-gradient-to-br from-surface-variant to-background flex items-center justify-center border border-outline-variant/10">
                    <span className={`material-symbols-outlined ${i % 3 === 0 ? 'text-primary' : i % 3 === 1 ? 'text-tertiary' : 'text-secondary'}`}>
                      {i % 4 === 0 ? 'architecture' : i % 4 === 1 ? 'database' : i % 4 === 2 ? 'psychology' : 'terminal'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {repo.name || repo.full_name}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">
                      {repo.owner?.login || 'Open Source'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-8 leading-relaxed">
                  {repo.description || 'A high-performance repository optimized for developer collaboration.'}
                </p>

                {/* Tags + Action */}
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(repo.topics || repo.language ? [repo.language] : ['Open Source']).slice(0, 3).map((tag, j) => (
                      <span key={j} className={`px-3 py-1 bg-surface-container-highest text-[10px] font-bold rounded-full uppercase tracking-tighter ${j === 0 ? 'text-secondary' : j === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">star</span>
                      <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
                        {repo.stargazers_count?.toLocaleString() || '—'} Stars
                      </span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-primary/10 text-primary transition-all">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {repos.length === 0 && (
            <div className="col-span-full text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block">explore</span>
              <p className="text-lg">No matches yet. Complete your profile to start matching!</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Command Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center glass-panel rounded-full px-6 py-3 shadow-2xl z-40">
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Refine Stack
          </button>
          <div className="h-4 w-[1px] bg-outline-variant/20"></div>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">refresh</span>
            Regenerate
          </button>
          <div className="h-4 w-[1px] bg-outline-variant/20"></div>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">share</span>
            Export
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Recommendations;
