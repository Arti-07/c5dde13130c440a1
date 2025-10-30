const API_URL = 'http://localhost:8000';

export interface ImageGenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
  style?: string | null;
  negative_prompt?: string | null;
}

export interface ImageGenerateResponse {
  image_base64: string;
  prompt: string;
  width: number;
  height: number;
  style: string | null;
}

export interface StyleInfo {
  name: string;
  title: string;
  titleEn: string;
  image: string;
}

export interface StylesResponse {
  styles: StyleInfo[];
  total: number;
}

export interface ServiceStatus {
  available: boolean;
  status: string;
}

export async function generateImage(
  token: string,
  data: ImageGenerateRequest
): Promise<ImageGenerateResponse> {
  const response = await fetch(`${API_URL}/images/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка генерации изображения');
  }

  return await response.json();
}

export async function getStyles(token: string): Promise<StylesResponse> {
  const response = await fetch(`${API_URL}/images/styles`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка получения стилей');
  }

  return await response.json();
}

export async function checkServiceStatus(token: string): Promise<ServiceStatus> {
  const response = await fetch(`${API_URL}/images/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка проверки статуса');
  }

  return await response.json();
}

