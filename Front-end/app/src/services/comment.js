import api from '@services/api';

// Get comments by dishId
export const getCommentsByDishService = async (dishId) => {
    try {
        const response = await api.get(`/comment/${dishId}/dish`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Get comments failed' };
    }
};

// Create a new comment
export const createCommentService = async (data) => {
    try {
        const response = await api.post('/comment', data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || { message: 'Create comment failed' };
    }
};

// Update comment by ID
export const updateCommentService = async (commentId, data) => {
    try {
        const response = await api.patch(`/comment/${commentId}`, data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || { message: 'Update comment failed' };
    }
};

// Delete comment by ID
export const deleteCommentService = async (commentId) => {
    try {
        const response = await api.delete(`/comment/${commentId}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || { message: 'Delete comment failed' };
    }
};
// Add reaction to comment
export const addReactionService = async (data) => {
    try {
        const response = await api.post('/reaction', data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || { message: 'Add reaction failed' };
    }
};

// Update reaction
export const updateReactionService = async (reactionId, data) => {
    try {
        const response = await api.patch(`/reaction/${reactionId}`, data);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || { message: 'Update reaction failed' };
    }
};

// Delete reaction
export const deleteReactionService = async (reactionId) => {
    try {
        const response = await api.delete(`/reaction/${reactionId}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || { message: 'Delete reaction failed' };
    }
};

// Get reactions by commentId
export const getReactionsByCommentService = async (commentId) => {
    try {
        const response = await api.get(`/reaction/${commentId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Get reactions failed' };
    }
};