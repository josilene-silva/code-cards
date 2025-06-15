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
  setSelectedCollection,
} from '../../shared/store/collection';
import { Crash } from '@/src/shared/api/firebase/crashlytics';

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

  const loadData = useCallback(() => {
    try {
      console.log('useEffect: Fetching user-specific collections');
      dispatch(fetchUserSpecificCollections()).unwrap();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error fetching user-specific collections:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar coleções',
        text2: 'Tente novamente mais tarde.',
      });
    }
  }, [dispatch]);

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

  useFocusEffect(loadData);

  return {
    router,
    collections,
    userName,
    onLogoutPress,
    onPressCollection,
    userId,
    isLoading,
    loadData,
  };
}
