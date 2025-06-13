import theme from '@/src/shared/theme';
import { Button } from '../../Buttons';
import { CustomModal, CustomModalProps } from '../CustomModal';
import { ActionsContainer, ModalSubTitle, ModalTitle } from './styles';

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
    <CustomModal contentWidth="85%" contentHeight="auto" contentStyle={{ gap: 22 }} {...props}>
      <ModalTitle>{title}</ModalTitle>
      {subTitle && <ModalSubTitle>{subTitle}</ModalSubTitle>}

      <ActionsContainer>
        {leftButtonText && (
          <Button bgColor={theme.colors.tertiary} onPress={leftButtonOnPress}>
            {leftButtonText}
          </Button>
        )}
        {rightButtonText && (
          <Button bgColor={theme.colors.error} onPress={rightButtonOnPress}>
            {rightButtonText}
          </Button>
        )}
      </ActionsContainer>
    </CustomModal>
  );
}
