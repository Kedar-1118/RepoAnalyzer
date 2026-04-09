/**
 * Format a date to a readable string
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Format a number with commas
 */
export const formatNumber = (num) => {
    return num?.toLocaleString() || 0;
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Calculate time ago from a date
 */
export const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
};

/**
 * Calculate match percentage color
 */
export const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-dark-success';
    if (score >= 60) return 'text-blue-600 dark:text-dark-accent';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600';
};

/**
 * Generate a random color for charts
 */
export const generateColor = (index, theme = 'light') => {
    const lightColors = [
        '#0969da', '#1a7f37', '#bf8700', '#cf222e', '#8250df', '#fb8500'
    ];
    const darkColors = [
        '#00ff41', '#58a6ff', '#39ff14', '#00cc33', '#3fb950', '#1f6feb'
    ];

    const colors = theme === 'dark' ? darkColors : lightColors;
    return colors[index % colors.length];
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
