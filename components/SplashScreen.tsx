// Splash Screen - Campus Connect 启动页
// 设计风格: Logo + 标题 + 双按钮 + 法律条款

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        delay: 400,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 1500);
    });
  }, []);

  const handleGetStarted = () => {
    onFinish();
    router.replace('/(tabs)');
  };

  const handleLogin = () => {
    onFinish();
    router.push('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo and Title */}
      <Animated.View
        style={[
          styles.content,
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
            },
          ]}
        >
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoIcon}>✦</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text, fontFamily: typography.serif }]}>
          校园{'\n'}连接
        </Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          遇见懂你的人
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View
        style={[
          styles.actions,
          {
            opacity: buttonFadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleGetStarted}
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.9}
        >
          <Text style={[styles.primaryButtonText, { color: colors.white }]}>
            开始使用
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          style={[
            styles.secondaryButton,
            {
              borderColor: colors.primary,
            },
          ]}
          activeOpacity={0.9}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
            已有账号，登录
          </Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={[styles.legal, { color: colors.textSecondary }]}>
          继续即表示您同意我们的{' '}
          <Pressable onPress={() => router.push('/terms' as any)}>
            <Text style={[styles.legalLink, { color: colors.primary }]}>
              服务条款
            </Text>
          </Pressable>{' '}
          和{' '}
          <Pressable onPress={() => router.push('/privacy' as any)}>
            <Text style={[styles.legalLink, { color: colors.primary }]}>
              隐私政策
            </Text>
          </Pressable>
          。
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 28,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  logoIcon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 48,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    lineHeight: 54,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    paddingBottom: spacing.lg,
    gap: 12,
  },
  primaryButton: {
    height: 54,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    height: 54,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: typography.weights.semibold,
  },
  legal: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },
  legalLink: {
    fontWeight: typography.weights.medium,
  },
});
