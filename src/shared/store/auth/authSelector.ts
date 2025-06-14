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

export const selectCurrentUsername = createSelector(
  selectCurrentUser,
  (user) => user?.name?.split(' ')[0] ?? 'Convidado',
);

export const selectCurrentSelectedPractice = createSelector(
  selectAuthState,
  (authState) => authState.selectedPractice,
);

export const selectCurrentLoadingPractice = createSelector(
  selectAuthState,
  (authState) => authState.loadingPractices,
);
