import {
  User,
  Project,
  Task,
  Notification,
  GitHubPR,
  Template,
  GitHubRepository,
  GitHubCommit,
  GitHubBranch,
  GitHubPullRequest,
  GitHubIssue,
  GitHubFile,
  GitHubTreeItem,
  GitHubFileContent,
  DeploymentStatus,
  DeploymentHistoryItem,
  MonitoringStatus,
  MonitoringMetric,
  MonitoringAlert,
  AggregatedMetrics,
  TimeRange,
  SecurityStatus,
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'alice@example.com',
    name: '김지수',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'developer',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    bio: '풀스택 개발자입니다. 사이드 프로젝트를 좋아합니다.',
    githubUsername: 'alice-dev',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: 'user-2',
    email: 'bob@example.com',
    name: '박민준',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'designer',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'Design System'],
    bio: 'UI/UX 디자이너로 사용자 경험을 중시합니다.',
    githubUsername: 'bob-design',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-09-28'),
  },
  {
    id: 'user-3',
    email: 'charlie@example.com',
    name: '이서연',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'developer',
    skills: ['Vue.js', 'React', 'GraphQL', 'AWS'],
    bio: '프론트엔드 개발자입니다.',
    githubUsername: 'charlie-fe',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-10-05'),
  },
  {
    id: 'user-4',
    email: 'david@example.com',
    name: '최준호',
    avatar: 'https://i.pravatar.cc/150?img=4',
    role: 'planner',
    skills: ['Product Management', 'Agile', 'Jira', 'Documentation'],
    bio: '프로덕트 기획자입니다.',
    githubUsername: 'david-pm',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-10-02'),
  },
  {
    id: 'user-5',
    email: 'eve@example.com',
    name: '정예은',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'developer',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
    bio: '백엔드 개발자입니다.',
    githubUsername: 'eve-backend',
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-10-06'),
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'OpenKnot',
    description: '깃허브 연동 기반의 올인원 프로젝트 협업 툴 및 구인/구직 플랫폼',
    ownerId: 'user-1',
    status: 'in_progress',
    visibility: 'public',
    techStack: ['React', 'TypeScript', 'Vite', 'Bun', 'Tailwind CSS'],
    positions: [
      {
        id: 'pos-1',
        role: 'developer',
        count: 2,
        filled: 1,
        requirements: ['React', 'TypeScript', '협업 경험'],
        description: '프론트엔드 개발자를 찾습니다.',
      },
    ],
    members: [
      { userId: 'user-1', role: 'owner', position: 'Full Stack Developer', joinedAt: new Date('2024-09-01') },
      { userId: 'user-3', role: 'member', position: 'Frontend Developer', joinedAt: new Date('2024-09-15') },
    ],
    repositories: ['repo-1', 'repo-2', 'repo-3'],
    repositoryGroups: {
      프런트엔드: ['repo-1'],
      백엔드: ['repo-2'],
      인프라: ['repo-3'],
    },
    startDate: new Date('2024-09-01'),
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-10-07'),
  },
  {
    id: 'project-2',
    name: 'AI 스터디 매칭',
    description: '학생들을 위한 AI 기반 스터디 그룹 매칭 서비스',
    ownerId: 'user-2',
    status: 'recruiting',
    visibility: 'public',
    techStack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'TensorFlow'],
    positions: [
      {
        id: 'pos-2',
        role: 'developer',
        count: 2,
        filled: 0,
        requirements: ['Python', 'FastAPI', 'ML 경험'],
        description: '백엔드 개발자를 찾습니다.',
      },
      {
        id: 'pos-3',
        role: 'developer',
        count: 1,
        filled: 0,
        requirements: ['React', 'TypeScript'],
        description: '프론트엔드 개발자를 찾습니다.',
      },
    ],
    members: [
      { userId: 'user-2', role: 'owner', position: 'Designer & PM', joinedAt: new Date('2024-08-15') },
      { userId: 'user-4', role: 'member', position: 'Product Manager', joinedAt: new Date('2024-09-01') },
    ],
    githubRepo: 'https://github.com/bob-design/ai-study',
    startDate: new Date('2024-08-15'),
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-10-05'),
  },
  {
    id: 'project-3',
    name: '친환경 배달 서비스',
    description: '친환경 포장재를 사용하는 배달 플랫폼 MVP',
    ownerId: 'user-5',
    status: 'in_progress',
    visibility: 'public',
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Vercel'],
    positions: [
      {
        id: 'pos-4',
        role: 'designer',
        count: 1,
        filled: 1,
        requirements: ['Figma', 'UI/UX 디자인'],
        description: 'UI/UX 디자이너를 찾습니다.',
      },
    ],
    members: [
      { userId: 'user-5', role: 'owner', position: 'Backend Developer', joinedAt: new Date('2024-07-01') },
      { userId: 'user-1', role: 'member', position: 'Full Stack Developer', joinedAt: new Date('2024-07-10') },
      { userId: 'user-2', role: 'member', position: 'Designer', joinedAt: new Date('2024-07-20') },
    ],
    githubRepo: 'https://github.com/eve-backend/eco-delivery',
    startDate: new Date('2024-07-01'),
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-10-06'),
  },
  {
    id: 'project-4',
    name: '개발자 포트폴리오 빌더',
    description: '깃허브 연동으로 자동으로 포트폴리오를 생성해주는 서비스',
    ownerId: 'user-3',
    status: 'recruiting',
    visibility: 'public',
    techStack: ['Vue.js', 'Node.js', 'MongoDB', 'Express', 'GitHub API'],
    positions: [
      {
        id: 'pos-5',
        role: 'developer',
        count: 1,
        filled: 0,
        requirements: ['Vue.js', 'JavaScript'],
        description: '프론트엔드 개발자를 찾습니다.',
      },
    ],
    members: [
      { userId: 'user-3', role: 'owner', position: 'Full Stack Developer', joinedAt: new Date('2024-06-01') },
    ],
    githubRepo: 'https://github.com/charlie-fe/portfolio-builder',
    startDate: new Date('2024-06-01'),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-10-04'),
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: '로그인 기능 구현',
    description: 'GitHub OAuth를 사용한 로그인 기능 구현',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-1',
    dueDate: new Date('2024-10-08'),
    labels: ['feature', 'auth'],
    githubIssueNumber: 12,
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-07'),
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: '칸반 보드 UI 구현',
    description: '드래그 앤 드롭 기능이 있는 칸반 보드 구현',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: new Date('2024-10-10'),
    labels: ['feature', 'ui'],
    createdAt: new Date('2024-10-02'),
    updatedAt: new Date('2024-10-02'),
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: 'API 문서화',
    description: 'Swagger를 사용한 API 문서 작성',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'user-1',
    dueDate: new Date('2024-10-15'),
    labels: ['documentation'],
    createdAt: new Date('2024-10-03'),
    updatedAt: new Date('2024-10-03'),
  },
  {
    id: 'task-4',
    projectId: 'project-1',
    title: '프로젝트 생성 폼 디자인',
    description: '프로젝트 생성 플로우 UI/UX 디자인',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-3',
    labels: ['design'],
    createdAt: new Date('2024-09-25'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: 'task-5',
    projectId: 'project-1',
    title: '실시간 알림 기능',
    description: 'WebSocket을 사용한 실시간 알림 시스템',
    status: 'review',
    priority: 'medium',
    assigneeId: 'user-1',
    labels: ['feature', 'backend'],
    githubIssueNumber: 15,
    createdAt: new Date('2024-10-04'),
    updatedAt: new Date('2024-10-06'),
  },
  {
    id: 'task-6',
    projectId: 'project-2',
    title: 'AI 모델 학습',
    description: '스터디 매칭을 위한 ML 모델 학습',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'user-2',
    dueDate: new Date('2024-10-09'),
    labels: ['ai', 'ml'],
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-10-05'),
  },
  {
    id: 'task-7',
    projectId: 'project-3',
    title: '디자인 시스템 정리',
    description: 'Figma에서 컴포넌트 라이브러리 정리',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'user-2',
    dueDate: new Date('2024-10-09'),
    labels: ['design'],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-06'),
  },
  {
    id: 'task-8',
    projectId: 'project-3',
    title: '주문 시스템 구현',
    description: '배달 주문 및 결제 시스템 개발',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-5',
    dueDate: new Date('2024-10-20'),
    labels: ['feature', 'backend'],
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-05'),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'task_assigned',
    title: '새로운 태스크가 할당되었습니다',
    content: '"로그인 기능 구현" 태스크가 할당되었습니다.',
    link: '/projects/project-1',
    read: false,
    createdAt: new Date('2024-10-07T10:30:00'),
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'pr_requested',
    title: 'PR 리뷰 요청',
    content: 'PR #42 "인증 기능 추가"에 대한 리뷰가 요청되었습니다.',
    link: '/projects/project-1',
    read: false,
    createdAt: new Date('2024-10-07T09:15:00'),
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'message',
    content: '박민준님이 메시지를 보냈습니다: "디자인 시안 확인 부탁드립니다."',
    title: '새 메시지',
    link: '/messages',
    read: true,
    createdAt: new Date('2024-10-06T14:20:00'),
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'invite',
    title: '프로젝트 초대',
    content: '정예은님이 "친환경 배달 서비스" 프로젝트에 초대했습니다.',
    link: '/projects/project-3',
    read: true,
    createdAt: new Date('2024-10-05T11:00:00'),
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    type: 'issue_created',
    title: '새로운 이슈 생성',
    content: 'GitHub 이슈 #18 "Fix login bug"가 생성되었습니다.',
    link: '/projects/project-1',
    read: true,
    createdAt: new Date('2024-10-04T16:45:00'),
  },
  {
    id: 'notif-6',
    userId: 'user-1',
    type: 'task_assigned',
    title: '긴급 태스크 할당',
    content: '"데이터베이스 마이그레이션" 태스크가 긴급으로 할당되었습니다.',
    link: '/projects/project-1',
    read: false,
    createdAt: new Date('2024-10-07T08:00:00'),
  },
  {
    id: 'notif-7',
    userId: 'user-1',
    type: 'message',
    title: '새 메시지',
    content: '이서연님: "칸반 보드 구현 완료했습니다. 확인 부탁드려요!"',
    link: '/messages',
    read: false,
    createdAt: new Date('2024-10-07T07:30:00'),
  },
  {
    id: 'notif-8',
    userId: 'user-1',
    type: 'pr_requested',
    title: 'PR 승인 요청',
    content: 'PR #45 "Implement notification system"에 대한 승인이 필요합니다.',
    link: '/projects/project-1',
    read: false,
    createdAt: new Date('2024-10-07T06:45:00'),
  },
  {
    id: 'notif-9',
    userId: 'user-1',
    type: 'issue_created',
    title: '버그 리포트',
    content: '이슈 #25 "알림 센터 닫기 애니메이션 오류"가 생성되었습니다.',
    link: '/projects/project-1',
    read: false,
    createdAt: new Date('2024-10-07T05:20:00'),
  },
  {
    id: 'notif-10',
    userId: 'user-1',
    type: 'invite',
    title: '새 프로젝트 초대',
    content: '최준호님이 "모바일 앱 리뉴얼" 프로젝트에 초대했습니다.',
    link: '/projects/project-2',
    read: false,
    createdAt: new Date('2024-10-07T04:00:00'),
  },
  {
    id: 'notif-11',
    userId: 'user-1',
    type: 'task_assigned',
    title: '코드 리뷰 요청',
    content: '"API 성능 최적화" 태스크에 대한 코드 리뷰가 필요합니다.',
    link: '/projects/project-1',
    read: false,
    createdAt: new Date('2024-10-06T23:30:00'),
  },
  {
    id: 'notif-12',
    userId: 'user-1',
    type: 'message',
    title: '팀 공지',
    content: '내일 오전 10시 스프린트 회의가 예정되어 있습니다.',
    link: '/messages',
    read: false,
    createdAt: new Date('2024-10-06T22:00:00'),
  },
];

// Mock GitHub PRs
export const mockGitHubPRs: GitHubPR[] = [
  {
    id: 1,
    projectId: 'project-1',
    number: 42,
    title: '인증 기능 추가',
    state: 'open',
    author: 'alice-dev',
    reviewers: ['charlie-fe', 'eve-backend'],
    createdAt: new Date('2024-10-06'),
    updatedAt: new Date('2024-10-07'),
  },
  {
    id: 2,
    projectId: 'project-1',
    number: 41,
    title: '칸반 보드 구현',
    state: 'merged',
    author: 'charlie-fe',
    reviewers: ['alice-dev'],
    createdAt: new Date('2024-10-03'),
    updatedAt: new Date('2024-10-05'),
  },
  {
    id: 3,
    projectId: 'project-1',
    number: 40,
    title: '반응형 레이아웃 문제 수정',
    state: 'closed',
    author: 'alice-dev',
    reviewers: ['charlie-fe'],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-02'),
  },
];

// Mock Templates
export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: '칸반 보드',
    description: '기본 칸반 보드 템플릿',
    type: 'kanban',
    isDefault: true,
    columns: [
      { id: 'col-1', name: 'To Do', order: 0, color: '#94a3b8' },
      { id: 'col-2', name: 'In Progress', order: 1, color: '#3b82f6' },
      { id: 'col-3', name: 'Review', order: 2, color: '#f59e0b' },
      { id: 'col-4', name: 'Done', order: 3, color: '#10b981' },
    ],
  },
  {
    id: 'template-2',
    name: '스크럼 보드',
    description: '스크럼 방식의 프로젝트 관리 템플릿',
    type: 'scrum',
    isDefault: true,
    columns: [
      { id: 'col-5', name: 'Backlog', order: 0, color: '#6b7280' },
      { id: 'col-6', name: 'Sprint', order: 1, color: '#8b5cf6' },
      { id: 'col-7', name: 'In Progress', order: 2, color: '#3b82f6' },
      { id: 'col-8', name: 'Testing', order: 3, color: '#f59e0b' },
      { id: 'col-9', name: 'Completed', order: 4, color: '#10b981' },
    ],
  },
  {
    id: 'template-3',
    name: '간단한 보드',
    description: '심플한 3단계 보드',
    type: 'custom',
    isDefault: false,
    columns: [
      { id: 'col-10', name: 'Todo', order: 0, color: '#94a3b8' },
      { id: 'col-11', name: 'Doing', order: 1, color: '#3b82f6' },
      { id: 'col-12', name: 'Done', order: 2, color: '#10b981' },
    ],
  },
];

// Current User (로그인된 사용자)
// Helper functions
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getTasksByProjectId(projectId: string): Task[] {
  return mockTasks.filter((t) => t.projectId === projectId);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getProjectsByUserId(userId: string): Project[] {
  return mockProjects.filter((p) =>
    p.members.some((m) => m.userId === userId)
  );
}

export function getUnreadNotifications(userId: string): Notification[] {
  return mockNotifications.filter((n) => n.userId === userId && !n.read);
}

// ========== GitHub Multi-Repo Mock Data ==========

// Mock Repositories
export const mockRepositories: GitHubRepository[] = [
  {
    id: 'repo-1',
    projectId: 'project-1',
    name: 'openknot-frontend',
    fullName: 'openknot/openknot-frontend',
    owner: 'openknot',
    url: 'https://github.com/openknot/openknot-frontend',
    defaultBranch: 'main',
    description: 'OpenKnot 플랫폼용 React 프런트엔드',
    language: 'TypeScript',
    isPrivate: false,
    stars: 45,
    forks: 12,
    openPRCount: 3,
    openIssueCount: 7,
    lastCommitSha: 'a3f9d2e',
    lastCommitMessage: 'feat: 다중 저장소 지원 GitHub 탭 추가',
    lastCommitAuthor: 'alice-dev',
    lastCommitDate: new Date('2024-10-07T14:30:00'),
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-10-07'),
    group: '프런트엔드',
    order: 1,
  },
  {
    id: 'repo-2',
    projectId: 'project-1',
    name: 'openknot-backend',
    fullName: 'openknot/openknot-backend',
    owner: 'openknot',
    url: 'https://github.com/openknot/openknot-backend',
    defaultBranch: 'main',
    description: 'OpenKnot를 위한 Spring Boot 백엔드 API',
    language: 'Kotlin',
    isPrivate: false,
    stars: 38,
    forks: 9,
    openPRCount: 2,
    openIssueCount: 4,
    lastCommitSha: 'b7c4f1a',
    lastCommitMessage: 'fix: 인증 토큰 만료 문제 해결',
    lastCommitAuthor: 'eve-backend',
    lastCommitDate: new Date('2024-10-07T11:15:00'),
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-10-07'),
    group: '백엔드',
    order: 2,
  },
  {
    id: 'repo-3',
    projectId: 'project-1',
    name: 'openknot-infra',
    fullName: 'openknot/openknot-infra',
    owner: 'openknot',
    url: 'https://github.com/openknot/openknot-infra',
    defaultBranch: 'main',
    description: '인프라 코드(IaC, Terraform, Kubernetes)',
    language: 'HCL',
    isPrivate: true,
    stars: 5,
    forks: 2,
    openPRCount: 1,
    openIssueCount: 2,
    lastCommitSha: 'c9e2a5f',
    lastCommitMessage: 'chore: Kubernetes 배포 설정 업데이트',
    lastCommitAuthor: 'alice-dev',
    lastCommitDate: new Date('2024-10-06T16:45:00'),
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2024-10-06'),
    group: '인프라',
    order: 3,
  },
];

// Mock Branches
export const mockBranches: GitHubBranch[] = [
  {
    name: 'main',
    sha: 'a3f9d2e',
    isProtected: true,
    isDefault: true,
    lastCommit: {
      sha: 'a3f9d2e',
      message: 'feat: 다중 저장소 지원 GitHub 탭 추가',
      author: 'alice-dev',
      date: new Date('2024-10-07T14:30:00'),
    },
  },
  {
    name: 'develop',
    sha: 'd4b8f3c',
    isProtected: false,
    isDefault: false,
    lastCommit: {
      sha: 'd4b8f3c',
      message: 'feat: D3 커밋 그래프 시각화 구현',
      author: 'charlie-fe',
      date: new Date('2024-10-07T12:00:00'),
    },
    aheadBy: 3,
    behindBy: 0,
  },
  {
    name: 'feature/deep-linking',
    sha: 'e5c7a2b',
    isProtected: false,
    isDefault: false,
    lastCommit: {
      sha: 'e5c7a2b',
      message: 'wip: GitHub에서 배포 탭으로 딥링크 추가',
      author: 'alice-dev',
      date: new Date('2024-10-07T10:15:00'),
    },
    aheadBy: 5,
    behindBy: 1,
  },
];

// Mock Commits (for GitKraken-style graph)
export const mockCommits: GitHubCommit[] = [
  {
    sha: 'a3f9d2e',
    message: 'feat: 다중 저장소 지원 GitHub 탭 추가',
    author: {
      name: 'Alice Kim',
      email: 'alice@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    committer: {
      name: 'Alice Kim',
      email: 'alice@example.com',
    },
    date: new Date('2024-10-07T14:30:00'),
    parents: ['f2a8c1d'],
    branch: ['main'],
    stats: {
      additions: 342,
      deletions: 28,
      total: 370,
    },
    files: [
      {
        filename: 'src/pages/GitHubPage.tsx',
        status: 'added',
        additions: 156,
        deletions: 0,
        changes: 156,
        patch: `diff --git a/src/pages/GitHubPage.tsx b/src/pages/GitHubPage.tsx
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/pages/GitHubPage.tsx
@@ -0,0 +1,42 @@
+import { useState } from 'react';
+import { GitBranch, GitCommit, GitPullRequest } from 'lucide-react';
+import { useProjectOutletContext } from '../components/layout/ProjectLayout';
+import { GitHubProvider, useGitHub } from '../contexts/GitHubContext';
+
+function GitHubPageContent() {
+  const { project } = useProjectOutletContext();
+  const { selectedRepository, repositories } = useGitHub();
+  const [selectedView, setSelectedView] = useState('commits');
+
+  return (
+    <div className="flex gap-6">
+      {/* Sidebar */}
+      <div className="w-80 shrink-0">
+        <h3 className="font-semibold mb-4">Repositories</h3>
+        {repositories.map((repo) => (
+          <div key={repo.id} className="p-3 rounded-md hover:bg-gray-50">
+            {repo.name}
+          </div>
+        ))}
+      </div>
+
+      {/* Main Content */}
+      <div className="flex-1">
+        {selectedRepository ? (
+          <div>
+            <h1 className="text-2xl font-bold mb-4">
+              {selectedRepository.fullName}
+            </h1>
+            <p className="text-gray-600">
+              {selectedRepository.description}
+            </p>
+          </div>
+        ) : (
+          <p>Select a repository</p>
+        )}
+      </div>
+    </div>
+  );
+}
+
+export default GitHubPageContent;`,
      },
      {
        filename: 'src/types/index.ts',
        status: 'modified',
        additions: 186,
        deletions: 28,
        changes: 214,
        patch: `diff --git a/src/types/index.ts b/src/types/index.ts
index abc1234..def5678 100644
--- a/src/types/index.ts
+++ b/src/types/index.ts
@@ -195,12 +195,24 @@ export interface GitHubRepository {
   lastCommitDate: Date;
 }

+export interface GitHubFileChange {
+  filename: string;
+  status: 'added' | 'modified' | 'removed' | 'renamed';
+  additions: number;
+  deletions: number;
+  changes: number;
+  patch?: string;
+  previousFilename?: string;
+}
+
 export interface GitHubCommit {
   sha: string;
   message: string;
   author: {
     name: string;
     email: string;
+    avatarUrl?: string;
   };
   committer: {
     name: string;
@@ -209,8 +221,12 @@ export interface GitHubCommit {
   date: Date;
   parents: string[];
   branch: string[];
-  stats?: {
+  stats: {
     additions: number;
     deletions: number;
     total: number;
   };
+  files: GitHubFileChange[];
 }`,
      },
      {
        filename: 'src/App.css',
        status: 'removed',
        additions: 0,
        deletions: 45,
        changes: 45,
        patch: `diff --git a/src/App.css b/src/App.css
deleted file mode 100644
index 1234567..0000000
--- a/src/App.css
+++ /dev/null
@@ -1,45 +0,0 @@
-.App {
-  text-align: center;
-}
-
-.App-logo {
-  height: 40vmin;
-  pointer-events: none;
-}
-
-@media (prefers-reduced-motion: no-preference) {
-  .App-logo {
-    animation: App-logo-spin infinite 20s linear;
-  }
-}
-
-.App-header {
-  background-color: #282c34;
-  min-height: 100vh;
-  display: flex;
-  flex-direction: column;
-  align-items: center;
-  justify-content: center;
-  font-size: calc(10px + 2vmin);
-  color: white;
-}
-
-.App-link {
-  color: #61dafb;
-}
-
-@keyframes App-logo-spin {
-  from {
-    transform: rotate(0deg);
-  }
-  to {
-    transform: rotate(360deg);
-  }
-}`,
      },
    ],
  },
  {
    sha: 'f2a8c1d',
    message: 'fix: ProjectLayout 병합 충돌 해결',
    author: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    committer: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
    },
    date: new Date('2024-10-07T13:00:00'),
    parents: ['b4e5f9c', 'd4b8f3c'],
    branch: ['main', 'develop'],
    stats: {
      additions: 12,
      deletions: 8,
      total: 20,
    },
    files: [],
  },
  {
    sha: 'd4b8f3c',
    message: 'feat: D3 커밋 그래프 시각화 구현',
    author: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    committer: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
    },
    date: new Date('2024-10-07T12:00:00'),
    parents: ['c7a3e2f'],
    branch: ['develop'],
    stats: {
      additions: 245,
      deletions: 15,
      total: 260,
    },
    files: [
      {
        filename: 'src/components/github/D3CommitGraph.tsx',
        status: 'added',
        additions: 245,
        deletions: 15,
        changes: 260,
        patch: `diff --git a/src/components/github/D3CommitGraph.tsx b/src/components/github/D3CommitGraph.tsx
new file mode 100644
index 0000000..abc1234
--- /dev/null
+++ b/src/components/github/D3CommitGraph.tsx
@@ -0,0 +1,245 @@
+import { useEffect, useRef, useState } from 'react';
+import * as d3 from 'd3';
+import type { GitHubCommit } from '../../types';
+
+interface D3CommitGraphProps {
+  commits: GitHubCommit[];
+  onCommitClick?: (commit: GitHubCommit) => void;
+  selectedCommit?: GitHubCommit | null;
+}
+
+interface GraphNode extends d3.SimulationNodeDatum {
+  commit: GitHubCommit;
+  id: string;
+  x?: number;
+  y?: number;
+}
+
+interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
+  source: string | GraphNode;
+  target: string | GraphNode;
+}
+
+export default function D3CommitGraph({
+  commits,
+  onCommitClick,
+  selectedCommit,
+}: D3CommitGraphProps) {
+  const svgRef = useRef<SVGSVGElement>(null);
+  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
+
+  useEffect(() => {
+    if (!svgRef.current || commits.length === 0) return;
+
+    // Clear previous graph
+    d3.select(svgRef.current).selectAll('*').remove();
+
+    const svg = d3.select(svgRef.current);
+    const width = dimensions.width;
+    const height = dimensions.height;
+
+    // Create nodes and links
+    const nodes: GraphNode[] = commits.map((commit) => ({
+      commit,
+      id: commit.sha,
+    }));
+
+    const links: GraphLink[] = [];
+    commits.forEach((commit) => {
+      commit.parents.forEach((parentSha) => {
+        if (commits.some((c) => c.sha === parentSha)) {
+          links.push({
+            source: commit.sha,
+            target: parentSha,
+          });
+        }
+      });
+    });
+
+    // Create force simulation
+    const simulation = d3
+      .forceSimulation<GraphNode>(nodes)
+      .force(
+        'link',
+        d3
+          .forceLink<GraphNode, GraphLink>(links)
+          .id((d) => d.id)
+          .distance(100)
+      )
+      .force('charge', d3.forceManyBody().strength(-300))
+      .force('center', d3.forceCenter(width / 2, height / 2))
+      .force('collision', d3.forceCollide().radius(30));
+
+    // Draw links
+    const link = svg
+      .append('g')
+      .selectAll('line')
+      .data(links)
+      .join('line')
+      .attr('stroke', '#94a3b8')
+      .attr('stroke-width', 2)
+      .attr('stroke-opacity', 0.6);
+
+    // Draw nodes
+    const node = svg
+      .append('g')
+      .selectAll('circle')
+      .data(nodes)
+      .join('circle')
+      .attr('r', 8)
+      .attr('fill', (d) => {
+        if (selectedCommit?.sha === d.commit.sha) return '#3b82f6';
+        return d.commit.branch.includes('main') ? '#10b981' : '#8b5cf6';
+      })
+      .attr('stroke', '#fff')
+      .attr('stroke-width', 2)
+      .style('cursor', 'pointer')
+      .on('click', (event, d) => {
+        event.stopPropagation();
+        onCommitClick?.(d.commit);
+      });
+
+    // Add labels
+    const label = svg
+      .append('g')
+      .selectAll('text')
+      .data(nodes)
+      .join('text')
+      .text((d) => d.commit.sha.substring(0, 7))
+      .attr('font-size', 10)
+      .attr('dx', 12)
+      .attr('dy', 4)
+      .style('pointer-events', 'none');
+
+    // Update positions on simulation tick
+    simulation.on('tick', () => {
+      link
+        .attr('x1', (d) => (d.source as GraphNode).x || 0)
+        .attr('y1', (d) => (d.source as GraphNode).y || 0)
+        .attr('x2', (d) => (d.target as GraphNode).x || 0)
+        .attr('y2', (d) => (d.target as GraphNode).y || 0);
+
+      node.attr('cx', (d) => d.x || 0).attr('cy', (d) => d.y || 0);
+
+      label.attr('x', (d) => d.x || 0).attr('y', (d) => d.y || 0);
+    });
+
+    // Cleanup
+    return () => {
+      simulation.stop();
+    };
+  }, [commits, dimensions, onCommitClick, selectedCommit]);
+
+  return (
+    <div className="w-full h-full">
+      <svg
+        ref={svgRef}
+        width={dimensions.width}
+        height={dimensions.height}
+        className="border border-gray-200 dark:border-gray-700 rounded-lg"
+      />
+    </div>
+  );
+}`,
      },
    ],
  },
  {
    sha: 'e5c7a2b',
    message: 'wip: GitHub에서 배포 탭으로 딥링크 추가',
    author: {
      name: 'Alice Kim',
      email: 'alice@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    committer: {
      name: 'Alice Kim',
      email: 'alice@example.com',
    },
    date: new Date('2024-10-07T10:15:00'),
    parents: ['c7a3e2f'],
    branch: ['feature/deep-linking'],
    stats: {
      additions: 87,
      deletions: 12,
      total: 99,
    },
    files: [],
  },
  {
    sha: 'c7a3e2f',
    message: 'refactor: RepoSelectorHeader 컴포넌트 추출',
    author: {
      name: 'Alice Kim',
      email: 'alice@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    committer: {
      name: 'Alice Kim',
      email: 'alice@example.com',
    },
    date: new Date('2024-10-07T09:30:00'),
    parents: ['b4e5f9c'],
    branch: ['main', 'develop', 'feature/deep-linking'],
    stats: {
      additions: 64,
      deletions: 42,
      total: 106,
    },
    files: [
      {
        filename: 'src/components/github/RepoSelectorHeader.tsx',
        status: 'added',
        additions: 64,
        deletions: 0,
        changes: 64,
        patch: `diff --git a/src/components/github/RepoSelectorHeader.tsx b/src/components/github/RepoSelectorHeader.tsx
new file mode 100644
index 0000000..def5678
--- /dev/null
+++ b/src/components/github/RepoSelectorHeader.tsx
@@ -0,0 +1,64 @@
+import { GitBranch, Star, GitFork, Eye } from 'lucide-react';
+import type { GitHubRepository } from '../../types';
+
+interface RepoSelectorHeaderProps {
+  repository: GitHubRepository;
+}
+
+export default function RepoSelectorHeader({ repository }: RepoSelectorHeaderProps) {
+  return (
+    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
+      {/* Repository Name */}
+      <div className="flex items-center gap-2 mb-2">
+        <GitBranch className="h-5 w-5 text-gray-600 dark:text-gray-400" />
+        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
+          {repository.fullName}
+        </h2>
+      </div>
+
+      {/* Description */}
+      {repository.description && (
+        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
+          {repository.description}
+        </p>
+      )}
+
+      {/* Repository Stats */}
+      <div className="flex items-center gap-4 text-sm">
+        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
+          <Star className="h-4 w-4" />
+          <span>{repository.stars.toLocaleString()}</span>
+        </div>
+        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
+          <GitFork className="h-4 w-4" />
+          <span>{repository.forks.toLocaleString()}</span>
+        </div>
+        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
+          <Eye className="h-4 w-4" />
+          <span>{repository.watchers.toLocaleString()}</span>
+        </div>
+        {repository.language && (
+          <div className="flex items-center gap-1.5">
+            <span
+              className="w-3 h-3 rounded-full"
+              style={{ backgroundColor: getLanguageColor(repository.language) }}
+            />
+            <span className="text-gray-700 dark:text-gray-300">
+              {repository.language}
+            </span>
+          </div>
+        )}
+      </div>
+    </div>
+  );
+}
+
+function getLanguageColor(language: string): string {
+  const colors: Record<string, string> = {
+    TypeScript: '#3178c6',
+    JavaScript: '#f1e05a',
+    Python: '#3572A5',
+    Go: '#00ADD8',
+  };
+  return colors[language] || '#8b8b8b';
+}`,
      },
      {
        filename: 'src/pages/GitHubPage.tsx',
        status: 'modified',
        additions: 0,
        deletions: 42,
        changes: 42,
        patch: `diff --git a/src/pages/GitHubPage.tsx b/src/pages/GitHubPage.tsx
index abc1234..def5678 100644
--- a/src/pages/GitHubPage.tsx
+++ b/src/pages/GitHubPage.tsx
@@ -1,51 +1,9 @@
 import { useState } from 'react';
-import { GitBranch, Star, GitFork, Eye } from 'lucide-react';
 import { useProjectOutletContext } from '../components/layout/ProjectLayout';
 import { GitHubProvider, useGitHub } from '../contexts/GitHubContext';
+import RepoSelectorHeader from '../components/github/RepoSelectorHeader';

 function GitHubPageContent() {
   const { project } = useProjectOutletContext();
   const { selectedRepository, repositories } = useGitHub();
-
-  const renderRepoHeader = (repo: GitHubRepository) => {
-    return (
-      <div className="border-b border-gray-200 pb-4 mb-4">
-        <div className="flex items-center gap-2 mb-2">
-          <GitBranch className="h-5 w-5 text-gray-600" />
-          <h2 className="text-xl font-bold">{repo.fullName}</h2>
-        </div>
-        {repo.description && (
-          <p className="text-sm text-gray-600 mb-3">{repo.description}</p>
-        )}
-        <div className="flex items-center gap-4 text-sm">
-          <div className="flex items-center gap-1.5">
-            <Star className="h-4 w-4" />
-            <span>{repo.stars}</span>
-          </div>
-          <div className="flex items-center gap-1.5">
-            <GitFork className="h-4 w-4" />
-            <span>{repo.forks}</span>
-          </div>
-          <div className="flex items-center gap-1.5">
-            <Eye className="h-4 w-4" />
-            <span>{repo.watchers}</span>
-          </div>
-        </div>
-      </div>
-    );
-  };

   return (
@@ -61,7 +19,7 @@ function GitHubPageContent() {
       <div className="flex-1">
         {selectedRepository ? (
           <div>
-            {renderRepoHeader(selectedRepository)}
+            <RepoSelectorHeader repository={selectedRepository} />
             <p className="text-gray-600">
               {selectedRepository.description}
             </p>`,
      },
    ],
  },
  {
    sha: 'b4e5f9c',
    message: 'feat: 다중 저장소 타입과 인터페이스 추가',
    author: {
      name: 'Eve Jung',
      email: 'eve@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    committer: {
      name: 'Eve Jung',
      email: 'eve@example.com',
    },
    date: new Date('2024-10-06T16:45:00'),
    parents: ['a1d9e4c'],
    branch: ['main'],
    stats: {
      additions: 198,
      deletions: 12,
      total: 210,
    },
    files: [
      {
        filename: 'src/types/index.ts',
        status: 'modified',
        additions: 198,
        deletions: 12,
        changes: 210,
        patch: `diff --git a/src/types/index.ts b/src/types/index.ts
index abc1234..def5678 100644
--- a/src/types/index.ts
+++ b/src/types/index.ts
@@ -180,18 +180,206 @@ export interface Project {
   updatedAt: Date;
 }

-export interface GitHubRepo {
-  id: string;
-  name: string;
-  url: string;
+// GitHub Types
+export interface GitHubRepository {
+  id: string;
+  name: string;
+  fullName: string;
+  description: string;
+  url: string;
+  defaultBranch: string;
+  isPrivate: boolean;
+  language: string;
+  stars: number;
+  forks: number;
+  watchers: number;
+  openIssues: number;
+  lastCommitDate: Date;
+}
+
+export interface GitHubCommit {
+  sha: string;
+  message: string;
+  author: {
+    name: string;
+    email: string;
+  };
+  committer: {
+    name: string;
+    email: string;
+  };
+  date: Date;
+  parents: string[];
+  branch: string[];
+  stats?: {
+    additions: number;
+    deletions: number;
+    total: number;
+  };
+}
+
+export interface GitHubPullRequest {
+  id: string;
+  repositoryId: string;
+  number: number;
+  title: string;
+  body: string;
+  state: 'open' | 'closed' | 'merged';
+  author: {
+    username: string;
+    avatarUrl: string;
+  };
+  assignees: string[];
+  reviewers: Array<{
+    username: string;
+    avatarUrl: string;
+    status: 'approved' | 'changes_requested' | 'pending';
+  }>;
+  labels: string[];
+  headBranch: string;
+  baseBranch: string;
+  files: GitHubFileChange[];
+  commits: number;
+  additions: number;
+  deletions: number;
+  checks: Array<{
+    id: string;
+    name: string;
+    status: 'pending' | 'completed' | 'queued';
+    conclusion?: 'success' | 'failure' | 'cancelled' | 'skipped';
+    detailsUrl: string;
+    startedAt: Date;
+    completedAt?: Date;
+  }>;
+  createdAt: Date;
+  updatedAt: Date;
+  mergedAt?: Date;
+  closedAt?: Date;
+}
+
+export interface GitHubIssue {
+  id: string;
+  repositoryId: string;
+  number: number;
+  title: string;
+  body: string;
+  state: 'open' | 'closed';
+  author: {
+    username: string;
+    avatarUrl: string;
+  };
+  assignees: string[];
+  labels: string[];
+  comments: number;
+  createdAt: Date;
+  updatedAt: Date;
+  closedAt?: Date;
+}
+
+export interface GitHubBranch {
+  name: string;
+  sha: string;
+  protected: boolean;
+  ahead: number;
+  behind: number;
+}`,
      },
    ],
  },
];

// Mock Pull Requests (Extended)
export const mockPullRequests: GitHubPullRequest[] = [
  {
    id: 'pr-1',
    repositoryId: 'repo-1',
    number: 42,
    title: 'GitHub 탭에 다중 저장소 지원 추가',
    body: '## 요약\n\n이 PR은 프로젝트당 여러 저장소를 지원하는 새로운 GitHub 탭을 구현합니다.\n\n## 변경 사항\n- GitHubPage 컴포넌트 추가\n- 저장소 전환 기능 구현\n- 다중 저장소 타입 추가\n\n## 테스트 계획\n- [ ] 단일 저장소로 테스트\n- [ ] 여러 저장소로 테스트\n- [ ] 딥링크 기능 테스트',
    state: 'open',
    author: {
      username: 'alice-dev',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    assignees: ['charlie-fe'],
    reviewers: [
      {
        username: 'charlie-fe',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        status: 'approved',
      },
      {
        username: 'eve-backend',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        status: 'pending',
      },
    ],
    labels: ['기능', '프런트엔드'],
    headBranch: 'feature/github-tab',
    baseBranch: 'main',
    files: [
      {
        filename: 'src/pages/GitHubPage.tsx',
        status: 'added',
        additions: 156,
        deletions: 0,
        changes: 156,
        patch: `--- /dev/null
+++ b/src/pages/GitHubPage.tsx
@@ -0,0 +1,50 @@
+import { useState } from 'react';
+import { GitBranch, GitCommit, GitPullRequest, FileCode } from 'lucide-react';
+import { useProjectOutletContext } from '../components/layout/ProjectLayout';
+import { GitHubProvider, useGitHub } from '../contexts/GitHubContext';
+
+function GitHubPageContent() {
+  const { project } = useProjectOutletContext();
+  const {
+    selectedRepository,
+    repositories,
+    selectRepository,
+    selectedView,
+    setSelectedView,
+    pullRequests,
+    commits,
+  } = useGitHub();
+
+  const tabs = [
+    { id: 'commits', label: 'Commits', icon: GitCommit },
+    { id: 'prs', label: 'Pull Requests', icon: GitPullRequest },
+    { id: 'files', label: 'Files', icon: FileCode },
+  ];
+
+  return (
+    <div className="space-y-6">
+      {selectedRepository ? (
+        <>
+          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg">
+            <h1 className="text-2xl font-bold">{selectedRepository.fullName}</h1>
+            <p className="text-purple-100">{selectedRepository.description}</p>
+          </div>
+          <RepositorySwitcher />
+          <CommitList commits={commits} />
+          <PullRequestList pullRequests={pullRequests} />
+        </>
+      ) : (
+        <EmptyState />
+      )}
+    </div>
+  );
+}
+
+export default function GitHubPage() {
+  const { project } = useProjectOutletContext();
+  return project ? (
+    <GitHubProvider projectId={project.id}>
+      <GitHubPageContent />
+    </GitHubProvider>
+  ) : null;
+}`,
      },
      {
        filename: 'src/types/index.ts',
        status: 'modified',
        additions: 186,
        deletions: 28,
        changes: 214,
        patch: `--- a/src/types/index.ts
+++ b/src/types/index.ts
@@ -120,34 +120,220 @@ export interface Comment {
   updatedAt: Date;
 }

-export interface Repository {
-  id: string;
-  projectId: string;
-  name: string;
-  url: string;
-  branch: string;
-  lastSync: Date;
-}
-
-export interface Commit {
-  id: string;
-  repositoryId: string;
-  sha: string;
-  message: string;
-  author: string;
-  date: Date;
-  files: number;
-  additions: number;
-  deletions: number;
-}
-
-export interface PullRequest {
-  id: number;
-  repositoryId: string;
-  number: number;
-  title: string;
-  state: 'open' | 'closed' | 'merged';
-  author: string;
-  createdAt: Date;
+// ========== GitHub Integration Types (Multi-Repo Support) ==========
+
+export interface GitHubRepository {
+  id: string;
+  projectId: string;
+  name: string; // e.g., "openknot-frontend"
+  fullName: string; // e.g., "owner/openknot-frontend"
+  owner: string;
+  url: string;
+  defaultBranch: string;
+  description?: string;
+  language: string;
+  isPrivate: boolean;
+
+  // Statistics
+  stars: number;
+  forks: number;
+  openPRCount: number;
+  openIssueCount: number;
+
+  // Last commit info (cached)
+  lastCommitSha?: string;
+  lastCommitMessage?: string;
+  lastCommitAuthor?: string;
+  lastCommitDate?: Date;
+
+  // Metadata
+  createdAt: Date;
+  updatedAt: Date;
+
+  // UI grouping (optional)
+  group?: string; // "backend", "frontend", "infra", etc.
+  order?: number; // Display order
+}
+
+export interface GitHubBranch {
+  name: string;
+  sha: string;
+  isProtected: boolean;
+  isDefault: boolean;
+  lastCommit: {
+    sha: string;
+    message: string;
+    author: string;
+    date: Date;
+  };
+  aheadBy?: number;
+  behindBy?: number;
+}
+
+export interface GitHubCommit {
+  sha: string;
+  message: string;
+  author: {
+    name: string;
+    email: string;
+    avatarUrl?: string;
+  };
+  committer: {
+    name: string;
+    email: string;
+  };
+  date: Date;
+  parents: string[];
+  branch: string[];
+  stats: {
+    additions: number;
+    deletions: number;
+    total: number;
+  };
+  files: GitHubFileChange[];
+}
+
+export interface GitHubFileChange {
+  filename: string;
+  status: 'added' | 'modified' | 'removed' | 'renamed';
+  additions: number;
+  deletions: number;
+  changes: number;
+  patch?: string;
+  previousFilename?: string;
+}
+
+export interface GitHubPullRequest {
+  id: string;
+  repositoryId: string;
+  number: number;
+  title: string;
+  body: string;
+  state: 'open' | 'closed' | 'merged';
+  author: {
+    username: string;
+    avatarUrl?: string;
+  };
+  assignees: string[];
+  reviewers: {
+    username: string;
+    avatarUrl?: string;
+    status: 'pending' | 'approved' | 'changes_requested' | 'commented';
+  }[];
+  labels: string[];
+
+  // Branch info
+  headBranch: string;
+  baseBranch: string;
+
+  // Changes
+  files: GitHubFileChange[];
+  commits: number;
+  additions: number;
+  deletions: number;
+
+  // CI/CD
+  checks: GitHubCheckRun[];
+
+  // Linked issues
+  linkedIssues: number[];
+
+  // Metadata
+  createdAt: Date;
+  updatedAt: Date;
+  mergedAt?: Date;
+  closedAt?: Date;
 }`,
      },
    ],
    commits: 8,
    additions: 342,
    deletions: 28,
    checks: [
      {
        id: 'check-1',
        name: '빌드',
        status: 'completed',
        conclusion: 'success',
        detailsUrl: 'https://github.com/openknot/openknot-frontend/actions/runs/123',
        startedAt: new Date('2024-10-07T14:35:00'),
        completedAt: new Date('2024-10-07T14:42:00'),
      },
      {
        id: 'check-2',
        name: '테스트',
        status: 'completed',
        conclusion: 'success',
        detailsUrl: 'https://github.com/openknot/openknot-frontend/actions/runs/124',
        startedAt: new Date('2024-10-07T14:35:00'),
        completedAt: new Date('2024-10-07T14:45:00'),
      },
      {
        id: 'check-3',
        name: '린트',
        status: 'completed',
        conclusion: 'success',
        detailsUrl: 'https://github.com/openknot/openknot-frontend/actions/runs/125',
        startedAt: new Date('2024-10-07T14:35:00'),
        completedAt: new Date('2024-10-07T14:38:00'),
      },
    ],
    linkedIssues: [18, 25],
    createdAt: new Date('2024-10-06T10:00:00'),
    updatedAt: new Date('2024-10-07T14:30:00'),
    reviewActivities: [
      {
        reviewer: 'charlie-fe',
        status: 'approved',
        comment: 'LGTM! 코드 잘 작성하셨네요. 저장소 전환 기능이 매끄럽게 동작합니다.',
        submittedAt: new Date('2024-10-07T14:30:00'),
      },
    ],
  },
  {
    id: 'pr-2',
    repositoryId: 'repo-1',
    number: 41,
    title: 'D3 기반 커밋 그래프 구현',
    body: '## 요약\n\nGitKraken 스타일의 커밋 시각화를 위한 커스텀 D3 구현입니다.\n\n## 기능\n- 분기/병합 라인\n- 줌 및 패닝\n- 브랜치/작성자별 필터\n- 클릭 시 커밋 상세 보기',
    state: 'open',
    author: {
      username: 'charlie-fe',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    assignees: [],
    reviewers: [
      {
        username: 'alice-dev',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        status: 'changes_requested',
      },
    ],
    labels: ['기능', '시각화'],
    headBranch: 'feature/d3-graph',
    baseBranch: 'develop',
    files: [
      {
        filename: 'src/components/github/D3CommitGraph.tsx',
        status: 'added',
        additions: 245,
        deletions: 0,
        changes: 245,
        patch: `--- /dev/null
+++ b/src/components/github/D3CommitGraph.tsx
@@ -0,0 +1,145 @@
+import { useEffect, useRef, useMemo } from 'react';
+import * as d3 from 'd3';
+import type { GitHubCommit } from '../../types';
+
+interface D3CommitGraphProps {
+  commits: GitHubCommit[];
+  onCommitClick?: (commit: GitHubCommit) => void;
+}
+
+interface GraphNode {
+  sha: string;
+  message: string;
+  author: string;
+  date: Date;
+  x: number;
+  y: number;
+  branch: string;
+}
+
+interface GraphLink {
+  source: GraphNode;
+  target: GraphNode;
+}
+
+export default function D3CommitGraph({ commits, onCommitClick }: D3CommitGraphProps) {
+  const svgRef = useRef<SVGSVGElement>(null);
+  const containerRef = useRef<HTMLDivElement>(null);
+
+  // Process commits into graph data
+  const graphData = useMemo(() => {
+    const nodes: GraphNode[] = [];
+    const links: GraphLink[] = [];
+    const commitMap = new Map<string, GraphNode>();
+
+    // Create nodes
+    commits.forEach((commit, index) => {
+      const node: GraphNode = {
+        sha: commit.sha,
+        message: commit.message,
+        author: commit.author.name,
+        date: commit.date,
+        x: 0,
+        y: index * 80,
+        branch: commit.branch[0] || 'main',
+      };
+      nodes.push(node);
+      commitMap.set(commit.sha, node);
+    });
+
+    // Create links
+    commits.forEach((commit) => {
+      const sourceNode = commitMap.get(commit.sha);
+      if (sourceNode && commit.parents) {
+        commit.parents.forEach((parentSha) => {
+          const targetNode = commitMap.get(parentSha);
+          if (targetNode) {
+            links.push({ source: sourceNode, target: targetNode });
+          }
+        });
+      }
+    });
+
+    return { nodes, links };
+  }, [commits]);
+
+  useEffect(() => {
+    if (!svgRef.current || !containerRef.current) return;
+
+    const container = containerRef.current;
+    const width = container.clientWidth;
+    const height = Math.max(600, graphData.nodes.length * 80);
+
+    // Clear previous content
+    d3.select(svgRef.current).selectAll('*').remove();
+
+    const svg = d3
+      .select(svgRef.current)
+      .attr('width', width)
+      .attr('height', height)
+      .attr('viewBox', [0, 0, width, height]);
+
+    // Create links
+    svg
+      .append('g')
+      .selectAll('path')
+      .data(graphData.links)
+      .join('path')
+      .attr('d', (d) => {
+        const sourceX = width / 2;
+        const sourceY = d.source.y;
+        const targetX = width / 2;
+        const targetY = d.target.y;
+        return \`M \${sourceX},\${sourceY} L \${targetX},\${targetY}\`;
+      })
+      .attr('stroke', '#cbd5e1')
+      .attr('stroke-width', 2)
+      .attr('fill', 'none');
+
+    // Create nodes
+    const nodeGroups = svg
+      .append('g')
+      .selectAll('g')
+      .data(graphData.nodes)
+      .join('g')
+      .attr('transform', (d) => \`translate(\${width / 2},\${d.y})\`)
+      .style('cursor', 'pointer')
+      .on('click', (event, d) => {
+        const commit = commits.find((c) => c.sha === d.sha);
+        if (commit && onCommitClick) {
+          onCommitClick(commit);
+        }
+      });
+
+    // Add circles
+    nodeGroups
+      .append('circle')
+      .attr('r', 8)
+      .attr('fill', '#3b82f6')
+      .attr('stroke', '#fff')
+      .attr('stroke-width', 2);
+
+    // Add commit message
+    nodeGroups
+      .append('text')
+      .attr('x', 20)
+      .attr('y', 5)
+      .attr('font-size', '14px')
+      .attr('fill', '#1f2937')
+      .text((d) => d.message.substring(0, 60) + (d.message.length > 60 ? '...' : ''));
+
+    // Add author and date
+    nodeGroups
+      .append('text')
+      .attr('x', 20)
+      .attr('y', 22)
+      .attr('font-size', '12px')
+      .attr('fill', '#6b7280')
+      .text((d) => \`\${d.author} • \${d.date.toLocaleDateString()}\`);
+  }, [graphData, commits, onCommitClick]);
+
+  return (
+    <div ref={containerRef} className="w-full overflow-auto">
+      <svg ref={svgRef} className="min-h-[600px]" />
+    </div>
+  );
+}`,
      },
    ],
    commits: 5,
    additions: 245,
    deletions: 0,
    checks: [
      {
        id: 'check-4',
        name: '빌드',
        status: 'in_progress',
        detailsUrl: 'https://github.com/openknot/openknot-frontend/actions/runs/126',
        startedAt: new Date('2024-10-07T12:05:00'),
      },
    ],
    linkedIssues: [],
    createdAt: new Date('2024-10-07T12:00:00'),
    updatedAt: new Date('2024-10-07T12:05:00'),
    reviewActivities: [
      {
        reviewer: 'alice-dev',
        status: 'commented',
        comment: 'D3 구현 방향은 좋아 보입니다. 몇 가지 질문이 있어요.',
        submittedAt: new Date('2024-10-07T12:03:00'),
      },
      {
        reviewer: 'alice-dev',
        status: 'changes_requested',
        comment: '성능 최적화가 필요합니다. 대량의 커밋 데이터가 있을 때 렌더링이 느립니다. useMemo로 노드/링크 계산을 최적화하고, 가상화를 고려해주세요.',
        submittedAt: new Date('2024-10-07T12:05:00'),
      },
    ],
  },
  {
    id: 'pr-3',
    repositoryId: 'repo-2',
    number: 15,
    title: '인증 토큰 만료 문제 수정',
    body: '## 문제\n\n토큰이 24시간이 아닌 1시간 후에 만료되고 있었습니다.\n\n## 해결\n\nJWT 설정을 수정해 올바른 만료 시간을 사용하도록 했습니다.',
    state: 'merged',
    author: {
      username: 'eve-backend',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    assignees: [],
    reviewers: [
      {
        username: 'alice-dev',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        status: 'approved',
      },
    ],
    labels: ['버그', '보안'],
    headBranch: 'fix/token-expiry',
    baseBranch: 'main',
    files: [
      {
        filename: 'src/main/kotlin/com/openknot/auth/JwtConfig.kt',
        status: 'modified',
        additions: 3,
        deletions: 1,
        changes: 4,
        patch: `--- a/src/main/kotlin/com/openknot/auth/JwtConfig.kt
+++ b/src/main/kotlin/com/openknot/auth/JwtConfig.kt
@@ -15,7 +15,9 @@ class JwtConfig {
     private val secret = environment.config.property("jwt.secret").getString()
     private val issuer = environment.config.property("jwt.issuer").getString()
     private val audience = environment.config.property("jwt.audience").getString()
-    private val validityInMs = 3600000 * 24 * 30 // 30 days
+    // Security fix: Reduce token validity from 30 days to 7 days
+    // Reference: Issue #42 - Excessive JWT token lifetime
+    private val validityInMs = 3600000 * 24 * 7 // 7 days

     fun generateToken(userId: String, email: String): String {
         val expiresAt = Date(System.currentTimeMillis() + validityInMs)`,
      },
    ],
    commits: 2,
    additions: 3,
    deletions: 1,
    checks: [
      {
        id: 'check-5',
        name: '백엔드 테스트',
        status: 'completed',
        conclusion: 'success',
        detailsUrl: 'https://github.com/openknot/openknot-backend/actions/runs/127',
        startedAt: new Date('2024-10-07T11:20:00'),
        completedAt: new Date('2024-10-07T11:28:00'),
      },
    ],
    linkedIssues: [42],
    createdAt: new Date('2024-10-07T11:15:00'),
    updatedAt: new Date('2024-10-07T11:30:00'),
    mergedAt: new Date('2024-10-07T11:30:00'),
    reviewActivities: [
      {
        reviewer: 'alice-dev',
        status: 'approved',
        comment: '보안 이슈 잘 수정하셨습니다. 토큰 만료 시간이 정확하게 설정되었네요. 머지해주세요!',
        submittedAt: new Date('2024-10-07T11:28:00'),
      },
    ],
  },
];

// Mock Issues
export const mockIssues: GitHubIssue[] = [
  {
    id: 'issue-1',
    repositoryId: 'repo-1',
    number: 18,
    title: '저장소 전환 UI 구현',
    body: 'GitHub 탭에서 저장소를 전환할 수 있는 깔끔한 UI 컴포넌트가 필요합니다.\n\n**요구 사항:**\n- 좌측 사이드바 목록 뷰\n- 검색/필터 기능\n- 저장소 통계 표시(PR 수, 이슈 수)\n- 페이지 새로고침 후에도 선택한 저장소 유지',
    state: 'open',
    author: {
      username: 'alice-dev',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    assignees: ['charlie-fe'],
    labels: ['개선', 'UI'],
    milestone: {
      title: 'v1.0 MVP',
      dueDate: new Date('2024-10-31'),
    },
    comments: [
      {
        id: 'comment-1',
        author: 'charlie-fe',
        body: '제가 작업해볼게요. 드롭다운과 사이드바 중 무엇을 사용할까요?',
        createdAt: new Date('2024-10-05T14:20:00'),
        updatedAt: new Date('2024-10-05T14:20:00'),
      },
      {
        id: 'comment-2',
        author: 'alice-dev',
        body: '여러 저장소를 다룰 때 UX가 더 좋은 좌측 사이드바로 가죠.',
        createdAt: new Date('2024-10-05T15:00:00'),
        updatedAt: new Date('2024-10-05T15:00:00'),
      },
    ],
    createdAt: new Date('2024-10-05T10:30:00'),
    updatedAt: new Date('2024-10-05T15:00:00'),
  },
  {
    id: 'issue-2',
    repositoryId: 'repo-1',
    number: 25,
    title: 'GitHub 탭에서 배포/모니터링으로 딥링크 추가',
    body: '저장소가 배포되면 해당 저장소로 필터링된 배포 혹은 모니터링 탭으로 이동하는 버튼을 보여주세요.',
    state: 'open',
    author: {
      username: 'alice-dev',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    assignees: ['alice-dev'],
    labels: ['개선', '통합'],
    comments: [],
    createdAt: new Date('2024-10-06T09:00:00'),
    updatedAt: new Date('2024-10-06T09:00:00'),
  },
  {
    id: 'issue-3',
    repositoryId: 'repo-1',
    number: 32,
    title: '1,000개 이상의 커밋에서 커밋 그래프 성능 문제',
    body: '커밋 이력이 많아지면 D3 그래프가 느려집니다. 가상화나 페이지네이션이 필요합니다.',
    state: 'open',
    author: {
      username: 'charlie-fe',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    assignees: [],
    labels: ['버그', '성능'],
    comments: [
      {
        id: 'comment-3',
        author: 'alice-dev',
        body: '커밋을 100개씩 묶어 불러오고 무한 스크롤을 적용하면 어떨까요?',
        createdAt: new Date('2024-10-07T08:15:00'),
        updatedAt: new Date('2024-10-07T08:15:00'),
      },
    ],
    createdAt: new Date('2024-10-07T08:00:00'),
    updatedAt: new Date('2024-10-07T08:15:00'),
  },
  {
    id: 'issue-4',
    repositoryId: 'repo-2',
    number: 42,
    title: 'JWT 토큰이 너무 빨리 만료됨',
    body: '사용자가 1시간 후에 로그아웃됩니다. 토큰 만료 시간은 24시간이어야 합니다.',
    state: 'closed',
    author: {
      username: 'alice-dev',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
    assignees: ['eve-backend'],
    labels: ['버그', '보안'],
    comments: [
      {
        id: 'comment-4',
        author: 'eve-backend',
        body: 'PR #15에서 수정했습니다. JWT_EXPIRATION을 86,400초로 변경했습니다.',
        createdAt: new Date('2024-10-07T11:25:00'),
        updatedAt: new Date('2024-10-07T11:25:00'),
      },
    ],
    createdAt: new Date('2024-10-07T10:00:00'),
    updatedAt: new Date('2024-10-07T11:30:00'),
    closedAt: new Date('2024-10-07T11:30:00'),
  },
];

// Mock File Tree
export const mockFiles: GitHubFile[] = [
  {
    path: 'src',
    name: 'src',
    type: 'dir',
    size: 0,
    sha: 'dir-1',
    url: 'https://github.com/openknot/openknot-frontend/tree/main/src',
  },
  {
    path: 'src/pages',
    name: 'pages',
    type: 'dir',
    size: 0,
    sha: 'dir-2',
    url: 'https://github.com/openknot/openknot-frontend/tree/main/src/pages',
  },
  {
    path: 'src/pages/GitHubPage.tsx',
    name: 'GitHubPage.tsx',
    type: 'file',
    size: 4562,
    sha: 'file-1',
    url: 'https://github.com/openknot/openknot-frontend/blob/main/src/pages/GitHubPage.tsx',
    content: 'import React from "react";\n\nexport default function GitHubPage() {\n  return <div>GitHub 탭</div>;\n}',
  },
  {
    path: 'src/components',
    name: 'components',
    type: 'dir',
    size: 0,
    sha: 'dir-3',
    url: 'https://github.com/openknot/openknot-frontend/tree/main/src/components',
  },
  {
    path: 'src/components/github',
    name: 'github',
    type: 'dir',
    size: 0,
    sha: 'dir-4',
    url: 'https://github.com/openknot/openknot-frontend/tree/main/src/components/github',
  },
];

// Mock Repository File Tree
export const mockFileTree: GitHubTreeItem[] = [
  {
    path: '.github',
    name: '.github',
    type: 'dir',
    size: 0,
    sha: 'tree-1',
    url: 'https://github.com/openknot/openknot-frontend/tree/main/.github',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/.github',
    children: [
      {
        path: '.github/workflows',
        name: 'workflows',
        type: 'dir',
        size: 0,
        sha: 'tree-1-1',
        url: 'https://github.com/openknot/openknot-frontend/tree/main/.github/workflows',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/.github/workflows',
        children: [
          {
            path: '.github/workflows/ci.yml',
            name: 'ci.yml',
            type: 'file',
            size: 1245,
            sha: 'file-1-1-1',
            url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/.github/workflows/ci.yml',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/.github/workflows/ci.yml',
            downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/.github/workflows/ci.yml',
            lastCommit: {
              message: 'chore: update CI workflow',
              author: 'alice-dev',
              date: new Date('2024-10-05T10:30:00'),
              sha: 'abc123def',
            },
          },
          {
            path: '.github/workflows/deploy.yml',
            name: 'deploy.yml',
            type: 'file',
            size: 2048,
            sha: 'file-1-1-2',
            url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/.github/workflows/deploy.yml',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/.github/workflows/deploy.yml',
            downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/.github/workflows/deploy.yml',
            lastCommit: {
              message: 'feat: add auto deployment',
              author: 'charlie-fe',
              date: new Date('2024-10-02T14:20:00'),
              sha: 'def456ghi',
            },
          },
        ],
      },
    ],
  },
  {
    path: 'public',
    name: 'public',
    type: 'dir',
    size: 0,
    sha: 'tree-2',
    url: 'https://github.com/openknot/openknot-frontend/tree/main/public',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/public',
    children: [
      {
        path: 'public/logo.svg',
        name: 'logo.svg',
        type: 'file',
        size: 3456,
        sha: 'file-2-1',
        url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/public/logo.svg',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/public/logo.svg',
        downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/public/logo.svg',
      },
      {
        path: 'public/favicon.ico',
        name: 'favicon.ico',
        type: 'file',
        size: 15086,
        sha: 'file-2-2',
        url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/public/favicon.ico',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/public/favicon.ico',
        downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/public/favicon.ico',
      },
    ],
  },
  {
    path: 'src',
    name: 'src',
    type: 'dir',
    size: 0,
    sha: 'tree-3',
    url: 'https://github.com/openknot/openknot-frontend/tree/main/src',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/src',
    children: [
      {
        path: 'src/components',
        name: 'components',
        type: 'dir',
        size: 0,
        sha: 'tree-3-1',
        url: 'https://github.com/openknot/openknot-frontend/tree/main/src/components',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/src/components',
        children: [
          {
            path: 'src/components/github',
            name: 'github',
            type: 'dir',
            size: 0,
            sha: 'tree-3-1-1',
            url: 'https://github.com/openknot/openknot-frontend/tree/main/src/components/github',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/src/components/github',
            children: [
              {
                path: 'src/components/github/GitHubTabs.tsx',
                name: 'GitHubTabs.tsx',
                type: 'file',
                size: 4821,
                sha: 'file-3-1-1-1',
                url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/components/github/GitHubTabs.tsx',
                htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/components/github/GitHubTabs.tsx',
                downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/components/github/GitHubTabs.tsx',
                lastCommit: {
                  message: 'feat: add files tab to GitHub view',
                  author: 'alice-dev',
                  date: new Date('2024-10-06T09:15:00'),
                  sha: 'ghi789jkl',
                },
              },
              {
                path: 'src/components/github/RepositorySwitcher.tsx',
                name: 'RepositorySwitcher.tsx',
                type: 'file',
                size: 3654,
                sha: 'file-3-1-1-2',
                url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/components/github/RepositorySwitcher.tsx',
                htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/components/github/RepositorySwitcher.tsx',
                downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/components/github/RepositorySwitcher.tsx',
              },
            ],
          },
          {
            path: 'src/components/ui',
            name: 'ui',
            type: 'dir',
            size: 0,
            sha: 'tree-3-1-2',
            url: 'https://github.com/openknot/openknot-frontend/tree/main/src/components/ui',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/src/components/ui',
            children: [
              {
                path: 'src/components/ui/Button.tsx',
                name: 'Button.tsx',
                type: 'file',
                size: 2341,
                sha: 'file-3-1-2-1',
                url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/components/ui/Button.tsx',
                htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/components/ui/Button.tsx',
                downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/components/ui/Button.tsx',
              },
              {
                path: 'src/components/ui/Input.tsx',
                name: 'Input.tsx',
                type: 'file',
                size: 1876,
                sha: 'file-3-1-2-2',
                url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/components/ui/Input.tsx',
                htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/components/ui/Input.tsx',
                downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/components/ui/Input.tsx',
              },
            ],
          },
        ],
      },
      {
        path: 'src/pages',
        name: 'pages',
        type: 'dir',
        size: 0,
        sha: 'tree-3-2',
        url: 'https://github.com/openknot/openknot-frontend/tree/main/src/pages',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/src/pages',
        children: [
          {
            path: 'src/pages/GitHubPage.tsx',
            name: 'GitHubPage.tsx',
            type: 'file',
            size: 12456,
            sha: 'file-3-2-1',
            url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/pages/GitHubPage.tsx',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/pages/GitHubPage.tsx',
            downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/pages/GitHubPage.tsx',
            lastCommit: {
              message: 'refactor: improve GitHub page layout',
              author: 'charlie-fe',
              date: new Date('2024-10-07T11:45:00'),
              sha: 'jkl012mno',
            },
          },
          {
            path: 'src/pages/ProjectsPage.tsx',
            name: 'ProjectsPage.tsx',
            type: 'file',
            size: 8734,
            sha: 'file-3-2-2',
            url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/pages/ProjectsPage.tsx',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/pages/ProjectsPage.tsx',
            downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/pages/ProjectsPage.tsx',
          },
        ],
      },
      {
        path: 'src/contexts',
        name: 'contexts',
        type: 'dir',
        size: 0,
        sha: 'tree-3-3',
        url: 'https://github.com/openknot/openknot-frontend/tree/main/src/contexts',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/src/contexts',
        children: [
          {
            path: 'src/contexts/GitHubContext.tsx',
            name: 'GitHubContext.tsx',
            type: 'file',
            size: 9876,
            sha: 'file-3-3-1',
            url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/contexts/GitHubContext.tsx',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/contexts/GitHubContext.tsx',
            downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/contexts/GitHubContext.tsx',
          },
        ],
      },
      {
        path: 'src/types',
        name: 'types',
        type: 'dir',
        size: 0,
        sha: 'tree-3-4',
        url: 'https://github.com/openknot/openknot-frontend/tree/main/src/types',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/tree/main/src/types',
        children: [
          {
            path: 'src/types/index.ts',
            name: 'index.ts',
            type: 'file',
            size: 5432,
            sha: 'file-3-4-1',
            url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/types/index.ts',
            htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/types/index.ts',
            downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/types/index.ts',
          },
        ],
      },
      {
        path: 'src/App.tsx',
        name: 'App.tsx',
        type: 'file',
        size: 3214,
        sha: 'file-3-5',
        url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/App.tsx',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/App.tsx',
        downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/App.tsx',
        lastCommit: {
          message: 'feat: add routing setup',
          author: 'alice-dev',
          date: new Date('2024-09-28T16:00:00'),
          sha: 'mno345pqr',
        },
      },
      {
        path: 'src/main.tsx',
        name: 'main.tsx',
        type: 'file',
        size: 876,
        sha: 'file-3-6',
        url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/main.tsx',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/main.tsx',
        downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/main.tsx',
      },
      {
        path: 'src/index.css',
        name: 'index.css',
        type: 'file',
        size: 2145,
        sha: 'file-3-7',
        url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/src/index.css',
        htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/src/index.css',
        downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/src/index.css',
      },
    ],
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    type: 'file',
    size: 543,
    sha: 'file-4',
    url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/.gitignore',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/.gitignore',
    downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/.gitignore',
  },
  {
    path: 'package.json',
    name: 'package.json',
    type: 'file',
    size: 2876,
    sha: 'file-5',
    url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/package.json',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/package.json',
    downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/package.json',
    lastCommit: {
      message: 'chore: update dependencies',
      author: 'alice-dev',
      date: new Date('2024-10-07T08:30:00'),
      sha: 'pqr678stu',
    },
  },
  {
    path: 'README.md',
    name: 'README.md',
    type: 'file',
    size: 4521,
    sha: 'file-6',
    url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/README.md',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/README.md',
    downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/README.md',
    lastCommit: {
      message: 'docs: update README with setup instructions',
      author: 'bob-design',
      date: new Date('2024-10-01T14:00:00'),
      sha: 'stu901vwx',
    },
  },
  {
    path: 'tsconfig.json',
    name: 'tsconfig.json',
    type: 'file',
    size: 1234,
    sha: 'file-7',
    url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/tsconfig.json',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/tsconfig.json',
    downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/tsconfig.json',
  },
  {
    path: 'vite.config.ts',
    name: 'vite.config.ts',
    type: 'file',
    size: 987,
    sha: 'file-8',
    url: 'https://api.github.com/repos/openknot/openknot-frontend/contents/vite.config.ts',
    htmlUrl: 'https://github.com/openknot/openknot-frontend/blob/main/vite.config.ts',
    downloadUrl: 'https://raw.githubusercontent.com/openknot/openknot-frontend/main/vite.config.ts',
  },
];

// Mock File Contents
export const mockFileContents: Record<string, GitHubFileContent> = {
  'README.md': {
    path: 'README.md',
    name: 'README.md',
    content: `# OpenKnot

OpenKnot은 깃허브 연동 기반의 올인원 프로젝트 협업 툴 및 구인/구직 플랫폼입니다.

## 주요 기능

- 📊 **프로젝트 관리**: 칸반 보드로 태스크 관리
- 🔗 **GitHub 연동**: PR, Issues, Commits 실시간 모니터링
- 👥 **팀 협업**: 실시간 채팅 및 알림
- 🚀 **배포 관리**: CI/CD 파이프라인 통합
- 📈 **모니터링**: 실시간 성능 모니터링 및 알림

## 기술 스택

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Bun

## 시작하기

\`\`\`bash
# 의존성 설치
bun install

# 개발 서버 실행
bun run dev

# 빌드
bun run build
\`\`\`

## 라이선스

MIT License`,
    encoding: 'utf-8',
    size: 4521,
    sha: 'file-6',
    language: 'markdown',
    lines: 38,
  },
  'package.json': {
    path: 'package.json',
    name: 'package.json',
    content: `{
  "name": "openknot",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.9.3",
    "@tanstack/react-query": "^5.62.11",
    "framer-motion": "^12.23.22",
    "lucide-react": "^0.545.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.3",
    "tailwindcss": "^4.1.14"
  }
}`,
    encoding: 'utf-8',
    size: 2876,
    sha: 'file-5',
    language: 'json',
    lines: 27,
  },
  'src/App.tsx': {
    path: 'src/App.tsx',
    name: 'App.tsx',
    content: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectsPage } from './pages/ProjectsPage';
import { GitHubPage } from './pages/GitHubPage';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/github" element={<GitHubPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;`,
    encoding: 'utf-8',
    size: 3214,
    sha: 'file-3-5',
    language: 'typescript',
    lines: 19,
  },
  'src/main.tsx': {
    path: 'src/main.tsx',
    name: 'main.tsx',
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    encoding: 'utf-8',
    size: 876,
    sha: 'file-3-6',
    language: 'typescript',
    lines: 10,
  },
  'tsconfig.json': {
    path: 'tsconfig.json',
    name: 'tsconfig.json',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
    encoding: 'utf-8',
    size: 1234,
    sha: 'file-7',
    language: 'json',
    lines: 26,
  },
  'vite.config.ts': {
    path: 'vite.config.ts',
    name: 'vite.config.ts',
    content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});`,
    encoding: 'utf-8',
    size: 987,
    sha: 'file-8',
    language: 'typescript',
    lines: 15,
  },
  '.gitignore': {
    path: '.gitignore',
    name: '.gitignore',
    content: `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
bun.lockb`,
    encoding: 'utf-8',
    size: 543,
    sha: 'file-4',
    language: 'text',
    lines: 25,
  },
};

// Mock Deployment Statuses (for cross-tab integration)
export const mockDeploymentStatuses: DeploymentStatus[] = [
  {
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    isDeployed: true,
    environment: 'production',
    lastDeployedAt: new Date('2024-10-07T14:35:00'),
    lastDeployedCommit: 'a3f9d2e',
    deploymentUrl: 'https://openknot.app',
    status: 'success',
  },
  {
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    isDeployed: true,
    environment: 'production',
    lastDeployedAt: new Date('2024-10-07T11:32:00'),
    lastDeployedCommit: 'b7c4f1a',
    deploymentUrl: 'https://api.openknot.app',
    status: 'success',
  },
  {
    repositoryId: 'repo-3',
    repositoryName: 'Mobile App',
    isDeployed: false,
  },
];

// Mock Deployment History
export const mockDeploymentHistory: DeploymentHistoryItem[] = [
  {
    id: 'deploy-1',
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    environment: 'production',
    status: 'success',
    commitHash: 'a3f9d2e',
    commitMessage: 'Fix: 사용자 프로필 페이지 렌더링 오류 수정',
    branch: 'main',
    deployedBy: 'kimcoding',
    deployedAt: new Date('2024-10-07T14:35:00'),
    duration: 245,
  },
  {
    id: 'deploy-2',
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    environment: 'production',
    status: 'success',
    commitHash: 'b7c4f1a',
    commitMessage: 'Feature: 새로운 인증 엔드포인트 추가',
    branch: 'main',
    deployedBy: 'leecoding',
    deployedAt: new Date('2024-10-07T11:32:00'),
    duration: 189,
  },
  {
    id: 'deploy-3',
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    environment: 'staging',
    status: 'success',
    commitHash: 'c8e2a1f',
    commitMessage: 'Update: 다크모드 스타일 개선',
    branch: 'develop',
    deployedBy: 'parkdev',
    deployedAt: new Date('2024-10-07T10:15:00'),
    duration: 198,
  },
  {
    id: 'deploy-4',
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    environment: 'staging',
    status: 'failed',
    commitHash: 'd1f3b9c',
    commitMessage: 'Fix: 데이터베이스 연결 풀 설정',
    branch: 'develop',
    deployedBy: 'choiops',
    deployedAt: new Date('2024-10-07T09:45:00'),
    duration: 67,
  },
  {
    id: 'deploy-5',
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    environment: 'dev',
    status: 'success',
    commitHash: 'e5d7c2a',
    commitMessage: 'WIP: 새로운 대시보드 UI 작업 중',
    branch: 'feature/new-dashboard',
    deployedBy: 'kimcoding',
    deployedAt: new Date('2024-10-06T16:20:00'),
    duration: 152,
  },
  {
    id: 'deploy-6',
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    environment: 'dev',
    status: 'success',
    commitHash: 'f9a4e8b',
    commitMessage: 'Test: 새로운 API 엔드포인트 테스트',
    branch: 'feature/api-v2',
    deployedBy: 'leecoding',
    deployedAt: new Date('2024-10-06T15:10:00'),
    duration: 143,
  },
  {
    id: 'deploy-7',
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    environment: 'production',
    status: 'success',
    commitHash: 'a1b2c3d',
    commitMessage: 'Hotfix: 긴급 보안 패치 적용',
    branch: 'hotfix/security-patch',
    deployedBy: 'adminuser',
    deployedAt: new Date('2024-10-06T08:30:00'),
    duration: 198,
  },
];

// Mock Monitoring Statuses
export const mockMonitoringStatuses: MonitoringStatus[] = [
  {
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    isMonitored: true,
    healthStatus: 'healthy',
    lastCheckedAt: new Date('2024-10-07T15:00:00'),
    activeAlerts: 0,
    uptime: 99.8,
  },
  {
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    isMonitored: true,
    healthStatus: 'healthy',
    lastCheckedAt: new Date('2024-10-07T15:00:00'),
    activeAlerts: 1,
    uptime: 99.5,
  },
  {
    repositoryId: 'repo-3',
    repositoryName: 'Mobile App',
    isMonitored: false,
  },
];

// Helper function to generate time-series metrics
function generateMetricsForTimeRange(
  repositoryId: string,
  repositoryName: string,
  timeRange: TimeRange
): MonitoringMetric[] {
  const now = new Date();
  const metrics: MonitoringMetric[] = [];

  let intervalMinutes: number;
  let dataPoints: number;

  switch (timeRange) {
    case '1h':
      intervalMinutes = 1;
      dataPoints = 60;
      break;
    case '24h':
      intervalMinutes = 30;
      dataPoints = 48;
      break;
    case '7d':
      intervalMinutes = 360; // 6 hours
      dataPoints = 28;
      break;
    case '30d':
      intervalMinutes = 1440; // 1 day
      dataPoints = 30;
      break;
  }

  // Base values vary by repository type
  let baseCpu = repositoryId === 'repo-1' ? 45 : repositoryId === 'repo-2' ? 62 : 30;
  let baseMemory = repositoryId === 'repo-1' ? 58 : repositoryId === 'repo-2' ? 71 : 40;
  let baseResponseTime = repositoryId === 'repo-1' ? 32 : repositoryId === 'repo-2' ? 58 : 25;

  for (let i = dataPoints - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);

    // Add some realistic variation
    const cpuVariation = (Math.random() - 0.5) * 20;
    const memoryVariation = (Math.random() - 0.5) * 15;
    const responseVariation = (Math.random() - 0.5) * 30;

    metrics.push({
      id: `metric-${repositoryId}-${i}`,
      repositoryId,
      repositoryName,
      timestamp,
      cpu: Math.max(0, Math.min(100, baseCpu + cpuVariation)),
      memory: Math.max(0, Math.min(100, baseMemory + memoryVariation)),
      disk: 38 + (Math.random() - 0.5) * 10,
      network: 1.2 + (Math.random() - 0.5) * 0.8,
      responseTime: Math.max(5, baseResponseTime + responseVariation),
      requestCount: Math.floor(8000 + Math.random() * 5000),
      errorRate: 0.01 + Math.random() * 0.03,
      activeConnections: Math.floor(300 + Math.random() * 200),
    });
  }

  return metrics;
}

// Mock Monitoring Metrics (24h data by default)
export const mockMonitoringMetrics: Record<string, MonitoringMetric[]> = {
  'repo-1': generateMetricsForTimeRange('repo-1', 'Frontend', '24h'),
  'repo-2': generateMetricsForTimeRange('repo-2', 'Backend API', '24h'),
};

// Helper function to generate a new live metric based on previous value
export function generateLiveMetric(
  previousMetric: MonitoringMetric,
  repositoryId: string,
  repositoryName: string
): MonitoringMetric {
  // Small variations for smooth transitions
  const cpuChange = (Math.random() - 0.5) * 5; // ±2.5%
  const memoryChange = (Math.random() - 0.5) * 3; // ±1.5%
  const diskChange = (Math.random() - 0.5) * 1; // ±0.5%
  const networkChange = (Math.random() - 0.5) * 0.2; // ±0.1 MB/s
  const responseChange = (Math.random() - 0.5) * 10; // ±5ms
  const requestChange = Math.floor((Math.random() - 0.5) * 1000); // ±500
  const errorChange = (Math.random() - 0.5) * 0.01; // ±0.005%
  const connectionChange = Math.floor((Math.random() - 0.5) * 50); // ±25

  return {
    id: `metric-${repositoryId}-${Date.now()}`,
    repositoryId,
    repositoryName,
    timestamp: new Date(),
    cpu: Math.max(0, Math.min(100, previousMetric.cpu + cpuChange)),
    memory: Math.max(0, Math.min(100, previousMetric.memory + memoryChange)),
    disk: Math.max(0, Math.min(100, previousMetric.disk + diskChange)),
    network: Math.max(0, previousMetric.network + networkChange),
    responseTime: Math.max(5, previousMetric.responseTime + responseChange),
    requestCount: Math.max(0, previousMetric.requestCount + requestChange),
    errorRate: Math.max(0, Math.min(10, previousMetric.errorRate + errorChange)),
    activeConnections: Math.max(0, previousMetric.activeConnections! + connectionChange),
  };
}

// Function to update live metrics for all repositories
export function updateLiveMetrics(): void {
  Object.keys(mockMonitoringMetrics).forEach((repoId) => {
    const metrics = mockMonitoringMetrics[repoId];
    if (metrics && metrics.length > 0) {
      const lastMetric = metrics[metrics.length - 1];
      const newMetric = generateLiveMetric(lastMetric, lastMetric.repositoryId, lastMetric.repositoryName);

      // Keep only last 100 data points to prevent memory issues
      if (metrics.length >= 100) {
        metrics.shift();
      }

      metrics.push(newMetric);
    }
  });
}

// Mock Monitoring Alerts
export const mockMonitoringAlerts: MonitoringAlert[] = [
  {
    id: 'alert-1',
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    timestamp: new Date('2024-10-07T14:30:00'),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'cpu',
    message: 'CPU 사용률이 경고 임계값을 초과했습니다',
    value: 85,
    threshold: 80,
    resolved: true,
  },
  {
    id: 'alert-2',
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    timestamp: new Date('2024-10-07T13:15:00'),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'response_time',
    message: '응답 시간이 증가했습니다',
    value: 250,
    threshold: 200,
    resolved: true,
  },
  {
    id: 'alert-3',
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    timestamp: new Date('2024-10-07T10:45:00'),
    type: 'service_down',
    severity: 'critical',
    message: '서비스가 다운되었습니다',
    resolved: true,
  },
  {
    id: 'alert-4',
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    timestamp: new Date('2024-10-07T10:50:00'),
    type: 'service_up',
    severity: 'info',
    message: '서비스가 정상적으로 복구되었습니다',
    resolved: true,
  },
  {
    id: 'alert-5',
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    timestamp: new Date('2024-10-07T09:20:00'),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'memory',
    message: '메모리 사용률이 높습니다',
    value: 78,
    threshold: 75,
    resolved: true,
  },
  {
    id: 'alert-6',
    repositoryId: 'repo-2',
    repositoryName: 'Backend API',
    timestamp: new Date('2024-10-07T08:05:00'),
    type: 'threshold_breach',
    severity: 'critical',
    metric: 'error_rate',
    message: '에러율이 임계값을 초과했습니다',
    value: 5.2,
    threshold: 5.0,
    resolved: true,
  },
  {
    id: 'alert-7',
    repositoryId: 'repo-1',
    repositoryName: 'Frontend',
    timestamp: new Date('2024-10-06T22:30:00'),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'network',
    message: '네트워크 사용량이 증가했습니다',
    value: 8.5,
    threshold: 8.0,
    resolved: true,
  },
];

// Mock Security Statuses
export const mockSecurityStatuses: SecurityStatus[] = [
  {
    repositoryId: 'repo-1',
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 3,
      low: 5,
    },
    lastScannedAt: new Date('2024-10-07T08:00:00'),
    complianceScore: 92,
  },
  {
    repositoryId: 'repo-2',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 4,
    },
    lastScannedAt: new Date('2024-10-07T08:00:00'),
    complianceScore: 95,
  },
  {
    repositoryId: 'repo-3',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 2,
    },
    lastScannedAt: new Date('2024-10-07T08:00:00'),
    complianceScore: 98,
  },
];

// ========================================
// PRODUCTION SHOWCASE PROJECT
// ========================================

// Production Users (3 new members)
const productionUsers: User[] = [
  {
    id: 'user-6',
    email: 'kang@example.com',
    name: '강민수',
    avatar: 'https://i.pravatar.cc/150?img=6',
    role: 'developer',
    position: 'DevOps Engineer',
    skills: ['DevOps', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Monitoring'],
    bio: 'DevOps 엔지니어입니다. 인프라 자동화와 안정적인 배포를 책임집니다.',
    githubUsername: 'kang-devops',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-10-08'),
  },
  {
    id: 'user-7',
    email: 'yoon@example.com',
    name: '윤지영',
    avatar: 'https://i.pravatar.cc/150?img=7',
    role: 'developer',
    position: 'Mobile Developer',
    skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Mobile UX'],
    bio: '모바일 개발자입니다. 크로스플랫폼 앱 개발이 주특기입니다.',
    githubUsername: 'yoon-mobile',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-10-08'),
  },
  {
    id: 'user-8',
    email: 'hong@example.com',
    name: '홍성준',
    avatar: 'https://i.pravatar.cc/150?img=8',
    role: 'other',
    position: 'QA Engineer',
    skills: ['QA', 'Test Automation', 'Selenium', 'Jest', 'Cypress', 'Performance Testing'],
    bio: 'QA 엔지니어입니다. 품질 보증과 자동화 테스트를 담당합니다.',
    githubUsername: 'hong-qa',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-10-08'),
  },
];

// Production Project
const productionProject: Project = {
  id: 'project-prod-1',
  name: 'OpenKnot Production',
  description: '실제 운영 중인 OpenKnot 플랫폼 - GitHub 연동 기반 프로젝트 협업 및 구인구직 서비스',
  ownerId: 'user-1',
  status: 'in_progress',
  visibility: 'public',
  techStack: ['React', 'TypeScript', 'Kotlin', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kubernetes', 'Terraform'],
  startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
  repositories: ['repo-prod-1', 'repo-prod-2', 'repo-prod-3', 'repo-prod-4'],
  repositoryGroups: {
    '프런트엔드': ['repo-prod-1'],
    '백엔드': ['repo-prod-2'],
    '모바일': ['repo-prod-3'],
    '인프라': ['repo-prod-4'],
  },
  positions: [
    {
      id: 'pos-prod-1',
      role: 'developer',
      title: 'Backend Developer',
      specialization: 'Spring Boot & Kotlin',
      count: 1,
      filled: 1,
      requirements: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'Redis'],
      description: '백엔드 API 개발',
    },
    {
      id: 'pos-prod-2',
      role: 'developer',
      title: 'Frontend Developer',
      specialization: 'React & TypeScript',
      count: 2,
      filled: 2,
      requirements: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
      description: '프론트엔드 개발',
    },
    {
      id: 'pos-prod-3',
      role: 'developer',
      title: 'Mobile Developer',
      specialization: 'React Native',
      count: 1,
      filled: 1,
      requirements: ['React Native', 'TypeScript', 'iOS', 'Android'],
      description: '모바일 앱 개발',
    },
    {
      id: 'pos-prod-4',
      role: 'developer',
      title: 'DevOps Engineer',
      specialization: 'Kubernetes & Terraform',
      count: 1,
      filled: 1,
      requirements: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
      description: 'DevOps 및 인프라',
    },
    {
      id: 'pos-prod-5',
      role: 'designer',
      title: 'Lead UI/UX Designer',
      count: 1,
      filled: 1,
      requirements: ['Figma', 'UI/UX', 'Design System'],
      description: 'UI/UX 디자인',
    },
    {
      id: 'pos-prod-6',
      role: 'planner',
      title: 'Product Manager',
      count: 1,
      filled: 1,
      requirements: ['Product Management', 'Agile'],
      description: '프로덕트 매니지먼트',
    },
    {
      id: 'pos-prod-7',
      role: 'other',
      title: 'QA Engineer',
      count: 1,
      filled: 1,
      requirements: ['QA', 'Test Automation'],
      description: 'QA 및 테스트',
    },
  ],
  members: [
    {
      userId: 'user-1',
      role: 'owner',
      position: 'Full Stack Developer',
      joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    },
    {
      userId: 'user-2',
      role: 'admin',
      position: 'Lead UI/UX Designer',
      joinedAt: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000),
    },
    {
      userId: 'user-3',
      role: 'member',
      position: 'Frontend Developer',
      joinedAt: new Date(Date.now() - 160 * 24 * 60 * 60 * 1000),
    },
    {
      userId: 'user-4',
      role: 'member',
      position: 'Product Manager',
      joinedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
    },
    {
      userId: 'user-5',
      role: 'member',
      position: 'Backend Developer',
      joinedAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
    },
    {
      userId: 'user-6',
      role: 'member',
      position: 'DevOps Engineer',
      joinedAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000),
    },
    {
      userId: 'user-7',
      role: 'member',
      position: 'Mobile Developer',
      joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    },
    {
      userId: 'user-8',
      role: 'member',
      position: 'QA Engineer',
      joinedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    },
  ],
  releaseChannel: 'stable',
  defaultBranch: 'main',
  autoDeployEnabled: true,
  branchProtectionEnabled: true,
  incidentAlertsEnabled: true,
  codeOwnerReviewRequired: true,
  designSyncEnabled: true,
  backupsEnabled: true,
  autoCloseTickets: false,
  envSecrets: {
    owner: 'user-1',
    lastRotatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    pendingRenewals: 2,
    integrations: ['GitHub', 'AWS', 'Slack', 'Sentry'],
  },
  createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
};

// Production Repositories (4 repos)
const productionRepos: GitHubRepository[] = [
  {
    id: 'repo-prod-1',
    projectId: 'project-prod-1',
    name: 'openknot-production-frontend',
    fullName: 'openknot/production-frontend',
    owner: 'openknot',
    url: 'https://github.com/openknot/production-frontend',
    defaultBranch: 'main',
    description: 'OpenKnot 프로덕션 환경 React 프론트엔드 - TypeScript + Vite + Tailwind CSS',
    language: 'TypeScript',
    isPrivate: false,
    stars: 156,
    forks: 32,
    openPRCount: 3,
    openIssueCount: 4,
    lastCommitSha: 'a9f2e1c',
    lastCommitMessage: 'feat: 프로젝트 대시보드 성능 최적화 (useMemo 적용)',
    lastCommitAuthor: 'charlie-fe',
    lastCommitDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    group: '프런트엔드',
    order: 1,
  },
  {
    id: 'repo-prod-2',
    projectId: 'project-prod-1',
    name: 'openknot-production-api',
    fullName: 'openknot/production-api',
    owner: 'openknot',
    url: 'https://github.com/openknot/production-api',
    defaultBranch: 'main',
    description: 'OpenKnot 백엔드 API - Spring Boot 3.x + Kotlin + PostgreSQL + Redis',
    language: 'Kotlin',
    isPrivate: false,
    stars: 142,
    forks: 28,
    openPRCount: 2,
    openIssueCount: 3,
    lastCommitSha: 'b8d3c4f',
    lastCommitMessage: 'fix: Redis 연결 풀 설정 최적화',
    lastCommitAuthor: 'eve-backend',
    lastCommitDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    group: '백엔드',
    order: 2,
  },
  {
    id: 'repo-prod-3',
    projectId: 'project-prod-1',
    name: 'openknot-production-mobile',
    fullName: 'openknot/production-mobile',
    owner: 'openknot',
    url: 'https://github.com/openknot/production-mobile',
    defaultBranch: 'main',
    description: 'OpenKnot 모바일 앱 - React Native + TypeScript (iOS & Android)',
    language: 'TypeScript',
    isPrivate: false,
    stars: 98,
    forks: 18,
    openPRCount: 2,
    openIssueCount: 5,
    lastCommitSha: 'c7e5a2b',
    lastCommitMessage: 'fix: Android 푸시 알림 버그 수정',
    lastCommitAuthor: 'yoon-mobile',
    lastCommitDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    group: '모바일',
    order: 3,
  },
  {
    id: 'repo-prod-4',
    projectId: 'project-prod-1',
    name: 'openknot-production-infra',
    fullName: 'openknot/production-infra',
    owner: 'openknot',
    url: 'https://github.com/openknot/production-infra',
    defaultBranch: 'main',
    description: 'OpenKnot 인프라 코드 - Terraform + Kubernetes + Helm Charts',
    language: 'HCL',
    isPrivate: true,
    stars: 45,
    forks: 12,
    openPRCount: 1,
    openIssueCount: 2,
    lastCommitSha: 'd9a1f8e',
    lastCommitMessage: 'chore: Kubernetes 1.28 마이그레이션 준비',
    lastCommitAuthor: 'kang-devops',
    lastCommitDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    group: '인프라',
    order: 4,
  },
];

// Production Branches
const productionBranches: GitHubBranch[] = [
  {
    name: 'main',
    sha: 'a9f2e1c',
    isProtected: true,
    isDefault: true,
    lastCommit: {
      sha: 'a9f2e1c',
      message: 'feat: 프로젝트 대시보드 성능 최적화',
      author: 'charlie-fe',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    aheadBy: 0,
    behindBy: 0,
  },
  {
    name: 'develop',
    sha: 'e3f7a9b',
    isProtected: false,
    isDefault: false,
    lastCommit: {
      sha: 'e3f7a9b',
      message: 'feat: 새 기능 개발 중',
      author: 'charlie-fe',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    aheadBy: 3,
    behindBy: 1,
  },
  {
    name: 'main',
    sha: 'b8d3c4f',
    isProtected: true,
    isDefault: true,
    lastCommit: {
      sha: 'b8d3c4f',
      message: 'fix: Redis 연결 풀 설정 최적화',
      author: 'eve-backend',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    aheadBy: 0,
    behindBy: 0,
  },
];

// Production Commits (25+ commits across all repos)
const productionCommits: GitHubCommit[] = [
  // Frontend commits (most recent)
  {
    sha: 'a9f2e1c',
    repositoryId: 'repo-prod-1',
    message: 'feat: 프로젝트 대시보드 성능 최적화 (useMemo 적용)',
    author: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    committer: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
    },
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    branch: ['main'],
    stats: { additions: 87, deletions: 43, total: 130 },
    files: [
      { filename:'src/pages/DashboardPage.tsx', additions: 42, deletions: 18, changes: 60, status: 'modified' },
      { filename:'src/components/ProjectCard.tsx', additions: 45, deletions: 25, changes: 70, status: 'modified' },
    ],
  },
  {
    sha: 'e7b4c2d',
    repositoryId: 'repo-prod-1',
    message: 'fix: 알림 센터 스크롤 버그 수정',
    author: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    committer: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
    },
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
    branch: ['main'],
    stats: { additions: 12, deletions: 5, total: 17 },
    files: [{ path: 'src/components/NotificationCenter.tsx', additions: 12, deletions: 5, status: 'modified' }],
  },
  {
    sha: 'c3a8f9e',
    repositoryId: 'repo-prod-1',
    message: 'feat: GitHub 파일 트리 뷰어 구현',
    author: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    },
    committer: {
      name: 'Charlie Lee',
      email: 'charlie@example.com',
    },
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    branch: ['main'],
    stats: { additions: 456, deletions: 23, total: 479 },
    files: [
      { filename:'src/components/github/FileTreeViewer.tsx', additions: 320, deletions: 0, changes: 320, status: 'added' },
      { filename:'src/components/github/FileContent.tsx', additions: 136, deletions: 23, changes: 159, status: 'modified' },
    ],
  },
  // Backend commits
  {
    sha: 'b8d3c4f',
    repositoryId: 'repo-prod-2',
    message: 'fix: Redis 연결 풀 설정 최적화',
    author: {
      name: 'Eve Jung',
      email: 'eve@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    committer: {
      name: 'Eve Jung',
      email: 'eve@example.com',
    },
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    branch: ['main'],
    stats: { additions: 15, deletions: 8, total: 23 },
    files: [{ path: 'src/main/kotlin/config/RedisConfig.kt', additions: 15, deletions: 8, status: 'modified' }],
  },
  {
    sha: 'd4e1c7a',
    repositoryId: 'repo-prod-2',
    message: 'feat: Redis 캐싱 레이어 추가',
    author: {
      name: 'Eve Jung',
      email: 'eve@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
    },
    committer: {
      name: 'Eve Jung',
      email: 'eve@example.com',
    },
    date: new Date(Date.now() - 72 * 60 * 60 * 1000),
    branch: ['feature/redis-cache'],
    stats: { additions: 324, deletions: 67, total: 391 },
    files: [
      { filename:'src/main/kotlin/service/CacheService.kt', additions: 185, deletions: 0, changes: 185, status: 'added' },
      { filename:'src/main/kotlin/config/RedisConfig.kt', additions: 95, deletions: 45, changes: 140, status: 'modified' },
      { filename:'src/main/kotlin/service/ProjectService.kt', additions: 44, deletions: 22, changes: 66, status: 'modified' },
    ],
  },
  // Mobile commits
  {
    sha: 'c7e5a2b',
    repositoryId: 'repo-prod-3',
    message: 'fix: Android 푸시 알림 버그 수정',
    author: {
      name: 'Yoon Jiyoung',
      email: 'yoon@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=7',
    },
    committer: {
      name: 'Yoon Jiyoung',
      email: 'yoon@example.com',
    },
    date: new Date(Date.now() - 6 * 60 * 60 * 1000),
    branch: ['hotfix/android-push-notification'],
    stats: { additions: 56, deletions: 32, total: 88 },
    files: [
      { filename:'src/services/pushNotifications.ts', additions: 45, deletions: 28, changes: 73, status: 'modified' },
      { filename:'android/app/src/main/AndroidManifest.xml', additions: 11, deletions: 4, changes: 15, status: 'modified' },
    ],
  },
  {
    sha: 'f2a9c1b',
    repositoryId: 'repo-prod-3',
    message: 'feat: 오프라인 모드 구현 (AsyncStorage)',
    author: {
      name: 'Yoon Jiyoung',
      email: 'yoon@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=7',
    },
    committer: {
      name: 'Yoon Jiyoung',
      email: 'yoon@example.com',
    },
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    branch: ['feature/offline-mode'],
    stats: { additions: 567, deletions: 89, total: 656 },
    files: [
      { filename:'src/services/offlineQueue.ts', additions: 234, deletions: 0, changes: 234, status: 'added' },
      { filename:'src/services/syncManager.ts', additions: 198, deletions: 0, changes: 198, status: 'added' },
      { filename:'src/contexts/OfflineContext.tsx', additions: 135, deletions: 89, changes: 224, status: 'modified' },
    ],
  },
  // Infrastructure commits
  {
    sha: 'd9a1f8e',
    repositoryId: 'repo-prod-4',
    message: 'chore: Kubernetes 1.28 마이그레이션 준비',
    author: {
      name: 'Kang Minsu',
      email: 'kang@example.com',
      username: 'kang-devops',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
    },
    committer: {
      name: 'Kang Minsu',
      email: 'kang@example.com',
      username: 'kang-devops',
      avatarUrl: 'https://i.pravatar.cc/150?img=6',
    },
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    branch: ['upgrade/k8s-1.28'],
    stats: { additions: 145, deletions: 98, total: 243 },
    files: [
      { filename:'terraform/k8s-cluster.tf', additions: 87, deletions: 65, changes: 152, status: 'modified' },
      { filename:'helm/values.yaml', additions: 58, deletions: 33, changes: 91, status: 'modified' },
    ],
  },
];

// Production Pull Requests (9 PRs: 6 open, 3 merged)
const productionPRs: GitHubPullRequest[] = [
  {
    id: 'pr-prod-1',
    repositoryId: 'repo-prod-1',
    number: 92,
    title: 'feat: 프로젝트 대시보드 성능 최적화',
    body: '## 문제\n\n대량의 프로젝트 데이터 렌더링 시 성능 저하\n\n## 해결\n\n- useMemo로 필터링 최적화\n- React.memo로 컴포넌트 메모이제이션\n- 가상 스크롤링 적용\n\n## 성능 개선\n\n- 초기 렌더링: 1200ms → 320ms (73% 개선)\n- 리렌더링: 450ms → 85ms (81% 개선)',
    state: 'open',
    author: { username: 'charlie-fe', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'approved' },
      { username: 'bob-design', avatarUrl: 'https://i.pravatar.cc/150?img=2', status: 'pending' },
    ],
    labels: ['enhancement', 'performance'],
    headBranch: 'feature/dashboard-optimization',
    baseBranch: 'main',
    commits: 5,
    additions: 187,
    deletions: 95,
    checks: [
      { id: 'check-prod-1', name: 'Build', status: 'completed', conclusion: 'success' },
      { id: 'check-prod-2', name: 'Tests', status: 'completed', conclusion: 'success' },
      { id: 'check-prod-3', name: 'Lint', status: 'completed', conclusion: 'success' },
    ],
    filesChanged: [
      {
        path: 'src/pages/DashboardPage.tsx',
        additions: 87,
        deletions: 43,
        status: 'modified',
        patch: '@@ -15,7 +15,10 @@\n...',
      },
      { filename:'src/components/ProjectCard.tsx', additions: 100, deletions: 52, changes: 152, status: 'modified', patch: '@@ ...' },
    ],
    linkedIssues: [18],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'pr-prod-2',
    repositoryId: 'repo-prod-1',
    number: 91,
    title: 'fix: 다크모드 테마 전환 시 깜빡임 문제 해결',
    body: '## 문제\n\n다크모드 전환 시 화면이 깜빡이는 이슈\n\n## 해결\n\n- CSS 변수 전환 최적화\n- 애니메이션 타이밍 조정',
    state: 'open',
    author: { username: 'charlie-fe', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    reviewers: [
      {
        username: 'alice-dev',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        status: 'changes_requested',
      },
    ],
    labels: ['bug', 'ui'],
    headBranch: 'fix/dark-mode-flicker',
    baseBranch: 'main',
    commits: 3,
    additions: 42,
    deletions: 18,
    checks: [
      { id: 'check-prod-4', name: 'Build', status: 'completed', conclusion: 'success' },
      { id: 'check-prod-5', name: 'Tests', status: 'completed', conclusion: 'failure' },
    ],
    filesChanged: [{ path: 'src/contexts/ThemeContext.tsx', additions: 42, deletions: 18, status: 'modified' }],
    linkedIssues: [22],
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reviewActivities: [
      {
        reviewer: 'alice-dev',
        status: 'changes_requested',
        comment: '테스트가 실패하고 있어요. 다크모드 전환 시 localStorage 처리 부분을 다시 확인해주세요.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'pr-prod-3',
    repositoryId: 'repo-prod-2',
    number: 89,
    title: 'feat: Redis 캐싱 레이어 추가',
    body: '## 목표\n\nAPI 응답 속도 개선을 위한 Redis 캐싱\n\n## 구현\n\n- 프로젝트 조회 API 캐싱\n- TTL 설정 (5분)\n- Cache invalidation 로직\n\n## 성능\n\n- 평균 응답 시간: 230ms → 45ms (80% 개선)',
    state: 'open',
    author: { username: 'eve-backend', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'approved' },
      { username: 'hong-qa', avatarUrl: 'https://i.pravatar.cc/150?img=8', status: 'pending' },
    ],
    labels: ['enhancement', 'backend', 'performance'],
    headBranch: 'feature/redis-cache',
    baseBranch: 'main',
    commits: 8,
    additions: 324,
    deletions: 67,
    checks: [
      { id: 'check-prod-6', name: 'Backend Tests', status: 'completed', conclusion: 'success' },
      { id: 'check-prod-7', name: 'Integration Tests', status: 'in_progress' },
    ],
    filesChanged: [
      { filename:'src/main/kotlin/service/CacheService.kt', additions: 185, deletions: 0, changes: 185, status: 'added' },
      { filename:'src/main/kotlin/config/RedisConfig.kt', additions: 95, deletions: 45, changes: 140, status: 'modified' },
      { filename:'src/main/kotlin/service/ProjectService.kt', additions: 44, deletions: 22, changes: 66, status: 'modified' },
    ],
    linkedIssues: [15],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'pr-prod-4',
    repositoryId: 'repo-prod-3',
    number: 45,
    title: 'fix: Android 푸시 알림 수신 오류 긴급 수정',
    body: '## 긴급 이슈\n\nAndroid 기기에서 푸시 알림이 수신되지 않는 critical bug\n\n## 원인\n\nFCM 토큰 갱신 로직 오류\n\n## 해결\n\n- 토큰 갱신 로직 재작성\n- 백그라운드 처리 개선',
    state: 'open',
    author: { username: 'yoon-mobile', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'pending' },
      { username: 'hong-qa', avatarUrl: 'https://i.pravatar.cc/150?img=8', status: 'pending' },
    ],
    labels: ['bug', 'urgent', 'android'],
    headBranch: 'hotfix/android-push-notification',
    baseBranch: 'main',
    commits: 2,
    additions: 56,
    deletions: 32,
    checks: [
      { id: 'check-prod-8', name: 'Android Build', status: 'completed', conclusion: 'success' },
      { id: 'check-prod-9', name: 'iOS Build', status: 'completed', conclusion: 'success' },
    ],
    filesChanged: [
      { filename:'src/services/pushNotifications.ts', additions: 45, deletions: 28, changes: 73, status: 'modified' },
      { filename:'android/app/src/main/AndroidManifest.xml', additions: 11, deletions: 4, changes: 15, status: 'modified' },
    ],
    linkedIssues: [31],
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'pr-prod-5',
    repositoryId: 'repo-prod-3',
    number: 44,
    title: 'feat: 오프라인 모드 구현',
    body: '## 기능\n\n네트워크 연결이 없을 때도 기본 기능 사용 가능\n\n## 구현\n\n- AsyncStorage 활용\n- 오프라인 큐 시스템\n- 자동 동기화',
    state: 'open',
    author: { username: 'yoon-mobile', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'pending' },
    ],
    labels: ['feature', 'mobile'],
    headBranch: 'feature/offline-mode',
    baseBranch: 'develop',
    commits: 12,
    additions: 567,
    deletions: 89,
    checks: [{ id: 'check-prod-10', name: 'Build', status: 'in_progress' }],
    filesChanged: [
      { filename:'src/services/offlineQueue.ts', additions: 234, deletions: 0, changes: 234, status: 'added' },
      { filename:'src/services/syncManager.ts', additions: 198, deletions: 0, changes: 198, status: 'added' },
      { filename:'src/contexts/OfflineContext.tsx', additions: 135, deletions: 89, changes: 224, status: 'modified' },
    ],
    linkedIssues: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'pr-prod-6',
    repositoryId: 'repo-prod-4',
    number: 12,
    title: 'chore: Kubernetes 1.28 업그레이드',
    body: '## 변경사항\n\n- K8s 1.26 → 1.28 마이그레이션\n- Deprecated API 업데이트\n- 네트워크 정책 개선',
    state: 'open',
    author: { username: 'kang-devops', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'approved' },
    ],
    labels: ['infrastructure', 'upgrade'],
    headBranch: 'upgrade/k8s-1.28',
    baseBranch: 'main',
    commits: 6,
    additions: 145,
    deletions: 98,
    checks: [
      { id: 'check-prod-11', name: 'Terraform Plan', status: 'completed', conclusion: 'success' },
      { id: 'check-prod-12', name: 'Security Scan', status: 'completed', conclusion: 'success' },
    ],
    filesChanged: [
      { filename:'terraform/k8s-cluster.tf', additions: 87, deletions: 65, changes: 152, status: 'modified' },
      { filename:'helm/values.yaml', additions: 58, deletions: 33, changes: 91, status: 'modified' },
    ],
    linkedIssues: [8],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  // Merged PRs
  {
    id: 'pr-prod-7',
    repositoryId: 'repo-prod-1',
    number: 90,
    title: 'feat: GitHub 파일 트리 뷰어 구현',
    body: '## 기능\n\n- 저장소 파일 구조 탐색\n- 파일 내용 미리보기\n- 구문 강조 표시',
    state: 'merged',
    author: { username: 'charlie-fe', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'approved' },
    ],
    labels: ['feature'],
    headBranch: 'feature/file-tree-viewer',
    baseBranch: 'main',
    commits: 9,
    additions: 456,
    deletions: 23,
    checks: [
      { id: 'check-prod-13', name: 'Build', status: 'completed', conclusion: 'success' },
      { id: 'check-prod-14', name: 'Tests', status: 'completed', conclusion: 'success' },
    ],
    filesChanged: [
      { filename:'src/components/github/FileTreeViewer.tsx', additions: 320, deletions: 0, changes: 320, status: 'added' },
      { filename:'src/components/github/FileContent.tsx', additions: 136, deletions: 23, changes: 159, status: 'modified' },
    ],
    linkedIssues: [],
    mergedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'pr-prod-8',
    repositoryId: 'repo-prod-2',
    number: 88,
    title: 'refactor: API 에러 처리 개선',
    body: '## 개선사항\n\n- 일관된 에러 응답 구조\n- 에러 로깅 강화',
    state: 'merged',
    author: { username: 'eve-backend', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'approved' },
    ],
    labels: ['refactoring'],
    headBranch: 'refactor/error-handling',
    baseBranch: 'main',
    commits: 5,
    additions: 123,
    deletions: 87,
    checks: [],
    filesChanged: [],
    linkedIssues: [],
    mergedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'pr-prod-9',
    repositoryId: 'repo-prod-1',
    number: 87,
    title: 'feat: 실시간 알림 시스템',
    body: '## 기능\n\n- WebSocket 기반 실시간 알림\n- 알림 스택 애니메이션',
    state: 'merged',
    author: { username: 'charlie-fe', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    reviewers: [
      { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'approved' },
    ],
    labels: ['feature'],
    headBranch: 'feature/realtime-notifications',
    baseBranch: 'main',
    commits: 12,
    additions: 587,
    deletions: 123,
    checks: [],
    filesChanged: [],
    linkedIssues: [],
    mergedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Production Issues (20 issues: 12 open, 8 closed)
const productionIssues: GitHubIssue[] = [
  // Critical/High Priority Open Issues
  {
    id: 'issue-prod-1',
    repositoryId: 'repo-prod-1',
    number: 18,
    title: '프로젝트 생성 시 간헐적으로 실패하는 문제',
    body: '## 문제\n\n프로젝트 생성 API 호출 후 간헐적으로 500 에러 발생\n\n## 재현 방법\n\n1. 프로젝트 생성 페이지 접속\n2. 폼 작성 후 생성 버튼 클릭\n3. 약 20% 확률로 실패\n\n## 에러 로그\n\n```\nError: Internal Server Error\nStatus: 500\n```',
    state: 'open',
    author: { username: 'hong-qa', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
    assignees: ['alice-dev', 'eve-backend'],
    labels: ['bug', 'high-priority', 'investigating'],
    milestone: { title: 'v2.4.0', dueDate: new Date('2024-10-31') },
    comments: [
      {
        id: 'comment-prod-1',
        author: 'alice-dev',
        body: '로그를 확인해보니 데이터베이스 트랜잭션 타임아웃 문제로 보입니다. 백엔드 팀과 협업해서 해결하겠습니다.',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        id: 'comment-prod-2',
        author: 'eve-backend',
        body: '백엔드 로그를 보니 Redis 연결이 간헐적으로 끊기는 것 같아요. 연결 풀 설정을 조정해보겠습니다.',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-2',
    repositoryId: 'repo-prod-2',
    number: 15,
    title: 'API 응답 시간이 점점 느려지는 현상',
    body: '## 증상\n\n프로젝트 목록 조회 API의 응답 시간이 점점 증가하고 있습니다.\n\n## 성능 측정\n\n- 초기: 50-80ms\n- 현재: 200-350ms\n- 피크 타임: 500ms+\n\n## 영향\n\n사용자 경험 저하, 서버 부하 증가',
    state: 'open',
    author: { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    assignees: ['eve-backend'],
    labels: ['performance', 'high-priority'],
    milestone: { title: 'v2.4.0', dueDate: new Date('2024-10-31') },
    comments: [
      {
        id: 'comment-prod-3',
        author: 'eve-backend',
        body: 'Redis 캐싱 레이어를 추가하는 PR을 올렸습니다. 이것으로 응답 시간을 크게 개선할 수 있을 것 같습니다. #89',
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-3',
    repositoryId: 'repo-prod-3',
    number: 31,
    title: 'Android 푸시 알림 수신 안 됨 (Critical)',
    body: '## 긴급 이슈\n\nAndroid 사용자들이 푸시 알림을 받지 못하고 있습니다.\n\n## 영향 범위\n\n- Android 사용자 전체 (약 40% of users)\n- iOS는 정상 작동\n\n## 발견 시점\n\n2024-10-07 18:00 KST\n\n## 우선순위\n\nP0 - Critical',
    state: 'open',
    author: { username: 'hong-qa', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
    assignees: ['yoon-mobile'],
    labels: ['bug', 'critical', 'android', 'push-notification'],
    milestone: { title: 'Hotfix 2.3.2', dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    comments: [
      {
        id: 'comment-prod-4',
        author: 'yoon-mobile',
        body: 'FCM 토큰 갱신 로직에 문제가 있었습니다. 긴급 수정 PR을 올렸습니다. #45',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-4',
    repositoryId: 'repo-prod-1',
    number: 22,
    title: '알림 센터 UX 개선 제안',
    body: '## 제안\n\n- 읽지 않은 알림 배지 추가\n- 알림 타입별 필터링\n- 알림 우선순위 정렬',
    state: 'open',
    author: { username: 'bob-design', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    assignees: [],
    labels: ['enhancement', 'ux'],
    comments: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-5',
    repositoryId: 'repo-prod-4',
    number: 8,
    title: 'Kubernetes 클러스터 업그레이드',
    body: '## 목표\n\nK8s 1.26 → 1.28로 업그레이드\n\n## 주요 변경사항\n\n- Deprecated API 제거\n- 네트워크 정책 개선\n- 보안 강화',
    state: 'open',
    author: { username: 'kang-devops', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
    assignees: ['kang-devops'],
    labels: ['infrastructure', 'upgrade'],
    comments: [],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  // Additional open issues (medium/low priority)
  {
    id: 'issue-prod-6',
    repositoryId: 'repo-prod-1',
    number: 25,
    title: '프로필 이미지 업로드 기능 추가',
    body: '사용자가 자신의 프로필 이미지를 업로드할 수 있는 기능이 필요합니다.',
    state: 'open',
    author: { username: 'bob-design', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    assignees: [],
    labels: ['feature', 'enhancement'],
    comments: [],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-7',
    repositoryId: 'repo-prod-2',
    number: 19,
    title: 'API 문서 자동 생성 (Swagger)',
    body: 'Swagger를 이용한 API 문서 자동 생성',
    state: 'open',
    author: { username: 'david-pm', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
    assignees: ['eve-backend'],
    labels: ['documentation'],
    comments: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-8',
    repositoryId: 'repo-prod-3',
    number: 28,
    title: '모바일 앱 스플래시 화면 디자인',
    body: '앱 시작 시 보여줄 스플래시 화면 디자인',
    state: 'open',
    author: { username: 'bob-design', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    assignees: [],
    labels: ['design', 'mobile'],
    comments: [],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-9',
    repositoryId: 'repo-prod-4',
    number: 10,
    title: '인프라 비용 최적화 검토',
    body: 'AWS 비용 절감을 위한 리소스 최적화',
    state: 'open',
    author: { username: 'kang-devops', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
    assignees: [],
    labels: ['infrastructure', 'cost-optimization'],
    comments: [],
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-10',
    repositoryId: 'repo-prod-1',
    number: 23,
    title: '이메일 알림 설정 페이지',
    body: '사용자가 이메일 알림을 설정할 수 있는 페이지',
    state: 'open',
    author: { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    assignees: [],
    labels: ['feature'],
    comments: [],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-11',
    repositoryId: 'repo-prod-2',
    number: 17,
    title: '데이터 백업 자동화',
    body: '주기적인 데이터베이스 백업 자동화',
    state: 'open',
    author: { username: 'kang-devops', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
    assignees: [],
    labels: ['infrastructure', 'automation'],
    comments: [],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-12',
    repositoryId: 'repo-prod-1',
    number: 21,
    title: '프로젝트 통계 대시보드 개선',
    body: '더 많은 통계 정보 표시',
    state: 'open',
    author: { username: 'david-pm', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
    assignees: [],
    labels: ['enhancement'],
    comments: [],
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
  },
  // Closed issues
  {
    id: 'issue-prod-13',
    repositoryId: 'repo-prod-1',
    number: 20,
    title: 'GitHub 파일 트리 뷰어',
    body: '저장소 파일 구조를 탐색할 수 있는 뷰어',
    state: 'closed',
    author: { username: 'charlie-fe', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    assignees: ['charlie-fe'],
    labels: ['feature'],
    comments: [],
    closedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-14',
    repositoryId: 'repo-prod-1',
    number: 16,
    title: '실시간 알림 시스템 구축',
    body: 'WebSocket 기반 실시간 알림',
    state: 'closed',
    author: { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    assignees: ['charlie-fe'],
    labels: ['feature'],
    comments: [],
    closedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-15',
    repositoryId: 'repo-prod-2',
    number: 14,
    title: 'API 에러 처리 개선',
    body: '일관된 에러 응답 구조',
    state: 'closed',
    author: { username: 'eve-backend', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    assignees: ['eve-backend'],
    labels: ['refactoring'],
    comments: [],
    closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-16',
    repositoryId: 'repo-prod-1',
    number: 13,
    title: 'GitHub OAuth 로그인',
    body: 'GitHub 계정으로 로그인',
    state: 'closed',
    author: { username: 'alice-dev', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    assignees: ['alice-dev'],
    labels: ['feature'],
    comments: [],
    closedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-17',
    repositoryId: 'repo-prod-1',
    number: 11,
    title: '칸반 보드 드래그 앤 드롭',
    body: '태스크 드래그 앤 드롭 기능',
    state: 'closed',
    author: { username: 'charlie-fe', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    assignees: ['charlie-fe'],
    labels: ['feature'],
    comments: [],
    closedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-18',
    repositoryId: 'repo-prod-2',
    number: 9,
    title: 'CI/CD 파이프라인 구축',
    body: '자동 배포 파이프라인',
    state: 'closed',
    author: { username: 'kang-devops', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
    assignees: ['kang-devops'],
    labels: ['infrastructure'],
    comments: [],
    closedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-19',
    repositoryId: 'repo-prod-2',
    number: 7,
    title: 'Redis 세션 저장소',
    body: 'Redis를 이용한 세션 관리',
    state: 'closed',
    author: { username: 'eve-backend', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    assignees: ['eve-backend'],
    labels: ['feature'],
    comments: [],
    closedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'issue-prod-20',
    repositoryId: 'repo-prod-3',
    number: 5,
    title: '모바일 앱 초기 릴리즈',
    body: 'React Native 앱 v1.0.0 릴리즈',
    state: 'closed',
    author: { username: 'yoon-mobile', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    assignees: ['yoon-mobile'],
    labels: ['feature', 'milestone'],
    comments: [],
    closedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
];

// Production Tasks (30+ tasks across kanban columns)
const productionTasks: Task[] = [
  // Todo (8 tasks)
  {
    id: 'task-prod-1',
    projectId: 'project-prod-1',
    title: '사용자 프로필 이미지 업로드 기능',
    description: '사용자가 자신의 프로필 이미지를 업로드하고 관리할 수 있는 기능 추가',
    status: 'todo',
    priority: 'medium',
    assigneeId: undefined,
    dueDate: undefined,
    labels: ['feature', 'frontend'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-2',
    projectId: 'project-prod-1',
    title: '이메일 알림 설정 페이지',
    description: '사용자가 이메일 알림을 설정할 수 있는 페이지 구현',
    status: 'todo',
    priority: 'low',
    assigneeId: undefined,
    dueDate: undefined,
    labels: ['feature', 'frontend'],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-3',
    projectId: 'project-prod-1',
    title: '프로젝트 통계 대시보드 개선',
    description: '더 많은 통계 정보와 차트 추가',
    status: 'todo',
    priority: 'medium',
    assigneeId: undefined,
    dueDate: undefined,
    labels: ['enhancement', 'frontend'],
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-4',
    projectId: 'project-prod-1',
    title: '모바일 앱 스플래시 화면 디자인',
    description: '앱 시작 시 보여줄 스플래시 화면 디자인 및 구현',
    status: 'todo',
    priority: 'low',
    assigneeId: undefined,
    dueDate: undefined,
    labels: ['design', 'mobile'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-5',
    projectId: 'project-prod-1',
    title: '백엔드 API 문서 자동 생성 (Swagger)',
    description: 'Swagger를 이용한 API 문서 자동 생성 설정',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['documentation', 'backend'],
    githubIssueNumber: 19,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-6',
    projectId: 'project-prod-1',
    title: '인프라 비용 최적화 검토',
    description: 'AWS 리소스 사용 최적화를 통한 비용 절감',
    status: 'todo',
    priority: 'low',
    assigneeId: undefined,
    dueDate: undefined,
    labels: ['infrastructure', 'cost-optimization'],
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-7',
    projectId: 'project-prod-1',
    title: '데이터 백업 자동화 스크립트',
    description: '주기적인 데이터베이스 백업 자동화',
    status: 'todo',
    priority: 'medium',
    assigneeId: undefined,
    dueDate: undefined,
    labels: ['infrastructure', 'automation'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-8',
    projectId: 'project-prod-1',
    title: '보안 취약점 정기 스캔 자동화',
    description: '보안 스캔을 자동화하여 정기적으로 실행',
    status: 'todo',
    priority: 'high',
    assigneeId: undefined,
    dueDate: undefined,
    labels: ['security', 'automation'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  // In Progress (6 tasks)
  {
    id: 'task-prod-9',
    projectId: 'project-prod-1',
    title: 'Redis 캐싱 레이어 추가',
    description: 'API 응답 속도 개선을 위한 Redis 캐싱 구현',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-5',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    labels: ['enhancement', 'backend', 'performance'],
    githubIssueNumber: 15,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-10',
    projectId: 'project-prod-1',
    title: 'Android 푸시 알림 버그 수정',
    description: 'Android 기기에서 푸시 알림 수신 안 되는 문제 긴급 수정',
    status: 'in_progress',
    priority: 'urgent',
    assigneeId: 'user-7',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    labels: ['bug', 'urgent', 'android', 'mobile'],
    githubIssueNumber: 31,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-11',
    projectId: 'project-prod-1',
    title: '프로젝트 대시보드 성능 최적화',
    description: 'useMemo와 React.memo를 활용한 렌더링 최적화',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    labels: ['enhancement', 'frontend', 'performance'],
    githubIssueNumber: 18,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-12',
    projectId: 'project-prod-1',
    title: 'Kubernetes 1.28 업그레이드',
    description: 'K8s 클러스터를 1.26에서 1.28로 업그레이드',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'user-6',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    labels: ['infrastructure', 'upgrade'],
    githubIssueNumber: 8,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-13',
    projectId: 'project-prod-1',
    title: '오프라인 모드 구현',
    description: '네트워크 연결이 없을 때도 기본 기능 사용 가능하도록',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'user-7',
    dueDate: undefined,
    labels: ['feature', 'mobile'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-14',
    projectId: 'project-prod-1',
    title: '성능 모니터링 대시보드 구축',
    description: '실시간 성능 메트릭을 보여주는 대시보드',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'user-3',
    dueDate: undefined,
    labels: ['feature', 'monitoring'],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  // Review (4 tasks)
  {
    id: 'task-prod-15',
    projectId: 'project-prod-1',
    title: '다크모드 테마 전환 버그 수정',
    description: '다크모드 전환 시 화면 깜빡임 문제 해결',
    status: 'review',
    priority: 'medium',
    assigneeId: 'user-3',
    dueDate: undefined,
    labels: ['bug', 'frontend', 'ui'],
    githubIssueNumber: 22,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-16',
    projectId: 'project-prod-1',
    title: 'GitHub 파일 트리 뷰어',
    description: '저장소 파일 구조 탐색 및 미리보기 기능',
    status: 'review',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: undefined,
    labels: ['feature', 'frontend'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-17',
    projectId: 'project-prod-1',
    title: 'API 응답 캐싱',
    description: 'Redis를 활용한 API 응답 캐싱 (QA 대기 중)',
    status: 'review',
    priority: 'high',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['enhancement', 'backend'],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-18',
    projectId: 'project-prod-1',
    title: '자동 스케일링 정책 업데이트',
    description: 'K8s HPA 설정 최적화',
    status: 'review',
    priority: 'medium',
    assigneeId: 'user-6',
    dueDate: undefined,
    labels: ['infrastructure'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  // Done (18+ tasks - showing major completed features)
  {
    id: 'task-prod-19',
    projectId: 'project-prod-1',
    title: 'GitHub OAuth 로그인 구현',
    description: 'GitHub 계정으로 로그인하는 기능 완료',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-1',
    dueDate: undefined,
    labels: ['feature', 'auth'],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-20',
    projectId: 'project-prod-1',
    title: '칸반 보드 드래그 앤 드롭',
    description: '태스크 드래그 앤 드롭 기능 구현',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: undefined,
    labels: ['feature', 'frontend'],
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-21',
    projectId: 'project-prod-1',
    title: '실시간 알림 시스템',
    description: 'WebSocket 기반 실시간 알림 구현',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: undefined,
    labels: ['feature', 'frontend'],
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-22',
    projectId: 'project-prod-1',
    title: '모바일 앱 초기 릴리즈',
    description: 'React Native 앱 v1.0.0 릴리즈',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-7',
    dueDate: undefined,
    labels: ['feature', 'mobile', 'milestone'],
    createdAt: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-23',
    projectId: 'project-prod-1',
    title: 'CI/CD 파이프라인 구축',
    description: '자동 배포 파이프라인 설정',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-6',
    dueDate: undefined,
    labels: ['infrastructure'],
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-24',
    projectId: 'project-prod-1',
    title: '데이터베이스 마이그레이션',
    description: 'PostgreSQL 스키마 마이그레이션 완료',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['backend', 'database'],
    createdAt: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-25',
    projectId: 'project-prod-1',
    title: '보안 헤더 설정',
    description: 'HTTPS, CSP, CORS 등 보안 헤더 설정',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['security', 'backend'],
    createdAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-26',
    projectId: 'project-prod-1',
    title: '중앙 집중식 로깅 시스템',
    description: 'ELK 스택을 이용한 로깅 시스템 구축',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-6',
    dueDate: undefined,
    labels: ['infrastructure', 'monitoring'],
    createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-27',
    projectId: 'project-prod-1',
    title: '백엔드 API v1 완료',
    description: 'RESTful API 엔드포인트 구현 완료',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['backend', 'api'],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-28',
    projectId: 'project-prod-1',
    title: '프론트엔드 반응형 디자인',
    description: '모바일, 태블릿, 데스크톱 반응형 구현',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-3',
    dueDate: undefined,
    labels: ['frontend', 'ui'],
    createdAt: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-29',
    projectId: 'project-prod-1',
    title: '인프라 Terraform 자동화',
    description: 'IaC를 이용한 인프라 자동화',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-6',
    dueDate: undefined,
    labels: ['infrastructure', 'automation'],
    createdAt: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-30',
    projectId: 'project-prod-1',
    title: 'Redis 세션 저장소',
    description: 'Redis를 이용한 세션 관리',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['backend', 'redis'],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-31',
    projectId: 'project-prod-1',
    title: 'WebSocket 실시간 통신',
    description: 'WebSocket 서버 구축 및 클라이언트 연동',
    status: 'done',
    priority: 'high',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['backend', 'realtime'],
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-32',
    projectId: 'project-prod-1',
    title: 'GitHub 웹훅 연동',
    description: 'GitHub 이벤트를 실시간으로 받아오는 웹훅 설정',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['backend', 'github'],
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-prod-33',
    projectId: 'project-prod-1',
    title: 'API 에러 처리 개선',
    description: '일관된 에러 응답 구조 및 로깅',
    status: 'done',
    priority: 'medium',
    assigneeId: 'user-5',
    dueDate: undefined,
    labels: ['backend', 'refactoring'],
    createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Production Deployment Statuses
const productionDeploymentStatus: DeploymentStatus[] = [
  // Production (successful)
  {
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    isDeployed: true,
    environment: 'production',
    lastDeployedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastDeployedCommit: 'a9f2e1c',
    deploymentUrl: 'https://openknot.app',
    status: 'success',
  },
  {
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    isDeployed: true,
    environment: 'production',
    lastDeployedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lastDeployedCommit: 'b8d3c4f',
    deploymentUrl: 'https://api.openknot.app',
    status: 'success',
  },
  {
    repositoryId: 'repo-prod-3',
    repositoryName: 'Mobile App',
    isDeployed: true,
    environment: 'production',
    lastDeployedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastDeployedCommit: 'c7e5a2b',
    deploymentUrl: 'v2.3.1 (App Store & Play Store)',
    status: 'success',
  },
  // Staging (Backend FAILED)
  {
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    isDeployed: false,
    environment: 'staging',
    lastDeployedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    lastDeployedCommit: 'd4e1c7a',
    deploymentUrl: 'https://staging-api.openknot.app',
    status: 'failed',
  },
  {
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    isDeployed: true,
    environment: 'staging',
    lastDeployedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    lastDeployedCommit: 'e3f7a9b',
    deploymentUrl: 'https://staging.openknot.app',
    status: 'success',
  },
  // Development
  {
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    isDeployed: true,
    environment: 'dev',
    lastDeployedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastDeployedCommit: 'e7b4c2d',
    deploymentUrl: 'https://dev.openknot.app',
    status: 'success',
  },
  {
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    isDeployed: true,
    environment: 'dev',
    lastDeployedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    lastDeployedCommit: 'd4e1c7a',
    deploymentUrl: 'https://dev-api.openknot.app',
    status: 'success',
  },
];

// Production Deployment History (30+ items)
const productionDeploymentHistory: DeploymentHistoryItem[] = [
  // Most recent
  {
    id: 'deploy-prod-1',
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    environment: 'production',
    commit: 'a9f2e1c',
    branch: 'main',
    deployedBy: 'alice-dev',
    deployedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success',
    duration: 135,
    url: 'https://openknot.app',
  },
  {
    id: 'deploy-prod-2',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    environment: 'production',
    commit: 'b8d3c4f',
    branch: 'main',
    deployedBy: 'eve-backend',
    deployedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'success',
    duration: 245,
    url: 'https://api.openknot.app',
  },
  {
    id: 'deploy-prod-3',
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    environment: 'dev',
    commit: 'e7b4c2d',
    branch: 'develop',
    deployedBy: 'charlie-fe',
    deployedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'success',
    duration: 128,
    url: 'https://dev.openknot.app',
  },
  {
    id: 'deploy-prod-4',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    environment: 'staging',
    commit: 'd4e1c7a',
    branch: 'feature/redis-cache',
    deployedBy: 'eve-backend',
    deployedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: 'failed',
    duration: 87,
    url: 'https://staging-api.openknot.app',
  },
  {
    id: 'deploy-prod-5',
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    environment: 'staging',
    commit: 'e3f7a9b',
    branch: 'develop',
    deployedBy: 'charlie-fe',
    deployedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: 'success',
    duration: 142,
    url: 'https://staging.openknot.app',
  },
  {
    id: 'deploy-prod-6',
    repositoryId: 'repo-prod-3',
    repositoryName: 'Mobile App',
    environment: 'production',
    commit: 'c7e5a2b',
    branch: 'main',
    deployedBy: 'yoon-mobile',
    deployedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'success',
    duration: 385,
    url: 'v2.3.1 (App Store & Play Store)',
  },
  // Additional history
  {
    id: 'deploy-prod-7',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    environment: 'production',
    commit: 'd4e1c7a',
    branch: 'main',
    deployedBy: 'eve-backend',
    deployedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'success',
    duration: 256,
    url: 'https://api.openknot.app',
  },
  {
    id: 'deploy-prod-8',
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    environment: 'production',
    commit: 'c3a8f9e',
    branch: 'main',
    deployedBy: 'charlie-fe',
    deployedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    status: 'success',
    duration: 148,
    url: 'https://openknot.app',
  },
];

// Production Monitoring Statuses
const productionMonitoringStatus: MonitoringStatus[] = [
  {
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    isMonitored: true,
    healthStatus: 'healthy',
    lastCheckedAt: new Date(),
    activeAlerts: 0,
    uptime: 99.87,
  },
  {
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    isMonitored: true,
    healthStatus: 'degraded',
    lastCheckedAt: new Date(),
    activeAlerts: 2,
    uptime: 99.52,
  },
  {
    repositoryId: 'repo-prod-3',
    repositoryName: 'Mobile App',
    isMonitored: true,
    healthStatus: 'healthy',
    lastCheckedAt: new Date(),
    activeAlerts: 0,
    uptime: 99.76,
  },
  {
    repositoryId: 'repo-prod-4',
    repositoryName: 'Infrastructure',
    isMonitored: true,
    healthStatus: 'healthy',
    lastCheckedAt: new Date(),
    activeAlerts: 0,
    uptime: 99.95,
  },
];

// Production Monitoring Alerts (15+ alerts)
const productionMonitoringAlerts: MonitoringAlert[] = [
  // Active alerts
  {
    id: 'alert-prod-1',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'memory',
    message: '메모리 사용률이 경고 임계값을 초과했습니다',
    value: 82,
    threshold: 80,
    resolved: false,
  },
  {
    id: 'alert-prod-2',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'response_time',
    message: '응답 시간이 임계값을 초과했습니다',
    value: 125,
    threshold: 100,
    resolved: false,
  },
  // Service down then recovered (showing incident history)
  {
    id: 'alert-prod-3',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'service_down',
    severity: 'critical',
    message: '서비스가 다운되었습니다',
    resolved: true,
  },
  {
    id: 'alert-prod-4',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    type: 'service_up',
    severity: 'info',
    message: '서비스가 정상적으로 복구되었습니다 (다운 시간: 30분)',
    resolved: true,
  },
  // Resolved alerts
  {
    id: 'alert-prod-5',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'cpu',
    message: 'CPU 사용률이 높습니다',
    value: 78,
    threshold: 75,
    resolved: true,
  },
  {
    id: 'alert-prod-6',
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'error_rate',
    message: '에러율이 임계값을 초과했습니다',
    value: 3.2,
    threshold: 3.0,
    resolved: true,
  },
  {
    id: 'alert-prod-7',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'critical',
    metric: 'disk',
    message: '디스크 사용량이 90%를 초과했습니다',
    value: 92,
    threshold: 90,
    resolved: true,
  },
  {
    id: 'alert-prod-8',
    repositoryId: 'repo-prod-1',
    repositoryName: 'Frontend',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'network',
    message: '네트워크 사용량이 증가했습니다',
    value: 85,
    threshold: 80,
    resolved: true,
  },
  {
    id: 'alert-prod-9',
    repositoryId: 'repo-prod-3',
    repositoryName: 'Mobile App',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'critical',
    metric: 'error_rate',
    message: '모바일 앱 에러율 급증',
    value: 8.5,
    threshold: 5.0,
    resolved: true,
  },
  {
    id: 'alert-prod-10',
    repositoryId: 'repo-prod-2',
    repositoryName: 'Backend API',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    type: 'threshold_breach',
    severity: 'warning',
    metric: 'network',
    message: '활성 연결 수가 많습니다',
    value: 850,
    threshold: 800,
    resolved: true,
  },
];

// Production Security Statuses
const productionSecurityStatus: SecurityStatus[] = [
  {
    repositoryId: 'repo-prod-1',
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 5,
      low: 12,
    },
    lastScannedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    complianceScore: 88,
  },
  {
    repositoryId: 'repo-prod-2',
    vulnerabilities: {
      critical: 1,
      high: 1,
      medium: 3,
      low: 8,
    },
    lastScannedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    complianceScore: 82,
  },
  {
    repositoryId: 'repo-prod-3',
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 4,
      low: 10,
    },
    lastScannedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    complianceScore: 90,
  },
  {
    repositoryId: 'repo-prod-4',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
    },
    lastScannedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    complianceScore: 94,
  },
];

// Production Notifications (15+ notifications)
const productionNotifications: Notification[] = [
  {
    id: 'notif-prod-1',
    userId: 'user-1',
    type: 'issue_created',
    title: '서비스 복구 완료',
    content: '백엔드 서비스가 정상 복구되었습니다. 다운 시간: 30분',
    link: '/projects/project-prod-1/monitoring',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'notif-prod-2',
    userId: 'user-1',
    type: 'pr_requested',
    title: 'PR 리뷰 요청',
    content: 'PR #89 "Redis 캐싱 레이어 추가" - 리뷰 부탁드립니다',
    link: '/projects/project-prod-1/github',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'notif-prod-3',
    userId: 'user-1',
    type: 'task_assigned',
    title: '태스크 시작',
    content: '이서연님이 "프로젝트 대시보드 성능 최적화" 태스크를 시작했습니다',
    link: '/projects/project-prod-1/tasks',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'notif-prod-4',
    userId: 'user-1',
    type: 'message',
    title: 'Production 배포 성공',
    content: 'Frontend v2.3.5가 프로덕션에 배포되었습니다',
    link: '/projects/project-prod-1/deployment',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-5',
    userId: 'user-1',
    type: 'issue_created',
    title: 'CPU 경고 해제',
    content: '백엔드 CPU 사용률이 정상 범위로 돌아왔습니다',
    link: '/projects/project-prod-1/monitoring',
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-6',
    userId: 'user-1',
    type: 'pr_requested',
    title: '코드 리뷰 승인',
    content: 'PR #90 "GitHub 파일 트리 뷰어"가 승인되었습니다',
    link: '/projects/project-prod-1/github',
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-7',
    userId: 'user-1',
    type: 'issue_created',
    title: '새 이슈 생성',
    content: '홍성준님이 Issue #31 "Android 푸시 알림 수신 안 됨"을 생성했습니다',
    link: '/projects/project-prod-1/github',
    read: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-8',
    userId: 'user-1',
    type: 'message',
    title: 'Staging 배포 실패',
    content: 'Backend API staging 환경 배포가 실패했습니다',
    link: '/projects/project-prod-1/deployment',
    read: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-9',
    userId: 'user-1',
    type: 'task_assigned',
    title: '태스크 할당',
    content: '윤지영님에게 "Android 푸시 알림 버그 수정" 태스크가 할당되었습니다',
    link: '/projects/project-prod-1/tasks',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-10',
    userId: 'user-1',
    type: 'pr_requested',
    title: 'PR 변경 요청',
    content: 'PR #91 "다크모드 테마 버그"에 변경 요청이 있습니다',
    link: '/projects/project-prod-1/github',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-11',
    userId: 'user-1',
    type: 'message',
    title: '보안 스캔 완료',
    content: 'Backend API 보안 스캔이 완료되었습니다. Critical 1개 발견',
    link: '/projects/project-prod-1/security',
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-12',
    userId: 'user-1',
    type: 'issue_created',
    title: '성능 저하 감지',
    content: 'API 응답 시간이 200ms를 초과했습니다',
    link: '/projects/project-prod-1/monitoring',
    read: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-13',
    userId: 'user-1',
    type: 'message',
    title: '모바일 앱 릴리즈',
    content: 'v2.3.1이 App Store와 Play Store에 배포되었습니다',
    link: '/projects/project-prod-1/deployment',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-14',
    userId: 'user-1',
    type: 'task_assigned',
    title: '태스크 완료',
    content: '"실시간 알림 시스템" 태스크가 완료되었습니다',
    link: '/projects/project-prod-1/tasks',
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif-prod-15',
    userId: 'user-1',
    type: 'pr_requested',
    title: 'PR Merged',
    content: 'PR #87 "실시간 알림 시스템"이 main 브랜치에 머지되었습니다',
    link: '/projects/project-prod-1/github',
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Merge all production data into existing arrays
mockUsers.push(...productionUsers);
mockProjects.push(productionProject);
mockRepositories.push(...productionRepos);
mockBranches.push(...productionBranches);
mockCommits.push(...productionCommits);
mockPullRequests.push(...productionPRs);
mockIssues.push(...productionIssues);
mockTasks.push(...productionTasks);
mockDeploymentStatuses.push(...productionDeploymentStatus);
mockDeploymentHistory.push(...productionDeploymentHistory);
mockMonitoringStatuses.push(...productionMonitoringStatus);
mockMonitoringAlerts.push(...productionMonitoringAlerts);
mockSecurityStatuses.push(...productionSecurityStatus);
mockNotifications.push(...productionNotifications);

// Helper functions for GitHub data
export function getRepositoriesByProjectId(projectId: string): GitHubRepository[] {
  return mockRepositories.filter((r) => r.projectId === projectId);
}

export function getRepositoryById(id: string): GitHubRepository | undefined {
  return mockRepositories.find((r) => r.id === id);
}

export function getCommitsByRepositoryId(_repositoryId: string): GitHubCommit[] {
  // In real app, would filter by repository. For now, return all mock commits
  return mockCommits;
}

export function getBranchesByRepositoryId(_repositoryId: string): GitHubBranch[] {
  // In real app, would filter by repository
  return mockBranches;
}

export function getPullRequestsByRepositoryId(repositoryId: string): GitHubPullRequest[] {
  return mockPullRequests.filter((pr) => pr.repositoryId === repositoryId);
}

export function getIssuesByRepositoryId(repositoryId: string): GitHubIssue[] {
  return mockIssues.filter((issue) => issue.repositoryId === repositoryId);
}

export function getDeploymentStatus(repositoryId: string): DeploymentStatus | undefined {
  return mockDeploymentStatuses.find((ds) => ds.repositoryId === repositoryId);
}

export function getAllProjectDeployments(projectId: string): DeploymentStatus[] {
  // Get all repositories for this project
  const projectRepos = getRepositoriesByProjectId(projectId);
  const repoIds = projectRepos.map((r) => r.id);

  // Return deployment statuses for all repositories in this project
  return mockDeploymentStatuses.filter((ds) => repoIds.includes(ds.repositoryId));
}

export function getDeploymentHistory(repositoryId?: string): DeploymentHistoryItem[] {
  if (repositoryId) {
    return mockDeploymentHistory.filter((dh) => dh.repositoryId === repositoryId);
  }
  return mockDeploymentHistory;
}

export function getUnifiedDeploymentHistory(projectId: string): DeploymentHistoryItem[] {
  // Get all repositories for this project
  const projectRepos = getRepositoriesByProjectId(projectId);
  const repoIds = projectRepos.map((r) => r.id);

  // Return all deployment history items for this project, sorted by date
  return mockDeploymentHistory
    .filter((dh) => repoIds.includes(dh.repositoryId))
    .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime());
}

export function getMonitoringStatus(repositoryId: string): MonitoringStatus | undefined {
  return mockMonitoringStatuses.find((ms) => ms.repositoryId === repositoryId);
}

export function getAllProjectMonitoring(projectId: string): MonitoringStatus[] {
  // Get all repositories for this project
  const projectRepos = getRepositoriesByProjectId(projectId);
  const repoIds = projectRepos.map((r) => r.id);

  // Return monitoring statuses for all repositories in this project
  return mockMonitoringStatuses.filter((ms) => repoIds.includes(ms.repositoryId));
}

export function getMonitoringMetrics(
  repositoryId: string,
  timeRange: TimeRange = '24h'
): MonitoringMetric[] {
  // Generate metrics on-demand for the requested time range
  const repo = mockRepositories.find((r) => r.id === repositoryId);
  if (!repo) return [];

  return generateMetricsForTimeRange(repositoryId, repo.name, timeRange);
}

export function getAggregatedMetrics(projectId: string): AggregatedMetrics {
  const allMonitoring = getAllProjectMonitoring(projectId);

  // Get latest metrics for each repository
  const latestMetrics = allMonitoring
    .filter((m) => m.isMonitored)
    .map((m) => {
      const metrics = mockMonitoringMetrics[m.repositoryId];
      return metrics && metrics.length > 0 ? metrics[metrics.length - 1] : null;
    })
    .filter((m): m is MonitoringMetric => m !== null);

  if (latestMetrics.length === 0) {
    return {
      totalCpu: 0,
      totalMemory: 0,
      totalDisk: 0,
      totalNetwork: 0,
      avgResponseTime: 0,
      totalRequests: 0,
      avgErrorRate: 0,
      activeRepositories: 0,
      totalAlerts: 0,
    };
  }

  const sum = latestMetrics.reduce(
    (acc, m) => ({
      cpu: acc.cpu + m.cpu,
      memory: acc.memory + m.memory,
      disk: acc.disk + m.disk,
      network: acc.network + m.network,
      responseTime: acc.responseTime + m.responseTime,
      requests: acc.requests + m.requestCount,
      errorRate: acc.errorRate + m.errorRate,
    }),
    { cpu: 0, memory: 0, disk: 0, network: 0, responseTime: 0, requests: 0, errorRate: 0 }
  );

  const count = latestMetrics.length;
  const totalAlerts = allMonitoring.reduce((acc, m) => acc + (m.activeAlerts || 0), 0);

  return {
    totalCpu: sum.cpu / count,
    totalMemory: sum.memory / count,
    totalDisk: sum.disk / count,
    totalNetwork: sum.network,
    avgResponseTime: sum.responseTime / count,
    totalRequests: sum.requests,
    avgErrorRate: sum.errorRate / count,
    activeRepositories: allMonitoring.filter((m) => m.isMonitored).length,
    totalAlerts,
  };
}

export function getMonitoringAlerts(repositoryId?: string): MonitoringAlert[] {
  if (repositoryId) {
    return mockMonitoringAlerts
      .filter((a) => a.repositoryId === repositoryId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  return mockMonitoringAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getSecurityStatus(repositoryId: string): SecurityStatus | undefined {
  return mockSecurityStatuses.find((ss) => ss.repositoryId === repositoryId);
}

export function getFileTreeByRepositoryId(_repositoryId: string): GitHubTreeItem[] {
  // In real app, would fetch from GitHub API based on repository
  return mockFileTree;
}

export function getFileContent(path: string): GitHubFileContent | undefined {
  return mockFileContents[path];
}

export function searchFiles(query: string, tree: GitHubTreeItem[] = mockFileTree): GitHubTreeItem[] {
  const results: GitHubTreeItem[] = [];
  const lowerQuery = query.toLowerCase();

  function search(items: GitHubTreeItem[]) {
    for (const item of items) {
      if (item.name.toLowerCase().includes(lowerQuery) || item.path.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
      if (item.children) {
        search(item.children);
      }
    }
  }

  search(tree);
  return results;
}
