// constants/ApiConfig.ts
export const API_BASE_URL = 'http://YOUR_IP:8080'; // 请替换为你的实际IP地址

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

// 通用响应类型
export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

// 存储token的函数
export const setAuthToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }
};

// 获取token的函数
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// 带认证的fetch包装器
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 如果认证失败，清除本地token
  if (response.status === 401) {
    setAuthToken(null);
  }

  return response;
};