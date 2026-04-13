const StatsCard = ({ icon, label, value, trend, iconColorClass = 'text-primary', bgColorClass = 'bg-primary/10' }) => {
  return (
    <div className="glass-card rounded-[1rem] p-6 relative overflow-hidden group hover:bg-surface-container-high transition-all">
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgColorClass} blur-[60px] opacity-40 -mr-8 -mt-8`}></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${bgColorClass} flex items-center justify-center`}>
            <span className={`material-symbols-outlined ${iconColorClass}`}>{icon}</span>
          </div>
          {trend && (
            <span className="text-[10px] font-bold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-headline font-black text-on-surface mb-1">{value}</p>
        <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
