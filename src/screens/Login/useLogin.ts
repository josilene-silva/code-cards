import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch';
import { signInWithGoogle } from '@/src/shared/store/auth';

export const useLogin = () => {
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async () => {
    await dispatch(signInWithGoogle());
  };

  return {
    handleGoogleLogin,
  };
};
