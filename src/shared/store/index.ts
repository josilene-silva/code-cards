import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import collectionsReducer from './collection/collectionSlice';
import categoryReducer from './category/categorySlice';
import userReducer from './user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionsReducer,
    categories: categoryReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Certifique-se de que o serializableCheck esteja configurado se você estiver armazenando objetos Firebase
      // ou valores não serializáveis no estado.
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
