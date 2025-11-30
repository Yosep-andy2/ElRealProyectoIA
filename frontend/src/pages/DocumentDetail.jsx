import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, Download } from 'lucide-react';
import { documentService } from '../services/documentService';
import ChatInterface from '../components/chat/ChatInterface';
import PDFViewer from '../components/document/PDFViewer';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocument();

        // Poll for updates if processing
        const interval = setInterval(() => {
            if (document && document.status === 'processing') {
                loadDocument();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [id, document?.status]);

    const loadDocument = async () => {
        try {
            const doc = await documentService.getDocument(id);
            setDocument(doc);
        } catch (error) {
            console.error('Error loading document:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Documento no encontrado.</p>
                <button
                    onClick={() => navigate('/library')}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Volver a la biblioteca
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/library')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <FileText className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(document.created_at).toLocaleDateString()}
                                    </span>
                                    {document.author && (
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {document.author}
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${document.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        document.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {document.status === 'completed' ? 'Procesado' :
                                            document.status === 'processing' ? 'Procesando' : 'Subido'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                            <Download className="w-4 h-4" />
                            Descargar
                        </button>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* PDF Viewer */}
                        <div className="h-[600px]">
                            <PDFViewer url={`http://localhost:8000/storage/documents/${document.filename}`} />
                        </div>

                        <ChatInterface documentId={id} />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Resumen</h3>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                {document.status === 'processing' ? (
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                        <span className="text-sm">Generando resumen con IA...</span>
                                    </div>
                                ) : document.summary_short ? (
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {document.summary_short}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 text-sm italic">
                                        No hay resumen disponible.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
