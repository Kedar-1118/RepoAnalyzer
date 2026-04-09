import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
    GitBranch, TrendingUp, Search, Star, Code2, Users,
    Zap, Target, Award, ArrowRight, Github
} from 'lucide-react';
import useThemeStore from '../store/themeStore';
import ThemeToggle from '../components/ThemeToggle';

const Landing = () => {
    const navigate = useNavigate();
    const { theme } = useThemeStore();

    // Apply theme to document element
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const features = [
        {
            icon: Target,
            title: "Smart Matching",
            description: "AI-powered algorithm matches you with repositories based on your skills and interests"
        },
        {
            icon: TrendingUp,
            title: "Personalized Recommendations",
            description: "Get curated project suggestions that align with your tech stack and experience"
        },
        {
            icon: Search,
            title: "Advanced Search",
            description: "Find open-source projects by language, stars, topics, and contribution difficulty"
        },
        {
            icon: Star,
            title: "Bookmark & Track",
            description: "Save interesting repositories and track your contribution opportunities"
        },
        {
            icon: Code2,
            title: "Tech Stack Analysis",
            description: "Automatic detection of your skills from GitHub profile and repositories"
        },
        {
            icon: Users,
            title: "Contribution Insights",
            description: "Track your open-source journey with detailed analytics and history"
        }
    ];

    const stats = [
        { value: "10K+", label: "Repositories" },
        { value: "500+", label: "Active Contributors" },
        { value: "50+", label: "Languages" },
        { value: "95%", label: "Match Rate" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-light-bg via-light-bg-secondary to-light-bg dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-bg-tertiary">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-dark-bg/80 border-b border-light-border dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <GitBranch className="w-8 h-8 text-light-accent dark:text-dark-primary" />
                            <span className="text-xl font-bold text-light-text dark:text-dark-text">
                                <span className="dark:text-dark-primary">OS</span> Matchmaker
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <Github className="w-4 h-4" />
                                <span>Sign In</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-light-accent/10 dark:bg-dark-primary/10 border border-light-accent/20 dark:border-dark-primary/20">
                            <Zap className="w-4 h-4 text-light-accent dark:text-dark-primary" />
                            <span className="text-sm font-medium text-light-accent dark:text-dark-primary">
                                AI-Powered Repository Matching
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-light-text dark:text-dark-text leading-tight">
                            Find Your Perfect
                            <br />
                            <span className="text-light-accent dark:text-dark-primary">Open Source</span> Match
                        </h1>

                        <p className="text-xl md:text-2xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
                            Connect with open-source projects that match your skills, interests, and experience level.
                            Start contributing to meaningful projects today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                <span>Get Started Free</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                                className="btn-secondary text-lg px-8 py-4"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
                            {stats.map((stat, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-light-accent dark:text-dark-primary">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-light-accent dark:bg-dark-primary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 dark:bg-blue-500 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white/50 dark:bg-dark-bg-secondary/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text">
                            Everything You Need to Contribute
                        </h2>
                        <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
                            Powerful features to help you discover, track, and contribute to open-source projects
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card p-6 hover:shadow-xl transition-all hover:-translate-y-1 group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-light-accent/10 dark:bg-dark-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-light-accent dark:text-dark-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text">
                            How It Works
                        </h2>
                        <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Connect Your GitHub",
                                description: "Sign in securely with your GitHub account to analyze your skills and contributions"
                            },
                            {
                                step: "02",
                                title: "Get Matched",
                                description: "Our AI analyzes your profile and recommends projects that match your expertise"
                            },
                            {
                                step: "03",
                                title: "Start Contributing",
                                description: "Browse, save, and start contributing to projects you're passionate about"
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="text-center space-y-4">
                                    <div className="text-6xl font-bold text-light-accent/20 dark:text-dark-primary/20">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                                        {item.title}
                                    </h3>
                                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                        {item.description}
                                    </p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/3 -right-4 w-8">
                                        <ArrowRight className="w-8 h-8 text-light-accent/30 dark:text-dark-primary/30" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-light-accent/10 to-purple-500/10 dark:from-dark-primary/10 dark:to-blue-500/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text">
                        Ready to Start Contributing?
                    </h2>
                    <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
                        Join thousands of developers finding their perfect open-source match
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transition-all"
                    >
                        <Github className="w-5 h-5" />
                        <span>Get Started with GitHub</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-light-border dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-2">
                            <GitBranch className="w-6 h-6 text-light-accent dark:text-dark-primary" />
                            <span className="font-semibold text-light-text dark:text-dark-text">
                                OS Matchmaker
                            </span>
                        </div>
                        <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            © 2025 Open Source Matchmaker. Empowering developers through open-source.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
