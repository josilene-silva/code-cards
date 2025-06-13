// src/redux/slices/itemSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../interfaces/IUser';

interface UserState {
  user: IUser | null; // Representa o usuário atual, pode ser null se não estiver autenticado
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null; // Limpa erros ao iniciar um novo carregamento
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false; // Parar loading em caso de erro
    },
    // Ação para adicionar um item diretamente ao estado (para otimismo de UI)
    addUserOptimistic: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload; // Adiciona ao início da lista
    },
    // Ação para remover um item diretamente do estado (para otimismo de UI)
    removeUserOptimistic: (state, action: PayloadAction<string>) => {
      if (state.user?.id === action.payload) {
        state.user = null;
      }
    },
    // Ação para atualizar um item diretamente no estado (para otimismo de UI)
    updateUserOptimistic: (state, action: PayloadAction<IUser>) => {
      if (state.user?.id === action.payload.id) {
        state.user = action.payload;
      }
    },
  },
});

export const {
  setUserLoading,
  setUser,
  setUserError,
  addUserOptimistic,
  removeUserOptimistic,
  updateUserOptimistic,
} = userSlice.actions;

export default userSlice.reducer;
