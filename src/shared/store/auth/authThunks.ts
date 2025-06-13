import { createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseAuthService } from '../../api/firebase/authService';
import { userService } from '../../api/firebase/userService';
import { IUser } from '../../interfaces/IUser';
import { addUserOptimistic, removeUserOptimistic } from '../user/userSlice';
import { clearAuth, setAuthError, setAuthLoading, setAuthenticatedUser } from './authSlice';
import { UserProfile } from './interfaces';

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
          const tempId = `temp-${Date.now()}`;

          const userWithTempId: IUser = {
            id: tempId,
            ...newUserData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          dispatch(addUserOptimistic(userWithTempId)); // Atualização otimista da UI

          // Se o usuário não existir, crie um novo usuário no Firestore
          const newUser = await userService.createUser(newUserData);

          dispatch(removeUserOptimistic(userWithTempId.id));
          dispatch(addUserOptimistic(newUser));
        } else {
          console.log('Usuário já existe:', userExists);
        }

        dispatch(setAuthenticatedUser(firebaseUser));
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
