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

