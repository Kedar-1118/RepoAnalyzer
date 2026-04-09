import { useState, useMemo, useEffect } from 'react';
import {
    User, Mail, Calendar, GitBranch, Star, GitFork, TrendingUp,
    Search, Filter, Plus, X, Save, Code2, Award, Activity
} from 'lucide-react';
import RepoCard from '../components/RepoCard';
import RepoAnalysisModal from '../components/RepoAnalysisModal';
import {
    useProfileSummary,
    useProfileRepos,
    useUserTechStack,
    useUpdateTechStack,
    useProfileContributions
} from '../hooks/useApi';
import useThemeStore from '../store/themeStore';
import useToastStore from '../store/toastStore';

const Profile = () => {
    const { data: summaryData, isLoading: summaryLoading } = useProfileSummary();
    const { data: reposData, isLoading: reposLoading } = useProfileRepos();
    const { data: techStackData, isLoading: techStackLoading } = useUserTechStack();
    const { data: contributionsData } = useProfileContributions();
    const updateTechStackMutation = useUpdateTechStack();
    const { theme } = useThemeStore();
    const toast = useToastStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [languageFilter, setLanguageFilter] = useState('all');
    const [sortBy, setSortBy] = useState('updated');
    const [showAddTech, setShowAddTech] = useState(false);
    const [customTechnologies, setCustomTechnologies] = useState([]);
    const [newTech, setNewTech] = useState({ name: '', proficiency: 'Intermediate', category: 'Language' });
    const [selectedRepo, setSelectedRepo] = useState(null);

    const summary = summaryData?.profile;
    const repos = reposData?.repositories || [];
    const techStack = techStackData || {};

    // Initialize custom technologies from API data
    useEffect(() => {
        if (techStack.customTechnologies) {
            setCustomTechnologies(techStack.customTechnologies);
        }
    }, [techStack]);

    const isLoading = summaryLoading || reposLoading || techStackLoading;

    // Get unique languages for filter
    const languages = useMemo(() => {
        const langs = new Set(repos.map(repo => repo.language).filter(Boolean));
        return ['all', ...Array.from(langs)];
    }, [repos]);

    // Filter and sort repositories
    const filteredRepos = useMemo(() => {
        let filtered = repos.filter(repo => {
            const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (repo.description || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLanguage = languageFilter === 'all' || repo.language === languageFilter;
            return matchesSearch && matchesLanguage;
        });

        // Sort repositories
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'stars':
                    return (b.stargazers_count || 0) - (a.stargazers_count || 0);
                case 'forks':
                    return (b.forks_count || 0) - (a.forks_count || 0);
                case 'updated':
                default:
                    return new Date(b.updated_at) - new Date(a.updated_at);
            }
        });

        return filtered;
    }, [repos, searchTerm, languageFilter, sortBy]);

    const handleAddTechnology = () => {
        if (!newTech.name.trim()) return;

        const updatedTech = [...customTechnologies, newTech];
        setCustomTechnologies(updatedTech);
        setNewTech({ name: '', proficiency: 'Intermediate', category: 'Language' });
        setShowAddTech(false);
    };

    const handleRemoveTechnology = (index) => {
        const updatedTech = customTechnologies.filter((_, i) => i !== index);
        setCustomTechnologies(updatedTech);
    };

    const handleSaveTechStack = async () => {
        try {
            await updateTechStackMutation.mutateAsync(customTechnologies);
            toast.success('Tech stack saved successfully!');
        } catch (error) {
            console.error('Failed to save tech stack:', error);
            toast.error('Failed to save tech stack. Please try again.');
        }
    };

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
                {/* Profile Header */}
                <div className="card p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <img
                            src={summary?.avatarUrl || 'https://github.com/ghost.png'}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-light-accent dark:border-dark-primary"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                                {summary?.username || 'Developer'}
                            </h1>
                            <div className="space-y-2 text-light-text-secondary dark:text-dark-text-secondary">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <User className="w-4 h-4" />
                                    <span>@{summary?.username}</span>
                                </div>
                                {summary?.email && (
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{summary?.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined GitHub {new Date().getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={GitBranch}
                        label="Repositories"
                        value={summary?.totalRepos || 0}
                        color="text-light-accent dark:text-dark-primary"
                    />
                    <StatCard
                        icon={Star}
                        label="Total Stars"
                        value={summary?.totalStars || 0}
                        color="text-yellow-500"
                    />
                    <StatCard
                        icon={GitFork}
                        label="Total Forks"
                        value={summary?.totalForks || 0}
                        color="text-green-600 dark:text-green-400"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Activity Score"
                        value={summary?.activityScore?.score || 0}
                        color="text-purple-600 dark:text-purple-400"
                    />
                </div>

                {/* Tech Stack Section */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text flex items-center gap-2">
                            <Code2 className="w-6 h-6" />
                            Tech Stack
                        </h2>
                        <button
                            onClick={handleSaveTechStack}
                            disabled={updateTechStackMutation.isPending}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {updateTechStackMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {/* GitHub Detected Tech Stack */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                            GitHub Detected Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {techStack.githubDetected?.map((tech, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border"
                                >
                                    <span className="text-light-text dark:text-dark-text font-medium">
                                        {tech.language}
                                    </span>
                                    <span className="ml-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {tech.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Technologies */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                                Custom Skills & Technologies
                            </h3>
                            <button
                                onClick={() => setShowAddTech(!showAddTech)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Technology
                            </button>
                        </div>

                        {showAddTech && (
                            <div className="mb-4 p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Technology name"
                                        value={newTech.name}
                                        onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                                        className="input-field"
                                    />
                                    <select
                                        value={newTech.proficiency}
                                        onChange={(e) => setNewTech({ ...newTech, proficiency: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                    <select
                                        value={newTech.category}
                                        onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Language">Language</option>
                                        <option value="Framework">Framework</option>
                                        <option value="Tool">Tool</option>
                                        <option value="Database">Database</option>
                                        <option value="Cloud">Cloud</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <button
                                        onClick={handleAddTechnology}
                                        className="btn-primary"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {customTechnologies.map((tech, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-light-accent/10 to-light-accent/5 dark:from-dark-primary/20 dark:to-dark-primary/10 border border-light-accent/50 dark:border-dark-primary/50 flex items-center gap-2"
                                >
                                    <div>
                                        <span className="text-light-text dark:text-dark-text font-medium">
                                            {tech.name}
                                        </span>
                                        <span className="ml-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                                            {tech.proficiency} • {tech.category}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveTechnology(index)}
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {customTechnologies.length === 0 && (
                                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                    No custom technologies added yet. Click "Add Technology" to get started.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Repositories Section */}
                <div className="card p-6">
                    <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6 flex items-center gap-2">
                        <GitBranch className="w-6 h-6" />
                        Your Repositories ({filteredRepos.length})
                    </h2>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                            <input
                                type="text"
                                placeholder="Search repositories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <select
                            value={languageFilter}
                            onChange={(e) => setLanguageFilter(e.target.value)}
                            className="input-field"
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>
                                    {lang === 'all' ? 'All Languages' : lang}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input-field"
                        >
                            <option value="updated">Recently Updated</option>
                            <option value="name">Name</option>
                            <option value="stars">Most Stars</option>
                            <option value="forks">Most Forks</option>
                        </select>
                    </div>

                    {/* Repository List */}
                    <div className="space-y-4">
                        {filteredRepos.map((repo, index) => (
                            <RepoCard
                                key={index}
                                repo={repo}
                                clickable={true}
                                showSaveButton={false}
                                onClick={() => setSelectedRepo(repo)}
                            />
                        ))}
                        {filteredRepos.length === 0 && (
                            <div className="text-center py-12 text-light-text-secondary dark:text-dark-text-secondary">
                                No repositories found matching your filters.
                            </div>
                        )}

                {/* Repository Analysis Modal */}
                {selectedRepo && (
                    <RepoAnalysisModal
                        repo={selectedRepo}
                        onClose={() => setSelectedRepo(null)}
                    />
                )}
                    </div>
                </div>

                {/* Domains Section */}
                {summary?.domains && summary.domains.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
                            <Award className="w-6 h-6" />
                            Expertise & Domains
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {summary.domains.map((domain, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border"
                                >
                                    <h3 className="font-semibold text-light-text dark:text-dark-text capitalize mb-1">
                                        {domain.domain}
                                    </h3>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {domain.repoCount} {domain.repoCount === 1 ? 'repository' : 'repositories'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
    return (
        <div className="card p-4 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
                <Icon className={`w-8 h-8 ${color} mb-2`} />
                <p className="text-2xl font-bold text-light-text dark:text-dark-text mb-1">
                    {value.toLocaleString()}
                </p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {label}
                </p>
            </div>
        </div>
    );
};

export default Profile;

