import { ProjectType } from '../types/wizard';
import { TaskTreeNode } from '../types/wizard';

const makeTask = (task: TaskTreeNode): TaskTreeNode => task;

const cloneTree = (nodes: TaskTreeNode[]): TaskTreeNode[] =>
  nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));

const webAppTasks: TaskTreeNode[] = [
  makeTask({
    id: 'plan-foundation',
    title: 'MVP 기획 확정',
    description: '핵심 가치 제안과 유저 흐름을 문서화하고 이해관계자와 합의',
    status: 'in_progress',
    priority: 'high',
    ownerRole: 'planner',
    etaDays: 3,
    children: [
      makeTask({
        id: 'persona',
        title: '목표 사용자 페르소나 정의',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'planner',
        etaDays: 1,
      }),
      makeTask({
        id: 'user-flow',
        title: '핵심 사용자 여정 맵 제작',
        status: 'in_progress',
        priority: 'high',
        ownerRole: 'planner',
        etaDays: 1,
      }),
      makeTask({
        id: 'okrs',
        title: '분기별 성공 지표(OKR) 합의',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'planner',
        etaDays: 1,
      }),
    ],
  }),
  makeTask({
    id: 'frontend-foundation',
    title: '프론트엔드 아키텍처 세팅',
    description: '디자인 시스템과 라우팅, 상태 관리 규칙 정의',
    status: 'in_progress',
    priority: 'high',
    ownerRole: 'developer',
    etaDays: 4,
    children: [
      makeTask({
        id: 'ui-kit',
        title: '디자인 시스템 초기 컴포넌트 제작',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'designer',
        etaDays: 2,
        children: [
          makeTask({
            id: 'token-setup',
            title: '타이포·컬러 토큰 정의',
            status: 'todo',
            priority: 'medium',
            ownerRole: 'designer',
            etaDays: 1,
          }),
          makeTask({
            id: 'button-input',
            title: 'Button/Input 컴포넌트',
            status: 'todo',
            priority: 'medium',
            ownerRole: 'designer',
            etaDays: 1,
            dependencies: ['token-setup'], // Depends on design tokens
          }),
        ],
      }),
      makeTask({
        id: 'routing',
        title: '라우팅/상태 관리 정책 작성',
        status: 'in_progress',
        priority: 'high',
        ownerRole: 'developer',
        etaDays: 1,
      }),
      makeTask({
        id: 'auth-ui',
        title: '인증 UI 플로우 제작',
        status: 'todo',
        priority: 'high',
        ownerRole: 'developer',
        etaDays: 1,
        dependencies: ['ui-kit', 'routing'], // Depends on design system and routing
      }),
    ],
  }),
  makeTask({
    id: 'backend-foundation',
    title: '백엔드 API 기초 구축',
    description: '프로젝트/태스크/사용자 도메인 설계 및 기본 API',
    status: 'todo',
    priority: 'high',
    ownerRole: 'developer',
    etaDays: 5,
    children: [
      makeTask({
        id: 'domain-modeling',
        title: '도메인 모델 및 DB 스키마 설계',
        status: 'todo',
        priority: 'high',
        ownerRole: 'developer',
        etaDays: 2,
      }),
      makeTask({
        id: 'task-api',
        title: 'Task CRUD + 서브태스크 API',
        status: 'todo',
        priority: 'high',
        ownerRole: 'developer',
        etaDays: 2,
        dependencies: ['domain-modeling'], // Depends on domain design
      }),
      makeTask({
        id: 'notification-queue',
        title: '알림 큐/Event 브로커 연결',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'developer',
        etaDays: 1,
        dependencies: ['task-api'], // Depends on task API events
      }),
    ],
  }),
];

const mobileTasks: TaskTreeNode[] = [
  makeTask({
    id: 'mobile-foundation',
    title: '모바일 크로스 플랫폼 구조 확정',
    status: 'in_progress',
    priority: 'high',
    ownerRole: 'developer',
    etaDays: 4,
    children: [
      makeTask({
        id: 'navigation',
        title: '탭/스택 내비게이션 설계',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'developer',
        etaDays: 1,
      }),
      makeTask({
        id: 'state-sync',
        title: '오프라인 동기화 전략 작성',
        status: 'todo',
        priority: 'high',
        ownerRole: 'developer',
        etaDays: 2,
        dependencies: ['navigation'], // Depends on navigation structure
      }),
    ],
  }),
  makeTask({
    id: 'wellbeing',
    title: '헬스 케어 기능 MVP',
    status: 'todo',
    priority: 'high',
    ownerRole: 'planner',
    etaDays: 5,
    children: [
      makeTask({
        id: 'tracking',
        title: '운동/식단 트래킹 시나리오',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'planner',
        etaDays: 2,
      }),
      makeTask({
        id: 'notification',
        title: '리마인더 & 코칭 메시지',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'planner',
        etaDays: 1,
        dependencies: ['tracking'], // Depends on tracking scenarios
      }),
    ],
  }),
];

const desktopTasks: TaskTreeNode[] = [
  makeTask({
    id: 'desktop-shell',
    title: '데스크톱 셸 & 자동 업데이트',
    status: 'todo',
    priority: 'high',
    ownerRole: 'developer',
    etaDays: 3,
    children: [
      makeTask({
        id: 'auto-update',
        title: '자동 업데이트 채널 구성',
        status: 'todo',
        priority: 'medium',
        ownerRole: 'developer',
        etaDays: 1,
      }),
    ],
  }),
];

export const getMockTaskTree = (type: ProjectType, keywords: string[] = []): TaskTreeNode[] => {
  switch (type) {
    case 'mobile':
      return cloneTree(mobileTasks);
    case 'desktop':
      return cloneTree(desktopTasks);
    default: {
      const cloned = cloneTree(webAppTasks);
      if (!keywords.length) return cloned;
      return cloned.map((task) => ({
        ...task,
        children: task.children?.map((child) => ({
          ...child,
          description: child.description || `${keywords[0]} 관련`,
        })),
      }));
    }
  }
};
