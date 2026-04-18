# Dating in BNBU - Apple HIG 设计规范

> **设计版本：** 2.0 (Apple HIG Compliance)
> **最后更新：** 2026 年 4 月 4 日
> **设计语言：** Apple Liquid Glass · SF Pro · SF Symbols

---

## 一、设计原则

### 1.1 核心哲学
- **极致简约** - 克制不张扬，以内容为核心
- **高级静谧** - 营造专业、宁静、高级的氛围感
- **原生体验** - 严格遵循 Apple 人机界面指南
- **无障碍优先** - 所有对比度符合 WCAG 2.1 AA 标准

### 1.2 Apple HIG 三大支柱
| 支柱 | 实现方式 |
|------|----------|
| **深度** | 液态玻璃材质、软阴影、层级分明 |
| **清晰** | SF Pro 字体、8px 网格、充足留白 |
| **顺滑** | 非线性动画、300ms 内过渡、语义化动效 |

---

## 二、颜色系统

### 2.1 品牌色彩（咖啡·奶油暖色调）

```typescript
// 主品牌色 - 深度咖啡棕
Primary: {
  light: '#5A3A22',        // 调整后的深咖啡色（符合 AA 对比度）
  dark: '#C9A982',         // 浅拿铁色
}

// 辅助色 - 温暖奶油色
Secondary: {
  light: '#B8956A',        // 焦糖色
  dark: '#D4B896',         // 浅奶油金
}

// 强调色 - 浓缩咖啡
Accent: {
  light: '#2C1810',        // 极深棕色
  dark: '#E8D5C0',         // 象牙白
}
```

### 2.2 背景系统

```typescript
// 浅色模式 - 奶油基底
Background: {
  primary: '#FAF8F5',      // 极浅米白（主背景）
  secondary: '#FFFFFF',    // 纯白（卡片）
  tertiary: '#F2EEE9',     // 浅米色（分组背景）
}

// 深色模式 - 深棕基底
Background: {
  primary: '#0D0D0D',      // 深空黑
  secondary: '#1C1814',    // 深棕灰（卡片）
  tertiary: '#25201A',     // 暖深灰（分组背景）
}
```

### 2.3 语义色彩

```typescript
// 功能色
Success: '#34C759',        // Apple 原生绿
Warning: '#FF9500',        // Apple 原生橙
Error:   '#FF3B30',        // Apple 原生红
Info:    '#007AFF',        // Apple 原生蓝

// 匹配度
Match High:   '#34C759',   // 90-100%
Match Medium: '#FF9500',   // 70-89%
Match Low:    '#FF6B6B',   // 50-69%
```

### 2.4 材质与玻璃效果

```typescript
// Liquid Glass 液态玻璃
Glass: {
  ultraThin: 'rgba(255,255,255,0.55)',   // 极薄玻璃
  thin:      'rgba(255,255,255,0.65)',   // 薄玻璃
  regular:   'rgba(255,255,255,0.75)',   // 标准玻璃
  thick:     'rgba(255,255,255,0.85)',   // 厚玻璃
}

// 深色模式玻璃
GlassDark: {
  ultraThin: 'rgba(28,24,20,0.55)',
  thin:      'rgba(28,24,20,0.65)',
  regular:   'rgba(28,24,20,0.75)',
  thick:     'rgba(28,24,20,0.85)',
}

// 毛玻璃模糊
BackdropBlur: {
  light: '20px',
  dark:  '24px',
}

// 玻璃边框
GlassBorder: {
  light: 'rgba(255,255,255,0.4)',
  dark:  'rgba(255,255,255,0.12)',
}
```

---

## 三、字体排印

### 3.1 SF Pro 字体层级

| 用途 | 字号 | 字重 | 行高 | 字间距 |
|------|------|------|------|--------|
| 超大标题 | 34pt | Bold | 41pt | 0.37px |
| 大标题 | 28pt | Bold | 34pt | 0.36px |
| 标题 1 | 22pt | Semibold | 28pt | 0.35px |
| 标题 2 | 17pt | Semibold | 22pt | 0.32px |
| 标题 3 | 15pt | Semibold | 20pt | 0.30px |
| 大标题 | 17pt | Regular | 22pt | -0.16px |
| 正文 | 17pt | Regular | 22pt | -0.16px |
| 辅助文本 | 15pt | Regular | 20pt | -0.16px |
| 小按钮 | 13pt | Medium | 16pt | -0.08px |
| 极小文本 | 11pt | Regular | 13pt | -0.06px |

### 3.2 文本颜色对比度

```typescript
// 浅色模式文本
Text: {
  primary:   'rgba(28,25,23,1.0)',   // #1C1917 - 对比度 16.1:1
  secondary: 'rgba(28,25,23,0.7)',   // 对比度 7.8:1
  tertiary:  'rgba(28,25,23,0.5)',   // 对比度 4.5:1 (AA 及格)
  disabled:  'rgba(28,25,23,0.3)',   // 禁用状态
}

// 深色模式文本
TextDark: {
  primary:   'rgba(250,248,245,1.0)', // #FAF8F5 - 对比度 18.2:1
  secondary: 'rgba(250,248,245,0.7)', // 对比度 8.5:1
  tertiary:  'rgba(250,248,245,0.5)', // 对比度 5.1:1 (AA 及格)
  disabled:  'rgba(250,248,245,0.3)', // 禁用状态
}
```

### 3.3 字体应用示例

```typescript
// 页面标题
title: {
  fontFamily: 'SF Pro Display',
  fontSize: 34,
  fontWeight: '700',
  letterSpacing: 0.37,
  lineHeight: 41,
}

// 卡片标题
cardTitle: {
  fontFamily: 'SF Pro Text',
  fontSize: 22,
  fontWeight: '600',
  letterSpacing: 0.35,
  lineHeight: 28,
}

// 正文
body: {
  fontFamily: 'SF Pro Text',
  fontSize: 17,
  fontWeight: '400',
  letterSpacing: -0.16,
  lineHeight: 22,
}

// 按钮
button: {
  fontFamily: 'SF Pro Text',
  fontSize: 17,
  fontWeight: '600',
  letterSpacing: -0.16,
}
```

---

## 四、间距与布局

### 4.1 8px 网格系统

```
基础单位：8px

间距等级：
4px   - 极紧凑（图标与文本）
8px   - 紧凑（相关元素）
12px  - 标准紧凑
16px  - 标准间距
20px  - 宽松间距
24px  - 标准宽松
32px  - 大间距
40px  - 超大间距
48px  - 分组间距
64px  - 区域分隔
80px  - 大区域
```

### 4.2 页面边距

```typescript
// 安全区域
SafeArea: {
  top:    47px,     // 状态栏 + 导航栏 (iPhone 15 Pro)
  bottom: 34px,     // Home Indicator
  side:   20px,     // 页面侧边距
}

// 内容边距
PagePadding: {
  horizontal: 20px,
  vertical:   16px,
}

// 卡片内边距
CardPadding: {
  standard: 16px,
  compact:  12px,
  generous: 20px,
}
```

### 4.3 组件间距

```typescript
// 列表项
ListItem: {
  height:      60px,
  paddingH:    20px,
  iconSize:    30px,
  iconMargin:  16px,
}

// 按钮
Button: {
  height:       50px,
  cornerRadius: 16px,
  paddingH:     24px,
}

// 输入框
Input: {
  height:       50px,
  cornerRadius: 12px,
  paddingH:     16px,
}
```

---

## 五、圆角与边框

### 5.1 圆角系统

```typescript
// 标准圆角
CornerRadius: {
  xsmall:  6px,    // 小标签、徽章
  small:   10px,   // 小型按钮
  medium:  12px,   // 输入框、卡片
  large:   16px,   // 按钮、大卡片
  xlarge:  20px,   // 模态卡片
  xxlarge: 28px,   // 底部动作表
}

// 完全圆角（高度的一半）
Pill: '9999px',
```

### 5.2 边框规范

```typescript
// 边框宽度
BorderWidth: {
  hairline: 0.5,    // 细分隔线
  standard: 1,      // 标准边框
  emphasis: 2,      // 强调边框
}

// 边框颜色
BorderColor: {
  light: 'rgba(0,0,0,0.12)',
  dark:  'rgba(255,255,255,0.12)',
  
  // 分隔线
  separator: {
    light: 'rgba(60,60,67,0.16)',
    dark:  'rgba(235,235,245,0.16)',
  }
}
```

---

## 六、阴影与深度

### 6.1 软阴影系统

```typescript
// 层级阴影（浅色模式）
Shadow: {
  // Level 1 - 轻微浮起
  s1: {
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Level 2 - 标准卡片
  s2: {
    shadowColor: 'rgba(0,0,0,0.10)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Level 3 - 悬浮元素
  s3: {
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  
  // Level 4 - 模态/弹窗
  s4: {
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 48,
    elevation: 16,
  },
}
```

### 6.2 深度层级

```
Z-Index 层级:
0   - 背景层
1   - 内容层
2   - 浮动层
3   - 标签栏
4   - 导航栏
5   - 模态层
6   - 弹窗层
7   - 吐司/提示
8   - 拖拽层
```

---

## 七、图标系统

### 7.1 SF Symbols 使用规范

```typescript
// 图标尺寸
IconSize: {
  small:  16x16,   // 行内图标
  medium: 20x20,   // 按钮图标
  large:  24x24,   // 导航栏图标
  xlarge: 30x30,   // 列表图标
  xxlarge: 48x48,  // 空状态图标
}

// 图标线宽
IconStroke: {
  thin:   1.0px,   // 未选中状态
  medium: 1.5px,   // 标准状态
  bold:   2.0px,   // 选中/强调状态
}
```

### 7.2 核心图标映射

```typescript
// Tab 栏图标
TabBarIcons: {
  discover:  'heart.fill',      // 匹配
  messages:  'message.fill',    // 消息
  matches:   'star.fill',       // 匹配列表
  profile:   'person.circle',   // 个人
}

// 操作图标
ActionIcons: {
  back:      'chevron.left',
  close:     'xmark',
  edit:      'pencil',
  delete:    'trash',
  settings:  'gear',
  info:      'info.circle',
  check:     'checkmark',
  add:       'plus',
}

// 社交图标
SocialIcons: {
  like:      'heart',
  pass:      'xmark.circle',
  superLike: 'star.burst',
  chat:      'bubble.right',
  video:     'video',
  phone:     'phone',
}
```

---

## 八、动效规范

### 8.1 动画曲线

```typescript
// 标准曲线
AnimationCurve: {
  // 入场动画 - 快速进入，缓慢停止
  easeOut: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  
  // 退场动画 - 缓慢开始，快速离开
  easeIn:  'cubic-bezier(0.42, 0, 1.0, 1.0)',
  
  // 标准过渡 - 自然顺滑
  ease:    'cubic-bezier(0.42, 0, 0.58, 1.0)',
  
  // iOS 原生弹簧
  spring:  {
    damping: 0.8,
    stiffness: 300,
  }
}
```

### 8.2 动画时长

```typescript
// 微交互时长
Duration: {
  instant:   100,   // 点击反馈
  quick:     150,   // 小型状态变化
  standard:  250,   // 标准过渡
  smooth:    350,   // 顺滑过渡
  leisure:   500,   // 大型动效
}

// 页面转场
PageTransition: {
  push:      350,   // 推入
  pop:       350,   // 弹出
  modal:     400,   // 模态呈现
}
```

### 8.3 核心微交互

```typescript
// 按钮点击
ButtonPress: {
  scaleDown: 0.95,
  duration:  100,
  onRelease: {
    scaleUp: 1.0,
    duration: 150,
  }
}

// 卡片滑动
CardSwipe: {
  threshold: 120,     // 滑动阈值 (px)
  spring:    400,     // 弹簧动画时长
  rotation:  12,      // 最大旋转角度
}

// 列表项
ListItemSwipe: {
  reveal:    80,      // 显示操作按钮距离
  snapBack:  250,     // 回弹时长
}
```

---

## 九、组件规范

### 9.1 按钮组件

```typescript
// 主按钮（Primary）
PrimaryButton: {
  height: 50,
  cornerRadius: 16,
  backgroundColor: primary,
  textColor: '#FFFFFF',
  fontSize: 17,
  fontWeight: '600',
  shadow: Shadow.s2,
  
  states: {
    normal:   { opacity: 1.0 },
    hovered:  { opacity: 0.9 },
    pressed:  { opacity: 0.75, scale: 0.97 },
    disabled: { opacity: 0.4 },
  }
}

// 次要按钮（Secondary）
SecondaryButton: {
  height: 50,
  cornerRadius: 16,
  borderWidth: 1.5,
  borderColor: primary,
  backgroundColor: 'transparent',
  textColor: primary,
  fontSize: 17,
  fontWeight: '600',
  
  states: {
    normal:   { opacity: 1.0 },
    pressed:  { opacity: 0.7, scale: 0.97 },
    disabled: { opacity: 0.3 },
  }
}

// 文字按钮（Text）
TextButton: {
  height: 44,
  backgroundColor: 'transparent',
  textColor: primary,
  fontSize: 17,
  fontWeight: '500',
  
  states: {
    normal:   { opacity: 1.0 },
    pressed:  { opacity: 0.6 },
    disabled: { opacity: 0.3 },
  }
}
```

### 9.2 输入框组件

```typescript
// 标准输入框
TextField: {
  height: 50,
  cornerRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.12)',
  backgroundColor: '#FFFFFF',
  paddingH: 16,
  fontSize: 17,
  placeholderColor: 'rgba(0,0,0,0.4)',
  
  states: {
    normal: {
      borderColor: 'rgba(0,0,0,0.12)',
    },
    focused: {
      borderColor: primary,
      borderWidth: 2,
    },
    error: {
      borderColor: Error,
    },
    disabled: {
      backgroundColor: 'rgba(0,0,0,0.05)',
    }
  }
}
```

### 9.3 卡片组件

```typescript
// 内容卡片
ContentCard: {
  cornerRadius: 16,
  backgroundColor: '#FFFFFF',
  padding: 16,
  shadow: Shadow.s2,
  
  // 间距规则
  titleMarginBottom: 8,
  contentGap: 12,
}

// 滑动卡片（Discover）
SwipeCard: {
  width: '100% - 32px',
  height: '100% - 160px',
  cornerRadius: 20,
  backgroundColor: '#FFFFFF',
  shadow: Shadow.s3,
  overflow: 'hidden',
  
  // 图片区域
  image: {
    height: '70%',
    resizeMode: 'cover',
  },
  
  // 信息区域
  content: {
    padding: 20,
    gap: 8,
  }
}
```

### 9.4 导航栏组件

```typescript
// 标准导航栏
NavigationBar: {
  height: 44,        // 内容高度
  totalHeight: 91,   // 含状态栏 (iPhone 15 Pro)
  backgroundColor: glass,
  backdropBlur: '20px',
  borderWidth: 0.5,
  borderColor: 'rgba(0,0,0,0.1)',
  
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  
  button: {
    iconSize: 24,
    touchArea: 44,
  }
}
```

### 9.5 标签栏组件

```typescript
// 底部标签栏
TabBar: {
  height: 83,        // 含安全区域
  contentHeight: 50,
  backgroundColor: glass,
  backdropBlur: '24px',
  borderTopWidth: 0.5,
  borderTopColor: 'rgba(0,0,0,0.15)',
  
  item: {
    flex: 1,
    gap: 4,
    
    icon: {
      size: 24,
      selectedScale: 1.0,
    },
    
    label: {
      fontSize: 10,
      fontWeight: '500',
      letterSpacing: -0.2,
    }
  }
}
```

### 9.6 徽章组件

```typescript
// 通知徽章
Badge: {
  minWidth: 20,
  height: 20,
  cornerRadius: 10,
  backgroundColor: Error,
  borderColor: '#FFFFFF',
  borderWidth: 2,
  
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingH: 6,
  },
  
  // 小红点（无数字）
  dot: {
    size: 8,
    cornerRadius: 4,
  }
}
```

---

## 十、无障碍设计

### 10.1 对比度要求

```
WCAG 2.1 AA 标准:
- 正常文本：4.5:1
- 大文本 (18pt+ 或 14pt+Bold)：3:1
- UI 组件和图形：3:1
```

### 10.2 触摸目标

```typescript
// 最小触摸区域
MinTouchTarget: 44x44,

// 推荐触摸区域
RecommendedTouch: {
  button:  44x50,
  icon:    44x44,
  listItem: 44x60,
}
```

### 10.3 动态字体支持

```typescript
// 支持 Content Size 类别
ContentSizeCategories: [
  'x-small', 'small', 'medium',     // 默认范围
  'large', 'x-large', 'xx-large',   // 放大
  'xxx-large', 'accessibility',     // 辅助功能
]

// 响应式字体缩放
// 使用 relativeSize 或 scaleSize 工具函数
```

---

## 十一、深色模式适配

### 11.1 转换原则

1. **不要简单反色** - 深色模式不是浅色的反色
2. **降低饱和度** - 深色背景下高饱和色彩会刺眼
3. **保持对比度** - 确保文本可读性
4. **语义一致** - 功能色含义保持一致

### 11.2 深色模式色彩

```typescript
DarkModePalette: {
  // 背景层级（从深到浅）
  background: {
    base:     '#000000',  // 纯黑基底
    surface:  '#1C1814',  // 表面层
    elevated: '#25201A',  // 浮起层
    card:     '#2D2420',  // 卡片层
  },
  
  // 强调色（降低饱和度）
  accent: {
    primary:   '#C9A982',  // 主品牌色
    secondary: '#B8956A',  // 辅助色
  },
  
  // 语义色（调整亮度）
  semantic: {
    success: '#30B34F',   // 降低亮度
    warning: '#E58500',   // 降低亮度
    error:   '#E6342B',   // 降低亮度
  }
}
```

---

## 十二、页面设计模板

### 12.1 首页/发现页

```
┌─────────────────────────────────────┐
│  9:41                          📶🔋 │  ← 状态栏 (47px)
├─────────────────────────────────────┤
│  Discover                      ⚙️   │  ← 导航栏 (44px)
├─────────────────────────────────────┤
│                                     │
│           ┌───────────┐             │
│           │           │             │
│           │   图片    │             │
│           │           │             │
│           │  (70%)    │             │
│           │           │             │
│           │           │             │
│           ├───────────┤             │
│           │ 小明，20  │             │
│           │ 计算机学院 │             │
│           │ 🎵 🎬 ✈️  │             │
│           │ 个人简介..│             │
│           │     📍 0.5km  92% Match │
│           └───────────┘             │
│                                     │
│         [✕]  [★]  [♥]              │  ← 操作按钮
│                                     │
│   右滑喜欢 · 左滑跳过 · 上滑超喜欢    │
│                                     │
├─────────────────────────────────────┤
│  🍷    💬    ⭐    👤              │  ← 标签栏 (83px)
│ Discover Msg  Matches Profile       │
└─────────────────────────────────────┘
```

### 12.2 消息列表页

```
┌─────────────────────────────────────┐
│  9:41                          📶🔋 │
├─────────────────────────────────────┤
│  Messages                      ✏️  │
├─────────────────────────────────────┤
│  New Matches                        │
│  [●] [●] [●] [●] [●]    →          │  ← 横向滚动
├─────────────────────────────────────┤
│  [●] 小王             刚刚          │
│       周末有空一起去看展览吗？       │
├─────────────────────────────────────┤
│  [●] 小李        1 小时前     🔴2  │
│       哈哈，我也很喜欢那部电影！     │
├─────────────────────────────────────┤
│  [●] 小张        昨天               │
│       你的作品真的很棒              │
├─────────────────────────────────────┤
│  ...                                │
└─────────────────────────────────────┘
```

### 12.3 个人中心页

```
┌─────────────────────────────────────┐
│  9:41                          📶🔋 │
├─────────────────────────────────────┤
│  Profile                       ⚙️  │
├─────────────────────────────────────┤
│           ┌─────────┐               │
│           │  头像   │               │
│           └─────────┘               │
│            用户名                   │
│            未登录                   │
├─────────────────────────────────────┤
│  匹配统计                           │
│  [24 浏览] [8 喜欢] [3 匹配]        │
├─────────────────────────────────────┤
│  个人资料                           │
│  ┌─────────────────────────────┐   │
│  │ ✏️  编辑资料           ›   │   │
│  │ ⭐  我的匹配            ›   │   │
│  │ 💬  消息中心           ›   │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  设置与支持                         │
│  ┌─────────────────────────────┐   │
│  │ ⚙️  设置               ›   │   │
│  │ ❓  帮助与反馈         ›   │   │
│  │ ℹ️  关于我们           ›   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 十三、设计检查清单

### 13.1 设计审查

- [ ] 所有颜色符合 WCAG 2.1 AA 对比度标准
- [ ] 字体层级清晰，使用 SF Pro 系统字体
- [ ] 间距遵循 8px 网格系统
- [ ] 触摸目标≥44x44px
- [ ] 支持深色模式
- [ ] 支持动态字体
- [ ] 动效时长≤300ms
- [ ] 使用 SF Symbols 图标
- [ ] 圆角系统统一
- [ ] 阴影层级清晰

### 13.2 开发交接

- [ ] 提供完整的颜色变量
- [ ] 提供字体样式常量
- [ ] 提供间距常量
- [ ] 提供阴影/圆角常量
- [ ] 标注所有状态（normal/hover/pressed/disabled）
- [ ] 标注动效曲线和时长
- [ ] 提供可复用组件规范

---

**文档版本：** 2.0
**最后更新：** 2026 年 4 月 4 日
**设计语言：** Apple Liquid Glass + SF Pro + SF Symbols
