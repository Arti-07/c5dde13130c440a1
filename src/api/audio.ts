// API запросы для аудио модуля

import type {
  GenerateSoundRequest,
  TextToSpeechRequest,
  AudioResponse,
} from '../types/audio';

const BASE_URL = 'http://localhost:8000';

// Генерация звукового эффекта
export async function generateSound(
  data: GenerateSoundRequest
): Promise<string> {
  const response = await fetch(`${BASE_URL}/audio/generate-sound`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка генерации звука');
  }

  const result: AudioResponse = await response.json();
  
  // file_path уже содержит только имя файла
  return `${BASE_URL}/audio/download/${result.file_path}`;
}

// Преобразование текста в речь
export async function textToSpeech(
  data: TextToSpeechRequest
): Promise<string> {
  const response = await fetch(`${BASE_URL}/audio/text-to-speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ошибка генерации речи');
  }

  const result: AudioResponse = await response.json();
  
  // file_path уже содержит только имя файла
  return `${BASE_URL}/audio/download/${result.file_path}`;
}

// Вспомогательная функция для воспроизведения аудио
export function playAudio(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  audio.play();
  return audio;
}

// Вспомогательная функция для скачивания аудио
export function downloadAudio(url: string, filename: string = 'audio.mp3'): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}

