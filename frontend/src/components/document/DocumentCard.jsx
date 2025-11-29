import { FileText, Calendar, MoreVertical, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocumentCard = ({ document }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link to={`/documents/${document.id}`} className="block group">
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
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
    );
};

export default DocumentCard;
