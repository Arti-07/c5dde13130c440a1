// Context для доступа к авторизации из любого компонента

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types/auth';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Пытаемся загрузить пользователя из sessionStorage для мгновенного отображения
    const cachedUser = sessionStorage.getItem('user_cache');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Если есть кэш пользователя, загрузка будет быстрее
      const cachedUser = sessionStorage.getItem('user_cache');
      if (cachedUser) {
        setLoading(false);
      }
      
      getCurrentUser()
        .then((userData) => {
          setUser(userData);
          sessionStorage.setItem('user_cache', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          sessionStorage.removeItem('user_cache');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      sessionStorage.removeItem('user_cache');
      setLoading(false);
    }
  }, []);

  // Вход
  const login = async (username: string, password: string) => {
    const tokenData = await apiLogin({ username, password });
    localStorage.setItem('access_token', tokenData.access_token);
    const userData = await getCurrentUser();
    setUser(userData);
    sessionStorage.setItem('user_cache', JSON.stringify(userData));
  };

  // Регистрация
  const register = async (username: string, password: string) => {
    await apiRegister({ username, password });
    // После регистрации сразу логинимся
    await login(username, password);
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('user_cache');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования в компонентах
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
