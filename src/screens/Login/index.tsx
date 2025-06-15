import React from 'react';

import { Button } from '@/src/components/Buttons';
import { Container, Logo, Subtitle, Title } from './styles';

import GoogleIcon from '@/assets/images/google.svg';
import { useLogin } from './useLogin';
import { View } from 'react-native';

export function Login() {
  const { handleGoogleLogin } = useLogin();

  return (
    <Container>
      <Logo width={300} height={300} />
      <Subtitle>Boas-vindas ao</Subtitle>
      <Title>CodeCards</Title>

      <Button Icon={<GoogleIcon />} width="100%" fullWidth onPress={handleGoogleLogin}>
        Entrar com Google
      </Button>
    </Container>
  );
}
