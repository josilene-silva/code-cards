import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="index"
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="collection-view" />
      <Stack.Screen name="practice" />
      <Stack.Screen name="practice-finish" />
      <Stack.Screen name="category-list" />
      <Stack.Screen name="statistic" />
    </Stack>
  );
}
