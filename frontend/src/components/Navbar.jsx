import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    Home,
    Search,
    Star,
    TrendingUp,
    Settings,
    LogOut,
    Activity,
    GitBranch,
    User,
    AlertCircle,
    Menu,
    X,
    Brain
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useLogout } from '../hooks/useApi';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { mutate: logout } = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { path: '/dashboard', icon: Home, label: 'Dashboard' },
        { path: '/recommendations', icon: TrendingUp, label: 'Recommended' },
        { path: '/issues', icon: AlertCircle, label: 'Issues' },
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/saved', icon: Star, label: 'Saved' },
        { path: '/history', icon: Activity, label: 'History' },
        { path: '/deep-analysis', icon: Brain, label: 'Deep Analysis' },
    ];

    const isActive = (path) => location.pathname === path;

    // Don't show navbar on landing or login pages
    if (location.pathname === '/' || location.pathname === '/login') {
        return null;
    }

    // Don't show navbar if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-light-border dark:border-dark-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                        <GitBranch className="w-7 h-7 sm:w-8 sm:h-8 text-light-accent dark:text-dark-primary transition-transform group-hover:rotate-12" />
                        <span className="text-lg sm:text-xl font-bold text-light-text dark:text-dark-text">
                            <span className="dark:text-dark-primary">OS</span> Matchmaker
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive(link.path)
                                    ? 'bg-light-accent text-white dark:bg-dark-bg-tertiary dark:text-dark-primary'
                                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                                    }`}
                            >
                                <link.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />

                        {/* User Menu */}
                        {user?.avatar_url && (
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                                title="View Profile"
                            >
                                <img
                                    src={user.avatar_url}
                                    alt={user.login}
                                    className="w-8 h-8 rounded-full border-2 border-light-border dark:border-dark-primary"
                                />
                                <span className="hidden lg:block text-sm font-medium text-light-text dark:text-dark-text">
                                    {user?.login}
                                </span>
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden lg:inline">Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-light-text dark:text-dark-text" />
                        ) : (
                            <Menu className="w-6 h-6 text-light-text dark:text-dark-text" />
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-light-border dark:border-dark-border">
                        <div className="py-3 space-y-1">
                            {/* User Info */}
                            {user?.avatar_url && (
                                <div className="flex items-center space-x-3 px-4 py-3 border-b border-light-border dark:border-dark-border">
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        className="w-10 h-10 rounded-full border-2 border-light-border dark:border-dark-primary"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-light-text dark:text-dark-text">
                                            {user?.login}
                                        </p>
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="text-xs text-light-accent dark:text-dark-primary hover:underline"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={handleNavLinkClick}
                                    className={`flex items-center space-x-3 px-4 py-3 transition-colors ${isActive(link.path)
                                        ? 'bg-light-accent text-white dark:bg-dark-bg-tertiary dark:text-dark-primary'
                                        : 'text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                                        }`}
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}

                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-light-border dark:border-dark-border">
                                <span className="text-sm font-medium text-light-text dark:text-dark-text">
                                    Dark Mode
                                </span>
                                <ThemeToggle />
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-light-border dark:border-dark-border"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
