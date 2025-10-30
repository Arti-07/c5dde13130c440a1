// API запросы для астрологического модуля

import type {
  AstrologyProfile,
  CreateAstrologyProfileRequest,
  DeleteAstrologyProfileResponse,
} from '../types/astrology';

const BASE_URL = 'http://127.0.0.1:8000';

// Получить токен из localStorage
function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Создание или обновление астрологического профиля
export async function createOrUpdateAstrologyProfile(
  data: CreateAstrologyProfileRequest
): Promise<AstrologyProfile> {
  const response = await fetch(`${BASE_URL}/astrology/profile`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.detail || 'Неверный формат данных');
    }
    if (response.status === 404) {
      throw new Error('Пользователь не найден');
    }
    throw new Error('Ошибка создания астрологического профиля');
  }

  return response.json();
}

// Получение астрологического профиля
export async function getAstrologyProfile(): Promise<AstrologyProfile> {
  const response = await fetch(`${BASE_URL}/astrology/profile`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 404) {
      throw new Error('Астрологический профиль не найден. Создайте его сначала.');
    }
    throw new Error('Ошибка загрузки астрологического профиля');
  }

  return response.json();
}

// Удаление астрологического профиля
export async function deleteAstrologyProfile(): Promise<DeleteAstrologyProfileResponse> {
  const response = await fetch(`${BASE_URL}/astrology/profile`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 404) {
      throw new Error('Астрологический профиль не найден');
    }
    throw new Error('Ошибка удаления астрологического профиля');
  }

  return response.json();
}

