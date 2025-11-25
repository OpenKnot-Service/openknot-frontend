import { ProjectStatus } from './index';
import { IconType } from 'react-icons';

// 프로젝트 타입
export type ProjectType = 'web' | 'mobile' | 'desktop' | 'library' | 'other';

// 프로젝트 가시성
export type ProjectVisibility = 'public' | 'private';

// 기술 카테고리
export type TechCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'mobile'
  | 'language'
  | 'design'
  | 'other';

// 기술 스택 아이템
export interface TechStackItem {
  id: string;
  name: string;
  category: TechCategory;
  icon?: IconType;
  description?: string;
  popularity?: number;
}

// AI 추천 프리셋
export interface TechStackRecommendation {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack: TechStackItem[];
  tags: string[];
}

// 포지션 정의
export interface PositionDefinition {
  id: string;
  role: 'developer' | 'designer' | 'planner' | 'other';
  title: string;
  count: number;
  requirements: string[];
  description?: string;
}

// 위저드 단계 1: 아이디어
export interface WizardStep1Data {
  idea: string;
  parsedData?: {
    suggestedName?: string;
    suggestedType?: ProjectType;
    keywords?: string[];
  };
}

// 위저드 단계 2: 기본 정보
export interface WizardStep2Data {
  name: string;
  description: string;
  type: ProjectType;
  visibility: ProjectVisibility;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

// 위저드 단계 3: 기술 스택
export interface WizardStep3Data {
  selectedRecommendation?: string;
  techStack: TechStackItem[];
  customTech: TechStackItem[];
}

// 위저드 단계 4: 팀 구성
export interface WizardStep4Data {
  positions: PositionDefinition[];
  inviteEmails?: string[];
}

export interface TaskTreeNode {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  ownerRole: 'developer' | 'designer' | 'planner' | 'other';
  etaDays?: number;
  children?: TaskTreeNode[];
  dependencies?: string[]; // Task IDs that this task depends on (cross-hierarchy dependencies)
}

// 전체 위저드 폼 데이터
export interface WizardFormData {
  step1: WizardStep1Data;
  step2: WizardStep2Data;
  step3: WizardStep3Data;
  step4: WizardStep4Data;
}

// 위저드 단계
export type WizardStep = 1 | 2 | 3 | 4 | 5;

// 단계 검증 결과
export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
