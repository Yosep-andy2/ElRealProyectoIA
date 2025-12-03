import { Menu, Bell, User, Sparkles } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
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
                <button className="p-2.5 hover:bg-white/50 rounded-xl relative transition-all duration-200 hover:scale-110">
                    <Bell className="w-5 h-5 text-gray-700" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg"></span>
                </button>
                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer">
                    <User className="w-5 h-5 text-white" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
