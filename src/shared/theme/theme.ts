import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#0061FF',
    secondary: '#A2CAFF',
    tertiary: '#587DBD',

    background: '#FFFFFF',
    themedBackground: '#A2CAFF',

    title: '#1A1A1A',

    text: '#565656',
    textInvert: '#FFF',

    error: '#F23333',
    border: '#969CB2',

    easy: '#2A9D8F',
    medium: '#E0A26E',
    hard: '#F23333',
  },
  fonts: {
    regular: 'FredokaRegular',
    medium: 'FredokaMedium',
    bold: 'ComfortaaBold',
    semiBold: 'FredokaSemiBold',
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    extraLarge: 24,
    doubleExtraLarge: 32,
  },
};

export default theme;
