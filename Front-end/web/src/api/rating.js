import api from '@/configs/axios';

// Add a new rating for a dish
export const createRating = async ({ userId, dishId, star, description }) => {
    const response = await api.post('/rating', {
        userId,
        dishId,
        star: Number(star),
        description
    });
    return response.data;
};

// View ratings for a dish
export const getRatingsByDishId = async (dishId, params = {}) => {
    const { sortBy = '', order = '' } = params;

    const queryParams = { dishId };
    if (sortBy) queryParams.sortBy = sortBy;
    if (order) queryParams.order = order;

    const response = await api.get('/rating', { params: queryParams });
    return response.data;
};

// Get average rating for a dish
export const getAverageRating = async (dishId) => {
    const response = await api.get('/rating/average', {
        params: { dishId }
    });
    return response.data;
};

// Update a rating
export const updateRating = async (ratingId, payload) => {
    const response = await api.put(`/rating/${ratingId}`, payload);
    return response.data;
};