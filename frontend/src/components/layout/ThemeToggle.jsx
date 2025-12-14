import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
        p-2 rounded-lg transition-all duration-300
        ${theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }
      `}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 animate-[spin_1s_ease-in-out]" />
            ) : (
                <Moon className="w-5 h-5 animate-[bounce_1s_ease-in-out]" />
            )}
        </button>
    );
};

export default ThemeToggle;
