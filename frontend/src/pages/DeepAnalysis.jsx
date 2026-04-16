import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const DeepAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialRepoUrl = useRef(location.state?.repoUrl || '');
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl.current);
  const [skills, setSkills] = useState('');

  useEffect(() => {
    const url = initialRepoUrl.current;
    if (url) {
      // Clear navigation state so refresh doesn't re-trigger
      window.history.replaceState({}, document.title);
      navigate(`/analysis-result?url=${encodeURIComponent(url)}&skills=`);
    }
  }, [navigate]);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (repoUrl) {
      navigate(`/analysis-result?url=${encodeURIComponent(repoUrl)}&skills=${encodeURIComponent(skills)}`);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Search Section */}
      <section className="relative py-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">
          Repository <span className="text-primary italic">Analysis</span>
        </h1>
        <p className="text-on-surface-variant text-lg mb-8 max-w-xl">
          Enter a GitHub repository URL to trigger our RAG-powered deep analysis engine.
        </p>

        <form onSubmit={handleAnalyze} className="space-y-4 max-w-2xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-[1rem] blur opacity-75 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative bg-surface-container-low rounded-[1rem] p-1">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="w-full bg-transparent border-0 focus:ring-0 text-on-surface placeholder-slate-600 font-label text-sm px-6 py-4"
              />
            </div>
          </div>
          <div className="relative bg-surface-container-low rounded-[1rem]">
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Your skills (optional): React, Python, Rust..."
              className="w-full bg-transparent border-0 focus:ring-0 text-on-surface placeholder-slate-600 font-label text-sm px-6 py-4 rounded-[1rem]"
            />
          </div>
          <button
            type="submit"
            disabled={!repoUrl}
            className="px-8 py-4 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
          >
            <span className="material-symbols-outlined text-lg">rocket_launch</span>
            Start Analysis
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default DeepAnalysis;
