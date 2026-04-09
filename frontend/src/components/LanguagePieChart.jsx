import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import useThemeStore from '../store/themeStore';

/**
 * Reusable Language Pie Chart Component
 * Displays language distribution as a pie chart on desktop and a list on mobile
 * 
 * @param {Array} data - Array of objects with { name: string, value: number }
 * @param {number} height - Height of the chart (default: 300)
 * @param {number} outerRadius - Outer radius of the pie (default: 80)
 */
const LanguagePieChart = ({ data = [], height = 300, outerRadius = 80 }) => {
    const { theme } = useThemeStore();

    // Diverse color palette
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

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    No language data available
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile View - List */}
            <div className="block md:hidden space-y-2">
                {data.map((lang, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary"
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-light-text dark:text-dark-text">
                                {lang.name}
                            </span>
                        </div>
                        <span className="text-sm font-semibold text-light-accent dark:text-dark-primary">
                            {lang.value}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Desktop View - Pie Chart */}
            <div className="hidden md:block">
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={outerRadius}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{
                                backgroundColor: '#1ac9e0ff',
                                // theme === 'dark' ? '#c8d2e0ff' : '#4e4646ff',
                                border: `2px solid #1ac9e0ff`,
                                // ${theme === 'dark' ? '#30363d' : '#d0d7de
                                borderRadius: '8px',
                                color: '#c9d6e6ff'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-sm text-light-text dark:text-dark-text">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default LanguagePieChart;
