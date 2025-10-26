import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    createRatingService,
    getRatingsByDishIdService,
    getAverageRatingService,
    updateRatingService,
    deleteRatingService
} from '@/services/rating';

// Initial state
const initialState = {
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
    userOwnRating: null,
    isLoading: false,
    error: null,
    successMessage: null
};

// Async thunks
export const createRating = createAsyncThunk(
    'rating/create',
    async ({ userId, dishId, star, description }, { rejectWithValue }) => {
        try {
            const response = await createRatingService({ userId, dishId, star, description });
            return { ...response, dishId };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getRatingsByDishId = createAsyncThunk(
    'rating/getByDishId',
    async ({ dishId, sortBy = 'createdAt', order = 'desc' }, { rejectWithValue }) => {
        try {
            const response = await getRatingsByDishIdService(dishId, { sortBy, order });
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getAverageRating = createAsyncThunk(
    'rating/getAverage',
    async (dishId, { rejectWithValue }) => {
        try {
            const response = await getAverageRatingService(dishId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateRating = createAsyncThunk(
    'rating/update',
    async ({ ratingId, star, description }, { rejectWithValue }) => {
        try {
            const response = await updateRatingService(ratingId, { star, description });
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteRating = createAsyncThunk(
    'rating/delete',
    async (ratingId, { rejectWithValue }) => {
        try {
            const response = await deleteRatingService(ratingId);
            return { ...response, ratingId };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Rating slice
const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        resetRatings: (state) => {
            state.ratings = [];
            state.averageRating = 0;
            state.totalRatings = 0;
            state.userOwnRating = null;
            state.error = null;
            state.successMessage = null;
        },
        setUserOwnRating: (state, action) => {
            state.userOwnRating = action.payload;
        },
        separateUserRating: (state, action) => {
            const { userId } = action.payload;
            if (userId && state.ratings.length > 0) {
                const ownRating = state.ratings.find(
                    (r) => r.userId === userId || r.userId?._id === userId
                );
                state.userOwnRating = ownRating || null;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Create rating cases
            .addCase(createRating.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.successMessage = 'Rating submitted successfully!';

                // Add new rating to the list
                if (action.payload.data) {
                    state.ratings.unshift(action.payload.data);
                }
            })
            .addCase(createRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to create rating';
            })

            // Get ratings by dish ID cases
            .addCase(getRatingsByDishId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getRatingsByDishId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;

                if (action.payload.code === 200) {
                    state.ratings = action.payload.data || [];
                }
            })
            .addCase(getRatingsByDishId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to get ratings';
            })

            // Get average rating cases
            .addCase(getAverageRating.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAverageRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;

                if (action.payload.code === 200) {
                    state.averageRating = action.payload.data.averageRating || 0;
                    state.totalRatings = action.payload.data.totalRatings || 0;
                }
            })
            .addCase(getAverageRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to get average rating';
            })

            // Update rating cases
            .addCase(updateRating.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.successMessage = 'Rating updated successfully!';

                // Update the rating in the list
                if (action.payload.data) {
                    const index = state.ratings.findIndex((r) => r._id === action.payload.data._id);
                    if (index !== -1) {
                        state.ratings[index] = action.payload.data;
                    }

                    // Update user own rating if it's the same
                    if (state.userOwnRating?._id === action.payload.data._id) {
                        state.userOwnRating = action.payload.data;
                    }
                }
            })
            .addCase(updateRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to update rating';
            })

            // Delete rating cases
            .addCase(deleteRating.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.successMessage = 'Rating deleted successfully!';

                // Remove rating from the list
                state.ratings = state.ratings.filter((r) => r._id !== action.payload.ratingId);

                // Clear user own rating if it's the same
                if (state.userOwnRating?._id === action.payload.ratingId) {
                    state.userOwnRating = null;
                }
            })
            .addCase(deleteRating.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to delete rating';
            });
    }
});

export const {
    clearError,
    clearSuccessMessage,
    resetRatings,
    setUserOwnRating,
    separateUserRating
} = ratingSlice.actions;

export default ratingSlice.reducer;