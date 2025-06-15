import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { height: screenHeight } = Dimensions.get('window');

export const ModalOverlay = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 22px;
`;

interface ModalContentProps {
  width?: string | number;
  height?: string | number;
}

export const ModalContent = styled.View<ModalContentProps>`
  background-color: ${({ theme }: any) => theme.colors.secondary};
  border-radius: 10px;
  padding: 20px;
  width: ${({ width }: any) => width ?? '100%'};
  max-width: 400px;
  height: ${({ height }: any) => height ?? 'auto'};
  max-height: ${screenHeight * 0.8}px;
`;

export const ModalBody = styled.ScrollView`
  flex-grow: 1;
`;
