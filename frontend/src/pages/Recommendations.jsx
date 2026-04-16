import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecommendations } from '../hooks/useApi';
import MatchScoreDonut from '../components/MatchScoreDonut';
import Footer from '../components/Footer';
import RepoCard from '../components/RepoCard';
import { LayoutGrid, List } from 'lucide-react';

const Recommendations = () => {
  const { data: recsData, isLoading } = useRecommendations();
  const repos = recsData?.recommendations || recsData || [];
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('Match Score');
  const [viewMode, setViewMode] = useState('grid');
  
  // Extract all unique languages/topics for filter options
  const filterOptions = useMemo(() => {
    const opts = new Set(['All']);
    repos.forEach(repo => {
      if (repo.language) opts.add(repo.language);
      if (repo.topics) {
         repo.topics.slice(0, 2).forEach(t => opts.add(t));
      }
    });
    // Return top 5 options
    return Array.from(opts).slice(0, 5);
  }, [repos]);

  const filteredAndSortedRepos = useMemo(() => {
    let result = [...repos];

    // Filter
    if (filterType !== 'All') {
      result = result.filter(repo => 
        repo.language === filterType || 
        (repo.topics && repo.topics.includes(filterType))
      );
    }

    // Sort
    if (sortBy === 'Match Score') {
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'Stars') {
      result.sort((a, b) => (b.stargazersCount || 0) - (a.stargazersCount || 0));
    } else if (sortBy === 'Activity') {
      result.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    }

    return result;
  }, [repos, filterType, sortBy]);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label text-[10px] uppercase tracking-widest text-tertiary font-bold">
            {repos.length} matches analyzed
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
        {filterOptions.map(opt => (
          <button 
            key={opt}
            onClick={() => setFilterType(opt)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              filterType === opt 
                ? 'bg-primary text-on-primary' 
                : 'border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {opt}
          </button>
        ))}
        
        <div className="ml-auto flex items-center gap-4">
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
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-low border-none text-xs font-bold text-primary rounded-full px-4 py-2 focus:ring-0"
            >
              <option>Match Score</option>
              <option>Stars</option>
              <option>Activity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repo Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader"></div></div>
      ) : (
        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
          {filteredAndSortedRepos.map((repo, i) => (
             <RepoCard 
                key={i} 
                repo={repo} 
                onClick={() => navigate('/deep-analysis', { state: { repoUrl: repo.htmlUrl || repo.html_url || `https://github.com/${repo.fullName || repo.full_name}` } })} 
             />
          ))}

          {filteredAndSortedRepos.length === 0 && (
            <div className="col-span-full text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block">explore</span>
              <p className="text-lg">No matches found for the current filters.</p>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Recommendations;
