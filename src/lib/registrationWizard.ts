import {
  RegistrationStep,
  RegistrationFormData,
  RegistrationStep1Data,
  RegistrationStep2Data,
  RegistrationStep3Data,
  RegistrationStep4Data,
  StepValidation,
  RoleOption,
  ExperienceLevelOption,
} from '../types/registration';
import { checkEmailExists } from './apiClient';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Password validation regex
const PASSWORD_UPPERCASE = /[A-Z]/;
const PASSWORD_LOWERCASE = /[a-z]/;
const PASSWORD_DIGIT = /\d/;

/**
 * Validate Step 1: Basic Account Information
 */
export async function validateStep1(data: RegistrationStep1Data): Promise<StepValidation> {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = '이름을 입력해주세요';
  } else if (data.name.trim().length < 2) {
    errors.name = '이름은 최소 2자 이상이어야 합니다';
  }

  // Email validation
  if (!data.email || data.email.trim().length === 0) {
    errors.email = '이메일을 입력해주세요';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다';
  } else {
    // Check email existence (async)
    try {
      const exists = await checkEmailExists(data.email);
      if (exists) {
        errors.email = '이미 등록된 이메일입니다';
      }
    } catch (error) {
      // Silently fail - don't block registration if API fails
      console.error('Email check failed:', error);
    }
  }

  // Password validation
  if (!data.password || data.password.length === 0) {
    errors.password = '비밀번호를 입력해주세요';
  } else if (data.password.length < 8) {
    errors.password = '비밀번호는 최소 8자 이상이어야 합니다';
  } else if (!PASSWORD_UPPERCASE.test(data.password)) {
    errors.password = '비밀번호에 대문자가 포함되어야 합니다';
  } else if (!PASSWORD_LOWERCASE.test(data.password)) {
    errors.password = '비밀번호에 소문자가 포함되어야 합니다';
  } else if (!PASSWORD_DIGIT.test(data.password)) {
    errors.password = '비밀번호에 숫자가 포함되어야 합니다';
  }

  // Password confirmation
  if (!data.confirmPassword || data.confirmPassword.length === 0) {
    errors.confirmPassword = '비밀번호 확인을 입력해주세요';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다';
  }

  // Terms agreement
  if (!data.agreedToTerms) {
    errors.agreedToTerms = '이용약관에 동의해주세요';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Step 2: Professional Role
 */
export function validateStep2(data: RegistrationStep2Data): StepValidation {
  const errors: Record<string, string> = {};

  // Role validation
  if (!data.role) {
    errors.role = '역할을 선택해주세요';
  }

  // Custom role (if role === 'other')
  if (data.role === 'other' && (!data.customRole || data.customRole.trim().length === 0)) {
    errors.customRole = '역할을 입력해주세요';
  }

  // Experience level validation
  if (!data.experienceLevel) {
    errors.experienceLevel = '경력 레벨을 선택해주세요';
  }

  // Role description (optional, but validate length if provided)
  if (data.roleDescription && data.roleDescription.length > 200) {
    errors.roleDescription = '역할 설명은 최대 200자까지 입력할 수 있습니다';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Step 3: Skills & Tech Stack (Optional - always valid)
 */
export function validateStep3(data: RegistrationStep3Data): StepValidation {
  const errors: Record<string, string> = {};

  // Warning if too many skills (but still allow)
  if (data.skills.length > 20) {
    errors.skills = '스킬이 20개를 초과했습니다. 핵심 스킬만 선택하는 것을 권장합니다';
  }

  // Optional step - always valid even with warnings
  return {
    isValid: true,
    errors,
  };
}

/**
 * Validate Step 4: Profile & Social Links (Optional)
 */
export function validateStep4(data: RegistrationStep4Data): StepValidation {
  const errors: Record<string, string> = {};

  // Bio length
  if (data.bio && data.bio.length > 500) {
    errors.bio = '자기소개는 최대 500자까지 입력할 수 있습니다';
  }

  // GitHub link format
  if (data.githubLink && data.githubLink.trim().length > 0) {
    if (!URL_REGEX.test(data.githubLink)) {
      errors.githubLink = '올바른 URL 형식이 아닙니다';
    } else if (!data.githubLink.includes('github.com')) {
      errors.githubLink = 'GitHub URL을 입력해주세요';
    }
  }

  // Portfolio URL format
  if (data.portfolioUrl && data.portfolioUrl.trim().length > 0) {
    if (!URL_REGEX.test(data.portfolioUrl)) {
      errors.portfolioUrl = '올바른 URL 형식이 아닙니다';
    }
  }

  // Profile image file size (if provided)
  if (data.profileImageFile) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (data.profileImageFile.size > maxSize) {
      errors.profileImageFile = '이미지 크기는 최대 5MB까지 업로드할 수 있습니다';
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(data.profileImageFile.type)) {
      errors.profileImageFile = 'JPG, PNG, WebP, GIF 형식의 이미지만 업로드할 수 있습니다';
    }
  }

  // Optional step - errors don't block submission
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate Step 5: Review (No validation needed)
 */
export function validateStep5(): StepValidation {
  return {
    isValid: true,
    errors: {},
  };
}

/**
 * Master validation function that routes to appropriate step validator
 */
export async function validateStep(
  step: RegistrationStep,
  formData: RegistrationFormData
): Promise<StepValidation> {
  switch (step) {
    case 1:
      return validateStep1(formData.step1);
    case 2:
      return validateStep2(formData.step2);
    case 3:
      return validateStep3(formData.step3);
    case 4:
      return validateStep4(formData.step4);
    case 5:
      return validateStep5();
    default:
      return { isValid: false, errors: { general: '알 수 없는 단계입니다' } };
  }
}

/**
 * Calculate profile completeness score (0-100)
 */
export function calculateProfileCompleteness(data: RegistrationFormData): number {
  let score = 0;

  // Step 1 (Required) - 25%
  if (data.step1.name && data.step1.email && data.step1.password) {
    score += 25;
  }

  // Step 2 (Required) - 25%
  if (data.step2.role && data.step2.experienceLevel) {
    score += 25;
  }

  // Step 3 (Optional) - 25%
  const skillsScore = Math.min(25, data.step3.skills.length * 2.5);
  score += skillsScore;

  // Step 4 (Optional) - 25%
  let step4Score = 0;
  if (data.step4.profileImageUrl) step4Score += 8;
  if (data.step4.bio && data.step4.bio.length > 0) step4Score += 8;
  if (data.step4.githubLink) step4Score += 5;
  if (data.step4.portfolioUrl) step4Score += 2;
  if (data.step4.location) step4Score += 2;
  score += Math.min(25, step4Score);

  return Math.min(100, Math.round(score));
}

/**
 * Role options for UI
 */
export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'developer',
    label: '개발자',
    description: '소프트웨어 개발, 프로그래밍',
    icon: 'Code',
    specializations: ['Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 'Data'],
  },
  {
    id: 'designer',
    label: '디자이너',
    description: 'UI/UX, 그래픽 디자인',
    icon: 'Palette',
    specializations: ['UI/UX', 'Graphic', 'Product', 'Motion'],
  },
  {
    id: 'planner',
    label: '기획자',
    description: '프로젝트 기획, 프로덕트 매니지먼트',
    icon: 'Target',
    specializations: ['PM', 'PO', 'Business'],
  },
  {
    id: 'other',
    label: '기타',
    description: '다른 역할',
    icon: 'Users',
  },
];

/**
 * Experience level options for UI
 */
export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevelOption[] = [
  {
    id: 'beginner',
    label: '초보자',
    description: '이제 막 시작하는 단계',
    yearsRange: '0-1년',
  },
  {
    id: 'intermediate',
    label: '중급',
    description: '기본적인 경험이 있는 단계',
    yearsRange: '1-3년',
  },
  {
    id: 'advanced',
    label: '고급',
    description: '능숙하게 다루는 단계',
    yearsRange: '3-5년',
  },
  {
    id: 'expert',
    label: '전문가',
    description: '전문가 수준의 경험',
    yearsRange: '5년 이상',
  },
];

/**
 * Check if a step is optional
 */
export function isStepOptional(step: RegistrationStep): boolean {
  return step === 3 || step === 4;
}

/**
 * Get step title
 */
export function getStepTitle(step: RegistrationStep): string {
  const titles: Record<RegistrationStep, string> = {
    1: '기본 정보',
    2: '역할 & 경력',
    3: '스킬 & 관심 분야',
    4: '프로필 & 소셜',
    5: '검토 & 완료',
  };
  return titles[step];
}

/**
 * Get step description
 */
export function getStepDescription(step: RegistrationStep): string {
  const descriptions: Record<RegistrationStep, string> = {
    1: '계정 생성을 위한 기본 정보를 입력해주세요',
    2: '프로젝트 매칭 향상을 위해 역할과 경력을 알려주세요',
    3: '보유 스킬과 관심 분야로 추천을 강화하세요 (선택 사항)',
    4: '프로필과 링크를 추가해 신뢰도를 높이세요 (선택 사항)',
    5: '추가 정보를 확인하고 등록을 완료하세요',
  };
  return descriptions[step];
}
