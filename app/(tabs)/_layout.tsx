// app/(tabs)/_layout.tsx - Tab 导航布局（四 Tab 方案）
// 遵循 UX 设计报告 - 咖啡/奶油暖色调系
import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Tab 图标组件
function TabBarIcon({ name, color, size }: { name: string; color: string; size: number }) {
  return (
    <Ionicons name={name as any} size={size} color={color} />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: Platform.select({
          web: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 10,
            paddingTop: 8,
          } as any,
          default: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 83,
            paddingBottom: 33,
            paddingTop: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
          color: colors.text,
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
      }}>
      {/* Tab 1: Discover - 滑动匹配 */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} size={28} />
          ),
          headerShown: false,
        }}
      />
      {/* Tab 2: Messages - 消息列表 */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} size={28} />
          ),
          headerShown: false,
        }}
      />
      {/* Tab 3: Matches - 匹配列表 */}
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} size={28} />
          ),
          headerShown: false,
        }}
      />
      {/* Tab 4: Profile - 个人中心 */}
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
