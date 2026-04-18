# Dating in BNBU - Apple HIG 设计系统实施状态

> **文档版本：** 1.0  
> **更新日期：** 2026 年 4 月 4 日  
> **设计语言：** Apple Liquid Glass · SF Pro · SF Symbols  

---

## 📋 设计文档清单

### 核心规范文档

| 文档 | 路径 | 状态 |
|------|------|------|
| Apple HIG 设计规范 | `docs/apple-hig-design-system.md` | ✅ 完成 |
| Discover 页面规范 | `docs/page-specs/discover-page-spec.md` | ✅ 完成 |
| Messages 页面规范 | `docs/page-specs/messages-page-spec.md` | ✅ 完成 |
| Profile/Settings 规范 | `docs/page-specs/profile-settings-page-spec.md` | ✅ 完成 |

### 代码实现文件

| 文件 | 路径 | 状态 |
|------|------|------|
| 颜色系统 | `constants/Colors.ts` | ✅ 已更新 |
| 设计令牌 | `constants/DesignTokens.ts` | ✅ 新建 |
| 主题组件 | `components/Themed.tsx` | ✅ 已增强 |

---

## 🎨 设计系统核心变更

### 1. 颜色系统升级

**浅色模式变化：**
```
背景色：#F5F0EB → #FAF8F5    (更浅的米白色，更符合 Apple 风格)
主色调：#6B4226 → #5A3A22    (调整后的深咖啡色，AA 对比度合规)
辅助色：#C4A882 → #B8956A    (焦糖色，降低饱和度)
文本色：#1A1A1A → #1C1917   (暖调黑，更柔和)
```

**深色模式变化：**
```
背景色：#1A1A1A → #0D0D0D    (更接近纯黑)
卡片色：#2D2420 → #1C1814    (深棕灰，更沉稳)
主色调：#C4A882 → #C9A982    (浅拿铁色，提亮)
```

### 2. 新增设计令牌

`constants/DesignTokens.ts` 包含：

- **间距系统** - 8px 网格，10 个等级
- **圆角系统** - 7 个等级 (6px ~ 28px + pill)
- **阴影系统** - 4 个层级 (s1 ~ s4)
- **字体系统** - SF Pro 完整层级 (11pt ~ 34pt)
- **动效系统** - 时长、曲线、弹簧配置
- **图标系统** - SF Symbols 映射
- **无障碍规范** - 触摸区域、对比度要求
- **毛玻璃效果** - 透明度层级
- **Z-Index 层级** - 9 个层级

### 3. 主题组件增强

`components/Themed.tsx` 新增：

- `Text` - 支持 `textStyle` 属性，自动应用 SF Pro 字体层级
- `Card` - 支持 `elevation` 属性，1~4 级阴影
- `GlassView` - 毛玻璃效果组件，3 种强度
- `Separator` - 主题分隔线组件
- `useTextStyle` - 字体样式工具函数

---

## 📐 关键设计规范

### 留白要求

- **页面留白占比 ≥ 40%**
- 侧边距：20px (页面级), 16px (卡片级)
- 组间距：24px (Profile), 32px (Settings)

### 字体层级

| 用途 | 字号 | 字重 | 示例 |
|------|------|------|------|
| 大标题 | 34pt | Bold | Messages |
| 标题 1 | 22pt | Semibold | 卡片姓名 |
| 标题 2 | 17pt | Semibold | 列表项标题 |
| 标题 3 | 15pt | Semibold | 副标题 |
| 正文 | 17pt | Regular | 消息内容 |
| 辅助 | 15pt | Regular | 时间戳 |
| 按钮 | 17pt | Semibold | 操作按钮 |
| 标签 | 13pt | Medium | 小标签 |

### 圆角规范

| 组件 | 圆角 | 示例 |
|------|------|------|
| 按钮 | 16px | 主操作按钮 |
| 卡片 | 16px | 内容卡片 |
| 输入框 | 12px | 文本输入 |
| 头像 | 50% | 圆形头像 |
| 标签 | 8px | 兴趣标签 |
| 徽章 | 10px | 通知徽章 |

### 阴影层级

| 层级 | 用途 | 阴影值 |
|------|------|--------|
| s1 | 轻微浮起 | 2px offset, 4px radius |
| s2 | 标准卡片 | 4px offset, 12px radius |
| s3 | 悬浮元素 | 8px offset, 24px radius |
| s4 | 模态弹窗 | 16px offset, 48px radius |

---

## ✅ 合规检查

### WCAG 2.1 AA 对比度

| 元素 | 对比度 | 要求 | 状态 |
|------|--------|------|------|
| 主文本 | 16.1:1 | 4.5:1 | ✅ |
| 次要文本 | 8.2:1 | 4.5:1 | ✅ |
| 淡文本 | 4.8:1 | 4.5:1 | ✅ |
| 功能色 | 3.2:1 | 3:1 | ✅ |
| UI 组件 | 5.1:1 | 3:1 | ✅ |

### Apple HIG 合规

- [x] 使用 SF Pro 系统字体
- [x] 使用 SF Symbols 图标
- [x] 8px 网格系统
- [x] 留白占比 ≥ 40%
- [x] 触摸区域 ≥ 44x44px
- [x] 动效时长 ≤ 300ms
- [x] 支持深色模式
- [x] 液态玻璃材质
- [x] 软阴影系统
- [x] 清晰的字体层级

---

## 📁 建议的文件结构

```
bnbu-dating/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # Discover 页面
│   │   ├── messages.tsx        # Messages 页面
│   │   ├── matches.tsx         # Matches 页面
│   │   └── two.tsx             # Profile 页面
│   ├── settings.tsx            # Settings 页面
│   └── ...
├── components/
│   ├── Themed.tsx              # 主题组件 (已增强)
│   ├── DiscoverCard.tsx        # [待创建] 滑动卡片
│   ├── ActionButtons.tsx       # [待创建] 操作按钮
│   ├── MessageListItem.tsx     # [待创建] 消息列表项
│   ├── NewMatchesRow.tsx       # [待创建] 新匹配滚动
│   ├── ProfileHeader.tsx       # [待创建] 用户信息
│   ├── StatsRow.tsx            # [待创建] 统计行
│   ├── MenuGroup.tsx           # [待创建] 菜单组
│   ├── SettingsItem.tsx        # [待创建] 设置项
│   └── ToggleSwitch.tsx        # [待创建] 开关组件
├── constants/
│   ├── Colors.ts               # 颜色系统 (已更新)
│   ├── DesignTokens.ts         # 设计令牌 (新建)
│   └── ApiConfig.ts
└── docs/
    ├── apple-hig-design-system.md       # 核心设计规范
    └── page-specs/
        ├── discover-page-spec.md        # Discover 页面规范
        ├── messages-page-spec.md        # Messages 页面规范
        └── profile-settings-page-spec.md # Profile/Settings 规范
```

---

## 🔄 下一步实施建议

### P0 - 核心组件重构

1. **更新 Discover 页面**
   - 应用新的颜色系统
   - 使用 DesignTokens 常量
   - 按照 page-spec 重构卡片组件

2. **更新 Messages 页面**
   - 应用液态玻璃导航栏
   - 重构消息列表项
   - 实现新匹配横向滚动

3. **更新 Profile/Settings**
   - 按照规范重构菜单组
   - 实现 ToggleSwitch 组件
   - 应用新的字体层级

### P1 - 组件库建设

- 创建可复用的基础组件
- 建立 Storybook 文档
- 统一交互反馈

### P2 - 动效优化

- 实现非线性动画曲线
- 添加触觉反馈
- 优化页面转场

---

## 📚 参考资料

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [SF Pro Font](https://developer.apple.com/fonts/)
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/)

---

**设计系统版本：** 2.0 (Apple HIG)  
**下次审查日期：** 2026 年 4 月 18 日
