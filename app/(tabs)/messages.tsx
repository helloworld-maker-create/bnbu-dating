// app/(tabs)/messages.tsx - Messages 消息页
// Campus Connect 设计风格: Header + New Matches 气泡 + Conversation List

import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { Avatar, Badge } from '@/components/CampusComponents';

// 模拟新匹配数据
const NEW_MATCHES = [
  { id: '1', name: '小明', avatar: 'https://i.pravatar.cc/80?u=match1' },
  { id: '2', name: '小红', avatar: 'https://i.pravatar.cc/80?u=match2' },
  { id: '3', name: '小刚', avatar: 'https://i.pravatar.cc/80?u=match3' },
  { id: '4', name: '小美', avatar: 'https://i.pravatar.cc/80?u=match4' },
];

// 模拟对话数据
const CONVERSATIONS = [
  {
    id: '1',
    name: '艾玛',
    avatar: 'https://i.pravatar.cc/80?u=convo1',
    lastMessage: '嗨！你这学期过得怎么样？',
    time: '2小时前',
    unread: 2,
  },
  {
    id: '2',
    name: '大卫',
    avatar: 'https://i.pravatar.cc/80?u=convo2',
    lastMessage: '你：听起来不错！我们见面吧',
    time: '1天前',
    unread: 0,
  },
  {
    id: '3',
    name: '苏菲',
    avatar: 'https://i.pravatar.cc/80?u=convo3',
    lastMessage: '打个招呼吧！👋',
    time: '刚刚',
    unread: 0,
  },
];

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const renderMatchItem = (item: typeof NEW_MATCHES[0]) => (
    <Pressable
      key={item.id}
      style={styles.matchBubble}
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } } as any)}
    >
      <View style={[styles.matchRing, { borderColor: colors.primary }]}>
        <Image source={{ uri: item.avatar }} style={styles.matchAvatar} />
      </View>
      <Text style={[styles.matchName, { color: colors.textSecondary }]} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );

  const renderConvoItem = ({ item }: { item: typeof CONVERSATIONS[0] }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } } as any)}
      style={[styles.convoItem, { borderBottomColor: colors.border }]}
    >
      <Avatar uri={item.avatar} size={52} />
      <View style={styles.convoInfo}>
        <Text style={[styles.convoName, { color: colors.text }]}>{item.name}</Text>
        <Text
          style={[styles.convoPreview, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      <View style={styles.convoMeta}>
        <Text style={[styles.convoTime, { color: colors.textSecondary }]}>{item.time}</Text>
        {item.unread > 0 && <Badge count={item.unread} />}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.serif }]}>
          消息
        </Text>
        <Pressable style={[styles.iconBtn, { backgroundColor: colors.cream }]}>
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* New Matches Section */}
      <View style={styles.matchesSection}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          新匹配
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesRow}>
          {NEW_MATCHES.map((match) => renderMatchItem(match))}
        </ScrollView>
      </View>

      {/* Conversations List */}
      <FlatList
        data={CONVERSATIONS}
        renderItem={renderConvoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.convoList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchesSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: 8,
  },
  matchesRow: {
    paddingHorizontal: spacing.lg,
    gap: 16,
  },
  matchBubble: {
    width: 60,
    alignItems: 'center',
    gap: 5,
  },
  matchRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    padding: 2,
    overflow: 'hidden',
  },
  matchAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 99,
  },
  matchName: {
    fontSize: 10,
    textAlign: 'center',
    overflow: 'hidden',
  },
  convoList: {
    flex: 1,
  },
  convoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  convoInfo: {
    flex: 1,
    minWidth: 0,
  },
  convoName: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
    marginBottom: 2,
  },
  convoPreview: {
    fontSize: 11,
    overflow: 'hidden',
  },
  convoMeta: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  convoTime: {
    fontSize: 11,
  },
});
