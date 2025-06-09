import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
  padding: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const LoadingText = styled.Text`
  margin-bottom: 15px;
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.extraLarge)};
  font-family: ${({ theme }: any) => theme.fonts.medium};
  color: ${({ theme }: any) => theme.colors.tertiary};
`;
