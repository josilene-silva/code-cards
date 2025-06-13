import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/src/shared/hooks/useAppSelector';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import { selectCurrentUsername, signOutUser } from '@/src/shared/store/auth';
import {
  selectCollectionState,
  setSelectedCollection,
  subscribeToCollections,
} from '@/src/shared/store/collection';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useHome() {
  const userName = useAppSelector(selectCurrentUsername);
  const { collections } = useAppSelector(selectCollectionState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const unsubscribePromise = dispatch(subscribeToCollections()).unwrap();

    // Retorna uma função de limpeza para desinscrever quando o componente for desmontado
    return () => {
      // 'unwrap' resolve a Promise retornada pelo thunk, que contém a função de unsubscribe
      unsubscribePromise
        .then((unsubscribe: () => void) => {
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }
        })
        .catch((err) => {
          console.error('Failed to unsubscribe from collections:', err);
        });
    };
  }, [dispatch]);

  const onLogoutPress = () => {
    dispatch(signOutUser());
  };

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

  return {
    router,
    collections,
    userName,
    onLogoutPress,
    onPressCollection,
  };
}
