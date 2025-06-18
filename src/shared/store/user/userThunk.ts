import { createAsyncThunk } from '@reduxjs/toolkit';
import { setUsers, setUsersError, setUsersLoading } from './userSlice';

import { IUserWithPractices } from '../../interfaces/IUser';
import { practiceService } from '../../api/firebase/practiceService';

export const fetchUserPracticesRanking = createAsyncThunk(
  'user/fetchUserPracticesRanking',
  async (_, { dispatch, rejectWithValue, getState }) => {
    dispatch(setUsersLoading(true));

    try {
      const userPractices =
        (await practiceService.getAllUsersAndTheirPractices()) as IUserWithPractices[];

      if (userPractices?.length === 0) {
        dispatch(setUsers([]));
        return [];
      }

      dispatch(setUsers(userPractices));
      dispatch(setUsersLoading(false));

      return userPractices;
    } catch (error: any) {
      dispatch(setUsersError(error.message ?? 'Failed to fetch collections with user practices.'));
      return rejectWithValue(error.message);
    }
  },
);
