import { Crash } from '@/src/shared/api/firebase/crashlytics';
import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch';
import { signInWithGoogle } from '@/src/shared/store/auth';
import Toast from 'react-native-toast-message';

export const useLogin = () => {
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async () => {
    try {
      await dispatch(signInWithGoogle());
    } catch (error) {
      Crash.recordError(error);
      console.error('Error during Google login:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao fazer login com o Google. Tente novamente.',
      });
    }
  };

  return {
    handleGoogleLogin,
  };
};
