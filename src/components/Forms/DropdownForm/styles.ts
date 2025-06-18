import styled, { DefaultTheme } from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
`;

export const Error = styled.Text<{ theme: DefaultTheme }>`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.hard};
  margin-top: 10px;
`;
