import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { firebaseAuthService } from '../../api/firebase/authService';
import { practiceService } from '../../api/firebase/practiceService';
import { userService } from '../../api/firebase/userService';
import { NewPractice } from '../../interfaces/IPractice';
import {
  addPracticeOptimistic,
  clearAuth,
  setAuthError,
  setAuthLoading,
  setAuthenticatedUser,
  setLoadingPractices,
  setPracticeError,
  setSelectedPractice,
} from './authSlice';

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setAuthLoading(true));
    try {
      const firebaseUser = await firebaseAuthService.signInWithGoogle();
      console.log('Usuário logado com sucesso:', firebaseUser);

      if (firebaseUser) {
        console.log('Usuário não existe, criando novo usuário no Firestore...');
        const userExists = await userService.getUserByEmail(firebaseUser.email!);

        if (!userExists) {
          const newUserData = {
            uid: firebaseUser.uid,
            name: firebaseUser?.displayName ?? '',
            email: firebaseUser?.email ?? '',
          };
          // Se o usuário não existir, crie um novo usuário no Firestore
          const newUser = await userService.createUser(newUserData);
          dispatch(setAuthenticatedUser(newUser));
        } else {
          console.log('Usuário já existe:', userExists);
          dispatch(setAuthenticatedUser(userExists));
        }

        return firebaseUser;
      } else {
        throw new Error('Usuário não autenticado.');
      }
    } catch (err: any) {
      console.error('Erro no login com Google:', err);
      const errorMessage = err.message || 'Ocorreu um erro ao tentar logar com o Google.';
      dispatch(setAuthError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  },
);

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

export const checkAuthStatus = createAsyncThunk<null>(
  'auth/checkAuthStatus',
  async (_, { dispatch }) => {
    dispatch(setAuthLoading(true));

    return await new Promise<null>((resolve) => {
      const unsubscribe = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          userService.getUserByEmail(firebaseUser.email!).then((user) => {
            dispatch(setAuthenticatedUser(user));
          });
          resolve(null);
        } else {
          dispatch(clearAuth());
          resolve(null);
        }
      });
    });
  },
);

// --- Thunks para Pratice (dentro de um user) ---

export const createPractice = createAsyncThunk(
  'auth/createPractice',
  async (newPracticeData: NewPractice, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(setLoadingPractices(true));

      const userId = (getState() as RootState).auth.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado. Não é possível criar uma prática.');
      }

      const createdPractice = await practiceService.createPractice(userId, newPracticeData);
      console.log('Prática criada com sucesso:', createdPractice);

      dispatch(addPracticeOptimistic(createdPractice)); // Adiciona a prática otimisticamente
      dispatch(setSelectedPractice(createdPractice)); // Define a prática selecionada

      return createdPractice;
    } catch (error: any) {
      dispatch(setPracticeError(error.message ?? 'Failed to create practice.'));
      return rejectWithValue(error.message);
    }
  },
);
