import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logoutLocal } from '@/redux/slices/authSlice';

const AuthContext = createContext();

// HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// PROVIDER
export const AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();

  // auth state from Redux
  const { user, token, refreshToken, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // KEYS
  const STORAGE_KEYS = {
    USER: '@user',
    TOKEN: '@accessToken',
    REFRESH_TOKEN: '@refreshToken'
  };

  // LOAD AUTH
  const loadAuthData = async () => {
    try {
      console.log('Loading auth data from AsyncStorage...');

      const values = await AsyncStorage.multiGet([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);

      const storedUser = values[0][1] ? JSON.parse(values[0][1]) : null;
      const storedToken = values[1][1];
      const storedRefreshToken = values[2][1];

      console.log('Stored data:', {
        hasUser: !!storedUser,
        hasToken: !!storedToken,
        hasRefreshToken: !!storedRefreshToken,
        userRole: storedUser?.role
      });

      if (storedUser?.role === 'admin') {
        console.log('Admin account detected - clearing stored data');
        await clearAuthData();
        setIsInitialized(true);
        return;
      }

      // RESTORE vào Redux
      if (storedUser && storedToken && storedRefreshToken) {
        dispatch(
          setCredentials({
            user: storedUser,
            token: storedToken,
            refreshToken: storedRefreshToken
          })
        );
        console.log('Auth data restored successfully');
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      await clearAuthData(); // Clear data nếu có lỗi
    } finally {
      setIsInitialized(true);
    }
  };

  // SAVE AUTH
  const saveAuthData = async () => {
    if (isAuthenticated && user && token && refreshToken) {
      if (user.role === 'admin') {
        console.log('Attempted to save admin data - aborting');
        await clearAuthData();
        dispatch(logoutLocal());
        return;
      }

      try {
        console.log('Saving auth data to AsyncStorage...');

        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(user)],
          [STORAGE_KEYS.TOKEN, token],
          [STORAGE_KEYS.REFRESH_TOKEN, refreshToken]
        ]);

        console.log('Auth data saved successfully');
      } catch (error) {
        console.error('Error saving auth data:', error);
      }
    }
  };

  // DELETE AUTH
  const clearAuthData = async () => {
    try {
      console.log('Clearing auth data from AsyncStorage...');

      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);

      console.log('Auth data cleared successfully');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated && user && token && refreshToken) {
        saveAuthData();
      } else if (!isAuthenticated) {
        clearAuthData();
      }
    }
  }, [user, token, refreshToken, isAuthenticated, isInitialized]);

  // LOGOUT
  const logout = async () => {
    console.log('Logging out...');
    await clearAuthData();
    dispatch(logoutLocal());
  };

  // logout();

  // GET ACCESS TOKEN
  const getAccessToken = () => {
    return token;
  };

  // CHECK TOKEN
  const isTokenExpired = () => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  };

  // CHECK IF USER IS VALID (not admin)
  const isValidUser = () => {
    return user && user.role !== 'admin';
  };

  const isUserAuthenticated = isAuthenticated && isValidUser();

  // RETURN
  const value = {
    // Auth states
    user,
    token,
    refreshToken,
    isAuthenticated: isUserAuthenticated,
    isLoading,
    isInitialized,

    // Functions
    logout,
    getAccessToken,
    isTokenExpired,
    isValidUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
