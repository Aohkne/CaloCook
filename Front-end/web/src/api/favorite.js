import api from '@/configs/axios';

// Get user's favorite dishes
export const getFavorites = async (userId, params = {}) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'asc'
    } = params;

    const queryParams = {
        page,
        limit,
        sortBy,
        order
    };

    const response = await api.get(`/favorite/${userId}`, { params: queryParams });
    return response.data;
};

// Add dish to favorites
export const addToFavorites = async (userId, dishId) => {
    const response = await api.post('/favorite', {
        userId,
        dishId
    });
    return response.data;
};

// Remove dish from favorites
export const removeFromFavorites = async (userId, dishId) => {
    const response = await api.delete('/favorite', {
        data: {
            userId,
            dishId
        }
    });
    return response.data;
};