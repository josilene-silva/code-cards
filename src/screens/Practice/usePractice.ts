import { ICard } from '@/src/shared/interfaces/ICard';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export interface CardsProps extends ICard {
  side: number;
}

export enum CardsDifficultyLevel {
  EASY = 0,
  MEDIUM = 1,
  HARD = 2,
}

export enum CardSide {
  FRONT = 0,
  BACK = 1,
}

export const usePractice = () => {
  const id = 'id';

  const flipPositionAnimate = useSharedValue(0);

  const [currentCard, setCurrentCard] = useState(0);
  const [startTime, setStartTime] = useState<Date>();

  const [loadingRequest, setLoadingRequest] = useState(false);
  const cardListRef = useRef<FlatList>(null);

  const [cards, setCards] = useState<CardsProps[]>([
    {
      id: '1',
      front: 'Front 1',
      back: 'Back 1',
      side: CardSide.FRONT,
      difficultyLevel: CardsDifficultyLevel.EASY,
    },
    {
      id: '2',
      front: 'Front 2',
      back: 'Back 2',
      side: CardSide.FRONT,
      difficultyLevel: CardsDifficultyLevel.MEDIUM,
    },
    {
      id: '3',
      front: 'Front 3',

      back: 'Back 3',
      side: CardSide.FRONT,
      difficultyLevel: CardsDifficultyLevel.HARD,
    },
  ] as CardsProps[]);

  async function loadCardsSet() {
    setLoadingRequest(true);
    // api endpoint to get the set id from the route params
    setLoadingRequest(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadCardsSet();
      setStartTime(new Date());
    }, []),
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
      const cardsUpdate = cards.map((card) => {
        if (card.id === item.id) {
          card.side = 1;
        }
        return card;
      });
      setCards(cardsUpdate);
    },
    [cards],
  );

  const changeCardDifficultyLevel = useCallback(
    (item: CardsProps, difficultyLevel: number) => {
      const cardsUpdate = cards.map((card) => {
        if (card.id === item.id) {
          card.difficultyLevel = difficultyLevel;
        }
        return card;
      });
      setCards(cardsUpdate);
    },
    [cards],
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
    const totalCards = cards.length - 1;
    return currentCard < totalCards;
  }, [cards.length, currentCard]);

  function formatPracticePayload() {
    const amount = {
      amountEasy: 0,
      amountMedium: 0,
      amountHard: 0,
    };

    cards.map((card) => {
      if (card.difficultyLevel === CardsDifficultyLevel.EASY) amount.amountEasy += 1;
      if (card.difficultyLevel === CardsDifficultyLevel.MEDIUM) amount.amountMedium += 1;
      if (card.difficultyLevel === CardsDifficultyLevel.HARD) amount.amountHard += 1;
    });

    return {
      setId: id,
      startTime,
      endTime: new Date(),
      amountEasy: amount.amountEasy,
      amountMedium: amount.amountMedium,
      amountHard: amount.amountHard,
    };
  }

  const finishPractice = useCallback(() => {
    // If you need to use payloadCards, do something with it here, otherwise remove it
    // const payloadCards = cards.map((card) => ({
    //   id: card.id,
    //   difficultyLevel: card.difficultyLevel,
    //   setId: id,
    // }));

    router.replace('/(tabs)/(home)/practice-finish', {
      // id: response.data.id,
      // name: set.name,
    });
    setLoadingRequest(false);
  }, []);

  const handleSelectDifficultyLevel = useCallback(
    async (card: CardsProps, difficultyLevel: number) => {
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
    cards,
    cardListRef,
    frontCardAnimated,
    backCardAnimated,
    handleSeeBack,
    handleSelectDifficultyLevel,
    currentCard,
  };
};
