# Campus Connect UX 设计分析报告

## 一、设计文件结构

### 核心设计文件

| 文件路径 | 用途 |
|---------|------|
| `src/constants/colors.ts` | 颜色系统、阴影效果、渐变定义 |
| `src/constants/config.ts` | 排版系统、间距规范、布局参数、交互数据 |
| `src/components/common/Icons.tsx` | 全局图标组件（Home、MapPin、Message、User、Heart、X、Star） |
| `src/components/common/PrimaryButton.tsx` | 主按钮组件（主/次两种变体） |
| `src/components/common/FormInput.tsx` | 表单输入组件 |
| `src/components/common/StepHeader.tsx` | 分步流程头部组件 |
| `src/components/cards/ProfileCard.tsx` | 用户资料卡片组件 |
| `src/screens/auth/SplashScreen.tsx` | 启动页屏幕 |
| `src/screens/main/DiscoverScreen.tsx` | 主探索页（滑动匹配） |
| `src/screens/modals/MatchModal.tsx` | 匹配成功弹窗 |
| `src/screens/main/MessagesScreen.tsx` | 消息列表页 |

---

## 二、配色特点分析

### 2.1 主色调 palette

```
品牌色系
├── bg:        #F5F0EB  (米色背景 - 暖调奶油色)
├── black:     #1A1A1A  (标题黑)
├── brown:     #6B4226  (主品牌色 - 深咖啡色)
├── tan:       #C4A882  (拿铁色 - 辅助强调)
├── cream:     #EDE0D0  (奶油色 - 轻量背景)
├── espresso:  #3B2314  (浓缩咖啡 - 深色渐变)
└── white:     #FFFFFF  (纯白)
```

### 2.2 语义色

| 用途 | 颜色值 |
|------|--------|
| Success | `#22C55E` (绿色 - 喜欢/通过) |
| Error   | `#EF4444` (红色 - 拒绝/错误) |
| Warning | `#F59E0B` (琥珀色 - Super Like) |
| Info    | `#3B82F6` (蓝色 - 信息提示) |

### 2.3 设计特点

1. **暖色调主导** - 整体采用咖啡/奶油色系，营造温暖、精致的社交氛围
2. **低饱和度背景** - `#F5F0EB` 米色背景减少视觉疲劳，比纯白更柔和
3. **高对比度文本** - 深棕色 `#6B4226` 用于主按钮和强调元素，与米色背景形成强烈对比
4. **渐变层次** - 使用棕色系渐变 (`#6B4226` → `#3B2314`) 增加深度感
5. **透明度遮罩** - `rgba(26,14,8,0.85)` 深色遮罩用于卡片底部文字区

### 2.4 阴影系统

```typescript
Shadows = {
  card: { shadowColor: '#6B4226', offset: (0,8), radius: 16, elevation: 8 },
  sm:   { shadowColor: '#000',     offset: (0,2), radius: 4,  elevation: 2 },
  btn:  { shadowColor: '#6B4226',  offset: (0,4), radius: 8,  elevation: 6 },
}
```

---

## 三、排版系统

### 3.1 字体家族

| 用途 | 字体 | 风格 |
|------|------|------|
| 标题/品牌 | Playfair Display | 衬线体（优雅、高端） |
| 正文 | Inter | 无衬线体（清晰、现代） |

### 3.2 字号阶梯

```
xs:   11px  (标签/辅助文字)
sm:   13px  (次要信息)
base: 15px  (按钮文字)
md:   17px  (常规文本)
lg:   20px  (小标题)
xl:   24px  (卡片名称)
xxl:  30px  (页面标题)
hero: 36px  (启动页大标题)
```

### 3.3 字重映射

- Light (300) - 辅助文字
- Regular (400) - 正文
- Medium (500) - 强调文字
- SemiBold (600) - 按钮/导航
- Bold (700) - 标题

---

## 四、交互逻辑分析

### 4.1 发现页 (DiscoverScreen) - 核心交互

**滑动机制：**
```
触发阈值：屏幕宽度的 35% (约 134px)
滑动类型：
├── 右滑 > +SWIPE_THRESHOLD  → Like (喜欢)
├── 左滑 < -SWIPE_THRESHOLD  → Pass (跳过)
└── 上滑 (预留)              → Super Like
```

**动画反馈：**
- 卡片旋转：`-18deg` ~ `+18deg`（随滑动位置）
- LIKE 印章渐显：滑动距离映射透明度 `[0, 1]`
- PASS 印章渐显：滑动距离映射透明度 `[1, 0]`
- 下层卡片缩放：`1.0` → `0.95`（模拟堆叠效果）

**触觉反馈：**
- Like：中等强度震动 (`Haptics.ImpactFeedbackStyle.Medium`)
- Pass/Super：轻度震动 (`Haptics.ImpactFeedbackStyle.Light`)

**动作按钮区：**
```
┌─────────────────────────────────────┐
│   [✕]     [★]      [♥]            │
│  56px    52px     68px            │
│ 红色    琥珀色    棕色 (主按钮)    │
└─────────────────────────────────────┘
```

### 4.2 匹配弹窗 (MatchModal)

**触发条件：** 双向喜欢（数据库 trigger 自动创建 match 记录）

**动画序列：**
```javascript
Animated.parallel([
  fadeAnim:  { toValue: 1, duration: 300ms },    // 背景淡入
  scaleAnim: { toValue: 1, friction: 6 }         // 内容弹跳放大
])
```

**视觉层次：**
1. 深色遮罩背景 (`rgba(26,14,8,0.7)`)
2. BlurView 模糊层 (intensity: 80)
3. 模态框内容（圆角 24px，深棕边框）
4. 头像并排 + 爱心分隔

**操作选项：**
- 「Send a Message」→ 直接跳转聊天
- 「Keep Browsing」→ 关闭弹窗继续滑动

### 4.3 启动页 (SplashScreen)

**入场动画：**
```javascript
Animated.parallel([
  fadeAnim:  { toValue: 1, duration: 900ms },    // 整体淡入
  slideAnim: { toValue: 0, delay: 200ms }        // 内容上移 40px
])
```

**品牌展示：**
- Logo: 渐变棕色圆角方块 (`#6B4226` → `#3B2314`)
- 图标：四角星符号「✦」
- 标题：Playfair Display 衬线体，48px

### 4.4 分步表单流程 (ProfileSetup)

**进度指示器：**
```
[STEP 1 OF 5]  ← Chip 标签
━━━━━━━━━━━━━  ← 进度条（棕色填充）
```

**交互特点：**
- 上一步/下一步导航
- 实时表单验证（红框错误提示）
- 照片上传预览

### 4.5 消息列表 (MessagesScreen)

**布局结构：**
```
┌──────────────────────────────────┐
│ Messages            [✏]         │
├──────────────────────────────────┤
│ New Matches                      │
│ [头像] [头像] [头像] ... (横向滚动)│
├──────────────────────────────────┤
│ [头像] 用户名           时间     │
│          最后消息预览   [●未读]  │
├──────────────────────────────────┤
│ [头像] 用户名           时间     │
│          最后消息预览           │
└──────────────────────────────────┘
```

**新匹配横向滚动：**
- 头像外圈：棕色描边环 (2.5px)
- 仅显示名字（无消息）
- 点击直达聊天

**会话列表项：**
- 头像：52px 圆角，带阴影
- 未读徽章：棕色圆点 + 数字
- 时间戳：相对时间（如「5m」「2h」）

---

## 五、布局规范

### 5.1 间距系统

```typescript
spacing: {
  xs:   4px,   // 极小间距
  sm:   8px,   // 紧凑间距
  md:   16px,  // 标准间距
  lg:   24px,  // 大间距
  xl:   32px,  // 页面边距
  xxl:  48px,  // 空状态 padding
}
```

### 5.2 圆角规范

```typescript
borderRadius: {
  sm:   8px,   // 小元素
  md:   12px,  // 输入框/按钮
  lg:   16px,  // 卡片
  xl:   24px,  // 大模态框
  card: 20px,  // 专用卡片圆角
  full: 9999px // 圆形/胶囊形
}
```

### 5.3 卡片尺寸

```typescript
cardWidth:  SCREEN_W - 32px     // 两侧各留 16px
cardHeight: SCREEN_H × 0.65     // 占屏幕 65% 高度
```

---

## 六、组件设计模式

### 6.1 PrimaryButton

```typescript
variants: {
  primary: {
    backgroundColor: Colors.brown,
    shadow: Shadows.btn,
    textColor: Colors.white
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: Colors.brown,
    backgroundColor: 'transparent',
    textColor: Colors.brown
  }
}
```

**尺寸：** 高度 52px，圆角 `Layout.borderRadius.lg` (16px)

### 6.2 ProfileCard

**信息层级（从上到下）：**
1. 姓名 + 年龄（Playfair Display, 24px，白色）
2. 专业 · 年级（Inter SemiBold, 拿铁色）
3. 职业方向（小字，半透明白）
4. 兴趣标签（半透明米色背景 + 边框）
5. 页脚：距离 + 匹配度徽章

**视觉技巧：**
- 底部渐变遮罩 (`transparent` → `rgba(26,14,8,0.82)`)
- 文字投影确保可读性
- 匹配度徽章使用品牌棕色背景

### 6.3 StepHeader

**组成元素：**
- STEP X OF Y 标签（奶油色胶囊背景）
- 主标题（衬线体，36px 行高）
- 副标题（无衬线，灰色）
- 进度条（4px 高，棕色填充）

---

## 七、图标系统

### 7.1 底部导航图标

| 标签 | 图标 | 状态色 |
|------|------|--------|
| Discover | 🏠 (Home) | 聚焦：棕色填充 / 未聚焦：灰色描边 |
| Nearby | 📍 (MapPin) | 同上 |
| Messages | 💬 (Message) | 同上 |
| Profile | 👤 (User) | 同上 |

**设计细节：**
- 尺寸：22px
- 聚焦状态：实心填充 + 下方小圆点指示器
- 未聚焦：描边 + `Colors.muted` 灰色

### 7.2 功能图标

- Heart (喜欢) - 空心/实心切换
- X (拒绝) - 2.5px 描边，圆角端点
- Star (Super Like) - 琥珀色 `#F59E0B`
- Settings (齿轮) - Emoji 字符「⚙」

---

## 八、设计亮点总结

### ✦ 品牌一致性
- 全系统使用 Playfair Display 衬线体作为标题字体，建立高端质感
- 棕色系 (`#6B4226`) 贯穿所有交互节点

### ✦ 微交互丰富
- 滑动卡片时的旋转 + 印章渐显
- 匹配弹窗的弹跳动画 + 模糊背景
- 启动页的平行淡入 + 上移动画

### ✦ 层次分明
- 卡片堆叠缩放效果（后两张卡片依次缩小）
- 渐变遮罩确保文字在任何背景图上可读
- 阴影系统统一（卡片/按钮/小组件各有层级）

### ✦ 反馈及时
- 触觉反馈（Haptics）配合滑动手势
- 视觉反馈（印章/透明度/旋转）实时响应
- 进度指示器（分步表单/加载状态）清晰

---

## 九、可改进建议

1. **空状态设计** - 当前空状态使用 Emoji，可升级为定制插画
2. **深色模式** - 暂未实现暗色主题支持
3. **加载骨架屏** - 目前仅使用 ActivityIndicator，可添加骨架屏动画
4. **转场动画** - 屏幕间转场较简单，可添加更多定制化动效
5. **可访问性** - 缺少 VoiceOver/TalkBack 支持

---

**报告生成时间：** 2026 年 4 月 4 日  
**分析范围：** Campus Connect (1) 项目
