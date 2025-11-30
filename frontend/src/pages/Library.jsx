import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Biblioteca</h2>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando biblioteca...</p>
                </div>
            ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No se encontraron documentos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocuments.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} onDelete={handleDocumentDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Library;
