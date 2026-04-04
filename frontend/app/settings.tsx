import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Switch,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { logout, isAuthenticated, eduEmail } = useAuth();

  // 通知设置
  const [matchNotification, setMatchNotification] = useState(true);
  const [messageNotification, setMessageNotification] = useState(true);
  const [likeNotification, setLikeNotification] = useState(true);
  const [systemNotification, setSystemNotification] = useState(true);

  const [isClearingCache, setIsClearingCache] = useState(false);

  // 清除缓存
  const handleClearCache = () => {
    Alert.alert('清除缓存', '确定要清除缓存吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: async () => {
          setIsClearingCache(true);
          // 模拟清除缓存
          await new Promise(resolve => setTimeout(resolve, 1000));
          setIsClearingCache(false);
          Alert.alert('成功', '缓存已清除');
        }
      }
    ]);
  };

  // 退出登录
  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          await logout();
        }
      }
    ]);
  };

  // 修改密码
  const handleChangePassword = () => {
    Alert.alert('修改密码', '修改密码功能开发中', [
      { text: '确定' }
    ]);
  };

  // 绑定手机
  const handleBindPhone = () => {
    Alert.alert('绑定手机', '绑定手机功能开发中', [
      { text: '确定' }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 头部导航 */}
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>设置</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 通知设置 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>通知设置</Text>

          <View style={[styles.settingRow, { borderBottomColor: colors.separator }]}>
            <View style={styles.settingRowContent}>
              <Ionicons name="heart-outline" size={22} color={colors.primary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>新的匹配</Text>
            </View>
            <Switch
              value={matchNotification}
              onValueChange={setMatchNotification}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.separator }]}>
            <View style={styles.settingRowContent}>
              <Ionicons name="chatbubble-outline" size={22} color={colors.primary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>新消息</Text>
            </View>
            <Switch
              value={messageNotification}
              onValueChange={setMessageNotification}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: colors.separator }]}>
            <View style={styles.settingRowContent}>
              <Ionicons name="star-outline" size={22} color={colors.primary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>超级喜欢</Text>
            </View>
            <Switch
              value={likeNotification}
              onValueChange={setLikeNotification}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingRowContent}>
              <Ionicons name="megaphone-outline" size={22} color={colors.primary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>系统通知</Text>
            </View>
            <Switch
              value={systemNotification}
              onValueChange={setSystemNotification}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* 隐私设置 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>隐私设置</Text>

          <Pressable
            style={[styles.pressableRow, { borderBottomColor: colors.separator }]}
            onPress={() => Alert.alert('提示', '可见范围功能开发中')}
          >
            <View style={styles.pressableRowContent}>
              <Ionicons name="eye-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>可见范围</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={[styles.pressableRow, { borderBottomColor: colors.separator }]}
            onPress={() => Alert.alert('提示', '黑名单功能开发中')}
          >
            <View style={styles.pressableRowContent}>
              <Ionicons name="ban-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>黑名单</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>

          <Pressable
            style={styles.pressableRow}
            onPress={() => Alert.alert('提示', '隐私政策查看中')}
          >
            <View style={styles.pressableRowContent}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>隐私政策</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* 账号管理 */}
        {isAuthenticated && (
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>账号管理</Text>

            <Pressable
              style={[styles.pressableRow, { borderBottomColor: colors.separator }]}
              onPress={handleChangePassword}
            >
              <View style={styles.pressableRowContent}>
                <Ionicons name="lock-closed-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>修改密码</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>

            <Pressable
              style={[styles.pressableRow, { borderBottomColor: colors.separator }]}
              onPress={handleBindPhone}
            >
              <View style={styles.pressableRowContent}>
                <Ionicons name="call-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>绑定手机</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>

            <Pressable
              style={styles.pressableRow}
              onPress={() => Alert.alert('账号信息', `已登录账号：${eduEmail}`)}
            >
              <View style={styles.pressableRowContent}>
                <Ionicons name="person-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>账号信息</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
        )}

        {/* 通用设置 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>通用</Text>

          <Pressable
            style={[styles.pressableRow, { borderBottomColor: colors.separator }]}
            onPress={() => Alert.alert('提示', '语言设置功能开发中')}
          >
            <View style={styles.pressableRowContent}>
              <Ionicons name="language-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>语言</Text>
            </View>
            <View style={styles.rowEnd}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>简体中文</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Pressable>

          <Pressable
            style={[styles.pressableRow, { borderBottomColor: colors.separator }]}
            onPress={handleClearCache}
          >
            <View style={styles.pressableRowContent}>
              <Ionicons name="trash-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>清除缓存</Text>
            </View>
            {isClearingCache ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            )}
          </Pressable>

          <Pressable
            style={styles.pressableRow}
            onPress={() => router.push('/about')}
          >
            <View style={styles.pressableRowContent}>
              <Ionicons name="information-circle-outline" size={22} color={colors.secondary} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>关于我们</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* 退出登录 */}
        {isAuthenticated && (
          <View style={styles.logoutSection}>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
              <Text style={styles.logoutText}>退出登录</Text>
            </Pressable>
          </View>
        )}

        {/* 版本信息 */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Dating in BNBU v1.0.0</Text>
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
  },
  pressableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  pressableRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    fontSize: 14,
    marginRight: 4,
  },
  logoutSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B8A',
    borderRadius: 12,
    paddingVertical: 14,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#ccc',
  },
});
