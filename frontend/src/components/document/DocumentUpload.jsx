import { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { documentService } from '../../services/documentService';
import clsx from 'clsx';

const DocumentUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (file) => {
        setError(null);
        setSuccess(false);

        if (!file) return;

        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/epub+zip'];
        if (!validTypes.includes(file.type)) {
            setError('Formato de archivo no soportado. Usa PDF, DOCX, TXT o EPUB.');
            return;
        }

        setFile(file);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            await documentService.uploadDocument(file);
            setSuccess(true);
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError('Error al subir el documento. Inténtalo de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                    isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400",
                    error ? "border-red-300 bg-red-50" : ""
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.docx,.txt,.epub"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                        <Upload className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-700">
                            Arrastra tu documento aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Soporta PDF, DOCX, TXT y EPUB
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Documento subido exitosamente
                </div>
            )}

            {file && (
                <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                            disabled={uploading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                            disabled={uploading}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {uploading ? 'Subiendo...' : 'Subir'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
