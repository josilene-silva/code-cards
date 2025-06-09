import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';
import { BaseButton } from '../Buttons';

interface IContainerProps {
  shouldShow: boolean;
}

export const Container = styled.View<IContainerProps>`
  display: ${(props: IContainerProps) => (props.shouldShow ? 'flex' : 'none')};
  flex-direction: row;
  background-color: ${(props: any) => props.theme.colors.tertiary};
  padding: 5px 10px;
  align-items: center;
  justify-content: space-around;
  elevation: 1;
  bottom: 15px;
  position: absolute;
  border-radius: 0;
  width: 85%;
  align-self: center;
  border-radius: 10000px;
`;

export const RoundedButton = styled(BaseButton)`
  background-color: ${(props: any) => props.theme.colors.primary};
  flex-shrink: 1;
  background-color: #ffffff;
  border-radius: 100px;
  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
  margin-top: -15px;
  elevation: 10;
`;

export const Button = styled(BaseButton)`
  flex: 1;
  align-items: center;
`;

export const ButtonText = styled.Text<{ isFocused?: boolean }>`
  font-family: ${(props: any) =>
    props.isFocused ? props.theme.fonts.medium : props.theme.fonts.regular};
  color: ${(props: any) => (props.isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)')};
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.small)};
  text-align: center;
  margin-top: 5px;
`;
