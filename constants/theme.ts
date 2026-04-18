// Campus Connect 设计系统 - 主题配置
// 基于 8pt Grid System + 统一圆角/阴影规范

import { Platform } from 'react-native';

// ========== 间距系统 (8pt Grid) ==========
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ========== 圆角规范 (Border Radius) ==========
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// ========== 阴影规范 (Elevation) ==========
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  card: Platform.select({
    ios: {
      shadowColor: '#6B4226',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.13,
      shadowRadius: 16,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#6B4226',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ========== 字体规范 (Typography) ==========
export const typography = {
  // 标题字体 (Serif - 模拟 Playfair Display)
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  // 正文字体 (Sans-serif - 模拟 Inter)
  sans: Platform.select({
    ios: undefined, // 系统默认
    android: 'sans-serif',
    default: undefined,
  }),
  // 字号阶梯
  sizes: {
    xs: 10,
    sm: 11,
    md: 13,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    title: 30,
    hero: 48,
  },
  // 字重
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// ========== 布局规范 (Layout) ==========
export const layout = {
  // 屏幕宽度
  screenWidth: 390,
  // 安全区域
  safeAreaPadding: spacing.lg,
  // 卡片高度
  cardHeight: 480,
  // 头像尺寸
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 52,
  avatarXl: 58,
  // 按钮高度
  buttonSm: 40,
  buttonMd: 46,
  buttonLg: 50,
  buttonXl: 54,
  // Tab Bar
  tabBarHeight: Platform.select({
    ios: 83,
    android: 60,
    default: 60,
  }),
} as const;

// ========== 动画时长 (Animation) ==========
export const animation = {
  fast: 150,
  normal: 200,
  slow: 300,
  spring: { tension: 40, friction: 7 },
} as const;
