import Logo from '@/assets/images/icon/logo.svg';
import { Button } from '@/src/components/Buttons';

import { AddCardButton } from '@/src/components/Buttons/AddCardButton';
import { Input } from '@/src/components/Forms/Input';
import { Header } from '@/src/components/Header';
import theme from '@/src/shared/theme';

import { CardModel, CardType } from '@/src/components/Cards/CardModel';
import { Modal, ModalProps } from '@/src/components/Modals/Modal';
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch';
import { NewCard } from '@/src/shared/interfaces/ICard';
import { SchemaCard, validationCard } from '@/src/shared/utils/form/validations/SchemaCard';
import {
  SchemaCollection,
  validationCollection,
} from '@/src/shared/utils/form/validations/SchemaCollection';
import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import Toast from 'react-native-toast-message'; // Importe o Toast
import { createCard, createCollection } from '../../shared/store/collection';

import {
  BottomSheetContainer,
  BottomSheetTitle,
  BottomSheetTitleContainer,
  ButtonContainer,
  Container,
  ScrollContainer,
} from './styles';
import { Crash } from '@/src/shared/api/firebase/crashlytics';
import { subscribeToCategories } from '@/src/shared/store/category/categoryThunk';
import { selectCategoryState } from '@/src/shared/store/category/categorySelector';
import { useAppSelector } from '@/src/shared/hooks';
import { DropdownForm } from '@/src/components/Forms/DropdownForm';
import { Item } from 'react-native-picker-select';
import { LoadingOverlay } from '@/src/components/LoadingOverlay';

interface ModalVisibility {
  delete: ModalProps;
  cancel: ModalProps;
  attention: ModalProps;
}

export function CollectionCreation() {
  const refRBSheet = useRef<{ open: () => void; close: () => void }>(null);
  const dispatch = useAppDispatch();
  const [cardsList, setCardsList] = useState<NewCard[]>([]);
  const [cardIndex, setCardIndex] = useState<number | null>(null);
  const { categories } = useAppSelector(selectCategoryState);
  const [formattedCategories, setFormattedCategories] = useState<Item[]>([]);
  const { isLoading } = useAppSelector(selectCategoryState);

  const changeModalVisibility = (type: 'delete' | 'cancel' | 'attention', isVisible?: boolean) => {
    setIsModalVisible((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        isVisible: isVisible ?? !prev[type].isVisible,
      },
    }));
  };

  const [isModalVisible, setIsModalVisible] = useState<ModalVisibility>({
    cancel: {
      isVisible: false,
      title: 'Tem certeza que deseja cancelar a criação dessa coleção?',
      subTitle: 'Essa ação não poderá ser revertida',
      rightButtonText: 'Descartar',
      leftButtonText: 'Manter',
      onClose: () => changeModalVisibility('cancel'),
      rightButtonOnPress: () => router.back(),
      leftButtonOnPress: () => {
        console.log('Left button pressed');
        changeModalVisibility('cancel');
      },
    },
    delete: {
      isVisible: false,
      title: 'Tem certeza que deseja remover este cartão?',
      subTitle: 'Essa ação não poderá ser revertida',
      rightButtonText: 'Excluir',
      leftButtonText: 'Manter',
      onClose: () => changeModalVisibility('delete'),
      leftButtonOnPress: () => {
        changeModalVisibility('delete');
      },
    },
    attention: {
      isVisible: false,
      title: 'Atenção',
      subTitle: 'Você precisa adicionar pelo menos um cartão para criar uma coleção.',
      leftButtonText: 'Ok',
      onClose: () => changeModalVisibility('attention'),
      leftButtonOnPress: () => {
        console.log('Left button pressed');
        changeModalVisibility('attention');
      },
    },
  });

  const { control, handleSubmit, reset, setFocus, formState } = useForm<SchemaCollection>({
    resolver: zodResolver(validationCollection),
    defaultValues: {},
  });

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

  const onSubmit = handleSubmit(async (data) => {
    console.log('Form Data:', data);

    try {
      if (cardsList.length === 0) {
        changeModalVisibility('attention');
        return;
      }

      const collectionCreated = await dispatch(createCollection({ ...data })).unwrap();
      console.log('Collection Created:', collectionCreated);

      const requisitions = [];
      for (const card of cardsList) {
        console.log('Collection id:', collectionCreated.id);
        console.log('Card:', card);

        requisitions.push(
          dispatch(createCard({ newCardData: card, collectionId: collectionCreated.id })).unwrap(),
        );
      }

      await Promise.allSettled(requisitions);

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Sua coleção foi criada.',
      });
      reset();
      router.back();
    } catch (error) {
      Crash.recordError(error);
      console.error('Error creating collection:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar coleção',
        text2: 'Ocorreu um erro ao criar a coleção. Tente novamente.',
      });
    }
  });

  const onSubmitCard = handleSubmitCard((data) => {
    console.log('Form Card Data:', data);

    if (cardIndex !== null) {
      console.log('Updating card at index:', cardIndex);
      setCardsList((prevCards) => {
        const updatedCards = [...prevCards];
        updatedCards[cardIndex] = data; // Update the card at the specified index
        return updatedCards;
      });
      console.log('Updated Cards List:', [...cardsList]);
      refRBSheet?.current?.close();
      setCardIndex(null); // Reset card index after updating

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Seu cartão foi atualizado.',
      });
    } else {
      console.log('Adding new card');
      setCardsList((prevCards) => [...prevCards, data]);
      console.log('Updated Cards List:', [...cardsList, data]);
      refRBSheet?.current?.close();
    }

    resetCard();
  });

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

  const getOnBackPress = () => {
    if (formState.isDirty || cardsList.length > 0) {
      changeModalVisibility('cancel');
    } else {
      router.back();
    }
  };

  useFocusEffect(
    useCallback(() => {
      setFormattedCategories([]);
      reset();
      setCardsList([]);
      resetCard();
      setCardIndex(null);
      changeModalVisibility('cancel', false);
      changeModalVisibility('delete', false);

      const unsubscribePromise = dispatch(subscribeToCategories());
      return () => {
        handleUnsubscribe(unsubscribePromise);
      };
    }, [reset, resetCard, dispatch]),
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

  if (isLoading || formattedCategories.length === 0) {
    return <LoadingOverlay isVisible />;
  }

  return (
    <Container>
      <Modal {...isModalVisible.cancel} />
      <Modal
        {...isModalVisible.delete}
        rightButtonOnPress={() => {
          console.log('delete card:', cardIndex);
          setCardsList((prevCards) => prevCards.filter((_, index) => index !== cardIndex));
          console.log('Card deleted at index:', cardIndex);
          changeModalVisibility('delete');
          setCardIndex(null);
          Toast.show({
            type: 'success',
            text1: 'Sucesso!',
            text2: 'Seu cartão foi excluído.',
          });
        }}
      />
      <Modal {...isModalVisible.attention} />

      <BottomSheetContainer
        ref={refRBSheet}
        onOpen={() => {
          setTimeout(() => {
            setFocusCard('front');
          }, 500);
        }}
      >
        <BottomSheetTitleContainer>
          <Feather size={40} name="x" style={{ opacity: 0 }} />
          <BottomSheetTitle>
            {cardIndex !== null ? 'Atualizar Cartão' : 'Adicionar Cartão'}
          </BottomSheetTitle>
          <Feather
            size={40}
            color={theme.colors.tertiary}
            name="x"
            onPress={() => {
              refRBSheet?.current?.close();
              resetCard();
            }}
          />
        </BottomSheetTitleContainer>
        <Input
          control={controlCard}
          name="front"
          placeholder="Frente"
          required
          maxLength={1000}
          numberOfLines={10}
          multiline
        />

        <Input
          control={controlCard}
          name="back"
          numberOfLines={10}
          multiline
          placeholder="Verso"
          required
          maxLength={1000}
        />

        <Button marginTop={24} onPress={onSubmitCard} width="100%" bgColor={theme.colors.tertiary}>
          {cardIndex !== null ? 'Atualizar' : 'Adicionar'}
        </Button>
      </BottomSheetContainer>

      <ScrollContainer>
        <Header
          title="Criar Coleção"
          RightIcon={<Logo width={49} height={52} />}
          onBackPress={getOnBackPress}
        />
        <Input
          control={control}
          name="name"
          placeholder="Nome da coleção"
          required
          maxLength={200}
          onSubmitEditing={() => setFocus('description')}
          returnKeyType="next"
        />

        <Input
          control={control}
          name="description"
          numberOfLines={10}
          multiline
          placeholder="Descrição"
          required
          maxLength={1000}
        />

        <DropdownForm
          items={formattedCategories}
          name="categoryId"
          control={control}
          error={formState.errors?.categoryId?.message}
        />

        <AddCardButton
          onButtonPress={() => {
            refRBSheet?.current?.open();
            setFocusCard('front');
          }}
        />

        {cardsList?.map((card, index) => (
          <View style={{ marginBottom: 15 }} key={index}>
            <CardModel
              editing
              type={CardType.card}
              title={card.front}
              subTitle={card.back}
              actions={{
                onDelete: () => {
                  setCardIndex(index);
                  changeModalVisibility('delete', true);
                  console.log('Delete pressed');
                },
                onEdit: () => {
                  console.log('Edit pressed');
                  setCardIndex(index);

                  refRBSheet?.current?.open();

                  setFocusCard('front');
                  setCardValue('front', cardsList[index].front);
                  setCardValue('back', cardsList[index].back);
                },
              }}
            />
          </View>
        ))}
      </ScrollContainer>

      <ButtonContainer>
        <Button onPress={onSubmit} width="100%" bgColor={theme.colors.tertiary}>
          Salvar
        </Button>
      </ButtonContainer>
    </Container>
  );
}
