import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  loginService,
  forgotPasswordService,
  getProfileService,
  logoutService,
  refreshTokenService,
  resetPasswordService,
  registerService,
  changePasswordService
} from '@/services/auth';

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  message: null
};

// Async thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginService(credentials);

    if (response?.user?.role === 'admin') {
      return rejectWithValue({
        message: 'Admin accounts cannot access this platform',
        code: 'ADMIN_LOGIN_FORBIDDEN'
      });
    }

    return response;
  } catch (error) {
    console.log('Redux login error:', error);
    return rejectWithValue(error);
  }
});

export const register = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerService(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await forgotPasswordService(email);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ otp, email, password }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordService(otp, email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// NEW: Change Password Async Thunk
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await changePasswordService({ oldPassword, newPassword });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await getProfileService();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await logoutService();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const response = await refreshTokenService();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      if (user?.role === 'admin') {
        state.error = 'Admin accounts cannot access this platform';
        return;
      }

      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    logoutLocal: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload?.user?.role === 'admin') {
          state.isLoading = false;
          state.error = 'Admin accounts cannot access this platform';
          state.isAuthenticated = false;
          return;
        }

        state.isLoading = false;
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          email: action.payload.email,
          role: action.payload.role
        };
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        state.message = 'Login successful';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.message = null;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.message = action.payload.message || 'Registration successful';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
        // Reset auth state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || 'Password reset email sent';
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send reset email';
      })
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || 'Password reset successful';
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Password reset failed';
      })
      //Change password cases
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || 'Password changed successfully';
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Change password failed';
      })
      // Get profile cases
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to get profile';
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, { ...initialState, message: 'Logout successful' });
      })
      .addCase(logout.rejected, (state, action) => {
        Object.assign(state, {
          ...initialState,
          error: action.payload?.message || 'Logout failed'
        });
      })
      // Refresh token cases
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken || action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user || state.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        // Token refresh failed - clear everything
        Object.assign(state, {
          ...initialState,
          error: action.payload?.message || 'Token refresh failed'
        });
      });
  }
});

export const { clearError, clearMessage, setCredentials, logoutLocal } = authSlice.actions;

export default authSlice.reducer;
