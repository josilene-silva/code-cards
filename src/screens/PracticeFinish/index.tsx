import React from 'react';

import { ButtonContainer, Container, GoBackButton, ReviewSubTitle, ReviewTitle } from './styles';

import Celebration from '@/assets/images/celebration.svg';
import { Button } from '@/src/components/Buttons';
import theme from '@/src/shared/theme';
import { router } from 'expo-router';

export function PracticeFinish() {
  // const id = router.params?.id;
  // const name = route.params?.name;
  const id = 'sasa';
  const name = 'asasa';

  return (
    <Container>
      <Celebration width={300} height={300} />
      <ReviewTitle>Revisão finalizada</ReviewTitle>
      <ReviewSubTitle>
        Parabéns por finalizar essa sessão de estudos. Continue com o bom trabalho!
      </ReviewSubTitle>
      <ButtonContainer>
        <Button
          bgColor={theme.colors.tertiary}
          onPress={() => {
            router.navigate('/(tabs)/(home)/statistic');
            // navigation.dispatch(StackActions.replace('SingleStatistic', { name, id }));
          }}
        >
          Ver meus resultados
        </Button>
        <GoBackButton
          withShadow={false}
          bgColor={'transparent'}
          textColor={theme.colors.tertiary}
          onPress={() => {
            router.back();
          }}
        >
          Finalizar
        </GoBackButton>
      </ButtonContainer>
    </Container>
  );
}
