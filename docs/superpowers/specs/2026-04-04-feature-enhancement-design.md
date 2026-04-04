# Dating in BNBU - 功能增强设计文档

**创建日期**: 2026-04-04  
**状态**: 设计中

---

## 一、背景与目标

### 1.1 问题陈述
当前应用存在以下改进需求：
- 缺少独立的消息中心入口，用户无法查看与匹配对象的历史聊天记录
- 视频聊天界面缺少明确的结构化控制按钮（结束通话、发消息）
- 匹配流程过于直接，缺少让用户了解对方信息的缓冲环节

### 1.2 设计目标
1. **消息中心**: 在底部导航栏添加"消息"入口，统一管理所有聊天对话
2. **视频聊天优化**: 增加结束通话和发消息按钮，提升用户体验
3. **卡片式匹配**: 先展示匹配对象信息卡片，用户选择后开始视频通话

---

## 二、详细设计

### 2.1 改动一：底部导航栏添加"消息"入口

**文件**: `app/(tabs)/_layout.tsx`

**设计方案**:
- 在现有的两个标签页（匹配、个人中心）基础上，增加第三个标签页"消息"
- 标签页顺序：匹配 | 消息 | 个人中心
- "消息"标签页使用新路由 `/messages`（或复用现有的 `/matches`）
- 图标：使用 `message` 或 `chatbubble` 图标（emoji: 💬）

**实现要点**:
```typescript
// 新增 TabBarIcon 映射
'message': '💬',

// 新增 Tabs.Screen
<Tabs.Screen
  name="messages"
  options={{
    title: '消息',
    tabBarIcon: ({ color }) => (
      <TabBarIcon name="message" color={color} size={28}
    ),
  }}
/>
```

---

### 2.2 改动二：匹配界面增加结束通话和发消息按钮

**文件**: `app/(tabs)/index.tsx`

#### 2.2.1 结束通话按钮
- 位置：底部控制栏（与静音、关闭摄像头按钮并列）
- 样式：红色背景，区别于其他控制按钮
- 功能：点击后结束当前视频通话，返回空闲状态或匹配列表

#### 2.2.2 发消息按钮
- **定义**: 此处的"发消息"指发送持久化消息，区别于视频聊天中的临时消息
- 位置：视频聊天界面的显眼位置（可考虑在聊天输入框旁边）
- 功能:
  1. 点击后打开消息发送界面
  2. 消息保存到 AsyncStorage
  3. 消息可在"消息"标签页中查看
  4. 与视频聊天中的临时消息区分开

**数据结构**:
```typescript
type PersistentMessage = {
  id: string;
  conversationId: string;  // 会话 ID（由两个用户 ID 组成）
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
};
```

---

### 2.3 改动三：匹配流程改为卡片展示形式

**文件**: `app/(tabs)/index.tsx`

**新增状态**:
```typescript
type CallState = 'idle' | 'matching' | 'connected' | 'card_view';
// 在 matching 和 connected 之间增加 card_view 状态
```

**流程变化**:
```
当前流程: idle → matching → connected
新流程:   idle → matching → card_view → connected
```

**卡片视图设计**:

卡片显示内容：
- 对方头像（清晰大图）
- 姓名
- 专业/年级
- 兴趣爱好标签（可选）
- 个人简介（可选）

卡片操作按钮：
- `开始视频` 按钮：点击后进入 connected 状态，开始视频通话
- `下一个` 按钮：跳过当前匹配，重新进入 matching 状态

**实现要点**:
```typescript
const renderCardView = () => (
  <View style={styles.cardContainer}>
    <Image source={{ uri: partner.avatar }} style={styles.cardAvatar} />
    <Text style={styles.cardName}>{partner.name}</Text>
    <Text style={styles.cardMajor}>{partner.major}</Text>
    
    <View style={styles.cardActions}>
      <Pressable onPress={handleStartVideo} style={styles.startVideoButton}>
        <Ionicons name="videocam" size={24} color="#fff" />
        <Text>开始视频</Text>
      </Pressable>
      
      <Pressable onPress={handleNext} style={styles.nextButton}>
        <Ionicons name="shuffle" size={24} color={colors.text} />
        <Text>下一个</Text>
      </Pressable>
    </View>
  </View>
);
```

---

### 2.4 消息数据存储和管理

**文件**: `utils/MessageStorage.ts` (新建)

**功能**:
1. 使用 AsyncStorage 持久化存储消息
2. 提供消息的增删改查方法
3. 支持按会话 ID 获取消息列表
4. 支持获取所有会话列表（用于消息标签页）

**数据模型**:
```typescript
interface Message {
  id: string;
  conversationId: string;  // "user1_user2" 格式
  senderId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
}

interface Conversation {
  id: string;
  userId: string;        // 对方用户 ID
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}
```

**存储结构**:
```typescript
// AsyncStorage key 设计
@bnbu/messages_${conversationId}  // 存储会话消息列表
@bnbu/conversations               // 存储所有会话列表
```

---

## 三、文件修改清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/(tabs)/_layout.tsx` | 修改 | 添加第三个标签页"消息" |
| `app/(tabs)/index.tsx` | 修改 | 添加卡片视图、结束通话按钮、发消息按钮 |
| `app/messages.tsx` | 新建 | 消息中心页面 |
| `utils/MessageStorage.ts` | 新建 | 消息存储工具类 |
| `contexts/AuthContext.tsx` | 可能修改 | 如需要扩展用户信息 |
| `constants/Colors.ts` | 可能修改 | 添加新颜色 |

---

## 四、验证方案

1. **导航栏验证**: 确认底部导航栏显示三个标签，点击可正常切换
2. **卡片匹配验证**: 匹配成功后显示卡片视图，点击"开始视频"进入视频通话
3. **消息功能验证**: 
   - 在视频聊天中发送持久化消息
   - 切换到"消息"标签页可查看历史消息
   - 消息正确显示发送者、时间、内容

---

## 五、注意事项

1. **用户体验**: 卡片视图应提供足够的信息帮助用户决定是否开始视频
2. **性能**: 消息存储应考虑分页加载，避免一次性加载过多数据
3. **隐私**: 消息数据应妥善存储，考虑是否需要加密
4. **兼容性**: 确保修改不影响现有功能（如匹配列表、聊天页面）

---

## 六、后续扩展

1. 消息通知功能（推送通知）
2. 已读/未读状态管理
3. 消息撤回功能
4. 图片和表情支持
5. 卡片视图支持更多信息（如更多照片、详细资料）
