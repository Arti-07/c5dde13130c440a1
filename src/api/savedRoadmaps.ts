// API для работы с сохранёнными roadmaps
import type { ProfessionRoadmap } from '../types/roadmap';

const API_URL = 'http://127.0.0.1:8000';

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export interface SavedRoadmap {
  id: string;
  profession_title: string;
  roadmap: ProfessionRoadmap;
  created_at: string;
  updated_at: string;
}

export interface SavedRoadmapsResponse {
  roadmaps: SavedRoadmap[];
  total_count: number;
}

// Получить все сохранённые roadmaps
export async function getAllSavedRoadmaps(): Promise<SavedRoadmapsResponse> {
  const response = await fetch(`${API_URL}/roadmap/saved`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки roadmaps');
  }

  return response.json();
}

// Получить конкретный roadmap
export async function getSavedRoadmap(professionTitle: string): Promise<SavedRoadmap> {
  const response = await fetch(
    `${API_URL}/roadmap/saved/${encodeURIComponent(professionTitle)}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Roadmap не найден');
    }
    throw new Error('Ошибка загрузки roadmap');
  }

  return response.json();
}

// Удалить roadmap
export async function deleteSavedRoadmap(roadmapId: string): Promise<void> {
  const response = await fetch(`${API_URL}/roadmap/saved/${roadmapId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка удаления roadmap');
  }
}

