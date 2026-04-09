import {
    BarChart, Bar, PieChart, Pie, LineChart, Line,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
    GitBranch, Star, GitFork, TrendingUp, Code,
    Calendar, Award, Activity
} from 'lucide-react';
import { useProfileSummary, useProfileStats, useProfileRepos, useProfileContributions } from '../hooks/useApi';
import useThemeStore from '../store/themeStore';
import LanguagePieChart from '../components/LanguagePieChart';

const Dashboard = () => {
    const { data: summaryData, isLoading: summaryLoading } = useProfileSummary();
    const { data: statsData, isLoading: statsLoading } = useProfileStats();
    const { data: reposData, isLoading: reposLoading } = useProfileRepos();
    const { data: contributionsApiData, isLoading: contributionsLoading } = useProfileContributions();
    const { theme } = useThemeStore();

    // Extract actual data from API responses
    const summary = summaryData?.profile;
    const stats = statsData?.stats;
    const repos = reposData?.repositories;

    const isLoading = summaryLoading || statsLoading || reposLoading || contributionsLoading;

    // Chart colors - Diverse palette for better visual distinction
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

    // Transform tech stack data for charts
    const skillsData = summary?.techStack?.map(item => ({
        skill: item.language,
        value: summary?.skillStrength?.[item.language] || 50
    })) || [];

    const languagesData = summary?.techStack?.map(item => ({
        name: item.language,
        value: parseInt(item.percentage) || 0
    })) || [];

    // Transform real contributions data for chart
    const contributionsData = (() => {
        if (!contributionsApiData?.contributions) return [];

        const contributionsMap = contributionsApiData.contributions;
        const monthlyData = {};

        // Aggregate contributions by month
        Object.keys(contributionsMap).forEach(dateStr => {
            const date = new Date(dateStr);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (contributionsMap[dateStr] || 0);
        });

        // Get last 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const result = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            result.push({
                month: months[date.getMonth()],
                commits: monthlyData[monthKey] || 0
            });
        }

        return result;
    })();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-bg-secondary dark:bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                        Welcome back, <span className="dark:text-dark-primary">{summary?.username || 'Developer'}</span>! 👋
                    </h1>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                        Here's your open-source contribution overview
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={GitBranch}
                        label="Public Repos"
                        value={summary?.totalRepos || 0}
                        color="text-light-accent dark:text-dark-primary"
                    />
                    <StatCard
                        icon={Star}
                        label="Total Stars"
                        value={summary?.totalStars || 0}
                        color="text-yellow-500 dark:text-dark-primary"
                    />
                    <StatCard
                        icon={GitFork}
                        label="Total Forks"
                        value={summary?.totalForks || 0}
                        color="text-green-600 dark:text-dark-primary"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Activity Score"
                        value={summary?.activityScore?.score || 0}
                        color="text-purple-600 dark:text-dark-accent"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills Radar Chart */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2">
                            <Code className="w-5 h-5" />
                            <span>Skill Distribution</span>
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={skillsData}>
                                <PolarGrid stroke={theme === 'dark' ? '#30363d' : '#d0d7de'} />
                                <PolarAngleAxis
                                    dataKey="skill"
                                    tick={{ fill: theme === 'dark' ? '#8b949e' : '#57606a', fontSize: 12 }}
                                />
                                <PolarRadiusAxis
                                    angle={90}
                                    domain={[0, 100]}
                                    tick={{ fill: theme === 'dark' ? '#8b949e' : '#57606a' }}
                                />
                                <Radar
                                    name="Skills"
                                    dataKey="value"
                                    stroke={theme === 'dark' ? '#00ff41' : '#0969da'}
                                    fill={theme === 'dark' ? '#00ff41' : '#0969da'}
                                    fillOpacity={0.6}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#161b22' : '#ffffff',
                                        border: `1px solid ${theme === 'dark' ? '#30363d' : '#d0d7de'}`,
                                        borderRadius: '8px',
                                        color: theme === 'dark' ? '#c9d1d9' : '#24292f'
                                    }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Language Pie Chart */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2">
                            <Activity className="w-5 h-5" />
                            <span>Language Usage</span>
                        </h3>
                        <LanguagePieChart data={languagesData} height={300} outerRadius={80} />
                    </div>
                </div>

                {/* Contribution Chart */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>Contribution History</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={contributionsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#30363d' : '#d0d7de'} />
                            <XAxis
                                dataKey="month"
                                tick={{ fill: theme === 'dark' ? '#8b949e' : '#57606a' }}
                            />
                            <YAxis
                                tick={{ fill: theme === 'dark' ? '#8b949e' : '#57606a' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#161b22' : '#ffffff',
                                    border: `1px solid ${theme === 'dark' ? '#30363d' : '#d0d7de'}`,
                                    borderRadius: '8px',
                                    color: theme === 'dark' ? '#c9d1d9' : '#24292f'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="commits"
                                stroke={theme === 'dark' ? '#00ff41' : '#0969da'}
                                strokeWidth={2}
                                dot={{ fill: theme === 'dark' ? '#00ff41' : '#0969da' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Repositories */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center space-x-2">
                        <GitBranch className="w-5 h-5" />
                        <span>Your Recent Repositories</span>
                    </h3>
                    <div className="space-y-3">
                        {repos?.slice(0, 5).map((repo, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-primary transition-all"
                            >
                                <div className="flex-1">
                                    <h4 className="font-semibold text-light-text dark:text-dark-text">{repo.name}</h4>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-1">
                                        {repo.description || 'No description'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    <span className="flex items-center space-x-1">
                                        <Star className="w-4 h-4" />
                                        <span>{repo.stargazers_count || 0}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <GitFork className="w-4 h-4" />
                                        <span>{repo.forks_count || 0}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
    return (
        <div className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                        {label}
                    </p>
                    <p className="text-3xl font-bold text-light-text dark:text-dark-text">
                        {value.toLocaleString()}
                    </p>
                </div>
                <Icon className={`w-12 h-12 ${color}`} />
            </div>
        </div>
    );
};

export default Dashboard;
