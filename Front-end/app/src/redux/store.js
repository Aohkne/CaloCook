import { configureStore } from '@reduxjs/toolkit';
import { setStore } from '@services/api';
import authSlice from './slices/authSlice';
import dishSlice from './slices/dishSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dish: dishSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

setStore(store);
