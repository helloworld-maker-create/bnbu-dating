// app/matches.tsx - 我的匹配页
// Campus Connect 统一设计风格

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';

// 模拟匹配数据
const MATCHES = [
  {
    id: '1',
    name: '小雨',
    avatar: 'https://i.pravatar.cc/100?u=user1',
    major: '心理学',
    matchedAt: '2小时前',
  },
  {
    id: '2',
    name: '浩然',
    avatar: 'https://i.pravatar.cc/100?u=user2',
    major: '工商管理',
    matchedAt: '1天前',
  },
  {
    id: '3',
    name: '思琪',
    avatar: 'https://i.pravatar.cc/100?u=user3',
    major: '计算机科学',
    matchedAt: '3天前',
  },
];

export default function MatchesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.serif }]}>
          我的匹配
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 统计卡片 */}
        <View style={[styles.statsCard, { backgroundColor: colors.card }, shadows.sm]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{MATCHES.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>总匹配</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>2</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>新匹配</Text>
          </View>
        </View>

        {/* 匹配列表 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>匹配列表</Text>

          {MATCHES.map((match, index) => (
            <Pressable
              key={match.id}
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: match.id } } as any)}
              style={[
                styles.matchItem,
                { backgroundColor: colors.card, borderBottomColor: colors.border },
                shadows.sm,
              ]}
            >
              <View style={styles.avatarWrap}>
                <Image source={{ uri: match.avatar }} style={styles.avatar} />
                {index < 2 && <View style={styles.newBadge} />}
              </View>
              <View style={styles.matchInfo}>
                <View style={styles.matchInfoTop}>
                  <Text style={[styles.matchName, { color: colors.text }]}>{match.name}</Text>
                  <Text style={[styles.matchTime, { color: colors.textSecondary }]}>{match.matchedAt}</Text>
                </View>
                <Text style={[styles.matchMajor, { color: colors.textSecondary }]}>{match.major}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* 空状态 (当没有匹配时显示) */}
        {MATCHES.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 56 }}>💕</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>暂无匹配</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              去发现页看看，遇见更多有趣的人
            </Text>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={[styles.discoverBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.discoverBtnText, { color: colors.white }]}>去发现</Text>
            </Pressable>
          </View>
        )}
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
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  placeholder: { width: 40 },
  headerTitle: { fontSize: 24, fontWeight: typography.weights.bold },
  scrollContent: { paddingBottom: spacing.xxl },

  // Stats Card
  statsCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 24, fontWeight: typography.weights.bold, marginBottom: 4 },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1, height: 40, marginHorizontal: spacing.xl },

  // Section
  section: { marginHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: 12, fontWeight: typography.weights.semibold, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Match Item
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  avatarWrap: { position: 'relative', marginRight: spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  newBadge: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#FFFFFF' },
  matchInfo: { flex: 1 },
  matchInfoTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  matchName: { fontSize: 15, fontWeight: typography.weights.semibold },
  matchTime: { fontSize: 11 },
  matchMajor: { fontSize: 12 },

  // Empty State
  emptyState: { alignItems: 'center', padding: spacing.xxl, marginTop: spacing.xl },
  emptyTitle: { fontSize: 20, fontWeight: typography.weights.bold, marginTop: spacing.md, marginBottom: spacing.sm },
  emptySubtitle: { fontSize: 13, textAlign: 'center', maxWidth: 220, marginBottom: spacing.xl, lineHeight: 22 },
  discoverBtn: { paddingVertical: 14, paddingHorizontal: spacing.xl, borderRadius: borderRadius.lg },
  discoverBtnText: { fontSize: 13, fontWeight: typography.weights.semibold },
});
