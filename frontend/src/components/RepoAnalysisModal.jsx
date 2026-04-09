import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, GitFork, AlertCircle, Code, TrendingUp, ExternalLink, Lightbulb, CheckCircle, Brain } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SyncLoader } from 'react-spinners';
import useThemeStore from '../store/themeStore';
import apiClient from '../services/apiClient';
import LanguagePieChart from './LanguagePieChart';

const RepoAnalysisModal = ({ repo, onClose }) => {
    const { theme } = useThemeStore();
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Diverse color palette
    const COLORS = theme === 'dark'
        ? [
            '#4f9eff',  // Bright Blue
            '#39ff14',  // Neon Green
            '#ff6b35',  // Vibrant Orange
            '#a855f7',  // Purple
            '#ec4899',  // Pink
            '#14b8a6',  // Teal
            '#f43f5e',  // Red
            '#fbbf24',  // Yellow
        ]
        : [
            '#0969da',  // Blue
            '#1a7f37',  // Green
            '#fb8500',  // Orange
            '#8250df',  // Purple
            '#cf222e',  // Red
            '#0891b2',  // Teal
            '#d946ef',  // Magenta
            '#ca8a04',  // Gold
        ];

    // Fetch analysis data when component mounts
    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setIsLoading(true);
                const [owner, repoName] = repo.full_name.split('/');

                const response = await apiClient.get(`/recommend/repos/${owner}/${repoName}/analyze`);
                setAnalysisData(response.data);
            } catch (err) {
                console.error('[RepoAnalysisModal] Error:', err);
                setError(err.response?.data?.error || err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [repo]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-blue-600 dark:text-blue-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getInsightIcon = (type) => {
        switch (type) {
            case 'beginner-friendly':
            case 'opportunities':
                return CheckCircle;
            case 'active':
            case 'popular':
            case 'growing':
                return TrendingUp;
            default:
                return Lightbulb;
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-dark-bg-secondary rounded-lg sm:rounded-xl shadow-2xl w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-dark-bg-secondary border-b border-light-border dark:border-dark-border p-4 sm:p-6 flex items-start justify-between z-10">
                    <div className="flex-1 min-w-0 pr-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text mb-2 flex items-center gap-2">
                            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-light-accent dark:text-dark-primary flex-shrink-0" />
                            <span className="truncate">{repo.name}</span>
                        </h2>
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-light-accent dark:text-dark-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="truncate">{repo.full_name}</span>
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        </a>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors flex-shrink-0 touch-manipulation"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-light-text dark:text-dark-text" />
                    </button>
                </div>

                {/* Deep Analysis CTA */}
                <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-b border-light-border dark:border-dark-border">
                    <button
                        onClick={() => {
                            onClose();
                            navigate(`/deep-analysis?repo=${encodeURIComponent(repo.html_url)}`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                        <Brain className="w-4 h-4" />
                        Run Deep Analysis (AI + RAG)
                    </button>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                        Get AI-powered code analysis with architecture patterns, skill matching & contribution tips
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <SyncLoader
                                color={theme === 'dark' ? '#4f9eff' : '#0969da'}
                                size={15}
                                margin={3}
                            />
                        </div>
                    ) : error ? (
                        <div className="card p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                            <p className="text-sm sm:text-base text-red-800 dark:text-red-200">
                                Failed to load analysis: {error}
                            </p>
                        </div>
                    ) : analysisData ? (
                        <>
                            {/* Repository Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <StatCard
                                    icon={Star}
                                    label="Stars"
                                    value={analysisData.repository.stars.toLocaleString()}
                                    color="text-yellow-500"
                                />
                                <StatCard
                                    icon={GitFork}
                                    label="Forks"
                                    value={analysisData.repository.forks.toLocaleString()}
                                    color="text-blue-500"
                                />
                                <StatCard
                                    icon={AlertCircle}
                                    label="Open Issues"
                                    value={analysisData.repository.openIssues.toLocaleString()}
                                    color="text-green-500 dark:text-green-400"
                                />
                                <StatCard
                                    icon={TrendingUp}
                                    label="Overall Score"
                                    value={`${analysisData.analysis.overallScore}/100`}
                                    color={getScoreColor(analysisData.analysis.overallScore)}
                                />
                            </div>

                            {/* Language Distribution */}
                            {analysisData.languages && analysisData.languages.length > 0 && (
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
                                        <Code className="w-5 h-5" />
                                        Language Distribution
                                    </h3>
                                    <LanguagePieChart data={analysisData.languages} height={300} outerRadius={100} />
                                </div>
                            )}

                            {/* AI Analysis */}
                            {analysisData.aiInsights && (
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                                        AI Analysis
                                    </h3>

                                    {/* Summary */}
                                    <div className="mb-6 p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border-l-4 border-light-accent dark:border-dark-primary">
                                        <p className="text-light-text dark:text-dark-text leading-relaxed">
                                            {analysisData.aiInsights.summary}
                                        </p>
                                    </div>

                                    {/* Insights */}
                                    <div className="space-y-3">
                                        {analysisData.aiInsights.insights.map((insight, index) => {
                                            const Icon = getInsightIcon(insight.type);
                                            return (
                                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-light-bg dark:bg-dark-bg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors">
                                                    <Icon className="w-5 h-5 text-light-accent dark:text-dark-primary flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-light-text dark:text-dark-text mb-1">
                                                            {insight.title}
                                                        </h4>
                                                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                                            {insight.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Scores */}
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <ScoreItem
                                            label="Recency"
                                            score={analysisData.aiInsights.scores.recency}
                                        />
                                        <ScoreItem
                                            label="Popularity"
                                            score={analysisData.aiInsights.scores.popularity}
                                        />
                                        <ScoreItem
                                            label="Beginner Friendly"
                                            score={analysisData.aiInsights.scores.beginner_friendly}
                                        />
                                        <ScoreItem
                                            label="Overall"
                                            score={analysisData.aiInsights.scores.overall}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Beginner Issues */}
                            {analysisData.beginnerIssues && analysisData.beginnerIssues.length > 0 && (
                                <div className="card p-6">
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        Recommended Issues to Start
                                    </h3>
                                    <div className="space-y-3">
                                        {analysisData.beginnerIssues.map((issue) => (
                                            <a
                                                key={issue.id}
                                                href={issue.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-4 rounded-lg bg-light-bg dark:bg-dark-bg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary border border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-primary transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-light-text dark:text-dark-text mb-1 line-clamp-1">
                                                            #{issue.number} - {issue.title}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {issue.labels.slice(0, 3).map((label, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 text-xs rounded-full bg-light-accent/10 text-light-accent dark:bg-dark-primary/10 dark:text-dark-primary"
                                                                >
                                                                    {label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <ExternalLink className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
    return (
        <div className="card p-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {label}
                    </p>
                    <p className="text-lg font-bold text-light-text dark:text-dark-text truncate">
                        {value}
                    </p>
                </div>
                <Icon className={`w-8 h-8 ${color} flex-shrink-0`} />
            </div>
        </div>
    );
};

// Score Item Component
const ScoreItem = ({ label, score }) => {
    const getColor = (score) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
        if (score >= 60) return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    };

    return (
        <div className="text-center">
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2">
                {label}
            </p>
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getColor(score)}`}>
                <span className="text-lg font-bold">
                    {score}
                </span>
            </div>
        </div>
    );
};

export default RepoAnalysisModal;
