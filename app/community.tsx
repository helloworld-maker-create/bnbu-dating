// app/community.tsx - 社区准则
// Campus Connect 统一设计风格

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';

const RULES = [
  {
    icon: 'heart',
    title: '文明交友',
    content: '尊重每一位用户，使用礼貌用语。禁止人身攻击、歧视性言论或骚扰行为。',
  },
  {
    icon: 'shield-checkmark',
    title: '真实身份',
    content: '请使用真实头像和个人信息。禁止冒充他人或使用虚假身份注册。',
  },
  {
    icon: 'image',
    title: '内容规范',
    content: '禁止发布色情、暴力、恐怖或违法内容。照片应符合社区标准，不得包含不当内容。',
  },
  {
    icon: 'chatbubble',
    title: '交流礼仪',
    content: '聊天时请保持礼貌，尊重对方意愿。如对方明确表示不想继续交流，请停止骚扰。',
  },
  {
    icon: 'alert-circle',
    title: '举报机制',
    content: '如发现违规行为，请及时使用举报功能。我们会认真处理每一条举报，并对违规者采取相应措施。',
  },
  {
    icon: 'ban',
    title: '违规处理',
    content: '对于违反社区准则的用户，我们将根据情节严重程度采取警告、限制功能或永久封号等措施。',
  },
];

export default function CommunityScreen() {
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
          社区准则
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 引言 */}
        <View style={styles.introCard}>
          <Text style={[styles.introTitle, { color: colors.text, fontFamily: typography.serif }]}>
            共建友好社区
          </Text>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            为了营造健康、友好的社交环境，请每位用户遵守以下社区准则。感谢您的理解与配合！
          </Text>
        </View>

        {/* 规则列表 */}
        <View style={[styles.rulesCard, { backgroundColor: colors.card }, shadows.sm]}>
          {RULES.map((rule, index) => (
            <React.Fragment key={index}>
              <View style={styles.ruleItem}>
                <View style={[styles.ruleIconWrap, { backgroundColor: colors.cream }]}>
                  <Ionicons name={rule.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.ruleContent}>
                  <Text style={[styles.ruleTitle, { color: colors.text }]}>{rule.title}</Text>
                  <Text style={[styles.ruleText, { color: colors.textSecondary }]}>{rule.content}</Text>
                </View>
              </View>
              {index < RULES.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </React.Fragment>
          ))}
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
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  placeholder: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: typography.weights.bold },
  scrollContent: { paddingBottom: spacing.xxl },

  introCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(107,66,38,0.08)',
    alignItems: 'center',
  },
  introTitle: { fontSize: 18, fontWeight: typography.weights.bold, marginBottom: spacing.sm },
  introText: { fontSize: 13, textAlign: 'center', lineHeight: 20 },

  rulesCard: { marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: borderRadius.lg, padding: spacing.lg },
  ruleItem: { flexDirection: 'row', gap: 12, paddingVertical: spacing.md },
  ruleIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ruleContent: { flex: 1 },
  ruleTitle: { fontSize: 14, fontWeight: typography.weights.semibold, marginBottom: 4 },
  ruleText: { fontSize: 12, lineHeight: 18 },
  divider: { height: 1, marginHorizontal: -spacing.lg },
});
