// app/chat/[id].tsx - 聊天对话页面
import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// 数据类型定义
// ============================================
type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  major: string;
  online: boolean;
};

// ============================================
// 模拟数据
// ============================================
const USE_MOCK_DATA = true;

const MOCK_USERS: Record<string, ChatUser> = {
  '1': {
    id: '1',
    name: '小李',
    avatar: 'https://picsum.photos/200/200?random=1',
    major: '计算机科学与技术',
    online: true,
  },
  '2': {
    id: '2',
    name: '小王',
    avatar: 'https://picsum.photos/200/200?random=2',
    major: '英语专业',
    online: false,
  },
  '3': {
    id: '3',
    name: '小张',
    avatar: 'https://picsum.photos/200/200?random=3',
    major: '工商管理',
    online: true,
  },
  '4': {
    id: '4',
    name: '小赵',
    avatar: 'https://picsum.photos/200/200?random=4',
    major: '艺术设计',
    online: false,
  },
};

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: '1', senderId: 'other', text: '你好！看到你的资料，发现我们也都喜欢编程～', timestamp: '10:30' },
    { id: '2', senderId: 'me', text: '是啊！你平时用什么语言比较多？', timestamp: '10:32' },
    { id: '3', senderId: 'other', text: '我主要用 Python 和 JavaScript，最近在学习 Rust', timestamp: '10:33' },
    { id: '4', senderId: 'other', text: '你最喜欢什么编程语言？', timestamp: '10:33' },
  ],
  '2': [
    { id: '1', senderId: 'me', text: '你好，对你的专业很感兴趣！', timestamp: '昨天' },
    { id: '2', senderId: 'other', text: '谢谢！英语专业其实很有趣，可以了解不同文化', timestamp: '昨天' },
    { id: '3', senderId: 'other', text: '周末有空一起去看展览吗？', timestamp: '1 小时前' },
  ],
  '3': [
    { id: '1', senderId: 'other', text: '听说你也很喜欢看电影？', timestamp: '2 天前' },
    { id: '2', senderId: 'me', text: '对啊！最近有什么好推荐的吗？', timestamp: '2 天前' },
    { id: '3', senderId: 'other', text: '《奥本海默》很不错！', timestamp: '2 天前' },
    { id: '4', senderId: 'me', text: '好的，我记下了！', timestamp: '2 天前' },
    { id: '5', senderId: 'other', text: '哈哈，我也很喜欢那部电影！', timestamp: '昨天' },
  ],
  '4': [
    { id: '1', senderId: 'me', text: '你的设计作品真的很棒！', timestamp: '3 天前' },
    { id: '2', senderId: 'other', text: '谢谢夸奖！很高兴你喜欢', timestamp: '3 天前' },
    { id: '3', senderId: 'other', text: '你的作品真的很棒', timestamp: '2 天前' },
  ],
};

// AI Icebreaker 提示语
const ICEBREAKERS = [
  '看到你的资料，发现我们也喜欢{hobby}，最近有什么新发现吗？',
  '你的{major}专业很酷！是什么让你选择这个专业的？',
  '看你头像是在{place}拍的吗？看起来很漂亮！',
  '如果用三个词形容自己，你会选哪三个？',
  '周末一般喜欢做什么？有什么推荐的活动吗？',
];

// ============================================
// 消息气泡组件
// ============================================
interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  colors: typeof Colors.light;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, colors }) => {
  return (
    <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}>
      {!isMe && (
        <View style={styles.senderAvatar}>
          <Image
            source={{ uri: MOCK_MESSAGES[message.senderId] ? 'https://picsum.photos/100/100?random=' + message.senderId : 'https://picsum.photos/100/100?random=other' }}
            style={styles.miniAvatar}
            resizeMode="cover"
          />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          isMe
            ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
            : { backgroundColor: colors.tagBackground, borderBottomLeftRadius: 4 },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isMe ? '#fff' : colors.text },
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { color: isMe ? 'rgba(255,255,255,0.8)' : colors.textMuted },
          ]}
        >
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
};

// ============================================
// 主页面组件
// ============================================
export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userId } = useAuth();

  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChat() {
      setLoading(true);
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!cancelled) {
          const user = MOCK_USERS[id] || {
            id,
            name: '用户',
            avatar: 'https://picsum.photos/200/200?random=' + id,
            major: '未知专业',
            online: false,
          };
          setChatUser(user);
          setMessages(MOCK_MESSAGES[id] || []);
          setLoading(false);
        }
        return;
      }
      setLoading(false);
    }
    loadChat();
    return () => { cancelled = true; };
  }, [id]);

  // 发送消息
  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    Keyboard.dismiss();

    // 滚动到底部
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // 模拟自动回复（仅用于测试）
    setTimeout(() => {
      const replies = ['嗯嗯，有道理！', '哈哈，好有趣～', '我也这么觉得！', '真的吗？多跟我讲讲！', '👍'];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  // AI 生成破冰开场白
  const handleGenerateIcebreaker = () => {
    if (!chatUser) return;

    const template = ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)];
    let icebreaker = template;

    // 简单替换占位符
    if (chatUser.major) {
      icebreaker = icebreaker.replace('{major}', chatUser.major);
    }
    icebreaker = icebreaker.replace('{hobby}', '音乐');
    icebreaker = icebreaker.replace('{place}', '这里');

    setInputText(icebreaker);
    inputRef.current?.focus();
  };

  // 渲染消息项
  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isMe={item.senderId === 'me'}
      colors={colors}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* 头部 */}
        <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.separator }]}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color={colors.text} />
            </Pressable>
            {chatUser && (
              <>
                <Image source={{ uri: chatUser.avatar }} style={styles.headerAvatar} resizeMode="cover" />
                <View style={styles.headerInfo}>
                  <Text style={[styles.headerName, { color: colors.text }]} numberOfLines={1}>
                    {chatUser.name}
                  </Text>
                  <Text style={[styles.headerStatus, { color: chatUser.online ? colors.primary : colors.textMuted }]}>
                    {chatUser.online ? '在线' : '离线'}
                  </Text>
                </View>
              </>
            )}
          </View>
          <View style={styles.headerActions}>
            <Pressable style={[styles.headerActionBtn, { backgroundColor: colors.tagBackground }]}>
              <Ionicons name="call" size={20} color={colors.primary} />
            </Pressable>
            <Pressable style={[styles.headerActionBtn, { backgroundColor: colors.tagBackground }]}>
              <Ionicons name="videocam" size={20} color={colors.primary} />
            </Pressable>
            <Pressable style={[styles.headerActionBtn, { backgroundColor: colors.tagBackground }]}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* 消息列表 */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* AI Icebreaker 提示按钮 */}
        <Pressable
          onPress={handleGenerateIcebreaker}
          style={({ pressed }) => [
            styles.icebreakerButton,
            { backgroundColor: colors.tagBackground },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="sparkles" size={16} color={colors.accent} />
          <Text style={[styles.icebreakerText, { color: colors.textSecondary }]}>
            AI 破冰助手
          </Text>
        </Pressable>

        {/* 输入区域 */}
        <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderTopColor: colors.separator }]}>
          <Pressable style={[styles.attachButton, { backgroundColor: colors.tagBackground }]}>
            <Ionicons name="add" size={24} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              { backgroundColor: colors.tagBackground, color: colors.text },
            ]}
            placeholder="输入消息..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? colors.primary : colors.passButton,
              },
            ]}
          >
            <Ionicons
              name={inputText.trim() ? 'send' : 'heart-outline'}
              size={20}
              color={inputText.trim() ? '#fff' : colors.textSecondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
  },
  headerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5E5',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  icebreakerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 8,
    gap: 6,
  },
  icebreakerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 22,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
