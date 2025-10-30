// Типы для Career Roadmap

export type SkillLevel = 'BEGINNER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR' | 'EXPERT';

export interface RoadmapOverview {
  description: string;
  totalDuration: string;
  keySkills: string[];
  personalityInsight?: string;
  astrologyInsight?: string;
}

export interface RoadmapSkill {
  name: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export interface RoadmapTool {
  name: string;
  category: 'framework' | 'language' | 'platform' | 'software' | 'tool';
  description: string;
}

export interface RoadmapProject {
  title: string;
  description: string;
  skills: string[];
}

export interface RoadmapResource {
  type: 'course' | 'book' | 'video' | 'documentation' | 'community' | 'certification';
  title: string;
  description: string;
  link?: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
}

export interface RoadmapStage {
  id: string;
  level: SkillLevel;
  title: string;
  duration: string;
  description: string;
  goals: string[];
  skills: RoadmapSkill[];
  tools: RoadmapTool[];
  projects: RoadmapProject[];
  resources: RoadmapResource[];
  interviewQuestions: InterviewQuestion[];
}

export interface ProfessionRoadmap {
  profession: string;
  overview: RoadmapOverview;
  stages: RoadmapStage[];
}

export interface RoadmapGenerateRequest {
  profession_title: string;
  current_level?: SkillLevel;
}

export interface RoadmapGenerateResponse {
  roadmap: ProfessionRoadmap;
  has_personality_data: boolean;
  has_astrology_data: boolean;
}

