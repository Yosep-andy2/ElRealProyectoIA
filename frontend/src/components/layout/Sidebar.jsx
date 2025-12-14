import { Home, BookOpen, FileText, Settings, Folder } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const Sidebar = ({ isOpen }) => {
    const links = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: BookOpen, label: 'Biblioteca', path: '/library' },
    ];

    return (
        <aside className={clsx(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20",
            isOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"
        )}>
            <div className="flex flex-col h-full py-4">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors",
                            isActive
                                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                        )}
                    >
                        <link.icon className="w-5 h-5 min-w-[1.25rem]" />
                        <span className={clsx(
                            "whitespace-nowrap transition-opacity duration-300",
                            isOpen ? "opacity-100" : "lg:opacity-0 lg:hidden"
                        )}>
                            {link.label}
                        </span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
