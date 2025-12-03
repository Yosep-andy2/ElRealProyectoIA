import api from './api';

export const userService = {
    getStats: async () => {
        const response = await api.get('/users/stats');
        return response.data;
    }
};
