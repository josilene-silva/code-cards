import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { CardsDifficultyLevel, ICard } from '@/src/shared/interfaces/ICard';
import { ICollection } from '@/src/shared/interfaces/ICollection';
import { NewPractice } from '@/src/shared/interfaces/IPractice';
import { createPractice, selectCurrentLoadingPractice } from '@/src/shared/store/auth';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { selectCollectionState, selectSomeIsLoadingState } from '../../shared/store/collection';
import { Crash } from '@/src/shared/api/firebase/crashlytics';

export enum CardSide {
  FRONT = 0,
  BACK = 1,
}

export interface CardsProps extends ICard {
  side: CardSide;
}

export const usePractice = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const isLoadingPractice = useAppSelector(selectCurrentLoadingPractice);

  const { selectedCollection, cardsInSelectedCollection, collections } =
    useAppSelector(selectCollectionState);
  const isLoading = useAppSelector(selectSomeIsLoadingState);

  const cardListRef = useRef<FlatList>(null);

  // animate card flip
  const flipPositionAnimate = useSharedValue(0);

  const [startTime, setStartTime] = useState<Date>();

  const [currentCard, setCurrentCard] = useState(0);

  // cards with side
  const [cardsWithSide, setCardsWithSide] = useState<CardsProps[]>([]);

  function sortArray(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    // Enquanto ainda houver elementos para embaralhar.
    while (currentIndex !== 0) {
      // Escolha um elemento restante.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // E o troque com o elemento atual.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }
  const loadCollectionCards = useCallback(async () => {
    try {
      // garante que a coleção selecionada existe
      if (!selectedCollection || selectedCollection.id) {
        const foundCollection = collections.find(
          (col: ICollection) => col.id === params.collectionId,
        );

        if (!foundCollection) {
          Toast.show({
            type: 'error',
            text1: 'Coleção não encontrada',
            text2: 'A coleção que você está tentando acessar não existe.',
          });
          router.back();
        }

        if (cardsInSelectedCollection.length <= 0) {
          Toast.show({
            type: 'error',
            text1: 'Nenhum cartão encontrado',
            text2: 'A coleção que você está tentando acessar não contém cartões.',
          });
          router.back();
        }

        const cardsFormatted: CardsProps[] = cardsInSelectedCollection.map((card) => ({
          ...card,
          side: CardSide.FRONT,
        }));
        setCardsWithSide(sortArray(cardsFormatted));
      }
    } catch (error) {
      Crash.recordError(error);
      console.error('Error loading collection cards:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar os cartões da coleção',
        text2: 'Por favor, tente novamente mais tarde.',
      });
      router.back();
    }
  }, [selectedCollection, collections, params.collectionId, cardsInSelectedCollection, router]);

  useFocusEffect(
    useCallback(() => {
      loadCollectionCards();
      setStartTime(new Date());
    }, [loadCollectionCards]),
  );

  const frontCardAnimated = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${interpolate(flipPositionAnimate.value, [0, 1], [0, 180])}deg` }],
    };
  });

  const backCardAnimated = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${interpolate(flipPositionAnimate.value, [0, 1], [180, 360])}deg` }],
    };
  });

  const handleFlipCard = useCallback(() => {
    const newValue = flipPositionAnimate.value === 0 ? 1 : 0;
    flipPositionAnimate.value = withTiming(newValue, { duration: 300 });
  }, [flipPositionAnimate]);

  const changeCardSide = useCallback(
    (item: CardsProps) => {
      const cardsUpdate = cardsWithSide.map((card) => {
        if (card.id === item.id) {
          card.side = CardSide.BACK;
        }
        return card;
      });
      setCardsWithSide(cardsUpdate);
    },
    [cardsWithSide],
  );

  const changeCardDifficultyLevel = useCallback(
    (item: CardsProps, difficultyLevel: CardsDifficultyLevel) => {
      const cardsUpdate = cardsWithSide.map((card) => {
        if (card.id === item.id) {
          card.difficultyLevel = difficultyLevel;
        }
        return card;
      });
      setCardsWithSide(cardsUpdate);
    },
    [cardsWithSide],
  );

  const handleSeeBack = useCallback(
    (card: CardsProps) => {
      changeCardSide(card);
      handleFlipCard();
    },
    [changeCardSide, handleFlipCard],
  );

  const changeCardAnimationSide = useCallback(() => {
    cardListRef.current?.scrollToIndex({
      index: currentCard + 1,
      animated: true,
    });
    setCurrentCard((prevState) => prevState + 1);
  }, [currentCard]);

  const haveCards = useCallback(() => {
    const totalCards = cardsWithSide.length - 1;
    return currentCard < totalCards;
  }, [cardsWithSide.length, currentCard]);

  const finishPractice = useCallback(async () => {
    const amount = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    for (const card of cardsWithSide) {
      if (card.difficultyLevel === CardsDifficultyLevel.EASY) amount.easy += 1;
      if (card.difficultyLevel === CardsDifficultyLevel.MEDIUM) amount.medium += 1;
      if (card.difficultyLevel === CardsDifficultyLevel.HARD) amount.hard += 1;
    }

    const payload: NewPractice = {
      collectionId: selectedCollection?.id as string,
      collectionName: selectedCollection?.name as string,
      startTime: startTime!.toISOString(),
      endTime: new Date().toISOString(),
      cardsAmount: cardsWithSide.length,
      cardsAmountEasy: amount.easy,
      cardsAmountMedium: amount.medium,
      cardsAmountHard: amount.hard,
    };

    await dispatch(createPractice(payload)).unwrap();
    // Aqui você deve chamar a função para salvar o resultado da prática

    router.replace('/(tabs)/(home)/practice-finish');
  }, [router, cardsWithSide, selectedCollection, startTime, dispatch]);

  const handleSelectDifficultyLevel = useCallback(
    async (card: CardsProps, difficultyLevel: CardsDifficultyLevel) => {
      changeCardDifficultyLevel(card, difficultyLevel);
      if (haveCards()) {
        changeCardAnimationSide();
        handleFlipCard();
      } else {
        finishPractice();
      }
    },
    [changeCardDifficultyLevel, haveCards, changeCardAnimationSide, handleFlipCard, finishPractice],
  );
  return {
    cardsWithSide,
    cardListRef,
    frontCardAnimated,
    backCardAnimated,
    handleSeeBack,
    handleSelectDifficultyLevel,
    currentCard,
    isLoading,
    selectedCollection,
    cardsInSelectedCollection,
    isLoadingPractice,
  };
};
