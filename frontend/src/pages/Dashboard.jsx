import { useState } from 'react';
import { Upload, FileText, Clock, Activity, X, Sparkles } from 'lucide-react';
import DocumentUpload from '../components/document/DocumentUpload';

const StatCard = ({ title, value, icon: Icon, gradient, delay = 0 }) => (
    <div
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover-lift animate-fade-in"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${gradient} shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        Dashboard
                    </h2>
                    <p className="text-gray-600 mt-1">Bienvenido de vuelta</p>
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-scale-in">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 gradient-primary rounded-xl">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Subir Nuevo Documento</h3>
                        </div>
                        <DocumentUpload onUploadSuccess={() => {
                            setTimeout(() => setShowUploadModal(false), 1500);
                        }} />
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Documentos"
                    value="12"
                    icon={FileText}
                    gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
                    delay={0}
                />
                <StatCard
                    title="Procesados"
                    value="8"
                    icon={Activity}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    delay={100}
                />
                <StatCard
                    title="Tiempo Ahorrado"
                    value="4.5h"
                    icon={Clock}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    delay={200}
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-teal-600" />
                    <h3 className="text-xl font-bold text-gray-800">Actividad Reciente</h3>
                </div>
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                        <Activity className="w-10 h-10 text-teal-600" />
                    </div>
                    <p className="text-gray-500 text-lg">No hay actividad reciente para mostrar</p>
                    <p className="text-gray-400 text-sm mt-2">Sube un documento para comenzar</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
