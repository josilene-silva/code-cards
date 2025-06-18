import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ModalProps } from '@/src/components/Modals/Modal';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import { SchemaCard, validationCard } from '@/src/shared/utils/form/validations/SchemaCard';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import {
  createCard,
  deleteCard,
  deleteCollection,
  selectCollectionState,
  selectSomeIsLoadingState,
  setSelectedCollection,
  subscribeToCardsInCollection,
  updateCard,
  updateCollection,
} from '../../shared/store/collection';
import { Crash } from '@/src/shared/api/firebase/crashlytics';
import {
  SchemaCollection,
  validationCollection,
} from '@/src/shared/utils/form/validations/SchemaCollection';
import { subscribeToCategories } from '@/src/shared/store/category/categoryThunk';
import { selectCategoryState } from '@/src/shared/store/category/categorySelector';
import { Item } from 'react-native-picker-select';

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
  const refBSCard = useRef<{ open: () => void; close: () => void }>(null);
  const refBSCollection = useRef<{ open: () => void; close: () => void }>(null);

  const dispatch = useAppDispatch();

  const { categories } = useAppSelector(selectCategoryState);
  const [formattedCategories, setFormattedCategories] = useState<Item[]>([]);

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

  const {
    control: controlCollection,
    handleSubmit: handleSubmitCollection,
    reset: resetCollection,
    setFocus: setFocusCollection,
    setValue: setCollectionValue,
    formState: formStateCollection,
  } = useForm<SchemaCollection>({
    resolver: zodResolver(validationCollection),
    defaultValues: {},
  });

  const handleSaveCreateCard = async (data: SchemaCard) => {
    try {
      await dispatch(
        createCard({ collectionId: selectedCollection!.id, newCardData: data }),
      ).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Seu cartão foi criado.',
      });

      refBSCard.current?.close();
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
  };

  const handleSaveEditedCard = async (data: SchemaCard) => {
    try {
      const cardEdited = cardsInSelectedCollection.find((card) => card.id === cardId);

      await dispatch(
        updateCard({
          collectionId: selectedCollection!.id,
          updatedCardData: {
            id: cardEdited!.id,
            collectionId: selectedCollection!.id,
            ...data,
          },
        }),
      ).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Seu cartão foi atualizado.',
      });
      refBSCard.current?.close();
      setCardId(null);
      resetCard();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error updating card:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao atualizar o cartão. Tente novamente.',
      });
      return;
    }
  };

  const onSubmitCard = handleSubmitCard(async (data) => {
    console.log('Form card Data:', data);
    if (cardId === null) {
      handleSaveCreateCard(data);
    } else {
      handleSaveEditedCard(data);
    }
  });

  const onSubmitCollection = handleSubmitCollection(async (data) => {
    console.log('Form Collection Data:', data);
    try {
      await dispatch(
        updateCollection({
          id: selectedCollection!.id,
          ...data,
        }),
      ).unwrap();

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Sua coleção foi atualizada.',
      });
      refBSCollection.current?.close();
      resetCollection();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error updating collection:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: 'Ocorreu um erro ao atualizar a coleção. Tente novamente.',
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

  const handleEditCard = (cardId: string) => {
    setCardId(cardId);
    const cardToEdit = cardsInSelectedCollection.find((card) => card.id === cardId);
    if (cardToEdit) {
      setCardValue('front', cardToEdit.front);
      setCardValue('back', cardToEdit.back);
    }
    refBSCard.current?.open();
  };

  const handleEditCollection = () => {
    if (selectedCollection) {
      setCollectionValue('name', selectedCollection.name);
      setCollectionValue('description', selectedCollection.description);
      setCollectionValue('categoryId', selectedCollection.categoryId ?? '');
    }
    refBSCollection.current?.open();
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

  const handleUnsubscribe = (unsubscribePromise: Promise<any>) => {
    unsubscribePromise
      .then((unsubscribe: any) => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar categorias',
          text2: 'Não foi possível carregar as categorias.',
        });
        console.error('Failed to unsubscribe from categories:', err);
      });
  };

  useFocusEffect(
    useCallback(() => {
      loadInfos();
      const unsubscribePromise = dispatch(subscribeToCategories());
      return () => {
        handleUnsubscribe(unsubscribePromise);
      };
    }, [loadInfos, dispatch]),
  );

  useEffect(() => {
    if (categories.length > 0) {
      const aux = categories.map((category) => ({
        value: category.id as string,
        label: category?.name as string,
      }));

      setFormattedCategories(aux);
    }
  }, [categories]);

  return {
    selectedCollection,
    cardsInSelectedCollection,
    handleGotToPractice,
    handleOpenModalDeleteCollection,
    handleOpenModalDeleteCard,
    isModalVisible,
    handleDeleteCollection,
    handleDeleteCard,
    handleGoBack,
    isLoading,
    controlCard,
    setFocusCard,
    refBSCard,
    onSubmitCard,
    handleEditCard,
    cardId,
    refBSCollection,
    setFocusCollection,
    controlCollection,
    handleEditCollection,
    onSubmitCollection,
    formattedCategories,
    formStateCollection,
    resetCard,
    resetCollection,
    setCardId,
  };
};
