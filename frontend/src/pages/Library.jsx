import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Sparkles } from 'lucide-react';
import DocumentCard from '../components/document/DocumentCard';
import { documentService } from '../services/documentService';

const Library = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const docs = await documentService.getAllDocuments();
            setDocuments(docs);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDocumentDelete = (documentId) => {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        Biblioteca
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {documents.length} {documents.length === 1 ? 'documento' : 'documentos'}
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-72 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center animate-pulse">
                        <BookOpen className="w-8 h-8 text-teal-600" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium">Cargando biblioteca...</p>
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-md">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                        {searchTerm ? (
                            <Search className="w-12 h-12 text-teal-600" />
                        ) : (
                            <BookOpen className="w-12 h-12 text-teal-600" />
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {searchTerm ? 'No se encontraron resultados' : 'No hay documentos'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm
                            ? `No encontramos documentos que coincidan con "${searchTerm}"`
                            : 'Sube tu primer documento para comenzar'
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="inline-flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5" />
                            Ir al Dashboard
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc, index) => (
                        <div
                            key={doc.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <DocumentCard document={doc} onDelete={handleDocumentDelete} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Library;
