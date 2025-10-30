// Типы для астрологического модуля

export interface AstrologyProfile {
  user_id: string;
  birth_date: string;
  birth_time: string | null;
  birth_city: string | null;
  birth_country: string | null;
  zodiac_sign: string;
  zodiac_element: string;
  zodiac_quality: string;
  chinese_zodiac: string;
  life_path_number: number;
  soul_number: number | null;
  personality_traits: string;
  career_recommendations: string;
  strengths: string;
  challenges: string;
  compatibility_signs: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateAstrologyProfileRequest {
  birth_date: string;
  birth_time?: string;
  birth_city?: string;
  birth_country?: string;
}

export interface DeleteAstrologyProfileResponse {
  message: string;
}

