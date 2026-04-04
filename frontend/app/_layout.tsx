import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '../contexts/AuthContext'; // 导入AuthProvider

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider> {/* 包装整个应用 */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: '关于 Dating in BNBU' }} />
          <Stack.Screen name="login" options={{ title: '登录' }} />
          <Stack.Screen name="register" options={{ title: '注册' }} />
          <Stack.Screen name="matches" options={{ title: '我的匹配' }} />
          <Stack.Screen name="chat" options={{ title: '聊天', presentation: 'modal' }} />
          <Stack.Screen name="profile/edit" options={{ title: '编辑资料' }} />
          <Stack.Screen name="settings" options={{ title: '设置' }} />
          <Stack.Screen name="help" options={{ title: '帮助与反馈' }} />
          <Stack.Screen name="about" options={{ title: '关于我们' }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
