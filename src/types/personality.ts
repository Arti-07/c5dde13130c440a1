// Типы для теста личности

export interface Question {
  id: number;
  question: string;
  dimension: string;
  reverse: boolean;
}

export interface QuestionsResponse {
  questions: Question[];
  total_questions: number;
}

export interface Answer {
  question_id: number;
  answer: number;
}

export interface SubmitTestRequest {
  answers: Answer[];
}

export interface PersonalityResult {
  id: number;
  user_id: string;
  personality_type: string;
  code: string;
  mind_score: number;
  energy_score: number;
  nature_score: number;
  tactics_score: number;
  identity_score: number;
  description: string;
  full_description: string;
  strengths: string;
  weaknesses: string;
  career_advice: string;
  careers: string[];
  created_at: string;
}
