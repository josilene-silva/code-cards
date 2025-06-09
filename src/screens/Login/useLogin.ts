import { router } from 'expo-router';

export const useLogin = () => {
  const handleGoogleLogin = () => {
    console.log('Entrar com Google');
    router.navigate('/(tabs)/(home)');
  };

  return {
    handleGoogleLogin,
  };
};
