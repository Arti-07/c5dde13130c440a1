// API запросы для генератора вайба

import type { 
  VibeGenerateResponse,
  VibeQuestionsResponse,
  ProfessionValidateResponse,
  AmbientsGenerateRequest,
  AmbientsGenerateResponse,
  AmbientsWithMediaRequest,
  AmbientsWithMediaResponse,
  GenerateMediaForAmbientRequest,
  GenerateMediaForAmbientResponse
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

/**
 * Валидация профессии через API HH.ru
 */
export async function validateProfession(professionTitle: string): Promise<ProfessionValidateResponse> {
  const response = await fetch(`${BASE_URL}/vibe/validate`, {
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
      throw new Error(error.detail || 'Ошибка валидации профессии');
    }
    if (response.status === 500) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка сервера при валидации профессии');
    }
    throw new Error('Ошибка при валидации профессии');
  }

  return response.json();
}

/**
 * Генерация окружений (амбиентов) для выбранной профессии
 */
export async function generateProfessionAmbients(
  professionTitle: string,
  questionAnswers: AmbientsGenerateRequest['question_answers']
): Promise<AmbientsGenerateResponse> {
  const response = await fetch(`${BASE_URL}/vibe/ambients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      profession_title: professionTitle,
      question_answers: questionAnswers
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка генерации окружений');
    }
    if (response.status === 500) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка сервера при генерации окружений');
    }
    throw new Error('Ошибка при генерации окружений профессии');
  }

  return response.json();
}

/**
 * Генерация окружений с медиа файлами (изображения, звуки, голоса)
 */
export async function generateProfessionAmbientsWithMedia(
  professionTitle: string,
  questionAnswers: AmbientsWithMediaRequest['question_answers'],
  useTemplate: boolean = false
): Promise<AmbientsWithMediaResponse> {
  const response = await fetch(`${BASE_URL}/vibe/ambients-with-media`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      profession_title: professionTitle,
      question_answers: questionAnswers,
      use_template: useTemplate
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка генерации окружений с медиа');
    }
    if (response.status === 500) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка сервера при генерации окружений с медиа');
    }
    throw new Error('Ошибка при генерации окружений профессии с медиа');
  }

  return response.json();
}

/**
 * Генерация медиа для конкретного окружения
 */
export async function generateMediaForAmbient(
  request: GenerateMediaForAmbientRequest
): Promise<GenerateMediaForAmbientResponse> {
  const response = await fetch(`${BASE_URL}/vibe/generate-ambient-media`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка генерации медиа');
    }
    if (response.status === 500) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка сервера при генерации медиа');
    }
    throw new Error('Ошибка при генерации медиа');
  }

  return response.json();
}

/**
 * Получить URL для медиа файла
 */
export function getMediaUrl(mediaPath: string): string {
  const token = localStorage.getItem('access_token');
  return `${BASE_URL}/vibe/media/${mediaPath.replace('ambients/', '')}?token=${token}`;
}

