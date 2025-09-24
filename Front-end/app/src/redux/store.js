import { configureStore } from '@reduxjs/toolkit';
import { setStore } from '@services/api';

import authSlice from './slices/authSlice';
import dishSlice from './slices/dishSlice';
import favoriteSlice from './slices/favoriteSlice';
import userSlice from './slices/userSlice';
import chatSlice from './slices/chatSlice';
import modelSlice from './slices/modelSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dish: dishSlice,
    favorite: favoriteSlice,
    user: userSlice,
    chat: chatSlice,
    model: modelSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

setStore(store);
