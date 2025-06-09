import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="statistics"
    >
      <Stack.Screen name="statistics" />
      <Stack.Screen name="statistic" />
    </Stack>
  );
}
