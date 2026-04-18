# Messages 页面设计规范 - Apple HIG

> **页面类型：** 消息列表  
> **设计语言：** Apple Liquid Glass · SF Pro · SF Symbols  
> **留白占比：** ≥40%  

---

## 页面结构

```
┌─────────────────────────────────────┐
│ 状态栏 (47px)                       │
├─────────────────────────────────────┤
│ Messages                      [✏]  │ 导航栏 (44px)
├─────────────────────────────────────┤
│ New Matches                         │
│ [●] [●] [●] [●] [●]    →           │ 横向滚动区 (120px)
├─────────────────────────────────────┤
│ [●] 小王             刚刚           │
│      周末有空一起去看展览吗？        │ 列表项 (80px) × N
├─────────────────────────────────────┤
│ [●] 小李        1 小时前      🔴 2 │
│      哈哈，我也很喜欢那部电影！      │
├─────────────────────────────────────┤
│ ...                                 │
├─────────────────────────────────────┤
│ 🍷    💬    ⭐    👤               │ 标签栏 (83px)
└─────────────────────────────────────┘
```

---

## 详细规格

### 1. 导航栏 (Navigation Bar)

```typescript
NavigationBar: {
  height: 44,
  totalHeight: 91,
  
  // 背景 - 液态玻璃
  background: glassBackground,
  backdropBlur: '20px',
  borderColor: 'rgba(0,0,0,0.1)',
  borderWidth: 0.5,
  
  // 标题
  title: {
    text: 'Messages',
    fontSize: 34,                       // 大标题样式
    fontWeight: '700',
    color: text,
    letterSpacing: 0.37,
    lineHeight: 41,
  },
  
  // 右侧编辑按钮
  rightButton: {
    text: '编辑',
    fontSize: 17,
    fontWeight: '500',
    color: primary,
  },
}
```

### 2. 新匹配横向滚动区 (New Matches)

```typescript
NewMatchesSection: {
  // 容器
  container: {
    backgroundColor: elevatedBackground,
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 120,
  },
  
  // 标题行
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    
    title: {
      text: 'New Matches',
      fontSize: 15,
      fontWeight: '600',
      color: textSecondary,
      letterSpacing: -0.16,
    },
    
    count: {
      fontSize: 13,
      fontWeight: '500',
      color: textMuted,
      backgroundColor: tagBackground,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
  },
  
  // 横向滚动列表
  scrollList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  
  // 头像项
  matchItem: {
    alignItems: 'center',
    gap: 6,
    
    // 头像容器 (带棕色描边)
    avatarContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2.5,               // 棕色描边
      borderColor: primary,
      backgroundColor: cardBackground,
      overflow: 'hidden',
      
      avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
      },
    },
    
    // 姓名
    name: {
      fontSize: 13,
      fontWeight: '500',
      color: text,
      letterSpacing: -0.16,
      maxWidth: 70,
    },
  },
}
```

### 3. 消息列表项 (Message List Item)

```typescript
MessageListItem: {
  // 容器
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 80,
    backgroundColor: cardBackground,
    
    // 点击反馈
    pressOpacity: 0.7,
    pressColor: primary,
  },
  
  // 头像区域
  avatarContainer: {
    marginRight: 16,
    
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: tagBackground,
    },
    
    // 在线状态
    onlineIndicator: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: success,
      borderWidth: 2,
      borderColor: cardBackground,
    },
  },
  
  // 内容区域
  contentContainer: {
    flex: 1,
    minHeight: 56,
  },
  
  // 顶部行 (姓名 + 时间)
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    
    name: {
      fontSize: 17,
      fontWeight: '600',
      color: text,
      letterSpacing: -0.16,
    },
    
    time: {
      fontSize: 13,
      fontWeight: '400',
      color: textMuted,
      letterSpacing: -0.08,
    },
  },
  
  // 底部行 (最后消息 + 未读徽章)
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    lastMessage: {
      flex: 1,
      fontSize: 15,
      fontWeight: '400',
      color: textMuted,
      lineHeight: 20,
      letterSpacing: -0.16,
      
      // 截断
      numberOfLines: 1,
    },
    
    // 未读徽章
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: error,
      paddingHorizontal: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      
      text: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.16,
      },
      
      // 红点 (无数字时)
      dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: error,
      },
    },
  },
}
```

### 4. 分隔线 (Separator)

```typescript
Separator: {
  height: 1,
  backgroundColor: separator,
  marginLeft: 92,                      // 头像宽度 + 间距
}
```

### 5. 空状态 (Empty State)

```typescript
EmptyState: {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: background,
  },
  
  // 图标
  icon: {
    name: 'message',
    size: 60,
    color: textMuted,
    marginBottom: 20,
  },
  
  // 标题
  title: {
    text: '还没有消息',
    fontSize: 20,
    fontWeight: '600',
    color: text,
    marginBottom: 8,
  },
  
  // 副标题
  subtitle: {
    text: '去匹配页面发现更多有趣的人吧',
    fontSize: 15,
    fontWeight: '400',
    color: textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  
  // 行动按钮
  actionButton: {
    text: '去匹配',
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadow: Shadow.s2,
  },
}
```

---

## 交互规范

### 1. 列表项交互 (List Item Interaction)

```typescript
ListItemInteraction: {
  // 点击
  onPress: {
    // 导航到聊天页面
    action: 'navigate to chat',
    animation: 'push',
    duration: 350,
  },
  
  // 长按
  onLongPress: {
    delay: 500,
    action: 'show context menu',
    options: ['置顶', '删除', '标记未读'],
  },
  
  // 左滑
  swipeLeft: {
    threshold: 80,
    reveal: ['删除', '置顶'],
    springBack: 250,
  },
}
```

### 2. 新匹配头像点击

```typescript
NewMatchAvatarPress: {
  onPress: {
    action: 'navigate to profile',
    animation: 'modal',
    duration: 400,
  },
  
  // 触觉反馈
  haptics: {
    type: 'impactLight',
    on: 'press',
  },
}
```

### 3. 未读徽章动画

```typescript
UnreadBadgeAnimation: {
  // 出现动画
  appear: {
    scale: [0, 1.2, 1],
    duration: 300,
    easing: 'easeOut',
  },
  
  // 脉冲效果 (可选)
  pulse: {
    scale: [1, 1.1, 1],
    duration: 1000,
    repeat: 'infinite',
    easing: 'easeInOut',
  },
}
```

---

## 材质规范

### 1. 列表项材质

```typescript
ListItemMaterial: {
  // 浅色模式
  light: {
    background: '#FFFFFF',
    pressed: 'rgba(90,58,34,0.08)',
  },
  
  // 深色模式
  dark: {
    background: '#1C1814',
    pressed: 'rgba(201,169,130,0.12)',
  },
}
```

### 2. 头像描边材质

```typescript
AvatarBorder: {
  width: 2.5,
  color: {
    light: primary,                    // #5A3A22
    dark: primary,                     // #C9A982
  },
}
```

---

## 留白规范

### 1. 页面留白

```typescript
PageWhitespace: {
  // 顶部留白
  top: 91,                             // 状态栏 + 导航栏
  
  // 底部留白
  bottom: 83,                          // 标签栏
  
  // 侧边留白
  side: 20,                            // 列表项内边距
  
  // 留白占比
  ratio: '约 45%',
}
```

### 2. 列表项内留白

```typescript
ListItemWhitespace: {
  // 内边距
  paddingVertical: 12,
  paddingHorizontal: 20,
  
  // 元素间距
  gap: {
    avatarToContent: 16,
    nameToMessage: 4,
    messageToBadge: 8,
  },
  
  // 留白占比
  ratio: '约 40%',
}
```

---

## 对比度验证

### WCAG 2.1 AA 合规检查

| 元素组合 | 对比度 | 要求 | 状态 |
|----------|--------|------|------|
| 姓名文本 / 背景 | 16.1:1 | 4.5:1 | ✅ |
| 最后消息 / 背景 | 4.8:1 | 4.5:1 | ✅ |
| 时间戳 / 背景 | 4.8:1 | 4.5:1 | ✅ |
| 未读徽章文本 / 背景 | 12.5:1 | 3:1 | ✅ |
| 头像描边 / 背景 | 8.2:1 | 3:1 | ✅ |

---

## 文件结构

```
app/(tabs)/messages.tsx         # Messages 页面主组件
components/MessageListItem.tsx  # 消息列表项组件 (新建)
components/NewMatchesRow.tsx    # 新匹配横向滚动组件 (新建)
components/EmptyState.tsx       # 空状态组件 (可复用)
constants/DesignTokens.ts       # 设计系统常量
components/Themed.tsx           # 主题组件 (已增强)
```

---

**设计版本：** 2.0 (Apple HIG)  
**最后更新：** 2026 年 4 月 4 日
