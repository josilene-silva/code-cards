import { createAsyncThunk } from '@reduxjs/toolkit';

import { userService } from '../../api/firebase/userService';
import { ICollection } from '../../interfaces/ICollection';
import { IUser, NewUser, UpdateUser } from '../../interfaces/IUser';
import { setCollectionsError } from '../collection/collectionSlice';
import { RootState } from '../index';
import { addUserOptimistic, setUserError, updateUserOptimistic } from './userSlice';

export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUserData: NewUser, { dispatch, rejectWithValue }): Promise<ICollection | unknown> => {
    try {
      const userWithTempId: IUser = {
        id: `temp-${Date.now()}`,
        ...newUserData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addUserOptimistic(userWithTempId));

      const createdUser = await userService.createUser(newUserData);

      return createdUser;
    } catch (error: any) {
      dispatch(setCollectionsError(error.message ?? 'Failed to create collection.'));
      return rejectWithValue(error.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUserData: UpdateUser, { dispatch, rejectWithValue, getState }) => {
    try {
      const currentState = (getState() as RootState).user.user;

      const fullUpdatedUser: IUser = {
        ...currentState,
        ...(updatedUserData as IUser),
        updatedAt: new Date().toISOString(), // Data de atualização para UI otimista
      };

      dispatch(updateUserOptimistic(fullUpdatedUser));

      await userService.updateUser(updatedUserData);
      return fullUpdatedUser;
    } catch (error: any) {
      dispatch(setUserError(error.message || 'Failed to update user.'));
      return rejectWithValue(error.message);
    }
  },
);
