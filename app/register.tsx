// app/register.tsx - 注册页面
// 遵循 UX 设计报告 - 咖啡/奶油暖色调系
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { register, isLoading: authLoading } = useAuth();

  const [eduEmail, setEduEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 验证 edu 邮箱格式
  const validateEduEmail = (email: string): boolean => {
    const eduEmailRegex = /^[^\s@]+@[^\s@]+\.edu$/;
    return eduEmailRegex.test(email);
  };

  // 验证密码强度
  const validatePassword = (pwd: string): boolean => {
    return pwd.length >= 8;
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
    if (!validatePassword(password)) {
      setErrorMessage('密码长度至少为 8 位');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('两次输入的密码不一致');
      return false;
    }
    return true;
  };

  // 处理注册
  const handleRegister = async () => {
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        eduEmail: eduEmail.trim().toLowerCase(),
        password,
      });

      if (result.code === 0) {
        Alert.alert(
          '注册成功',
          '请使用您的账号登录',
          [
            {
              text: '立即登录',
              onPress: () => router.replace('/login'),
            },
          ]
        );
      } else {
        setErrorMessage(result.message || '注册失败，请稍后重试');
      }
    } catch (error) {
      setErrorMessage('注册失败，请稍后重试');
      console.error('Register error:', error);
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
              <Ionicons name="person-add-outline" size={32} color="#fff" />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>创建账号</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              使用 .edu 邮箱加入 BNBU 校园社交
            </ThemedText>
          </View>

          {/* 注册表单 */}
          <View style={styles.form}>
            {/* 错误消息 */}
            {errorMessage && (
              <View style={[styles.errorContainer, { backgroundColor: '#EF444420', borderColor: '#EF4444' }]}>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <ThemedText style={[styles.errorText, { color: '#EF4444' }]}>
                  {errorMessage}
                </ThemedText>
              </View>
            )}

            {/* 邮箱输入框 */}
            <View style={styles.inputContainer}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>邮箱地址</ThemedText>
              <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="name@university.edu"
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
              <ThemedText style={[styles.hintText, { color: colors.textMuted }]}>
                仅支持 .edu 结尾的校园邮箱
              </ThemedText>
            </View>

            {/* 密码输入框 */}
            <View style={styles.inputContainer}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>密码</ThemedText>
              <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="至少 8 位密码"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                  editable={!isSubmitting}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* 确认密码输入框 */}
            <View style={styles.inputContainer}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>确认密码</ThemedText>
              <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="再次输入密码"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  editable={!isSubmitting}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* 注册按钮 */}
            <Pressable
              onPress={handleRegister}
              disabled={isSubmitting}
              style={[
                styles.registerButton,
                {
                  backgroundColor: isSubmitting ? colors.textMuted : colors.primary,
                },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.registerButtonText}>注册</ThemedText>
              )}
            </Pressable>

            {/* 登录链接 */}
            <View style={styles.loginContainer}>
              <ThemedText style={[styles.loginText, { color: colors.textSecondary }]}>
                已有账号？
              </ThemedText>
              <Pressable
                onPress={() => router.push('/login')}
                disabled={isSubmitting}
              >
                <ThemedText style={[styles.loginLink, { color: colors.primary }]}>
                  立即登录
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
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#6B4226',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
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
  hintText: {
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  registerButton: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 24,
    shadowColor: '#6B4226',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
