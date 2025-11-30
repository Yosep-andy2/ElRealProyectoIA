import { FileText, Calendar, Trash2 } from 'lucide-react';
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

    return (
        <div className="relative">
            <Link to={`/documents/${document.id}`} className="block group">
                <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowConfirm(true);
                            }}
                            className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar documento"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" title={document.title}>
                        {document.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(document.created_at)}
                        </div>
                        {document.page_count && (
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                {document.page_count} págs
                            </div>
                        )}
                    </div>

                    <div className="absolute top-4 right-12">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${document.status === 'completed' ? 'bg-green-100 text-green-700' :
                            document.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {document.status === 'completed' ? 'Procesado' :
                                document.status === 'processing' ? 'Procesando' : 'Subido'}
                        </span>
                    </div>
                </div>
            </Link>

            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-2">¿Eliminar documento?</h3>
                        <p className="text-gray-600 mb-4">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                disabled={deleting}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50"
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
