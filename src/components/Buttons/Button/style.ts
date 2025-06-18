import { getFontSize, getMargin } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';
import { BaseButton } from '../BaseButton';
import { IButtonText, IContainer } from './interfaces';

export const StyledButtonContainer = styled(BaseButton)<IContainer>`
  background-color: ${(props: any) => props.bgColor || props.theme.colors.primary};
  padding: 15px 20px;
  width: ${({ fullWidth, width }: IContainer) => (fullWidth ? '80%' : (width ?? 'auto'))};
  border-radius: 10000px;

  margin-top: ${({ marginTop }: IContainer) => getMargin(marginTop)};
  margin-right: ${({ marginRight }: IContainer) => getMargin(marginRight)};
  margin-bottom: ${({ marginBottom }: IContainer) => getMargin(marginBottom)};
  margin-left: ${({ marginLeft }: IContainer) => getMargin(marginLeft)};

  align-items: center;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1;
`;

export const ButtonText = styled.Text<IButtonText>`
  color: ${({ textColor }: IButtonText) => textColor ?? '#FFFFFF'};
  font-family: ${(props: any) => props.fontFamily ?? props.theme.fonts.medium};
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  text-align: center;
`;
