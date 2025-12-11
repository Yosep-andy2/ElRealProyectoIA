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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Glosario y Palabras Clave
                </h3>
            </div>

            <div className="p-4">
                {!terms && !loading && (
                    <div className="text-center py-6">
                        <p className="text-gray-500 text-sm mb-4">
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
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                        <p className="text-sm text-gray-500">Analizando documento y generando definiciones...</p>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm p-4 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                {terms && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {terms.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{item.term}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Glossary;
