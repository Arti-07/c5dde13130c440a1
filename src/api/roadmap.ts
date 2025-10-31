// API для Career Roadmap
import type { RoadmapGenerateRequest, RoadmapGenerateResponse } from '../types/roadmap';

const API_URL = 'http://127.0.0.1:8000';

// Получить заголовки с токеном
function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Генерация roadmap
export async function generateRoadmap(
  professionTitle: string,
  currentLevel?: string
): Promise<RoadmapGenerateResponse> {
  const requestData: RoadmapGenerateRequest = {
    profession_title: professionTitle,
    current_level: currentLevel as any,
  };

  const response = await fetch(`${API_URL}/roadmap/generate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (response.status === 404) {
      throw new Error('Пользователь не найден');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Ошибка генерации roadmap');
  }

  const data = await response.json();
  
  // Поддержка snake_case с бэка (если бэк отправляет interview_questions вместо interviewQuestions)
  if (data.roadmap?.stages) {
    data.roadmap.stages = data.roadmap.stages.map((stage: any) => ({
      ...stage,
      interviewQuestions: stage.interviewQuestions || stage.interview_questions || []
    }));
  }
  
  return data;
}

// Health check
export async function checkRoadmapHealth(): Promise<{ status: string; service: string; message: string }> {
  const response = await fetch(`${API_URL}/roadmap/health`);
  
  if (!response.ok) {
    throw new Error('Сервис roadmap недоступен');
  }
  
  return response.json();
}

