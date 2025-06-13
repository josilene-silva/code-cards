import styled from 'styled-components/native';
import { getFontSize } from '../../utils/styles';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.themedBackground};
  border-radius: 8px;
  width: 90%;
  border-left-color: ${({ theme }: any) => theme.colors.tertiary};
  margin-top: 5%;
  padding: 10px;
  border-left-width: 5px;
  gap: 5px;
`;

export const Title = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  font-family: ${({ theme }: any) => theme.fonts.bold};
  color: ${({ theme }: any) => theme.colors.tertiary};
`;

export const Message = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  font-family: ${({ theme }: any) => theme.fonts.regular};
  color: ${({ theme }: any) => theme.colors.textInvert};
`;

export const ContainerError = styled(Container)`
  background-color: #ff9d9d;
  border-radius: 8px;
  width: 90%;
  border-left-color: ${({ theme }: any) => theme.colors.error};
  margin-top: 5%;
  padding: 10px;
  border-left-width: 5px;
  gap: 5px;
`;

export const TitleError = styled(Title)`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.large)};
  font-family: ${({ theme }: any) => theme.fonts.bold};
  color: ${({ theme }: any) => theme.colors.error};
`;

export const MessageError = styled(Message)`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  font-family: ${({ theme }: any) => theme.fonts.regular};
  color: ${({ theme }: any) => theme.colors.text};
`;
