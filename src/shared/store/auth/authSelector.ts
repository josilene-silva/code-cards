// src/features/auth/authSelectors.ts
import { createSelector } from '@reduxjs/toolkit'; // Importe createSelector do RTK
import { RootState } from '..'; // Importe RootState da sua store principal

// 1. Seletor básico para o estado completo do slice 'auth'
export const selectAuthState = (state: RootState) => state.auth;

// 2. Seletores para extrair propriedades específicas
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (authState) => authState.isAuthenticated,
);

export const selectCurrentUser = createSelector(selectAuthState, (authState) => authState.user);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (authState) => authState.isLoading,
);

export const selectAuthError = createSelector(selectAuthState, (authState) => authState.error);

export const selectCurrentUsername = createSelector(
  selectCurrentUser,
  (user) => user?.displayName?.split(' ')[0] || 'Convidado',
);

// 4. Exemplo de seletor mais complexo/combinado
export const selectAuthStatus = createSelector(
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  (isAuthenticated, isLoading, error) => ({
    isAuthenticated,
    isLoading,
    error,
  }),
);
