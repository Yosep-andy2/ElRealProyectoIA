import { useState } from 'react';
import { Upload, FileText, Clock, Activity, X } from 'lucide-react';
import DocumentUpload from '../components/document/DocumentUpload';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    Subir Documento
                </button>
            </div>

            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Subir Nuevo Documento</h3>
                        <DocumentUpload onUploadSuccess={() => {
                            // Optional: Refresh dashboard stats
                            setTimeout(() => setShowUploadModal(false), 1500);
                        }} />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Documentos"
                    value="12"
                    icon={FileText}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Procesados"
                    value="8"
                    icon={Activity}
                    color="bg-green-500"
                />
                <StatCard
                    title="Tiempo Ahorrado"
                    value="4.5h"
                    icon={Clock}
                    color="bg-purple-500"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
                <div className="text-center py-8 text-gray-500">
                    No hay actividad reciente para mostrar.
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
