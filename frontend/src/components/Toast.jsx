import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import useToastStore from '../store/toastStore';

const Toast = () => {
    const { toasts, removeToast } = useToastStore();

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <XCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5" />;
            case 'info':
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getColors = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
            case 'info':
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            flex items-start gap-3 p-4 rounded-lg border shadow-lg
            animate-slide-in-right transition-all duration-300
            ${getColors(toast.type)}
          `}
                >
                    <div className="flex-shrink-0 mt-0.5">
                        {getIcon(toast.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium break-words">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 hover:opacity-70 transition-opacity"
                        aria-label="Close notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
