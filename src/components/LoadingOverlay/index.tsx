import theme from '@/src/shared/theme';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleProp, ViewStyle } from 'react-native';
import { LoadingContainer, LoadingText, Overlay } from './styles';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  overlayColor?: string; // Cor de fundo do overlay (ex: 'rgba(0,0,0,0.5)')
  containerStyle?: StyleProp<ViewStyle>; // Estilo para o LoadingContainer
  textStyle?: StyleProp<ViewStyle>; // Estilo para o LoadingText
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({
  isVisible,
  overlayColor,
  containerStyle,
  textStyle,
  message = 'Carregando...', // Mensagem padrão
}) => {
  const [color, setColor] = useState(theme.colors.primary); // Cor inicial do ActivityIndicator
  // Alterna a cor do ActivityIndicator a cada 700ms

  useEffect(() => {
    const id = setInterval(() => {
      setColor((color) =>
        color === theme.colors.primary ? theme.colors.tertiary : theme.colors.primary,
      );
    }, 700);
    return () => clearInterval(id);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="fade" statusBarTranslucent={true}>
      <Overlay style={overlayColor ? { backgroundColor: overlayColor } : {}}>
        <LoadingContainer style={containerStyle}>
          <ActivityIndicator size="large" color={color} />
          {/* <Image style={{ width: 200, height: 200 }} source={LoadingGif} resizeMode="contain" /> */}
          {message && <LoadingText style={textStyle}>{message}</LoadingText>}
        </LoadingContainer>
      </Overlay>
    </Modal>
  );
};
