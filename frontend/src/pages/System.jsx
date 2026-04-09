import { Settings, Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useApiRoutes, useBackendHealth } from '../hooks/useApi';
import { API_URL } from '../services/apiClient';

const System = () => {
    const { data: apiRoutes, isLoading: routesLoading, refetch: refetchRoutes } = useApiRoutes();
    const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useBackendHealth();

    const getStatusColor = () => {
        if (health?.status === 'connected') {
            return 'text-green-600 dark:text-dark-primary';
        }
        return 'text-red-600';
    };

    const getStatusIcon = () => {
        if (healthLoading) {
            return <RefreshCw className="w-6 h-6 animate-spin" />;
        }
        if (health?.status === 'connected') {
            return <CheckCircle className="w-6 h-6" />;
        }
        return <XCircle className="w-6 h-6" />;
    };

    return (
        <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text flex items-center space-x-2">
                        <Settings className="w-8 h-8 text-light-accent dark:text-dark-primary" />
                        <span>System Status</span>
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                        Backend API integration and health monitoring
                    </p>
                </div>

                {/* Backend Health */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center space-x-2">
                            <Activity className="w-5 h-5" />
                            <span>Backend Connection</span>
                        </h3>
                        <button
                            onClick={() => refetchHealth()}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg">
                            <div>
                                <p className="font-medium text-light-text dark:text-dark-text">API URL</p>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-mono">
                                    {API_URL}
                                </p>
                            </div>
                            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                                {getStatusIcon()}
                                <span className="font-semibold capitalize">
                                    {health?.status || 'Checking...'}
                                </span>
                            </div>
                        </div>

                        {health?.data && (
                            <div className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg">
                                <p className="font-medium text-light-text dark:text-dark-text mb-2">
                                    API Information
                                </p>
                                <pre className="text-xs text-light-text-secondary dark:text-dark-text-secondary font-mono overflow-x-auto">
                                    {JSON.stringify(health.data, null, 2)}
                                </pre>
                            </div>
                        )}

                        {health?.error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="font-medium text-red-600 dark:text-red-400 mb-1">
                                    Connection Error
                                </p>
                                <p className="text-sm text-red-500 dark:text-red-300">
                                    {health.error}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* API Routes */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                            Available API Routes
                        </h3>
                        <button
                            onClick={() => refetchRoutes()}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {routesLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="spinner"></div>
                        </div>
                    ) : apiRoutes?.endpoints ? (
                        <div className="space-y-3">
                            {Object.entries(apiRoutes.endpoints).map(([name, path]) => (
                                <div
                                    key={name}
                                    className="flex items-center justify-between p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-light-text dark:text-dark-text capitalize">
                                            {name}
                                        </p>
                                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-mono">
                                            {path}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-dark-primary" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-light-text-secondary dark:text-dark-text-secondary">
                            <p>No route information available</p>
                        </div>
                    )}
                </div>

                {/* Feature Flags */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                        Frontend Configuration
                    </h3>
                    <div className="space-y-3">
                        <ConfigItem
                            label="API Discovery"
                            value={import.meta.env.VITE_ENABLE_API_DISCOVERY === 'true' ? 'Enabled' : 'Disabled'}
                            enabled={import.meta.env.VITE_ENABLE_API_DISCOVERY === 'true'}
                        />
                        <ConfigItem
                            label="App Name"
                            value={import.meta.env.VITE_APP_NAME || 'Open Source Matchmaker'}
                            enabled={true}
                        />
                        <ConfigItem
                            label="Environment"
                            value={import.meta.env.MODE}
                            enabled={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfigItem = ({ label, value, enabled }) => (
    <div className="flex items-center justify-between p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg">
        <div>
            <p className="font-medium text-light-text dark:text-dark-text">{label}</p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{value}</p>
        </div>
        {enabled !== undefined && (
            enabled ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-dark-primary" />
            ) : (
                <XCircle className="w-5 h-5 text-red-600" />
            )
        )}
    </div>
);

export default System;
