// constants/ApiConfig.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// API 基础地址 - 支持环境变量配置
export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  __DEV__ ? 'http://192.168.1.100:8080' : 'https://api.bnbu-dating.com';

// 认证相关的类型定义
export interface LoginCredentials {
  eduEmail: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    userId: number;
    eduEmail: string;
  };
}

export interface RegisterData {
  eduEmail: string;
  password: string;
}

export interface UserProfile {
  id: string;
  userId?: string;
  nickname: string;
  major: string;
  gpaLevel: string;
  hobbies: string[] | string;
  goals: string[] | string;
}

// 通用响应类型
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

// 存储 token 的函数
export const setAuthToken = async (token: string | null): Promise<void> => {
  try {
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      await AsyncStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

// 获取 token 的函数
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

// 带认证的 fetch 包装器
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 如果认证失败，清除本地 token
  if (response.status === 401) {
    await setAuthToken(null);
  }

  return response;
};
