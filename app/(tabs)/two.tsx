// app/(tabs)/two.tsx - Profile 个人页
// 新设计：匹配统计 + 分组菜单列表 + 登录/注册按钮

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';

// 匹配统计数据
const STATS = [
  { label: '浏览', value: 24, icon: 'eye' },
  { label: '喜欢', value: 8, icon: 'heart' },
  { label: '匹配', value: 3, icon: 'sparkles' },
];

// 个人资料菜单
const PROFILE_ITEMS = [
  { icon: 'create', label: '编辑资料', route: '/profile/edit' },
  { icon: 'heart', label: '我的匹配', route: '/matches' },
  { icon: 'chatbubble', label: '消息中心', route: '/messages' },
];

// 设置与支持菜单
const SETTINGS_ITEMS = [
  { icon: 'settings', label: '设置', route: '/settings' },
  { icon: 'help-circle', label: '帮助与反馈', route: '/help' },
  { icon: 'information-circle', label: '关于我们', route: '/about' },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.serif }]}>我的</Text>
        <Pressable style={[styles.editBtn, { borderColor: colors.primary }]}>
          <Text style={[styles.editBtnText, { color: colors.primary }]}>编辑</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image source={{ uri: 'https://i.pravatar.cc/400?u=me' }} style={styles.heroImage} />
          <LinearGradient colors={['transparent', 'rgba(26,14,8,0.8)']} style={styles.heroGradient} />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>小明, 20</Text>
            <Text style={styles.heroSub}>大三 · 计算机科学</Text>
          </View>
          <Pressable style={styles.cameraBtn}>
            <Text style={{ fontSize: 18 }}>📷</Text>
          </Pressable>
        </View>

        {/* 匹配统计 */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>匹配统计</Text>
          <View style={styles.statsRow}>
            {STATS.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconWrap, { backgroundColor: colors.cream }]}>
                    <Ionicons name={stat.icon as any} size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                </View>
                {index < STATS.length - 1 && (
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* 个人资料 */}
        <View style={[styles.menuCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>个人资料</Text>
          {PROFILE_ITEMS.map((item, index) => (
            <React.Fragment key={item.label}>
              <Pressable
                onPress={() => router.push(item.route as any)}
                style={styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: colors.cream }]}>
                    <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </Pressable>
              {index < PROFILE_ITEMS.length - 1 && (
                <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* 设置与支持 */}
        <View style={[styles.menuCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>设置与支持</Text>
          {SETTINGS_ITEMS.map((item, index) => (
            <React.Fragment key={item.label}>
              <Pressable
                onPress={() => router.push(item.route as any)}
                style={styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconWrap, { backgroundColor: colors.cream }]}>
                    <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              </Pressable>
              {index < SETTINGS_ITEMS.length - 1 && (
                <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* 登录/注册按钮 */}
        <View style={styles.authButtons}>
          <Pressable
            onPress={() => router.push('/login')}
            style={[styles.loginBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.loginBtnText, { color: colors.white }]}>立即登录</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/register')}
            style={[styles.registerBtn, { borderColor: colors.primary }]}
          >
            <Text style={[styles.registerBtnText, { color: colors.primary }]}>注册账号</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  headerTitle: { fontSize: 24, fontWeight: typography.weights.bold },
  editBtn: { borderWidth: 1.5, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  editBtnText: { fontSize: 13, fontWeight: typography.weights.semibold },
  scrollContent: { paddingBottom: spacing.xxl },

  // Hero
  hero: { height: 280, position: 'relative', marginHorizontal: 0, borderRadius: 0, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' },
  heroInfo: { position: 'absolute', bottom: 16, left: 20, right: 20 },
  heroName: { fontSize: 30, fontWeight: typography.weights.bold, color: '#fff', fontFamily: typography.serif, marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  cameraBtn: { position: 'absolute', top: 12, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },

  // Stats Card
  statsCard: { marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg },
  sectionLabel: { fontSize: 11, fontWeight: typography.weights.semibold, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1 },
  statIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: typography.weights.bold, marginBottom: 2 },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1, height: 40, marginHorizontal: spacing.md },

  // Menu Card
  menuCard: { marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 13, fontWeight: typography.weights.semibold },
  menuDivider: { height: 1, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },

  // Auth Buttons
  authButtons: { marginHorizontal: spacing.lg, marginTop: spacing.lg, gap: 12 },
  loginBtn: { height: 54, borderRadius: borderRadius.lg, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  loginBtnText: { fontSize: 15, fontWeight: typography.weights.semibold, letterSpacing: 0.3 },
  registerBtn: { height: 54, borderRadius: borderRadius.lg, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  registerBtnText: { fontSize: 15, fontWeight: typography.weights.semibold },
});
