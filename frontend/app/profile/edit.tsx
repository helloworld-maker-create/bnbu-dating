import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

// 可选的兴趣爱好
const HOBBY_OPTIONS = [
  '编程', '阅读', '运动', '音乐', '旅行', '摄影',
  '美食', '电影', '游戏', '绘画', '手工', '舞蹈',
  '棋类', '咖啡', '户外', '展览', '健身', '学习'
];

// 职业方向选项
const GOAL_OPTIONS = [
  '交友', '恋爱', '学习', '交流', '创业', '合作'
];

// GPA 选项
const GPA_OPTIONS = [
  '请选择 GPA',
  '4.0-5.0',
  '3.5-4.0',
  '3.0-3.5',
  '2.5-3.0',
  '2.0-2.5',
  '2.0 以下'
];

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { isAuthenticated, eduEmail } = useAuth();

  const [avatar, setAvatar] = useState('https://picsum.photos/200/200?random=avatar');
  const [nickname, setNickname] = useState('');
  const [major, setMajor] = useState('');
  const [gpaLevel, setGpaLevel] = useState('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 切换兴趣爱好选择
  const toggleHobby = (hobby: string) => {
    setSelectedHobbies(prev =>
      prev.includes(hobby)
        ? prev.filter(h => h !== hobby)
        : [...prev, hobby]
    );
  };

  // 切换职业方向选择
  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  // 保存资料
  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '请填写昵称');
      return;
    }
    if (!major.trim()) {
      Alert.alert('提示', '请填写专业');
      return;
    }
    if (!gpaLevel) {
      Alert.alert('提示', '请选择 GPA 范围');
      return;
    }

    setIsSaving(true);

    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    Alert.alert('成功', '资料已保存', [
      { text: '确定', onPress: () => router.back() }
    ]);
  };

  // 选择头像（模拟）
  const handleSelectAvatar = () => {
    Alert.alert('选择头像', '请选择头像来源', [
      { text: '拍照', onPress: () => Alert.alert('提示', '拍照功能开发中') },
      { text: '从相册选择', onPress: () => Alert.alert('提示', '相册功能开发中') },
      { text: '取消', style: 'cancel' }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 头部导航 */}
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>编辑资料</Text>
        <Pressable
          onPress={handleSave}
          style={styles.headerButton}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={[styles.saveText, { color: colors.primary }]}>保存</Text>
          )}
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 头像区域 */}
        <View style={[styles.avatarSection, { backgroundColor: colors.cardBackground }]}>
          <Pressable onPress={handleSelectAvatar} style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={[styles.avatarOverlay, { backgroundColor: colors.shadow }]}>
              <Ionicons name="camera" size={24} color="#fff" />
            </View>
          </Pressable>
          <Text style={[styles.avatarHint, { color: colors.textMuted }]}>点击更换头像</Text>
        </View>

        {/* 基本信息 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>基本信息</Text>

          {/* 昵称 */}
          <View style={[styles.inputRow, { borderBottomColor: colors.separator }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>昵称</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="请输入昵称"
              placeholderTextColor={colors.textMuted}
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
            />
          </View>

          {/* 专业 */}
          <View style={[styles.inputRow, { borderBottomColor: colors.separator }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>专业</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="请输入专业"
              placeholderTextColor={colors.textMuted}
              value={major}
              onChangeText={setMajor}
            />
          </View>

          {/* GPA 选择 */}
          <View style={[styles.inputRow, { borderBottomColor: colors.separator }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>GPA 范围</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gpaLevel}
                onValueChange={setGpaLevel}
                style={styles.picker}
              >
                {GPA_OPTIONS.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* 兴趣爱好 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>兴趣爱好</Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>选择你的兴趣爱好（可多选）</Text>
          <View style={styles.tagsContainer}>
            {HOBBY_OPTIONS.map((hobby) => (
              <Pressable
                key={hobby}
                onPress={() => toggleHobby(hobby)}
                style={[
                  styles.tag,
                  {
                    backgroundColor: selectedHobbies.includes(hobby)
                      ? colors.primary
                      : colors.tagBackground
                  }
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: selectedHobbies.includes(hobby) ? '#fff' : colors.tagText }
                  ]}
                >
                  {hobby}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 职业方向 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>职业方向/目标</Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>选择你的目标（可多选）</Text>
          <View style={styles.tagsContainer}>
            {GOAL_OPTIONS.map((goal) => (
              <Pressable
                key={goal}
                onPress={() => toggleGoal(goal)}
                style={[
                  styles.tag,
                  {
                    backgroundColor: selectedGoals.includes(goal)
                      ? colors.primary
                      : colors.tagBackground
                  }
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: selectedGoals.includes(goal) ? '#fff' : colors.tagText }
                  ]}
                >
                  {goal}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 个人简介 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>个人简介</Text>
          <TextInput
            style={[styles.bioInput, { color: colors.text, borderColor: colors.separator }]}
            placeholder="介绍一下自己吧～"
            placeholderTextColor={colors.textMuted}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textMuted }]}>{bio.length}/200</Text>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 13,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHint: {
    fontSize: 13,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 15,
    width: 80,
  },
  input: {
    flex: 1,
    fontSize: 15,
    textAlign: 'right',
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 16,
  },
  picker: {
    height: 40,
    marginLeft: -10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bioInput: {
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});
