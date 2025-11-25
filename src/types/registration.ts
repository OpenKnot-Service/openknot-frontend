import { TechStackItem } from './wizard';

export type RegistrationStep = 1 | 2 | 3 | 4 | 5;

export type UserRole = 'developer' | 'designer' | 'planner' | 'other';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Step 1: Basic Account Information
export interface RegistrationStep1Data {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// Step 2: Professional Role
export interface RegistrationStep2Data {
  role: UserRole;
  customRole?: string; // When role === 'other'
  specialization?: string; // e.g., "Frontend", "Backend", "Fullstack"
  experienceLevel: ExperienceLevel;
  roleDescription?: string; // Optional 200 char description
}

// Step 3: Skills & Tech Stack (Optional)
export interface RegistrationStep3Data {
  skills: TechStackItem[];
  interests: string[]; // Interest tags
}

// Step 4: Profile & Social Links (Optional)
export interface RegistrationStep4Data {
  profileImageUrl?: string;
  profileImageFile?: File; // For upload before submission
  bio?: string; // Max 500 chars
  githubLink?: string;
  githubUsername?: string;
  portfolioUrl?: string;
  location?: string;
  githubImported?: boolean; // Flag for tracking GitHub import
}

// Complete Registration Form Data
export interface RegistrationFormData {
  step1: RegistrationStep1Data;
  step2: RegistrationStep2Data;
  step3: RegistrationStep3Data;
  step4: RegistrationStep4Data;
}

// Validation Result
export interface StepValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Draft Save/Load
export interface RegistrationDraft {
  data: RegistrationFormData;
  currentStep: RegistrationStep;
  completedSteps: RegistrationStep[];
  timestamp: number; // For expiry check
  version: number; // For migration/compatibility
}

// API Payload (Enhanced Registration)
export interface EnhancedRegisterPayload {
  // Step 1 - Required
  email: string;
  password: string;
  name: string;

  // Step 2 - Required
  role: UserRole;
  experienceLevel: ExperienceLevel;
  specialization?: string;
  roleDescription?: string;

  // Step 3 - Optional
  skills?: string[];
  interests?: string[];

  // Step 4 - Optional
  profileImageUrl?: string;
  bio?: string; // maps to 'description' in User type
  githubLink?: string;
  githubUsername?: string;
  portfolioUrl?: string;
  location?: string;

  // Metadata
  profileCompleteness?: number;
}

// Role Options (for UI)
export interface RoleOption {
  id: UserRole;
  label: string;
  description: string;
  icon: string; // Icon component name or class
  specializations?: string[];
}

// Experience Level Options
export interface ExperienceLevelOption {
  id: ExperienceLevel;
  label: string;
  description: string;
  yearsRange: string;
}

// GitHub Import Result
export interface GitHubImportResult {
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  githubLink: string;
  githubUsername: string;
  portfolioUrl?: string; // From GitHub profile.blog
  suggestedSkills: string[]; // Extracted from repos
  repos: number;
  followers: number;
}
