import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Certifique-se de que o serializableCheck esteja configurado se você estiver armazenando objetos Firebase
      // ou valores não serializáveis no estado.
      serializableCheck: {
        ignoredActions: ['auth/setAuthenticatedUser'],
        ignoredPaths: ['auth.user.stsTokenManager', 'auth.user.metadata'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
