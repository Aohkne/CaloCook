import api from '@/services/api';

// GET USER PROFILE
export const getUserProfileService = async () => {
    try {
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Get user profile failed' };
    }
};

// UPDATE USER PROFILE
export const updateUserProfileService = async (userData) => {
    try {
        const response = await api.post('/auth/profile', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Update user profile failed' };
    }
};