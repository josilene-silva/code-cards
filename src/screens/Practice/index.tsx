import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import Dots from '@/assets/images/dots.svg';
import { Button } from '@/src/components/Buttons';
import { Header } from '@/src/components/Header';
import { LoadingOverlay } from '@/src/components/LoadingOverlay';
import theme from '@/src/shared/theme/theme';
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
import { CardsDifficultyLevel, CardSide, CardsProps, usePractice } from './usePractice';

export function Practice() {
  const {
    cards,
    cardListRef,
    frontCardAnimated,
    backCardAnimated,
    handleSeeBack,
    handleSelectDifficultyLevel,
    currentCard,
  } = usePractice();

  const renderCollectionItem = useCallback(
    ({ item }: { item: CardsProps }) => (
      <View>
        <Card visible={item.side === CardSide.FRONT} type="front" style={frontCardAnimated}>
          <Dots width={40} height={40} style={{ position: 'absolute', top: 0, left: 10 }} />
          <FrontText>{item.front}</FrontText>
        </Card>

        <Card visible={item.side === CardSide.BACK} type="back" style={backCardAnimated}>
          <Dots width={40} height={40} style={{ position: 'absolute', top: 0, left: 10 }} />
          <BackText>{item.back}</BackText>
        </Card>

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
            bgColor="#2A9D8F"
            withShadow={false}
            onPress={() => handleSelectDifficultyLevel(item, CardsDifficultyLevel.EASY)}
          >
            Fácil
          </Button>
          <Button
            bgColor="#E0A26E"
            withShadow={false}
            onPress={() => handleSelectDifficultyLevel(item, CardsDifficultyLevel.MEDIUM)}
          >
            Mediana
          </Button>
          <Button
            bgColor="#F23333"
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

  return (
    <Container>
      <LoadingOverlay isVisible={false} />

      <Header title="Estudo de estruturas de repetição" onBackPress={() => router.back()} />

      <ProgressBar>
        <Progress percentage={(currentCard * 100) / cards.length} />
      </ProgressBar>

      <FlatList
        ref={cardListRef}
        data={cards}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={currentCard}
        renderItem={renderCollectionItem}
      />
    </Container>
  );
}
