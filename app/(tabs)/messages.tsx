// app/(tabs)/messages.tsx - 消息中心页面
// 遵循 UX 设计报告 4.5 节规范
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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import {
  Conversation,
  getAllConversations,
  markMessagesAsRead,
  formatTimestamp,
} from '@/utils/MessageStorage';

// ============================================
// 新匹配横向滚动项组件
// ============================================
interface NewMatchItemProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  colors: typeof Colors.light;
  onPress: (id: string) => void;
}

const NewMatchItem: React.FC<NewMatchItemProps> = ({ user, colors, onPress }) => {
  return (
    <Pressable onPress={() => onPress(user.id)} style={styles.newMatchItem}>
      <View style={[styles.newMatchAvatarWrapper, { borderColor: colors.primary }]}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.newMatchAvatar}
          resizeMode="cover"
        />
      </View>
      <Text style={[styles.newMatchName, { color: colors.text }]} numberOfLines={1}>
        {user.name}
      </Text>
    </Pressable>
  );
};

// ============================================
// 消息列表项组件
// ============================================
interface MessageItemProps {
  conversation: Conversation;
  onPress: (id: string) => void;
  colors: typeof Colors.light;
}

const MessageItem: React.FC<MessageItemProps> = ({ conversation, onPress, colors }) => {
  return (
    <Pressable
      onPress={() => onPress(conversation.id)}
      style={({ pressed }) => [
        styles.messageItem,
        { backgroundColor: colors.cardBackground, borderBottomColor: colors.separator },
        pressed && { backgroundColor: colors.tagBackground },
      ]}
    >
      {/* 头像 */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: conversation.userAvatar }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      {/* 内容区域 */}
      <View style={styles.messageContent}>
        {/* 姓名和时间 */}
        <View style={styles.nameRow}>
          <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
            {conversation.userName}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>
            {formatTimestamp(conversation.lastMessageTime)}
          </Text>
        </View>

        {/* 专业 */}
        {conversation.userMajor && (
          <Text style={[styles.major, { color: colors.textSecondary }]} numberOfLines={1}>
            {conversation.userMajor}
          </Text>
        )}

        {/* 最后一条消息 */}
        <View style={styles.lastMessageRow}>
          <Text
            style={[
              styles.lastMessage,
              { color: conversation.unreadCount > 0 ? colors.text : colors.textMuted },
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage || '开始聊天吧～'}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadCount}>
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 右箭头 */}
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
};

// ============================================
// 主页面组件
// ============================================
export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userId } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟新匹配用户
  const newMatches = [
    { id: '1', name: '小明', avatar: 'https://picsum.photos/400/400?random=1' },
    { id: '2', name: '小红', avatar: 'https://picsum.photos/400/400?random=2' },
    { id: '3', name: '小刚', avatar: 'https://picsum.photos/400/400?random=3' },
    { id: '4', name: '小美', avatar: 'https://picsum.photos/400/400?random=4' },
    { id: '5', name: '小强', avatar: 'https://picsum.photos/400/400?random=5' },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    setLoading(true);
    const convos = await getAllConversations();
    setConversations(convos);
    setLoading(false);
  }

  // 处理点击消息项
  const handlePressMessage = async (conversationId: string) => {
    // 标记为已读
    await markMessagesAsRead(conversationId);
    // 刷新列表
    await loadConversations();
    // 跳转到聊天页面
    router.push({
      pathname: '/chat/[id]',
      params: { id: conversationId },
    } as never);
  };

  // 处理点击新匹配
  const handlePressNewMatch = (userId: string) => {
    // 可以直接跳转到聊天或者用户资料
    console.log('Pressed new match:', userId);
  };

  // 渲染新匹配项
  const renderNewMatchItem = ({ item }: { item: typeof newMatches[0] }) => (
    <NewMatchItem
      user={item}
      onPress={handlePressNewMatch}
      colors={colors}
    />
  );

  // 渲染消息列表项
  const renderMessageItem = ({ item }: { item: Conversation }) => (
    <MessageItem
      conversation={item}
      onPress={handlePressMessage}
      colors={colors}
    />
  );

  // 空状态
  const renderEmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
      <View style={[styles.emptyIconWrapper, { backgroundColor: colors.tagBackground }]}>
        <Ionicons name="chatbubbles-outline" size={40} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>还没有消息</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        去匹配页面发现更多有趣的人吧
      </Text>
      <Pressable
        onPress={() => router.push('/(tabs)/index' as never)}
        style={[styles.discoverButton, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.discoverButtonText}>去匹配</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* 头部 - 大标题风格 */}
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {conversations.length} 个会话
          </Text>
        </View>
        <Pressable style={styles.composeButton}>
          <Ionicons name="create-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* 消息列表 */}
      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : conversations.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { backgroundColor: colors.cardBackground }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            newMatches.length > 0 ? (
              <>
                {/* 新匹配横向滚动区 */}
                <View style={styles.newMatchesSection}>
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    New Matches
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.newMatchesContainer}
                  >
                    {newMatches.map((match) => (
                      <NewMatchItem
                        key={match.id}
                        user={match}
                        onPress={handlePressNewMatch}
                        colors={colors}
                      />
                    ))}
                  </ScrollView>
                </View>

                {/* 分隔线 */}
                <View style={[styles.sectionDivider, { backgroundColor: colors.separator }]} />

                {/* 会话列表标题 */}
                <View style={styles.messagesHeader}>
                  <Text style={[styles.messagesTitle, { color: colors.textSecondary }]}>
                    Messages
                  </Text>
                </View>
              </>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  composeButton: {
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
    paddingTop: 8,
    paddingBottom: 100,
  },

  // 新匹配横向滚动区
  newMatchesSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  newMatchesContainer: {
    gap: 12,
    paddingRight: 16,
  },
  newMatchItem: {
    width: 72,
    alignItems: 'center',
    gap: 8,
  },
  newMatchAvatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  newMatchAvatar: {
    width: '100%',
    height: '100%',
  },
  newMatchName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionDivider: {
    height: 1,
    marginVertical: 8,
  },
  messagesHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messagesTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // 消息列表项
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E5E5',
  },
  messageContent: {
    flex: 1,
    paddingRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
  },
  major: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 4,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  // 空状态
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
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 28,
  },
  discoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
