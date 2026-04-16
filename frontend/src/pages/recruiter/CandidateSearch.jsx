import React, { useState, useEffect } from 'react';
import { useRecruiterSearch, useRecruiterEnrichBatch } from '../../hooks/useApi';
import { Link } from 'react-router-dom';

const CandidateSearch = () => {
  const [queryParams, setQueryParams] = useState({ language: 'javascript', page: 1 });
  const [searchInput, setSearchInput] = useState('javascript');
  const [enrichedData, setEnrichedData] = useState({});

  const { data: searchResults, isLoading: isSearchLoading, isError } = useRecruiterSearch(queryParams);
  const { mutate: enrichBatch } = useRecruiterEnrichBatch();

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryParams({ language: searchInput, page: 1 });
    setEnrichedData({});
  };

  useEffect(() => {
    if (searchResults?.data?.length > 0) {
      // Find candidates not yet enriched
      const candidatesToEnrich = searchResults.data
        .map((c) => c.login)
        .filter((username) => !enrichedData[username]);

      if (candidatesToEnrich.length > 0) {
        enrichBatch(candidatesToEnrich, {
          onSuccess: (response) => {
            if (response.status === 'success') {
              const newEnrichedData = {};
              response.data.forEach((item) => {
                newEnrichedData[item.username] = item;
              });
              setEnrichedData((prev) => ({ ...prev, ...newEnrichedData }));
            }
          },
        });
      }
    }
  }, [searchResults, enrichBatch]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight font-headline uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Discover Candidates
        </h1>
        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
          AI-Enriched Developer Pipeline
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by language (e.g. typescript, python)..."
          className="flex-1 bg-surface-container border border-outline-variant/30 rounded-full px-6 py-3 font-bold text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-label tracking-wide"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest px-8 py-3 rounded-full transition-all"
        >
          Search
        </button>
      </form>

      {isError && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 text-red-200">
          Failed to fetch candidates. Please try again.
        </div>
      )}

      {isSearchLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-container rounded-3xl h-64 border border-outline-variant/10"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults?.data?.map((user) => {
            const enrichment = enrichedData[user.login];
            const isEnriching = !enrichment;

            return (
              <div
                key={user.login}
                className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 hover:border-indigo-500/30 transition-all group shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <img src={user.avatar_url} alt={user.login} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-outline-variant/20" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-black text-xl truncate group-hover:text-indigo-400 transition-colors">
                      {user.login}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">
                      Score: {isEnriching ? '...' : enrichment.matchScore}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-2">Skills Found</p>
                    <div className="flex flex-wrap gap-2">
                      {isEnriching ? (
                        <div className="w-16 h-6 bg-surface-container-high animate-pulse rounded-full"></div>
                      ) : (
                        enrichment?.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold font-label tracking-wide">
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/10">
                    <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-2">AI Sentiment</p>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium line-clamp-2">
                      {isEnriching ? 'Analyzing repositories...' : enrichment?.aiSentiment}
                    </p>
                    {enrichment?.degraded && (
                      <p className="text-xs text-orange-400 mt-2 font-bold">Limited AI capabilities applied.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/recruiter/profile/${user.login}`}
                    className="block w-full text-center bg-surface-container-high hover:bg-slate-800 text-white font-bold text-sm tracking-wide py-3 rounded-xl transition-all"
                  >
                    View Evaluation
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination dummy */}
      {searchResults?.data?.length > 0 && (
         <div className="flex justify-between items-center bg-surface-container p-4 rounded-full border border-outline-variant/20">
           <button 
             onClick={() => setQueryParams(p => ({...p, page: Math.max(1, p.page - 1)}))}
             disabled={queryParams.page === 1}
             className="px-6 py-2 rounded-full font-bold text-sm tracking-wider uppercase disabled:opacity-50 hover:bg-white/5"
           >
             Prev
           </button>
           <span className="font-bold text-slate-400">Page {queryParams.page}</span>
           <button 
             onClick={() => setQueryParams(p => ({...p, page: p.page + 1}))}
             className="px-6 py-2 rounded-full font-bold text-sm tracking-wider uppercase bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
           >
             Next
           </button>
         </div>
      )}
    </div>
  );
};

export default CandidateSearch;
