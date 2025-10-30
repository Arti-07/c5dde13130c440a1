// Все API запросы к бэкенду

import type { User, LoginRequest, RegisterRequest, TokenResponse } from '../types/auth';

const BASE_URL = 'http://127.0.0.1:8000';

// Регистрация нового пользователя
export async function register(data: RegisterRequest): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка регистрации');
  }

  return response.json();
}

// Авторизация (вход)
export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка входа');
  }

  return response.json();
}

// Получение данных текущего пользователя
export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Токен не найден');
  }

  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      throw new Error('Необходима авторизация');
    }
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка получения данных');
  }

  return response.json();
}
