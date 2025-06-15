import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const ModalTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  color: ${({ theme }: any) => theme.colors.tertiary};
  font-family: ${({ theme }: any) => theme.fonts.semiBold};
  text-align: center;
`;

export const ModalSubTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  color: ${({ theme }: any) => theme.colors.textInvert};
  font-family: ${({ theme }: any) => theme.fonts.regular};
  text-align: center;
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  gap: 5px;
`;
