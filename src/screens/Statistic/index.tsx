import { BarChart } from '@/src/components/BarChart';
import { Header } from '@/src/components/Header';
import { selectCurrentSelectedPractice } from '@/src/shared/store/auth';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration'; // Use the aliased name here
import { useAppSelector } from '../../shared/hooks';

import { router } from 'expo-router';

import { useCallback } from 'react';
import {
  Container,
  StatisticContainer,
  StatisticSubContainer,
  StatisticText,
  StatisticTitle,
} from './styles';

dayjs.extend(durationPlugin);

export function Statistic() {
  const selectedPractice = useAppSelector(selectCurrentSelectedPractice);

  const calculateTotalTime = useCallback(() => {
    const start = dayjs(selectedPractice?.startTime);
    const end = dayjs(selectedPractice?.endTime);

    // Verifica se as datas são válidas
    if (!start.isValid() || !end.isValid()) {
      console.error('Uma ou ambas as datas fornecidas são inválidas.');
      return '00:00:00';
    }

    const diffMillis = Math.abs(end.diff(start));

    const diffDuration = dayjs.duration(diffMillis);

    const minutes = String(diffDuration.minutes());
    const seconds = String(diffDuration.seconds());

    if (seconds === '0' && minutes === '0') {
      return '0s';
    }

    let time = '';

    if (minutes === '0') {
      time = `${seconds}s`;
    } else {
      time = `${minutes}min ${seconds}s`;
    }

    return time;
  }, [selectedPractice?.startTime, selectedPractice?.endTime]);

  const getCardLabel = useCallback((amount: number) => {
    return `${amount} ${amount > 1 || amount === 0 ? 'cartões' : 'cartão'}`;
  }, []);

  return (
    <Container showsVerticalScrollIndicator={false}>
      <Header
        title={selectedPractice!.collectionName}
        onBackPress={() => {
          router.back();
        }}
      />

      <BarChart
        data={{
          easy: selectedPractice?.cardsAmountEasy || 0,
          medium: selectedPractice?.cardsAmountMedium || 0,
          hard: selectedPractice?.cardsAmountHard || 0,
          total: selectedPractice?.cardsAmount || 0,
        }}
      />

      <StatisticTitle>Dados</StatisticTitle>

      <StatisticContainer>
        <StatisticSubContainer type="easy">
          <StatisticText>Fácil</StatisticText>
          <StatisticText>{getCardLabel(selectedPractice!.cardsAmountEasy)}</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer type="medium">
          <StatisticText>Médio</StatisticText>
          <StatisticText>{getCardLabel(selectedPractice!.cardsAmountMedium)}</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer type="hard">
          <StatisticText>Difícil</StatisticText>
          <StatisticText>{getCardLabel(selectedPractice!.cardsAmountHard)}</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer>
          <StatisticText isData>Tempo atual</StatisticText>
          <StatisticText isData>{calculateTotalTime()}</StatisticText>
        </StatisticSubContainer>
        <StatisticSubContainer>
          <StatisticText isData>Menor tempo</StatisticText>
          <StatisticText isData>5 minutos</StatisticText>
        </StatisticSubContainer>
        <StatisticSubContainer>
          <StatisticText isData>Maior tempo</StatisticText>
          <StatisticText isData>10 minutos</StatisticText>
        </StatisticSubContainer>
        <StatisticSubContainer>
          <StatisticText isData>Vezes praticada</StatisticText>
          <StatisticText isData>15 vezes</StatisticText>
        </StatisticSubContainer>
      </StatisticContainer>
    </Container>
  );
}
