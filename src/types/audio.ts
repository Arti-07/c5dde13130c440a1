// Типы для аудио API

// Запрос на генерацию звукового эффекта
export interface GenerateSoundRequest {
  text: string;
  duration_seconds?: number;
  prompt_influence?: number;
  loop?: boolean;
}

// Запрос на преобразование текста в речь
export interface TextToSpeechRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
}

// Ответ от аудио API
export interface AudioResponse {
  message: string;
  file_path: string;
}

// Популярные голоса для TTS
// @ts-ignore
export enum VoiceId {
  GEORGE = 'JBFqnCBsd6RMkjVDRZzb',
  RACHEL = '21m00Tcm4TlvDq8ikWAM',
  ADAM = 'pNInz6obpgDQGcFmaJgB',
  BELLA = 'EXAVITQu4vr4xnSDxMaL',
  ANTONI = 'ErXwobaYiN019PkySvjV',
}

// Модели для TTS
// @ts-ignore
export enum ModelId {
  MULTILINGUAL_V2 = 'eleven_multilingual_v2',
  TURBO_V2 = 'eleven_turbo_v2',
  MONOLINGUAL_V1 = 'eleven_monolingual_v1',
}

