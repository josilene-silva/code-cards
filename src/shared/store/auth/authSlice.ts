import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPractice } from '../../interfaces/IPractice';
import { IUser } from '../../interfaces/IUser';

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
  error: string | null;

  selectedPractice?: IPractice | null;
  practices: IPractice[];
  loadingPractices: boolean;
  errorPractices: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  loadingPractices: false,
  selectedPractice: null,
  practices: [],
  errorPractices: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticatedUser: (state, action: PayloadAction<IUser | null>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },

    // Practices
    setLoadingPractices: (state, action: PayloadAction<boolean>) => {
      state.loadingPractices = action.payload;
      state.errorPractices = null;
    },
    setSelectedPractice: (state, action: PayloadAction<IPractice | null>) => {
      state.selectedPractice = action.payload;
      state.loadingPractices = false;
      state.errorPractices = null;
    },
    addPracticeOptimistic: (state, action: PayloadAction<IPractice>) => {
      if (state.selectedPractice && action.payload.id === state.selectedPractice.id) {
        state.practices.unshift(action.payload);
      }
    },
    setPracticeError: (state, action: PayloadAction<string | null>) => {
      state.errorPractices = action.payload;
      state.loadingPractices = false;
    },
  },
});

export const {
  setAuthenticatedUser,
  setAuthLoading,
  setAuthError,
  clearAuth,
  addPracticeOptimistic,
  setLoadingPractices,
  setPracticeError,
  setSelectedPractice,
} = authSlice.actions;
export default authSlice.reducer;
