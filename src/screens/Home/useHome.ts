import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/src/shared/hooks/useAppSelector';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import { selectCurrentUsername, signOutUser } from '@/src/shared/store/auth';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import {
  fetchUserSpecificCollections,
  selectCollectionState,
  selectSomeIsLoadingState,
  setCollections,
  setSelectedCollection,
} from '../../shared/store/collection';

export function useHome() {
  const userName = useAppSelector(selectCurrentUsername);
  const { collections } = useAppSelector(selectCollectionState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user?.id); // Certifique-se de ter o UID do usuário
  const isLoading = useAppSelector(selectSomeIsLoadingState);

  const onLogoutPress = () => {
    dispatch(signOutUser());
  };

  // Efeito para buscar coleções específicas do usuário quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      try {
        console.log('useEffect: Fetching user-specific collections');
        if (userId) {
          dispatch(fetchUserSpecificCollections()).unwrap();
        } else {
          dispatch(setCollections([]));
        }
      } catch (error) {
        console.error('Error fetching user-specific collections:', error);
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar coleções',
          text2: 'Tente novamente mais tarde.',
        });
      }
    }, [dispatch, userId]),
  );

  const onPressCollection = (collection: ICollection) => {
    dispatch(setSelectedCollection(collection)); // Salva a coleção selecionada no Redux

    router.navigate({
      pathname: '/(tabs)/(home)/collection-view',
      params: {
        collectionId: collection.id,
      },
    });
    console.log(`Navigating to collection with ID: ${collection.id}`);
  };

  const handleRefresh = useCallback(async () => {
    if (!userId) {
      console.warn('Cannot refresh: User not authenticated.');
      return;
    }

    try {
      await dispatch(fetchUserSpecificCollections()).unwrap();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar as coleções',
        text2: 'Tente novamente mais tarde.',
      });
      console.error('Error refreshing collections:', error);
    }
  }, [dispatch, userId]);

  return {
    router,
    collections,
    userName,
    onLogoutPress,
    onPressCollection,
    userId,
    handleRefresh,
    isLoading,
  };
}
