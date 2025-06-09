import React, { FC, ReactNode } from 'react';
import { Modal as RNModal, ModalProps as RNModalProps, StyleProp, ViewStyle } from 'react-native';
import { ModalBody, ModalContent, ModalOverlay } from './styles';

export interface CustomModalProps extends RNModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;

  contentWidth?: string | number;
  contentHeight?: string | number;

  contentStyle?: StyleProp<ViewStyle>;

  scrollableContent?: boolean;
}

export const CustomModal: FC<CustomModalProps> = ({
  isVisible,
  onClose,
  children,
  contentWidth,
  contentHeight,
  contentStyle,
  scrollableContent = false,
  animationType = 'fade',
  transparent = true,
  ...restProps
}) => {
  const ContentWrapper = scrollableContent ? ModalBody : React.Fragment;

  return (
    <RNModal
      visible={isVisible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      {...restProps}
    >
      <ModalOverlay onPress={onClose}>
        <ModalContent
          width={contentWidth}
          height={contentHeight}
          style={contentStyle}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e: any) => e.stopPropagation()}
        >
          <ContentWrapper>{children}</ContentWrapper>
        </ModalContent>
      </ModalOverlay>
    </RNModal>
  );
};
