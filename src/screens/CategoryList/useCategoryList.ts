import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import {
  selectCollectionState,
  selectSomeIsLoadingState,
  subscribeToCollectionsByCategory,
} from '../../shared/store/collection';
import { Crash } from '@/src/shared/api/firebase/crashlytics';

export const useCategoryList = () => {
  const dispatch = useAppDispatch();
  const { collections } = useAppSelector(selectCollectionState);
  const isLoading = useAppSelector(selectSomeIsLoadingState);
  const params = useLocalSearchParams();
  const router = useRouter();

  const loadData = useCallback(() => {
    if (!params.categoryId) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar coleções',
        text2: 'Categoria não especificada.',
      });
      router.back();
      return;
    }
    try {
      dispatch(subscribeToCollectionsByCategory({ categoryId: params.categoryId as string }));
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar as coleções',
        text2: 'Tente novamente mais tarde.',
      });
      Crash.recordError(error);
      console.error('Error loading collections:', error);
    }
  }, [dispatch, params.categoryId, router]);

  // Efeito para buscar coleções por categoria quando a tela ganha foco
  useFocusEffect(loadData);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribePromise = dispatch(
        subscribeToCollectionsByCategory({ categoryId: params.categoryId as string }),
      );

      return () => {
        unsubscribePromise
          .then((unsubscribe: any) => {
            if (unsubscribe && typeof unsubscribe === 'function') {
              unsubscribe();
            }
          })
          .catch((err) => {
            Toast.show({
              type: 'error',
              text1: 'Erro ao carregar coleções',
              text2: 'Não foi possível carregar as coleções.',
            });
            console.error('Failed to unsubscribe from collections:', err);
          });
      };
    };
    fetchData();
  }, [dispatch, params.categoryId]);

  return {
    collections,
    categoryName: (params.categoryName as string) ?? '',
    isLoading,
    router,
    loadData,
  };
};
