import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import collectionsReducer from './collection/collectionSlice';
import userReducer from './user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Certifique-se de que o serializableCheck esteja configurado se você estiver armazenando objetos Firebase
      // ou valores não serializáveis no estado.
      serializableCheck: {
        ignoredActions: [
          'auth/setAuthenticatedUser',

          'collections/subscribeToCollections/fulfilled', // <-- Adicione esta!
          'collections/createCollection/fulfilled',
          'collections/updateCollection/fulfilled',
          'collections/deleteCollection/fulfilled',

          'collections/subscribeToCardsInCollection/fulfilled',
          'collections/createCard/fulfilled',
          'collections/updateCard/fulfilled',
          'collections/deleteCard/fulfilled',
        ],
        ignoredPaths: [
          'auth.user.stsTokenManager',
          'auth.user.metadata',

          'collections.collections[].createdAt',
          'collections.collections[].updatedAt',

          'collections.cardsInSelectedCollection[].createdAt',
          'collections.cardsInSelectedCollection[].updatedAt',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
