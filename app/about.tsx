import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// 团队成员
const TEAM_MEMBERS = [
  { name: '制作人', role: '产品规划 & 设计' },
  { name: '开发团队', role: '前端 & 后端开发' },
  { name: '设计团队', role: 'UI & UX 设计' },
  { name: '运营团队', role: '用户运营 & 推广' },
];

// 功能亮点
const FEATURES = [
  { icon: 'shield-checkmark-outline', title: '校园认证', desc: '仅限 BNBU 学生，真实可靠的交友环境' },
  { icon: 'heart-outline', title: '智能匹配', desc: '基于兴趣和专业的精准推荐算法' },
  { icon: 'chatbubbles-outline', title: '轻松交流', desc: '匹配后即可畅聊，发现志同道合的 TA' },
  { icon: 'lock-closed-outline', title: '隐私保护', desc: '严格的数据保护措施，守护你的隐私' },
];

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const APP_VERSION = '1.0.0';

  // 打开网页
  const openUrl = (url: string) => {
    if (Platform.OS !== 'web') {
      WebBrowser.openBrowserAsync(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 头部导航 */}
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>关于我们</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* App 信息卡片 */}
        <View style={[styles.appCard, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.logoContainer, { backgroundColor: colors.tagBackground }]}>
            <Image
              source={{ uri: 'https://picsum.photos/120/120?random=logo' }}
              style={styles.logo}
            />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Dating in BNBU</Text>
          <Text style={[styles.appVersion, { color: colors.textMuted }]}>Version {APP_VERSION}</Text>
          <Text style={[styles.appSlogan, { color: colors.textSecondary }]}>
            遇见更好的自己，遇见对的你
          </Text>
        </View>

        {/* 产品介绍 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>产品介绍</Text>
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
            Dating in BNBU 是专为北京师范大学珠海校区学生打造的校园社交平台。
            我们相信，美好的相遇应该从校园开始。
          </Text>
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
            通过智能算法和真实的校园认证，我们帮助你找到志同道合的伙伴，
            无论是学习上的伙伴、生活中的朋友，还是那个特别的 TA。
          </Text>
        </View>

        {/* 功能亮点 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>功能亮点</Text>

          {FEATURES.map((feature, index) => (
            <View key={index} style={[styles.featureItem, { borderBottomColor: colors.separator }]}>
              <View style={[styles.featureIcon, { backgroundColor: colors.tagBackground }]}>
                <Ionicons name={feature.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 团队介绍 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>团队介绍</Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            我们是一群来自不同专业的 BNBU 学生，怀着让校园生活更美好的愿景走到一起。
          </Text>

          {TEAM_MEMBERS.map((member, index) => (
            <View key={index} style={[styles.teamItem, { borderBottomColor: colors.separator }]}>
              <View style={[styles.teamAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.teamAvatarText}>{member.name[0]}</Text>
              </View>
              <View style={styles.teamInfo}>
                <Text style={[styles.teamName, { color: colors.text }]}>{member.name}</Text>
                <Text style={[styles.teamRole, { color: colors.textSecondary }]}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 协议与政策 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>协议与政策</Text>

          <Pressable
            style={[styles.agreementItem, { borderBottomColor: colors.separator }]}
            onPress={() => openUrl('https://www.example.com/terms')}
          >
            <View style={styles.agreementContent}>
              <Ionicons name="document-text-outline" size={22} color={colors.primary} style={styles.agreementIcon} />
              <Text style={[styles.agreementText, { color: colors.text }]}>用户协议</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={[styles.agreementItem, { borderBottomColor: colors.separator }]}
            onPress={() => openUrl('https://www.example.com/privacy')}
          >
            <View style={styles.agreementContent}>
              <Ionicons name="shield-outline" size={22} color={colors.primary} style={styles.agreementIcon} />
              <Text style={[styles.agreementText, { color: colors.text }]}>隐私政策</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={styles.agreementItem}
            onPress={() => openUrl('https://www.example.com/community')}
          >
            <View style={styles.agreementContent}>
              <Ionicons name="heart-outline" size={22} color={colors.primary} style={styles.agreementIcon} />
              <Text style={[styles.agreementText, { color: colors.text }]}>社区准则</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* 联系方式 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>联系我们</Text>

          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              contact@datinginbnbu.com
            </Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={18} color={colors.textMuted} />
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              北京师范大学珠海校区
            </Text>
          </View>
        </View>

        {/* 版权信息 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Dating in BNBU. All rights reserved.</Text>
          <Text style={styles.footerText}>Made with ❤️ by BNBU Students</Text>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  appCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 1,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 8,
  },
  appSlogan: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 13,
  },
  agreementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  agreementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agreementIcon: {
    marginRight: 12,
  },
  agreementText: {
    fontSize: 15,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 4,
  },
});
