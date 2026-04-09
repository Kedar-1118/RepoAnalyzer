import { useState } from 'react';
import { Search as SearchIcon, Filter, Loader2 } from 'lucide-react';
import { useSearchRepos } from '../hooks/useApi';
import RepoCard from '../components/RepoCard';

const Search = () => {
    const [searchParams, setSearchParams] = useState({
        query: '',
        language: '',
        minStars: '',
        skills: '',
    });
    const [activeSearch, setActiveSearch] = useState({});

    const { data: searchData, isLoading } = useSearchRepos(activeSearch);

    // Extract repositories from API response
    const results = searchData?.repositories || [];

    const handleSearch = (e) => {
        e.preventDefault();
        const filtered = Object.fromEntries(
            Object.entries(searchParams).filter(([_, value]) => value !== '')
        );
        setActiveSearch(filtered);
    };

    return (
        <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text flex items-center space-x-2">
                        <SearchIcon className="w-8 h-8 text-light-accent dark:text-dark-primary" />
                        <span>Search Repositories</span>
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        Find open-source projects by skills, languages, or domains
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="card p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                Search Query
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name, description, or keywords..."
                                className="input"
                                value={searchParams.query}
                                onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                Language
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., JavaScript, Python, Go"
                                className="input"
                                value={searchParams.language}
                                onChange={(e) => setSearchParams({ ...searchParams, language: e.target.value })}
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
                                value={searchParams.minStars}
                                onChange={(e) => setSearchParams({ ...searchParams, minStars: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                Skills / Topics
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., machine-learning, docker, react"
                                className="input"
                                value={searchParams.skills}
                                onChange={(e) => setSearchParams({ ...searchParams, skills: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2">
                        <SearchIcon className="w-5 h-5" />
                        <span>Search</span>
                    </button>
                </form>

                {/* Results */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-light-accent dark:text-dark-primary" />
                    </div>
                ) : results && results.length > 0 ? (
                    <div className="space-y-4">
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Found {results.length} repositories
                        </p>
                        {results.map((repo) => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                ) : activeSearch.query ? (
                    <div className="card p-12 text-center">
                        <SearchIcon className="w-16 h-16 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                            No results found
                        </h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Try adjusting your search criteria
                        </p>
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <SearchIcon className="w-16 h-16 mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-4" />
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                            Start searching
                        </h3>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Enter your search criteria above to find repositories
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
