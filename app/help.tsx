import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// 常见问题数据
const FAQ_ITEMS = [
  {
    id: '1',
    question: '如何开始匹配？',
    answer: '在首页浏览推荐的卡片，向右滑动或点击爱心表示喜欢，向左滑动或点击 X 表示跳过。当双方都喜欢对方时，就会成功匹配！'
  },
  {
    id: '2',
    question: '如何修改个人资料？',
    answer: '点击底部导航栏的"我的"进入个人中心，然后点击"编辑资料"即可修改你的个人信息、兴趣爱好和职业方向等。'
  },
  {
    id: '3',
    question: '匹配后如何聊天？',
    answer: '成功匹配后，你们会自动出现在彼此的匹配列表中。点击匹配对象即可进入聊天界面，开始交流吧！'
  },
  {
    id: '4',
    question: '如何解除匹配？',
    answer: '在匹配列表中左滑想要解除的匹配对象，或者进入对方主页点击右上角菜单选择"解除匹配"。'
  },
  {
    id: '5',
    question: '我的信息会被公开吗？',
    answer: '我们非常重视你的隐私。只有你同意匹配的用户才能看到你的完整信息。你可以在设置中调整隐私选项。'
  },
  {
    id: '6',
    question: '如何反馈问题？',
    answer: '你可以在本页面底部填写反馈表单提交问题，或者通过邮箱 contact@datinginbnbu.com 联系我们。'
  }
];

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 切换 FAQ 展开状态
  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // 提交反馈
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('提示', '请填写问题描述');
      return;
    }

    setIsSubmitting(true);

    // 模拟提交
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '提交成功',
        '感谢你的反馈！我们会尽快处理并在 3 个工作日内回复。',
        [
          {
            text: '确定',
            onPress: () => {
              setFeedbackText('');
              setContactInfo('');
            }
          }
        ]
      );
    }, 1000);
  };

  // 联系客服
  const handleContactSupport = () => {
    Alert.alert(
      '联系我们',
      '如有紧急问题，请发送邮件至：\n\ncontact@datinginbnbu.com',
      [
        { text: '取消', style: 'cancel' },
        { text: '复制邮箱', onPress: () => Alert.alert('已复制', '邮箱地址已复制到剪贴板') }
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* 头部导航 */}
        <View style={[styles.header, { borderBottomColor: colors.separator }]}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>帮助与反馈</Text>
          <Pressable onPress={handleContactSupport} style={styles.headerButton}>
            <Ionicons name="chatbubbles-outline" size={22} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 常见问题 */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>常见问题</Text>

            {FAQ_ITEMS.map((item) => (
              <View key={item.id} style={[styles.faqItem, { borderBottomColor: colors.separator }]}>
                <Pressable
                  onPress={() => toggleFaq(item.id)}
                  style={styles.faqQuestion}
                >
                  <Text style={[styles.faqQuestionText, { color: colors.text }]}>{item.question}</Text>
                  <Ionicons
                    name={expandedFaqId === item.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>

                {expandedFaqId === item.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* 反馈表单 */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>问题反馈</Text>
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              遇到问题或有建议？告诉我们，帮助我们做得更好～
            </Text>

            {/* 问题描述 */}
            <View style={[styles.inputGroup, { marginBottom: 16 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>问题描述</Text>
              <TextInput
                style={[
                  styles.textArea,
                  { color: colors.text, borderColor: colors.separator, backgroundColor: colors.background }
                ]}
                placeholder="请详细描述你遇到的问题..."
                placeholderTextColor={colors.textMuted}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* 联系方式（可选） */}
            <View style={[styles.inputGroup, { marginBottom: 16 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                联系方式 <Text style={{ color: colors.textMuted }}>（可选）</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.separator, backgroundColor: colors.background }
                ]}
                placeholder="邮箱或手机号，方便我们回复"
                placeholderTextColor={colors.textMuted}
                value={contactInfo}
                onChangeText={setContactInfo}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* 提交按钮 */}
            <Pressable
              onPress={handleSubmitFeedback}
              style={[
                styles.submitButton,
                { backgroundColor: isSubmitting ? colors.textMuted : colors.primary }
              ]}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>提交反馈</Text>
            </Pressable>
          </View>

          {/* 联系方式 */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>联系方式</Text>

            <View style={[styles.contactItem, { borderBottomColor: colors.separator }]}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.contactIcon} />
              <View style={styles.contactContent}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>客服邮箱</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
                  contact@datinginbnbu.com
                </Text>
              </View>
            </View>

            <View style={[styles.contactItem, { borderBottomColor: colors.separator }]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} style={styles.contactIcon} />
              <View style={styles.contactContent}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>工作时间</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
                  周一至周五 9:00 - 18:00
                </Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.contactIcon} />
              <View style={styles.contactContent}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>团队地址</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
                  北京师范大学珠海校区
                </Text>
              </View>
            </View>
          </View>

          {/* 底部间距 */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 120,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  contactIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    lineHeight: 20,
  },
});
