import { getFontSize } from '@/src/shared/utils/styles';
import styled from 'styled-components/native';
import { InputModifier } from './interface';

export const InputContainer = styled.View`
  width: 100%;
  margin-bottom: 18px;
  flex-shrink: 1;
`;

export const LabelRequiredText = styled.Text`
  color: #ff6969;
`;

export const LabelText = styled.Text`
  font-family: ${(props: any) => getFontSize(props.theme.fonts.medium)};
  color: ${(props: any) => props.theme.colors.text};

  font-size: ${getFontSize(12)};
  margin-bottom: 5px;
  margin-left: 5px;
`;

export const TextInput = styled.TextInput.attrs(({ theme }: any) => ({
  placeholderTextColor: theme.colors.border,
  cursorColor: theme.colors.tertiary,
  selectionColor: theme.colors.secondary,
}))<InputModifier>`
  width: 100%;
  font-family: ${(props: any) => props.theme.fonts.regular};
  border-radius: 8px;
  background-color: #eeeeee;
  padding: 19px 25px;
  font-size: ${({ theme }: any) => getFontSize(theme.fontSizes.medium)};
  color: ${(props: any) => props.theme.colors.tertiary};
`;
