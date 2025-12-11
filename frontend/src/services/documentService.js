import api from './api';

export const documentService = {
    uploadDocument: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAllDocuments: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.sortBy) queryParams.append('sort_by', params.sortBy);
        if (params.order) queryParams.append('order', params.order);

        const response = await api.get(`/documents/?${queryParams.toString()}`);
        return response.data;
    },

    getDocument: async (id) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },

    getGlossary: async (id) => {
        const response = await api.post(`/documents/${id}/glossary`);
        return response.data;
    },

    generateQuiz: async (id) => {
        const response = await api.post(`/documents/${id}/quiz`);
        return response.data;
    },
};
