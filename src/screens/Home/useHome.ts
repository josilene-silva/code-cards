import { useAppDispatch } from '@/src/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/src/shared/hooks/useAppSelector';
import { clearAuth, selectCurrentUsername } from '@/src/shared/store/auth';

export function useHome() {
  const userName = useAppSelector(selectCurrentUsername);
  const dispatch = useAppDispatch();

  const onLogoutPress = () => {
    dispatch(clearAuth());
  };

  return {
    userName,
    onLogoutPress,
  };
}
