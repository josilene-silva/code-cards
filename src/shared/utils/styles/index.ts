import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();

export function getFontSize(size: number): string {
  const sizeCustom = size / fontScale;
  return `${sizeCustom}px`;
}

export const getMargin = (value?: number) => (value !== undefined ? `${value}px` : '0');
