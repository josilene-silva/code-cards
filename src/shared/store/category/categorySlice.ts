import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory } from '../../interfaces/ICategory';

interface CategoryState {
  categories: ICategory[];
  isLoading: boolean;
  error: string | null;
  selectedCategory?: ICategory | null;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCategoriesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCategories, setCategoriesLoading, setCategoriesError } = categorySlice.actions;
export default categorySlice.reducer;
