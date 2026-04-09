import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, GitBranch, Code2, Users, Star, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { authService } from '../services/api';
import useThemeStore from '../store/themeStore';
import useToastStore from '../store/toastStore';

const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { theme } = useThemeStore();
    const toast = useToastStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Apply theme to document element
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleGitHubLogin = async () => {
        try {
            await authService.initiateGitHubAuth();
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Failed to initiate GitHub login. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-bg to-light-bg-secondary dark:from-dark-bg dark:to-dark-bg-secondary">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-10">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-light-accent to-transparent dark:from-dark-primary dark:to-transparent rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-light-accent to-transparent dark:from-dark-accent dark:to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-4 flex items-center space-x-2 text-light-accent dark:text-dark-primary hover:opacity-80 transition-opacity font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </button>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Branding */}
                    <div className="text-center md:text-left space-y-6 animate-fade-in">
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <GitBranch className="w-12 h-12 text-light-accent dark:text-dark-primary animate-pulse-slow" />
                            <h1 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text">
                                <span className="dark:text-dark-primary">Open Source</span>
                                <br />
                                Matchmaker
                            </h1>
                        </div>

                        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                            Discover open-source projects that match your skills and interests.
                            Contribute, learn, and grow with the global developer community.
                        </p>

                        {/* Features */}
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center space-x-3 text-light-text dark:text-dark-text">
                                <Code2 className="w-6 h-6 text-light-accent dark:text-dark-primary" />
                                <span>AI-powered repository recommendations</span>
                            </div>
                            <div className="flex items-center space-x-3 text-light-text dark:text-dark-text">
                                <Users className="w-6 h-6 text-light-accent dark:text-dark-primary" />
                                <span>Match with projects based on your GitHub profile</span>
                            </div>
                            <div className="flex items-center space-x-3 text-light-text dark:text-dark-text">
                                <Star className="w-6 h-6 text-light-accent dark:text-dark-primary" />
                                <span>Track and bookmark your favorite repositories</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Card */}
                    <div className="card p-8 shadow-2xl animate-slide-in">
                        <div className="text-center space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                    Sign in with GitHub to get started
                                </p>
                            </div>

                            {/* GitHub Login Button */}
                            <button
                                onClick={handleGitHubLogin}
                                className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-dark-primary-dim dark:hover:bg-dark-primary text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3 group"
                            >
                                <Github className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span>Continue with GitHub</span>
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-light-border dark:border-dark-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary">
                                        Secure OAuth Authentication
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary space-y-2">
                                <p>
                                    By signing in, you agree to our Terms of Service and Privacy Policy.
                                </p>
                                <p className="dark:text-dark-primary">
                                    🔒 We only access your public GitHub profile and repositories
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    <p>Built for developers, by developers 🚀</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
