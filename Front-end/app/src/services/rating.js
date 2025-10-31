import api from '@services/api';

// Create a new rating for a dish
export const createRatingService = async (data) => {
    try {
        const { userId, dishId, star, description } = data;
        const response = await api.post('/rating', {
            userId,
            dishId,
            star: Number(star),
            description
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Create rating failed' };
    }
};

// Get ratings by dishId
export const getRatingsByDishIdService = async (dishId, params = {}) => {
    try {
        const { sortBy = 'createdAt', order = 'desc' } = params;

        const queryParams = { dishId };
        if (sortBy) queryParams.sortBy = sortBy;
        if (order) queryParams.order = order;

        const response = await api.get('/rating', { params: queryParams });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Get ratings failed' };
    }
};

// Get average rating for a dish
export const getAverageRatingService = async (dishId) => {
    try {
        const response = await api.get('/rating/average', {
            params: { dishId }
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Get average rating failed' };
    }
};

// Update a rating
export const updateRatingService = async (ratingId, payload) => {
    try {
        const response = await api.put(`/rating/${ratingId}`, payload);

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Update rating failed' };
    }
};

// Delete a rating (if needed)
export const deleteRatingService = async (ratingId) => {
    try {
        const response = await api.delete(`/rating/${ratingId}`);

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Delete rating failed' };
    }
};