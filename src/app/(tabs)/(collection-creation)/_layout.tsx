import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="collection-creation"
    >
      <Stack.Screen name="collection-creation" />
    </Stack>
  );
}
