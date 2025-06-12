import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import theme from '@/src/shared/theme';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName="(home)"
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={24}
              color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(collection-creation)"
        options={{
          title: 'Criar Coleção',
          tabBarIcon: () => <Feather name="plus" size={24} color={theme.colors.tertiary} />,
        }}
      />

      <Tabs.Screen
        name="(statistics)"
        options={{
          title: 'Estatisticas',
          tabBarIcon: ({ focused }) => (
            <Feather
              name="bar-chart-2"
              size={24}
              color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
