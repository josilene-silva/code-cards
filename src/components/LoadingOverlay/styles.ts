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
  background-color: ${({ theme }: any) => theme.colors.themedBackground};
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 20px;
  gap: 10px;
`;

export const LoadingText = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  font-family: ${({ theme }: any) => theme.fonts.medium};
  color: ${({ theme }: any) => theme.colors.textInvert};
`;
