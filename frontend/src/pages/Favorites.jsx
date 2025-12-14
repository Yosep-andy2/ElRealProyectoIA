import { useState, useEffect } from 'react';
import { Star, Search, Grid, List, Filter } from 'lucide-react';
import { documentService } from '../services/documentService';
import { useFavorites } from '../context/FavoritesContext';
import DocumentCard from '../components/document/DocumentCard';

const Favorites = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const { favorites } = useFavorites();

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        // Filter documents based on favorites
        const favDocs = documents.filter(doc => favorites.includes(doc.id));

        // Apply search filter
        if (searchQuery) {
            const filtered = favDocs.filter(doc =>
                doc.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredDocs(filtered);
        } else {
            setFilteredDocs(favDocs);
        }
    }, [documents, favorites, searchQuery]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const data = await documentService.getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                        Favoritos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Tus documentos marcados como favoritos
                    </p>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar en favoritos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400"
                />
            </div>

            {/* Documents Grid/List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="text-center py-20">
                    <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {favorites.length === 0 ? 'No tienes favoritos aún' : 'No se encontraron resultados'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {favorites.length === 0
                            ? 'Marca documentos como favoritos para acceder rápidamente a ellos'
                            : 'Intenta con otra búsqueda'
                        }
                    </p>
                </div>
            ) : (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                }>
                    {filteredDocs.map(doc => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            onDelete={fetchDocuments}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
