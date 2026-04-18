// app/blacklist.tsx - 黑名单页
// Campus Connect 统一设计风格

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';

// 模拟黑名单数据
const BLOCKED_USERS = [
  { id: '1', name: '某某', avatar: 'https://i.pravatar.cc/100?u=block1', major: '未知' },
  { id: '2', name: '测试用户', avatar: 'https://i.pravatar.cc/100?u=block2', major: '未知' },
];

export default function BlacklistScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [blockedUsers, setBlockedUsers] = useState(BLOCKED_USERS);

  const handleUnblock = (id: string) => {
    Alert.alert('解除拉黑', '确定要将该用户移出黑名单吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: () => setBlockedUsers((prev) => prev.filter((u) => u.id !== id)),
      },
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
          黑名单
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {blockedUsers.length > 0 ? (
          <>
            <View style={styles.tipCard}>
              <Ionicons name="information-circle" size={18} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                黑名单中的用户无法查看您的主页，也无法与您匹配或聊天。
              </Text>
            </View>

            <View style={[styles.listCard, { backgroundColor: colors.card }, shadows.sm]}>
              {blockedUsers.map((user, index) => (
                <React.Fragment key={user.id}>
                  <View style={styles.userRow}>
                    <View style={styles.userLeft}>
                      <Image source={{ uri: user.avatar }} style={styles.avatar} />
                      <View>
                        <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                        <Text style={[styles.userMajor, { color: colors.textSecondary }]}>{user.major}</Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => handleUnblock(user.id)}
                      style={[styles.unblockBtn, { borderColor: colors.primary }]}
                    >
                      <Text style={[styles.unblockText, { color: colors.primary }]}>解除</Text>
                    </Pressable>
                  </View>
                  {index < blockedUsers.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 56 }}>🛡️</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>黑名单为空</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              暂无被拉黑的用户
            </Text>
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

  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(107,66,38,0.08)',
  },
  tipText: { fontSize: 12, flex: 1, lineHeight: 18 },

  listCard: { marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: borderRadius.lg },
  userRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  userLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  userName: { fontSize: 14, fontWeight: typography.weights.semibold },
  userMajor: { fontSize: 12, marginTop: 2 },
  unblockBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  unblockText: { fontSize: 12, fontWeight: typography.weights.semibold },
  divider: { height: 1, marginHorizontal: spacing.md },

  emptyState: { alignItems: 'center', padding: spacing.xxl, marginTop: spacing.xl },
  emptyTitle: { fontSize: 20, fontWeight: typography.weights.bold, marginTop: spacing.md, marginBottom: spacing.sm },
  emptySubtitle: { fontSize: 13, textAlign: 'center', color: '#8A7A70' },
});
