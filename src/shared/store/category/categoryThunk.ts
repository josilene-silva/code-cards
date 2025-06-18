import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../api/firebase/categoryService';
import { setCategories, setCategoriesError, setCategoriesLoading } from './categorySlice';

export const subscribeToCategories = createAsyncThunk(
  'categories/subscribeToCategories',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setCategories([]));

    dispatch(setCategoriesLoading(true));

    return await new Promise<() => void>((resolve, reject) => {
      const unsubscribe = categoryService.listenToCategories(
        (categories) => {
          dispatch(setCategories(categories));
          resolve(unsubscribe);
        },
        (error) => {
          dispatch(setCategoriesError(error.message ?? 'Failed to subscribe to categories.'));
          reject(rejectWithValue(error.message));
        },
      );
    });
  },
);
