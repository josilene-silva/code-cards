import React from 'react';

import { ButtonContainer, Container, GoBackButton, ReviewSubTitle, ReviewTitle } from './styles';

import Celebration from '@/assets/images/celebration.svg';
import { Button } from '@/src/components/Buttons';
import { setSelectedPractice } from '@/src/shared/store/auth';
import theme from '@/src/shared/theme';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';

export function PracticeFinish() {
  const dispatch = useDispatch();

  return (
    <Container>
      <Celebration width={300} height={300} />
      <ReviewTitle>Revisão finalizada</ReviewTitle>
      <ReviewSubTitle>
        Parabéns por finalizar essa sessão de estudos. Continue com o bom trabalho!
      </ReviewSubTitle>
      <ButtonContainer>
        <View style={{ width: '100%' }}>
          <Button
            bgColor={theme.colors.tertiary}
            onPress={() => {
              router.navigate('/(tabs)/(home)/statistic');
            }}
          >
            Ver meus resultados
          </Button>
        </View>
        <GoBackButton
          withShadow={false}
          bgColor={'transparent'}
          textColor={theme.colors.tertiary}
          onPress={() => {
            router.back();
            dispatch(setSelectedPractice(null));
          }}
        >
          Finalizar
        </GoBackButton>
      </ButtonContainer>
    </Container>
  );
}
