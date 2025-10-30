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
  GenerateMediaForAmbientResponse,
  ProfessionInfoRequest,
  ProfessionInfoResponse
} from '../types/vibe';

const BASE_URL = 'http://127.0.0.1:8000';

// Предопределенный список градиентов для профессий
const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple-Blue
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink-Red
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue-Cyan
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green-Teal
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Orange-Pink
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Violet-Pink
  'linear-gradient(135deg, #f83600 0%, #f9d423 100%)', // Red-Orange
  'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)', // Blue-Purple
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Mint-Aqua
  'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', // Sunset
  'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)', // Ocean
  'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', // Forest
  'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)', // Fire
  'linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)', // Sky
  'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)', // Rose
  'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)', // Gold
  'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)', // Lavender
  'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)', // Berry
  'linear-gradient(135deg, #16a085 0%, #f4d03f 100%)', // Emerald
  'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', // Coral
  'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', // Deep Purple
  'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', // Bright Blue
  'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)', // Warm Orange
  'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)', // Red Fire
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Navy Blue
  'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)', // Neon Purple
  'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', // Ice Blue
  'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', // Sunshine
  'linear-gradient(135deg, #d31027 0%, #ea384d 100%)', // Cherry Red
  'linear-gradient(135deg, #12c2e9 0%, #c471ed 100%)', // Cyan Purple
  'linear-gradient(135deg, #f5af19 0%, #f12711 100%)', // Fire Orange
  'linear-gradient(135deg, #7b4397 0%, #dc2430 100%)', // Purple Red
  'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)', // Turquoise
  'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', // Soft Pink
  'linear-gradient(135deg, #42275a 0%, #734b6d 100%)', // Dark Purple
  'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)', // Gray Steel
  'linear-gradient(135deg, #de6161 0%, #2657eb 100%)', // Red Blue
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', // Pink Sky
  'linear-gradient(135deg, #e96443 0%, #904e95 100%)', // Orange Purple
  'linear-gradient(135deg, #396afc 0%, #2948ff 100%)', // Royal Blue
];

// Функция для перемешивания массива градиентов (Fisher-Yates shuffle)
function shuffleGradients(seed: number = Date.now()): string[] {
  const shuffled = [...GRADIENTS];
  let currentIndex = shuffled.length;
  
  // Используем seed для воспроизводимого перемешивания
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
}

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

  const data: VibeGenerateResponse = await response.json();
  
  // Присваиваем случайные градиенты каждой профессии
  const shuffledGradients = shuffleGradients();
  data.professions = data.professions.map((profession, index) => ({
    ...profession,
    gradient: shuffledGradients[index % shuffledGradients.length]
  }));

  return data;
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

/**
 * Получить детальную информацию о профессии
 */
export async function getProfessionInfo(
  request: ProfessionInfoRequest
): Promise<ProfessionInfoResponse> {
  const response = await fetch(`${BASE_URL}/vibe/profession-info`, {
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
      throw new Error(error.detail || 'Ошибка получения информации о профессии');
    }
    if (response.status === 500) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка сервера при получении информации');
    }
    throw new Error('Ошибка при получении информации о профессии');
  }

  return response.json();
}

