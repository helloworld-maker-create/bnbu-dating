// Professional Warmth 设计系统常量
// 基于 Ivy League 学术厚重感 + 现代友好社交交互
// 衬线体标题 (Playfair Display) + 无衬线体正文 (Inter/SF Pro)

import { Platform } from 'react-native';

// ========== 间距系统 (8px 网格) ==========
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  page: 48,
  section: 64,
} as const;

// ========== 页面布局 ==========
export const Layout = {
  // 安全区域 (iPhone 15 Pro)
  safeAreaTop: 47,
  safeAreaBottom: 34,

  // 页面边距
  pageHorizontal: 20,
  pageVertical: 16,

  // 导航栏
  navBarHeight: 44,
  navBarTotalHeight: 91, // 含状态栏

  // 标签栏
  tabBarHeight: 50,
  tabBarTotalHeight: 83, // 含安全区域

  // 按钮
  buttonHeight: 50,
  buttonMinWidth: 120,

  // 输入框
  inputHeight: 50,

  // 列表项
  listItemHeight: 60,
  listItemMinHeight: 44,
} as const;

// ========== 圆角系统 (16px~24px 大圆角 - 友好现代视觉) ==========
export const CornerRadius = {
  xsmall: 8,            // 微小圆角
  small: 12,            // 小圆角 (标签、小按钮)
  medium: 16,           // 标准圆角 (卡片、按钮)
  large: 20,            // 大圆角 (主要卡片)
  xlarge: 24,           // 超大圆角 (强调卡片)
  xxlarge: 32,          // 极端圆角
  pill: 9999,           // 胶囊形态
} as const;

// ========== 阴影系统 (Material Design 3 柔和弥散阴影) ==========
export const Shadow = {
  // Level 1 - 轻微浮起 (卡片浮于背景)
  s1: {
    shadowColor: '#1A120B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Level 2 - 标准卡片 (常规卡片阴影)
  s2: {
    shadowColor: '#1A120B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },

  // Level 3 - 悬浮元素 (按钮、悬浮操作)
  s3: {
    shadowColor: '#1A120B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },

  // Level 4 - 模态/弹窗 (最高层级)
  s4: {
    shadowColor: '#1A120B',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 48,
    elevation: 16,
  },
} as const;

// ========== 字体系统 (衬线体标题 + 无衬线体正文) ==========
// Heading: Playfair Display / Merriweather (衬线体 - 学术典雅)
// Body: Inter / SF Pro Text (无衬线体 - 现代可读性)
export const Typography = {
  // 字体族
  fontFamily: {
    heading: Platform.select({
      ios: 'Playfair Display',
      android: 'Playfair Display',
      default: 'Playfair Display',
    }),
    body: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'Inter',
    }),
    bodyMono: Platform.select({
      ios: 'SF Mono',
      android: 'monospace',
      default: 'monospace',
    }),
  },

  // 字号 - H1 → H2 → Body → Caption → Tag 严格阶梯
  fontSize: {
    // 说明文本 (Caption)
    xs: 11,   // Caption 2 - 微小标签
    sm: 13,   // Caption 1 / Footnote - 图片说明
    base: 15, // Subheadline / Callout - 辅助文本

    // 正文字体 (Body)
    lg: 17,   // Body - 主要文本

    // 标题字体 (Title)
    xl: 20,   // Headline - 次级标题
    '2xl': 22, // Title 3 - 次要标题
    '3xl': 28, // Title 2 - 主要内容标题

    // 页面标题 (Large Title)
    '4xl': 34, // Title 1 - 页面级标题
    '5xl': 42, // Display - 展示级标题 (Splash/Onboarding)
  },

  // 字重
  fontWeight: {
    light: '300',       // 轻度强调
    regular: '400',     // 正文标准
    medium: '500',      // 中等强调
    semibold: '600',    // 标题 / 按钮
    bold: '700',        // 大标题
    extrabold: '800',   // 特殊强调
    black: '900',       // 极端强调
  },

  // 行高 - 字号的 1.4~1.6 倍 (可读性最优)
  lineHeight: {
    xs: 14,      // 1.27x - 微小文本
    sm: 18,      // 1.38x - 说明文本
    base: 22,    // 1.47x - 辅助文本
    lg: 24,      // 1.41x - 正文
    xl: 26,      // 1.30x - 次级标题
    '2xl': 30,   // 1.36x - 次要标题
    '3xl': 36,   // 1.29x - 主要内容标题
    '4xl': 44,   // 1.29x - 页面级标题
    '5xl': 52,   // 1.24x - 展示级标题
  },

  // 字间距
  letterSpacing: {
    xs: 0.05,    // 微小文本放宽
    sm: 0.02,    // 说明文本
    base: 0,     // 正文标准
    lg: -0.1,    // 正文收紧
    xl: -0.15,   // 标题收紧
    '2xl': -0.2, // 大标题
    '3xl': -0.25,// 主要内容标题
    '4xl': -0.3, // 页面级标题
    '5xl': -0.35,// 展示级标题
  },
} as const;

// ========== 文本样式预设 ==========
// 衬线体标题 + 无衬线体正文 · 符合 8pt Grid 系统
export const TextStyle = {
  // ========== 标题样式 (衬线体 - Playfair Display) ==========

  // Display - 展示级标题 (Splash/Onboarding)
  display: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight['5xl'],
    letterSpacing: Typography.letterSpacing['5xl'],
    fontFamily: 'Playfair Display',
  },

  // H1 - 页面级标题
  h1: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight['4xl'],
    letterSpacing: Typography.letterSpacing['4xl'],
    fontFamily: 'Playfair Display',
  },

  // H2 - 主要内容标题
  h2: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight['3xl'],
    letterSpacing: Typography.letterSpacing['3xl'],
    fontFamily: 'Playfair Display',
  },

  // H3 - 次要标题
  h3: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight['2xl'],
    letterSpacing: Typography.letterSpacing['2xl'],
    fontFamily: 'Playfair Display',
  },

  // H4 - 次级标题
  h4: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.xl,
    letterSpacing: Typography.letterSpacing.xl,
    fontFamily: 'Playfair Display',
  },

  // ========== 正文样式 (无衬线体 - Inter/SF Pro) ==========

  // 正文 - Body
  body: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.lg,
    letterSpacing: Typography.letterSpacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 正文强调
  bodyEmphasis: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.lg,
    letterSpacing: Typography.letterSpacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 辅助文本 - Footnote
  footnote: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.base,
    letterSpacing: Typography.letterSpacing.base,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 标注文本 - Callout
  callout: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.base,
    letterSpacing: Typography.letterSpacing.base,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 小标题 - Subheadline
  subheadline: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.sm,
    letterSpacing: Typography.letterSpacing.sm,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 说明文本 - Caption
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.xs,
    letterSpacing: Typography.letterSpacing.xs,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // ========== 交互元素 ==========

  // 按钮文本
  button: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.lg,
    letterSpacing: Typography.letterSpacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 小按钮文本
  buttonSmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.sm,
    letterSpacing: Typography.letterSpacing.sm,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 标签/Chip
  chip: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.sm,
    letterSpacing: 0.2, // 标签文本微放宽
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },

  // 链接文本
  link: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.base,
    letterSpacing: Typography.letterSpacing.base,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    textDecorationLine: 'underline',
  },
} as const;

// ========== 动效系统 ==========
// 基于苹果 200-400ms 黄金时长标准
export const Animation = {
  // 时长 (ms) - 符合 iOS 18 规范
  duration: {
    // 快速反馈 (150-200ms) - 按钮点击、状态切换
    instant: 100,
    quick: 180,

    // 标准交互 (200-300ms) - 微交互、快速转场
    standard: 250,
    smooth: 300,

    // 复杂动效 (300-400ms) - 页面转场、模态弹窗、卡片操作
    leisure: 400,
    modal: 450, // iPad 适配 +30%
  },

  // 曲线 - 使用更精确的 spring 物理参数
  easing: {
    easeOut: [0.25, 0.1, 0.25, 1.0],
    easeIn: [0.42, 0, 1.0, 1.0],
    ease: [0.42, 0, 0.58, 1.0],
    // 弹簧曲线 (阻尼 0.7, 初始速度 0.7)
    spring: [0.33, 1.0, 0.68, 1.0],
  },

  // 弹簧配置 - 基于 iOS 物理引擎最优参数
  spring: {
    // 标准弹簧 (推荐用于卡片滑动、按钮反馈)
    standard: {
      damping: 0.7,      // 阻尼系数 - 控制弹性衰减
      stiffness: 200,    // 刚度 - 控制动画速度
      mass: 0.5,         // 质量 - 控制惯性
      initialVelocity: 0.7, // 初始速度
    },

    // 柔和弹簧 (用于模态弹窗、菜单展开)
    gentle: {
      damping: 0.8,
      stiffness: 150,
      mass: 0.5,
      initialVelocity: 0.5,
    },

    // 弹性弹簧 (用于匹配成功等庆祝动效)
    bouncy: {
      damping: 0.6,
      stiffness: 250,
      mass: 0.4,
      initialVelocity: 0.8,
    },
  },
} as const;

// ========== 图标系统 (Ionicons) ==========
export const Icon = {
  // 尺寸
  size: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 30,
    xxlarge: 48,
  },

  // 线宽
  strokeWidth: {
    thin: 1.0,
    medium: 1.5,
    bold: 2.0,
  },
} as const;

// ========== Ionicons 图标映射 ==========
export const Icons = {
  // Tab 栏
  tab: {
    discover: 'heart',
    discoverFilled: 'heart',
    messages: 'chatbubble-ellipses-outline',
    messagesFilled: 'chatbubble-ellipses',
    matches: 'star-outline',
    matchesFilled: 'star',
    profile: 'person-circle-outline',
    profileFilled: 'person-circle',
  },

  // 导航
  nav: {
    back: 'chevron-back',
    close: 'close',
    forward: 'chevron-forward',
    menu: 'menu',
  },

  // 操作
  action: {
    edit: 'create-outline',
    editFilled: 'create',
    delete: 'trash-outline',
    deleteFilled: 'trash',
    settings: 'settings-outline',
    settingsFilled: 'settings',
    info: 'information-circle-outline',
    infoFilled: 'information-circle',
    check: 'checkmark',
    checkCircle: 'checkmark-circle-outline',
    add: 'add',
    search: 'search-outline',
    searchFilled: 'search',
    filter: 'filter-outline',
    filterFilled: 'filter',
    refresh: 'refresh-outline',
    share: 'share-outline',
    download: 'download-outline',
  },

  // 社交/约会
  social: {
    like: 'heart-outline',
    likeFilled: 'heart',
    pass: 'close-circle-outline',
    passFilled: 'close-circle',
    superLike: 'star-outline',
    superLikeFilled: 'star',
    chat: 'chatbubble-outline',
    chatFilled: 'chatbubble',
    video: 'videocam-outline',
    videoFilled: 'videocam',
    phone: 'call-outline',
    phoneFilled: 'call',
    send: 'send-outline',
    sendFilled: 'send',
    bookmark: 'bookmark-outline',
    bookmarkFilled: 'bookmark',
    flag: 'flag-outline',
    flagFilled: 'flag',
  },

  // 状态
  status: {
    location: 'location-outline',
    locationFilled: 'location',
    verified: 'shield-checkmark-outline',
    verifiedFilled: 'shield-checkmark',
    online: 'ellipse',
    offline: 'ellipse-outline',
    eye: 'eye-outline',
    eyeOff: 'eye-off-outline',
  },

  // 表单/资料
  form: {
    email: 'mail-outline',
    password: 'lock-closed-outline',
    passwordOpen: 'lock-open-outline',
    user: 'person-outline',
    person: 'person-outline',
    personAdd: 'person-add-outline',
    camera: 'camera-outline',
    image: 'image-outline',
    calendar: 'calendar-outline',
    school: 'school-outline',
    work: 'briefcase-outline',
    home: 'home-outline',
  },

  // 情感/匹配
  emotion: {
    heart: 'heart-outline',
    heartFilled: 'heart',
    heartBroken: 'heart-dislike-outline',
    sparkles: 'sparkles-outline',
    celebration: 'celebrate-outline',
  },
} as const;

// ========== 无障碍设计 ==========
export const Accessibility = {
  // 最小触摸区域
  minTouchSize: 44,

  // 推荐触摸区域
  touchTarget: {
    button: { width: 120, height: 50 },
    icon: { width: 44, height: 44 },
    listItem: { width: '100%', height: 60 },
  },

  // 对比度要求 (WCAG 2.1 AA)
  contrastRatio: {
    normalText: 4.5,
    largeText: 3.0,
    uiComponent: 3.0,
  },
} as const;

// ========== 毛玻璃效果 ==========
export const Glass = {
  // 模糊强度
  backdropBlur: 24,

  // 透明度层级
  opacity: {
    ultraThin: 0.55,
    thin: 0.65,
    regular: 0.75,
    thick: 0.85,
  },
} as const;

// ========== Z-Index 层级 ==========
export const ZIndex = {
  background: 0,
  content: 1,
  floating: 2,
  tabBar: 3,
  navBar: 4,
  modal: 5,
  overlay: 6,
  toast: 7,
  drag: 8,
} as const;

// ========== 断点 ==========
export const Breakpoints = {
  // iOS 设备宽度
  phone: 375,
  phoneMax: 430,
  tablet: 768,
  desktop: 1024,
} as const;
