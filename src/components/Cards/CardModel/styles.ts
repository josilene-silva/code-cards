import { Shadow } from '@/src/components/Shadow';
import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';
import { BaseButton } from '../../Buttons';

export const ShadowContainer = styled(Shadow)``;

export const Container = styled(BaseButton)`
  padding: 15px 15px;
  border-radius: 8px;
  border: 0.33px solid ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.background};
  gap: 15px;
  align-items: baseline;
`;

export const CardTitle = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.large)};
  font-family: ${(props: any) => props.theme.fonts.semiBold};
  color: ${(props: any) => props.theme.colors.title};
`;

export const CardSubTitle = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.medium)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.text};
`;

export const CardTagPublic = styled.Text`
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.small)};
  font-family: ${(props: any) => props.theme.fonts.regular};
  color: ${(props: any) => props.theme.colors.textInvert};
  background-color: ${(props: any) => props.theme.colors.tertiary};
  padding: 2px 8px;
  border-radius: 4px;
  text-align: right;
  align-self: flex-start;
`;

export const CardSubTitleLight = styled(CardSubTitle)`
  color: ${(props: any) => props.theme.colors.border};
  font-size: ${(props: any) => getFontSize(props.theme.fontSizes.small)};
  font-family: ${(props: any) => props.theme.fonts.regular};
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 15px;
`;
