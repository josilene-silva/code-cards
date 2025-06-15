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

  // Efeito para buscar coleções por categoria quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      if (!params.categoryId) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar coleções',
          text2: 'Categoria não especificada.',
        });
        router.back();
        return;
      }
      dispatch(subscribeToCollectionsByCategory({ categoryId: params.categoryId as string }));
    }, [dispatch, params.categoryId, router]),
  );

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

  // Função para lidar com a atualização
  const handleRefresh = useCallback(async () => {
    try {
      await dispatch(
        subscribeToCollectionsByCategory({ categoryId: 'oX0LC5C8PWQtgn5p994E' }),
      ).unwrap();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar as coleções',
        text2: 'Tente novamente mais tarde.',
      });
      Crash.recordError(error);
      console.error('Error refreshing collections:', error);
    }
  }, [dispatch]);

  return {
    collections,
    handleRefresh,
    categoryName: (params.categoryName as string) ?? '',
    isLoading,
    router,
  };
};
