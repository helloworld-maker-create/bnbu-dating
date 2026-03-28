import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';

// !!! 请把 YOUR_IP 替换为你电脑在同一局域网下的真实 IP（手机/模拟器才能访问到）
export const API_BASE_URL = 'http://YOUR_IP:8080';

type MatchCard = {
  id: string;
  name: string;
  major: string;
  gpaLevel: string;
  hobbies: string[];
  goals: string[];
  image: string;
};

type ApiResult<T> = { code: number; message: string; data: T };

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, 420);
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.72, 620);

export default function MatchFeedScreen() {
  const swiperRef = useRef<any>(null);

  const [cards, setCards] = useState<MatchCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // 约定：后端返回 Result<List<UserProfile>>，其中 hobbies/goals 为 JSON 字符串
        const res = await fetch(`${API_BASE_URL}/api/profiles/all`);
        const json: ApiResult<any[]> = await res.json();

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        if (!json || typeof json.code !== 'number') {
          throw new Error('后端响应格式不正确');
        }
        if (json.code !== 0) {
          throw new Error(json.message || '后端返回错误');
        }

        const list = Array.isArray(json.data) ? json.data : [];
        const mapped: MatchCard[] = list
          .filter((p) => p && (p.userId ?? p.id) != null)
          .map((p) => {
            const userId = String(p.userId ?? p.id);
            return {
              id: userId,
              name: String(p.nickname || `用户 ${userId}`),
              major: String(p.major || '未填写专业'),
              gpaLevel: String(p.gpaLevel || '未填写 GPA 区间'),
              hobbies: normalizeStringArray(p.hobbies),
              goals: normalizeStringArray(p.goals),
              image: `https://picsum.photos/800/1200?random=${encodeURIComponent(userId)}`,
            };
          });

        if (!cancelled) setCards(mapped);
      } catch (e) {
        console.log('加载推荐失败', e);
        if (!cancelled) setCards([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasCards = cards.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : !hasCards ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyText}>当前没有更多推荐</Text>
          </View>
        ) : (
          <>
            <View style={styles.swiperWrap}>
              <Swiper
                ref={swiperRef}
                cards={cards}
                cardIndex={0}
                backgroundColor="transparent"
                stackSize={3}
                stackSeparation={12}
                verticalSwipe={false}
                onSwipedLeft={(index) => console.log('PASS', cards[index]?.id)}
                onSwipedRight={(index) => console.log('LIKE', cards[index]?.id)}
                onSwipedAll={() => console.log('SWIPED_ALL')}
                renderCard={(card) => <ProfileCard card={card} />}
                cardVerticalMargin={0}
                cardHorizontalMargin={0}
                containerStyle={styles.swiperContainer}
                cardStyle={styles.cardContainer}
                animateCardOpacity
                disableTopSwipe
                disableBottomSwipe
              />
            </View>

            <View style={styles.actions}>
              <CircleActionButton
                label="✖️"
                color="#FF3B30"
                onPress={() => swiperRef.current?.swipeLeft?.()}
                accessibilityLabel="Pass"
              />
              <CircleActionButton
                label="♥️"
                color="#34C759"
                onPress={() => swiperRef.current?.swipeRight?.()}
                accessibilityLabel="Like"
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function normalizeStringArray(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((x) => String(x)).filter(Boolean);
  }
  if (typeof input === 'string') {
    const s = input.trim();
    if (!s) return [];
    // 兼容后端以 JSON 字符串存储：'["吉他","健身"]'
    if (s.startsWith('[')) {
      try {
        const arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.map((x) => String(x)).filter(Boolean);
      } catch {}
    }
    // 兼容逗号分隔字符串
    return s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function ProfileCard({ card }: { card: MatchCard }) {
  if (!card) return <View style={styles.cardFallback} />;

  const tags = [card.gpaLevel, ...card.hobbies, ...card.goals].filter(Boolean);

  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: card.image }} style={styles.cardImage} imageStyle={styles.cardImageRadius}>
        <View style={styles.gradient}>
          <View style={styles.gradientLayerStrong} />
          <View style={styles.gradientLayerMid} />
          <View style={styles.gradientLayerLight} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.nameLine}>
            {card.name}
            <Text style={styles.dot}> · </Text>
            <Text style={styles.major}>{card.major}</Text>
          </Text>

          <View style={styles.badgesWrap}>
            {tags.map((t, idx) => (
              <View key={`${card.id}-${t}-${idx}`} style={styles.badge}>
                <Text style={styles.badgeText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function CircleActionButton({
  label,
  color,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  color: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: color },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.92 },
      ]}>
      <Text style={styles.actionBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B0B0F' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 18 },

  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: 'rgba(255,255,255,0.72)', fontSize: 16, fontWeight: '700' },

  swiperWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  swiperContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },

  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111218',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  cardImage: { flex: 1 },
  cardImageRadius: { borderRadius: 20 },
  cardFallback: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#111218',
  },

  gradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  gradientLayerStrong: { height: 120, backgroundColor: 'rgba(0,0,0,0.78)' },
  gradientLayerMid: { height: 90, backgroundColor: 'rgba(0,0,0,0.45)' },
  gradientLayerLight: { height: 70, backgroundColor: 'rgba(0,0,0,0.18)' },

  cardContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  nameLine: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  dot: { color: 'rgba(255,255,255,0.7)' },
  major: { color: 'rgba(255,255,255,0.92)', fontWeight: '700', fontSize: 18 },

  badgesWrap: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
        }
      : null),
  },
  badgeText: { color: 'rgba(255,255,255,0.92)', fontSize: 12, fontWeight: '700' },

  actions: {
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
    alignItems: 'center',
  },
  actionBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  actionBtnText: { fontSize: 24, color: '#fff', fontWeight: '900' },
});
