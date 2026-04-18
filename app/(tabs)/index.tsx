// app/(tabs)/index.tsx - DiscoverScreen 发现页
// Campus Connect 设计风格

import React, { useState, useRef } from 'react';
import {
  Dimensions, Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View, Animated, PanResponder, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { Chip } from '@/components/CampusComponents';
import { MatchModal } from '@/components/MatchModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

type User = { id: string; name: string; age: number; avatar: string; major: string; grade: string; tags: string[] };

const MOCK_USERS: User[] = [
  { id: '1', name: '小雨', age: 19, avatar: 'https://i.pravatar.cc/400?u=user1', major: '心理学', grade: '大二', tags: ['咖啡', '艺术', '音乐'] },
  { id: '2', name: '浩然', age: 21, avatar: 'https://i.pravatar.cc/400?u=user2', major: '工商管理', grade: '大四', tags: ['徒步', '金融'] },
  { id: '3', name: '思琪', age: 20, avatar: 'https://i.pravatar.cc/400?u=user3', major: '计算机科学', grade: '大三', tags: ['咖啡', '游戏'] },
];

const FILTERS = ['全部', '职业匹配', '同专业', '附近'];

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [users] = useState<User[]>(MOCK_USERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const swipeX = useRef(new Animated.Value(0)).current;

  const cardRotation = swipeX.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-18deg', '0deg', '18deg'],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: swipeX }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dx > SWIPE_THRESHOLD) handleLike(gs.vx);
        else if (gs.dx < -SWIPE_THRESHOLD) handlePass(gs.vx);
        else resetCard();
      },
    })
  ).current;

  const handleLike = (velocity: number) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(swipeX, { toValue: SCREEN_WIDTH, velocity, useNativeDriver: true }).start(() => {
      if (Math.random() < 0.3 && users[currentIndex]) { setMatchedUser(users[currentIndex]); setShowMatch(true); }
      advanceToNextCard();
    });
  };

  const handlePass = (velocity: number) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(swipeX, { toValue: -SCREEN_WIDTH, velocity, useNativeDriver: true }).start(() => advanceToNextCard());
  };

  const resetCard = () => { Animated.spring(swipeX, { toValue: 0, useNativeDriver: true }).start(); };
  const advanceToNextCard = () => { setCurrentIndex((p) => p + 1); swipeX.setValue(0); };

  const handleLikeButton = () => {
    Animated.spring(swipeX, { toValue: SCREEN_WIDTH * 1.5, velocity: 1, useNativeDriver: true }).start(() => {
      if (Math.random() < 0.3 && users[currentIndex]) { setMatchedUser(users[currentIndex]); setShowMatch(true); }
      advanceToNextCard();
    });
  };

  const handlePassButton = () => {
    Animated.spring(swipeX, { toValue: -SCREEN_WIDTH * 1.5, velocity: 1, useNativeDriver: true }).start(() => advanceToNextCard());
  };

  const handleReset = () => { setCurrentIndex(0); swipeX.setValue(0); };
  const currentUser = users[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.serif }]}>发现</Text>
        <Pressable style={[styles.iconBtn, { backgroundColor: colors.cream }]}>
          <Ionicons name="settings-outline" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* Filter Chips - compact row */}
      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map((f) => (<Chip key={f} label={f} active={activeFilter === f} onPress={() => setActiveFilter(f)} />))}
        </ScrollView>
      </View>

      <View style={styles.cardArea}>
        {currentIndex < users.length ? (
          <>
            {currentIndex + 1 < users.length && (
              <View style={[styles.backCard, { transform: [{ scale: 0.95 }, { translateY: 16 }], opacity: 0.85, backgroundColor: colors.card }]}>
                <Image source={{ uri: users[currentIndex + 1].avatar }} style={styles.cardImage} />
              </View>
            )}
            {currentUser && (
              <Animated.View {...panResponder.panHandlers} style={[styles.card, { transform: [{ translateX: swipeX }, { rotate: cardRotation }], backgroundColor: colors.card }]}>
                <Image source={{ uri: currentUser.avatar }} style={styles.cardImage} />
                <View style={styles.cardGradient} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{currentUser.name}, {currentUser.age}</Text>
                  <Text style={styles.cardMeta}>{currentUser.grade} · {currentUser.major}</Text>
                  <View style={styles.tags}>
                    {currentUser.tags.map((tag, i) => (<View key={i} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>))}
                  </View>
                </View>
              </Animated.View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 56 }}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>暂无更多用户</Text>
            <Pressable onPress={handleReset} style={[styles.reloadBtn, { backgroundColor: colors.primary }]}><Text style={styles.reloadBtnText}>重新加载</Text></Pressable>
          </View>
        )}
      </View>

      {currentIndex < users.length && (
        <View style={styles.actions}>
          <Pressable onPress={handlePassButton} style={[styles.actionBtn, styles.passBtn, { backgroundColor: colors.card }]}><Text style={{ fontSize: 22, color: colors.error }}>✕</Text></Pressable>
          <Pressable style={[styles.actionBtn, styles.superBtn, { backgroundColor: colors.card }]}><Text style={{ fontSize: 20, color: colors.warning }}>★</Text></Pressable>
          <Pressable onPress={handleLikeButton} style={[styles.actionBtn, styles.likeBtn, { backgroundColor: colors.primary }]}><Text style={{ fontSize: 26, color: colors.white }}>♥</Text></Pressable>
        </View>
      )}

      <MatchModal
        visible={showMatch}
        onClose={() => setShowMatch(false)}
        onSendMessage={() => { setShowMatch(false); router.push('/messages'); }}
        currentUser={{ name: 'You', avatar: 'https://i.pravatar.cc/120?u=me' }}
        matchedUser={matchedUser ? { name: matchedUser.name, avatar: matchedUser.avatar } : undefined}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: 12 },
  headerTitle: { fontSize: 24, fontWeight: typography.weights.bold },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  filterRow: { paddingHorizontal: spacing.lg, paddingBottom: 10, gap: 8 },
  chip: { marginRight: 0 },
  cardArea: { flex: 1, marginHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center' },
  backCard: { position: 'absolute', width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' },
  card: { position: 'absolute', width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', ...shadows.card },
  cardImage: { width: '100%', height: '65%' },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', backgroundColor: 'rgba(26,14,8,0.75)' },
  cardInfo: { position: 'absolute', bottom: spacing.lg, left: spacing.lg, right: spacing.lg },
  cardName: { fontSize: 28, fontWeight: typography.weights.bold, color: '#FFFFFF', fontFamily: typography.serif, marginBottom: 4 },
  cardMeta: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingVertical: 4, paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  tagText: { fontSize: 11, color: '#FFFFFF' },
  emptyState: { alignItems: 'center', gap: 12, padding: spacing.xxl },
  emptyTitle: { fontSize: 20, fontWeight: typography.weights.bold, fontFamily: typography.serif, color: '#fff' },
  reloadBtn: { marginTop: 8, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 9999 },
  reloadBtnText: { fontSize: 13, fontWeight: typography.weights.semibold, color: '#FFFFFF' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingVertical: 12, paddingBottom: 20 },
  actionBtn: { borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...shadows.button },
  passBtn: { width: 56, height: 56 },
  superBtn: { width: 52, height: 52 },
  likeBtn: { width: 68, height: 68 },
});
