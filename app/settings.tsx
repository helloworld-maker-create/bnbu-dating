// app/settings.tsx - 设置页
// Campus Connect 统一设计风格

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [ghostMode, setGhostMode] = useState(false);
  const [matchNotif, setMatchNotif] = useState(true);
  const [messageNotif, setMessageNotif] = useState(true);

  const handleClearCache = () => {
    Alert.alert('清除缓存', '缓存已清除', [{ text: '确定' }]);
  };

  const handleSignOut = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => router.replace('/login') },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.serif }]}>
          设置
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 账号设置 */}
        <View style={[styles.section, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>账号设置</Text>
          <SettingRow icon="person" label="修改资料" onPress={() => router.push('/profile/edit')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="key" label="修改密码" onPress={() => {}} colors={colors} />
        </View>

        {/* 隐私设置 */}
        <View style={[styles.section, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>隐私设置</Text>
          <ToggleRow
            icon="eye-off"
            label="隐身模式"
            description="浏览时不显示在线状态"
            value={ghostMode}
            onValueChange={setGhostMode}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="ban" label="黑名单" onPress={() => router.push('/blacklist')} colors={colors} />
        </View>

        {/* 通知设置 */}
        <View style={[styles.section, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>通知设置</Text>
          <ToggleRow
            icon="heart"
            label="匹配通知"
            description="收到新匹配时通知"
            value={matchNotif}
            onValueChange={setMatchNotif}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <ToggleRow
            icon="chatbubble"
            label="消息通知"
            description="收到新消息时通知"
            value={messageNotif}
            onValueChange={setMessageNotif}
            colors={colors}
          />
        </View>

        {/* 其他 */}
        <View style={[styles.section, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>其他</Text>
          <SettingRow icon="trash" label="清除缓存" onPress={handleClearCache} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="document-text" label="用户协议" onPress={() => router.push('/terms')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingRow icon="shield-checkmark" label="隐私政策" onPress={() => router.push('/privacy')} colors={colors} />
        </View>

        {/* 退出登录 */}
        <Pressable onPress={handleSignOut} style={[styles.signOutBtn, { borderColor: colors.error }]}>
          <Text style={[styles.signOutText, { color: colors.error }]}>退出登录</Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.textSecondary }]}>v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// 设置行组件
function SettingRow({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  colors: typeof Colors.light;
}) {
  return (
    <Pressable onPress={onPress} style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.cream }]}>
          <Ionicons name={icon as any} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

// 开关行组件
function ToggleRow({
  icon,
  label,
  description,
  value,
  onValueChange,
  colors,
}: {
  icon: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: typeof Colors.light;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleRowLeft}>
        <View style={[styles.iconWrap, { backgroundColor: colors.cream }]}>
          <Ionicons name={icon as any} size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={[styles.toggleLabel, { color: colors.text }]}>{label}</Text>
          {description && (
            <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  placeholder: { width: 40 },
  headerTitle: { fontSize: 24, fontWeight: typography.weights.bold },
  scrollContent: { paddingBottom: spacing.xxl },

  section: { marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg },
  sectionLabel: { fontSize: 11, fontWeight: typography.weights.semibold, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },

  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  settingRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 14, fontWeight: typography.weights.medium },
  divider: { height: 1, marginHorizontal: -spacing.lg },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  toggleRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleLabel: { fontSize: 14, fontWeight: typography.weights.semibold },
  toggleDesc: { fontSize: 11, marginTop: 2 },

  signOutBtn: { marginHorizontal: spacing.lg, marginTop: spacing.lg, paddingVertical: 14, borderRadius: borderRadius.md, borderWidth: 1.5, alignItems: 'center' },
  signOutText: { fontSize: 15, fontWeight: typography.weights.semibold },
  version: { textAlign: 'center', fontSize: 12, marginTop: spacing.md, marginBottom: spacing.lg },
});
