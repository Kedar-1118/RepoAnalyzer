const MatchScoreDonut = ({ score = 0, size = 64, label = '', gradientColors = ['#62fae3', '#c180ff'] }) => {
  const radius = (size / 2) - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const gradientId = `matchGrad-${Math.random().toString(36).slice(2, 9)}`;

  const getTier = (s) => {
    if (s >= 85) return { label: 'EXCEPTIONAL', color: 'text-primary' };
    if (s >= 70) return { label: 'STRONG MATCH', color: 'text-secondary' };
    if (s >= 50) return { label: 'POTENTIAL', color: 'text-outline' };
    return { label: 'LOW', color: 'text-slate-500' };
  };

  const tier = getTier(score);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative flex items-center justify-center`} style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90">
          <circle
            className="text-surface-variant"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>
        </svg>
        <span className={`absolute text-sm font-black ${tier.color}`}>{score}%</span>
      </div>
      {label && (
        <span className={`mt-1 bg-surface-container-highest/50 ${tier.color} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
          {label || tier.label}
        </span>
      )}
    </div>
  );
};

export default MatchScoreDonut;
