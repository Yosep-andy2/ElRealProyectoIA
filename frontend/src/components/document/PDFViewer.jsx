import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import ErrorBoundary from '../common/ErrorBoundary';

// Configure worker - use local copy
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PDFViewer = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [error, setError] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setError(null);
    }

    function onDocumentLoadError(error) {
        console.error('PDF Load Error:', error);
        setError('Error al cargar el PDF. Por favor, intenta recargar la página.');
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Toolbar */}
            <div className="w-full flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 text-gray-700 dark:text-gray-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Página {pageNumber} de {numPages || '--'}
                    </span>
                    <button
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                        disabled={pageNumber >= numPages}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 text-gray-700 dark:text-gray-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale(prev => Math.min(prev + 0.2, 2.0))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-200"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Document */}
            <div className="flex-1 overflow-auto w-full flex justify-center items-start p-4">
                {error ? (
                    <div className="text-red-500 dark:text-red-400 p-4 text-center">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Recargar página
                        </button>
                    </div>
                ) : (
                    <Document
                        file={{
                            url: url,
                            httpHeaders: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                            </div>
                        }
                        error={
                            <div className="text-red-500 dark:text-red-400 p-4">
                                Error al cargar el PDF. Asegúrate de que el archivo existe y es accesible.
                            </div>
                        }
                    >
                        <ErrorBoundary>
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="shadow-lg"
                            />
                        </ErrorBoundary>
                    </Document>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
