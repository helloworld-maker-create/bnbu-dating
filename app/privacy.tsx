// app/privacy.tsx - 隐私政策
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
    title: '一、信息收集',
    content: '在您注册账号时，我们会收集您的校园邮箱地址（用于身份验证）和密码（加密存储）。在您完善个人资料时，我们可能会收集您的昵称、头像、专业、年级、兴趣爱好和个人简介。',
  },
  {
    title: '二、信息使用',
    content: '我们会将收集到的信息用于以下目的：提供和维护服务（包括身份验证）、改进和优化服务（进行智能匹配推荐）、向您发送通知（包括匹配通知、消息通知）、检测和预防欺诈及滥用等安全问题、遵守法律法规要求。',
  },
  {
    title: '三、信息共享',
    content: '以下信息可能会向其他用户公开：昵称、头像、专业、年级、兴趣爱好、个人简介。您的联系方式（邮箱、手机号等）不会被公开。我们不会出售或出租您的个人信息给第三方。',
  },
  {
    title: '四、信息存储与安全',
    content: '我们在中华人民共和国境内收集和产生的个人信息将存储在境内服务器。我们采取以下措施保护您的信息安全：数据加密传输（HTTPS/TLS）、密码加密存储（bcrypt）、访问权限控制、定期安全审计和漏洞扫描。',
  },
  {
    title: '五、您的权利',
    content: '您可以随时访问和更正您的个人信息。在"个人中心 - 编辑资料"中，您可以修改您的昵称、头像、专业、兴趣爱好等信息。您可以随时注销您的账号，注销后您的个人信息将被删除或匿名化处理。',
  },
  {
    title: '六、未成年人保护',
    content: '本应用仅面向 BNBU 在校学生，用户应当年满 18 周岁。如我们发现收集了未成年人的个人信息，将尽快删除。',
  },
  {
    title: '七、联系我们',
    content: '如对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：邮箱 contact@bnbu-dating.com。我们将在 15 个工作日内回复您的请求。',
  },
];

export default function PrivacyScreen() {
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
          隐私政策
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
