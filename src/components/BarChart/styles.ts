import { getFontSize } from '@/src/shared/utils/styles';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View``;

interface IBarProps {
  type: 'easy' | 'medium' | 'hard';
  percentage: number;
}

const BarContainerSize = Dimensions.get('screen').height * 0.35;

export const BarContainer = styled.View`
  margin-top: 30px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-end;
  width: 100%;
  height: ${BarContainerSize}px;
`;

export const BarSubContainer = styled.View`
  align-items: center;
`;

export const BarTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  color: ${({ theme }: any) => theme.colors.tertiary};
  font-family: ${({ theme }: any) => theme.fonts.medium};
  margin-top: 8px;
  text-align: center;
`;

export const Bar = styled.View<IBarProps>`
  background-color: ${({ theme, type }: any) => theme.colors[type]};
  width: 50px;
  min-height: ${({ percentage }: any) => BarContainerSize * (percentage / 100)}px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const Line = styled.View`
  width: 100%;
  background-color: ${({ theme }: any) => theme.colors.tertiary};
  height: 5px;
  border-radius: 8px;
`;
