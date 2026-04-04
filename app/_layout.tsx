// app/_layout.tsx - 根布局（带启动页动画）
// 遵循 UX 设计报告 - 咖啡/奶油暖色调系
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Text as RNText, Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '../contexts/AuthContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// 防止自动隐藏启动屏
SplashScreen.preventAutoHideAsync();

// 自定义启动页组件
function AppSplashScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 入场动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        delay: 200,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 动画完成后通知父组件
      setTimeout(onFinish, 1500);
    });
  }, [onFinish]);

  return (
    <View style={styles.splashContainer}>
      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
            }
          ]}
        >
          <View style={styles.logoIcon}>
            <RNText style={styles.logoStar}>✦</RNText>
          </View>
        </Animated.View>

        {/* 标题 */}
        <RNText style={styles.title}>Date in BNBU</RNText>
        <RNText style={styles.subtitle}>校园社交，从相遇开始</RNText>

        {/* 在线人数 */}
        <View style={styles.onlineCount}>
          <View style={styles.onlineDot} />
          <RNText style={styles.onlineText}>293,025 用户在线</RNText>
        </View>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [splashComplete, setSplashComplete] = useEffect(() => {
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
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <AppSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
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

// 启动页样式
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#6B4226',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6B4226',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoStar: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#6B4226',
    marginBottom: 8,
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'Roboto' },
    }),
  },
  subtitle: {
    fontSize: 15,
    color: '#8B7355',
    marginBottom: 40,
  },
  onlineCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  onlineText: {
    fontSize: 14,
    color: '#8B7355',
  },
});
