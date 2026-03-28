// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginCredentials, LoginResponse, RegisterData, ApiResponse, setAuthToken, getAuthToken, authenticatedFetch } from '../constants/ApiConfig';
import { API_BASE_URL } from '../app/(tabs)/index';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  eduEmail: string | null;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<any>>;
  register: (userData: RegisterData) => Promise<ApiResponse<any>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [eduEmail, setEduEmail] = useState<string | null>(null);

  useEffect(() => {
    // 页面加载时检查是否有现有的认证信息
    const existingToken = getAuthToken();
    if (existingToken) {
      setToken(existingToken);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await response.json();

      if (data.code === 0 && data.data && data.data.token) {
        const authToken = data.data.token;
        setToken(authToken);
        setUserId(data.data.userId);
        setEduEmail(data.data.eduEmail);
        setAuthToken(authToken); // 保存到localStorage
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        code: -1,
        message: error instanceof Error ? error.message : '登录请求失败',
        data: null,
      };
    }
  };

  const register = async (userData: RegisterData): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<any> = await response.json();
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        code: -1,
        message: error instanceof Error ? error.message : '注册请求失败',
        data: null,
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setEduEmail(null);
    setAuthToken(null); // 清除localStorage中的token
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        userId,
        eduEmail,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};