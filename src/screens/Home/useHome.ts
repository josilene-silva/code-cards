import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/src/shared/hooks/useAppSelector';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import { selectCurrentUsername, signOutUser } from '@/src/shared/store/auth';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';
import {
  fetchUserSpecificCollections,
  selectCollectionState,
  selectSomeIsLoadingState,
  setSelectedCollection,
} from '../../shared/store/collection';
import { Crash } from '@/src/shared/api/firebase/crashlytics';
import { fetchCategoriesWithCollections } from '@/src/shared/store/category/categoryThunk';
import { selectCategoryState } from '@/src/shared/store/category/categorySelector';
import { fetchUserPracticesRanking } from '@/src/shared/store/user/userThunk';
import { selectUserState } from '@/src/shared/store/user/userSelector';

export function useHome() {
  const userName = useAppSelector(selectCurrentUsername);
  const { collections } = useAppSelector(selectCollectionState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user?.id); // Certifique-se de ter o UID do usuário
  const isLoading = useAppSelector(selectSomeIsLoadingState);
  const { categories, isLoading: isLoadingCategories } = useAppSelector(selectCategoryState);
  const { users, isLoading: isLoadingUsers } = useAppSelector(selectUserState);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onLogoutPress = () => {
    dispatch(signOutUser());
  };

  const loadCollectionsData = useCallback(() => {
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

  const loadCategories = useCallback(() => {
    try {
      dispatch(fetchCategoriesWithCollections()).unwrap();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error fetching categories with collections:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar categorias',
        text2: 'Tente novamente mais tarde.',
      });
    }
  }, [dispatch]);

  const loadUserRanking = useCallback(() => {
    try {
      dispatch(fetchUserPracticesRanking()).unwrap();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error fetching user practices ranking:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar ranking',
        text2: 'Tente novamente mais tarde.',
      });
    }
  }, [dispatch]);

  const loadData = useCallback(() => {
    loadCategories();
    loadCollectionsData();
    loadUserRanking();
  }, [loadCategories, loadCollectionsData, loadUserRanking]);

  useFocusEffect(loadData);

  return {
    router,
    collections,
    userName,
    onLogoutPress,
    onPressCollection,
    userId,
    isLoading,
    categories,
    isLoadingCategories,
    loadData,
    users,
    isLoadingUsers,
    setIsModalVisible,
    isModalVisible,
  };
}
