import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, ScrollView, View } from 'react-native';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>关于 Dating in BNBU</Text>
        <View style={[styles.separator, { backgroundColor: colors.separator }]} />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>产品介绍</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Dating in BNBU 是一款专为北师珠学生打造的校园交友应用。我们致力于帮助同学们建立真诚的连接，无论是寻找学习伙伴、创业队友，还是知心朋友，甚至是人生伴侣。
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>核心功能</Text>
        <Text style={[styles.listItem, { color: colors.textSecondary }]}>• 智能匹配：基于专业、GPA、兴趣爱好等多维度推荐</Text>
        <Text style={[styles.listItem, { color: colors.textSecondary }]}>• 实名认证：仅限北师大珠海校区邮箱认证</Text>
        <Text style={[styles.listItem, { color: colors.textSecondary }]}>• 安全交友：营造健康、积极的校园交友环境</Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>使用说明</Text>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          1. 使用北师大珠海校区邮箱注册登录{'\n'}
          2. 完善个人资料，展示真实的自己{'\n'}
          3. 浏览推荐卡片，右滑喜欢，左滑跳过{'\n'}
          4. 匹配成功后可以开始聊天{'\n'}
          5. 尊重彼此，真诚交流
        </Text>

        <View style={[styles.versionContainer, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.versionLabel, { color: colors.textMuted }]}>当前版本</Text>
          <Text style={[styles.versionText, { color: colors.primary }]}>v1.0.0</Text>
        </View>

        <Text style={[styles.footer, { color: colors.textMuted }]}>Dating in BNBU © 2024</Text>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    width: '60%',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    alignSelf: 'flex-start',
  },
  listItem: {
    fontSize: 15,
    lineHeight: 28,
    alignSelf: 'flex-start',
  },
  versionContainer: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 20,
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    marginBottom: 20,
  },
});
