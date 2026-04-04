import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Web 平台使用 emoji 替代 SF Symbols
function TabBarIcon({ name, color, size }: { name: string; color: string; size: number }) {
  if (Platform.OS === 'web') {
    const emojiMap: Record<string, string> = {
      // 首页 - 爱心
      'heart': '💕',
      // 个人中心
      'person': '👤',
      // 信息
      'info.circle': 'ℹ️',
    };
    const emoji = emojiMap[name] || '💕';
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size, lineHeight: size }}>{emoji}</span>
      </View>
    );
  }
  return <View />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '匹配',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="heart" color={color} size={28} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: '个人中心',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person" color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
