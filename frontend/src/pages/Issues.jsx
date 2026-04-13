import { useIssues } from '../hooks/useApi';
import Footer from '../components/Footer';

const Issues = () => {
  const { data: issues, isLoading } = useIssues();

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-emerald-400">volunteer_activism</span>
          <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface">
            Contribution <span className="text-secondary italic">Opportunities</span>
          </h1>
        </div>
        <p className="text-on-surface-variant text-lg">Open issues from projects that match your skills. Ready for contribution.</p>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader"></div></div>
      ) : (
        <div className="space-y-4">
          {(issues || []).map((issue, i) => (
            <div key={i} className={`bg-surface-container-low hover:bg-surface-container-high p-6 rounded-[1rem] transition-all border-l-4 ${
              i % 3 === 0 ? 'border-indigo-500' : i % 3 === 1 ? 'border-purple-500' : 'border-teal-500'
            } flex items-center justify-between group`}>
              <div className="space-y-1 flex-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  i % 3 === 0 ? 'text-indigo-400' : i % 3 === 1 ? 'text-purple-400' : 'text-teal-400'
                }`}>
                  {issue.labels?.[0]?.name || (i % 2 === 0 ? 'Good First Issue' : 'Enhancement')}
                </span>
                <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {issue.title}
                </h4>
                <div className="flex gap-4 items-center mt-2">
                  <span className="text-xs text-slate-500">
                    #{issue.number} • {issue.repository_url?.split('/').slice(-1)[0] || 'Repository'}
                  </span>
                </div>
              </div>
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${i % 3 === 0 ? 'text-indigo-400' : i % 3 === 1 ? 'text-purple-400' : 'text-teal-400'} font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all flex-shrink-0`}
              >
                View Issue <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          ))}
          {(!issues || issues.length === 0) && (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block">task_alt</span>
              <p className="text-lg">No issues found. Check back later!</p>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Issues;
