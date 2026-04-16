import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecruiterProfile } from '../../hooks/useApi';

const Reports = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    // Reuses the fetch pipeline
    const { data: reportPkg, isLoading, isError } = useRecruiterProfile(username);

    if (!username) {
        return (
            <div className="p-8 text-center text-slate-400">
                <p>Please select a candidate from your shortlist to view their exportable report.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="p-8 text-slate-400 font-bold animate-pulse">Generating Report...</div>;
    }

    if (isError || !reportPkg?.data?.basic) {
        return <div className="p-8 text-red-400">Failed to generate report.</div>;
    }

    const { basic, analysis } = reportPkg.data;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 bg-white min-h-screen text-slate-900 rounded-3xl mt-8">
            <div className="flex justify-between items-start border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 mb-2">
                        {basic.name || basic.login}
                    </h1>
                    <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
                        Technical Evaluation Report
                    </p>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="print:hidden bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 hover:bg-slate-700 transition"
                >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    Export PDF
                </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xs font-bold font-headline uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2 mb-4">Metadata</h3>
                    <ul className="space-y-4 font-body font-medium text-slate-700 text-sm">
                        <li><strong>GitHub:</strong> {basic.login}</li>
                        <li><strong>Repositories:</strong> {basic.public_repos}</li>
                        <li><strong>Followers:</strong> {basic.followers}</li>
                        <li><strong>Match Score:</strong> {analysis?.matchScore || 0}/100</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xs font-bold font-headline uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2 mb-4">Core Competencies</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis?.skills?.map((skill, i) => (
                            <span key={i} className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-200">
                <h3 className="text-xs font-bold font-headline uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2 mb-4">Executive Synthesis</h3>
                <p className="text-slate-700 text-base leading-relaxed font-body">
                    {analysis?.aiSentiment || "No detailed AI Synthesis generated due to degraded data or timeout."}
                </p>
            </div>

            <div className="pt-8 border-t border-slate-200">
                <h3 className="text-xs font-bold font-headline uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-2 mb-4">KPI Matrix</h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Code Velocity</p>
                        <p className="text-xl font-black">{analysis?.matrix?.codeVelocity || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Review Impact</p>
                        <p className="text-xl font-black">{analysis?.matrix?.reviewImpact || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Mentorship</p>
                        <p className="text-xl font-black">{analysis?.matrix?.mentorship || "N/A"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Stability</p>
                        <p className="text-xl font-black">{analysis?.matrix?.stability || "N/A"}</p>
                    </div>
                </div>
            </div>

            <div className="pt-16 pb-8 text-center print:pt-32">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">
                    Generated via OpenPulse AI Engine
                </p>
                <div className="mt-4 flex justify-center gap-4 print:hidden">
                     <button onClick={() => navigate(-1)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-widest underline">
                        Return
                     </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
