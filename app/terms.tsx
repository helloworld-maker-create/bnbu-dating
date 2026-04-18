// app/terms.tsx - 用户协议
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

const LAST_UPDATED = '2026年4月1日';

const SECTIONS = [
  {
    title: '一、服务条款',
    content: '欢迎使用 BNBU 校园社交平台。通过使用我们的应用，您同意遵守以下条款和条件。我们致力于为用户提供安全、友好的社交环境。',
  },
  {
    title: '二、账户注册',
    content: '您需要提供真实准确的个人信息进行注册。您有责任保护您的账户安全，不得将账户转让给他人使用。请使用有效的 .edu 邮箱完成注册验证。',
  },
  {
    title: '三、用户行为规范',
    content: '用户应文明交友，尊重他人。禁止发布违法、色情、暴力、骚扰性内容。如发现违规行为，我们有权暂停或终止服务。我们保留对违规用户进行警告、限制功能或永久封号的权利。',
  },
  {
    title: '四、隐私保护',
    content: '我们重视用户隐私保护。您的个人信息将根据我们的隐私政策进行处理。未经您的同意，我们不会向第三方披露您的个人信息。',
  },
  {
    title: '五、免责声明',
    content: '本平台仅供社交交流使用，不对用户之间的交往结果承担任何责任。用户应自行判断和承担社交风险。如遇问题，请及时联系客服。',
  },
  {
    title: '六、条款修改',
    content: '我们保留随时修改本条款的权利。修改后的条款将在应用内公布，继续使用即视为同意修改后的条款。建议您定期查看本条款的更新。',
  },
];

export default function TermsScreen() {
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
          用户协议
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.updatedText, { color: colors.textSecondary }]}>最后更新：{LAST_UPDATED}</Text>

        <View style={[styles.contentCard, { backgroundColor: colors.card }, shadows.sm]}>
          {SECTIONS.map((section, index) => (
            <React.Fragment key={index}>
              <View style={styles.sectionItem}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>{section.content}</Text>
              </View>
              {index < SECTIONS.length - 1 && (
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
  headerTitle: { fontSize: 24, fontWeight: typography.weights.bold },
  scrollContent: { paddingBottom: spacing.xxl },

  updatedText: { fontSize: 12, paddingHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.sm },

  contentCard: { marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.lg },
  sectionItem: { paddingVertical: spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: typography.weights.semibold, marginBottom: spacing.sm },
  sectionContent: { fontSize: 13, lineHeight: 22 },
  divider: { height: 1, marginHorizontal: -spacing.lg },
});
