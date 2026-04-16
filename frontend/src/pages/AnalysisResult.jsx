import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAnalyzeRepo } from '../hooks/useApi';
import Footer from '../components/Footer';

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6 w-full">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row justify-between gap-6 p-8 bg-[#111128]/80 backdrop-blur-md rounded-[1rem] border border-indigo-500/10 shadow-xl">
      <div className="space-y-4 flex-1">
        <div className="flex gap-2">
            <div className="h-6 w-24 bg-white/5 rounded-full"></div>
            <div className="h-6 w-16 bg-white/5 rounded-full"></div>
        </div>
        <div className="h-10 w-3/4 bg-white/5 rounded-lg max-w-lg"></div>
        <div className="space-y-2">
            <div className="h-4 w-full bg-white/5 rounded-full max-w-2xl"></div>
            <div className="h-4 w-5/6 bg-white/5 rounded-full max-w-xl"></div>
        </div>
        <div className="pt-2">
            <div className="h-10 w-32 bg-white/5 rounded-full"></div>
        </div>
      </div>
      <div className="w-32 h-32 rounded-full bg-white/5 shrink-0 flex items-center justify-center border-8 border-white/5"></div>
    </div>
    
    {/* Scores Grid Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 bg-[#111128]/80 backdrop-blur-md rounded-[1rem] border border-indigo-500/10 flex flex-col items-center gap-4">
          <div className="h-3 w-16 bg-white/5 rounded-full"></div>
          <div className="h-8 w-12 bg-white/5 rounded-lg"></div>
          <div className="h-1.5 w-full bg-white/5 rounded-full"></div>
        </div>
      ))}
    </div>

    {/* Details Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 bg-[#111128]/80 backdrop-blur-md rounded-[1rem] border border-indigo-500/10 space-y-5">
          <div className="h-5 w-32 bg-white/5 rounded-md"></div>
          <div className="flex gap-2 flex-wrap">
             {[...Array(3)].map((_, j) => <div key={`tag-${i}-${j}`} className="h-7 w-20 bg-white/5 rounded-full"></div>)}
          </div>
          <div className="space-y-3">
             <div className="h-3 w-full bg-white/5 rounded-full"></div>
             <div className="h-3 w-4/5 bg-white/5 rounded-full"></div>
             <div className="h-3 w-3/4 bg-white/5 rounded-full"></div>
          </div>
        </div>
       ))}
    </div>
  </div>
);

const AnalysisResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const repoUrl = searchParams.get('url');
  const skills = searchParams.get('skills') || '';
  
  // NOTE: React Query v5 uses 'isPending' instead of 'isLoading' for mutations
  const { mutate: analyze, data: analysis, isPending, isError } = useAnalyzeRepo();

  useEffect(() => {
    if (repoUrl) {
      analyze({ repoUrl, skills });
    }
  }, [repoUrl, skills, analyze]);

  if (!repoUrl) {
    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full text-center">
        <h2 className="text-2xl font-bold mb-4">No repository URL provided</h2>
        <Link to="/deep-analysis" className="text-indigo-400 hover:underline">Return to Analysis Search</Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      
      {/* Loading State using Skeleton */}
      {(isPending || (!analysis && !isError)) && (
        <SkeletonLoader />
      )}

      {/* Error state */}
      {isError && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-rose-500 text-6xl mb-4">error</span>
          <h2 className="text-2xl font-bold mb-2 text-white">Analysis Failed</h2>
          <p className="text-slate-400 mb-6">There was a problem analyzing the repository.</p>
          <Link to="/deep-analysis" className="px-6 py-2.5 bg-surface-container-high hover:bg-surface-bright text-primary border border-primary/20 rounded-full font-bold transition-all text-sm inline-flex items-center gap-2">
            Try Another Repository
          </Link>
        </div>
      )}

      {/* Analysis Results using RAG-model format */}
      {analysis && !isPending && (
        <div className="space-y-6">
          {/* Repo Header */}
          <div className="flex flex-col md:flex-row justify-between gap-8 bg-[#111128]/80 backdrop-blur-md border border-indigo-500/20 p-8 rounded-[1rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10"></div>
            
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                 {/* Badges */}
                 <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                   {analysis.metadata?.repo_owner}/{analysis.metadata?.repo_name}
                 </span>
                 <span className="bg-surface-container-high text-slate-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px] text-yellow-500">star</span> {analysis.metadata?.stars?.toLocaleString() || '—'}
                 </span>
                 <span className="bg-surface-container-high text-slate-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">fork_right</span> {analysis.metadata?.forks?.toLocaleString() || '—'}
                 </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black font-headline text-white mb-3">
                {analysis.metadata?.repo_name || 'Repository'}
              </h2>
              <p className="text-slate-400 leading-relaxed max-w-2xl text-sm md:text-base">
                {analysis.repository_summary}
              </p>
              
              <div className="mt-6">
                <a
                  href={`https://github.com/${analysis.metadata?.repo_owner}/${analysis.metadata?.repo_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 transition-transform shadow-lg shadow-indigo-500/25"
                >
                  View on GitHub
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                      <circle className="text-indigo-500/10" cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" />
                      <circle className="text-indigo-500" cx="64" cy="64" r="56" fill="transparent" stroke="url(#gradRing)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray="351.86"
                      strokeDashoffset={351.86 - (351.86 * (analysis.code_quality_score || 0) / 100)}
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                      <defs>
                         <linearGradient id="gradRing" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                         </linearGradient>
                      </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{Math.round(analysis.code_quality_score || 0)}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 text-center leading-tight">Repo<br/>Score</span>
                  </div>
              </div>
            </div>
          </div>

          {/* Score Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Code Quality */}
            <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-5 rounded-[1rem] text-center">
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Code Quality</div>
               <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3">{Math.round(analysis.code_quality_score || 0)}</div>
               <div className="h-1.5 bg-indigo-500/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" style={{ width: `${analysis.code_quality_score || 0}%` }}></div>
               </div>
            </div>
            
            {/* Complexity */}
            <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-5 rounded-[1rem] text-center flex flex-col items-center justify-center">
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Complexity</div>
               <div className="px-4 py-1.5 border border-indigo-500/30 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-sm">
                  {analysis.complexity_level || '—'}
               </div>
            </div>

            {/* Skill Match */}
            <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-5 rounded-[1rem] text-center">
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Skill Match</div>
               <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3">{analysis.skill_match_score || '—'}</div>
               <div className="h-1.5 bg-indigo-500/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000" style={{ width: `${analysis.skill_match_score || 0}%` }}></div>
               </div>
            </div>

            {/* Dev Score */}
            <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-5 rounded-[1rem] text-center">
               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Dev Score</div>
               <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 mb-3">{analysis.dev_score || '—'}</div>
               <div className="h-1.5 bg-indigo-500/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-1000" style={{ width: `${analysis.dev_score || 0}%` }}></div>
               </div>
            </div>
          </div>

          {/* Details Grid (Two-Column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Tech Stack */}
             <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-6 rounded-[1rem] h-full">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                   <span>🛠️</span> Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                   {(analysis.technology_stack || []).map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-100 font-medium hover:bg-indigo-500/20 transition-colors">
                         {tech}
                      </span>
                   ))}
                   {!(analysis.technology_stack?.length > 0) && <span className="text-slate-500 text-sm">No stack info available.</span>}
                </div>
             </div>

             {/* Architecture */}
             <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-6 rounded-[1rem] h-full">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                   <span>🏗️</span> Architecture
                </h3>
                <div className="mb-3">
                   <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold text-xs">
                      {analysis.architecture_pattern || 'Pattern Not Identified'}
                   </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                   {analysis.analysis_explanation || analysis.code_quality_explanation || 'No architectural explanation provided.'}
                </p>
             </div>

             {/* Required Skills */}
             <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-6 rounded-[1rem] h-full">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                   <span>🎯</span> Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                   {(analysis.required_skills || analysis.technology_stack || []).map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs text-cyan-100 font-medium hover:bg-cyan-500/20 transition-colors">
                         {skill}
                      </span>
                   ))}
                   {!(analysis.required_skills?.length > 0) && !(analysis.technology_stack?.length > 0) && <span className="text-slate-500 text-sm">No specific skills listed.</span>}
                </div>
             </div>

             {/* Contribution Opportunities */}
             <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-6 rounded-[1rem] h-full">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                   <span>🤝</span> Contribution Opportunities
                </h3>
                <ul className="space-y-2">
                   {(analysis.contribution_opportunities || []).slice(0, 4).map((opp, i) => (
                      <li key={i} className="p-3 bg-black/20 border-l-2 border-indigo-500 rounded-r-md text-sm text-slate-300">
                         {typeof opp === 'string' ? opp : opp.title || opp.description}
                      </li>
                   ))}
                   {!(analysis.contribution_opportunities?.length > 0) && <li className="text-slate-500 text-sm">No opportunities found.</li>}
                </ul>
             </div>
          </div>
          
          {/* Full Analysis / Scoring Breakdown */}
          <div className="bg-[#111128]/80 backdrop-blur-md border border-indigo-500/10 p-6 rounded-[1rem]">
              <h3 className="text-sm font-bold text-white mb-4">📝 Full Analysis & Scoring</h3>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {analysis.full_analysis || analysis.analysis_explanation || analysis.code_quality_explanation || 'Detailed analysis not available.'}
              </p>
          </div>

          {/* New Analysis Button */}
          <div className="text-center pt-6">
            <button
              onClick={() => { navigate('/deep-analysis'); }}
              className="px-6 py-2.5 bg-surface-container-high hover:bg-surface-bright text-primary border border-primary/20 rounded-full font-bold transition-all text-sm inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Analyze Another Repository
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AnalysisResult;
