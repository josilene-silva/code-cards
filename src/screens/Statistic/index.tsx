import { Header } from '@/src/components/Header';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration'; // Use the aliased name here
import { useAppSelector } from '../../shared/hooks';

import { router } from 'expo-router';

import { BarChart } from '@/src/components/BarChart';
import { useCallback } from 'react';
import { selectCollectionState } from '../../shared/store/collection';
import {
  Container,
  StatisticContainer,
  StatisticSubContainer,
  StatisticText,
  StatisticTitle,
} from './styles';

dayjs.extend(durationPlugin);

export function Statistic() {
  const { selectedCollectionWithPractices } = useAppSelector(selectCollectionState);

  const calculateTimes = useCallback(() => {
    let totalDurationInMs = 0;
    let minDurationMs = Infinity; // Inicializa com um valor muito alto
    let maxDurationMs = 0; // Inicializa com zero ou um valor muito baixo se durações puderem ser negativas

    for (const practice of selectedCollectionWithPractices!.userPractices) {
      if (practice.startTime && practice.endTime) {
        const start = dayjs(practice.startTime);
        const end = dayjs(practice.endTime);

        if (end.isAfter(start)) {
          // Garante que a data de fim é após a de início
          const currentPracticeDurationMs = end.diff(start); // Duração desta prática em milissegundos

          totalDurationInMs += Number(currentPracticeDurationMs); // Soma para o total

          // Atualiza a menor duração
          if (currentPracticeDurationMs < minDurationMs) {
            minDurationMs = currentPracticeDurationMs;
          }

          // Atualiza a maior duração
          if (currentPracticeDurationMs > maxDurationMs) {
            maxDurationMs = currentPracticeDurationMs;
          }
        }
      }
    }

    // Converte a duração total em um formato legível
    const totalDuration = dayjs.duration(totalDurationInMs);

    // --- FORMATAÇÃO DOS RESULTADOS ---
    const formattedTotalDuration =
      `${Math.floor(totalDuration.asHours()) > 0 ? `${Math.floor(totalDuration.asHours())}h ` : ''}` +
      `${totalDuration.minutes()}m ` +
      `${totalDuration.seconds()}s`;

    const formattedMinDuration =
      minDurationMs === Infinity // Se nenhuma prática válida foi encontrada, permanece Infinity
        ? 'N/A'
        : `${Math.floor(dayjs.duration(minDurationMs).asHours()) > 0 ? `${Math.floor(dayjs.duration(minDurationMs).asHours())}h ` : ''}` +
          `${dayjs.duration(minDurationMs).minutes()}m ` +
          `${dayjs.duration(minDurationMs).seconds()}s`;

    const formattedMaxDuration =
      maxDurationMs === 0 && selectedCollectionWithPractices!.userPractices.length === 0 // Se nenhuma prática válida foi encontrada, permanece 0 e não há práticas
        ? 'N/A'
        : `${Math.floor(dayjs.duration(maxDurationMs).asHours()) > 0 ? `${Math.floor(dayjs.duration(maxDurationMs).asHours())}h ` : ''}` +
          `${dayjs.duration(maxDurationMs).minutes()}m ` +
          `${dayjs.duration(maxDurationMs).seconds()}s`;

    return { total: formattedTotalDuration, min: formattedMinDuration, max: formattedMaxDuration };
  }, [selectedCollectionWithPractices]);

  const calculateCardsAmount = useCallback(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;

    for (const practice of selectedCollectionWithPractices!.userPractices) {
      easy += practice.cardsAmountEasy || 0;
      medium += practice.cardsAmountMedium || 0;
      hard += practice.cardsAmountHard || 0;
    }

    const total = easy + medium + hard;
    return { easy, medium, hard, total };
  }, [selectedCollectionWithPractices]);

  const getCardLabel = useCallback((amount: number) => {
    return `${amount} ${amount > 1 || amount === 0 ? 'cartões' : 'cartão'}`;
  }, []);

  return (
    <Container showsVerticalScrollIndicator={false}>
      <Header
        title={selectedCollectionWithPractices!.name}
        onBackPress={() => {
          router.back();
        }}
      />

      <BarChart
        data={{
          easy: calculateCardsAmount().easy,
          medium: calculateCardsAmount().medium,
          hard: calculateCardsAmount().hard,
          total: calculateCardsAmount().total,
        }}
      />

      <StatisticTitle>Dados</StatisticTitle>

      <StatisticContainer>
        <StatisticSubContainer type="easy">
          <StatisticText>Fácil</StatisticText>
          <StatisticText>{getCardLabel(calculateCardsAmount().easy)}</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer type="medium">
          <StatisticText>Médio</StatisticText>
          <StatisticText>{getCardLabel(calculateCardsAmount().medium)}</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer type="hard">
          <StatisticText>Difícil</StatisticText>
          <StatisticText>{getCardLabel(calculateCardsAmount().hard)}</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer>
          <StatisticText isData>Cartões praticados</StatisticText>
          <StatisticText isData>
            {selectedCollectionWithPractices?.totalCardsPracticed}
          </StatisticText>
        </StatisticSubContainer>
        <StatisticSubContainer>
          <StatisticText isData>Vezes praticadas</StatisticText>
          <StatisticText isData>
            {selectedCollectionWithPractices?.totalPracticeSessions}
          </StatisticText>
        </StatisticSubContainer>
        <StatisticSubContainer>
          <StatisticText isData>Tempo total</StatisticText>
          <StatisticText isData>{calculateTimes().total}</StatisticText>
        </StatisticSubContainer>
        <StatisticSubContainer>
          <StatisticText isData>Maior tempo</StatisticText>
          <StatisticText isData>{calculateTimes().max}</StatisticText>
        </StatisticSubContainer>
        <StatisticSubContainer>
          <StatisticText isData>Menor tempo</StatisticText>
          <StatisticText isData>{calculateTimes().min}</StatisticText>
        </StatisticSubContainer>
      </StatisticContainer>
    </Container>
  );
}
