// app/(tabs)/index.tsx - DiscoverScreen 滑动匹配页面
// 遵循 UX 设计报告 4.1 节规范
import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 滑动阈值 - 屏幕宽度的 35%
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

// 用户类型定义
type User = {
  id: string;
  name: string;
  avatar: string;
  major: string;
  grade: string;
  hobbyDirection: string;
  hobbies: string[];
  bio: string;
  distance: string;
  matchPercent: number;
};

// 模拟用户数据
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: '小明',
    age: 20,
    avatar: 'https://picsum.photos/400/600?random=1',
    major: '计算机科学与技术',
    grade: '2022 级',
    hobbyDirection: '科技与创新',
    hobbies: ['音乐', '电影', '旅行'],
    bio: '喜欢探索新事物，期待遇见有趣的你～',
    distance: '0.5km',
    matchPercent: 92,
  },
  {
    id: '2',
    name: '小红',
    age: 21,
    avatar: 'https://picsum.photos/400/600?random=2',
    major: '英语文学',
    grade: '2021 级',
    hobbyDirection: '文学与艺术',
    hobbies: ['阅读', '摄影', '咖啡'],
    bio: '热爱生活，享受每一个美好瞬间。',
    distance: '1.2km',
    matchPercent: 88,
  },
  {
    id: '3',
    name: '小刚',
    age: 22,
    avatar: 'https://picsum.photos/400/600?random=3',
    major: '机械工程',
    grade: '2020 级',
    hobbyDirection: '运动与健康',
    hobbies: ['篮球', '编程', '科技'],
    bio: '对科技充满热情，期待分享有趣的创意。',
    distance: '2.0km',
    matchPercent: 85,
  },
  {
    id: '4',
    name: '小美',
    age: 19,
    avatar: 'https://picsum.photos/400/600?random=4',
    major: '艺术设计',
    grade: '2023 级',
    hobbyDirection: '创意与设计',
    hobbies: ['绘画', '瑜伽', '手工'],
    bio: '喜欢用色彩装点生活，寻找志同道合的朋友。',
    distance: '0.8km',
    matchPercent: 90,
  },
];

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { userId } = useAuth();

  // 状态管理
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);

  // 动画引用
  const swipeX = useRef(new Animated.Value(0)).current;
  const swipeY = useRef(new Animated.Value(0)).current;
  const nextCardScale = useRef(new Animated.Value(0.95)).current;
  const nextCardOpacity = useRef(new Animated.Value(1)).current;

  // 印章透明度
  const likeStampOpacity = swipeX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passStampOpacity = swipeX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 卡片旋转
  const cardRotation = swipeX.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-18deg', '0deg', '18deg'],
    extrapolate: 'clamp',
  });

  // PanResponder 滑动手势
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // 开始滑动时重置方向指示
        setSwipeDirection(null);
      },
      onPanResponderMove: Animated.event(
        [null, { dx: swipeX, dy: swipeY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy, vx } = gestureState;

        // 判断滑动方向
        if (Math.abs(dx) > Math.abs(dy)) {
          // 水平滑动
          if (dx > SWIPE_THRESHOLD) {
            // 右滑 - Like
            handleLike(vx);
          } else if (dx < -SWIPE_THRESHOLD) {
            // 左滑 - Pass
            handlePass(vx);
          } else {
            // 未达到阈值，弹回
            resetCard();
          }
        } else if (dy < -SWIPE_THRESHOLD * 0.8) {
          // 上滑 - Super Like
          handleSuperLike();
        } else {
          resetCard();
        }
      },
    })
  ).current;

  // 处理喜欢
  const handleLike = (velocity: number) => {
    // 触觉反馈 - 中等强度
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSwipeDirection('right');

    Animated.spring(swipeX, {
      toValue: SCREEN_WIDTH,
      velocity,
      useNativeDriver: true,
    }).start(() => {
      advanceToNextCard();
    });
  };

  // 处理跳过
  const handlePass = (velocity: number) => {
    // 触觉反馈 - 轻度
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSwipeDirection('left');

    Animated.spring(swipeX, {
      toValue: -SCREEN_WIDTH,
      velocity,
      useNativeDriver: true,
    }).start(() => {
      advanceToNextCard();
    });
  };

  // 处理超级喜欢
  const handleSuperLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSwipeDirection('up');
    // 上滑逻辑预留
    resetCard();
  };

  // 重置卡片位置
  const resetCard = () => {
    Animated.spring(swipeX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.spring(swipeY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    setSwipeDirection(null);
  };

  // 切换到下一张卡片
  const advanceToNextCard = () => {
    setCurrentIndex(prev => prev + 1);
    swipeX.setValue(0);
    swipeY.setValue(0);
    setSwipeDirection(null);
  };

  // 手动喜欢按钮
  const handleLikeButton = () => {
    setSwipeDirection('right');
    Animated.spring(swipeX, {
      toValue: SCREEN_WIDTH * 1.5,
      velocity: 1,
      useNativeDriver: true,
    }).start(() => {
      advanceToNextCard();
    });
  };

  // 手动跳过按钮
  const handlePassButton = () => {
    setSwipeDirection('left');
    Animated.spring(swipeX, {
      toValue: -SCREEN_WIDTH * 1.5,
      velocity: 1,
      useNativeDriver: true,
    }).start(() => {
      advanceToNextCard();
    });
  };

  // 超级喜欢按钮
  const handleSuperLikeButton = () => {
    setSwipeDirection('up');
    // 超级喜欢逻辑预留
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // 重置所有卡片
  const handleReset = () => {
    setCurrentIndex(0);
    swipeX.setValue(0);
    swipeY.setValue(0);
    setSwipeDirection(null);
  };

  // 渲染卡片
  const renderCard = (index: number, isTop: boolean) => {
    if (index >= users.length) return null;

    const user = users[index];
    const isCurrentCard = index === currentIndex;

    if (!isTop) {
      // 下一张卡片 - 缩放效果
      return (
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                { scale: nextCardScale },
              ],
              opacity: nextCardOpacity,
              backgroundColor: colors.cardBackground,
            },
          ]}
        >
          <Image
            source={{ uri: user.avatar }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </Animated.View>
      );
    }

    // 当前卡片 - 完整交互
    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [
              { translateX: swipeX },
              { translateY: swipeY },
              { rotate: cardRotation },
            ],
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        {/* LIKE 印章 */}
        <Animated.View
          style={[
            styles.stamp,
            styles.likeStamp,
            { opacity: likeStampOpacity },
          ]}
        >
          <Text style={styles.stampText}>LIKE</Text>
        </Animated.View>

        {/* PASS 印章 */}
        <Animated.View
          style={[
            styles.stamp,
            styles.passStamp,
            { opacity: passStampOpacity },
          ]}
        >
          <Text style={[styles.stampText, { color: colors.passButton }]}>PASS</Text>
        </Animated.View>

        {/* 卡片图片 */}
        <Image
          source={{ uri: user.avatar }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* 底部渐变信息区 */}
        <View style={styles.cardInfoOverlay}>
          <View style={styles.cardInfoContent}>
            {/* 姓名和年龄 */}
            <Text style={styles.cardName}>
              {user.name}, {user.age}
            </Text>

            {/* 专业和年级 */}
            <Text style={styles.cardMajor}>
              {user.major} · {user.grade}
            </Text>

            {/* 兴趣方向 */}
            <Text style={styles.cardHobbyDirection}>
              {user.hobbyDirection}
            </Text>

            {/* 兴趣标签 */}
            <View style={styles.hobbiesContainer}>
              {user.hobbies.map((hobby, i) => (
                <View
                  key={i}
                  style={[styles.hobbyTag, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                >
                  <Text style={styles.hobbyTagText}>{hobby}</Text>
                </View>
              ))}
            </View>

            {/* 个人简介 */}
            <Text style={styles.cardBio} numberOfLines={2}>
              {user.bio}
            </Text>

            {/* 页脚：距离和匹配度 */}
            <View style={styles.cardFooter}>
              <View style={styles.distanceContainer}>
                <Ionicons name="location-outline" size={14} color="#fff" />
                <Text style={styles.distanceText}>{user.distance}</Text>
              </View>
              <View style={[styles.matchBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.matchPercentText}>{user.matchPercent}% Match</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
      <View style={[styles.emptyIconWrapper, { backgroundColor: colors.tagBackground }]}>
        <Ionicons name="heart-outline" size={48} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>没有更多用户了</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        请稍后再来查看是否有新用户
      </Text>
      <Pressable
        onPress={handleReset}
        style={[styles.resetButton, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.resetButtonText}>重新开始</Text>
      </Pressable>
    </View>
  );

  const currentPartner = users[currentIndex];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* 头部 */}
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Discover</Text>
        <Pressable style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      {/* 卡片区域 */}
      <View style={styles.cardsContainer}>
        {currentIndex < users.length ? (
          <>
            {/* 下一张卡片（背景） */}
            {currentIndex + 1 < users.length && renderCard(currentIndex + 1, false)}
            {/* 当前卡片 */}
            {renderCard(currentIndex, true)}
          </>
        ) : (
          renderEmptyState()
        )}
      </View>

      {/* 动作按钮区 */}
      {currentIndex < users.length && (
        <View style={styles.actionsContainer}>
          {/* 跳过按钮 - 56px */}
          <Pressable
            onPress={handlePassButton}
            style={[
              styles.actionButton,
              styles.passButton,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Ionicons name="close" size={28} color={colors.passButton} />
          </Pressable>

          {/* 超级喜欢按钮 - 52px */}
          <Pressable
            onPress={handleSuperLikeButton}
            style={[
              styles.actionButton,
              styles.superLikeButton,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Ionicons name="star" size={24} color={colors.superLike} />
          </Pressable>

          {/* 喜欢按钮 - 68px */}
          <Pressable
            onPress={handleLikeButton}
            style={[
              styles.actionButton,
              styles.likeButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="heart" size={32} color="#fff" />
          </Pressable>
        </View>
      )}

      {/* 滑动提示 */}
      {currentIndex < users.length && (
        <View style={styles.swipeHint}>
          <Text style={[styles.swipeHintText, { color: colors.textMuted }]}>
            右滑喜欢 · 左滑跳过 · 上滑超级喜欢
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 卡片容器
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  // 卡片样式
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.55,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6B4226',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 8px 16px rgba(107,66,38,0.3)',
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  // 卡片信息遮罩
  cardInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26,14,8,0.82)',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardInfoContent: {
    gap: 8,
  },

  // 姓名
  cardName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },

  // 专业和年级
  cardMajor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C4A882',
  },

  // 兴趣方向
  cardHobbyDirection: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },

  // 兴趣标签
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hobbyTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  hobbyTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },

  // 个人简介
  cardBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },

  // 卡片页脚
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#fff',
  },
  matchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchPercentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  // 印章效果
  stamp: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 4,
    borderRadius: 12,
    zIndex: 100,
  },
  likeStamp: {
    left: 40,
    borderColor: '#22C55E',
    transform: [{ rotate: '-15deg' }],
  },
  passStamp: {
    right: 40,
    borderColor: '#EF4444',
    transform: [{ rotate: '15deg' }],
  },
  stampText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#22C55E',
  },

  // 动作按钮区
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  actionButton: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#6B4226',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 8px rgba(107,66,38,0.3)',
      },
    }),
  },
  passButton: {
    width: 56,
    height: 56,
  },
  superLikeButton: {
    width: 52,
    height: 52,
  },
  likeButton: {
    width: 68,
    height: 68,
  },

  // 滑动提示
  swipeHint: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  swipeHintText: {
    fontSize: 13,
  },

  // 空状态
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  resetButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
