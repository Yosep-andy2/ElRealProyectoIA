import { useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { documentService } from '../../services/documentService';

const Glossary = ({ documentId }) => {
    const [terms, setTerms] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateGlossary = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await documentService.getGlossary(documentId);
            setTerms(data);
        } catch (err) {
            console.error(err);
            setError("Error al generar el glosario. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Glosario y Palabras Clave
                </h3>
            </div>

            <div className="p-4">
                {!terms && !loading && (
                    <div className="text-center py-6">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            Extrae los términos técnicos y conceptos clave del documento automáticamente.
                        </p>
                        <button
                            onClick={generateGlossary}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Generar Glosario
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Analizando documento y generando definiciones...</p>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                        {error}
                    </div>
                )}

                {terms && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {terms.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{item.term}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Glossary;
