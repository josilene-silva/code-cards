import Icon from '@/assets/images/icon/logo.svg';
import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.themedBackground};
  align-items: center;
  justify-content: center;
`;

export const Logo = styled(Icon)`
  border-radius: 50%;
  border: 5px solid red;
  margin-bottom: 40px;
`;

export const Subtitle = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.tertiary};
  text-align: center;
`;

export const Title = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.doubleExtraLarge)};
  font-family: ${(props: any) => props.theme.fonts.bold};
  color: ${(props: any) => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 20%;
`;
