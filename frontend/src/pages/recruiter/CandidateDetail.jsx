import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecruiterProfile, useRecruiterAddToShortlist } from '../../hooks/useApi';

const CandidateDetail = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { data: profilePkg, isLoading, isError } = useRecruiterProfile(username);
    const { mutate: addToShortlist, status: shortlistStatus } = useRecruiterAddToShortlist();

    const basic = profilePkg?.data?.basic;
    const analysis = profilePkg?.data?.analysis;

    const handleShortlist = () => {
        if (!basic) return;
        addToShortlist({
            candidate_username: basic.login,
            score: analysis?.matchScore || 0,
            skills: analysis?.skills || [],
            repo_count: basic.public_repos || 0,
            candidate_data: basic
        });
    };

    if (isLoading) {
        return (
            <div className="p-8 space-y-8 animate-pulse">
                <div className="h-12 w-64 bg-surface-container rounded-full"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 border border-outline-variant/20 rounded-3xl h-96 bg-surface-container"></div>
                    <div className="col-span-2 space-y-6">
                        <div className="h-48 bg-surface-container border border-outline-variant/20 rounded-3xl"></div>
                        <div className="h-48 bg-surface-container border border-outline-variant/20 rounded-3xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !basic) {
        return <div className="p-8 text-red-400">Failed to load profile.</div>;
    }

    return (
        <div className="p-8 pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex gap-6 items-center">
                    <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-white">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight font-headline uppercase text-white truncate max-w-sm">
                            {basic.login}
                        </h1>
                        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                            Deep AI Profile Evaluation
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <a href={basic.html_url} target="_blank" rel="noreferrer" className="bg-surface-container-high hover:bg-white/10 px-6 py-3 rounded-full uppercase tracking-widest text-xs font-black transition-colors flex items-center gap-2">
                        <span>GitHub</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                    <button 
                        onClick={handleShortlist}
                        disabled={shortlistStatus === 'pending' || shortlistStatus === 'success'}
                        className={`px-8 py-3 rounded-full uppercase tracking-widest text-xs font-black transition-all shadow-xl flex items-center gap-2 ${
                            shortlistStatus === 'success' ? 'bg-emerald-500 text-white border-0' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">bookmark</span>
                        <span>{shortlistStatus === 'success' ? 'Shortlisted' : 'Add to Shortlist'}</span>
                    </button>
                </div>
            </div>

            {profilePkg.status === 'degraded' && (
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 mb-8 text-orange-200">
                    <p className="font-bold">Partial Data Active:</p>
                    <p className="text-sm">{profilePkg.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col - Identity */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-xl text-center">
                        <img src={basic.avatar_url} alt={basic.login} className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-high shadow-xl mx-auto mb-6" />
                        <h2 className="text-xl font-headline font-black uppercase text-white tracking-widest">{basic.name || basic.login}</h2>
                        <div className="mt-4 inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold px-4 py-2 rounded-full font-label min-w-48">
                            Match Score: {analysis?.matchScore || 0}
                        </div>
                    </div>

                    <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-xl">
                        <h3 className="text-xs font-bold font-headline uppercase text-slate-500 tracking-widest border-b border-outline-variant/10 pb-4 mb-4">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis?.skills?.map((skill, i) => (
                                <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col - Analysis */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 shadow-xl">
                        <h3 className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-indigo-400">psychology</span>
                            <span className="text-lg font-headline font-black tracking-widest uppercase">AI Synthesis</span>
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed font-body">
                            {analysis?.aiSentiment || "No detailed AI Synthesis generated due to degraded data or timeout."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 shadow-xl">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Code Velocity</p>
                            <p className="text-2xl font-black font-headline text-white">{analysis?.matrix?.codeVelocity || "N/A"}</p>
                        </div>
                        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 shadow-xl">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Review Impact</p>
                            <p className="text-2xl font-black font-headline text-white">{analysis?.matrix?.reviewImpact || "N/A"}</p>
                        </div>
                        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 shadow-xl">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Mentorship</p>
                            <p className="text-2xl font-black font-headline text-emerald-400">{analysis?.matrix?.mentorship || "N/A"}</p>
                        </div>
                        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/20 shadow-xl">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Stability</p>
                            <p className="text-2xl font-black font-headline text-indigo-400">{analysis?.matrix?.stability || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetail;
