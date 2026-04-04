// app/(tabs)/matches.tsx - 匹配列表页面
// 遵循 UX 设计报告 - 咖啡/奶油暖色调系
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// 数据类型定义
// ============================================
type Match = {
  id: string;
  userId: string;
  name: string;
  major: string;
  avatar: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
};

// ============================================
// 模拟数据
// ============================================
const USE_MOCK_DATA = true;

const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    userId: 'user_1',
    name: '小李',
    major: '计算机科学与技术',
    avatar: 'https://picsum.photos/200/200?random=1',
    lastMessage: '你最喜欢什么编程语言？',
    timestamp: '刚刚',
    unreadCount: 2,
  },
  {
    id: '2',
    userId: 'user_2',
    name: '小王',
    major: '英语专业',
    avatar: 'https://picsum.photos/200/200?random=2',
    lastMessage: '周末有空一起去看展览吗？',
    timestamp: '1 小时前',
    unreadCount: 0,
  },
  {
    id: '3',
    userId: 'user_3',
    name: '小张',
    major: '工商管理',
    avatar: 'https://picsum.photos/200/200?random=3',
    lastMessage: '哈哈，我也很喜欢那部电影！',
    timestamp: '昨天',
    unreadCount: 0,
  },
  {
    id: '4',
    userId: 'user_4',
    name: '小赵',
    major: '艺术设计',
    avatar: 'https://picsum.photos/200/200?random=4',
    lastMessage: '你的作品真的很棒',
    timestamp: '2 天前',
    unreadCount: 1,
  },
];

// ============================================
// 匹配列表项组件
// ============================================
interface MatchItemProps {
  match: Match;
  onPress: (id: string) => void;
  colors: typeof Colors.light;
}

const MatchItem: React.FC<MatchItemProps> = ({ match, onPress, colors }) => {
  return (
    <Pressable
      onPress={() => onPress(match.id)}
      style={({ pressed }) => [
        styles.matchItem,
        { backgroundColor: colors.cardBackground, borderBottomColor: colors.separator },
        pressed && { backgroundColor: colors.tagBackground },
      ]}
    >
      {/* 头像 */}
      <Image source={{ uri: match.avatar }} style={styles.avatar} resizeMode="cover" />

      {/* 内容区域 */}
      <View style={styles.matchContent}>
        {/* 姓名和未读标记 */}
        <View style={styles.nameRow}>
          <Text style={[styles.matchName, { color: colors.text }]} numberOfLines={1}>
            {match.name}
          </Text>
          {match.unreadCount && match.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadCount}>
                {match.unreadCount > 99 ? '99+' : match.unreadCount}
              </Text>
            </View>
          )}
        </View>

        {/* 专业 */}
        <Text style={[styles.major, { color: colors.textSecondary }]} numberOfLines={1}>
          {match.major}
        </Text>

        {/* 最后一条消息和时间 */}
        <View style={styles.lastMessageRow}>
          <Text
            style={[
              styles.lastMessage,
              { color: match.unreadCount && match.unreadCount > 0 ? colors.text : colors.textMuted },
            ]}
            numberOfLines={1}
          >
            {match.lastMessage || '开始聊天吧～'}
          </Text>
          {match.timestamp && (
            <Text style={[styles.timestamp, { color: colors.textMuted }]}>{match.timestamp}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

// ============================================
// 主页面组件
// ============================================
export default function MatchesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userId } = useAuth();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      setLoading(true);
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!cancelled) {
          setMatches(MOCK_MATCHES);
          setLoading(false);
        }
        return;
      }
      // TODO: 从 API 获取匹配列表
      setLoading(false);
    }
    loadMatches();
    return () => { cancelled = true; };
  }, []);

  // 处理点击匹配项
  const handlePressMatch = (matchId: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: matchId },
    } as never);
  };

  // 渲染匹配列表项
  const renderMatchItem = ({ item }: { item: Match }) => (
    <MatchItem match={item} onPress={handlePressMatch} colors={colors} />
  );

  // 空状态
  const renderEmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
      <View style={[styles.emptyIconWrapper, { backgroundColor: colors.tagBackground }]}>
        <Ionicons name="heart-outline" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>还没有匹配</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        去探索页面发现更多有趣的人吧
      </Text>
      <Pressable
        onPress={() => router.push('/(tabs)/index' as never)}
        style={[styles.discoverButton, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.discoverButtonText}>去探索</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* 头部 */}
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Matches</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {matches.length} 个匹配
          </Text>
        </View>
        <Pressable style={[styles.iconButton, { backgroundColor: colors.tagBackground }]}>
          <Ionicons name="settings-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>

      {/* 匹配列表 */}
      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : matches.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.separator }} />}
        />
      )}
    </SafeAreaView>
  );
}

// ============================================
// 样式
// ============================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E5E5',
  },
  matchContent: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchName: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  major: {
    fontSize: 14,
    marginTop: 2,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    flexShrink: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  discoverButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  discoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
