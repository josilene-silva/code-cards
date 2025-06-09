import theme from '@/src/shared/theme/theme';
import { Button } from '../../Buttons';
import { CustomModal, CustomModalProps } from '../CustomModal';
import { ActionsContainer, ModalSubTitle, ModalTitle } from './styles';

type ModalProps = Omit<CustomModalProps, 'children'> & {
  title: string;
  subTitle: string;

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
      <ModalSubTitle>{subTitle}</ModalSubTitle>

      <ActionsContainer>
        <Button bgColor={theme.colors.tertiary} onPress={leftButtonOnPress}>
          {leftButtonText || ''}
        </Button>
        <Button bgColor={theme.colors.error} onPress={rightButtonOnPress}>
          {rightButtonText || ''}
        </Button>
      </ActionsContainer>
    </CustomModal>
  );
}
