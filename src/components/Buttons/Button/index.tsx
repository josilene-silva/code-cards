import React from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Shadow } from '../../Shadow';
import { ButtonText, StyledButtonContainer } from './style';

interface IButtonProps extends PressableProps {
  // Propriedades de Estilo
  readonly bgColor?: string;
  readonly textColor?: string;
  readonly fontFamily?: string;

  // Propriedades de Margem (mais flexíveis)
  readonly margin?: number | string;
  readonly marginTop?: number | string;
  readonly marginRight?: number | string;
  readonly marginBottom?: number | string;
  readonly marginLeft?: number | string;
  readonly fullWidth?: boolean;
  readonly width?: string;

  // Ícone
  readonly Icon?: React.ReactNode;

  // Sombra
  readonly withShadow?: boolean;
  readonly shadowStyle?: StyleProp<ViewStyle>;
}

export function Button({
  children,
  onPress,
  bgColor,
  textColor,
  fontFamily,
  Icon,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  width,
  fullWidth = false,
  withShadow = true,
  shadowStyle,
  ...pressableProps
}: IButtonProps) {
  const buttonContent = (
    <StyledButtonContainer
      {...pressableProps}
      onPress={onPress}
      width={width}
      fullWidth={fullWidth}
      bgColor={bgColor}
      margin={margin}
      marginTop={marginTop}
      marginRight={marginRight}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
    >
      {Icon && Icon}
      <ButtonText textColor={textColor} fontFamily={fontFamily}>
        {children}
      </ButtonText>
    </StyledButtonContainer>
  );

  if (withShadow) {
    return (
      <Shadow
        style={[{ width: fullWidth ? '100%' : undefined, alignItems: 'center' }, shadowStyle]}
      >
        {buttonContent}
      </Shadow>
    );
  }

  return buttonContent;
}
