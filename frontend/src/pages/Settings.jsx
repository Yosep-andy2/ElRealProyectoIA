import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Globe, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [settings, setSettings] = useState({
        name: user?.name || '',
        email: user?.email || '',
        language: 'es',
        notifications: true,
        emailNotifications: false,
        themePreference: theme
    });

    const handleSave = () => {
        // Save settings to localStorage
        localStorage.setItem('userSettings', JSON.stringify(settings));
        addToast('Configuración guardada exitosamente', 'success');
    };

    const handleThemeChange = (newTheme) => {
        setSettings(prev => ({ ...prev, themePreference: newTheme }));
        if (newTheme !== theme) {
            toggleTheme();
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    Configuración
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Personaliza tu experiencia en SIACTA
                </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Perfil</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={settings.name}
                            onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Theme Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <Palette className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Apariencia</h2>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Tema
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleThemeChange('light')}
                            className={`p-4 rounded-lg border-2 transition-all ${theme === 'light'
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Claro</span>
                            </div>
                        </button>

                        <button
                            onClick={() => handleThemeChange('dark')}
                            className={`p-4 rounded-lg border-2 transition-all ${theme === 'dark'
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Oscuro</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preferencias</h2>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Idioma
                    </label>
                    <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notificaciones</h2>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700 dark:text-gray-300">Notificaciones en la app</span>
                        <input
                            type="checkbox"
                            checked={settings.notifications}
                            onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-700 dark:text-gray-300">Notificaciones por email</span>
                        <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                    </label>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default Settings;
