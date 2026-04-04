// app/(tabs)/two.tsx - Profile 个人中心页面
// 遵循 UX 设计报告 - 咖啡/奶油暖色调系
import React from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileScreen() {
  const { isAuthenticated, eduEmail, logout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = () => {
    logout();
  };

  const navigateTo = (path: Parameters<typeof router.push>[0]) => {
    router.push(path);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 头部 - 大标题风格 */}
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <Pressable onPress={() => navigateTo('/settings')} style={styles.headerButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://picsum.photos/200/200?random=avatar' }}
              style={styles.avatar}
            />
            {isAuthenticated && (
              <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={[styles.username, { color: colors.text }]}>
            {isAuthenticated ? (eduEmail?.split('@')[0] || '用户') : '用户'}
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, {
              backgroundColor: isAuthenticated ? `${colors.primary}20` : colors.tagBackground
            }]}>
              <Text style={[styles.statusText, {
                color: isAuthenticated ? colors.primary : colors.textSecondary
              }]}>
                {isAuthenticated ? '已登录' : '未登录'}
              </Text>
            </View>
          </View>
        </View>

        {/* 统计卡片 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>匹配统计</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconWrapper, { backgroundColor: `${colors.primary}15` }]}>
                <Ionicons name="eye-outline" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>24</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>浏览</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.separator }]} />
            <View style={styles.statItem}>
              <View style={[styles.statIconWrapper, { backgroundColor: `${colors.likeButton}15` }]}>
                <Ionicons name="heart-outline" size={24} color={colors.likeButton} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>喜欢</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.separator }]} />
            <View style={styles.statItem}>
              <View style={[styles.statIconWrapper, { backgroundColor: `${colors.superLike}15` }]}>
                <Ionicons name="sparkles-outline" size={24} color={colors.superLike} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>3</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>匹配</Text>
            </View>
          </View>
        </View>

        {/* 功能列表 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>个人资料</Text>
          <MenuItem
            title="编辑资料"
            icon="create-outline"
            iconColor={colors.secondary}
            onPress={() => navigateTo('/profile/edit')}
            colors={colors}
          />
          <MenuItem
            title="我的匹配"
            icon="heart-outline"
            iconColor={colors.likeButton}
            onPress={() => navigateTo('/matches')}
            colors={colors}
          />
          <MenuItem
            title="消息中心"
            icon="chatbubble-outline"
            iconColor={colors.accent}
            onPress={() => navigateTo('/messages')}
            colors={colors}
          />
        </View>

        {/* 设置 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>设置与支持</Text>
          <MenuItem
            title="设置"
            icon="settings-outline"
            iconColor={colors.textMuted}
            onPress={() => navigateTo('/settings')}
            colors={colors}
          />
          <MenuItem
            title="帮助与反馈"
            icon="help-circle-outline"
            iconColor={colors.textMuted}
            onPress={() => navigateTo('/help')}
            colors={colors}
          />
          <MenuItem
            title="关于我们"
            icon="information-circle-outline"
            iconColor={colors.textMuted}
            onPress={() => navigateTo('/about')}
            colors={colors}
          />
        </View>

        {/* 退出登录按钮 */}
        {isAuthenticated && (
          <View style={styles.logoutSection}>
            <Pressable onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>退出登录</Text>
            </Pressable>
          </View>
        )}

        {!isAuthenticated && (
          <View style={styles.loginSection}>
            <Pressable
              onPress={() => navigateTo('/login')}
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.loginButtonText}>立即登录</Text>
            </Pressable>
            <Pressable
              onPress={() => navigateTo('/register')}
              style={[styles.registerButton, { borderColor: colors.primary }]}
            >
              <Text style={[styles.registerButtonText, { color: colors.primary }]}>注册账号</Text>
            </Pressable>
          </View>
        )}

        {/* 版本信息 */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: colors.textMuted }]}>Dating in BNBU v1.0.0</Text>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function MenuItem({
  title,
  icon,
  iconColor,
  onPress,
  colors
}: {
  title: string;
  icon: string;
  iconColor: string;
  onPress?: () => void;
  colors: typeof Colors.light;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { borderBottomColor: colors.separator },
        pressed && { backgroundColor: colors.tagBackground }
      ]}
    >
      <View style={styles.menuItemContent}>
        <View style={[styles.iconWrapper, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
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
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
  },
  logoutSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 2,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionSection: {
    marginTop: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
  },
});
