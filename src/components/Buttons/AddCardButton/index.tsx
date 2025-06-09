import theme from '@/src/shared/theme/theme';
import { Feather } from '@expo/vector-icons';
import { Button } from '../Button';

export function AddCardButton() {
  return (
    <Button
      Icon={<Feather name="plus" size={32} color={theme.colors.tertiary} />}
      bgColor="#FFF"
      textColor={theme.colors.tertiary}
      fontFamily={theme.fonts.regular}
      marginTop="20"
      withShadow={false}
      onPress={() => console.log('Alternative Button Pressed')}
    >
      Adicionar cartão
    </Button>
  );
}
