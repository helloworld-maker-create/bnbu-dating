// app/help.tsx - 帮助与反馈页
// Campus Connect 统一设计风格

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';

// 常见问题
const FAQS = [
  { q: '如何修改个人资料？', a: '进入"我的"页面，点击"编辑资料"即可修改昵称、头像、专业等信息。' },
  { q: '如何举报不良用户？', a: '在用户主页点击右上角"..."，选择"举报"，填写举报原因后提交。' },
  { q: '如何解除匹配？', a: '进入"我的匹配"页面，左滑匹配卡片即可解除匹配关系。' },
  { q: '如何注销账号？', a: '进入"设置"页面，滑动到底部点击"注销账号"，确认后账号将被永久删除。' },
];

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [feedback, setFeedback] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('提示', '请输入反馈内容');
      return;
    }
    Alert.alert('提交成功', '感谢您的反馈，我们会尽快处理！', [{ text: '好的' }]);
    setFeedback('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.serif }]}>
          帮助与反馈
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 常见问题 */}
        <View style={[styles.section, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>常见问题</Text>
          {FAQS.map((faq, index) => (
            <React.Fragment key={index}>
              <Pressable
                onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                style={styles.faqItem}
              >
                <View style={styles.faqLeft}>
                  <Ionicons
                    name={expandedFaq === index ? 'chevron-down' : 'chevron-forward'}
                    size={18}
                    color={colors.primary}
                  />
                  <Text style={[styles.faqQ, { color: colors.text }]}>{faq.q}</Text>
                </View>
              </Pressable>
              {expandedFaq === index && (
                <Text style={[styles.faqA, { color: colors.textSecondary }]}>{faq.a}</Text>
              )}
              {index < FAQS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* 反馈表单 */}
        <View style={[styles.section, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>意见反馈</Text>
          <TextInput
            style={[
              styles.feedbackInput,
              { backgroundColor: colors.cream, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="请描述您遇到的问题或建议..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
          />
          <Pressable
            onPress={handleSubmitFeedback}
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.submitBtnText, { color: colors.white }]}>提交反馈</Text>
          </Pressable>
        </View>

        {/* 联系方式 */}
        <View style={[styles.section, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>联系我们</Text>
          <ContactRow icon="mail" label="contact@bnbu-dating.com" colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <ContactRow icon="globe" label="www.bnbu-dating.com" colors={colors} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactRow({
  icon,
  label,
  colors,
}: {
  icon: string;
  label: string;
  colors: typeof Colors.light;
}) {
  return (
    <View style={styles.contactRow}>
      <Ionicons name={icon as any} size={18} color={colors.primary} />
      <Text style={[styles.contactLabel, { color: colors.text }]}>{label}</Text>
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

  faqItem: { paddingVertical: 12 },
  faqLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  faqQ: { fontSize: 14, fontWeight: typography.weights.medium, flex: 1 },
  faqA: { fontSize: 13, lineHeight: 22, marginTop: 4, marginBottom: 4 },
  divider: { height: 1, marginHorizontal: -spacing.lg },

  feedbackInput: { borderWidth: 1, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
  submitBtn: { marginTop: spacing.md, paddingVertical: 14, borderRadius: borderRadius.md, alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: typography.weights.semibold },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  contactLabel: { fontSize: 14 },
});
