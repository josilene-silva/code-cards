import { Button } from '@/src/components/Buttons';
import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: any) => theme.colors.white};
`;

export const ButtonContainer = styled.View`
  align-self: center;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
  gap: 25px;
`;

export const ReviewTitle = styled.Text`
  margin-top: 20px;
  font-family: ${({ theme }: any) => theme.fonts.bold};
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.extraLarge)};
  color: ${({ theme }: any) => theme.colors.primary};
`;

export const ReviewSubTitle = styled(ReviewTitle)`
  margin-top: 10px;
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  color: ${({ theme }: any) => theme.colors.text};
  text-align: center;
  width: 80%;
`;

export const GoBackButton = styled(Button)``;
