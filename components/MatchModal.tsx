// components/MatchModal.tsx - 匹配成功弹窗
// 遵循 UX 设计报告 4.2 节规范
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  onSendMessage: () => void;
  currentUser: {
    name: string;
    avatar: string;
  };
  matchedUser: {
    name: string;
    avatar: string;
  };
  colors: typeof Colors.light;
}

const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  onClose,
  onSendMessage,
  currentUser,
  matchedUser,
  colors,
}) => {
  // 动画引用
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  // 入场动画
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 深色遮罩背景 */}
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: 'rgba(26,14,8,0.7)',
            opacity: fadeAnim,
          },
        ]}
      >
        {/* 模糊层 */}
        <View style={styles.blurContainer}>
          {/* 模态框内容 */}
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.primary,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* 标题 */}
            <Text style={[styles.title, { color: colors.primary }]}>It's a Match!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              你和 {matchedUser.name} 互相喜欢了对方
            </Text>

            {/* 头像并排 + 爱心分隔 */}
            <View style={styles.avatarsContainer}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: currentUser.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>

              {/* 爱心分隔符 */}
              <View style={[styles.heartSeparator, { backgroundColor: colors.primary }]}>
                <Ionicons name="heart" size={24} color="#fff" />
              </View>

              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: matchedUser.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* 操作按钮 */}
            <View style={styles.actionsContainer}>
              {/* 发送消息按钮 */}
              <Pressable
                onPress={onSendMessage}
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="chatbubble" size={20} color="#fff" />
                <Text style={styles.sendButtonText}>Send a Message</Text>
              </Pressable>

              {/* 继续浏览按钮 */}
              <Pressable
                onPress={onClose}
                style={[styles.keepBrowsingButton, { borderColor: colors.primary }]}
              >
                <Text style={[styles.keepBrowsingText, { color: colors.primary }]}>
                  Keep Browsing
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#6B4226',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0 8px 24px rgba(107,66,38,0.3)',
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#C4A882',
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  heartSeparator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#6B4226',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 8px rgba(107,66,38,0.3)',
      },
    }),
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  keepBrowsingButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepBrowsingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MatchModal;
