import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  width: 100%;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  color: ${({ theme }: any) => theme.colors.tertiary};
  font-family: ${({ theme }: any) => theme.fonts.semiBold};
  flex-shrink: 1;
`;
