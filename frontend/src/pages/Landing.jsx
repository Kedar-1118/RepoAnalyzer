import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Ambient Glows */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-tertiary/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-low rounded-full border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[10px] font-label uppercase tracking-widest text-secondary font-bold">
                AI-Powered Matching Engine
              </span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-headline font-extrabold tracking-tighter leading-[0.9]">
              Discover,{' '}
              <span className="italic text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #9fa7ff 0%, #c180ff 100%)' }}>
                Analyze,
              </span>
              <br />
              and Contribute.
            </h1>

            <p className="text-lg text-on-surface-variant max-w-lg leading-relaxed font-body">
              Our engine maps your contribution signature to high-affinity open source repositories.
              Prioritizing performance, sustainability, and architectural integrity.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                Launch Analyzer
              </Link>
              <button className="px-6 py-4 rounded-full text-sm font-bold border border-outline-variant/20 text-on-surface-variant hover:bg-surface-variant transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">play_circle</span>
                Watch Methodology
              </button>
            </div>
          </div>

          {/* Right — Floating Elements */}
          <div className="relative hidden lg:block">
            {/* Main Glass Sphere */}
            <div className="relative perspective-container">
              <div className="w-80 h-80 mx-auto rounded-full animate-float" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(159, 167, 255, 0.3), rgba(193, 128, 255, 0.1), rgba(6, 14, 32, 0.4))' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-8xl text-primary/40" style={{ fontVariationSettings: "'FILL' 1" }}>
                    hub
                  </span>
                </div>
              </div>

              {/* Floating Badge — Precision Score */}
              <div className="absolute top-8 -left-8 glass-panel p-4 rounded-xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-lg">verified</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label">Precision Score</p>
                    <p className="text-xl font-headline font-black text-secondary">98.4%</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge — Matches Found */}
              <div className="absolute bottom-12 -right-4 glass-panel p-4 rounded-xl animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-surface flex items-center justify-center text-[8px] font-bold">R</div>
                    <div className="w-8 h-8 rounded-full bg-tertiary/30 border-2 border-surface flex items-center justify-center text-[8px] font-bold">T</div>
                    <div className="w-8 h-8 rounded-full bg-secondary/30 border-2 border-surface flex items-center justify-center text-[8px] font-bold">+</div>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label">Matches Found</p>
                    <p className="text-xl font-headline font-black text-primary">1,284</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Feature Grid */}
      <section id="features" className="px-6 lg:px-10 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Deep Repository Analysis — Large */}
          <div className="md:col-span-8 bg-surface-container-low rounded-[1rem] p-8 lg:p-10 relative overflow-hidden group hover:bg-surface-container-high transition-all min-h-[280px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-2">Deep Repository Analysis</h3>
              <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
                Our RAG-powered engine dissects code architecture, contribution patterns, and community health to provide actionable intelligence.
              </p>
            </div>
          </div>

          {/* Mentor Ecosystem */}
          <div className="md:col-span-4 bg-surface-container-low rounded-[1rem] p-8 relative overflow-hidden hover:bg-surface-container-high transition-all flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="material-symbols-outlined text-tertiary text-3xl mb-4 block">group</span>
              <h3 className="text-xl font-headline font-bold mb-2">Mentor Ecosystem</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Connect with maintainers who match your growth trajectory.</p>
            </div>
            <div className="flex -space-x-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/30 border-2 border-surface flex items-center justify-center text-xs font-bold">A</div>
              <div className="w-10 h-10 rounded-full bg-purple-500/30 border-2 border-surface flex items-center justify-center text-xs font-bold">B</div>
              <div className="w-10 h-10 rounded-full bg-teal-500/30 border-2 border-surface flex items-center justify-center text-xs font-bold">C</div>
              <div className="w-10 h-10 rounded-full bg-surface-variant border-2 border-surface flex items-center justify-center text-[8px] font-bold text-on-surface-variant">+12k</div>
            </div>
          </div>

          {/* CLI Tooling */}
          <div className="md:col-span-4 glass-card rounded-[1rem] p-8 hover:bg-surface-container-high transition-all min-h-[220px] flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-secondary text-3xl mb-4 block">terminal</span>
              <h3 className="text-xl font-headline font-bold mb-2">CLI Tooling</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Architect-grade command line tools for batch analysis and automation.</p>
            </div>
          </div>

          {/* Compatibility Meter */}
          <div className="md:col-span-8 bg-surface-container-low rounded-[1rem] p-8 lg:p-10 hover:bg-surface-container-high transition-all min-h-[220px] flex items-center gap-10">
            <div className="flex-1">
              <span className="material-symbols-outlined text-secondary text-3xl mb-4 block">speed</span>
              <h3 className="text-2xl font-headline font-bold mb-2">Compatibility Meter</h3>
              <p className="text-on-surface-variant text-sm max-w-md leading-relaxed">
                Real-time skill matching algorithm that evaluates your contribution potential across thousands of repositories.
              </p>
            </div>
            {/* Donut Visual */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-surface-variant" cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="6" />
                  <circle className="text-secondary" cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray="351.86" strokeDashoffset="63.33" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-headline font-black text-white">82</span>
                  <span className="text-[10px] text-secondary font-bold uppercase">Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-10 max-w-4xl mx-auto pb-32 text-center">
        <h2 className="text-5xl lg:text-6xl font-headline font-extrabold tracking-tighter mb-6">
          Ready to Build the{' '}
          <span className="italic text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #62fae3 0%, #9fa7ff 100%)' }}>
            Future?
          </span>
        </h2>
        <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of developers who've found their perfect open source match. Start your analysis today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/login"
            className="px-10 py-4 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="px-10 py-4 rounded-full font-bold text-sm border border-outline-variant/20 text-on-surface-variant hover:bg-surface-variant transition-all"
          >
            Learn More
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
