import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const getToastStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
            case 'error':
                return 'bg-gradient-to-r from-red-500 to-red-600';
            case 'warning':
                return 'bg-gradient-to-r from-amber-500 to-orange-600';
            default:
                return 'bg-gradient-to-r from-blue-500 to-blue-600';
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {toasts.map((toast, index) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white min-w-[320px] animate-slide-in backdrop-blur-sm ${getToastStyles(toast.type)}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex-shrink-0 p-1.5 bg-white/20 rounded-lg">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                            {toast.type === 'info' && <Info className="w-5 h-5" />}
                        </div>
                        <p className="flex-1 text-sm font-semibold">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
