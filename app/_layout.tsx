// app/_layout.tsx - 根布局（带 Campus Connect 启动页动画）
// 遵循 Campus Connect 设计规范
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as ExpoSplash from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '../contexts/AuthContext';
import { SplashScreen as CustomSplash } from '@/components/SplashScreen';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

ExpoSplash.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      ExpoSplash.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <CustomSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: '关于 Campus Connect' }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="matches" options={{ headerShown: false }} />
          <Stack.Screen name="chat" options={{ title: '聊天', presentation: 'modal' }} />
          <Stack.Screen name="profile/edit" options={{ title: '编辑资料' }} />
          <Stack.Screen name="settings" options={{ title: '设置' }} />
          <Stack.Screen name="help" options={{ title: '帮助与反馈' }} />
          <Stack.Screen name="about" options={{ title: '关于我们' }} />
          <Stack.Screen name="terms" options={{ title: '用户协议' }} />
          <Stack.Screen name="privacy" options={{ title: '隐私政策' }} />
          <Stack.Screen name="community" options={{ title: '社区准则' }} />
          <Stack.Screen name="blacklist" options={{ title: '黑名单' }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
