// Campus Connect 可复�?UI 组件�?// 基于设计系统规范实现

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  Switch,
  Platform,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { spacing, borderRadius, typography, shadows, animation } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// ========== 按钮组件 (Buttons) ==========

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'lg',
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const heightMap = { sm: 40, md: 46, lg: 50, xl: 54 } as const;
  const fontSizeMap = { sm: 13, md: 13, lg: 15, xl: 15 } as const;
  const btnHeight = heightMap[size];
  const txtSize = fontSizeMap[size];

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      height: btnHeight,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    };

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: colors.primary,
        ...shadows.button,
      };
    }
    if (variant === 'secondary') {
      return {
        ...base,
        borderWidth: 1.5,
        borderColor: colors.primary,
        backgroundColor: 'transparent',
      };
    }
    return { ...base, backgroundColor: 'transparent' };
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: txtSize,
      fontWeight: typography.weights.semibold,
      letterSpacing: 0.3,
    };

    if (variant === 'primary') {
      return { ...base, color: colors.white };
    }
    return { ...base, color: colors.primary };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[getButtonStyle(), style]}
      activeOpacity={0.95}
      disabled={disabled}
    >
      {typeof children === 'string' ? (
        <Text style={[getTextStyle(), textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// ========== 图标按钮 (Icon Button) ==========

interface IconButtonProps {
  onPress?: () => void;
  icon: string;
  size?: number;
  style?: ViewStyle;
}

export function IconButton({ onPress, icon, size = 18, style }: IconButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.cream,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Ionicons name={icon as any} size={size} color={colors.primary} />
    </TouchableOpacity>
  );
}

// ========== 筛选芯�?(Filter Chip) ==========

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Chip({ label, active = false, onPress, style }: ChipProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          paddingVertical: 6,
          paddingHorizontal: 14,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: active ? colors.primary : colors.border,
          backgroundColor: active ? colors.primary : colors.card,
          alignSelf: 'center',
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: typography.weights.medium,
          color: active ? colors.white : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ========== 头像组件 (Avatar) ==========

interface AvatarProps {
  uri?: string;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  style?: ViewStyle;
}

export function Avatar({ uri, size = 52, borderWidth = 0, borderColor, style }: AvatarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const ringColor = borderColor || colors.avatarBorder;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          borderWidth,
          borderColor: ringColor,
        },
        shadows.sm,
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.cream }} />
      )}
    </View>
  );
}

// ========== 进度�?(Progress Bar) ==========

interface ProgressBarProps {
  value: number; // 0-100
  style?: ViewStyle;
}

export function ProgressBar({ value, style }: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        {
          height: 8,
          backgroundColor: colors.progressBg,
          borderRadius: 4,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: '100%',
          backgroundColor: colors.progressFill,
          borderRadius: 4,
        }}
      />
    </View>
  );
}

// ========== 开关组�?(Toggle Switch) ==========

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: string;
  label: string;
  description?: string;
  style?: ViewStyle;
}

export function Toggle({ value, onValueChange, icon, label, description, style }: ToggleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 14,
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
        },
        style,
      ]}
    >
      {icon && (
        <View style={{ width: 28, alignItems: 'center' }}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: typography.weights.semibold,
            color: colors.text,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={{
              fontSize: 11,
              color: colors.textSecondary,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
}

// ========== 设置�?(Settings Row) ==========

interface SettingsRowProps {
  icon: string;
  label: string;
  description?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SettingsRow({ icon, label, description, onPress, style }: SettingsRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const content = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 14,
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
        },
        style,
      ]}
    >
      <View style={{ width: 28, alignItems: 'center' }}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: typography.weights.semibold,
            color: colors.text,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={{
              fontSize: 11,
              color: colors.textSecondary,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.border} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// ========== 信息�?(Info Row) ==========

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  style?: ViewStyle;
}

export function InfoRow({ icon, label, value, style }: InfoRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 12,
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: colors.cream,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon as any} size={16} color={colors.primary} />
      </View>
      <View>
        <Text
          style={{
            fontSize: 11,
            color: colors.textSecondary,
            marginBottom: 2,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: typography.weights.semibold,
            color: colors.text,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// ========== 标签组件 (Tag) ==========

interface TagProps {
  label: string;
  style?: ViewStyle;
}

export function Tag({ label, style }: TagProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        {
          paddingVertical: 7,
          paddingHorizontal: 14,
          backgroundColor: colors.cream,
          borderRadius: 20,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: typography.weights.medium,
          color: colors.primaryDark,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ========== 未读徽章 (Badge) ==========

interface BadgeProps {
  count: number;
  style?: ViewStyle;
}

export function Badge({ count, style }: BadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  if (count <= 0) return null;

  return (
    <View
      style={[
        {
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 10,
          fontWeight: typography.weights.bold,
          color: colors.white,
        }}
      >
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

// ========== 区块标题 (Section Header) ==========

interface SectionHeaderProps {
  title: string;
  style?: TextStyle;
}

export function SectionHeader({ title, style }: SectionHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Text
      style={[
        {
          fontSize: 11,
          fontWeight: typography.weights.bold,
          color: colors.secondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: spacing.sm,
        },
        style,
      ]}
    >
      {title}
    </Text>
  );
}
