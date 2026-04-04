// utils/MessageStorage.ts - 消息存储工具
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// 数据类型定义
// ============================================
export interface Message {
  id: string;
  conversationId: string;  // "user1_user2" 格式（按字母顺序排列）
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

export interface Conversation {
  id: string;              // 会话 ID
  userId: string;          // 对方用户 ID
  userName: string;
  userAvatar: string;
  userMajor?: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}

// ============================================
// 常量
// ============================================
const MESSAGES_PREFIX = '@bnbu/messages_';
const CONVERSATIONS_KEY = '@bnbu/conversations';

// ============================================
// 工具函数
// ============================================

/**
 * 生成会话 ID（确保两个用户的会话 ID 一致）
 * 按字母顺序排列用户 ID
 */
export const generateConversationId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

/**
 * 格式化时间戳为可读格式
 */
export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins}分钟前`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}小时前`;
  } else if (diff < day * 2) {
    return '昨天';
  } else if (diff < day * 7) {
    const days = Math.floor(diff / day);
    return `${days}天前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

/**
 * 格式化时间戳为小时：分钟格式
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

// ============================================
// 消息操作
// ============================================

/**
 * 添加消息到指定会话
 */
export const addMessage = async (message: Message): Promise<void> => {
  try {
    const key = MESSAGES_PREFIX + message.conversationId;
    const existing = await AsyncStorage.getItem(key);
    const messages: Message[] = existing ? JSON.parse(existing) : [];
    messages.push(message);
    // 按时间排序
    messages.sort((a, b) => a.timestamp - b.timestamp);
    await AsyncStorage.setItem(key, JSON.stringify(messages));
  } catch (error) {
    console.error('添加消息失败:', error);
  }
};

/**
 * 获取指定会话的所有消息
 */
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const key = MESSAGES_PREFIX + conversationId;
    const existing = await AsyncStorage.getItem(key);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('获取消息失败:', error);
    return [];
  }
};

/**
 * 标记消息为已读
 */
export const markMessagesAsRead = async (conversationId: string): Promise<void> => {
  try {
    const key = MESSAGES_PREFIX + conversationId;
    const existing = await AsyncStorage.getItem(key);
    if (existing) {
      const messages: Message[] = JSON.parse(existing);
      messages.forEach(msg => msg.isRead = true);
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    }
  } catch (error) {
    console.error('标记已读失败:', error);
  }
};

/**
 * 获取未读消息数量
 */
export const getUnreadCount = async (conversationId: string, currentUserId: string): Promise<number> => {
  try {
    const messages = await getMessages(conversationId);
    return messages.filter(m => m.senderId !== currentUserId && !m.isRead).length;
  } catch (error) {
    console.error('获取未读数失败:', error);
    return 0;
  }
};

// ============================================
// 会话列表操作
// ============================================

/**
 * 获取所有会话列表
 */
export const getAllConversations = async (): Promise<Conversation[]> => {
  try {
    const existing = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.error('获取会话列表失败:', error);
    return [];
  }
};

/**
 * 保存会话列表
 */
export const saveConversations = async (conversations: Conversation[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('保存会话列表失败:', error);
  }
};

/**
 * 更新或添加会话（当收到新消息时调用）
 */
export const updateConversation = async (
  conversation: Conversation,
  currentUserId: string,
  senderId?: string
): Promise<void> => {
  try {
    const conversations = await getAllConversations();
    const index = conversations.findIndex(c => c.id === conversation.id);

    if (index >= 0) {
      // 更新现有会话
      const existing = conversations[index];
      conversations[index] = {
        ...existing,
        lastMessage: conversation.lastMessage,
        lastMessageTime: conversation.lastMessageTime,
        // 如果是对方发来的消息，增加未读数
        unreadCount: senderId !== currentUserId
          ? existing.unreadCount + 1
          : existing.unreadCount,
      };
      // 将最新会话移到最前面
      conversations.splice(index, 1);
      conversations.unshift(conversations[index]);
    } else {
      // 添加新会话
      conversations.unshift(conversation);
    }

    await saveConversations(conversations);
  } catch (error) {
    console.error('更新会话失败:', error);
  }
};

/**
 * 获取或创建会话
 */
export const getOrCreateConversation = async (
  conversationId: string,
  otherUser: { id: string; name: string; avatar: string; major?: string }
): Promise<Conversation> => {
  const conversations = await getAllConversations();
  let conversation = conversations.find(c => c.id === conversationId);

  if (!conversation) {
    conversation = {
      id: conversationId,
      userId: otherUser.id,
      userName: otherUser.name,
      userAvatar: otherUser.avatar,
      userMajor: otherUser.major,
      lastMessage: '开始聊天吧～',
      lastMessageTime: Date.now(),
      unreadCount: 0,
    };
    await updateConversation(conversation, '');
  }

  return conversation;
};
