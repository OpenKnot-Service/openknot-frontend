import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Rocket,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  GitBranch,
  Activity,
  AlertCircle,
  Layers,
  CalendarClock,
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useProjectOutletContext } from '../components/layout/ProjectLayout';
import { RepositorySelector } from '../components/deployment/RepositorySelector';
import { HistoryViewToggle } from '../components/deployment/HistoryViewToggle';
import { BulkDeploymentPanel } from '../components/deployment/BulkDeploymentPanel';
import { ScheduleDeploymentModal, ScheduledDeploymentInput } from '../components/deployment/ScheduleDeploymentModal';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  getAllProjectDeployments,
  getDeploymentHistory,
  getUnifiedDeploymentHistory,
} from '../lib/mockData';
import { DeploymentHistoryView, BulkDeploymentConfig } from '../types';
import { cn } from '../lib/utils';

type ScheduledDeployment = {
  id: string;
  repositoryIds: string[];
  environment: 'dev' | 'staging' | 'production';
  scheduledAt: Date;
  status: 'scheduled' | 'executed' | 'cancelled';
  lastActionAt?: Date;
  actionActor?: string;
  note?: string;
};

export default function DeploymentPage() {
  const { showToast } = useToast();
  const { project } = useProjectOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get all deployments for this project
  const deployments = useMemo(() => getAllProjectDeployments(project.id), [project.id]);

  // State
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string | 'all'>(
    deployments.length > 0 ? deployments[0].repositoryId : 'all'
  );
  const [historyView, setHistoryView] = useState<DeploymentHistoryView>('per-repo');
  const [showBulkDeployPanel, setShowBulkDeployPanel] = useState(false);
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'all' | 'success' | 'failed' | 'in_progress'>('all');
  const [historyEnvFilter, setHistoryEnvFilter] = useState<'all' | 'dev' | 'staging' | 'production'>('all');
  const [historyBranchFilter, setHistoryBranchFilter] = useState<'all' | string>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDeployments, setScheduledDeployments] = useState<ScheduledDeployment[]>(() => [
    {
      id: 'schedule-1',
      repositoryIds: deployments.slice(0, 1).map((repo) => repo.repositoryId),
      environment: 'staging',
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4),
      status: 'scheduled',
      note: 'QA 승인 후 자동 배포',
    },
  ]);
  const [scheduleTab, setScheduleTab] = useState<'upcoming' | 'history'>(
    (searchParams.get('scheduleTab') as 'upcoming' | 'history') ?? 'upcoming'
  );
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState<'all' | 'scheduled' | 'executed' | 'cancelled'>(
    (searchParams.get('scheduleStatus') as 'all' | 'scheduled' | 'executed' | 'cancelled') ?? 'scheduled'
  );
  const [scheduleSort, setScheduleSort] = useState<'asc' | 'desc'>(
    (searchParams.get('scheduleSort') as 'asc' | 'desc') ?? 'asc'
  );
  const [scheduleSearch, setScheduleSearch] = useState(searchParams.get('scheduleSearch') ?? '');

  // Get current repository info
  const selectedRepo = deployments.find((d) => d.repositoryId === selectedRepositoryId);
  const isAllSelected = selectedRepositoryId === 'all';

  // Get deployment history based on view mode
  const [dynamicDeploymentHistory, setDynamicDeploymentHistory] = useState(getUnifiedDeploymentHistory(project.id));

  const deploymentHistorySource = useMemo(() => {
    if (historyView === 'unified' || isAllSelected) {
      return dynamicDeploymentHistory;
    }
    return getDeploymentHistory(selectedRepositoryId);
  }, [historyView, isAllSelected, dynamicDeploymentHistory, selectedRepositoryId]);

  const filteredHistory = useMemo(() => {
    return deploymentHistorySource.filter((item) => {
      if (historyStatusFilter !== 'all' && item.status !== historyStatusFilter) return false;
      if (historyEnvFilter !== 'all' && item.environment !== historyEnvFilter) return false;
      if (historyBranchFilter !== 'all' && item.branch !== historyBranchFilter) return false;
      return true;
    });
  }, [deploymentHistorySource, historyStatusFilter, historyEnvFilter, historyBranchFilter]);

  const historyCounts = useMemo(
    () =>
      deploymentHistorySource.reduce(
        (acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        { success: 0, failed: 0, in_progress: 0 } as Record<'success' | 'failed' | 'in_progress', number>
      ),
    [deploymentHistorySource]
  );

  const historyBranchOptions = useMemo(() => {
    const branches = Array.from(new Set(deploymentHistorySource.map((item) => item.branch))).filter(Boolean);
    return branches;
  }, [deploymentHistorySource]);

  const repoNameMap = useMemo(() => {
    const map = new Map<string, string>();
    deployments.forEach((repo) => {
      map.set(repo.repositoryId, repo.repositoryName);
    });
    return map;
  }, [deployments]);

  const scheduleCounts = useMemo(
    () =>
      scheduledDeployments.reduce(
        (acc, schedule) => {
          acc[schedule.status] = (acc[schedule.status] || 0) + 1;
          return acc;
        },
        { scheduled: 0, executed: 0, cancelled: 0 } as Record<'scheduled' | 'executed' | 'cancelled', number>
      ),
    [scheduledDeployments]
  );

  const handleScheduleExport = () => {
    if (scheduleList.length === 0) {
      showToast('내보낼 예약 데이터가 없습니다.', 'info');
      return;
    }
    const header = ['repository_names', 'environment', 'status', 'scheduled_at', 'note'];
    const rows = scheduleList.map((schedule) => [
      schedule.repositoryIds.map((id) => repoNameMap.get(id) ?? id).join('; '),
      schedule.environment,
      schedule.status,
      schedule.scheduledAt.toISOString(),
      schedule.note ?? '',
    ]);
    const csv = [header, ...rows]
      .map((columns) => columns.map((col) => `"${String(col).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scheduled-deployments-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('예약 목록을 CSV로 저장했습니다.', 'success');
  };

  const updateScheduleParams = (params: Partial<{ status: string; sort: string; search: string; tab: string }>) => {
    const next = new URLSearchParams(searchParams);
    if (params.status !== undefined) {
      if (params.status === 'scheduled') next.delete('scheduleStatus');
      else next.set('scheduleStatus', params.status);
    }
    if (params.sort !== undefined) {
      if (params.sort === 'asc') next.delete('scheduleSort');
      else next.set('scheduleSort', params.sort);
    }
    if (params.search !== undefined) {
      if (!params.search) next.delete('scheduleSearch');
      else next.set('scheduleSearch', params.search);
    }
    if (params.tab !== undefined) {
      if (params.tab === 'upcoming') next.delete('scheduleTab');
      else next.set('scheduleTab', params.tab);
    }
    setSearchParams(next, { replace: true });
  };

  const scheduleList = useMemo(() => {
    const now = Date.now();
    return [...scheduledDeployments]
      .filter((schedule) => {
        if (scheduleTab === 'upcoming') {
          if (scheduleStatusFilter === 'scheduled') {
            return schedule.status === 'scheduled' && schedule.scheduledAt.getTime() >= now;
          }
          if (scheduleStatusFilter === 'executed') {
            return schedule.status === 'executed';
          }
          if (scheduleStatusFilter === 'cancelled') {
            return schedule.status === 'cancelled';
          }
          return schedule.status === 'scheduled' && schedule.scheduledAt.getTime() >= now;
        }
        if (scheduleStatusFilter === 'scheduled') {
          return schedule.status === 'scheduled' && schedule.scheduledAt.getTime() < now;
        }
        if (scheduleStatusFilter === 'executed') {
          return schedule.status === 'executed';
        }
        if (scheduleStatusFilter === 'cancelled') {
          return schedule.status === 'cancelled';
        }
        return schedule.status !== 'scheduled' || schedule.scheduledAt.getTime() < now;
      })
      .filter((schedule) => {
        if (!scheduleSearch.trim()) return true;
        const repoNames = schedule.repositoryIds.map((id) => repoNameMap.get(id) ?? id).join(' ').toLowerCase();
        const note = schedule.note?.toLowerCase() ?? '';
        const query = scheduleSearch.toLowerCase();
        return repoNames.includes(query) || note.includes(query);
      })
      .sort((a, b) => {
        const diff = a.scheduledAt.getTime() - b.scheduledAt.getTime();
        return scheduleSort === 'asc' ? diff : -diff;
      });
  }, [scheduledDeployments, scheduleStatusFilter, scheduleSort, scheduleSearch, repoNameMap, scheduleTab]);

  const deploymentSummary = useMemo(() => {
    const total = deployments.length;
    const successCount = deployments.filter((d) => d.status === 'success').length;
    const failedCount = deployments.filter((d) => d.status === 'failed').length;
    const inProgressCount = deployments.filter((d) => d.status === 'in_progress').length;
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
    const latestDeploy = deployments.reduce<Date | null>((latest, deployment) => {
      if (!deployment.lastDeployedAt) return latest;
      if (!latest || deployment.lastDeployedAt > latest) {
        return deployment.lastDeployedAt;
      }
      return latest;
    }, null);
    return {
      total,
      successRate,
      failedCount,
      inProgressCount,
      latestDeploy,
    };
  }, [deployments]);

  const handleDeploy = (environment: 'dev' | 'staging' | 'production') => {
    if (isAllSelected) {
      showToast('레포지토리를 선택해주세요', 'warning');
      return;
    }
    showToast(
      `${selectedRepo?.repositoryName}을(를) ${
        environment === 'production' ? '프로덕션' : environment === 'staging' ? '스테이징' : '개발'
      } 환경에 배포합니다`,
      'info'
    );
  };

  const handleBulkDeploy = (config: BulkDeploymentConfig) => {
    const repoNames = deployments
      .filter((d) => config.repositoryIds.includes(d.repositoryId))
      .map((d) => d.repositoryName)
      .join(', ');

    showToast(
      `${repoNames}을(를) ${
        config.environment === 'production'
          ? '프로덕션'
          : config.environment === 'staging'
            ? '스테이징'
            : '개발'
      } 환경에 ${config.deployInParallel ? '병렬로' : '순차적으로'} 배포합니다`,
      'success'
    );
  };

  const handleScheduleSubmit = (schedule: ScheduledDeploymentInput) => {
    setScheduledDeployments((prev) => [
      ...prev,
      {
        id: `schedule-${Date.now()}`,
        repositoryIds: schedule.repositoryIds,
        environment: schedule.environment,
        scheduledAt: schedule.scheduledAt,
        status: 'scheduled',
        note: schedule.note,
      },
    ]);
    showToast('배포 예약이 등록되었습니다.', 'success');
  };

  const handleScheduleAction = (scheduleId: string, action: 'execute' | 'cancel') => {
    setScheduledDeployments((prev) =>
      prev.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;
        if (action === 'execute') {
          showToast('예약된 배포를 즉시 실행합니다.', 'success');
          const executedAt = new Date();
          const actor = '예약 배포';
          setDynamicDeploymentHistory((history) => [
            {
              id: `dynamic-${schedule.id}-${executedAt.getTime()}`,
              repositoryId: schedule.repositoryIds[0],
              repositoryName: repoNameMap.get(schedule.repositoryIds[0]) ?? '예약 배포',
              environment: schedule.environment,
              status: 'success',
              commitHash: 'scheduled',
              commitMessage: schedule.note ? `[예약 실행] ${schedule.note}` : '예약 실행',
              branch: 'scheduled-run',
              deployedBy: actor,
              deployedAt: executedAt,
              duration: 90,
            },
            ...history,
          ]);
          return {
            ...schedule,
            status: 'executed',
            lastActionAt: executedAt,
            actionActor: actor,
          };
        }
        showToast('예약된 배포가 취소되었습니다.', 'info');
        return {
          ...schedule,
          status: 'cancelled',
          lastActionAt: new Date(),
          actionActor: '예약 배포',
        };
      })
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  if (deployments.length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.name} 배포 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            원클릭으로 서비스를 배포하고 CI/CD 파이프라인을 관리하세요
          </p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-12 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-center">
          <Server className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            배포 가능한 레포지토리가 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            GitHub 탭에서 레포지토리를 추가해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Deployment Control</p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{project.name} 배포 관리</h1>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/80">
                {deploymentSummary.total}개 레포지토리
              </span>
            </div>
            <p className="text-white/70">
              파이프라인 상태와 환경 구성을 한 곳에서 모니터링하고, 원하는 레포지토리를 즉시 배포하세요.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                최근 배포 {deploymentSummary.latestDeploy ? formatTime(deploymentSummary.latestDeploy) : '기록 없음'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                성공률 {deploymentSummary.successRate}%
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                진행 중 {deploymentSummary.inProgressCount}건
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
              <RepositorySelector
                repositories={deployments}
                selectedRepositoryId={selectedRepositoryId}
                onSelect={setSelectedRepositoryId}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowBulkDeployPanel(true)}
                className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
              >
                <Layers className="w-4 h-4" />
                일괄 배포
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <CalendarClock className="w-4 h-4" />
                배포 예약
              </button>
              <HistoryViewToggle view={historyView} onViewChange={setHistoryView} />
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <DeploymentStatCard
            label="성공률"
            value={`${deploymentSummary.successRate}%`}
            helper="최근 상태 기준"
            tone="success"
          />
          <DeploymentStatCard
            label="실패"
            value={`${deploymentSummary.failedCount}건`}
            helper="최근 오류"
            tone={deploymentSummary.failedCount > 0 ? 'danger' : 'default'}
          />
          <DeploymentStatCard
            label="진행 중"
            value={`${deploymentSummary.inProgressCount}건`}
            helper="배포 파이프라인"
            tone={deploymentSummary.inProgressCount > 0 ? 'warning' : 'default'}
          />
          <DeploymentStatCard
            label="총 레포지토리"
            value={`${deploymentSummary.total}`}
            helper="관리 대상"
            tone="default"
          />
        </div>
      </div>

      {/* Quick Deploy Section */}
      {!isAllSelected && (
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">빠른 배포</h2>
              <p className="text-purple-100">
                {selectedRepo?.repositoryName}의 최신 커밋을 선택한 환경에 즉시 배포합니다
              </p>
            </div>
            <Rocket className="w-16 h-16 opacity-50" />
          </div>
          <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
            <button
              onClick={() => handleDeploy('dev')}
              className="rounded-lg border border-white/30 bg-white/20 p-4 text-left transition hover:bg-white/30 backdrop-blur"
            >
              <div className="font-semibold mb-1">Development</div>
              <div className="text-sm text-purple-100">개발 환경</div>
            </button>
            <button
              onClick={() => handleDeploy('staging')}
              className="rounded-lg border border-white/30 bg-white/20 p-4 text-left transition hover:bg-white/30 backdrop-blur"
            >
              <div className="font-semibold mb-1">Staging</div>
              <div className="text-sm text-purple-100">스테이징 환경</div>
            </button>
            <button
              onClick={() => handleDeploy('production')}
              className="rounded-lg border border-white/30 bg-white/20 p-4 text-left transition hover:bg-white/30 backdrop-blur"
            >
              <div className="font-semibold mb-1">Production</div>
              <div className="text-sm text-purple-100">프로덕션 환경</div>
            </button>
          </div>
        </div>
      )}

      {/* Deployment History */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <SectionHeader
          eyebrow="히스토리"
          title="배포 이력"
          description="상태 및 환경별 배포 흐름을 확인하세요"
          actions={
            <div className="hidden sm:block">
              <HistoryViewToggle view={historyView} onViewChange={setHistoryView} />
            </div>
          }
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: '전체', value: 'all', count: deploymentHistorySource.length },
            { label: '성공', value: 'success', count: historyCounts.success },
            { label: '실패', value: 'failed', count: historyCounts.failed },
            { label: '진행 중', value: 'in_progress', count: historyCounts.in_progress },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setHistoryStatusFilter(filter.value as typeof historyStatusFilter)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                historyStatusFilter === filter.value
                  ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200'
              )}
            >
              {filter.label}
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{filter.count}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <label className="text-xs text-gray-500 dark:text-gray-400">
            환경
            <select
              value={historyEnvFilter}
              onChange={(event) =>
                setHistoryEnvFilter(event.target.value as typeof historyEnvFilter)
              }
              className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="all">전체</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="dev">Development</option>
            </select>
          </label>
          <label className="text-xs text-gray-500 dark:text-gray-400">
            브랜치
            <select
              value={historyBranchFilter}
              onChange={(event) =>
                setHistoryBranchFilter(event.target.value)
              }
              className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="all">전체</option>
              {historyBranchOptions.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              선택한 조건에 해당하는 배포 이력이 없습니다
            </div>
          ) : (
            filteredHistory.map((item) => (
              <DeploymentHistoryItem
                key={item.id}
                repositoryName={historyView === 'unified' || isAllSelected ? item.repositoryName : undefined}
                environment={item.environment}
                status={item.status}
                commit={item.commitMessage}
                branch={item.branch}
                time={formatTime(item.deployedAt)}
                deployer={item.deployedBy}
                duration={item.duration}
              />
            ))
          )}
        </div>
      </div>

      {/* Scheduled Deployments */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <SectionHeader
          eyebrow="예약"
          title="예약 관리"
          description="미래 예약과 과거 실행 기록을 확인하세요"
          actions={
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                검색
                <input
                  value={scheduleSearch}
                  onChange={(event) => {
                    setScheduleSearch(event.target.value);
                    updateScheduleParams({ search: event.target.value });
                  }}
                  placeholder="레포지토리나 메모"
                  className="ml-2 rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </label>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-200"
              >
                새 예약
              </button>
              <button
                onClick={handleScheduleExport}
                className={cn(
                  'rounded-xl border px-3 py-1.5 text-sm font-semibold transition',
                  scheduleList.length === 0
                    ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'
                    : 'border-gray-900 text-gray-900 hover:bg-gray-50 dark:border-gray-200 dark:text-gray-100 dark:hover:bg-gray-900/60'
                )}
                disabled={scheduleList.length === 0}
              >
                CSV 저장
              </button>
            </div>
          }
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: '예정된 예약', value: 'upcoming' },
            { label: '과거 실행/취소', value: 'history' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setScheduleTab(tab.value as typeof scheduleTab);
                updateScheduleParams({ tab: tab.value });
              }}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold transition',
                scheduleTab === tab.value
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-100'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <DeploymentStatCard
            label="예약됨"
            value={`${scheduleCounts.scheduled}건`}
            helper="미래 실행 대기"
            tone="warning"
          />
          <DeploymentStatCard
            label="실행 완료"
            value={`${scheduleCounts.executed}건`}
            helper="예약 통해 실행"
            tone="success"
          />
          <DeploymentStatCard
            label="취소"
            value={`${scheduleCounts.cancelled}건`}
            helper="수동 취소"
            tone="danger"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[
            { label: '전체', value: 'all', count: scheduledDeployments.length },
            { label: '예약', value: 'scheduled', count: scheduleCounts.scheduled },
            { label: '실행', value: 'executed', count: scheduleCounts.executed },
            { label: '취소', value: 'cancelled', count: scheduleCounts.cancelled },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setScheduleStatusFilter(filter.value as typeof scheduleStatusFilter);
                updateScheduleParams({ status: filter.value });
              }}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                scheduleStatusFilter === filter.value
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-100'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-200'
              )}
            >
              {filter.label}
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{filter.count}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const nextSort = scheduleSort === 'asc' ? 'desc' : 'asc';
              setScheduleSort(nextSort);
              updateScheduleParams({ sort: nextSort });
            }}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-gray-300 dark:border-gray-700 dark:text-gray-200"
          >
            시간순 {scheduleSort === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {scheduleList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              조건에 해당하는 예약이 없습니다.
            </div>
          ) : (
            scheduleList.map((schedule) => (
              <ScheduledDeploymentItem
                key={schedule.id}
                schedule={schedule}
                repoNames={schedule.repositoryIds.map((id) => repoNameMap.get(id) ?? id)}
                onAction={handleScheduleAction}
                disabled={scheduleTab !== 'upcoming'}
                showHistoryMeta={scheduleTab === 'history'}
              />
            ))
          )}
        </div>
      </div>

      {/* CI/CD Pipeline & Environment Config */}
      {!isAllSelected && selectedRepo && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <SectionHeader
              eyebrow="파이프라인"
              title="CI/CD 파이프라인"
              description="빌드부터 배포까지 단계별 진행 상황"
            />
            <div className="space-y-4">
              <PipelineStep name="빌드" status="success" duration="2분 15초" />
              <PipelineStep name="테스트" status="success" duration="4분 32초" />
              <PipelineStep name="보안 스캔" status="success" duration="1분 48초" />
              <PipelineStep
                name="배포"
                status={selectedRepo.status || 'success'}
                duration={selectedRepo.status === 'in_progress' ? '진행 중' : '1분 30초'}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <SectionHeader
              eyebrow="환경"
              title="Environment 상태"
              description="각 환경의 배포 URL과 마지막 수행 시점을 확인하세요"
            />
            <div className="space-y-4">
              <EnvironmentConfig
                name="Production"
                url={selectedRepo.deploymentUrl || `https://${selectedRepo.repositoryName.toLowerCase()}.app`}
                status={selectedRepo.environment === 'production' ? 'healthy' : 'warning'}
                lastDeploy={selectedRepo.lastDeployedAt ? formatTime(selectedRepo.lastDeployedAt) : '없음'}
              />
              <EnvironmentConfig
                name="Staging"
                url={`https://staging-${selectedRepo.repositoryName.toLowerCase()}.app`}
                status="healthy"
                lastDeploy="5시간 전"
              />
              <EnvironmentConfig
                name="Development"
                url={`https://dev-${selectedRepo.repositoryName.toLowerCase()}.app`}
                status="warning"
                lastDeploy="1일 전"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Deployment Panel */}
      {showBulkDeployPanel && (
        <BulkDeploymentPanel
          repositories={deployments}
          onClose={() => setShowBulkDeployPanel(false)}
          onDeploy={handleBulkDeploy}
        />
      )}
      {showScheduleModal && (
        <ScheduleDeploymentModal
          repositories={deployments}
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleSubmit}
        />
      )}
    </div>
  );
}

interface DeploymentHistoryItemProps {
  repositoryName?: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'success' | 'failed' | 'in_progress';
  commit: string;
  branch: string;
  time: string;
  deployer: string;
  duration?: number;
}

function DeploymentHistoryItem({
  repositoryName,
  environment,
  status,
  commit,
  branch,
  time,
  deployer,
  duration,
}: DeploymentHistoryItemProps) {
  const statusConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
      bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    },
    failed: {
      icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    },
    in_progress: {
      icon: <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    },
  };

  const envLabel = {
    production: 'Production',
    staging: 'Staging',
    dev: 'Development',
  };

  return (
    <div className={cn('p-4 rounded-lg border', statusConfig[status].bg)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{statusConfig[status].icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {repositoryName && (
              <>
                <span className="font-semibold text-gray-900 dark:text-white">{repositoryName}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              </>
            )}
            <span className="font-semibold text-gray-900 dark:text-white">
              {envLabel[environment]}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{time}</span>
            {duration && (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{duration}초</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{commit}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <GitBranch className="w-3 h-3" />
              {branch}
            </span>
            <span>{deployer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PipelineStepProps {
  name: string;
  status: 'success' | 'failed' | 'in_progress' | 'pending';
  duration: string;
}

function PipelineStep({ name, status, duration }: PipelineStepProps) {
  const statusConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
      color: 'text-green-600 dark:text-green-400',
    },
    failed: {
      icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      color: 'text-red-600 dark:text-red-400',
    },
    in_progress: {
      icon: <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />,
      color: 'text-blue-600 dark:text-blue-400',
    },
    pending: {
      icon: <Clock className="w-5 h-5 text-gray-400" />,
      color: 'text-gray-400',
    },
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        {statusConfig[status].icon}
        <span className="font-medium text-gray-900 dark:text-white">{name}</span>
      </div>
      <span className={cn('text-sm font-medium', statusConfig[status].color)}>{duration}</span>
    </div>
  );
}

interface EnvironmentConfigProps {
  name: string;
  url: string;
  status: 'healthy' | 'warning' | 'error';
  lastDeploy: string;
}

function EnvironmentConfig({ name, url, status, lastDeploy }: EnvironmentConfigProps) {
  const statusConfig = {
    healthy: {
      icon: <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />,
      text: '정상',
      color: 'text-green-600 dark:text-green-400',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      text: '주의',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    error: {
      icon: <Server className="w-5 h-5 text-red-600 dark:text-red-400" />,
      text: '오류',
      color: 'text-red-600 dark:text-red-400',
    },
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
        <div className="flex items-center gap-1.5">
          {statusConfig[status].icon}
          <span className={cn('text-sm font-medium', statusConfig[status].color)}>
            {statusConfig[status].text}
          </span>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-1 block"
      >
        {url}
      </a>
      <p className="text-xs text-gray-500 dark:text-gray-400">마지막 배포: {lastDeploy}</p>
    </div>
  );
}

interface DeploymentStatCardProps {
  label: string;
  value: string;
  helper: string;
  tone: 'default' | 'success' | 'warning' | 'danger';
}

function DeploymentStatCard({ label, value, helper, tone }: DeploymentStatCardProps) {
  const toneConfig: Record<DeploymentStatCardProps['tone'], { border: string; text: string; helper: string }> = {
    default: {
      border: 'border-white/15 bg-white/5 text-white',
      text: 'text-white',
      helper: 'text-white/70',
    },
    success: {
      border: 'border-emerald-400/40 bg-emerald-400/10 text-white',
      text: 'text-emerald-200',
      helper: 'text-emerald-100/80',
    },
    warning: {
      border: 'border-amber-400/40 bg-amber-400/10 text-white',
      text: 'text-amber-200',
      helper: 'text-amber-100/80',
    },
    danger: {
      border: 'border-rose-400/40 bg-rose-400/10 text-white',
      text: 'text-rose-200',
      helper: 'text-rose-100/80',
    },
  };

  return (
    <div className={cn('rounded-2xl border p-4 transition', toneConfig[tone].border)}>
      <p className={cn('text-xs font-semibold uppercase tracking-wide', toneConfig[tone].helper)}>{label}</p>
      <p className={cn('mt-2 text-2xl font-bold', toneConfig[tone].text)}>{value}</p>
      <p className={cn('text-xs', toneConfig[tone].helper)}>{helper}</p>
    </div>
  );
}

interface ScheduledDeploymentItemProps {
  schedule: ScheduledDeployment;
  repoNames: string[];
  onAction: (scheduleId: string, action: 'execute' | 'cancel') => void;
  disabled?: boolean;
  showHistoryMeta?: boolean;
}

function ScheduledDeploymentItem({
  schedule,
  repoNames,
  onAction,
  disabled = false,
  showHistoryMeta = false,
}: ScheduledDeploymentItemProps) {
  const envConfig: Record<ScheduledDeployment['environment'], { label: string; chipColor: string }> = {
    dev: { label: 'Development', chipColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' },
    staging: { label: 'Staging', chipColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200' },
    production: { label: 'Production', chipColor: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200' },
  };

  const formattedTime = schedule.scheduledAt.toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const minutesUntil = Math.max(
    0,
    Math.round((schedule.scheduledAt.getTime() - Date.now()) / 60000)
  );
  const relative =
    minutesUntil < 60
      ? `${minutesUntil}분 후`
      : minutesUntil < 1440
        ? `${Math.floor(minutesUntil / 60)}시간 후`
        : `${Math.floor(minutesUntil / 1440)}일 후`;

  const statusChip = (() => {
    if (schedule.status === 'scheduled') {
      return <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">예약됨</span>;
    }
    if (schedule.status === 'executed') {
      return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">실행됨</span>;
    }
    return <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">취소됨</span>;
  })();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {repoNames.join(', ')}
          </span>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', envConfig[schedule.environment].chipColor)}>
            {envConfig[schedule.environment].label}
          </span>
          {statusChip}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formattedTime}
          {schedule.status === 'scheduled' ? ` · ${relative}` : schedule.lastActionAt ? ` · 완료 ${schedule.lastActionAt.toLocaleString('ko-KR')}` : ''}
        </p>
        {schedule.note && (
          <p className="text-xs text-gray-600 dark:text-gray-300">{schedule.note}</p>
        )}
        {showHistoryMeta && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {schedule.actionActor ?? '시스템'} · {schedule.lastActionAt ? schedule.lastActionAt.toLocaleString('ko-KR') : '시간 미기록'}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {schedule.status === 'scheduled' && !disabled && (
          <>
            <button
              onClick={() => onAction(schedule.id, 'execute')}
              className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-200"
            >
              즉시 실행
            </button>
            <button
              onClick={() => onAction(schedule.id, 'cancel')}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200"
            >
              취소
            </button>
          </>
        )}
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{repoNames.length}개</span>
      </div>
    </div>
  );
}
