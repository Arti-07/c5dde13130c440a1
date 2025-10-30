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
  options: QuestionOption[];
}

export interface VibeQuestionsRequest {
  profession_title: string;
}

export interface VibeQuestionsResponse {
  questions: ClarifyingQuestion[];
}

