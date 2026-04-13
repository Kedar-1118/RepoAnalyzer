import { useState } from 'react';
import Footer from '../components/Footer';

const BulkAnalysis = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');

  const handleStartBatch = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    // Will be connected to backend batch analysis API
    setTimeout(() => setIsProcessing(false), 3000);
  };

  const recentBatches = [
    { id: 1, name: 'Frontend React Masters', profiles: 45, status: 'completed', date: '2 days ago', affinity: 'High' },
    { id: 2, name: 'Node Core Contribs', profiles: 12, status: 'processing', progress: 33, date: '1 hour ago' },
    { id: 3, name: 'Python Data Scientists', profiles: 88, status: 'completed', date: '1 week ago' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-12">
      {/* Top Tabs */}
      <div className="flex items-center gap-8">
        <nav className="flex gap-6">
          <button className="text-slate-400 font-medium pb-2 hover:text-white transition-all border-b-2 border-transparent">Overview</button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`font-bold pb-2 border-b-2 ${activeTab === 'recent' ? 'text-[#4F46E5] border-[#4F46E5]' : 'text-slate-400 border-transparent'}`}
          >Recent Batch</button>
          <button className="text-slate-400 font-medium pb-2 hover:text-white transition-all border-b-2 border-transparent">Archived</button>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-5xl lg:text-6xl font-black font-headline tracking-tighter text-white leading-tight">
            Deep Scan Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Talent Pool.</span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
            Input GitHub handles to trigger our matching engine. We'll analyze commit history, language proficiency, and community impact in seconds.
          </p>

          {/* Textarea */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-[1rem] blur opacity-75 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative bg-surface-container-low rounded-[1rem] p-1 overflow-hidden">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 bg-transparent border-0 focus:ring-0 text-white placeholder-slate-500 font-mono text-sm resize-none p-6 leading-relaxed"
                placeholder={`torvalds\ngaearon\ntj\naddyosmani, sindresorhus, visionmedia...`}
              />
              <div className="flex justify-between items-center px-6 py-4 bg-surface-container-highest/30 backdrop-blur-md rounded-b-[1rem] border-t border-white/5">
                <span className="text-xs text-slate-400 font-label flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">info</span>
                  Supports line breaks or comma-separated lists
                </span>
                <button
                  onClick={handleStartBatch}
                  disabled={isProcessing || !inputText.trim()}
                  className="px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 text-sm"
                  style={{ background: 'linear-gradient(135deg, #8d98ff 0%, #af5cfe 100%)', color: '#000' }}
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
                  Start Batch Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Progress Side Widget */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-low rounded-[1rem] p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16"></div>
            <div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-white font-bold text-xl font-headline">Active Queue</h3>
                  <p className="text-xs text-slate-400 font-label">Processing Backend Batch #429</p>
                </div>
                <span className="text-primary font-black text-2xl font-headline tracking-tighter">74%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-1000" style={{ width: '74%', background: 'linear-gradient(90deg, #9fa7ff, #4cd7f6)' }}></div>
              </div>
            </div>

            {/* Real-time Logs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-label">Real-time Logs</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-surface-container-lowest/50 p-3 rounded-[0.75rem] border border-outline-variant/10">
                  <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse shadow-[0_0_8px_#4cd7f6]"></div>
                  <span className="text-xs font-mono text-slate-300">Fetching @dan_abramov...</span>
                  <span className="text-[10px] text-slate-500 ml-auto">0.2s</span>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-lowest/50 p-3 rounded-[0.75rem] border border-outline-variant/10">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-xs font-mono text-slate-300">Parsing React contribution...</span>
                  <span className="text-[10px] text-slate-500 ml-auto">1.4s</span>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-lowest/50 p-3 rounded-[0.75rem] border border-outline-variant/10 opacity-50">
                  <div className="w-2 h-2 bg-outline rounded-full"></div>
                  <span className="text-xs font-mono text-slate-300">Queuing profile data...</span>
                  <span className="text-[10px] text-slate-500 ml-auto">WAIT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Batch History */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold font-headline text-white tracking-tight">Recent Batch History</h3>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            View All History <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Batch Cards */}
          {recentBatches.map((batch, i) => (
            <div key={i} className={`${i === 0 ? 'md:col-span-2' : ''} bg-surface-container-low rounded-[1rem] p-6 group hover:bg-surface-container-high transition-all border border-transparent hover:border-primary/20`}>
              <div className="flex justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-[0.75rem] flex items-center justify-center ${
                    i === 0 ? 'bg-primary/10 text-primary' : i === 1 ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'
                  }`}>
                    <span className="material-symbols-outlined">{i === 0 ? 'database' : i === 1 ? 'cloud_sync' : 'description'}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-headline">{batch.name}</h4>
                    <p className="text-xs text-slate-500 font-label">{batch.profiles} Profiles • {batch.date}</p>
                  </div>
                </div>
              </div>

              {batch.status === 'processing' ? (
                <>
                  <div className="w-full h-1 bg-surface-container-highest rounded-full mb-2">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${batch.progress}%` }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 text-right font-label">{batch.progress}% Complete</p>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Reports Ready</span>
                </div>
              )}
            </div>
          ))}

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-surface-container-low to-surface-container-lowest rounded-[1rem] p-6 flex flex-col justify-center items-center text-center space-y-2 border border-outline-variant/10">
            <p className="text-slate-500 text-xs font-label uppercase tracking-widest">Total Profiles Scanned</p>
            <p className="text-4xl font-black font-headline text-white">2,840</p>
            <div className="text-[10px] text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +12% this month
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BulkAnalysis;
