import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfileService, updateUserProfileService, addEatingHistoryService, getTotalCaloriesService, getEatingHistoryService } from '@/services/user';

// Initial state
const initialState = {
    userData: null,
    totalCalories: 0,
    eatingHistory: [],
    isLoading: false,
    isUpdating: false,
    isAddingHistory: false,
    isLoadingHistory: false,
    error: null,
};

export const addEatingHistory = createAsyncThunk(
    'user/addEatingHistory',
    async ({ userId, dishId }, { rejectWithValue }) => {
        try {
            const response = await addEatingHistoryService(userId, dishId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getTotalCalories = createAsyncThunk(
    'user/getTotalCalories',
    async ({ userId, date }, { rejectWithValue }) => {
        try {
            const response = await getTotalCaloriesService(userId, date);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getEatingHistory = createAsyncThunk(
    'user/getEatingHistory',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getEatingHistoryService(userId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
    'user/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUserProfileService();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await updateUserProfileService(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// User slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetUserData: (state) => {
            state.userData = null;
            state.totalCalories = 0;
            state.eatingHistory = [];
            state.error = null;
        },
        // Local update for immediate UI response
        updateLocalUserData: (state, action) => {
            if (state.userData) {
                state.userData = { ...state.userData, ...action.payload };
            }
        },
        // action update calories locally
        updateTotalCalories: (state, action) => {
            state.totalCalories = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get user profile cases
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userData = action.payload;
                state.error = null;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch user profile';
            })

            // Update user profile cases
            .addCase(updateUserProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.userData = { ...state.userData, ...action.payload };
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload?.message || 'Failed to update user profile';
            })
            // Add eating history cases
            .addCase(addEatingHistory.pending, (state) => {
                state.isAddingHistory = true;
                state.error = null;
            })
            .addCase(addEatingHistory.fulfilled, (state, action) => {
                state.isAddingHistory = false;
                state.error = null;
            })
            .addCase(addEatingHistory.rejected, (state, action) => {
                state.isAddingHistory = false;
                state.error = action.payload?.message || 'Failed to add eating history';
            })

            // Get total calories cases
            .addCase(getTotalCalories.pending, (state) => {
                // Không set isLoading = true để tránh loading spinner khi refresh calories
                state.error = null;
            })
            .addCase(getTotalCalories.fulfilled, (state, action) => {
                state.isLoading = false;
                // Xử lý nhiều định dạng response có thể có
                let totalCalories = 0;

                if (action.payload) {
                    // Trường hợp 1: { data: { totalCalories: 350 } }
                    if (action.payload.data && typeof action.payload.data.totalCalories === 'number') {
                        totalCalories = action.payload.data.totalCalories;
                    }
                    // Trường hợp 2: { totalCalories: 350 }
                    else if (typeof action.payload.totalCalories === 'number') {
                        totalCalories = action.payload.totalCalories;
                    }
                    // Trường hợp 3: Trực tiếp là số
                    else if (typeof action.payload === 'number') {
                        totalCalories = action.payload;
                    }
                    // Trường hợp 4: Array các history items
                    else if (Array.isArray(action.payload.data)) {
                        totalCalories = action.payload.data.reduce((sum, item) => {
                            return sum + (item.calorie || item.calories || 0);
                        }, 0);
                    }
                }
                state.totalCalories = totalCalories;
                state.error = null;
            })
            .addCase(getTotalCalories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to get total calories';
            })

            // Get eating history cases
            .addCase(getEatingHistory.pending, (state) => {
                state.isLoadingHistory = true;
                state.error = null;
            })
            .addCase(getEatingHistory.fulfilled, (state, action) => {
                state.isLoadingHistory = false;
                // Xử lý response data
                if (action.payload && action.payload.data) {
                    state.eatingHistory = action.payload.data;
                } else {
                    state.eatingHistory = [];
                }
                state.error = null;
            })
            .addCase(getEatingHistory.rejected, (state, action) => {
                state.isLoadingHistory = false;
                state.error = action.payload?.message || 'Failed to get eating history';
            })
    }
});

export const {
    clearError,
    resetUserData,
    updateLocalUserData,
    updateTotalCalories
} = userSlice.actions;

export default userSlice.reducer;