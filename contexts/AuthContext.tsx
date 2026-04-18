// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginCredentials, LoginResponse, RegisterData, ApiResponse, setAuthToken, getAuthToken, API_BASE_URL } from '../constants/ApiConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  eduEmail: string | null;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<any>>;
  register: (userData: RegisterData) => Promise<ApiResponse<any>>;
  logout: () => void;
  isLoading: boolean;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [eduEmail, setEduEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时验证 token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const existingToken = await getAuthToken();
        if (existingToken) {
          // 验证 token 是否有效
          const res = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${existingToken}` }
          });
          if (res.ok) {
            const data: ApiResponse<{ userId: number; eduEmail: string }> = await res.json();
            if (data.code === 0) {
              setToken(existingToken);
              setUserId(data.data.userId);
              setEduEmail(data.data.eduEmail);
            } else {
              await setAuthToken(null); // 清除无效 token
            }
          } else {
            await setAuthToken(null); // 清除无效 token
          }
        }
      } catch (e) {
        console.error('Token validation failed:', e);
        // Token 验证失败时不清除，可能是网络问题
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
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
        await setAuthToken(authToken); // 保存到 AsyncStorage
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

  const logout = async () => {
    setToken(null);
    setUserId(null);
    setEduEmail(null);
    await setAuthToken(null); // 清除 AsyncStorage 中的 token
  };

  const validateToken = async (): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        await logout();
        return false;
      }
      return res.ok;
    } catch (e) {
      console.error('Token validation error:', e);
      return false;
    }
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
        isLoading,
        validateToken,
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
