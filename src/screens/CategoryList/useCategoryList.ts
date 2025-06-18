import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import {
  fetchUserSpecificCollectionsByCategoryId,
  selectCollectionState,
  selectSomeIsLoadingState,
} from '../../shared/store/collection';
import { Crash } from '@/src/shared/api/firebase/crashlytics';

export const useCategoryList = () => {
  const dispatch = useAppDispatch();
  const { collections } = useAppSelector(selectCollectionState);
  const isLoading = useAppSelector(selectSomeIsLoadingState);
  const params = useLocalSearchParams();
  const router = useRouter();

  const loadData = useCallback(() => {
    try {
      if (!params.categoryId) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar coleções',
          text2: 'Categoria não especificada.',
        });

        Crash.recordError(new Error('Categoria não especificada'));
        router.back();
        return;
      }

      dispatch(fetchUserSpecificCollectionsByCategoryId(params.categoryId as string)).unwrap();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error loading collections:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar coleções',
        text2: 'Não foi possível carregar as coleções.',
      });
    }
  }, [dispatch, params.categoryId, router]);

  // Efeito para buscar coleções por categoria quando a tela ganha foco
  useFocusEffect(loadData);

  return {
    collections,
    categoryName: (params.categoryName as string) ?? '',
    isLoading,
    router,
    loadData,
  };
};
