import { useProfile, useSavedRepos } from '../hooks/useApi';
import Footer from '../components/Footer';

const Profile = () => {
  const { data: profile, isLoading } = useProfile();
  const { data: savedRepos } = useSavedRepos();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="loader"></div></div>;
  }

  const skills = profile?.skills || profile?.tech_stack || ['JavaScript', 'React', 'Node.js', 'Python'];
  const saved = (savedRepos?.repositories || savedRepos || []).slice(0, 4);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Profile Header Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 glass-card rounded-[1rem] p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[1rem] overflow-hidden ring-4 ring-indigo-500/20 shadow-2xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.login} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-3xl font-bold">{profile?.login?.[0]}</div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary-container text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">PRO</div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">{profile?.name || profile?.login}</h1>
            <p className="text-indigo-400 font-medium mb-4">{profile?.bio || 'Open Source Contributor'}</p>
            <p className="text-on-surface-variant max-w-lg leading-relaxed mb-6">
              {profile?.bio || 'Building the next generation of software. Passionate about open source and connecting talent with impactful projects.'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
              {profile?.location && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.blog && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">link</span>
                  <span className="text-indigo-400">{profile.blog}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                <span>Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Matchmaker Stats */}
        <div className="glass-card rounded-[1rem] p-8 flex flex-col justify-between bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Matchmaker Stats</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-black text-white">94%</p>
                  <p className="text-xs text-slate-400">Contribution Match Score</p>
                </div>
                <span className="material-symbols-outlined text-indigo-400 text-4xl">analytics</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-black text-white">{profile?.public_repos || 0}</p>
                  <p className="text-xs text-slate-400">Active Repositories</p>
                </div>
                <span className="material-symbols-outlined text-purple-400 text-4xl">rocket_launch</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-full text-sm font-semibold transition-all border border-white/10">
            View Public Profile
          </button>
        </div>
      </section>

      {/* Skills & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* My Skills + Contribution History */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* My Skills */}
          <section className="glass-card rounded-[1rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold tracking-tight">My Skills</h2>
              <button className="text-indigo-400 text-sm font-semibold flex items-center gap-1 hover:text-indigo-300 transition-all">
                <span className="material-symbols-outlined text-lg">edit</span>
                Manage Skills
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <div key={i} className={`px-4 py-2 rounded-[0.75rem] flex items-center gap-3 group ${
                  i % 3 === 0 ? 'bg-indigo-500/10 border border-indigo-500/20' :
                  i % 3 === 1 ? 'bg-purple-500/10 border border-purple-500/20' :
                  'bg-slate-800/50 border border-white/5'
                }`}>
                  <span className={`font-medium ${
                    i % 3 === 0 ? 'text-indigo-300' : i % 3 === 1 ? 'text-purple-300' : 'text-slate-300'
                  }`}>{skill}</span>
                  <button className="text-slate-500 hover:text-red-400 transition-opacity">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
              <button className="px-4 py-2 border border-dashed border-slate-700 rounded-[0.75rem] text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                <span className="text-sm font-medium">Add Skill</span>
              </button>
            </div>
          </section>

          {/* Contribution History */}
          <section className="glass-card rounded-[1rem] p-8 flex-1">
            <h2 className="text-xl font-bold tracking-tight mb-8">Contribution History</h2>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500 via-slate-800 to-transparent"></div>
              {[
                { title: 'Profile Updated', time: 'Recently', desc: 'Synced GitHub profile data', color: 'bg-indigo-500' },
                { title: 'Skills Added', time: '1 week ago', desc: 'Updated tech stack preferences', color: 'bg-slate-700' },
                { title: 'Joined Platform', time: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Earlier', desc: 'Created OS Matchmaker account', color: 'bg-slate-700' },
              ].map((item, i) => (
                <div key={i} className="relative pl-10">
                  <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full ${item.color} ${i === 0 ? 'ring-4 ring-indigo-500/20' : ''}`}></div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-on-surface">{item.title}</h4>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Saved Repositories */}
        <div className="lg:col-span-7">
          <section className="glass-card rounded-[1rem] p-8 h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold tracking-tight">Saved Repositories</h2>
              <a href="/saved" className="text-indigo-400 text-sm font-semibold hover:underline">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {saved.length > 0 ? saved.map((repo, i) => (
                <div key={i} className="bg-surface-container-low rounded-[1rem] p-6 hover:bg-surface-container-high transition-all group cursor-pointer border border-transparent hover:border-indigo-500/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-[0.75rem] flex items-center justify-center ${
                      i % 3 === 0 ? 'bg-indigo-500/10 text-indigo-400' : i % 3 === 1 ? 'bg-purple-500/10 text-purple-400' : 'bg-teal-500/10 text-teal-400'
                    }`}>
                      <span className="material-symbols-outlined text-3xl">terminal</span>
                    </div>
                    <button className="text-indigo-500">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                    </button>
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">{repo.name || repo.full_name}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">{repo.description || 'No description'}</p>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span>{repo.stargazers_count?.toLocaleString() || '—'}</span>
                    </div>
                  </div>
                </div>
              )) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-surface-container-low rounded-[1rem] p-6 border border-dashed border-outline-variant/20 flex items-center justify-center min-h-[160px]">
                    <p className="text-sm text-on-surface-variant">No saved repos yet</p>
                  </div>
                ))
              )}
            </div>

            {/* CTA Banner */}
            <div className="mt-12 p-6 rounded-[1rem] bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Looking for more matches?</h4>
                <p className="text-sm text-indigo-300">Our engine has found new repos that match your skills.</p>
              </div>
              <button
                onClick={() => window.location.href = '/recommendations'}
                className="whitespace-nowrap px-6 py-2.5 bg-indigo-500 text-white rounded-full font-bold text-sm hover:bg-indigo-400 transition-all"
              >
                Explore Matches
              </button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
