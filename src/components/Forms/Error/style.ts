import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const ContainerError = styled.View`
  margin-top: 2px;
`;

export const Message = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.small)};
  color: #ff6969;
  font-family: ${({ theme }: any) => theme.fonts.regular};
`;
