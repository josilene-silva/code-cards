import { ToastConfig } from 'react-native-toast-message';
import { Container, ContainerError, Message, MessageError, Title, TitleError } from './styles';

/*
  1. Create the config
*/
export const toastConfig: ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <Container>
      <Title>{props.text1}</Title>
      <Message>{props.text2}</Message>
    </Container>
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ContainerError>
      <TitleError>{props.text1}</TitleError>
      <MessageError>{props.text2}</MessageError>
    </ContainerError>
  ),
};
