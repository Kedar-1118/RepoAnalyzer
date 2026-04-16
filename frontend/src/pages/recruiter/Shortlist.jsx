import React from 'react';
import { Link } from 'react-router-dom';
import { useRecruiterShortlist, useRecruiterRemoveFromShortlist } from '../../hooks/useApi';

const Shortlist = () => {
    const { data: shortlistPkg, isLoading } = useRecruiterShortlist();
    const { mutate: remove } = useRecruiterRemoveFromShortlist();

    if (isLoading) {
        return <div className="p-8 text-slate-400 font-bold animate-pulse">Loading shortlist...</div>;
    }

    const items = shortlistPkg?.data || [];

    return (
        <div className="p-8 space-y-8 h-full">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight font-headline uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Decision Pipeline
                </h1>
                <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                    Your Shortlisted Talent
                </p>
            </div>

            {items.length === 0 ? (
                <div className="bg-surface-container rounded-3xl p-16 text-center border border-outline-variant/20">
                    <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 inline-block">bookmark_border</span>
                    <h2 className="text-xl font-headline font-black uppercase tracking-widest text-white mb-2">Empty Shortlist</h2>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">You haven't bookmarked any candidates yet. Go discover candidates and evaluate them.</p>
                    <Link to="/recruiter/search" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full text-xs font-black tracking-widest uppercase transition-colors">
                        Search Candidates
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-outline-variant/20 shadow-xl bg-surface-container">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-high border-b border-outline-variant/20">
                                <th className="px-6 py-4 text-xs tracking-widest uppercase text-slate-400 font-black">Candidate</th>
                                <th className="px-6 py-4 text-xs tracking-widest uppercase text-slate-400 font-black">Score</th>
                                <th className="px-6 py-4 text-xs tracking-widest uppercase text-slate-400 font-black text-center">Skills</th>
                                <th className="px-6 py-4 text-xs tracking-widest uppercase text-slate-400 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            {items.map((item) => (
                                <tr key={item.candidate_username} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface flex-shrink-0 ring-2 ring-outline-variant/20">
                                                <img src={item.candidate_data?.avatar_url} alt={item.candidate_username} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <Link to={`/recruiter/profile/${item.candidate_username}`} className="text-lg font-headline font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-widest block">
                                                    {item.candidate_username}
                                                </Link>
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                    {item.repo_count} Repositories
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm font-black font-label">
                                            {item.score}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
                                            {item.skills?.slice(0, 3).map((s, i) => (
                                                <span key={i} className="text-xs bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider">{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/recruiter/reports/${item.candidate_username}`} className="w-10 h-10 rounded-full border border-indigo-500/50 hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center transition-colors shadow-lg">
                                                <span className="material-symbols-outlined text-[18px]">summarize</span>
                                            </Link>
                                            <button 
                                                onClick={() => remove(item.candidate_username)}
                                                className="w-10 h-10 rounded-full border border-red-500/50 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors shadow-lg"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Shortlist;
