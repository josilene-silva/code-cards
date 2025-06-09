import React from 'react';

import { Bar, BarContainer, BarSubContainer, BarTitle, Container, Line } from './styles';

interface IBarChartProps {
  data: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

export function BarChart({ data }: IBarChartProps) {
  const getPercentage = (value: number) => {
    return (value * 100) / data.total;
  };

  return (
    <Container>
      <BarContainer>
        <BarSubContainer>
          <BarTitle>{getPercentage(data.easy)}%</BarTitle>
          <Bar type="easy" percentage={getPercentage(data.easy)} />
        </BarSubContainer>
        <BarSubContainer>
          <BarTitle>{getPercentage(data.medium)}%</BarTitle>
          <Bar type="medium" percentage={getPercentage(data.medium)} />
        </BarSubContainer>
        <BarSubContainer>
          <BarTitle>{getPercentage(data.hard)}%</BarTitle>
          <Bar type="hard" percentage={getPercentage(data.hard)} />
        </BarSubContainer>
      </BarContainer>
      <Line />
    </Container>
  );
}
