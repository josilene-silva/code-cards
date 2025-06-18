import { createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../api/firebase/categoryService';
import { setCategories, setCategoriesError, setCategoriesLoading } from './categorySlice';
import { RootState } from '..';
import { userCollectionService } from '../../api/firebase/userCollectionService';
import { collectionService } from '../../api';
import { ICollection } from '../../interfaces/ICollection';

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

export const fetchCategoriesWithCollections = createAsyncThunk(
  'categories/fetchCategoriesWithCollections',
  async (_, { dispatch, rejectWithValue, getState }) => {
    dispatch(setCategories([]));
    dispatch(setCategoriesLoading(true));
    try {
      const userId = (getState() as RootState).auth.user?.id;
      if (!userId) {
        throw new Error('User not authenticated.');
      }

      // 1. Obter todas coleções do usuário
      const userCollections = await userCollectionService.getUserCollectionsByUserId(userId);

      // 2. Extrair IDs únicos das coleções
      const uniqueCollectionIds = [
        ...new Set(userCollections.map((collection) => collection.collectionId)),
      ];
      console.log('Unique Collection IDs:', uniqueCollectionIds.length);

      // 3. Obter os detalhes das coleções correspondentes a esses IDs
      const fetchedCollections: ICollection[] = [];
      const BATCH_SIZE = 10;

      for (let i = 0; i < uniqueCollectionIds.length; i += BATCH_SIZE) {
        const batchIds = uniqueCollectionIds.slice(i, i + BATCH_SIZE);
        const collectionsBatch = await collectionService.getCollectionsByIdsWithCategory(batchIds);
        fetchedCollections.push(...collectionsBatch);
      }

      console.log('Fetched Collections:', fetchedCollections.length);

      // 4. Filtrar coleções que possuem categoria
      const privateCategoryIds = fetchedCollections
        .map((col) => col.categoryId)
        .filter((str) => str !== '');
      console.log('Private Category IDs:', privateCategoryIds);

      // 5. Obter categorias públicas
      const fetchedPublicCategories = await collectionService.getPublicCollections();
      console.log('Public Categories:', fetchedPublicCategories?.length || 0);

      const publicCategoryIds =
        fetchedPublicCategories?.map((col) => col.categoryId) ?? ([] as string[]);
      console.log('Public Category IDs:', publicCategoryIds);

      // 6. Combinar e filtrar IDs de categorias
      const combinedCategoryIds = [...privateCategoryIds, ...publicCategoryIds] as string[];

      // 7. Remover duplicatas
      const uniqueSet = new Set(combinedCategoryIds);
      const allCategoryIds = Array.from(uniqueSet);

      console.log('All Category IDs:', allCategoryIds);

      // 8. Buscar categorias por IDs
      const categories = await categoryService.getCategoriesByIds(allCategoryIds);
      console.log('Fetched Categories:', categories.length);

      categories.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });

      categories.forEach((category) => {
        if (publicCategoryIds.includes(category.id)) {
          category.withPublic = true;
        }
      });

      console.log('Sorted Categories:', categories);

      dispatch(setCategories(categories));
      return categories;
    } catch (error: any) {
      dispatch(setCategoriesError(error.message ?? 'Failed to fetch collections with categories.'));
      return rejectWithValue(error.message);
    }
  },
);
