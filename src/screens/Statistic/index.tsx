import { BarChart } from '@/src/components/BarChart';
import { Header } from '@/src/components/Header';
import { router } from 'expo-router';
import {
  Container,
  StatisticContainer,
  StatisticSubContainer,
  StatisticText,
  StatisticTitle,
} from './styles';

export function Statistic() {
  return (
    <Container showsVerticalScrollIndicator={false}>
      <Header title="Estudo de estruturas de repetição" onBackPress={() => router.back()} />

      <BarChart
        data={{
          easy: 5,
          medium: 3,
          hard: 2,
          total: 10,
        }}
      />

      <StatisticTitle>Dados</StatisticTitle>

      <StatisticContainer>
        <StatisticSubContainer type="easy">
          <StatisticText>Fácil</StatisticText>
          <StatisticText>5 cartões</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer type="medium">
          <StatisticText>Médio</StatisticText>
          <StatisticText>3 cartões</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer type="hard">
          <StatisticText>Difícil</StatisticText>
          <StatisticText>2 cartões</StatisticText>
        </StatisticSubContainer>

        <StatisticSubContainer>
          <StatisticText isData>Tempo atual</StatisticText>
          <StatisticText isData>3 minutos</StatisticText>
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
