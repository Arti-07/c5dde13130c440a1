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

