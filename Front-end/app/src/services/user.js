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

// ADD EATING HISTORY
export const addEatingHistoryService = async (userId, dishId) => {
    try {
        const response = await api.post(`/history/${userId}/history`, {
            dishId: dishId
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Add eating history failed' };
    }
};

// GET TotalCaloriesService
export const getTotalCaloriesService = async (userId, date = null) => {
    try {
        // Đảm bảo format ngày đúng và tính timezone
        const today = new Date();
        const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
        const dateParam = date || localDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const response = await api.get(`/history/${userId}/total-calories?date=${dateParam}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Get total calories failed' };
    }
};

// GET EATING HISTORY
export const getEatingHistoryService = async (userId) => {
    try {
        const response = await api.get(`/history/${userId}/history`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Get eating history failed' };
    }
};

// DELETE EATING HISTORY
export const deleteEatingHistoryService = async (historyId) => {
    try {
        const response = await api.delete(`/history/${historyId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Delete eating history failed' };
    }
};

// CREATE REPORT
export const createReportService = async (reportPayload) => {
    try {
        const response = await api.post('/report', reportPayload);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Create report failed' };
    }
};