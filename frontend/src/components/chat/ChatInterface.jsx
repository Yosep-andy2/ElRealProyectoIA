import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatService } from '../../services/chatService';
import axios from 'axios';

const ChatInterface = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
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
                    // No history, show welcome message
                    setMessages([{ role: 'ai', content: 'Hola, soy tu asistente de IA. ¿Qué te gustaría saber sobre este documento?' }]);
                } else {
                    // Load existing history
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
            setMessages(prev => [...prev, { role: 'ai', content: response.response }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'ai', content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-600" />
                    Chat con el Documento
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingHistory ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`p-2 rounded-full flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-gray-100'
                                    }`}>
                                    {msg.role === 'user' ? (
                                        <User className="w-4 h-4 text-indigo-600" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-gray-600" />
                                    )}
                                </div>
                                <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-gray-100 flex-shrink-0">
                                    <Bot className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
