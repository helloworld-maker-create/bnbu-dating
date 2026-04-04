import React from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable } from 'react-native';
import { Text } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { isAuthenticated, eduEmail, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const navigateTo = (path: Parameters<typeof router.push>[0]) => {
    router.push(path);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 头像区域 */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/200/200?random=avatar' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.username}>{isAuthenticated ? eduEmail : '游客用户'}</Text>
        <Text style={styles.userStatus}>{isAuthenticated ? '已登录' : '未登录'}</Text>
      </View>

      {/* 个人信息卡片 */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>个人信息</Text>

        <InfoRow label="邮箱" value={isAuthenticated && eduEmail ? eduEmail : '请先登录'} />
        <InfoRow label="专业" value="计算机科学与技术" />
        <InfoRow label="GPA" value="3.5-4.0" />
        <InfoRow label="兴趣爱好" value="编程、篮球、音乐" />
      </View>

      {/* 匹配统计 */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>匹配统计</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>浏览</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>喜欢</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>匹配</Text>
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <View style={styles.menuCard}>
        <MenuItem title="编辑资料" icon="✏️" onPress={() => navigateTo('/profile/edit')} />
        <MenuItem title="我的匹配" icon="💕" onPress={() => navigateTo('/matches')} />
        <MenuItem title="设置" icon="⚙️" onPress={() => navigateTo('/settings')} />
        <MenuItem title="帮助与反馈" icon="❓" onPress={() => navigateTo('/help')} />
        <MenuItem title="关于我们" icon="ℹ️" onPress={() => navigateTo('/about')} />
      </View>

      {/* 退出登录按钮 */}
      {isAuthenticated && (
        <View style={styles.logoutContainer}>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>退出登录</Text>
          </Pressable>
        </View>
      )}

      {!isAuthenticated && (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>登录后可以享受更多功能哦~</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Dating in BNBU v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function MenuItem({ title, icon, onPress }: { title: string; icon: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B8A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  logoutContainer: {
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#FF6B8A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginPrompt: {
    marginTop: 8,
    backgroundColor: '#FFF3F5',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  loginPromptText: {
    color: '#FF6B8A',
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: 12,
  },
});
