import { GenericList } from '@/src/components/GenericList';
import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const CardsList = styled(GenericList)`
  background-color: ${({ theme }: any) => theme.colors.background};
`;

export const HeaderContainer = styled.View`
  align-items: flex-start;
  background-color: ${({ theme }: any) => theme.colors.tertiary};
  padding: 50px 24px 40px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.extraLarge)};
  color: ${({ theme }: any) => theme.colors.textInvert};
  font-family: ${({ theme }: any) => theme.fonts.bold};
  margin-top: 43px;
`;

export const AboutContainer = styled.View`
  padding: 20px 20px 0;
`;

export const ActionsContainer = styled.View`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
`;

export const ActionsSubContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
`;

export const AboutTitle = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  font-family: ${({ theme }: any) => theme.fonts.medium};
  color: ${({ theme }: any) => theme.colors.title};
  margin-top: 30px;
  margin-bottom: 8px;
`;

export const AboutText = styled.Text`
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  font-family: ${({ theme }: any) => theme.fonts.medium};
  color: ${({ theme }: any) => theme.colors.text};
`;

export const CardContainer = styled.View`
  margin: 0 20px;
`;
