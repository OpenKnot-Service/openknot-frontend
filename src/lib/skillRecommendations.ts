import { UserRole, ExperienceLevel } from '../types/registration';
import { TechStackItem } from '../types';

/**
 * Role-based skill recommendations
 */
const ROLE_BASED_SKILLS: Record<UserRole, Record<ExperienceLevel, string[]>> = {
  developer: {
    beginner: [
      'HTML',
      'CSS',
      'JavaScript',
      'Git',
      'React',
      'Python',
      'Node.js',
      'TypeScript',
    ],
    intermediate: [
      'TypeScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'Git',
      'REST API',
      'Next.js',
    ],
    advanced: [
      'Next.js',
      'GraphQL',
      'Docker',
      'Kubernetes',
      'AWS',
      'Microservices',
      'Redis',
      'CI/CD',
      'TypeScript',
      'PostgreSQL',
    ],
    expert: [
      'System Design',
      'Kubernetes',
      'AWS',
      'Microservices',
      'GraphQL',
      'Redis',
      'Terraform',
      'CI/CD',
      'Performance Optimization',
      'Architecture',
    ],
  },
  designer: {
    beginner: [
      'Figma',
      'Adobe XD',
      'Sketch',
      'UI Design',
      'Wireframing',
      'Prototyping',
    ],
    intermediate: [
      'Figma',
      'UI/UX Design',
      'Prototyping',
      'User Research',
      'Adobe Creative Suite',
      'Design Systems',
      'Responsive Design',
    ],
    advanced: [
      'Design Systems',
      'User Research',
      'Design Thinking',
      'Interaction Design',
      'Accessibility',
      'Motion Design',
      'Figma',
    ],
    expert: [
      'Design Leadership',
      'Design Systems',
      'User Research',
      'Design Strategy',
      'Accessibility',
      'Motion Design',
      'Design Ops',
    ],
  },
  planner: {
    beginner: [
      'Project Planning',
      'Documentation',
      'Market Research',
      'Wireframing',
      'Notion',
      'Jira',
    ],
    intermediate: [
      'Product Management',
      'Agile',
      'Scrum',
      'User Stories',
      'Roadmapping',
      'Analytics',
      'Jira',
      'Notion',
    ],
    advanced: [
      'Product Strategy',
      'OKRs',
      'Data Analysis',
      'A/B Testing',
      'Stakeholder Management',
      'Agile',
      'Product Analytics',
    ],
    expert: [
      'Product Strategy',
      'Business Strategy',
      'Leadership',
      'Data-Driven Decision Making',
      'Market Analysis',
      'OKRs',
      'Product Vision',
    ],
  },
  other: {
    beginner: ['Communication', 'Teamwork', 'Time Management', 'Problem Solving'],
    intermediate: ['Project Management', 'Leadership', 'Communication', 'Analytics'],
    advanced: ['Strategy', 'Leadership', 'Innovation', 'Cross-functional Collaboration'],
    expert: ['Strategic Planning', 'Leadership', 'Innovation', 'Business Development'],
  },
};

/**
 * Specialization-based skill recommendations
 */
const SPECIALIZATION_SKILLS: Record<string, string[]> = {
  Frontend: ['React', 'Vue.js', 'Angular', 'TypeScript', 'CSS', 'Tailwind CSS', 'Next.js'],
  Backend: ['Node.js', 'Python', 'Java', 'Spring', 'Django', 'PostgreSQL', 'MongoDB', 'Redis'],
  Fullstack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js', 'Docker', 'REST API'],
  Mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'Firebase'],
  DevOps: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Jenkins', 'Linux'],
  Data: ['Python', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'Data Analysis', 'Machine Learning'],
  'UI/UX': ['Figma', 'UI Design', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'],
  Graphic: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Graphic Design', 'Branding'],
  Product: ['Product Design', 'User Research', 'Prototyping', 'Design Thinking', 'Figma'],
  Motion: ['After Effects', 'Motion Design', 'Animation', 'Video Editing'],
  PM: ['Product Management', 'Agile', 'Scrum', 'Jira', 'Roadmapping', 'Analytics'],
  PO: ['Product Ownership', 'Backlog Management', 'Agile', 'User Stories', 'Stakeholder Management'],
  Business: ['Business Analysis', 'Market Research', 'Strategy', 'Data Analysis', 'Excel'],
};

/**
 * Popular skills across all roles
 */
const POPULAR_SKILLS = [
  'Git',
  'JavaScript',
  'TypeScript',
  'React',
  'Python',
  'Docker',
  'Figma',
  'Node.js',
  'AWS',
  'PostgreSQL',
  'MongoDB',
  'Next.js',
  'Tailwind CSS',
  'REST API',
  'GraphQL',
];

/**
 * Preset skill packages ("Starter Packs")
 */
export const SKILL_PRESETS: Record<string, { label: string; skills: string[] }> = {
  'frontend-beginner': {
    label: 'Frontend 개발자 스타터팩',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Tailwind CSS'],
  },
  'frontend-advanced': {
    label: 'Frontend 개발자 고급팩',
    skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Testing'],
  },
  'backend-beginner': {
    label: 'Backend 개발자 스타터팩',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Git', 'PostgreSQL'],
  },
  'backend-advanced': {
    label: 'Backend 개발자 고급팩',
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Redis', 'Microservices'],
  },
  'fullstack-beginner': {
    label: 'Fullstack 개발자 스타터팩',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
  },
  'fullstack-advanced': {
    label: 'Fullstack 개발자 고급팩',
    skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  },
  'mobile-beginner': {
    label: 'Mobile 개발자 스타터팩',
    skills: ['React Native', 'JavaScript', 'Firebase', 'Git'],
  },
  'uiux-beginner': {
    label: 'UI/UX 디자이너 스타터팩',
    skills: ['Figma', 'UI Design', 'Prototyping', 'Wireframing', 'User Research'],
  },
  'pm-beginner': {
    label: 'PM 스타터팩',
    skills: ['Product Management', 'Agile', 'Jira', 'User Stories', 'Documentation'],
  },
};

/**
 * Get skill recommendations based on role, experience level, and optional specialization
 */
export function getSkillRecommendations(
  role: UserRole,
  experienceLevel: ExperienceLevel,
  specialization?: string
): string[] {
  const recommendations = new Set<string>();

  // Add role-based skills
  const roleSkills = ROLE_BASED_SKILLS[role]?.[experienceLevel] || [];
  roleSkills.forEach((skill) => recommendations.add(skill));

  // Add specialization-based skills
  if (specialization && SPECIALIZATION_SKILLS[specialization]) {
    SPECIALIZATION_SKILLS[specialization].forEach((skill) => recommendations.add(skill));
  }

  return Array.from(recommendations);
}

/**
 * Get popular skills
 */
export function getPopularSkills(): string[] {
  return [...POPULAR_SKILLS];
}

/**
 * Get relevant skill presets based on role and specialization
 */
export function getRelevantPresets(
  role: UserRole,
  experienceLevel: ExperienceLevel,
  specialization?: string
): Array<{ key: string; label: string; skills: string[] }> {
  const presets: Array<{ key: string; label: string; skills: string[] }> = [];

  // Developer presets
  if (role === 'developer') {
    const levelPrefix = experienceLevel === 'beginner' || experienceLevel === 'intermediate'
      ? 'beginner'
      : 'advanced';

    if (specialization === 'Frontend') {
      presets.push({
        key: `frontend-${levelPrefix}`,
        ...SKILL_PRESETS[`frontend-${levelPrefix}`],
      });
    } else if (specialization === 'Backend') {
      presets.push({
        key: `backend-${levelPrefix}`,
        ...SKILL_PRESETS[`backend-${levelPrefix}`],
      });
    } else if (specialization === 'Fullstack') {
      presets.push({
        key: `fullstack-${levelPrefix}`,
        ...SKILL_PRESETS[`fullstack-${levelPrefix}`],
      });
    } else if (specialization === 'Mobile') {
      presets.push({
        key: 'mobile-beginner',
        ...SKILL_PRESETS['mobile-beginner'],
      });
    } else {
      // Default: show fullstack
      presets.push({
        key: `fullstack-${levelPrefix}`,
        ...SKILL_PRESETS[`fullstack-${levelPrefix}`],
      });
    }
  }

  // Designer presets
  if (role === 'designer' && (specialization === 'UI/UX' || !specialization)) {
    presets.push({
      key: 'uiux-beginner',
      ...SKILL_PRESETS['uiux-beginner'],
    });
  }

  // Planner presets
  if (role === 'planner' && (specialization === 'PM' || !specialization)) {
    presets.push({
      key: 'pm-beginner',
      ...SKILL_PRESETS['pm-beginner'],
    });
  }

  return presets;
}

/**
 * Convert skill strings to TechStackItem objects
 */
export function convertSkillsToTechStack(skills: string[]): TechStackItem[] {
  return skills.map((skill, index) => ({
    id: `skill-${index}-${skill.toLowerCase().replace(/\s+/g, '-')}`,
    name: skill,
    category: 'language', // Default category, can be improved
  }));
}
