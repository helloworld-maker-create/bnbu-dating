// app/about.tsx - 重定向到 modal（关于我们）
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AboutRedirect() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  useEffect(() => {
    router.replace('/modal');
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}
