import { useFonts } from 'expo-font';
import { router, SplashScreen, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../shared/hooks';
import { store } from '../shared/store';
import { checkAuthStatus, selectAuthState } from '../shared/store/auth';
import theme from '../shared/theme';

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isAuthenticated, isLoading } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const segments = useSegments();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/(home)');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)');
    }

    SplashScreen.hideAsync();
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

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
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.themedBackground }}>
        <StatusBar style="auto" />
        <SafeAreaView style={{ flex: 1 }}>
          <ThemeProvider theme={theme}>
            <RootLayoutContent />
          </ThemeProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Provider>
  );
}
