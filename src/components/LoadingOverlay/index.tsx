import React, { FC } from 'react';
import { Image, Modal, StyleProp, ViewStyle } from 'react-native';
import { LoadingContainer, LoadingText, Overlay } from './styles';

const LoadingGif = require('@/assets/images/gifs/loading_animation.gif');

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
  if (!isVisible) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="fade" statusBarTranslucent={true}>
      <Overlay style={overlayColor ? { backgroundColor: overlayColor } : {}}>
        <LoadingContainer style={containerStyle}>
          <Image style={{ width: 200, height: 200 }} source={LoadingGif} resizeMode="contain" />
          {message && <LoadingText style={textStyle}>{message}</LoadingText>}
        </LoadingContainer>
      </Overlay>
    </Modal>
  );
};
