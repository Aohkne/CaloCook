import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRandomDishService } from '@/services/dish';

// Initial state
const initialState = {
  dishes: [],
  isLoading: false,
  error: null,
  hasMore: true
};

// Async thunk
export const randomDishes = createAsyncThunk(
  'dish/random/userId',
  async ({ userId, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getRandomDishService(userId, limit);

      // console.log(JSON.stringify(response, null, 2));

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Dish slice
const dishSlice = createSlice({
  name: 'dish',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDishes: (state) => {
      state.dishes = [];
      state.hasMore = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch random dishes cases
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
      });
  }
});

export const { clearError, resetDishes } = dishSlice.actions;
export default dishSlice.reducer;
