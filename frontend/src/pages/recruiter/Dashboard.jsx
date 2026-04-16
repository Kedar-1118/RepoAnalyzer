import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Dashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight font-headline uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Recruiter Overview
                </h1>
                <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
                    Welcome back, {user?.login || 'Recruiter'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 shadow-xl flex flex-col justify-between">
                    <div>
                        <span className="material-symbols-outlined text-4xl text-indigo-400 mb-4 block">search</span>
                        <h2 className="text-xl font-black font-headline tracking-tighter uppercase mb-2">Hire Your Next Engineer</h2>
                        <p className="text-sm font-medium text-slate-400 pr-12 leading-relaxed">
                            Start discovering developers by filtering languages, commits, and allowing our AI to summarize top repositories.
                        </p>
                    </div>
                    <Link to="/recruiter/search" className="mt-8 inline-block text-center w-full bg-indigo-600 hover:bg-indigo-500 font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-all">
                        Launch Search
                    </Link>
                </div>

                <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/20 shadow-xl flex flex-col justify-between">
                    <div>
                        <span className="material-symbols-outlined text-4xl text-emerald-400 mb-4 block">bookmarks</span>
                        <h2 className="text-xl font-black font-headline tracking-tighter uppercase mb-2">Manage Shortlist</h2>
                        <p className="text-sm font-medium text-slate-400 pr-12 leading-relaxed">
                            Review your saved talent and export final evaluation reports for decision making.
                        </p>
                    </div>
                    <Link to="/recruiter/shortlist" className="mt-8 inline-block text-center w-full border-2 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-all">
                        View Pipeline
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
