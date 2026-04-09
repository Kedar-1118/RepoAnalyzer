import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        // Apply theme to document
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-light-border dark:bg-dark-border focus:ring-light-accent dark:focus:ring-dark-primary"
            aria-label="Toggle theme"
        >
            <div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-dark-bg-tertiary shadow-md transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                    }`}
            >
                {theme === 'light' ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                ) : (
                    <Moon className="w-4 h-4 text-dark-primary" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
