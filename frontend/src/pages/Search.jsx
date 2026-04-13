import { useState } from 'react';
import { useSearchRepos } from '../hooks/useApi';
import Footer from '../components/Footer';

const Search = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const { mutate: search, data: results, isLoading } = useSearchRepos();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) search({ query, language });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      <section>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">
          Search <span className="text-primary italic">Repositories</span>
        </h1>
        <p className="text-on-surface-variant text-lg mb-8">Discover open source projects that match your expertise.</p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-3xl">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, topic, or technology..."
              className="w-full bg-surface-container-low border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 ring-primary/20 text-on-surface placeholder-slate-600"
            />
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-surface-container-low border-none rounded-full px-6 py-3 text-sm text-on-surface focus:ring-2 ring-primary/20"
          >
            <option value="">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="rust">Rust</option>
            <option value="go">Go</option>
          </select>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>

      {/* Results */}
      {results && (
        <section className="space-y-4">
          <p className="text-sm text-on-surface-variant">{results.length} repositories found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((repo, i) => (
              <div key={i} className="bg-surface-container-low rounded-[1rem] p-6 hover:bg-surface-container-high transition-all group border border-transparent hover:border-primary/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-[0.75rem] bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">deployed_code</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{repo.full_name || repo.name}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2">{repo.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-primary"></span>
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined text-sm">star</span>
                    <span>{repo.stargazers_count?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Search;
