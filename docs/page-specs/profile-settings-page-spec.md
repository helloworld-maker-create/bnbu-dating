# Profile & Settings 页面设计规范 - Apple HIG

> **页面类型：** 个人中心 / 设置  
> **设计语言：** Apple Liquid Glass · SF Pro · SF Symbols  
> **留白占比：** ≥40%  

---

## Profile 页面结构

```
┌─────────────────────────────────────┐
│ 状态栏 (47px)                       │
├─────────────────────────────────────┤
│ Profile                       [⚙]  │ 导航栏 (44px)
├─────────────────────────────────────┤
│                                     │
│           ┌─────────┐               │
│           │  头 像   │               │ 用户信息区
│           └─────────┘               │ (180px)
│            用户名                   │
│            未登录 / 专业            │
│                                     │
├─────────────────────────────────────┤
│  匹配统计                           │
│  [24 浏览] [8 喜欢] [3 匹配]        │ 统计区 (80px)
├─────────────────────────────────────┤
│  个人资料                           │
│  ┌─────────────────────────────┐   │
│  │ ✏️  编辑资料           ›   │   │
│  │ ⭐  我的匹配            ›   │   │ 菜单组 1
│  │ 💬  消息中心           ›   │   │ (180px)
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  设置与支持                         │
│  ┌─────────────────────────────┐   │
│  │ ⚙️  设置               ›   │   │
│  │ ❓  帮助与反馈         ›   │   │ 菜单组 2
│  │ ℹ️  关于我们           ›   │   │ (140px)
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│           [立即登录] [注册账号]      │ 未登录操作区
│                                     │
├─────────────────────────────────────┤
│        Dating in BNBU v1.0.0        │ 版本信息
├─────────────────────────────────────┤
│ 🍷    💬    ⭐    👤               │ 标签栏 (83px)
└─────────────────────────────────────┘
```

---

## Profile 详细规格

### 1. 用户信息区 (User Info Section)

```typescript
UserInfoSection: {
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: cardBackground,
  },
  
  // 头像容器
  avatarContainer: {
    marginBottom: 16,
    
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: tagBackground,
      shadow: Shadow.s2,
    },
    
    // 编辑按钮
    editButton: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadow: Shadow.s2,
      
      icon: {
        name: 'camera.fill',
        size: 16,
        color: '#FFFFFF',
      },
    },
  },
  
  // 用户名
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: text,
    letterSpacing: 0.35,
    marginBottom: 4,
  },
  
  // 状态/专业
  status: {
    fontSize: 15,
    fontWeight: '400',
    color: textMuted,
    letterSpacing: -0.16,
  },
  
  // 认证徽章
  verifiedBadge: {
    name: 'checkmark.seal.fill',
    size: 18,
    color: info,
    marginLeft: 6,
  },
}
```

### 2. 匹配统计区 (Stats Section)

```typescript
StatsSection: {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: elevatedBackground,
  },
  
  // 统计项
  statItem: {
    alignItems: 'center',
    gap: 4,
    
    icon: {
      size: 24,
      marginBottom: 4,
    },
    
    value: {
      fontSize: 20,
      fontWeight: '700',
      color: text,
      letterSpacing: 0.35,
    },
    
    label: {
      fontSize: 13,
      fontWeight: '500',
      color: textMuted,
      letterSpacing: -0.08,
    },
  },
  
  // 统计项配置
  stats: [
    { icon: 'eye.fill', key: 'views', label: '浏览' },
    { icon: 'heart.fill', key: 'likes', label: '喜欢' },
    { icon: 'star.fill', key: 'matches', label: '匹配' },
  ],
}
```

### 3. 菜单组 (Menu Group)

```typescript
MenuGroup: {
  // 容器
  container: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: cardBackground,
    shadow: Shadow.s2,
  },
  
  // 组标题
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: separator,
    
    title: {
      fontSize: 13,
      fontWeight: '600',
      color: textSecondary,
      letterSpacing: -0.08,
      textTransform: 'uppercase',
    },
  },
  
  // 菜单项
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 50,
    
    // 点击反馈
    pressOpacity: 0.7,
    pressColor: primary,
    
    // 图标
    icon: {
      width: 30,
      marginRight: 16,
      size: 24,
      color: textSecondary,
    },
    
    // 标题
    title: {
      flex: 1,
      fontSize: 17,
      fontWeight: '400',
      color: text,
      letterSpacing: -0.16,
    },
    
    // 副标题
    subtitle: {
      fontSize: 15,
      fontWeight: '400',
      color: textMuted,
      marginRight: 8,
    },
    
    // 指示箭头
    chevron: {
      name: 'chevron.right',
      size: 16,
      color: textMuted,
    },
    
    // 分隔线
    separator: {
      marginLeft: 66,
      height: 1,
      backgroundColor: separator,
    },
  },
}
```

### 4. 未登录操作区 (Guest Actions)

```typescript
GuestActions: {
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  
  // 登录按钮
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: primary,
    
    text: {
      fontSize: 17,
      fontWeight: '600',
      color: '#FFFFFF',
      letterSpacing: -0.16,
    },
  },
  
  // 注册按钮
  registerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: primary,
    
    text: {
      fontSize: 17,
      fontWeight: '600',
      color: primary,
      letterSpacing: -0.16,
    },
  },
}
```

### 5. 版本信息 (Version Info)

```typescript
VersionInfo: {
  text: 'Dating in BNBU v1.0.0',
  fontSize: 13,
  fontWeight: '400',
  color: textMuted,
  textAlign: 'center',
  paddingVertical: 24,
  letterSpacing: -0.08,
}
```

---

## Settings 页面结构

```
┌─────────────────────────────────────┐
│ 状态栏 (47px)                       │
├─────────────────────────────────────┤
│ 设置                          [×]  │ 导航栏 (44px)
├─────────────────────────────────────┤
│  通知设置                           │
│  ┌─────────────────────────────┐   │
│  │ 🍷  新的匹配          [●]  │   │
│  │ 💬  新消息            [●]  │   │
│  │ ⭐  超级喜欢          [○]  │   │
│  │ 🔔  系统通知          [●]  │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  隐私与安全                         │
│  ┌─────────────────────────────┐   │
│  │ 👁  可见范围           ›   │   │
│  │ 🚫  黑名单             ›   │   │
│  │ 📄  隐私政策           ›   │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  账号管理                           │
│  ┌─────────────────────────────┐   │
│  │ 🔐  修改密码           ›   │   │
│  │ 📱  绑定手机           ›   │   │
│  │ ℹ️  账号信息           ›   │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  通用                               │
│  ┌─────────────────────────────┐   │
│  │ 🌐  语言          简体中文 ›│   │
│  │ 🗑  清除缓存      24.5MB ›│   │
│  │ ℹ️  关于我们           ›   │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│           [退出登录]                 │
│                                     │
└─────────────────────────────────────┘
```

---

## Settings 详细规格

### 1. 开关组件 (Toggle Switch)

```typescript
ToggleSwitch: {
  // 尺寸
  width: 51,
  height: 31,
  
  // 轨道
  track: {
    borderRadius: 16,
    borderWidth: 2,
    
    // 开启状态
    on: {
      backgroundColor: success,
      borderColor: success,
    },
    
    // 关闭状态
    off: {
      backgroundColor: 'transparent',
      borderColor: 'rgba(120,120,128,0.32)',
    },
  },
  
  // 滑块
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadow: Shadow.s2,
    
    // 位置
    positionOn: 22,
    positionOff: 2,
  },
  
  // 动画
  animation: {
    duration: 200,
    easing: 'easeInOut',
  },
  
  // 触觉反馈
  haptics: {
    type: 'impactLight',
    on: 'toggle',
  },
}
```

### 2. 设置项 (Settings Item)

```typescript
SettingsItem: {
  // 容器
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    minHeight: 50,
    backgroundColor: cardBackground,
    
    pressOpacity: 0.7,
    pressColor: primary,
  },
  
  // 左侧内容
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    
    icon: {
      width: 30,
      marginRight: 16,
      size: 24,
      color: textSecondary,
    },
    
    title: {
      fontSize: 17,
      fontWeight: '400',
      color: text,
      letterSpacing: -0.16,
    },
  },
  
  // 右侧内容
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    
    // 值/状态
    value: {
      fontSize: 17,
      fontWeight: '400',
      color: textMuted,
      marginRight: 8,
    },
    
    // 开关
    toggle: ToggleSwitch,
    
    // 箭头
    chevron: {
      name: 'chevron.right',
      size: 16,
      color: textMuted,
    },
  },
  
  // 分隔线
  separator: {
    marginLeft: 66,
    height: 1,
    backgroundColor: separator,
  },
}
```

### 3. 清除缓存弹窗 (Clear Cache Alert)

```typescript
ClearCacheAlert: {
  title: '清除缓存',
  message: '确定要清除 24.5MB 缓存数据吗？',
  
  buttons: [
    {
      text: '取消',
      style: 'cancel',
    },
    {
      text: '清除',
      style: 'destructive',
      onPress: () => { /* 清除逻辑 */ },
    },
  ],
}
```

### 4. 退出登录按钮 (Logout Button)

```typescript
LogoutButton: {
  container: {
    marginHorizontal: 20,
    marginVertical: 24,
  },
  
  button: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: error,
    justifyContent: 'center',
    alignItems: 'center',
    shadow: Shadow.s2,
    
    text: {
      fontSize: 17,
      fontWeight: '600',
      color: '#FFFFFF',
      letterSpacing: -0.16,
    },
  },
}
```

---

## 交互规范

### 1. 菜单项点击

```typescript
MenuItemPress: {
  onPress: {
    action: 'navigate',
    animation: 'push',
    duration: 350,
  },
  
  haptics: {
    type: 'impactLight',
    on: 'press',
  },
}
```

### 2. 开关切换

```typescript
ToggleChange: {
  onChange: {
    action: 'updateSetting',
    haptics: {
      type: 'impactLight',
      on: 'change',
    },
    animation: {
      duration: 200,
    },
  },
}
```

### 3. 退出登录确认

```typescript
LogoutConfirm: {
  onPress: {
    action: 'showAlert',
    alert: {
      title: '退出登录',
      message: '确定要退出当前账号吗？',
      buttons: [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive' },
      ],
    },
  },
}
```

---

## 留白规范

### Profile 页面留白

```typescript
ProfileWhitespace: {
  top: 91,                              // 状态栏 + 导航栏
  bottom: 83,                           // 标签栏
  side: 20,                             // 侧边距
  
  sectionGap: 24,                       // 组间距
  
  ratio: '约 48%',
}
```

### Settings 页面留白

```typescript
SettingsWhitespace: {
  top: 91,
  bottom: 40,
  side: 20,
  
  groupGap: 32,                         // 设置组间距
  
  ratio: '约 45%',
}
```

---

## 对比度验证

### WCAG 2.1 AA 合规检查

| 元素组合 | 对比度 | 要求 | 状态 |
|----------|--------|------|------|
| 用户名 / 背景 | 16.1:1 | 4.5:1 | ✅ |
| 菜单项文本 / 背景 | 16.1:1 | 4.5:1 | ✅ |
| 开关轨道 (关) / 背景 | 3.5:1 | 3:1 | ✅ |
| 开关轨道 (开) / 背景 | 3.2:1 | 3:1 | ✅ |
| 退出登录按钮 / 背景 | 4.8:1 | 3:1 | ✅ |

---

## 文件结构

```
app/(tabs)/two.tsx                # Profile 页面主组件
app/settings.tsx                  # Settings 页面主组件
components/ProfileHeader.tsx      # 用户信息组件 (新建)
components/StatsRow.tsx           # 统计行组件 (新建)
components/MenuGroup.tsx          # 菜单组组件 (新建)
components/SettingsItem.tsx       # 设置项组件 (新建)
components/ToggleSwitch.tsx       # 开关组件 (新建)
constants/DesignTokens.ts         # 设计系统常量
components/Themed.tsx             # 主题组件 (已增强)
```

---

**设计版本：** 2.0 (Apple HIG)  
**最后更新：** 2026 年 4 月 4 日
