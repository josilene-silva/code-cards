import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

interface IStatisticSubContainer {
  type: 'easy' | 'medium' | 'hard';
}

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.themedBackground};
  padding: 36px 24px 50px;
`;

export const StatisticTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  color: ${({ theme }: any) => theme.colors.primary};
  font-family: ${({ theme }: any) => theme.fonts.semiBold};
  margin-top: 20px;
`;

export const StatisticContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
  margin-bottom: 100px;
`;

export const StatisticSubContainer = styled.View<IStatisticSubContainer>`
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme, type }: any) =>
    type ? theme.colors[type] : theme.colors.tertiary};
  width: 100%;
  padding: 10px 20px;
  border-radius: 8px;
  flex-direction: row;
`;

export const StatisticText = styled.Text<{ isData?: boolean }>`
  font-size: ${({ theme, isData }: any) =>
    getFontSize(isData ? theme.fontSizes.large : theme.fontSizes.medium)};
  color: ${({ theme }: any) => theme.colors.textInvert};
  font-family: ${({ theme, isData }: any) => (isData ? theme.fonts.semiBold : theme.fonts.regular)};
`;
