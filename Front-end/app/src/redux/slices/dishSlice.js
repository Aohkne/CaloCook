import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRandomDishService,
  getAllDishesService,
  getFilteredDishesService,
  getIngredientsService,
  getDishDetailService,
  getIngredientsByDishService,
  getStepsByDishService
} from '@/services/dish';

// Initial state
const initialState = {
  dishes: [],
  ingredients: [],
  isLoading: false,
  isLoadingIngredients: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  isLoadingMore: false,
  dishDetail: null,
  dishIngredients: [],
  dishSteps: [],
  isLoadingDetail: false,
  detailError: null
};

// Thêm async thunk mới cho dish detail
export const getDishDetail = createAsyncThunk('dish/detail', async (dishId, { rejectWithValue }) => {
  try {
    const response = await getDishDetailService(dishId);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const getDishDetailData = createAsyncThunk('dish/getDetailData', async (dishId, { rejectWithValue }) => {
  try {
    const [dishResponse, ingredientsResponse, stepsResponse] = await Promise.all([
      getDishDetailService(dishId),
      getIngredientsByDishService(dishId),
      getStepsByDishService(dishId)
    ]);

    return {
      dishDetail: dishResponse.data || dishResponse,
      ingredients: ingredientsResponse.data || ingredientsResponse,
      steps: stepsResponse.data || stepsResponse
    };
  } catch (error) {
    console.error('Get dish detail data error:', error);
    return rejectWithValue(error);
  }
});

// Async thunk for getting ingredients
export const getIngredients = createAsyncThunk('dish/ingredients', async (name = '', { rejectWithValue }) => {
  try {
    const response = await getIngredientsService(name);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Async thunk for filtered dishes
export const getFilteredDishes = createAsyncThunk('dish/filtered', async (filters, { rejectWithValue }) => {
  try {
    const response = await getFilteredDishesService(filters);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Async thunk for random dishes
export const randomDishes = createAsyncThunk(
  'dish/random/userId',
  async ({ userId, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getRandomDishService(userId, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for all dishes
export const getAllDishes = createAsyncThunk(
  'dish/all',
  async ({ page = 1, limit = 10, userId = null }, { rejectWithValue }) => {
    try {
      const response = await getAllDishesService(page, limit, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for loading more dishes
export const loadMoreDishes = createAsyncThunk(
  'dish/loadMore',
  async ({ page, limit = 10, userId = null }, { rejectWithValue }) => {
    try {
      const response = await getAllDishesService(page, limit, userId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Helper function to sync dish like status with favorites
const syncDishLikeStatus = (dishes, favorites) => {
  if (!Array.isArray(dishes) || !Array.isArray(favorites)) {
    return dishes;
  }

  const favoritesDishIds = new Set(favorites.map((fav) => fav.dishId));

  return dishes.map((dish) => ({
    ...dish,
    isLiked: favoritesDishIds.has(dish._id)
  }));
};

// Dish slice
const dishSlice = createSlice({
  name: 'dish',
  initialState,

  //Xử lý các hành động đồng bộ
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDishDetail: (state) => {
      state.dishDetail = null;
      state.dishIngredients = [];
      state.dishSteps = [];
      state.detailError = null;
    },
    resetDishes: (state) => {
      state.dishes = [];
      state.hasMore = true;
      state.error = null;
      state.currentPage = 1;
    },
    toggleLocalLike: (state, action) => {
      const dishId = action.payload;
      const dish = state.dishes.find((d) => d.id === dishId);
      if (dish) {
        dish.isLiked = !dish.isLiked;
      }
    },
    updateDishLikeStatus: (state, action) => {
      const { dishId, isLiked } = action.payload;
      const dish = state.dishes.find((d) => d._id === dishId);
      if (dish) {
        dish.isLiked = isLiked;
      }
    },
    syncDishesWithFavorites: (state, action) => {
      const favorites = action.payload;
      state.dishes = syncDishLikeStatus(state.dishes, favorites);
    }
  },
  extraReducers: (builder) => {
    builder
      // Random dishes
      .addCase(randomDishes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(randomDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dishes = action.payload.dishes || action.payload;
        state.hasMore = action.payload.dishes ? action.payload.dishes.length >= 10 : action.payload.length >= 10;
        state.error = null;
      })
      .addCase(randomDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch random dishes';
        state.hasMore = false;
      })

      // Get all dishes
      .addCase(getAllDishes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dishes = action.payload.data;
        state.hasMore = action.payload.pagination.hasNextPage;
        state.currentPage = action.payload.pagination.currentPage;
        state.error = null;
      })
      .addCase(getAllDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch all dishes';
        state.hasMore = false;
      })

      // Load more dishes
      .addCase(loadMoreDishes.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(loadMoreDishes.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        const newDishes = action.payload.data;
        state.dishes = [...state.dishes, ...newDishes];
        state.hasMore = action.payload.pagination.hasNextPage;
        state.currentPage = action.payload.pagination.currentPage;
      })
      .addCase(loadMoreDishes.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload?.message || 'Failed to load more dishes';
      })

      // Filtered dishes
      .addCase(getFilteredDishes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFilteredDishes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dishes = action.payload.data;
        state.hasMore = action.payload.pagination.hasNextPage;
        state.currentPage = action.payload.pagination.currentPage;
        state.error = null;
      })
      .addCase(getFilteredDishes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch filtered dishes';
        state.hasMore = false;
      })

      // Get ingredients
      .addCase(getIngredients.pending, (state) => {
        state.isLoadingIngredients = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoadingIngredients = false;
        state.ingredients = action.payload.data || action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoadingIngredients = false;
        state.error = action.payload?.message || 'Failed to fetch ingredients';
      })

      // Get dish detail
      .addCase(getDishDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDishDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getDishDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch dish detail';
      })
      // Get dish detail data
      .addCase(getDishDetailData.pending, (state) => {
        state.isLoadingDetail = true;
        state.detailError = null;
      })
      .addCase(getDishDetailData.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.dishDetail = action.payload.dishDetail;
        state.dishIngredients = action.payload.ingredients;
        state.dishSteps = action.payload.steps;
        state.detailError = null;
      })
      .addCase(getDishDetailData.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.detailError = action.payload?.message || 'Failed to fetch dish detail data';
      });
  }
});

export const {
  clearError,
  resetDishes,
  toggleLocalLike,
  updateDishLikeStatus,
  syncDishesWithFavorites,
  clearDishDetail
} = dishSlice.actions;

export default dishSlice.reducer;
