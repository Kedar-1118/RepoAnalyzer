import { useProfile, useRecommendations } from '../hooks/useApi';
import StatsCard from '../components/StatsCard';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: recsData, isLoading: recsLoading } = useRecommendations();
  const recommendations = recsData?.recommendations || recsData || [];

  const recentMatches = recommendations.slice(0, 6);
  const skills = profile?.skills || profile?.tech_stack || [];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Hero Header */}
      <section className="relative">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
          System Synthesis
        </h1>
        <p className="text-on-surface-variant text-lg font-body">
          Architectural Overview & Global Connectivity
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon="monitor_heart" label="Health Score" value={profile ? '94.2' : '--'} trend="+2.1%" iconColorClass="text-secondary" bgColorClass="bg-secondary/10" />
        <StatsCard icon="handshake" label="Active Matches" value={recommendations.length} trend="+12" iconColorClass="text-primary" bgColorClass="bg-primary/10" />
        <StatsCard icon="code" label="Code Coverage" value="88%" iconColorClass="text-tertiary" bgColorClass="bg-tertiary/10" />
        <StatsCard icon="hub" label="Network Nodes" value={profile?.public_repos || 0} iconColorClass="text-primary-dim" bgColorClass="bg-primary-dim/10" />
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Synchronizations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">sync</span>
              <h2 className="text-xl font-headline font-bold">Recent Synchronizations</h2>
            </div>
            <button className="text-xs text-primary font-bold uppercase tracking-widest hover:underline font-label">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recsLoading ? (
              <div className="flex justify-center py-12">
                <div className="loader"></div>
              </div>
            ) : recentMatches.length > 0 ? (
              recentMatches.map((repo, i) => (
                <div key={i} className="group bg-surface-container-low rounded-[1rem] p-6 hover:bg-surface-container-high transition-all flex items-center gap-6">
                  {/* Gradient Icon */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${i % 2 === 0 ? 'rgba(159,167,255,0.15)' : 'rgba(193,128,255,0.15)'}, transparent)` }}>
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {i % 3 === 0 ? 'architecture' : i % 3 === 1 ? 'database' : 'terminal'}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {repo.full_name || repo.name}
                    </h3>
                    <p className="text-sm text-on-surface-variant truncate">{repo.description || 'No description available'}</p>
                  </div>
                  {/* Match Score */}
                  <div className="hidden sm:flex flex-col items-center gap-1">
                    <span className="text-2xl font-headline font-black text-secondary">
                      {repo.match_score ? `${Math.round(repo.match_score)}%` : `${85 + (i * 2)}%`}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-wider">Compatibility</span>
                  </div>
                  {/* Arrow */}
                  <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-4 block">explore</span>
                <p>No matches yet. Start analyzing repositories!</p>
              </div>
            )}
          </div>
        </div>

        {/* Architect Profile Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-[1rem] p-8 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-tertiary/10 blur-[60px] pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              {profile?.avatar_url && (
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30">
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-on-surface">{profile?.login || 'Architect'}</h3>
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label">
                  Core Mastery: 84%
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-label text-on-surface-variant uppercase tracking-widest font-bold">
                Skillset Dominance
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skills.length > 0 ? skills.slice(0, 6) : ['JavaScript', 'React', 'Node.js', 'Python']).map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter border border-primary/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Intelligence Bars */}
            <div className="space-y-4 mb-8">
              <h4 className="text-xs font-label text-on-surface-variant uppercase tracking-widest font-bold">
                System Intelligence
              </h4>
              {[
                { label: 'Algorithm Efficiency', value: 92, color: 'bg-primary' },
                { label: 'Concurrency', value: 78, color: 'bg-tertiary' },
                { label: 'Security', value: 85, color: 'bg-secondary' },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-on-surface-variant font-bold uppercase tracking-widest">{bar.label}</span>
                    <span className="text-on-surface font-bold">{bar.value}%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} rounded-full transition-all duration-700`} style={{ width: `${bar.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Analysis
            </button>
          </div>
        </div>
      </section>

      {/* Floating FAB */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)' }}
        >
          <span className="material-symbols-outlined text-white">add</span>
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
