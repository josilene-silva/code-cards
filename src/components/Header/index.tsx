import theme from '@/src/shared/theme/theme';
import { Feather } from '@expo/vector-icons';
import { HeaderContainer, HeaderTitle } from './styles';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  RightIcon?: React.ReactNode;
}

export function Header({ onBackPress, title, RightIcon }: HeaderProps) {
  return (
    <HeaderContainer>
      <Feather name="chevron-left" size={40} color={theme.colors.tertiary} onPress={onBackPress} />
      <HeaderTitle numberOfLines={2}>{title}</HeaderTitle>
      {RightIcon ?? <Feather name="chevron-left" size={40} style={{ opacity: 0 }} />}
    </HeaderContainer>
  );
}
