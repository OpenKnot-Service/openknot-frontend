import {
  ProjectType,
  TechStackItem,
  TechStackRecommendation,
  WizardStep1Data,
  WizardStep2Data
} from '../types/wizard';
import { IconType } from 'react-icons';
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiNextdotjs,
  SiSvelte,
  SiTailwindcss,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiDjango,
  SiFastapi,
  SiSpringboot,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiSqlite,
  SiDocker,
  SiKubernetes,
  SiAmazon,
  SiVercel,
  SiGithubactions,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiElectron,
  SiTauri,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  SiTensorflow,
  SiPytorch,
  SiJest,
  SiVitest,
  SiCypress,
  SiEslint,
  SiPrettier,
  SiWebpack,
  SiRollupdotjs,
  SiNginx,
  SiJenkins,
  SiGitlab,
  SiLinux,
  SiFigma,
  SiNotion,
  SiSlack,
  SiStrapi,
  SiSanity,
  SiContentful,
  SiNetlify,
  SiCloudflare,
  SiHeroku,
  SiDigitalocean,
  SiGooglecloud,
  SiOpenjdk,
  SiElasticsearch,
  SiRabbitmq,
  SiApachekafka,
  SiGit,
  SiNpm,
  SiYarn,
  SiPnpm,
} from 'react-icons/si';
import { TbBrandAzure, TbBrandCSharp } from 'react-icons/tb';

// 아이콘 매핑
export const TECH_ICONS: Record<string, IconType> = {
  // Frontend
  react: SiReact,
  vue: SiVuedotjs,
  angular: SiAngular,
  nextjs: SiNextdotjs,
  svelte: SiSvelte,
  tailwind: SiTailwindcss,
  vite: SiVite,

  // Backend
  nodejs: SiNodedotjs,
  express: SiExpress,
  nestjs: SiNestjs,
  django: SiDjango,
  fastapi: SiFastapi,
  spring: SiSpringboot,
  graphql: SiGraphql,

  // Database
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  mysql: SiMysql,
  redis: SiRedis,
  sqlite: SiSqlite,
  supabase: SiSupabase,
  firebase: SiFirebase,
  prisma: SiPrisma,
  elasticsearch: SiElasticsearch,

  // DevOps
  docker: SiDocker,
  kubernetes: SiKubernetes,
  aws: SiAmazon,
  vercel: SiVercel,
  netlify: SiNetlify,
  heroku: SiHeroku,
  cloudflare: SiCloudflare,
  'digitalocean': SiDigitalocean,
  'google-cloud': SiGooglecloud,
  azure: TbBrandAzure,
  'github-actions': SiGithubactions,
  'gitlab-ci': SiGitlab,
  jenkins: SiJenkins,
  nginx: SiNginx,
  linux: SiLinux,
  git: SiGit,

  // Mobile
  'react-native': SiReact,
  flutter: SiFlutter,
  swift: SiSwift,
  kotlin: SiKotlin,

  // Languages
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  go: SiGo,
  rust: SiRust,
  php: SiPhp,
  ruby: SiRuby,
  csharp: TbBrandCSharp,
  java: SiOpenjdk,

  // Desktop
  electron: SiElectron,
  tauri: SiTauri,

  // Testing
  jest: SiJest,
  vitest: SiVitest,
  cypress: SiCypress,

  // Tools
  eslint: SiEslint,
  prettier: SiPrettier,
  webpack: SiWebpack,
  rollup: SiRollupdotjs,
  npm: SiNpm,
  yarn: SiYarn,
  pnpm: SiPnpm,

  // CMS
  strapi: SiStrapi,
  sanity: SiSanity,
  contentful: SiContentful,

  // AI/ML
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,

  // Communication
  figma: SiFigma,
  notion: SiNotion,
  slack: SiSlack,

  // Message Queue
  rabbitmq: SiRabbitmq,
  kafka: SiApachekafka,
};

// 기술 스택 데이터베이스
export const TECH_STACK_DATABASE: TechStackItem[] = [
  // Frontend Frameworks
  { id: 'react', name: 'React', category: 'frontend', popularity: 95, icon: TECH_ICONS.react },
  { id: 'vue', name: 'Vue.js', category: 'frontend', popularity: 85, icon: TECH_ICONS.vue },
  { id: 'angular', name: 'Angular', category: 'frontend', popularity: 75, icon: TECH_ICONS.angular },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', popularity: 90, icon: TECH_ICONS.nextjs },
  { id: 'svelte', name: 'Svelte', category: 'frontend', popularity: 70, icon: TECH_ICONS.svelte },

  // Frontend Tools
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', popularity: 92, icon: TECH_ICONS.tailwind },
  { id: 'vite', name: 'Vite', category: 'frontend', popularity: 88, icon: TECH_ICONS.vite },
  { id: 'webpack', name: 'Webpack', category: 'frontend', popularity: 82, icon: TECH_ICONS.webpack },
  { id: 'rollup', name: 'Rollup', category: 'frontend', popularity: 65, icon: TECH_ICONS.rollup },

  // Languages
  { id: 'typescript', name: 'TypeScript', category: 'other', popularity: 93, icon: TECH_ICONS.typescript },
  { id: 'javascript', name: 'JavaScript', category: 'other', popularity: 95, icon: TECH_ICONS.javascript },
  { id: 'python', name: 'Python', category: 'other', popularity: 90, icon: TECH_ICONS.python },
  { id: 'go', name: 'Go', category: 'other', popularity: 78, icon: TECH_ICONS.go },
  { id: 'rust', name: 'Rust', category: 'other', popularity: 72, icon: TECH_ICONS.rust },
  { id: 'php', name: 'PHP', category: 'other', popularity: 70, icon: TECH_ICONS.php },
  { id: 'ruby', name: 'Ruby', category: 'other', popularity: 68, icon: TECH_ICONS.ruby },
  { id: 'csharp', name: 'C#', category: 'other', popularity: 75, icon: TECH_ICONS.csharp },
  { id: 'java', name: 'Java', category: 'other', popularity: 80, icon: TECH_ICONS.java },

  // Backend Frameworks
  { id: 'nodejs', name: 'Node.js', category: 'backend', popularity: 93, icon: TECH_ICONS.nodejs },
  { id: 'express', name: 'Express', category: 'backend', popularity: 90, icon: TECH_ICONS.express },
  { id: 'nestjs', name: 'NestJS', category: 'backend', popularity: 82, icon: TECH_ICONS.nestjs },
  { id: 'django', name: 'Django', category: 'backend', popularity: 80, icon: TECH_ICONS.django },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', popularity: 85, icon: TECH_ICONS.fastapi },
  { id: 'spring', name: 'Spring Boot', category: 'backend', popularity: 88, icon: TECH_ICONS.spring },
  { id: 'graphql', name: 'GraphQL', category: 'backend', popularity: 78, icon: TECH_ICONS.graphql },

  // Databases
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', popularity: 90, icon: TECH_ICONS.postgresql },
  { id: 'mongodb', name: 'MongoDB', category: 'database', popularity: 85, icon: TECH_ICONS.mongodb },
  { id: 'mysql', name: 'MySQL', category: 'database', popularity: 88, icon: TECH_ICONS.mysql },
  { id: 'redis', name: 'Redis', category: 'database', popularity: 82, icon: TECH_ICONS.redis },
  { id: 'sqlite', name: 'SQLite', category: 'database', popularity: 75, icon: TECH_ICONS.sqlite },
  { id: 'prisma', name: 'Prisma', category: 'database', popularity: 87, icon: TECH_ICONS.prisma },
  { id: 'supabase', name: 'Supabase', category: 'database', popularity: 83, icon: TECH_ICONS.supabase },
  { id: 'firebase', name: 'Firebase', category: 'database', popularity: 86, icon: TECH_ICONS.firebase },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'database', popularity: 76, icon: TECH_ICONS.elasticsearch },

  // DevOps & Cloud
  { id: 'docker', name: 'Docker', category: 'devops', popularity: 92, icon: TECH_ICONS.docker },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', popularity: 80, icon: TECH_ICONS.kubernetes },
  { id: 'aws', name: 'AWS', category: 'devops', popularity: 88, icon: TECH_ICONS.aws },
  { id: 'google-cloud', name: 'Google Cloud', category: 'devops', popularity: 82, icon: TECH_ICONS['google-cloud'] },
  { id: 'azure', name: 'Azure', category: 'devops', popularity: 79, icon: TECH_ICONS.azure },
  { id: 'vercel', name: 'Vercel', category: 'devops', popularity: 75, icon: TECH_ICONS.vercel },
  { id: 'netlify', name: 'Netlify', category: 'devops', popularity: 73, icon: TECH_ICONS.netlify },
  { id: 'heroku', name: 'Heroku', category: 'devops', popularity: 68, icon: TECH_ICONS.heroku },
  { id: 'cloudflare', name: 'Cloudflare', category: 'devops', popularity: 77, icon: TECH_ICONS.cloudflare },
  { id: 'digitalocean', name: 'DigitalOcean', category: 'devops', popularity: 72, icon: TECH_ICONS.digitalocean },
  { id: 'github-actions', name: 'GitHub Actions', category: 'devops', popularity: 85, icon: TECH_ICONS['github-actions'] },
  { id: 'gitlab-ci', name: 'GitLab CI', category: 'devops', popularity: 74, icon: TECH_ICONS['gitlab-ci'] },
  { id: 'jenkins', name: 'Jenkins', category: 'devops', popularity: 70, icon: TECH_ICONS.jenkins },
  { id: 'nginx', name: 'Nginx', category: 'devops', popularity: 84, icon: TECH_ICONS.nginx },
  { id: 'linux', name: 'Linux', category: 'devops', popularity: 89, icon: TECH_ICONS.linux },
  { id: 'git', name: 'Git', category: 'devops', popularity: 95, icon: TECH_ICONS.git },

  // Mobile
  { id: 'react-native', name: 'React Native', category: 'mobile', popularity: 88, icon: TECH_ICONS['react-native'] },
  { id: 'flutter', name: 'Flutter', category: 'mobile', popularity: 85, icon: TECH_ICONS.flutter },
  { id: 'swift', name: 'Swift', category: 'mobile', popularity: 80, icon: TECH_ICONS.swift },
  { id: 'kotlin', name: 'Kotlin', category: 'mobile', popularity: 78, icon: TECH_ICONS.kotlin },

  // Desktop
  { id: 'electron', name: 'Electron', category: 'other', popularity: 76, icon: TECH_ICONS.electron },
  { id: 'tauri', name: 'Tauri', category: 'other', popularity: 68, icon: TECH_ICONS.tauri },

  // Testing
  { id: 'jest', name: 'Jest', category: 'other', popularity: 86, icon: TECH_ICONS.jest },
  { id: 'vitest', name: 'Vitest', category: 'other', popularity: 80, icon: TECH_ICONS.vitest },
  { id: 'cypress', name: 'Cypress', category: 'other', popularity: 82, icon: TECH_ICONS.cypress },

  // Tools
  { id: 'eslint', name: 'ESLint', category: 'other', popularity: 88, icon: TECH_ICONS.eslint },
  { id: 'prettier', name: 'Prettier', category: 'other', popularity: 89, icon: TECH_ICONS.prettier },
  { id: 'npm', name: 'npm', category: 'other', popularity: 92, icon: TECH_ICONS.npm },
  { id: 'yarn', name: 'Yarn', category: 'other', popularity: 81, icon: TECH_ICONS.yarn },
  { id: 'pnpm', name: 'pnpm', category: 'other', popularity: 75, icon: TECH_ICONS.pnpm },

  // CMS
  { id: 'strapi', name: 'Strapi', category: 'backend', popularity: 74, icon: TECH_ICONS.strapi },
  { id: 'sanity', name: 'Sanity', category: 'backend', popularity: 71, icon: TECH_ICONS.sanity },
  { id: 'contentful', name: 'Contentful', category: 'backend', popularity: 72, icon: TECH_ICONS.contentful },

  // AI/ML
  { id: 'tensorflow', name: 'TensorFlow', category: 'other', popularity: 80, icon: TECH_ICONS.tensorflow },
  { id: 'pytorch', name: 'PyTorch', category: 'other', popularity: 82, icon: TECH_ICONS.pytorch },

  // Communication & Design
  { id: 'figma', name: 'Figma', category: 'other', popularity: 90, icon: TECH_ICONS.figma },
  { id: 'notion', name: 'Notion', category: 'other', popularity: 85, icon: TECH_ICONS.notion },
  { id: 'slack', name: 'Slack', category: 'other', popularity: 87, icon: TECH_ICONS.slack },

  // Message Queue
  { id: 'rabbitmq', name: 'RabbitMQ', category: 'backend', popularity: 73, icon: TECH_ICONS.rabbitmq },
  { id: 'kafka', name: 'Kafka', category: 'backend', popularity: 77, icon: TECH_ICONS.kafka },
];

// 프로젝트 타입별 추천 프리셋
const RECOMMENDATIONS: Record<ProjectType, TechStackRecommendation[]> = {
  web: [
    {
      id: 'web-beginner',
      name: '초보자 친화적',
      description: 'React + Node.js로 시작하는 풀스택 웹 개발. 배우기 쉽고 커뮤니티가 활발합니다.',
      difficulty: 'beginner',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'react')!,
        TECH_STACK_DATABASE.find(t => t.id === 'tailwind')!,
        TECH_STACK_DATABASE.find(t => t.id === 'vite')!,
        TECH_STACK_DATABASE.find(t => t.id === 'nodejs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'express')!,
        TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
      ],
      tags: ['풀스택', '입문자', 'SPA']
    },
    {
      id: 'web-balanced',
      name: '균형잡힌 스택',
      description: 'Next.js + NestJS 조합으로 확장성과 생산성을 모두 챙깁니다.',
      difficulty: 'intermediate',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'nextjs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'tailwind')!,
        TECH_STACK_DATABASE.find(t => t.id === 'nestjs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
        TECH_STACK_DATABASE.find(t => t.id === 'redis')!,
        TECH_STACK_DATABASE.find(t => t.id === 'docker')!,
      ],
      tags: ['SSR', 'TypeScript', '확장성']
    },
    {
      id: 'web-modern',
      name: '최신 트렌드',
      description: 'Svelte + FastAPI로 최고의 성능과 개발 경험을 제공합니다.',
      difficulty: 'advanced',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'svelte')!,
        TECH_STACK_DATABASE.find(t => t.id === 'vite')!,
        TECH_STACK_DATABASE.find(t => t.id === 'fastapi')!,
        TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
        TECH_STACK_DATABASE.find(t => t.id === 'docker')!,
        TECH_STACK_DATABASE.find(t => t.id === 'github-actions')!,
      ],
      tags: ['최신기술', '고성능', 'Python']
    },
  ],
  mobile: [
    {
      id: 'mobile-crossplatform',
      name: '크로스 플랫폼',
      description: 'React Native로 iOS와 Android를 동시에 개발합니다.',
      difficulty: 'beginner',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'react-native')!,
        TECH_STACK_DATABASE.find(t => t.id === 'nodejs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'express')!,
        TECH_STACK_DATABASE.find(t => t.id === 'mongodb')!,
      ],
      tags: ['크로스플랫폼', 'JavaScript', '빠른개발']
    },
    {
      id: 'mobile-flutter',
      name: 'Flutter 기반',
      description: 'Flutter로 아름다운 네이티브 앱을 빠르게 만듭니다.',
      difficulty: 'intermediate',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'flutter')!,
        TECH_STACK_DATABASE.find(t => t.id === 'nodejs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'graphql')!,
        TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
      ],
      tags: ['Flutter', 'Dart', '네이티브']
    },
    {
      id: 'mobile-native',
      name: '네이티브 개발',
      description: 'Swift/Kotlin으로 최상의 성능과 UX를 구현합니다.',
      difficulty: 'advanced',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'swift')!,
        TECH_STACK_DATABASE.find(t => t.id === 'kotlin')!,
        TECH_STACK_DATABASE.find(t => t.id === 'spring')!,
        TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
      ],
      tags: ['네이티브', 'iOS', 'Android']
    },
  ],
  desktop: [
    {
      id: 'desktop-electron',
      name: 'Electron 기반',
      description: '웹 기술로 크로스 플랫폼 데스크톱 앱을 만듭니다.',
      difficulty: 'beginner',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'react')!,
        TECH_STACK_DATABASE.find(t => t.id === 'vite')!,
        TECH_STACK_DATABASE.find(t => t.id === 'nodejs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'sqlite')!,
      ],
      tags: ['Electron', '크로스플랫폼', '웹기술']
    },
    {
      id: 'desktop-tauri',
      name: 'Tauri (경량)',
      description: 'Rust 기반 Tauri로 작고 빠른 데스크톱 앱을 만듭니다.',
      difficulty: 'intermediate',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'react')!,
        TECH_STACK_DATABASE.find(t => t.id === 'tailwind')!,
        TECH_STACK_DATABASE.find(t => t.id === 'sqlite')!,
      ],
      tags: ['Tauri', 'Rust', '경량']
    },
    {
      id: 'desktop-native',
      name: '네이티브 데스크톱',
      description: '플랫폼별 네이티브 기술로 최적의 성능을 제공합니다.',
      difficulty: 'advanced',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'swift')!,
        TECH_STACK_DATABASE.find(t => t.id === 'kotlin')!,
      ],
      tags: ['네이티브', 'macOS', 'Windows']
    },
  ],
  library: [
    {
      id: 'library-npm',
      name: 'NPM 패키지',
      description: 'TypeScript로 재사용 가능한 NPM 라이브러리를 만듭니다.',
      difficulty: 'intermediate',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'vite')!,
        TECH_STACK_DATABASE.find(t => t.id === 'github-actions')!,
      ],
      tags: ['TypeScript', 'NPM', '라이브러리']
    },
    {
      id: 'library-react',
      name: 'React 컴포넌트',
      description: 'React 컴포넌트 라이브러리를 개발합니다.',
      difficulty: 'intermediate',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'react')!,
        TECH_STACK_DATABASE.find(t => t.id === 'vite')!,
        TECH_STACK_DATABASE.find(t => t.id === 'tailwind')!,
      ],
      tags: ['React', 'UI', '컴포넌트']
    },
    {
      id: 'library-python',
      name: 'Python 패키지',
      description: 'Python 라이브러리를 개발하고 PyPI에 배포합니다.',
      difficulty: 'intermediate',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'github-actions')!,
      ],
      tags: ['Python', 'PyPI', '패키지']
    },
  ],
  other: [
    {
      id: 'other-minimal',
      name: '최소 구성',
      description: '필수적인 도구만으로 시작합니다.',
      difficulty: 'beginner',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'nodejs')!,
      ],
      tags: ['최소', '유연성']
    },
    {
      id: 'other-standard',
      name: '표준 웹 스택',
      description: '일반적인 웹 개발 스택입니다.',
      difficulty: 'intermediate',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'react')!,
        TECH_STACK_DATABASE.find(t => t.id === 'nodejs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
      ],
      tags: ['표준', '웹']
    },
    {
      id: 'other-fullstack',
      name: '풀스택',
      description: '프론트엔드부터 백엔드, 인프라까지 전체 스택입니다.',
      difficulty: 'advanced',
      techStack: [
        TECH_STACK_DATABASE.find(t => t.id === 'nextjs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'nestjs')!,
        TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
        TECH_STACK_DATABASE.find(t => t.id === 'docker')!,
        TECH_STACK_DATABASE.find(t => t.id === 'aws')!,
      ],
      tags: ['풀스택', '클라우드', '확장성']
    },
  ],
};

// AI 아이디어 파싱 시뮬레이션
export function parseIdea(idea: string): WizardStep1Data['parsedData'] {
  const lowerIdea = idea.toLowerCase();

  // 프로젝트 이름 추출 (첫 문장의 핵심 명사)
  const suggestedName = idea
    .split('\n')[0]
    .split('.')[0]
    .trim()
    .substring(0, 50);

  // 프로젝트 타입 추론
  let suggestedType: ProjectType = 'other';
  if (lowerIdea.includes('웹') || lowerIdea.includes('web') || lowerIdea.includes('사이트') || lowerIdea.includes('플랫폼')) {
    suggestedType = 'web';
  } else if (lowerIdea.includes('모바일') || lowerIdea.includes('앱') || lowerIdea.includes('mobile') || lowerIdea.includes('ios') || lowerIdea.includes('android')) {
    suggestedType = 'mobile';
  } else if (lowerIdea.includes('데스크톱') || lowerIdea.includes('desktop') || lowerIdea.includes('electron')) {
    suggestedType = 'desktop';
  } else if (lowerIdea.includes('라이브러리') || lowerIdea.includes('library') || lowerIdea.includes('패키지') || lowerIdea.includes('컴포넌트')) {
    suggestedType = 'library';
  }

  // 키워드 추출
  const keywords: string[] = [];
  const keywordPatterns = [
    { pattern: /실시간|realtime|websocket/i, keyword: '실시간' },
    { pattern: /채팅|chat/i, keyword: '채팅' },
    { pattern: /소셜|social/i, keyword: '소셜' },
    { pattern: /커머스|쇼핑|commerce/i, keyword: '이커머스' },
    { pattern: /관리|admin|dashboard/i, keyword: '관리' },
    { pattern: /분석|analytics/i, keyword: '분석' },
    { pattern: /AI|인공지능|머신러닝/i, keyword: 'AI' },
    { pattern: /블록체인|blockchain/i, keyword: '블록체인' },
    { pattern: /게임|game/i, keyword: '게임' },
    { pattern: /교육|education/i, keyword: '교육' },
  ];

  keywordPatterns.forEach(({ pattern, keyword }) => {
    if (pattern.test(lowerIdea)) {
      keywords.push(keyword);
    }
  });

  return {
    suggestedName,
    suggestedType,
    keywords,
  };
}

// 기술 스택 추천 가져오기
export function getRecommendations(
  step1Data?: WizardStep1Data,
  step2Data?: WizardStep2Data
): TechStackRecommendation[] {
  const projectType = step2Data?.type || step1Data?.parsedData?.suggestedType || 'web';
  return RECOMMENDATIONS[projectType] || RECOMMENDATIONS.other;
}

// 키워드 기반 추가 기술 추천
export function suggestAdditionalTech(keywords: string[]): TechStackItem[] {
  const suggestions: TechStackItem[] = [];

  keywords.forEach(keyword => {
    switch (keyword) {
      case '실시간':
        suggestions.push(
          TECH_STACK_DATABASE.find(t => t.id === 'redis')!,
        );
        break;
      case 'AI':
        // AI 관련 기술은 데이터베이스에 없으므로 커스텀 추가
        break;
      case '이커머스':
        suggestions.push(
          TECH_STACK_DATABASE.find(t => t.id === 'postgresql')!,
          TECH_STACK_DATABASE.find(t => t.id === 'redis')!,
        );
        break;
    }
  });

  // 중복 제거
  return Array.from(new Set(suggestions));
}
