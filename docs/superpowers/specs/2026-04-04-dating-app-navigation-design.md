# Dating App 设计规范文档

## 日期
2026 年 4 月 4 日

## 项目概述
校园社交平台 - Dating in BNBU，采用咖啡/奶油暖色调系 UX 设计

---

## 1. 导航结构

### 1.1 底部 Tab 导航（四 Tab 方案）

```
┌─────────────────────────────────────┐
│ [♥]    [💬]     [★]     [👤]      │
│Discover Messages Matches  Profile   │
└─────────────────────────────────────┘
```

| Tab | 路由 | 功能 | 图标 |
|-----|------|------|------|
| Discover | `/(tabs)/index` | 滑动匹配 | heart/heart-outline |
| Messages | `/(tabs)/messages` | 消息列表 | chatbubble/chatbubble-outline |
| Matches | `/(tabs)/matches` | 匹配列表 | star/star-outline |
| Profile | `/(tabs)/two` | 个人中心 | person-circle/person-circle-outline |

### 1.2 配色系统

**浅色主题**:
- 背景：`#F5F0EB` (米色)
- 主色调：`#6B4226` (深咖啡色)
- 辅助色：`#C4A882` (拿铁色)
- 卡片背景：`#FFFFFF`

**深色主题**:
- 背景：`#1A1A1A`
- 主色调：`#C4A882`
- 卡片背景：`#2D2420`

---

## 2. 功能模块

### 2.1 用户系统
- [x] 登录/注册（.edu 邮箱验证）
- [x] JWT Token 认证
- [x] 个人资料编辑
- [ ] 头像上传（待实现）
- [ ] 资料验证（待实现）

### 2.2 匹配功能
- [x] 滑动卡片 UI
- [x] 左滑/右滑手势
- [x] 触觉反馈
- [ ] 匹配弹窗（待实现）
- [ ] 视频通话（待实现）

### 2.3 聊天系统
- [x] 消息列表
- [x] 聊天对话
- [x] 本地消息存储
- [ ] AI 破冰助手（待实现）
- [ ] 实时推送（待实现）

### 2.4 设置页面
- [ ] 通知设置
- [ ] 隐私设置
- [ ] 账号管理
- [ ] 帮助与反馈

---

## 3. 数据流设计

```
┌─────────────────┐
│   AuthContext   │
│  (用户认证状态)  │
└────────┬────────┘
         │
    ┌────▼────┐
    │AsyncStorage│
    │ (Token)   │
    └────┬────┘
         │
    ┌────▼────┐
    │API 请求   │
    │(带认证头) │
    └─────────┘

┌─────────────────┐
│ MessageStorage  │
│  (本地消息存储)  │
└────────┬────────┘
         │
    ┌────▼────┐
    │AsyncStorage│
    │ / SQLite  │
    └───────────┘
```

---

## 4. 开发策略

### 4.1 数据源策略
**模拟数据优先** - 使用本地模拟数据快速迭代，后期统一对接 API

### 4.2 组件复用
- `MatchModal` - 匹配成功弹窗
- `MessageItem` - 消息列表项
- `MenuItem` - 设置菜单项

---

## 5. 文件结构

```
app/
├── (tabs)/
│   ├── _layout.tsx      # Tab 导航布局
│   ├── index.tsx        # Discover
│   ├── messages.tsx     # Messages
│   ├── matches.tsx      # Matches (新增)
│   └── two.tsx          # Profile
├── chat/[id].tsx        # 聊天对话
├── profile/edit.tsx     # 编辑资料
├── login.tsx            # 登录
├── register.tsx         # 注册
├── settings.tsx         # 设置
└── _layout.tsx          # 根布局
```

---

## 6. 待实现功能优先级

1. **P0** - Tab 导航结构调整（4 Tab）
2. **P0** - 匹配列表页面移入 Tab
3. **P1** - 设置页面完善
4. **P1** - 头像上传功能
5. **P2** - 匹配弹窗动画
6. **P2** - AI 破冰助手
