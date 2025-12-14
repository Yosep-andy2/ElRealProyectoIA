import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('PDF Error Boundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900/50">
                    <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">
                        Error al cargar el PDF
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {this.state.error?.message || 'Error desconocido'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Recargar página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
