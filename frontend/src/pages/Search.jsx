import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchRepos } from '../hooks/useApi';
import Footer from '../components/Footer';
import RepoCard from '../components/RepoCard';
import { LayoutGrid, List } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const { mutate: search, data: results, isLoading } = useSearchRepos();
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query || language) search({ query, language });
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">{results.length} repositories found</p>
            <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/30">
               <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant'}`}
               >
                  <LayoutGrid size={16} />
               </button>
               <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant'}`}
               >
                  <List size={16} />
               </button>
            </div>
          </div>
          
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
            {results.map((repo, i) => (
               <RepoCard 
                  key={i} 
                  repo={repo} 
                  onClick={() => navigate('/deep-analysis', { state: { repoUrl: repo.htmlUrl } })} 
               />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Search;
