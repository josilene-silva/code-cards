import React from 'react';
import { ViewProps } from 'react-native';
import { ContainerError, Message } from './style';

export interface ErrorProps {
  message?: string;
  style?: ViewProps['style'];
}

export function Error({ message, style }: ErrorProps) {
  return (
    <ContainerError style={style}>
      <Message>{message}</Message>
    </ContainerError>
  );
}
