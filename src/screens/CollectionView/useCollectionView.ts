import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';

import { ModalProps } from '@/src/components/Modals/Modal';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import { SchemaCard, validationCard } from '@/src/shared/utils/form/validations/SchemaCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import {
  createCard,
  deleteCard,
  deleteCollection,
  selectCollectionState,
  selectSomeIsLoadingState,
  setSelectedCollection,
  subscribeToCardsInCollection,
} from '../../shared/store/collection';
import { Crash } from '@/src/shared/api/firebase/crashlytics';

interface ModalVisibility {
  deleteCollection: ModalProps;
  deleteCard: ModalProps;
}

export const useCollectionView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { selectedCollection, cardsInSelectedCollection, collections } =
    useAppSelector(selectCollectionState);

  const isLoading = useAppSelector(selectSomeIsLoadingState);
  const [cardId, setCardId] = useState<string | null>(null);
  const refRBSheet = useRef<{ open: () => void; close: () => void }>(null);

  const dispatch = useAppDispatch();

  const {
    control: controlCard,
    handleSubmit: handleSubmitCard,
    reset: resetCard,
    setFocus: setFocusCard,
    setValue: setCardValue,
  } = useForm<SchemaCard>({
    resolver: zodResolver(validationCard),
    defaultValues: {},
  });

  const onSubmitCard = handleSubmitCard(async (data) => {
    try {
      console.log('Form Card Data:', data);

      refRBSheet?.current?.close();

      await dispatch(
        createCard({ collectionId: selectedCollection!.id, newCardData: data }),
      ).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Seu cartão foi criado.',
      });

      refRBSheet.current?.close();

      resetCard();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error creating card:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao criar o cartão. Tente novamente.',
      });
      return;
    }
  });

  const changeModalVisibility = (type: 'deleteCollection' | 'deleteCard', isVisible?: boolean) => {
    setIsModalVisible((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        isVisible: isVisible ?? !prev[type].isVisible,
      },
    }));
  };

  const [isModalVisible, setIsModalVisible] = useState<ModalVisibility>({
    deleteCard: {
      isVisible: false,
      title: 'Tem certeza que deseja excluir este cartão?',
      subTitle: 'Essa ação não poderá ser revertida',
      rightButtonText: 'Excluir',
      leftButtonText: 'Manter',
      onClose: () => changeModalVisibility('deleteCard'),
      leftButtonOnPress: () => changeModalVisibility('deleteCard'),
    },
    deleteCollection: {
      isVisible: false,
      title: 'Tem certeza que deseja excluir esta coleção?',
      subTitle: 'Essa ação não poderá ser revertida',
      rightButtonText: 'Excluir',
      leftButtonText: 'Manter',
      onClose: () => changeModalVisibility('deleteCollection'),
      leftButtonOnPress: () => changeModalVisibility('deleteCollection'),
    },
  });

  const handleOpenModalDeleteCollection = () => {
    changeModalVisibility('deleteCollection');
  };

  const handleOpenModalDeleteCard = (cardId: string) => {
    setCardId(cardId);
    changeModalVisibility('deleteCard');
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollection) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir coleção',
        text2: 'Nenhuma coleção selecionada para exclusão.',
      });
      return;
    }

    try {
      changeModalVisibility('deleteCollection', false);

      await dispatch(deleteCollection(selectedCollection.id)).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Coleção excluída',
        text2: 'A coleção foi excluída com sucesso.',
      });

      router.back(); // Navigate back after deletion
    } catch (error) {
      Crash.recordError(error);
      console.error('Error deleting collection:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir coleção',
        text2: 'Ocorreu um erro ao excluir a coleção. Tente novamente.',
      });
    }
  };

  const handleDeleteCard = async () => {
    if (!cardId) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir cartão',
        text2: 'Nenhum cartão selecionado para exclusão.',
      });
      return;
    }

    changeModalVisibility('deleteCard');

    await dispatch(
      deleteCard({ collectionId: selectedCollection?.id as string, cardId: cardId as string }),
    ).unwrap();

    setCardId(null);

    Toast.show({
      type: 'success',
      text1: 'Cartão excluído',
      text2: 'O cartão foi excluído com sucesso.',
    });
  };

  const handleGotToPractice = () => {
    if (selectedCollection) {
      router.push({
        pathname: '/(tabs)/(home)/practice',
        params: { collectionId: selectedCollection.id },
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Nenhuma coleção selecionada',
        text2: 'Por favor, selecione  uma coleção para praticar.',
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const loadInfos = useCallback(() => {
    if (!selectedCollection || selectedCollection.id !== params.collectionId) {
      const foundCollection = collections.find(
        (col: ICollection) => col.id === params.collectionId,
      );

      if (foundCollection) {
        dispatch(setSelectedCollection(foundCollection));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Coleção não encontrada',
          text2: 'A coleção que você está tentando acessar não existe.',
        });
        router.back();
      }
    }

    if (params.collectionId) {
      const unsubscribePromise = dispatch(
        subscribeToCardsInCollection(params.collectionId as string),
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
              text1: 'Erro ao carregar cartões',
              text2: 'Não foi possível carregar os cartões da coleção.',
            });
            console.error('Failed to unsubscribe from cards:', err);
          });
      };
    }
  }, [collections, dispatch, params.collectionId, router, selectedCollection]);

  useFocusEffect(
    useCallback(() => {
      loadInfos();
    }, [loadInfos]),
  );

  return {
    handleGotToPractice,
    loadInfos,
    selectedCollection,
    cardsInSelectedCollection,
    isLoading,
    isModalVisible,
    setIsModalVisible,
    changeModalVisibility,
    handleOpenModalDeleteCollection,
    handleOpenModalDeleteCard,
    handleDeleteCollection,
    handleDeleteCard,
    handleGoBack,
    controlCard,
    resetCard,
    setFocusCard,
    setCardValue,
    refRBSheet,
    onSubmitCard,
  };
};
