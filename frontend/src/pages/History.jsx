import Footer from '../components/Footer';

const History = () => {
  // Placeholder history data - will be connected to backend later
  const historyItems = [
    { title: 'Analyzed facebook/react', time: '2 hours ago', desc: 'Deep analysis completed with 94% match score', type: 'analysis' },
    { title: 'Saved 3 repositories', time: '1 day ago', desc: 'Added tokio-rs/tokio, rust-lang/rust, denoland/deno', type: 'save' },
    { title: 'Updated skills profile', time: '3 days ago', desc: 'Added Rust, WebAssembly, and Distributed Systems', type: 'profile' },
    { title: 'Batch analysis completed', time: '1 week ago', desc: 'Processed 45 profiles in Frontend React Masters batch', type: 'batch' },
    { title: 'Joined OS Matchmaker', time: '2 weeks ago', desc: 'Created account and connected GitHub profile', type: 'join' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'analysis': return 'analytics';
      case 'save': return 'bookmark';
      case 'profile': return 'person';
      case 'batch': return 'group';
      default: return 'celebration';
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      <section>
        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
          Activity <span className="text-primary italic">History</span>
        </h1>
        <p className="text-on-surface-variant text-lg">Your journey through the open source ecosystem.</p>
      </section>

      <section className="glass-card rounded-[1rem] p-8">
        <div className="space-y-8 relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-tertiary via-secondary to-transparent"></div>

          {historyItems.map((item, i) => (
            <div key={i} className="relative pl-14">
              {/* Dot */}
              <div className={`absolute left-3 top-1.5 w-4 h-4 rounded-full flex items-center justify-center ${
                i === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-surface-container-highest border-2 border-outline-variant/30'
              }`}>
                {i === 0 && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>

              {/* Content Card */}
              <div className="bg-surface-container-low rounded-[1rem] p-6 hover:bg-surface-container-high transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-lg ${
                      i === 0 ? 'text-primary' : 'text-on-surface-variant'
                    }`}>{getIcon(item.type)}</span>
                    <h4 className="font-bold text-on-surface">{item.title}</h4>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0">{item.time}</span>
                </div>
                <p className="text-sm text-on-surface-variant">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default History;
