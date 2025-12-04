import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Sparkles, LogOut, Settings, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const notifications = [
        { id: 1, title: "Bienvenido a SIACTA", text: "Comienza subiendo tu primer documento.", time: "Hace 1 hora", read: false },
        { id: 2, title: "Sistema Actualizado", text: "Nuevas funciones de exportación disponibles.", time: "Hace 2 horas", read: true },
    ];

    return (
        <nav className="glass-effect border-b border-white/20 h-16 flex items-center justify-between px-6 fixed w-full top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-white/10 rounded-xl lg:hidden transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        SIACTA
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 hover:bg-white/50 rounded-xl relative transition-all duration-200 hover:scale-105"
                    >
                        <Bell className="w-5 h-5 text-gray-700" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg animate-pulse"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-scale-in origin-top-right">
                            <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                                <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">Marcar leídas</button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map(notif => (
                                    <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-teal-50/30' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{notif.text}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/50 transition-all"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-sm">
                                {user?.email?.substring(0, 2).toUpperCase() || <User className="w-5 h-5" />}
                            </span>
                        </div>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-scale-in origin-top-right">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                                <p className="text-xs text-gray-500">Usuario</p>
                            </div>

                            <div className="py-1">
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Mi Perfil
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Configuración
                                </button>
                            </div>

                            <div className="border-t border-gray-50 py-1">
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
