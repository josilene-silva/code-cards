import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      themedBackground: string;
      tertiary: string;
      title: string;
      text: string;
      textInvert: string;
      error: string;
      border: string;
      easy: string;
      medium: string;
      hard: string;
    };
    fonts: {
      regular: string;
      medium: string;
      bold: string;
      semiBold: string;
    };
    fontSizes: {
      small: number;
      medium: number;
      large: number;
      extraLarge: number;
      doubleExtraLarge: number;
    };
  }
}
