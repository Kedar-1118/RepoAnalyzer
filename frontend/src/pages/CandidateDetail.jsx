import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';

const CandidateDetail = () => {
  const { username } = useParams();

  // Placeholder data — will be connected to backend candidate analysis API
  const candidate = {
    name: 'Alex Thorne',
    username: username || 'athorne',
    title: 'Principal Systems Architect',
    matchScore: 98,
    skills: ['Rust-Expert', 'WASM-Master', 'K8s-Native'],
    aiSentiment: 'Candidate demonstrates exceptional cognitive flexibility in distributed systems. Code entropy is remarkably low (0.04), indicating highly maintainable architectural patterns.',
    matrix: {
      codeVelocity: 'Top 1%',
      reviewImpact: '94.2',
      mentorship: 'Gold',
      stability: '99.8%',
    },
    repos: [
      { name: 'Vortex-DB', lang: 'C++ / Rust', desc: 'A high-performance columnar storage engine with SIMD acceleration and Lock-free concurrency primitives.', stars: '1.2k', forks: '240', icon: 'terminal', color: 'text-primary' },
      { name: 'Neutron-Mesh', lang: 'Go / eBPF', desc: 'Service mesh sidecarless architecture utilizing eBPF for zero-trust networking and observability.', stars: '3.5k', forks: '512', icon: 'hub', color: 'text-tertiary' },
      { name: 'Aether-UI', lang: 'TypeScript', desc: 'A declarative graphics library for building complex, GPU-accelerated web dashboards.', stars: '920', forks: '82', icon: 'deployed_code', color: 'text-secondary' },
    ],
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Hero Candidate Section */}
      <section className="relative overflow-visible">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-20 -left-20 w-64 h-64 bg-tertiary/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
          {/* Profile Card */}
          <div className="w-full md:w-1/3 glass-panel rounded-[1rem] p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full p-1" style={{ background: 'linear-gradient(135deg, #9fa7ff, #62fae3, #c180ff)' }}>
                <div className="w-full h-full rounded-full border-4 border-surface bg-surface-container-high flex items-center justify-center">
                  <span className="text-4xl font-black text-on-surface-variant">{candidate.name[0]}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Verified</div>
            </div>

            <h1 className="text-3xl font-headline font-extrabold tracking-tighter text-on-surface mb-1">{candidate.name}</h1>
            <p className="text-sm font-label text-on-surface-variant uppercase tracking-widest mb-6">{candidate.title}</p>

            {/* Match Quality Bar */}
            <div className="w-full space-y-4 mb-8">
              <div className="flex justify-between items-center text-xs font-label">
                <span className="text-on-surface-variant uppercase">Match Quality</span>
                <span className="text-secondary font-bold">{candidate.matchScore}% Perfect</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full shadow-[0_0_10px_#62fae3]" style={{ width: `${candidate.matchScore}%` }}></div>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button className="flex-1 font-headline font-bold py-3 rounded-full hover:scale-105 transition-transform text-sm" style={{ background: 'linear-gradient(45deg, #9fa7ff, #8d98ff)', color: '#000' }}>
                Hire Now
              </button>
              <button className="p-3 border border-outline-variant/30 rounded-full hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-primary">bookmark</span>
              </button>
            </div>
          </div>

          {/* Scores & Insights */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Depth */}
            <div className="bg-surface-container-low rounded-[1rem] p-8 border border-outline-variant/5">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1">Technical Depth</h3>
                  <p className="text-3xl font-headline font-extrabold text-on-surface">Architectural Grade</p>
                </div>
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle className="text-surface-container-highest" cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" />
                    <circle className="text-primary" cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="175" strokeDashoffset="30" />
                  </svg>
                  <span className="absolute text-sm font-black text-primary">82</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, i) => (
                  <span key={i} className={`px-4 py-1.5 bg-surface-container-highest text-[10px] font-bold rounded-full uppercase tracking-widest border ${
                    i === 0 ? 'text-secondary border-secondary/10' : i === 1 ? 'text-tertiary border-tertiary/10' : 'text-primary border-primary/10'
                  }`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Sentiment */}
            <div className="glass-panel rounded-[1rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-tertiary">psychology</span>
              </div>
              <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1">AI Sentiment Analysis</h3>
              <p className="text-sm italic leading-relaxed text-on-surface/80 relative z-10">
                "{candidate.aiSentiment}"
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Growth Vector: Optimized</span>
              </div>
            </div>

            {/* Contribution Matrix */}
            <div className="md:col-span-2 bg-surface-container-low rounded-[1rem] p-8 border border-outline-variant/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">Contribution Matrix</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase">Logic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase">System</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(candidate.matrix).map(([key, value]) => (
                  <div key={key} className="p-4 bg-surface-container-high rounded-[1rem] border border-outline-variant/10">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-headline font-black text-on-surface">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repo Masterpieces */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Repo Masterpieces</h2>
          <p className="text-sm font-label text-on-surface-variant uppercase tracking-widest mb-1">Curated from 84 Repositories</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {candidate.repos.map((repo, i) => (
            <div key={i} className={`bg-surface-container-low rounded-[1rem] p-8 border border-outline-variant/10 hover:border-${i === 0 ? 'primary' : i === 1 ? 'tertiary' : 'secondary'}/30 transition-all group`}>
              <div className="flex justify-between items-start mb-6">
                <span className={`material-symbols-outlined ${repo.color} text-3xl`}>{repo.icon}</span>
                <div className="text-right">
                  <span className="block text-xl font-headline font-bold text-on-surface tracking-tight">{repo.name}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{repo.lang}</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-8">{repo.desc}</p>
              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">
                    <span className="material-symbols-outlined text-xs">star</span> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">
                    <span className="material-symbols-outlined text-xs">fork_right</span> {repo.forks}
                  </span>
                </div>
                <span className={`material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity ${repo.color}`}>arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Command Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-4 rounded-full flex items-center gap-8 shadow-2xl border border-white/10">
        <button className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">bolt</span>
          <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface/80">Compare</span>
        </button>
        <div className="h-6 w-[1px] bg-outline-variant/30"></div>
        <button className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">share</span>
          <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface/80">Export</span>
        </button>
        <div className="h-6 w-[1px] bg-outline-variant/30"></div>
        <button className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">mail</span>
          <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface/80">Connect</span>
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default CandidateDetail;
