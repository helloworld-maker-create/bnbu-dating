// app/(tabs)/nearby.tsx - Nearby 附近的人
// Campus Connect 设计风格: Header + Map Placeholder + User List

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { Avatar } from '@/components/CampusComponents';

// 模拟数据
const nearbyUsers = [
  {
    id: '1',
    name: '李雨晴',
    major: '心理学',
    school: 'BNBU',
    distance: '0.5 km',
    avatar: 'https://i.pravatar.cc/100?u=nearby1',
  },
  {
    id: '2',
    name: '王浩然',
    major: '工商管理',
    school: 'BNBU',
    distance: '0.8 km',
    avatar: 'https://i.pravatar.cc/100?u=nearby2',
  },
  {
    id: '3',
    name: '张思琪',
    major: '设计',
    school: 'BNBU',
    distance: '1.2 km',
    avatar: 'https://i.pravatar.cc/100?u=nearby3',
  },
  {
    id: '4',
    name: '陈宇',
    major: '工程',
    school: 'BNBU',
    distance: '2.0 km',
    avatar: 'https://i.pravatar.cc/100?u=nearby4',
  },
];

const mapMarkers = [
  { id: 'm1', avatar: 'https://i.pravatar.cc/60?u=nearby1', x: 80, y: 100 },
  { id: 'm2', avatar: 'https://i.pravatar.cc/60?u=nearby2', x: 200, y: 140 },
  { id: 'm3', avatar: 'https://i.pravatar.cc/60?u=nearby3', x: 260, y: 80 },
];

export default function NearbyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontFamily: typography.serif }]}>附近</Text>
          <View style={[styles.campusBadge, { backgroundColor: colors.cream }]}>
            <Ionicons name="location" size={12} color={colors.primary} />
            <Text style={[styles.campusBadgeText, { color: colors.primary }]}>在校</Text>
          </View>
        </View>

        {/* Map Section */}
        <View style={[styles.mapContainer, shadows.card]}>
          <View style={[styles.mapPlaceholder, { backgroundColor: colors.cream }]}>
            {/* Gradient circles simulating map radar */}
            <View style={[styles.mapCircle, { backgroundColor: colors.primary + '15' }]} />
            <View style={[styles.mapCircleSmall, { backgroundColor: colors.primary + '10' }]} />
            {/* Markers */}
            {mapMarkers.map((marker) => (
              <View
                key={marker.id}
                style={[
                  styles.marker,
                  {
                    left: marker.x,
                    top: marker.y,
                  },
                ]}
              >
                <Avatar uri={marker.avatar} size={42} borderWidth={2.5} borderColor={colors.white || '#FFFFFF'} />
              </View>
            ))}
          </View>
        </View>

        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>附近的同学</Text>
          <Text style={[styles.listCount, { color: colors.textSecondary }]}>
            找到 {nearbyUsers.length} 人
          </Text>
        </View>

        {/* User List */}
        <View style={styles.userList}>
          {nearbyUsers.map((user) => (
            <Pressable
              key={user.id}
              style={[styles.userCard, { backgroundColor: colors.card }, shadows.sm]}
            >
              <Avatar uri={user.avatar} size={48} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                <Text style={[styles.userMajor, { color: colors.textSecondary }]}>
                  {user.major} · {user.school}
                </Text>
              </View>
              <View style={[styles.distanceBadge, { backgroundColor: colors.cream }]}>
                <Ionicons name="walk" size={12} color={colors.primary} />
                <Text style={[styles.distanceText, { color: colors.primary }]}>{user.distance}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
  },
  campusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  campusBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  mapContainer: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 240,
    position: 'relative',
  },
  mapCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: 30,
    left: 70,
  },
  mapCircleSmall: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 70,
    left: 130,
  },
  marker: {
    position: 'absolute',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 10,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
  },
  listCount: {
    fontSize: 11,
    fontWeight: typography.weights.regular,
  },
  userList: {
    paddingHorizontal: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: 2,
  },
  userMajor: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
});
