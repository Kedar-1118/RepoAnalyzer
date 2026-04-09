import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Brain,
    Search,
    Loader2,
    AlertCircle,
    Code,
    TrendingUp,
    Star,
    GitFork,
    Layers,
    Shield,
    Zap,
    Target,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Clock,
    Database,
    Sparkles,
} from 'lucide-react';
import { analyzeService } from '../services/api';
import { profileService } from '../services/api';
import useThemeStore from '../store/themeStore';

const DeepAnalysis = () => {
    const { theme } = useThemeStore();
    const [searchParams] = useSearchParams();
    const [repoUrl, setRepoUrl] = useState('');
    const [useProfileSkills, setUseProfileSkills] = useState(true);
    const [customSkills, setCustomSkills] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        summary: true,
        architecture: true,
        quality: true,
        skills: true,
        opportunities: true,
        scoring: true,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Pre-fill repo URL from query param (e.g. from RepoAnalysisModal link)
    useEffect(() => {
        const repoParam = searchParams.get('repo');
        if (repoParam) {
            setRepoUrl(repoParam);
        }
    }, [searchParams]);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);
        setIsLoading(true);

        try {
            let skills = customSkills;
            if (useProfileSkills) {
                try {
                    const techStack = await profileService.getTechStack();
                    const profileSkills = techStack?.techStack
                        ?.map((t) => t.name || t)
                        .join(', ');
                    if (profileSkills) {
                        skills = skills
                            ? `${profileSkills}, ${skills}`
                            : profileSkills;
                    }
                } catch {
                    // Profile skills unavailable — continue with custom only
                }
            }

            const data = await analyzeService.analyzeRepo(repoUrl, skills);
            setResult(data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                    err.response?.data?.error ||
                    err.message ||
                    'Analysis failed'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-500/10 border-green-500/30';
        if (score >= 60) return 'bg-blue-500/10 border-blue-500/30';
        if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
        return 'bg-red-500/10 border-red-500/30';
    };

    const getComplexityBadge = (level) => {
        const map = {
            low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        };
        return map[level?.toLowerCase()] || map.medium;
    };

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                            <Brain className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-dark-text">
                                Deep Analysis
                            </h1>
                            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                AI-powered repository analysis using RAG pipeline
                            </p>
                        </div>
                    </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleAnalyze} className="card p-6 mb-6">
                    <div className="space-y-4">
                        {/* Repo URL */}
                        <div>
                            <label
                                htmlFor="deep-analysis-repo-url"
                                className="block text-sm font-medium text-light-text dark:text-dark-text mb-2"
                            >
                                GitHub Repository URL
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                                <input
                                    id="deep-analysis-repo-url"
                                    type="url"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    placeholder="https://github.com/owner/repo"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-primary focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Skills Options */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={useProfileSkills}
                                    onChange={(e) =>
                                        setUseProfileSkills(e.target.checked)
                                    }
                                    className="w-4 h-4 rounded text-light-accent dark:text-dark-primary"
                                />
                                <span className="text-sm text-light-text dark:text-dark-text">
                                    Include skills from my profile
                                </span>
                            </label>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={customSkills}
                                    onChange={(e) =>
                                        setCustomSkills(e.target.value)
                                    }
                                    placeholder="Add custom skills (e.g. React, Python, Docker)"
                                    className="w-full px-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary text-sm"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="deep-analysis-submit"
                            type="submit"
                            disabled={isLoading || !repoUrl.trim()}
                            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing… (this may take 1-3 minutes)
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Run Deep Analysis
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Error */}
                {error && (
                    <div className="card p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-800 dark:text-red-200">
                                    Analysis Failed
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="card p-6 space-y-3"
                            >
                                <div className="h-5 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded w-1/3"></div>
                                <div className="h-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded w-full"></div>
                                <div className="h-4 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results */}
                {result && !isLoading && (
                    <div className="space-y-4">
                        {/* Meta bar */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {result.processing_time_seconds}s
                            </span>
                            {result.from_cache && (
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <Database className="w-3.5 h-3.5" />
                                    Cached
                                </span>
                            )}
                        </div>

                        {/* Score Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <ScoreCard
                                icon={Star}
                                label="Repository Score"
                                score={result.repository_score}
                            />
                            <ScoreCard
                                icon={Shield}
                                label="Code Quality"
                                score={result.code_quality_score}
                            />
                            <ScoreCard
                                icon={Target}
                                label="Skill Match"
                                score={result.skill_match_score}
                            />
                            <ScoreCard
                                icon={TrendingUp}
                                label="Developer Score"
                                score={result.developer_technical_score}
                            />
                        </div>

                        {/* Summary Section */}
                        <CollapsibleSection
                            title="Repository Summary"
                            icon={<Layers className="w-5 h-5" />}
                            isOpen={expandedSections.summary}
                            onToggle={() => toggleSection('summary')}
                        >
                            <p className="text-light-text dark:text-dark-text leading-relaxed">
                                {result.repository_summary}
                            </p>

                            {/* Tech Stack */}
                            {result.technology_stack?.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                        Technology Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.technology_stack.map(
                                            (tech, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 text-sm rounded-full bg-light-accent/10 text-light-accent dark:bg-dark-primary/10 dark:text-dark-primary"
                                                >
                                                    {tech}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {result.complexity_level && (
                                <div className="mt-3">
                                    <span
                                        className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${getComplexityBadge(
                                            result.complexity_level
                                        )}`}
                                    >
                                        Complexity: {result.complexity_level}
                                    </span>
                                </div>
                            )}
                        </CollapsibleSection>

                        {/* Architecture Section */}
                        <CollapsibleSection
                            title={`Architecture: ${result.architecture_pattern || 'N/A'}`}
                            icon={<Code className="w-5 h-5" />}
                            isOpen={expandedSections.architecture}
                            onToggle={() => toggleSection('architecture')}
                        >
                            <p className="text-light-text dark:text-dark-text leading-relaxed">
                                {result.architecture_explanation}
                            </p>
                        </CollapsibleSection>

                        {/* Code Quality Section */}
                        <CollapsibleSection
                            title="Code Quality"
                            icon={<Shield className="w-5 h-5" />}
                            isOpen={expandedSections.quality}
                            onToggle={() => toggleSection('quality')}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div
                                    className={`text-3xl font-bold ${getScoreColor(
                                        result.code_quality_score
                                    )}`}
                                >
                                    {result.code_quality_score}
                                    <span className="text-sm font-normal text-light-text-secondary dark:text-dark-text-secondary">
                                        /100
                                    </span>
                                </div>
                            </div>
                            <p className="text-light-text dark:text-dark-text leading-relaxed">
                                {result.code_quality_explanation}
                            </p>
                        </CollapsibleSection>

                        {/* Required Skills / Skill Match */}
                        <CollapsibleSection
                            title="Required Skills & Match"
                            icon={<Target className="w-5 h-5" />}
                            isOpen={expandedSections.skills}
                            onToggle={() => toggleSection('skills')}
                        >
                            {result.required_skills?.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {result.required_skills.map(
                                            (skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            {result.skill_match_score > 0 && (
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`text-2xl font-bold ${getScoreColor(
                                            result.skill_match_score
                                        )}`}
                                    >
                                        {result.skill_match_score}%
                                    </div>
                                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {result.skill_match_explanation}
                                    </p>
                                </div>
                            )}
                        </CollapsibleSection>

                        {/* Contribution Opportunities */}
                        {result.contribution_opportunities?.length > 0 && (
                            <CollapsibleSection
                                title="Contribution Opportunities"
                                icon={<Zap className="w-5 h-5" />}
                                isOpen={expandedSections.opportunities}
                                onToggle={() =>
                                    toggleSection('opportunities')
                                }
                            >
                                <div className="space-y-3">
                                    {result.contribution_opportunities.map(
                                        (opp, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-light-bg dark:bg-dark-bg"
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-light-text dark:text-dark-text">
                                                    {typeof opp === 'string'
                                                        ? opp
                                                        : opp.description ||
                                                          opp.title ||
                                                          JSON.stringify(opp)}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CollapsibleSection>
                        )}

                        {/* Scoring Breakdown */}
                        {result.repository_scoring_breakdown &&
                            Object.keys(result.repository_scoring_breakdown)
                                .length > 0 && (
                                <CollapsibleSection
                                    title="Scoring Breakdown"
                                    icon={<TrendingUp className="w-5 h-5" />}
                                    isOpen={expandedSections.scoring}
                                    onToggle={() => toggleSection('scoring')}
                                >
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {Object.entries(
                                            result.repository_scoring_breakdown
                                        ).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className={`p-3 rounded-lg border ${getScoreBg(
                                                    typeof value === 'number'
                                                        ? value
                                                        : 50
                                                )}`}
                                            >
                                                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1 capitalize">
                                                    {key.replace(/_/g, ' ')}
                                                </p>
                                                <p
                                                    className={`text-lg font-bold ${getScoreColor(
                                                        typeof value ===
                                                            'number'
                                                            ? value
                                                            : 50
                                                    )}`}
                                                >
                                                    {typeof value === 'number'
                                                        ? value
                                                        : JSON.stringify(value)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CollapsibleSection>
                            )}

                        {/* Full Analysis Explanation */}
                        {result.analysis_explanation && (
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-purple-500" />
                                    Full Analysis
                                </h3>
                                <p className="text-light-text dark:text-dark-text leading-relaxed whitespace-pre-line">
                                    {result.analysis_explanation}
                                </p>
                            </div>
                        )}

                        {/* Metadata */}
                        {result.metadata && (
                            <div className="card p-4 text-sm">
                                <div className="flex flex-wrap gap-4 text-light-text-secondary dark:text-dark-text-secondary">
                                    {result.metadata.repo_owner && (
                                        <a
                                            href={`https://github.com/${result.metadata.repo_owner}/${result.metadata.repo_name}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 hover:text-light-accent dark:hover:text-dark-primary transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            {result.metadata.repo_owner}/
                                            {result.metadata.repo_name}
                                        </a>
                                    )}
                                    {result.metadata.stars !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4" />
                                            {result.metadata.stars?.toLocaleString()}
                                        </span>
                                    )}
                                    {result.metadata.forks !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <GitFork className="w-4 h-4" />
                                            {result.metadata.forks?.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// === Sub-components ===

const ScoreCard = ({ icon: Icon, label, score }) => {
    const getColor = (s) => {
        if (s >= 80)
            return 'from-green-500/20 to-green-600/10 border-green-500/30';
        if (s >= 60)
            return 'from-blue-500/20 to-blue-600/10 border-blue-500/30';
        if (s >= 40)
            return 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
        return 'from-red-500/20 to-red-600/10 border-red-500/30';
    };
    const getTextColor = (s) => {
        if (s >= 80) return 'text-green-600 dark:text-green-400';
        if (s >= 60) return 'text-blue-600 dark:text-blue-400';
        if (s >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div
            className={`p-4 rounded-xl border bg-gradient-to-br ${getColor(
                score
            )}`}
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon
                    className={`w-4 h-4 ${getTextColor(score)}`}
                />
                <span className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary">
                    {label}
                </span>
            </div>
            <p className={`text-2xl font-bold ${getTextColor(score)}`}>
                {typeof score === 'number' ? Math.round(score) : score || 0}
            </p>
        </div>
    );
};

const CollapsibleSection = ({ title, icon, isOpen, onToggle, children }) => {
    return (
        <div className="card overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-light-bg-secondary/50 dark:hover:bg-dark-bg-tertiary/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-light-accent dark:text-dark-primary">
                        {icon}
                    </span>
                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                        {title}
                    </h3>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                )}
            </button>
            {isOpen && <div className="px-4 pb-4 sm:px-6 sm:pb-6">{children}</div>}
        </div>
    );
};

export default DeepAnalysis;
