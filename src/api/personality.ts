// API запросы для теста личности

import type {
  QuestionsResponse,
  SubmitTestRequest,
  PersonalityResult,
} from '../types/personality';

const BASE_URL = 'http://127.0.0.1:8000';

// Получить токен из localStorage
function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Получение вопросов теста
export async function getPersonalityQuestions(): Promise<QuestionsResponse> {
  const response = await fetch(`${BASE_URL}/personality/questions`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    throw new Error('Ошибка загрузки вопросов');
  }

  return response.json();
}

// Отправка ответов теста
export async function submitPersonalityTest(
  data: SubmitTestRequest
): Promise<PersonalityResult> {
  const response = await fetch(`${BASE_URL}/personality/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка отправки теста');
  }

  return response.json();
}

// Получение последнего результата
export async function getLatestPersonalityResult(): Promise<PersonalityResult> {
  const response = await fetch(`${BASE_URL}/personality/latest`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Результаты теста не найдены. Пройдите тест сначала.');
    }
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    throw new Error('Ошибка загрузки результата');
  }

  return response.json();
}

// Получение всех результатов пользователя
export async function getAllPersonalityResults(): Promise<PersonalityResult[]> {
  const response = await fetch(`${BASE_URL}/personality/results`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    throw new Error('Ошибка загрузки результатов');
  }

  return response.json();
}

// Удаление результата по ID
export async function deletePersonalityResult(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/personality/result/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 404) {
      throw new Error('Результат не найден');
    }
    throw new Error('Ошибка удаления результата');
  }
}

// Удаление всех результатов
export async function deleteAllPersonalityResults(): Promise<void> {
  const response = await fetch(`${BASE_URL}/personality/results`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    throw new Error('Ошибка удаления результатов');
  }
}
