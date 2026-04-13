import { useState } from 'react';
import { Link } from 'react-router-dom';
import MatchScoreDonut from '../components/MatchScoreDonut';
import Footer from '../components/Footer';

const Candidates = () => {
  const [viewMode, setViewMode] = useState('list');

  // Placeholder data — will be connected to backend
  const candidates = [
    { username: 'averidian', name: 'Alex Veridian', location: 'SF, California', score: 94, tier: 'EXCEPTIONAL', stack: ['Rust', 'Distributed Systems', 'WebAssembly'], verified: true },
    { username: 'schen_dev', name: 'Sarah Chen', location: 'Toronto, ON', score: 82, tier: 'STRONG MATCH', stack: ['Next.js', 'TypeScript', 'GraphQL'], verified: true },
    { username: 'thor_m', name: 'Marcus Thorne', location: 'Berlin, Germany', score: 50, tier: 'POTENTIAL', stack: ['Kubernetes', 'AWS', 'Python'], verified: false },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10 relative">
      {/* Decorative Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[128px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 -left-24 w-64 h-64 bg-secondary/10 blur-[96px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-white font-headline">Candidate Analysis</h2>
            <p className="text-on-surface-variant mt-2 text-lg">Batch #842 • Q3 Engineering Talent Pipeline</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-surface-container-low p-1.5 rounded-[1rem] flex gap-1">
              <button className="bg-surface-container-high text-white px-4 py-2 rounded-[1rem] text-sm font-semibold shadow-sm">List View</button>
              <button className="text-on-surface-variant px-4 py-2 rounded-[1rem] text-sm font-medium hover:bg-surface-container-high transition-colors">Grid View</button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-surface-container-low rounded-[1rem]">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-outline">Minimum Match %</label>
            <select className="w-full bg-surface-container-lowest border-none rounded-[1rem] text-on-surface text-sm focus:ring-primary/20 py-2.5">
              <option>85% and above</option>
              <option>70% and above</option>
              <option>All candidates</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-outline">Primary Role</label>
            <select className="w-full bg-surface-container-lowest border-none rounded-[1rem] text-on-surface text-sm focus:ring-primary/20 py-2.5">
              <option>Full Stack Developer</option>
              <option>DevOps Engineer</option>
              <option>Data Scientist</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-outline">Skill Cluster</label>
            <div className="flex flex-wrap gap-1">
              <span className="bg-tertiary-container/30 text-tertiary-fixed px-2 py-1 rounded text-[10px] font-bold uppercase">React</span>
              <span className="bg-secondary-container/30 text-secondary px-2 py-1 rounded text-[10px] font-bold uppercase">Node</span>
            </div>
          </div>
          <div className="flex items-end">
            <button className="w-full py-2.5 bg-surface-container-highest text-white rounded-[1rem] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-bright transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* List View */}
      <div className="flex flex-col gap-6 relative z-10">
        {/* Row Header */}
        <div className="hidden md:grid grid-cols-12 px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-outline opacity-70">
          <div className="col-span-4">Candidate Profile</div>
          <div className="col-span-2 text-center">Match Score</div>
          <div className="col-span-4">Primary Stack</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Candidate Cards */}
        {candidates.map((candidate, i) => (
          <div key={i} className="group relative bg-surface-container-low rounded-[1rem] p-6 flex flex-col md:grid md:grid-cols-12 items-center hover:bg-surface-container transition-all duration-300">
            {/* Profile */}
            <div className="col-span-4 flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-xl font-bold text-on-surface-variant grayscale group-hover:grayscale-0 transition-all duration-500">
                  {candidate.name[0]}
                </div>
                {candidate.verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-tertiary-container border-4 border-surface-container-low rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{candidate.name}</h3>
                <p className="text-outline text-sm">@{candidate.username} • {candidate.location}</p>
              </div>
            </div>

            {/* Match Score */}
            <div className="col-span-2 flex flex-col items-center">
              <MatchScoreDonut score={candidate.score} size={56} />
              <span className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                candidate.score >= 85 ? 'bg-primary-container/20 text-primary' :
                candidate.score >= 70 ? 'bg-secondary-container/20 text-secondary' :
                'bg-outline/20 text-outline'
              }`}>
                {candidate.tier}
              </span>
            </div>

            {/* Stack */}
            <div className="col-span-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {candidate.stack.map((tech, j) => (
                <span key={j} className="px-3 py-1 bg-surface-container-highest rounded-md text-xs font-semibold text-tertiary-fixed border border-tertiary/10">
                  {tech}
                </span>
              ))}
            </div>

            {/* Action */}
            <div className="col-span-2 flex justify-end">
              <Link
                to={`/candidates/${candidate.username}`}
                className="bg-surface-bright text-white px-6 py-3 rounded-[1rem] font-bold text-sm flex items-center gap-2 group-hover:bg-gradient-to-r group-hover:from-primary-container group-hover:to-secondary-container transition-all"
              >
                View Details
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-between relative z-10">
        <div className="text-sm text-outline font-medium">
          Showing <span className="text-white">1-3</span> of <span className="text-white">128</span> matched developers
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-[0.75rem] bg-surface-container-low border border-outline-variant/10 text-white hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="px-4 h-10 flex items-center justify-center rounded-[0.75rem] bg-primary-container text-white font-bold text-sm">1</button>
          <button className="px-4 h-10 flex items-center justify-center rounded-[0.75rem] bg-surface-container-low border border-outline-variant/10 text-white hover:bg-surface-container-high transition-colors">2</button>
          <button className="px-4 h-10 flex items-center justify-center rounded-[0.75rem] bg-surface-container-low border border-outline-variant/10 text-white hover:bg-surface-container-high transition-colors">3</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-[0.75rem] bg-surface-container-low border border-outline-variant/10 text-white hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Candidates;
