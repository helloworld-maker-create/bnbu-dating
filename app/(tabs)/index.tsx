import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 通话状态枚举
type CallState = 'idle' | 'matching' | 'connected';

// 聊天消息类型
type ChatMessage = {
  id: string;
  text: string;
  isSelf: boolean;
  timestamp: Date;
};

// 模拟对方数据
const MOCK_PARTNER = {
  id: '1',
  name: '对方',
  avatar: 'https://picsum.photos/400/400?random=1',
};

export default function VideoCallScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // 状态管理
  const [callState, setCallState] = useState<CallState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [blurLevel, setBlurLevel] = useState(20); // 模糊级别 (0-20)
  const [messageCount, setMessageCount] = useState(0); // 消息计数
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  // 动画引用
  const snowOpacity = useRef(new Animated.Value(1)).current;
  const dotsRotation = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(20)).current;

  // 雪花动画
  useEffect(() => {
    if (callState === 'idle') {
      const animate = () => {
        Animated.sequence([
          Animated.timing(snowOpacity, {
            toValue: 0.7,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(snowOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      animate();
    }
  }, [callState]);

  // 加载点旋转动画
  useEffect(() => {
    if (callState === 'matching') {
      Animated.loop(
        Animated.timing(dotsRotation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [callState]);

  // 模糊动画
  useEffect(() => {
    Animated.timing(blurAnim, {
      toValue: blurLevel,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [blurLevel]);

  // 模拟匹配成功
  useEffect(() => {
    if (callState === 'matching') {
      const timer = setTimeout(() => {
        setCallState('connected');
        // 模拟对方发送第一条消息
        setTimeout(() => {
          addMessage('你好呀！很高兴认识你～', false);
        }, 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [callState]);

  // 检查是否应该清除模糊
  useEffect(() => {
    if (messageCount >= 10 && blurLevel > 0) {
      const timer = setTimeout(() => {
        setBlurLevel(prev => Math.max(0, prev - 2));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messageCount, blurLevel]);

  // 添加消息
  const addMessage = (text: string, isSelf: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isSelf,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    if (isSelf) {
      setMessageCount(prev => prev + 1);
      // 模拟对方回复
      simulateReply();
    }
  };

  // 模拟对方回复
  const simulateReply = () => {
    const replies = [
      '哈哈，真的吗？',
      '我也是！',
      '好巧啊～',
      '你在哪个校区呀？',
      '这是什么专业？',
      '听起来很有趣！',
    ];
    setTimeout(() => {
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      addMessage(randomReply, false);
    }, 1500 + Math.random() * 1000);
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), true);
      setInputText('');
    }
  };

  // 处理开始匹配
  const handleStart = () => {
    setCallState('matching');
    setMessages([]);
    setMessageCount(0);
    setBlurLevel(20);
  };

  // 处理停止/下一个
  const handleStop = () => {
    if (callState === 'connected') {
      setCallState('matching');
      setMessages([]);
      setMessageCount(0);
      setBlurLevel(20);
    } else {
      setCallState('idle');
    }
  };

  // 渲染雪花效果
  const renderSnowEffect = () => {
    // 生成随机雪花点
    const snowflakes = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));

    return (
      <View style={styles.snowContainer}>
        {snowflakes.map(flake => (
          <View
            key={flake.id}
            style={[
              styles.snowflake,
              {
                left: flake.left,
                opacity: 0.3 + Math.random() * 0.5,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // 渲染加载点
  const renderLoadingDots = () => {
    const dots = Array.from({ length: 6 }, (_, i) => i);
    return (
      <View style={styles.loadingDotsContainer}>
        {dots.map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const radius = 40;
          return (
            <View
              key={i}
              style={[
                styles.loadingDot,
                {
                  transform: [
                    {
                      rotate: dotsRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                    {
                      translateX: Math.cos(angle) * radius,
                    },
                    {
                      translateY: Math.sin(angle) * radius,
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // 渲染视频画面
  const renderVideoView = (isRemote: boolean, showBlur: boolean) => {
    const blurStyle = showBlur
      ? { filter: `blur(${blurLevel}px)` }
      : {};

    return (
      <View style={styles.videoView}>
        <Image
          source={{ uri: MOCK_PARTNER.avatar }}
          style={[styles.videoImage, blurStyle]}
          resizeMode="cover"
        />
        {showBlur && blurLevel > 10 && (
          <View style={styles.blurOverlay}>
            <Ionicons name="eye-off" size={32} color="rgba(255,255,255,0.8)" />
            <Text style={styles.blurText}>聊更多以看清对方</Text>
          </View>
        )}
      </View>
    );
  };

  // 渲染空闲状态 (类似 Ome TV 左侧)
  const renderIdleScreen = () => (
    <View style={[styles.screenContainer, { backgroundColor: '#1a1a1a' }]}>
      {renderSnowEffect()}

      {/* Ome TV 风格的 Logo */}
      <View style={styles.logoContainer}>
        <View style={[styles.tvIcon, { backgroundColor: colors.primary }]}>
          <View style={styles.tvAntenna}>
            <View style={styles.antennaLeft} />
            <View style={styles.antennaRight} />
          </View>
          <View style={styles.tvScreen}>
            <Text style={styles.tvText}>Date</Text>
            <Text style={[styles.tvText, { color: '#4CAF50', fontSize: 20 }]}>BNBU</Text>
          </View>
          <View style={styles.tvButtons}>
            <View style={styles.tvButton} />
            <View style={styles.tvButton} />
          </View>
        </View>
        <Text style={styles.logoText}>Date in BNBU</Text>
      </View>

      {/* 在线人数 */}
      <View style={styles.onlineCount}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineText}>293,025 用户在线</Text>
      </View>

      {/* 开始按钮 */}
      <Pressable
        onPress={handleStart}
        style={[styles.startButtonLarge, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={styles.startButtonText}>开始</Text>
      </Pressable>
    </View>
  );

  // 渲染匹配中状态
  const renderMatchingScreen = () => (
    <View style={[styles.screenContainer, { backgroundColor: '#1a1a1a' }]}>
      <View style={styles.matchingCenter}>
        {renderLoadingDots()}
        <Text style={styles.matchingText}>正在匹配...</Text>
        <Text style={styles.matchingSubtext}>寻找合适的 TA</Text>
      </View>
    </View>
  );

  // 渲染通话中状态 (类似 Ome TV 右侧)
  const renderConnectedScreen = () => {
    const isBlurred = blurLevel > 0;

    return (
      <View style={styles.connectedContainer}>
        {/* 视频区域 - 上下分屏 */}
        <View style={styles.videoSplitContainer}>
          {/* 上方：自己的摄像头 */}
          <View style={styles.localVideoContainer}>
            <View style={[styles.videoPlaceholder, { backgroundColor: '#2a2a2a' }]}>
              {isCameraOff ? (
                <Ionicons name="videocam-off" size={48} color="#666" />
              ) : (
                <>
                  <View style={styles.cameraPlaceholderContent}>
                    <Ionicons name="person" size={60} color="#444" />
                  </View>
                  <Text style={styles.videoLabel}>你</Text>
                </>
              )}
            </View>
            {/* 静音指示器 */}
            {isMuted && (
              <View style={styles.muteBadge}>
                <Ionicons name="mic-off" size={14} color="#fff" />
              </View>
            )}
          </View>

          {/* 分隔线 */}
          <View style={styles.separatorLine} />

          {/* 下方：对方的摄像头 */}
          <View style={styles.remoteVideoContainer}>
            {callState === 'matching' ? (
              <View style={[styles.videoPlaceholder, { backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' }]}>
                {renderLoadingDots()}
                <Text style={styles.videoLabel}>匹配中...</Text>
              </View>
            ) : (
              <>
                {renderVideoView(true, isBlurred)}
                {isBlurred && (
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                      已发送 {messageCount}/10 条消息
                    </Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${Math.min(100, (messageCount / 10) * 100)}%` },
                        ]}
                      />
                    </View>
                  </View>
                )}
                {!isBlurred && (
                  <View style={styles.unblurredBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.unblurredText}>已解锁清晰画面</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* 聊天区域 */}
        <View style={styles.chatContainer}>
          <ScrollView
            style={styles.messagesScrollView}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.isSelf
                    ? { backgroundColor: colors.primary, alignSelf: 'flex-end' }
                    : { backgroundColor: '#3a3a3a', alignSelf: 'flex-start' },
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          {/* 输入框 */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: '#3a3a3a', color: colors.text },
              ]}
              placeholder="写一条消息..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              blurOnSubmit={false}
              onFocus={() => setShowKeyboard(true)}
              onBlur={() => setShowKeyboard(false)}
            />
            <Pressable onPress={handleSendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* 底部控制栏 */}
        <View style={styles.bottomControls}>
          <Pressable
            onPress={() => setIsMuted(!isMuted)}
            style={[
              styles.controlBtn,
              isMuted ? { backgroundColor: '#ff4444' } : { backgroundColor: '#3a3a3a' },
            ]}
          >
            <Ionicons
              name={isMuted ? 'mic-off' : 'mic'}
              size={24}
              color="#fff"
            />
          </Pressable>

          <Pressable
            onPress={() => setIsCameraOff(!isCameraOff)}
            style={[
              styles.controlBtn,
              isCameraOff ? { backgroundColor: '#ff4444' } : { backgroundColor: '#3a3a3a' },
            ]}
          >
            <Ionicons
              name={isCameraOff ? 'videocam-off' : 'videocam'}
              size={24}
              color="#fff"
            />
          </Pressable>

          <Pressable
            onPress={handleStop}
            style={[styles.controlBtn, { backgroundColor: '#ff6b6b' }]}
          >
            <Text style={styles.stopButtonText}>
              {callState === 'connected' ? '下一个' : '停止'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {callState === 'idle' && renderIdleScreen()}
      {callState === 'matching' && renderMatchingScreen()}
      {callState === 'connected' && renderConnectedScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screenContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // 雪花效果
  snowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  snowflake: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    top: -10,
  },

  // Logo 区域
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  tvIcon: {
    width: 140,
    height: 100,
    borderRadius: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tvAntenna: {
    position: 'absolute',
    top: -20,
    flexDirection: 'row',
  },
  antennaLeft: {
    width: 3,
    height: 20,
    backgroundColor: '#fff',
    transform: [{ rotate: '-30deg' }],
    marginLeft: 30,
  },
  antennaRight: {
    width: 3,
    height: 20,
    backgroundColor: '#fff',
    transform: [{ rotate: '30deg' }],
    marginRight: 30,
  },
  tvScreen: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tvText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#D4A574',
  },
  tvButtons: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    flexDirection: 'row',
    gap: 6,
  },
  tvButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 15,
  },

  // 在线人数
  onlineCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 30,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  onlineText: {
    color: '#aaa',
    fontSize: 14,
  },

  // 开始按钮
  startButtonLarge: {
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },

  // 匹配中
  matchingCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDotsContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4A574',
  },
  matchingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  matchingSubtext: {
    color: '#888',
    fontSize: 14,
  },

  // 通话中
  connectedContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoSplitContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  localVideoContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#333',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPlaceholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  muteBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ff4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  blurText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  // 进度条
  progressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  progressText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  unblurredBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unblurredText: {
    color: '#fff',
    fontSize: 13,
  },

  // 聊天区域
  chatContainer: {
    height: 200,
    backgroundColor: '#2a2a2a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  messagesScrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messagesContent: {
    paddingVertical: 10,
    gap: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 底部控制栏
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 15,
    backgroundColor: '#2a2a2a',
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
