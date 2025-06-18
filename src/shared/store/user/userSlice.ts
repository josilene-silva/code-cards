import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, IUserWithPractices } from '../../interfaces/IUser';

interface UserState {
  users: IUserWithPractices[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IUserWithPractices[]>) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUsersLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUsersError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setUsers, setUsersLoading, setUsersError } = userSlice.actions;
export default userSlice.reducer;
