import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfileService, updateUserProfileService } from '@/services/user';

// Initial state
const initialState = {
    userData: null,
    isLoading: false,
    isUpdating: false,
    error: null,
};

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
            state.error = null;
        },
        // Local update for immediate UI response
        updateLocalUserData: (state, action) => {
            if (state.userData) {
                state.userData = { ...state.userData, ...action.payload };
            }
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
    }
});

export const {
    clearError,
    resetUserData,
    updateLocalUserData
} = userSlice.actions;

export default userSlice.reducer;