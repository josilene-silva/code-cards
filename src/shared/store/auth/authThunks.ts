import { createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseAuthService } from '../../api/firebase/authService';
import { clearAuth, setAuthError, setAuthLoading, setAuthenticatedUser } from './authSlice';
import { UserProfile } from './interfaces';

// Thunk para o login com Google
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAuthLoading(true));
    try {
      const firebaseUser = await firebaseAuthService.signInWithGoogle();
      console.log('Usuário logado com sucesso:', firebaseUser);
      dispatch(setAuthenticatedUser(firebaseUser));
      return firebaseUser;
    } catch (err: any) {
      console.error('Erro no login com Google:', err);
      const errorMessage = err.message || 'Ocorreu um erro ao tentar logar com o Google.';
      dispatch(setAuthError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);

// Thunk para o logout
export const signOutUser = createAsyncThunk(
  'auth/signOutUser',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAuthLoading(true));
    try {
      await firebaseAuthService.signOut(); // Desloga do Firebase
      dispatch(clearAuth()); // Limpa o estado Redux
      return true;
    } catch (err: any) {
      console.error('Erro ao fazer logout:', err);
      const errorMessage = err.message || 'Ocorreu um erro ao tentar fazer logout.';
      dispatch(setAuthError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);

export const checkAuthStatus = createAsyncThunk<UserProfile | null>(
  'auth/checkAuthStatus',
  async (_, { dispatch }) => {
    dispatch(setAuthLoading(true));

    return await new Promise<UserProfile | null>((resolve) => {
      const unsubscribe = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          const userProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          dispatch(setAuthenticatedUser(userProfile));
          resolve(userProfile);
        } else {
          dispatch(clearAuth());
          resolve(null);
        }
      });
    });
  },
);
