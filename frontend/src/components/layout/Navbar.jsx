import { Menu, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    return (
        <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 fixed w-full top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-indigo-600">SIACTA</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
