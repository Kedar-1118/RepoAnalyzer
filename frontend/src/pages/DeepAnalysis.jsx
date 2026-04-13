import { useState } from 'react';
import { useAnalyzeRepo } from '../hooks/useApi';
import Footer from '../components/Footer';

const DeepAnalysis = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [skills, setSkills] = useState('');
  const { mutate: analyze, data: analysis, isLoading } = useAnalyzeRepo();

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (repoUrl) {
      analyze({ repoUrl, skills });
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Search Section */}
      {!analysis && (
        <section className="relative py-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">
            Repository <span className="text-primary italic">Analysis</span>
          </h1>
          <p className="text-on-surface-variant text-lg mb-8 max-w-xl">
            Enter a GitHub repository URL to trigger our RAG-powered deep analysis engine.
          </p>

          <form onSubmit={handleAnalyze} className="space-y-4 max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-[1rem] blur opacity-75 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative bg-surface-container-low rounded-[1rem] p-1">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full bg-transparent border-0 focus:ring-0 text-on-surface placeholder-slate-600 font-label text-sm px-6 py-4"
                />
              </div>
            </div>
            <div className="relative bg-surface-container-low rounded-[1rem]">
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Your skills (optional): React, Python, Rust..."
                className="w-full bg-transparent border-0 focus:ring-0 text-on-surface placeholder-slate-600 font-label text-sm px-6 py-4 rounded-[1rem]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !repoUrl}
              className="px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                  Start Analysis
                </>
              )}
            </button>
          </form>
        </section>
      )}

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Repository Header Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card p-8 rounded-[1rem] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10"></div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Open Source</span>
                  <span className="text-slate-500 text-sm">{analysis.metadata?.repo_owner}/{analysis.metadata?.repo_name}</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black font-headline tracking-tighter mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {analysis.metadata?.repo_name || 'Repository'}
                </h2>
                <p className="text-slate-400 max-w-xl leading-relaxed mb-8">
                  {analysis.repository_summary}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <a
                  href={`https://github.com/${analysis.metadata?.repo_owner}/${analysis.metadata?.repo_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform text-sm"
                  style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
                >
                  View on GitHub
                </a>
                <div className="flex gap-4 items-center text-slate-400 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-yellow-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-white">{analysis.metadata?.stars?.toLocaleString() || '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-400 text-lg">fork_right</span>
                    <span className="font-bold text-white">{analysis.metadata?.forks?.toLocaleString() || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Quality Score */}
            <div className="bg-surface-container-low p-8 rounded-[1rem] flex flex-col items-center justify-center text-center">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Code Quality Score</h3>
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-slate-800" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" />
                  <circle className="text-indigo-500" cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * (analysis.code_quality_score || 0) / 100)}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black font-headline text-white">{Math.round(analysis.code_quality_score || 0)}</span>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase">
                    {analysis.code_quality_score >= 80 ? 'Exceptional' : analysis.code_quality_score >= 60 ? 'Good' : 'Needs Work'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights & Tech Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* AI Health Analysis */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">bolt</span>
                <h3 className="text-xl font-bold font-headline">AI Health Analysis</h3>
              </div>
              <div className="bg-surface-container-lowest p-8 rounded-[1rem] border border-white/5 space-y-4">
                <p className="text-slate-300 leading-relaxed italic">
                  "{analysis.analysis_explanation || analysis.code_quality_explanation || 'Analysis data not available.'}"
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-surface-container-low rounded-[0.75rem]">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Architecture</span>
                    <span className="text-emerald-400 font-bold">{analysis.architecture_pattern || 'N/A'}</span>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-[0.75rem]">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Complexity</span>
                    <span className="text-tertiary font-bold">{analysis.complexity_level || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">category</span>
                <h3 className="text-xl font-bold font-headline">Tech Stack</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(analysis.technology_stack || []).map((tech, i) => (
                  <div key={i} className="bg-surface-container-high p-4 rounded-[1rem] flex flex-col items-center gap-2 hover:bg-surface-bright transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 3 === 0 ? 'bg-orange-500/20' : i % 3 === 1 ? 'bg-indigo-500/20' : 'bg-purple-500/20'}`}>
                      <span className={`material-symbols-outlined ${i % 3 === 0 ? 'text-orange-500' : i % 3 === 1 ? 'text-indigo-400' : 'text-purple-400'}`}>code</span>
                    </div>
                    <span className="text-xs font-bold text-center">{tech}</span>
                  </div>
                ))}
                {(analysis.technology_stack || []).length === 0 && (
                  <p className="col-span-3 text-on-surface-variant text-sm">No tech stack data available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Contribution Opportunities */}
          {analysis.contribution_opportunities?.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-400">volunteer_activism</span>
                <h3 className="text-xl font-bold font-headline">Contribution Opportunities</h3>
              </div>
              <div className="space-y-4">
                {analysis.contribution_opportunities.map((opp, i) => (
                  <div key={i} className={`bg-surface-container-low hover:bg-surface-container-high p-6 rounded-[1rem] transition-all border-l-4 ${i % 2 === 0 ? 'border-indigo-500' : 'border-purple-500'} flex items-center justify-between group`}>
                    <div className="space-y-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${i % 2 === 0 ? 'text-indigo-400' : 'text-purple-400'}`}>
                        {typeof opp === 'string' ? 'Opportunity' : opp.type || 'Contribution'}
                      </span>
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {typeof opp === 'string' ? opp : opp.title || opp.description}
                      </h4>
                    </div>
                    <button className={`${i % 2 === 0 ? 'text-indigo-400' : 'text-purple-400'} font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all`}>
                      Claim Task <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Analysis Button */}
          <div className="text-center pt-8">
            <button
              onClick={() => { setRepoUrl(''); setSkills(''); }}
              className="px-8 py-3 bg-surface-container-high hover:bg-surface-bright text-primary rounded-full font-bold transition-all flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined">refresh</span>
              Analyze Another Repository
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default DeepAnalysis;
