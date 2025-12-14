import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Download, FileJson, FileText, FileCode, BookOpen } from 'lucide-react';
import { chatService } from '../../services/chatService';
import axios from 'axios';

const ChatInterface = ({ documentId }) => {
    // ... (keep existing state)
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history on mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/documents/${documentId}/history`);
                const history = response.data;

                if (history.length === 0) {
                    setMessages([{ role: 'ai', content: 'Hola, soy tu asistente de IA. ¿Qué te gustaría saber sobre este documento?' }]);
                } else {
                    setMessages(history.map(msg => ({ role: msg.role, content: msg.content })));
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
                setMessages([{ role: 'ai', content: 'Hola, soy tu asistente de IA. ¿Qué te gustaría saber sobre este documento?' }]);
            } finally {
                setLoadingHistory(false);
            }
        };

        loadHistory();
    }, [documentId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await chatService.sendMessage(documentId, userMessage);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: response.response,
                sources: response.sources
            }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'ai', content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.' }]);
        } finally {
            setLoading(false);
        }
    };

    // ... (keep handleExport)
    const handleExport = async (format) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/v1/documents/${documentId}/export-chat?format=${format}`,
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = format === 'md' ? 'md' : format;
            link.setAttribute('download', `chat_export.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setShowExportMenu(false);
        } catch (error) {
            console.error('Error exporting chat:', error);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden">
            {/* Header with gradient */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    Chat con el Documento
                </h3>

                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                        title="Exportar chat"
                    >
                        <Download className="w-5 h-5" />
                    </button>

                    {showExportMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-10 animate-scale-in">
                            <button
                                onClick={() => handleExport('json')}
                                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <FileJson className="w-4 h-4 text-blue-500" /> Exportar JSON
                            </button>
                            <button
                                onClick={() => handleExport('txt')}
                                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" /> Exportar TXT
                            </button>
                            <button
                                onClick={() => handleExport('md')}
                                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <FileCode className="w-4 h-4 text-purple-500" /> Exportar Markdown
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-800">
                {loadingHistory ? (
                    <div className="flex flex-col justify-center items-center h-full">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando conversación...</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Avatar */}
                                <div className={`p-2.5 rounded-xl flex-shrink-0 shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <User className="w-5 h-5 text-white" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                                    {/* Sources */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" /> Fuentes:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-500">
                                                        Página {source.page}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {loading && (
                            <div className="flex items-start gap-3 animate-fade-in">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex-shrink-0 shadow-sm">
                                    <Bot className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                </div>
                                <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
