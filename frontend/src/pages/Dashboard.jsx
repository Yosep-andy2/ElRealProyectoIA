import { useState, useEffect } from 'react';
import { Upload, FileText, Clock, Activity, X, Sparkles, BarChart2, HardDrive } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DocumentUpload from '../components/document/DocumentUpload';
import { userService } from '../services/userService';

const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => (
    <div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md hover-lift animate-fade-in"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${gradient} shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [stats, setStats] = useState({
        total_documents: 0,
        processed_documents: 0,
        total_pages: 0,
        storage_used_mb: 0,
        activity_history: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await userService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Error loading stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Bienvenido de vuelta</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 gradient-primary text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                    <Upload className="w-5 h-5" />
                    Subir Documento
                </button>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-scale-in">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 gradient-primary rounded-xl">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Subir Nuevo Documento</h3>
                        </div>
                        <DocumentUpload onUploadSuccess={() => {
                            setTimeout(() => {
                                setShowUploadModal(false);
                                window.location.reload(); // Reload to update stats
                            }, 1500);
                        }} />
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Documentos"
                    value={loading ? "-" : stats.total_documents}
                    icon={FileText}
                    gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
                    delay={0}
                />
                <StatCard
                    title="Procesados"
                    value={loading ? "-" : stats.processed_documents}
                    icon={Activity}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    delay={100}
                />
                <StatCard
                    title="Páginas Totales"
                    value={loading ? "-" : stats.total_pages}
                    icon={FileText}
                    gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                    delay={200}
                />
                <StatCard
                    title="Almacenamiento"
                    value={loading ? "-" : `${stats.storage_used_mb} MB`}
                    icon={HardDrive}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    delay={300}
                />
            </div>

            {/* Activity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                        <BarChart2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Actividad de Subida</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Documentos subidos en los últimos 7 días</p>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.activity_history}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => {
                                        const date = new Date(value);
                                        return `${date.getDate()}/${date.getMonth() + 1}`;
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#0d9488"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
