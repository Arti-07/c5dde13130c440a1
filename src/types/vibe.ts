export interface ProfessionCard {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  basedOn: string[];
  icon: string;
  gradient: string;
}

export interface VibeGenerateResponse {
  professions: ProfessionCard[];
  total_count: number;
  has_personality_data: boolean;
  has_astrology_data: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  allow_custom_answer: boolean;
  options: QuestionOption[];
}

export interface VibeQuestionsRequest {
  profession_title: string;
}

export interface VibeQuestionsResponse {
  questions: ClarifyingQuestion[];
}

export interface ProfessionValidateRequest {
  profession_title: string;
}

export interface ProfessionValidateResponse {
  is_valid: boolean;
  status: 'valid' | 'invalid' | 'too_general' | 'rare' | 'obsolete';
  message: string;
  suggestions: string[];
  found_count: number;
  sample_vacancies: string[];
  hh_total_found: number;
  query: string;
}

export interface AmbientEnvironment {
  id: string;
  name: string;
  text: string;
  image_prompt?: string;
  sound_prompt?: string;
  voice?: string;
}

export interface ProfessionTools {
  title: string;
  items: string[];
}

export interface QuestionAnswer {
  question_id: string;
  question_text: string;
  answer: string;
}

export interface AmbientsGenerateRequest {
  profession_title: string;
  question_answers: QuestionAnswer[];
}

export interface AmbientsGenerateResponse {
  profession_title: string;
  ambients: AmbientEnvironment[];
  tools: ProfessionTools;
}

export interface AmbientEnvironmentWithMedia {
  id: string;
  name: string;
  text: string;
  image_prompt?: string;
  image_path?: string;
  image_error?: string;
  sound_prompt?: string;
  sound_path?: string;
  sound_error?: string;
  voice?: string;
  voice_path?: string;
  voice_error?: string;
}

export interface AmbientsWithMediaRequest {
  profession_title: string;
  question_answers: QuestionAnswer[];
  use_template?: boolean;
}

export interface AmbientsWithMediaResponse {
  profession_title: string;
  ambients: AmbientEnvironmentWithMedia[];
  tools: ProfessionTools;
  json_path: string;
  generation_stats: {
    images_generated: number;
    images_failed: number;
    sounds_generated: number;
    sounds_failed: number;
    voices_generated: number;
    voices_failed: number;
  };
}

export interface GenerateMediaForAmbientRequest {
  ambient_id: string;
  image_prompt?: string;
  sound_prompt?: string;
  voice_text?: string;
  use_template?: boolean;
}

export interface GenerateMediaForAmbientResponse {
  ambient_id: string;
  image_path?: string;
  image_error?: string;
  sound_path?: string;
  sound_error?: string;
  voice_path?: string;
  voice_error?: string;
}

export interface ProfessionInfoRequest {
  profession_title: string;
  profession_description?: string;
}

export interface ProfessionInfoCard {
  id: string;
  type: string;
  title: string;
  icon: string;
  content: Record<string, unknown>;
}

export interface ProfessionInfoResponse {
  profession_title: string;
  cards: ProfessionInfoCard[];
}

