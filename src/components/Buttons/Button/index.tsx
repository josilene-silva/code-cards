import React from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Shadow } from '../../Shadow';
import { ButtonText, StyledButtonContainer } from './style';

interface IButtonProps extends PressableProps {
  // Propriedades de Estilo
  bgColor?: string;
  textColor?: string;
  fontFamily?: string;

  // Propriedades de Margem (mais flexíveis)
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  fullWidth?: boolean;

  // Ícone
  Icon?: React.ReactNode;

  // Sombra
  withShadow?: boolean;
  shadowStyle?: StyleProp<ViewStyle>;
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
  fullWidth = false,
  withShadow = true,
  shadowStyle,
  ...pressableProps
}: IButtonProps) {
  const buttonContent = (
    <StyledButtonContainer
      {...pressableProps}
      onPress={onPress}
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
