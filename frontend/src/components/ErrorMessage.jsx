import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
    title = 'Something went wrong',
    message = 'An error occurred. Please try again.',
    onRetry = null
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg">
            <div className="card p-8 max-w-md w-full mx-4">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                        {title}
                    </h2>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        {message}
                    </p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="btn-primary flex items-center space-x-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Try Again</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
