import theme from '@/src/shared/theme';
import { Button } from '../../Buttons';
import { CustomModal, CustomModalProps } from '../CustomModal';
import { ActionsContainer, ModalSubTitle, ModalTitle } from './styles';
import { View } from 'react-native';

export type ModalProps = Omit<CustomModalProps, 'children'> & {
  title: string;
  subTitle?: string;

  rightButtonText?: string;
  rightButtonOnPress?: () => any;

  leftButtonText?: string;
  leftButtonOnPress?: () => any;
};

export function Modal({
  title,
  subTitle,
  rightButtonText,
  rightButtonOnPress,
  leftButtonText,
  leftButtonOnPress,
  ...props
}: ModalProps) {
  return (
    <CustomModal contentWidth="100%" contentHeight="auto" contentStyle={{ gap: 22 }} {...props}>
      <ModalTitle>{title}</ModalTitle>
      {subTitle && <ModalSubTitle>{subTitle}</ModalSubTitle>}

      <ActionsContainer>
        {leftButtonText && (
          <View style={{ width: 'auto', flexShrink: 1 }}>
            <Button width="100%" bgColor={theme.colors.tertiary} onPress={leftButtonOnPress}>
              {leftButtonText}
            </Button>
          </View>
        )}
        {rightButtonText && (
          <View style={{ width: 'auto', flexShrink: 1 }}>
            <Button width="100%" bgColor={theme.colors.error} onPress={rightButtonOnPress}>
              {rightButtonText}
            </Button>
          </View>
        )}
      </ActionsContainer>
    </CustomModal>
  );
}
