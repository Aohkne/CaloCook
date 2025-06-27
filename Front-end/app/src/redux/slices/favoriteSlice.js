import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavoritesService, likeDishService, disLikeDishService } from '@/services/favorite';

// Initial state
const initialState = {
  favorites: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null
  },
  isLoading: false,
  error: null,
  hasMore: true
};

// Async thunk
export const getFavorites = createAsyncThunk(
  'favorite/get',
  async ({ userId, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await getFavoritesService(userId, { page, limit, sortBy, order });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const likeDish = createAsyncThunk('favorite/like', async ({ userId, dishId }, { rejectWithValue }) => {
  try {
    const data = { userId, dishId };
    const response = await likeDishService(data);

    // console.log('Like dish response:', JSON.stringify(response, null, 2));

    return { ...response, dishId };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const dislikeDish = createAsyncThunk('favorite/dislike', async ({ userId, dishId }, { rejectWithValue }) => {
  try {
    const data = { userId, dishId };
    const response = await disLikeDishService(data);

    // console.log('Dislike dish response:', JSON.stringify(response, null, 2));

    return { ...response, dishId };
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Favorite slice
const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFavorites: (state) => {
      state.favorites = [];
      state.pagination = initialState.pagination;
      state.error = null;
      state.hasMore = true;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },

    toggleFavoriteLocal: (state, action) => {
      const { dishId, isLiked, dishData = null } = action.payload;

      if (isLiked) {
        if (!state.favorites.some((fav) => fav.dishId === dishId)) {
          const newFavorite = {
            _id: `temp_${dishId}`,
            dishId,
            dish: dishData,
            createdAt: new Date().toISOString()
          };
          state.favorites.unshift(newFavorite);
        }
      } else {
        state.favorites = state.favorites.filter((fav) => fav.dishId !== dishId);
      }
    },
    // UPDATE
    updateFavoriteItem: (state, action) => {
      const { dishId, favoriteData, action: actionType } = action.payload;

      if (actionType === 'like') {
        const existingIndex = state.favorites.findIndex((fav) => fav.dishId === dishId);
        if (existingIndex !== -1) {
          state.favorites[existingIndex] = { ...state.favorites[existingIndex], ...favoriteData };
        } else {
          state.favorites.unshift(favoriteData);
        }
      } else if (actionType === 'dislike') {
        state.favorites = state.favorites.filter((fav) => fav.dishId !== dishId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get favorites cases
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const { data, pagination } = action.payload;

        if (pagination.currentPage === 1) {
          state.favorites = data;
        } else {
          state.favorites = [...state.favorites, ...data];
        }

        state.pagination = pagination;
        state.hasMore = pagination.hasNextPage;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to get favorites';
        state.hasMore = false;
      })

      // Like dish cases
      .addCase(likeDish.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeDish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(likeDish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to like dish';
      })

      // Dislike dish cases
      .addCase(dislikeDish.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(dislikeDish.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const { dishId } = action.payload;
        state.favorites = state.favorites.filter((fav) => fav.dishId !== dishId);
      })
      .addCase(dislikeDish.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to dislike dish';
      });
  }
});

export const { clearError, resetFavorites, setFavorites, toggleFavoriteLocal, updateFavoriteItem } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
