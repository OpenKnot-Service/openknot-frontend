import {
  Activity,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import NotificationStack from '../components/ui/NotificationStack';
import { useApp } from '../contexts/AppContext';

const metricCards = [
  {
    title: 'AI 추천 실행률',
    value: '82%',
    delta: '+14%',
    description: '이번 주 팀이 실행한 AI 제안',
    icon: Sparkles,
  },
  {
    title: '완료된 태스크',
    value: '128',
    delta: '+32',
    description: '지난 7일 대비 완료 속도',
    icon: CheckCircle2,
  },
  {
    title: '평균 리드타임',
    value: '2.4일',
    delta: '-0.6일',
    description: '아이디어에서 배포까지 걸린 시간',
    icon: Clock,
  },
  {
    title: '프로젝트 건강도',
    value: '92',
    delta: '+5',
    description: 'AI가 평가한 위험 점수',
    icon: ShieldCheck,
  },
];

const aiInsights = [
  {
    title: 'Sprint 21의 QA 리소스가 부족할 수 있어요',
    detail: '현재 담당자 2명이 휴가 예정입니다. 백업 담당자를 지정하면 일정 리스크를 줄일 수 있어요.',
    action: '백업 담당자 지정하기',
  },
  {
    title: '프론트엔드 PR 검토 시간이 지연되고 있어요',
    detail: '평균 리뷰 시간이 18시간으로 늘었습니다. 코드 소유자 알림을 강화해 보세요.',
    action: '알림 정책 수정하기',
  },
  {
    title: '다음 주 배포 윈도우를 예약하세요',
    detail: '테스트 통과율 97%. 배포 목표를 조정하면 출시 목표를 지킬 수 있습니다.',
    action: '배포 계획 잡기',
  },
];

export default function DashboardPage() {
  const { notifications, user, markNotificationAsRead, isNotificationCenterOpen } = useApp();

  const unreadNotifications = useMemo(() => {
    return notifications.filter((n) => n.userId === user.id && !n.read);
  }, [notifications, user.id]);

  return (
    <div className="relative">
      {!isNotificationCenterOpen && (
        <NotificationStack
          notifications={unreadNotifications}
          onMarkAsRead={markNotificationAsRead}
          maxVisible={3}
          delay={220}
          autoDismissDelay={5200}
        />
      )}

      <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10">
        <div className="grid gap-8">
          <HeroHeader />
          <MetricOverview />
          <InsightGrid />
          <WorkloadOverview />
        </div>
      </div>
    </div>
  );
}

function HeroHeader() {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[image:var(--gradient-primary)] p-8 text-[color:var(--foreground)] shadow-[var(--shadow-medium)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-32 h-64 w-64 rounded-full bg-white/30 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold tracking-wide text-[color:var(--inverse-foreground)]">
            <Brain className="h-4 w-4" />
            AI Co-Pilot 준비 완료
          </span>
          <h1 className="text-3xl font-bold leading-tight lg:text-[2.35rem]">
            오늘도 AI가 프로젝트의 다음 최적 실행 단계를 준비했어요.
          </h1>
          <p className="text-[color:var(--foreground)]/85">
            새로운 인사이트, 자동화된 워크플로, 실시간 리스크 분석까지. 필요한 액션을 지금 바로 실행하세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-white/85 px-4 py-2 text-sm font-semibold text-[color:var(--inverse-foreground)] shadow-sm transition hover:translate-y-[-1px] hover:bg-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              프로젝트 살펴보기
            </Link>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-white/60 px-4 py-2 text-sm font-semibold text-[color:var(--inverse-foreground)] transition hover:bg-white/20"
            >
              <Rocket className="h-4 w-4" />
              새 프로젝트 생성
            </Link>
          </div>
        </div>
        <div className="grid w-full max-w-sm gap-4 rounded-[var(--radius-md)] border border-white/40 bg-white/25 p-4 text-[color:var(--inverse-foreground)] backdrop-blur-md">
          <header className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide">AI 상태</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              실시간 업데이트
            </span>
          </header>
          <div className="space-y-3 text-sm">
            <InsightRow
              title="지연 위험 감지"
              description="2개의 스프린트에서 일정 지연 신호 감지"
            />
            <InsightRow
              title="자동화 실행"
              description="5개의 반복 태스크 자동화 진행 중"
            />
            <InsightRow title="배포 준비" description="QA 완료, 배포 승인 대기" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricOverview() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((metric) => (
        <article
          key={metric.title}
          className="group rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-[2px] hover:border-[color:var(--primary-soft)] hover:shadow-[var(--shadow-medium)]"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-foreground)]">
              이번 주
            </div>
            <metric.icon className="h-5 w-5 text-[color:var(--primary)]" />
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <span className="text-3xl font-semibold text-[color:var(--foreground)]">
                {metric.value}
              </span>
              <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                {metric.description}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--success)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--success)]">
              <TrendingUp className="h-3 w-3" />
              {metric.delta}
            </span>
          </div>
          <div className="mt-5 h-1.5 w-full rounded-full bg-[color:var(--accent)]">
            <span className="block h-full w-[78%] rounded-full bg-[color:var(--primary)] transition-all duration-300 group-hover:w-[88%]" />
          </div>
        </article>
      ))}
    </section>
  );
}

function InsightGrid() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <article className="col-span-2 space-y-5 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
              AI 코칭 인사이트
            </h2>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              지금 바로 실행하면 가장 큰 임팩트를 만들 수 있는 제안이에요.
            </p>
          </div>
          <Link
            to="/ai-console"
            className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1.5 text-xs font-semibold text-[color:var(--foreground)] transition-colors hover:border-[color:var(--primary)] hover:text-[color:var(--primary-strong)]"
          >
            AI 콘솔 열기
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </header>
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div
              key={insight.title}
              className="group flex flex-col gap-3 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-subtle)]/90 p-4 transition hover:border-[color:var(--primary-soft)]"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--foreground)]">
                <Brain className="h-4 w-4 text-[color:var(--primary)]" />
                {insight.title}
              </span>
              <p className="text-sm text-[color:var(--muted-foreground)]">{insight.detail}</p>
              <button className="inline-flex items-center gap-2 self-start rounded-full bg-[color:var(--accent)] px-3 py-1.5 text-xs font-semibold text-[color:var(--accent-foreground)] transition hover:bg-[color:var(--background-muted)]">
                {insight.action}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </article>

      <aside className="space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <header className="mb-2 space-y-1">
          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">진행 중 작업</h3>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            오늘 마감 예정인 우선순위 태스크를 정리했어요.
          </p>
        </header>

        <div className="space-y-4">
          <TaskSummaryRow
            project="Frontend 리팩토링"
            title="디자인 시스템 마이그레이션 완료"
            due="오늘"
            assignee="이은지"
          />
          <TaskSummaryRow
            project="모바일 앱"
            title="푸시 알림 통합 테스트"
            due="내일"
            assignee="박준호"
          />
          <TaskSummaryRow
            project="데이터 플랫폼"
            title="ETL 파이프라인 모니터링"
            due="3일 후"
            assignee="홍서연"
          />
        </div>

        <Link
          to="/projects"
          className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary-strong)]"
        >
          전체 프로젝트 보기
        </Link>
      </aside>
    </section>
  );
}

function WorkloadOverview() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <article className="space-y-6 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">팀 컨디션</h2>
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-foreground)]">
            <Activity className="h-3.5 w-3.5" />
            실시간
          </span>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <WorkMetric
            label="평균 집중 시간"
            value="4.8h"
            delta="+0.5h"
            description="Deep work 등급 상승"
          />
          <WorkMetric
            label="자동 생성 태스크"
            value="34"
            delta="+9"
            description="AI가 제안한 신규 업무"
          />
          <WorkMetric
            label="리뷰 대기 PR"
            value="7"
            delta="-3"
            description="평균 대기 시간 6시간"
          />
          <WorkMetric
            label="추가 버퍼"
            value="2.5일"
            delta="+1.1일"
            description="현재 예비 일정"
          />
        </div>
      </article>

      <article className="space-y-5 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--foreground)]">자동화 타임라인</h2>
            <p className="text-sm text-[color:var(--muted-foreground)]">
              예정된 자동화 워크플로와 영향 범위를 확인하세요.
            </p>
          </div>
          <Link
            to="/automation"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--primary)] transition hover:text-[color:var(--primary-strong)]"
          >
            전체 보기
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <div className="space-y-4">
          <AutomationItem
            time="09:30"
            title="테스트 플래키 케이스 자동 재실행"
            detail="CI 파이프라인 실패 케이스 중 재현율 20% 이하 항목 자동 재실행"
          />
          <AutomationItem
            time="11:00"
            title="AI 회고 요약 전송"
            detail="Sprint 20 회고 내용을 요약해 팀 채널로 공유합니다."
          />
          <AutomationItem
            time="15:45"
            title="릴리스 노트 작성"
            detail="지난 24시간의 커밋과 태스크를 기반으로 릴리스 노트를 생성합니다."
          />
        </div>
      </article>
    </section>
  );
}

interface InsightRowProps {
  title: string;
  description: string;
}

function InsightRow({ title, description }: InsightRowProps) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-white/40 bg-white/25 px-3 py-2 text-[color:var(--inverse-foreground)]">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-[color:var(--inverse-foreground)]/75">{description}</p>
    </div>
  );
}

interface TaskSummaryRowProps {
  project: string;
  title: string;
  due: string;
  assignee: string;
}

function TaskSummaryRow({ project, title, due, assignee }: TaskSummaryRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3">
      <div className="flex items-center justify-between text-xs text-[color:var(--muted-foreground)]">
        <span>{project}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--accent)] px-2 py-0.5 font-semibold text-[color:var(--accent-foreground)]">
          <Clock className="h-3 w-3" />
          {due}
        </span>
      </div>
      <p className="text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
      <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
        <Zap className="h-3.5 w-3.5 text-[color:var(--primary)]" />
        {assignee} 담당
      </div>
    </div>
  );
}

interface WorkMetricProps {
  label: string;
  value: string;
  delta: string;
  description: string;
}

function WorkMetric({ label, value, delta, description }: WorkMetricProps) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]">
          {label}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--success)]/15 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--success)]">
          <TrendingUp className="h-3 w-3" />
          {delta}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">{value}</div>
      <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">{description}</p>
    </div>
  );
}

interface AutomationItemProps {
  time: string;
  title: string;
  detail: string;
}

function AutomationItem({ time, title, detail }: AutomationItemProps) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-foreground)]">
          {time}
        </span>
        <p className="flex-1 text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
      </div>
      <p className="mt-2 text-xs text-[color:var(--muted-foreground)]">{detail}</p>
    </div>
  );
}
