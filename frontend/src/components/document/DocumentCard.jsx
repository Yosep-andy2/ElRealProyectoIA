import { FileText, Calendar, Trash2, CheckCircle, Clock, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const DocumentCard = ({ document, onDelete }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { addToast } = useToast();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleting(true);

        try {
            await axios.delete(`http://localhost:8000/api/v1/documents/${document.id}`);
            addToast('Documento eliminado', 'success');
            if (onDelete) {
                onDelete(document.id);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            addToast('Error al eliminar documento', 'error');
        } finally {
            setDeleting(false);
            setShowConfirm(false);
        }
    };

    const getStatusConfig = () => {
        switch (document.status) {
            case 'completed':
                return {
                    icon: CheckCircle,
                    label: 'Procesado',
                    className: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                };
            case 'processing':
                return {
                    icon: Clock,
                    label: 'Procesando',
                    className: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                };
            default:
                return {
                    icon: Upload,
                    label: 'Subido',
                    className: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <div className="relative">
            <Link to={`/documents/${document.id}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover-lift shadow-md transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowConfirm(true);
                            }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110"
                            title="Eliminar documento"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" title={document.title}>
                        {document.title}
                    </h3>

                    {/* Status Badge */}
                    <div className="mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.className} shadow-sm`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                        </span>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(document.created_at)}</span>
                        </div>
                        {document.page_count && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                <span className="font-medium">{document.page_count} págs</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowConfirm(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">¿Eliminar documento?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                                disabled={deleting}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={deleting}
                            >
                                {deleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentCard;
