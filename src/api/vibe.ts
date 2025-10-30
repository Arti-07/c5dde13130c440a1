// API запросы для генератора вайба

import type { 
  ProfessionCard, 
  VibeGenerateResponse,
  VibeQuestionsRequest,
  VibeQuestionsResponse
} from '../types/vibe';

const BASE_URL = 'http://127.0.0.1:8000';

// Получить токен из localStorage
function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Генерация персонализированных карточек профессий
 */
export async function generateProfessionCards(): Promise<VibeGenerateResponse> {
  const response = await fetch(`${BASE_URL}/vibe/generate`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.detail || 'Необходимо пройти тест личности или создать астрологический профиль');
    }
    if (response.status === 500) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка сервера при генерации карточек');
    }
    throw new Error('Ошибка при генерации карточек профессий');
  }

  return response.json();
}

/**
 * Получить уточняющие вопросы о выбранной профессии
 */
export async function getProfessionQuestions(professionTitle: string): Promise<VibeQuestionsResponse> {
  const response = await fetch(`${BASE_URL}/vibe/questions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ profession_title: professionTitle }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка получения вопросов');
    }
    if (response.status === 500) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка сервера при получении вопросов');
    }
    throw new Error('Ошибка при получении вопросов');
  }

  return response.json();
}

