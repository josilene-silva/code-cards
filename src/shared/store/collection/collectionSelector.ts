// src/features/auth/authSelectors.ts
import { RootState } from '..'; // Importe RootState da sua store principal

// 1. Seletor básico para o estado completo do slice 'auth'
export const selectCollectionState = (state: RootState) => state.collections;
