import { useState, useMemo } from 'react';
import { Search, Filter, ExternalLink, MessageSquare, Calendar, Tag, Star, AlertCircle } from 'lucide-react';
import { useRecommendedIssues } from '../hooks/useApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const Issues = () => {
    const [difficulty, setDifficulty] = useState('all');
    const [language, setLanguage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ISSUES_PER_PAGE = 20;
    const MAX_ISSUES = 200;

    const { data, isLoading, error, refetch } = useRecommendedIssues({
        difficulty,
        language: language || undefined
    });

    const allIssues = data?.issues || [];
    // Limit to 200 issues
    const issues = useMemo(() => allIssues.slice(0, MAX_ISSUES), [allIssues]);

    // Filter issues by search term
    const filteredIssues = useMemo(() =>
        issues.filter(issue =>
            issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.repository.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [issues, searchTerm]
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredIssues.length / ISSUES_PER_PAGE);
    const paginatedIssues = useMemo(() => {
        const startIndex = (currentPage - 1) * ISSUES_PER_PAGE;
        const endIndex = startIndex + ISSUES_PER_PAGE;
        return filteredIssues.slice(startIndex, endIndex);
    }, [filteredIssues, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [difficulty, language, searchTerm]);

    // Get unique languages from issues
    const availableLanguages = [...new Set(issues.map(i => i.repository.language).filter(Boolean))];

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage message={error.message} />;

    return (
        <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                            Recommended Issues 🎯
                        </h1>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Find the perfect issue to start contributing
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="btn-primary"
                    >
                        Refresh
                    </button>
                </div>

                {/* Filters */}
                <div className="card p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        {/* Difficulty Filter */}
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="input-field"
                        >
                            <option value="all">All Difficulties</option>
                            <option value="beginner">Beginner Friendly</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>

                        {/* Language Filter */}
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="input-field"
                        >
                            <option value="">All Languages</option>
                            {availableLanguages.map(lang => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        label="Total Issues"
                        value={filteredIssues.length}
                        icon={AlertCircle}
                        color="text-light-accent dark:text-dark-primary"
                    />
                    <StatCard
                        label="Languages"
                        value={availableLanguages.length}
                        icon={Tag}
                        color="text-green-600 dark:text-green-400"
                    />
                    <StatCard
                        label="Avg Match Score"
                        value={Math.round(filteredIssues.reduce((acc, i) => acc + i.matchScore, 0) / filteredIssues.length) || 0}
                        icon={Star}
                        color="text-yellow-600 dark:text-yellow-400"
                    />
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                    {filteredIssues.length === 0 ? (
                        <div className="card p-12 text-center">
                            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
                            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                                No issues found
                            </h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Try adjusting your filters or refresh to get new recommendations
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {paginatedIssues.map((issue) => (
                                    <IssueCard key={issue.id} issue={issue} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Issue Card Component
const IssueCard = ({ issue }) => {
    const getDifficultyColor = (labels) => {
        const labelNames = labels.map(l => l.name.toLowerCase());
        if (labelNames.some(l => l.includes('good first issue'))) {
            return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
        }
        if (labelNames.some(l => l.includes('help wanted'))) {
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
        }
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-blue-600 dark:text-blue-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div className="card p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <a
                            href={issue.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-semibold text-light-accent dark:text-dark-primary hover:underline flex items-center gap-2 break-words"
                            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                            <span className="line-clamp-2">{issue.title}</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3 flex-wrap">
                        <a
                            href={issue.repository.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-light-accent dark:hover:text-dark-primary truncate max-w-xs"
                        >
                            {issue.repository.full_name}
                        </a>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            #{issue.number}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(issue.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {issue.comments}
                        </span>
                    </div>

                    {/* Issue Body Preview */}
                    {issue.body && (
                        <p
                            className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3 line-clamp-2"
                            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                            {issue.body}
                        </p>
                    )}

                    {/* Labels */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {issue.labels.slice(0, 5).map((label, idx) => (
                            <span
                                key={idx}
                                className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor([label])}`}
                            >
                                {label.name}
                            </span>
                        ))}
                        {issue.repository.language && (
                            <span className="px-2 py-1 text-xs rounded-full bg-light-bg dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text border border-light-border dark:border-dark-border">
                                {issue.repository.language}
                            </span>
                        )}
                    </div>

                    {/* Match Score Breakdown */}
                    {issue.scoreBreakdown && (
                        <div className="flex flex-wrap gap-3 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            <span>Language: {issue.scoreBreakdown.languageMatch}%</span>
                            <span>•</span>
                            <span>Difficulty: {issue.scoreBreakdown.difficultyScore}%</span>
                            <span>•</span>
                            <span>Engagement: {issue.scoreBreakdown.engagementScore}%</span>
                        </div>
                    )}
                </div>

                {/* Match Score Badge */}
                <div className="ml-4 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(issue.matchScore)}`}>
                        {issue.matchScore}
                    </div>
                    <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        Match
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, color }) => {
    return (
        <div className="card p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                        {value}
                    </p>
                </div>
                <Icon className={`w-10 h-10 ${color}`} />
            </div>
        </div>
    );
};

export default Issues;
