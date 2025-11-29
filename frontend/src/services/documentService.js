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

    getAllDocuments: async () => {
        const response = await api.get('/documents');
        return response.data;
    },

    getDocument: async (id) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },
};
