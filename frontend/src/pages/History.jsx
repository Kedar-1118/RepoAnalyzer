import { Activity, Calendar, TrendingUp, Flame, Star } from 'lucide-react';
import { useProfileRepos, useProfileContributions, useProfileSummary } from '../hooks/useApi';

const History = () => {
    const { data: reposData, isLoading: reposLoading } = useProfileRepos();
    const { data: contributionsData, isLoading: contributionsLoading } = useProfileContributions();
    const { data: summaryData, isLoading: summaryLoading } = useProfileSummary();

    // Extract repositories array from API response
    const repos = reposData?.repositories || [];

    // Extract contributions from API response
    const contributionsMap = contributionsData?.contributions || {};
    const totalContributions = contributionsData?.totalContributions || 0;

    // Extract user profile
    const profile = summaryData?.profile || {};

    const isLoading = reposLoading || contributionsLoading || summaryLoading;

    // Calculate contribution stats
    const calculateStats = () => {
        // Current streak
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            if (contributionsMap[dateStr] > 0) {
                currentStreak++;
            } else if (i > 0) {
                break;
            }
        }

        // Longest streak
        const sortedDates = Object.keys(contributionsMap).sort();
        let longestStreak = 0;
        let tempStreak = 0;

        sortedDates.forEach(dateStr => {
            if (contributionsMap[dateStr] > 0) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        });

        return {
            currentStreak,
            longestStreak,
            averagePerDay: (totalContributions / 365).toFixed(1)
        };
    };

    const stats = calculateStats();

    // Create contribution heatmap data from real GitHub data
    const generateHeatmapData = () => {
        const data = [];
        const today = new Date();

        // Generate last 52 weeks (364 days)
        for (let week = 0; week < 52; week++) {
            for (let day = 0; day < 7; day++) {
                const daysAgo = (51 - week) * 7 + (6 - day);
                const date = new Date(today);
                date.setDate(date.getDate() - daysAgo);
                const dateStr = date.toISOString().split('T')[0];

                data.push({
                    week,
                    day,
                    count: contributionsMap[dateStr] || 0,
                    date: date,
                });
            }
        }
        return data;
    };

    const heatmapData = generateHeatmapData();

    const getColorClass = (count) => {
        if (count === 0) return 'bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border';
        if (count < 3) return 'bg-green-200 dark:bg-dark-success/30 border border-green-300 dark:border-dark-success/40';
        if (count < 6) return 'bg-green-400 dark:bg-dark-success/60 border border-green-500 dark:border-dark-success/70';
        return 'bg-green-600 dark:bg-dark-success border border-green-700 dark:border-dark-success';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Header with User Info */}
                <div className="card p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            {profile.avatarUrl && (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.username}
                                    className="w-16 h-16 rounded-full border-2 border-light-accent dark:border-dark-success"
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold text-light-text dark:text-dark-text flex items-center space-x-2">
                                    <Activity className="w-8 h-8 text-light-accent dark:text-dark-primary" />
                                    <span>{profile.username || 'Your'} GitHub History</span>
                                </h1>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary mt-2">
                                    Contribution timeline and activity over the last year
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm">Total Contributions</span>
                            </div>
                            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                                {totalContributions.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-orange-500 mb-1">
                                <Flame className="w-4 h-4" />
                                <span className="text-sm">Current Streak</span>
                            </div>
                            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                                {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
                            </p>
                        </div>

                        <div className="bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-yellow-500 mb-1">
                                <Star className="w-4 h-4" />
                                <span className="text-sm">Longest Streak</span>
                            </div>
                            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                                {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
                            </p>
                        </div>

                        <div className="bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg p-4">
                            <div className="flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Daily Average</span>
                            </div>
                            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                                {stats.averagePerDay}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contribution Heatmap */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>Contribution Heatmap</span>
                    </h3>

                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                            <div className="flex gap-1">
                                {Array.from({ length: 52 }).map((_, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-1">
                                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                                            const dataPoint = heatmapData.find(
                                                d => d.week === weekIndex && d.day === dayIndex
                                            );
                                            const count = dataPoint?.count || 0;
                                            const date = dataPoint?.date || new Date();

                                            // Format date as "Dec 4, 2024"
                                            const formattedDate = date.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            });

                                            // Create tooltip text
                                            const tooltipText = count === 0
                                                ? `No commits on ${formattedDate}`
                                                : `${count} commit${count !== 1 ? 's' : ''} on ${formattedDate}`;

                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={`w-3 h-3 rounded-sm ${getColorClass(count)} transition-all hover:ring-2 hover:ring-light-accent dark:hover:ring-dark-primary cursor-pointer hover:scale-125`}
                                                    title={tooltipText}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center space-x-2 mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        <span>Less</span>
                        {[0, 1, 2, 3].map((level) => (
                            <div
                                key={level}
                                className={`w-4 h-4 rounded-sm ${getColorClass(level * 3)}`}
                            />
                        ))}
                        <span>More</span>
                    </div>
                </div>

                {/* Repository Timeline */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-6">
                        Repository Timeline
                    </h3>

                    <div className="space-y-6">
                        {repos?.slice(0, 10).map((repo, index) => (
                            <div key={repo.id} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-light-accent dark:bg-dark-success"></div>
                                <div className="flex-1 pb-6 border-l-2 border-light-border dark:border-dark-border pl-6 -ml-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-light-text dark:text-dark-text">
                                                {repo.name}
                                            </h4>
                                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                                                {repo.description || 'No description'}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                                <span>Created: {new Date(repo.created_at).toLocaleDateString()}</span>
                                                <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
