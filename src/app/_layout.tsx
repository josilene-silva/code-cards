import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';
import theme from '../shared/theme/theme';

export default function RootLayout() {
  const [loaded] = useFonts({
    ComfortaaBold: require('../../assets/fonts/Comfortaa/Comfortaa-Bold.ttf'),

    FredokaRegular: require('../../assets/fonts/Fredoka/Fredoka-Regular.ttf'),
    FredokaMedium: require('../../assets/fonts/Fredoka/Fredoka-Medium.ttf'),
    FredokaSemiBold: require('../../assets/fonts/Fredoka/Fredoka-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.themedBackground }}>
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeProvider theme={theme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </ThemeProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
