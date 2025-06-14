import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import Dots from '@/assets/images/dots.svg';
import { Button } from '@/src/components/Buttons';
import { Header } from '@/src/components/Header';
import { LoadingOverlay } from '@/src/components/LoadingOverlay';
import { CardsDifficultyLevel } from '@/src/shared/interfaces/ICard';
import theme from '@/src/shared/theme';
import { router } from 'expo-router';
import {
  BackText,
  ButtonContainer,
  Card,
  Container,
  FrontText,
  Progress,
  ProgressBar,
} from './styles';
import { CardSide, CardsProps, usePractice } from './usePractice';

export function Practice() {
  const {
    cardsWithSide,
    cardListRef,
    frontCardAnimated,
    backCardAnimated,
    handleSeeBack,
    handleSelectDifficultyLevel,
    currentCard,
    isLoading,
    selectedCollection,
    isLoadingPractice,
  } = usePractice();

  const renderCollectionItem = useCallback(
    ({ item }: { item: CardsProps }) => (
      <View>
        {item.side === CardSide.FRONT ? (
          <Card type="front" style={frontCardAnimated}>
            <Dots width={40} height={40} style={{ position: 'absolute', top: 0, left: 10 }} />
            <FrontText>{item.front}</FrontText>
          </Card>
        ) : (
          <Card type="back" style={backCardAnimated}>
            <Dots width={40} height={40} style={{ position: 'absolute', top: 0, left: 10 }} />
            <BackText>{item.back}</BackText>
          </Card>
        )}

        <ButtonContainer style={{ alignSelf: 'center' }} visible={item.side === CardSide.FRONT}>
          <Button
            withShadow={false}
            textColor={theme.colors.textInvert}
            bgColor={theme.colors.tertiary}
            onPress={() => handleSeeBack(item)}
          >
            Revelar resposta
          </Button>
        </ButtonContainer>

        <ButtonContainer visible={item.side === CardSide.BACK}>
          <Button
            bgColor={theme.colors.easy}
            withShadow={false}
            onPress={() => handleSelectDifficultyLevel(item, CardsDifficultyLevel.EASY)}
          >
            Fácil
          </Button>
          <Button
            bgColor={theme.colors.medium}
            withShadow={false}
            onPress={() => handleSelectDifficultyLevel(item, CardsDifficultyLevel.MEDIUM)}
          >
            Mediana
          </Button>
          <Button
            bgColor={theme.colors.hard}
            withShadow={false}
            onPress={() => handleSelectDifficultyLevel(item, CardsDifficultyLevel.HARD)}
          >
            Difícil
          </Button>
        </ButtonContainer>
      </View>
    ),
    [frontCardAnimated, backCardAnimated, handleSeeBack, handleSelectDifficultyLevel],
  );

  if (isLoading || isLoadingPractice) {
    return <LoadingOverlay isVisible={true} />;
  }

  return (
    <Container>
      <Header title={selectedCollection?.name ?? ''} onBackPress={() => router.back()} />

      <ProgressBar>
        <Progress percentage={(currentCard * 100) / cardsWithSide.length} />
      </ProgressBar>

      <FlatList
        ref={cardListRef}
        data={cardsWithSide}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={currentCard}
        renderItem={renderCollectionItem}
      />
    </Container>
  );
}
