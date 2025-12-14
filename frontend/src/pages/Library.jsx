import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Sparkles, SortAsc, SortDesc, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DocumentCard from '../components/document/DocumentCard';
import { documentService } from '../services/documentService';

const Library = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Load documents when filters change
    useEffect(() => {
        loadDocuments();
    }, [debouncedSearch, filterStatus, sortBy]);

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const params = {
                search: debouncedSearch,
                status: filterStatus,
                sortBy: sortBy === 'az' || sortBy === 'za' ? 'title' : 'created_at',
                order: sortBy === 'oldest' || sortBy === 'az' ? 'asc' : 'desc'
            };
            const docs = await documentService.getAllDocuments(params);
            setDocuments(docs);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentDelete = (documentId) => {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            Biblioteca
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {documents.length} {documents.length === 1 ? 'documento' : 'documentos'} encontrados
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar documentos..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-72 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2.5 border rounded-xl transition-colors flex items-center gap-2 ${showFilters || filterStatus !== 'all'
                                ? 'border-teal-500 text-teal-600 bg-teal-50 dark:bg-teal-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            <span className="hidden sm:inline">Filtros</span>
                        </button>
                    </div>
                </div>

                {/* Filters & Sort Bar */}
                {(showFilters || filterStatus !== 'all') && (
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm animate-slide-in">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'all', label: 'Todos', icon: null },
                                    { id: 'completed', label: 'Completados', icon: CheckCircle },
                                    { id: 'processing', label: 'Procesando', icon: Clock },
                                    { id: 'error', label: 'Error', icon: AlertCircle },
                                ].map(status => (
                                    <button
                                        key={status.id}
                                        onClick={() => setFilterStatus(status.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${filterStatus === status.id
                                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {status.icon && <status.icon className="w-3.5 h-3.5" />}
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="block w-full sm:w-48 px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="newest">Más recientes</option>
                                <option value="oldest">Más antiguos</option>
                                <option value="az">Nombre (A-Z)</option>
                                <option value="za">Nombre (Z-A)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900 dark:to-cyan-900 rounded-full flex items-center justify-center animate-pulse">
                        <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Cargando biblioteca...</p>
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
                        {searchTerm || filterStatus !== 'all' ? (
                            <Search className="w-12 h-12 text-teal-600" />
                        ) : (
                            <BookOpen className="w-12 h-12 text-teal-600" />
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {searchTerm || filterStatus !== 'all' ? 'No se encontraron resultados' : 'No hay documentos'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || filterStatus !== 'all'
                            ? 'Intenta ajustar tus filtros o búsqueda'
                            : 'Sube tu primer documento para comenzar'
                        }
                    </p>
                    {!searchTerm && filterStatus === 'all' && (
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="inline-flex items-center gap-2 gradient-primary text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5" />
                            Ir al Dashboard
                        </button>
                    )}
                    {(searchTerm || filterStatus !== 'all') && (
                        <button
                            onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                            className="text-teal-600 font-medium hover:text-teal-700 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc, index) => (
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
