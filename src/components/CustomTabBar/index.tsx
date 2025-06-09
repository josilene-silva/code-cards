import { useIsKeyboardShown } from '@/src/shared/hooks/useIsKeyboardShown';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { RoundedTabBarButton } from './RoundedTabBarButton';
import { Container } from './styles';
import { TabBarButton } from './TabBarButton';

const CREATE_COLLECTION_TAB_BAR_INDEX = 1;
const ROUTES_TO_OMIT_TAB_BAR_ON = ['collection-view', 'practice', 'practice-finish', 'statistic'];

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { routes, index: currentIndex } = state;

  const focusedRoute = routes[currentIndex];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const { tabBarHideOnKeyboard = false } = focusedDescriptor.options;

  const isKeyboardShown = useIsKeyboardShown();
  const shouldShowTabBar = !(tabBarHideOnKeyboard && isKeyboardShown);

  if (!shouldShowTabBar) {
    return null;
  }

  const shouldOmitTab = () =>
    focusedRoute?.state?.routes?.some((route: any) =>
      ROUTES_TO_OMIT_TAB_BAR_ON.includes(route.name),
    );

  const isCreateCollectionTabActive = currentIndex === CREATE_COLLECTION_TAB_BAR_INDEX;

  const shouldShowContainer = !isCreateCollectionTabActive && !shouldOmitTab();

  return (
    <Container shouldShow={shouldShowContainer}>
      {routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = currentIndex === index;

        const label =
          options?.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options?.title !== undefined
              ? String(options.title)
              : route.name;

        const TabIcon = options?.tabBarIcon as
          | React.FC<{ color: string; focused: boolean; size: number }>
          | undefined;

        if (index === CREATE_COLLECTION_TAB_BAR_INDEX) {
          return (
            <RoundedTabBarButton
              key={route.key}
              route={route}
              navigation={navigation}
              descriptors={descriptors}
              isFocused={isFocused}
              TabIcon={TabIcon}
            />
          );
        } else {
          return (
            <TabBarButton
              key={route.key}
              route={route}
              navigation={navigation}
              descriptors={descriptors}
              isFocused={isFocused}
              label={label}
              TabIcon={TabIcon}
            />
          );
        }
      })}
    </Container>
  );
};
