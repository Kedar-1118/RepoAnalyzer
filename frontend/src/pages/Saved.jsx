import { useSavedRepos, useRemoveSavedRepo } from '../hooks/useApi';
import Footer from '../components/Footer';

const Saved = () => {
  const { data: savedReposData, isLoading } = useSavedRepos();
  const { mutate: removeRepo } = useRemoveSavedRepo();
  const savedRepos = savedReposData?.repositories || savedReposData || [];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      <section>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
          Saved <span className="text-primary italic">Repositories</span>
        </h1>
        <p className="text-on-surface-variant text-lg">Your curated collection of high-affinity projects.</p>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRepos.map((repo, i) => (
            <div key={i} className="bg-surface-container-low rounded-[1rem] p-6 hover:bg-surface-container-high transition-all group cursor-pointer border border-transparent hover:border-indigo-500/20">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-[0.75rem] flex items-center justify-center ${
                  i % 3 === 0 ? 'bg-indigo-500/10 text-indigo-400' : i % 3 === 1 ? 'bg-purple-500/10 text-purple-400' : 'bg-teal-500/10 text-teal-400'
                }`}>
                  <span className="material-symbols-outlined text-2xl">
                    {i % 3 === 0 ? 'terminal' : i % 3 === 1 ? 'deployed_code' : 'database'}
                  </span>
                </div>
                <button onClick={() => removeRepo(repo.id || repo.repo_id)} className="text-indigo-500 hover:text-red-400 transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                </button>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">{repo.name || repo.full_name}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{repo.description || 'No description available'}</p>
              <div className="flex items-center gap-4 text-xs font-medium">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span>{repo.stargazers_count?.toLocaleString() || '—'}</span>
                </div>
              </div>
            </div>
          ))}
          {savedRepos.length === 0 && (
            <div className="col-span-full text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block">bookmark_border</span>
              <p className="text-lg">No saved repositories yet. Start exploring!</p>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Saved;
