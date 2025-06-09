import { PressableProps } from 'react-native';
import { Container } from './styles';

export function BaseButton(props: PressableProps) {
  return (
    <Container
      {...props}
      style={({ pressed }: { pressed: boolean }) => [
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
        ...(props.style && typeof props.style === 'object' && !Array.isArray(props.style)
          ? [props.style]
          : []),
      ]}
    >
      {props.children}
    </Container>
  );
}
