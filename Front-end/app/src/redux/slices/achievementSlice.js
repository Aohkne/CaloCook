import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as achievementService from '@/services/achievement';

// Async thunks
export const getUserAchievement = createAsyncThunk(
  'achievement/getUserAchievement',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await achievementService.getUserAchievement(userId);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user achievement');
    }
  }
);

export const addAchievementPoints = createAsyncThunk(
  'achievement/addPoints',
  async ({ userId, difficulty }, { rejectWithValue, getState }) => {
    try {
      // ✅ Lấy old data TRƯỚC KHI gọi API
      const oldAchievement = getState().achievement.userAchievement;
      const oldLevel = oldAchievement?.currentLevel || 'none';
      const oldPoints = oldAchievement?.totalPoints || 0;
      
      
      
      // Gọi API
      const response = await achievementService.addAchievementPoints(userId, difficulty);
      const data = response.data || response;
      
      
      
      // ✅ SỬA: Map backend response đúng format
      // Backend trả: { levelUp, newLevel, oldLevel, ... }
      // Frontend cần: { levelChanged, newLevel, oldLevel, ... }
      
      const newLevel = data.newLevel || 'none';
      const backendOldLevel = data.oldLevel || 'none';
      const newPoints = data.totalPoints || 0;
      
      // ✅ QUAN TRỌNG: Dùng levelUp từ backend hoặc so sánh levels
      const levelChanged = data.levelUp === true || (oldLevel !== newLevel && newLevel !== 'none');
      const pointsEarned = data.pointsEarned || (newPoints - oldPoints);
      
      
      
      // ✅ Return enriched data
      return {
        ...data,
        levelChanged,
        oldLevel: backendOldLevel || oldLevel,
        newLevel,
        pointsEarned,
        currentLevel: newLevel // ✅ THÊM: Sync currentLevel
      };
    } catch (error) {
      
      return rejectWithValue(error.message || 'Failed to add achievement points');
    }
  }
);

export const getLeaderboard = createAsyncThunk(
  'achievement/getLeaderboard',
  async ({ page = 1, limit = 50, sortBy = 'totalPoints', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await achievementService.getLeaderboard(page, limit, sortBy, order);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard');
    }
  }
);

export const getLevelConfiguration = createAsyncThunk(
  'achievement/getLevelConfiguration',
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementService.getLevelConfiguration();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch level configuration');
    }
  }
);

// Initial state
const initialState = {
  userAchievement: null,
  leaderboard: [],
  levelConfig: null,
  pagination: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  lastAchievementResult: null // ✅ THÊM
};

// Slice
const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAchievementData: (state) => {
      state.userAchievement = null;
      state.leaderboard = [];
      state.pagination = null;
      state.error = null;
      state.lastAchievementResult = null; // ✅ THÊM
    },
    updateLocalAchievement: (state, action) => {
      if (state.userAchievement) {
        state.userAchievement = {
          ...state.userAchievement,
          ...action.payload
        };
      }
    },
    clearLastAchievementResult: (state) => {
      state.lastAchievementResult = null;
    }
  },
  extraReducers: (builder) => {
    // Get User Achievement
    builder
      .addCase(getUserAchievement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserAchievement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAchievement = action.payload;
        
      })
      .addCase(getUserAchievement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Add Achievement Points
    builder
      .addCase(addAchievementPoints.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addAchievementPoints.fulfilled, (state, action) => {
        state.isUpdating = false;
        
        
        
        // ✅ SỬA: Lưu full enriched data vào lastAchievementResult
        state.lastAchievementResult = action.payload;
        
        // Cập nhật userAchievement
        if (action.payload) {
          state.userAchievement = {
            ...state.userAchievement,
            totalPoints: action.payload.totalPoints,
            currentLevel: action.payload.currentLevel,
            easyDishCount: action.payload.easyDishCount,
            mediumDishCount: action.payload.mediumDishCount,
            hardDishCount: action.payload.hardDishCount
          };
        }
      })
      .addCase(addAchievementPoints.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });

    // Get Leaderboard
    builder
      .addCase(getLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Level Configuration
    builder
      .addCase(getLevelConfiguration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLevelConfiguration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.levelConfig = action.payload;
      })
      .addCase(getLevelConfiguration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearAchievementData, 
  updateLocalAchievement,
  clearLastAchievementResult 
} = achievementSlice.actions;

export default achievementSlice.reducer;