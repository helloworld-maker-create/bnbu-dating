// app/login.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INPUT_WIDTH = Math.min(SCREEN_WIDTH - 64, 350);

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();

  const [eduEmail, setEduEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 验证 edu 邮箱格式
  const validateEduEmail = (email: string): boolean => {
    const eduEmailRegex = /^[^\s@]+@[^\s@]+\.edu$/;
    return eduEmailRegex.test(email);
  };

  // 验证表单输入
  const validateForm = (): boolean => {
    if (!eduEmail.trim()) {
      setErrorMessage('请输入邮箱地址');
      return false;
    }
    if (!validateEduEmail(eduEmail.trim())) {
      setErrorMessage('请使用有效的 .edu 邮箱地址');
      return false;
    }
    if (!password) {
      setErrorMessage('请输入密码');
      return false;
    }
    return true;
  };

  // 处理登录
  const handleLogin = async () => {
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({
        eduEmail: eduEmail.trim().toLowerCase(),
        password,
      });

      if (result.code === 0) {
        // 登录成功，跳转到首页
        router.replace('/(tabs)');
      } else {
        setErrorMessage(result.message || '登录失败，请检查账号和密码');
      }
    } catch (error) {
      setErrorMessage('登录失败，请稍后重试');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || authLoading;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 头部 Logo 区域 */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="heart" size={40} color="#fff" />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>DATE IN BNBU</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              校园社交，从相遇开始
            </ThemedText>
          </View>

          {/* 登录表单 */}
          <View style={styles.form}>
            {/* 错误消息 */}
            {errorMessage && (
              <View style={[styles.errorContainer, { backgroundColor: `${colors.passButton}40` }]}>
                <Ionicons name="alert-circle" size={20} color={colors.textSecondary} />
                <ThemedText style={[styles.errorText, { color: colors.textSecondary }]}>
                  {errorMessage}
                </ThemedText>
              </View>
            )}

            {/* 邮箱输入框 */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="请输入 .edu 邮箱"
                  placeholderTextColor={colors.textMuted}
                  value={eduEmail}
                  onChangeText={setEduEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  editable={!isSubmitting}
                />
              </View>
            </View>

            {/* 密码输入框 */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="请输入密码"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!isSubmitting}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* 忘记密码 */}
            <View style={styles.forgotContainer}>
              <Pressable
                onPress={() => Alert.alert('提示', '忘记密码功能即将上线')}
                disabled={isSubmitting}
              >
                <ThemedText style={[styles.forgotText, { color: colors.primary }]}>
                  忘记密码？
                </ThemedText>
              </Pressable>
            </View>

            {/* 登录按钮 */}
            <Pressable
              onPress={handleLogin}
              disabled={isSubmitting}
              style={[
                styles.loginButton,
                {
                  backgroundColor: isSubmitting ? colors.textMuted : colors.primary,
                },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.loginButtonText}>登录</ThemedText>
              )}
            </Pressable>

            {/* 注册链接 */}
            <View style={styles.registerContainer}>
              <ThemedText style={[styles.registerText, { color: colors.textSecondary }]}>
                还没有账号？
              </ThemedText>
              <Pressable
                onPress={() => router.push('/register')}
                disabled={isSubmitting}
              >
                <ThemedText style={[styles.registerLink, { color: colors.primary }]}>
                  注册新账号
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 24,
  },
  passwordToggle: {
    padding: 4,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerText: {
    fontSize: 15,
  },
  registerLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
