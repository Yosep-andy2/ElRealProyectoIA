import api from './api';

export const chatService = {
    sendMessage: async (documentId, message) => {
        const response = await api.post(`/documents/${documentId}/chat`, { message });
        return response.data;
    }
};
