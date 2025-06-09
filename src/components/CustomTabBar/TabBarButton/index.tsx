import theme from '@/src/shared/theme/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native'; // Importar tipos
import React, { useCallback } from 'react';
import { Button, ButtonText } from '../styles';

interface TabBarButtonProps {
  route: RouteProp<ParamListBase, string>;
  navigation: BottomTabBarProps['navigation'];
  descriptors: BottomTabBarProps['descriptors'];
  isFocused: boolean;
  label: string | undefined;
  TabIcon: React.FC<{ color: string; focused: boolean; size: number }> | undefined;
}

export const TabBarButton: React.FC<TabBarButtonProps> = ({
  route,
  navigation,
  descriptors,
  isFocused,
  label,
  TabIcon,
}) => {
  const { options } = descriptors[route.key];

  const onPress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  }, [isFocused, navigation, route.key, route.name, route.params]);

  const onLongPress = useCallback(() => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  }, [navigation, route.key]);

  return (
    <Button
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options?.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {TabIcon && TabIcon({ color: theme.colors.primary, focused: isFocused, size: 24 })}
      <ButtonText isFocused={isFocused}>{label}</ButtonText>
    </Button>
  );
};
