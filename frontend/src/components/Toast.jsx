import useToastStore from '../store/toastStore';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-primary bg-primary/20';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-panel border border-white/10 p-4 rounded-[1rem] flex items-center gap-4 shadow-2xl animate-slide-in-right"
        >
          <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColors(toast.type)}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {getIcon(toast.type)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">{toast.title || (toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info')}</p>
            <p className="text-slate-400 text-xs truncate">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
