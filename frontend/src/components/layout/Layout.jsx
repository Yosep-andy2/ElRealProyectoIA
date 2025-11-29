import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import clsx from 'clsx';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} />

            <main className={clsx(
                "pt-20 px-6 pb-8 transition-all duration-300",
                isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
            )}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
