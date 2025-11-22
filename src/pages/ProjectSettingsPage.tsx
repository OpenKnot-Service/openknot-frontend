import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { getMonitoringAlerts, getUserById } from '../lib/mockData';
import type { Position, Project } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TagInput from '../components/ui/TagInput';
import UserAvatar from '../components/ui/UserAvatar';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  Settings,
  Users,
  Trash2,
  Archive,
  Globe,
  Lock,
  Shield,
  UserPlus,
  GitBranch,
  Activity,
  CalendarClock,
  Zap,
  Minus,
  Plus,
} from 'lucide-react';
import { useProjectOutletContext } from '../components/layout/ProjectLayout';
import { cn } from '../lib/utils';

const releaseChannelOptions = [
  { value: 'stable', label: 'Stable', helper: 'QA 승인 후 배포' },
  { value: 'beta', label: 'Beta', helper: '선별 유저 대상' },
  { value: 'canary', label: 'Canary', helper: '1% 트래픽 롤아웃' },
] as const;

const branchOptions = ['main', 'develop', 'release', 'hotfix'] as const;

const regionOptions = ['서울', '도쿄', '싱가포르', '오하이오'] as const;

const auditTrail = [
  { label: 'Slack 연동을 재구성했습니다', actor: '배포 봇', timestamp: '오늘 11:24' },
  { label: 'main 브랜치 보호 규칙을 수정했습니다', actor: '김프로', timestamp: '어제 19:12' },
  { label: '자동 배포가 일시 중지되었습니다', actor: '시스템', timestamp: '3일 전' },
] as const;

type ReleaseChannelValue = (typeof releaseChannelOptions)[number]['value'];
const roleOptions = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'planner', label: 'Planner' },
  { value: 'other', label: 'Other' },
] as const;

const specializationPresets = [
  'Frontend',
  'Backend',
  'Fullstack',
  'Mobile',
  'Data',
  'PM',
  'QA',
] as const;

const ProjectSettingsPage = () => {
  const navigate = useNavigate();
  const { updateProject, deleteProject } = useApp();
  const { showToast } = useToast();
  const { project } = useProjectOutletContext();

  const ownerUser = getUserById(project.ownerId);
  const buildDefaultEnvSecrets = () =>
    project.envSecrets ?? {
      owner: ownerUser?.name ?? '보안 담당',
      lastRotatedAt: project.updatedAt,
      pendingRenewals: 2,
      integrations: ['AWS Secrets Manager', 'Vercel'],
    };

  type ProjectFormState = {
    name: string;
    description: string;
    visibility: Project['visibility'];
    techStack: string[];
  };

  const [formData, setFormData] = useState<ProjectFormState>({
    name: project.name || '',
    description: project.description || '',
    visibility: (project.visibility || 'public') as Project['visibility'],
    techStack: project.techStack || [],
  });

  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'member' | 'admin'>('member');
  const [releaseChannel, setReleaseChannel] = useState<ReleaseChannelValue>('stable');
  const [defaultBranch, setDefaultBranch] = useState<string>(project.repositories?.length ? 'main' : 'main');
  const [deploymentRegions, setDeploymentRegions] = useState<string[]>(['서울', '도쿄']);
  const [autoDeployEnabled, setAutoDeployEnabled] = useState(true);
  const [branchProtectionEnabled, setBranchProtectionEnabled] = useState(true);
  const [incidentAlertsEnabled, setIncidentAlertsEnabled] = useState(true);
  const [codeOwnerReview, setCodeOwnerReview] = useState(true);
  const [designSync, setDesignSync] = useState(false);
  const [backupsEnabled, setBackupsEnabled] = useState(true);
  const [autoCloseTickets, setAutoCloseTickets] = useState(project.autoCloseTickets ?? false);
  const [positionPlan, setPositionPlan] = useState(
    project.positions.map((pos) => ({
      ...pos,
      title: pos.title || pos.description || pos.requirements[0] || pos.role,
    }))
  );
  const [totalHeadcountTarget, setTotalHeadcountTarget] = useState(
    project.positions.reduce((acc, pos) => acc + pos.count, 0)
  );
  const [envSecrets, setEnvSecrets] = useState(buildDefaultEnvSecrets());

  useEffect(() => {
    setFormData({
      name: project.name || '',
      description: project.description || '',
      visibility: (project.visibility || 'public') as Project['visibility'],
      techStack: project.techStack || [],
    });
    setReleaseChannel(project.releaseChannel ?? 'stable');
    setDefaultBranch(project.defaultBranch ?? 'main');
    setDeploymentRegions(project.deploymentRegions ?? ['서울', '도쿄']);
    setAutoDeployEnabled(project.autoDeployEnabled ?? true);
    setBranchProtectionEnabled(project.branchProtectionEnabled ?? true);
    setIncidentAlertsEnabled(project.incidentAlertsEnabled ?? true);
    setCodeOwnerReview(project.codeOwnerReviewRequired ?? true);
    setDesignSync(project.designSyncEnabled ?? false);
    setBackupsEnabled(project.backupsEnabled ?? true);
    setAutoCloseTickets(project.autoCloseTickets ?? false);
    setEnvSecrets(buildDefaultEnvSecrets());
    setPositionPlan(
      project.positions.map((pos) => ({
        ...pos,
        title: pos.title || pos.description || pos.requirements[0] || pos.role,
      }))
    );
    setTotalHeadcountTarget(project.positions.reduce((acc, pos) => acc + pos.count, 0));
  }, [project]);

  useEffect(() => {
    setTotalHeadcountTarget(positionPlan.reduce((acc, pos) => acc + pos.count, 0));
  }, [positionPlan]);

  const handleSave = () => {
    updateProject(project.id, {
      name: formData.name,
      description: formData.description,
      visibility: formData.visibility,
      techStack: formData.techStack,
    });
    showToast('프로젝트 정보가 업데이트되었습니다.', 'success');
  };

  const handleInviteMember = () => {
    if (!inviteEmail) {
      showToast('이메일을 입력하세요.', 'error');
      return;
    }
    // TODO: 백엔드 연동 시 실제 초대 API 호출
    showToast(`${inviteEmail}로 초대 이메일을 보냈습니다.`, 'success');
    setInviteEmail('');
  };

  const handleRemoveMember = (userId: string) => {
    if (confirm('정말로 이 멤버를 제거하시겠습니까?')) {
      // TODO: 백엔드 연동 시 실제 API 호출
      showToast(`멤버(${userId})가 제거되었습니다.`, 'success');
    }
  };

  const handleChangeRole = (userId: string, newRole: 'owner' | 'admin' | 'member') => {
    // TODO: 백엔드 연동 시 실제 API 호출
    showToast(`멤버(${userId}) 역할이 ${newRole}로 변경되었습니다.`, 'success');
  };

  const handleArchive = () => {
    if (confirm('이 프로젝트를 아카이브하시겠습니까?')) {
      updateProject(project.id, { status: 'archived' });
      showToast('프로젝트가 아카이브되었습니다.', 'success');
      navigate('/projects');
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        '정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.\n\n모든 Task, 댓글, 파일이 영구적으로 삭제됩니다.'
      )
    ) {
      deleteProject(project.id);
      showToast('프로젝트가 삭제되었습니다.', 'success');
      navigate('/projects');
    }
  };

  const handleRegionToggle = (region: string) => {
    setDeploymentRegions((prev) =>
      prev.includes(region) ? prev.filter((item) => item !== region) : [...prev, region]
    );
  };

  const handleIntegrationSave = () => {
    updateProject(project.id, {
      autoCloseTickets,
      designSyncEnabled: designSync,
      incidentAlertsEnabled,
      positions: positionPlan,
    });
    showToast('통합 설정이 저장되었습니다.', 'success');
  };

  const handleWorkflowSave = () => {
    updateProject(project.id, {
      releaseChannel,
      defaultBranch,
      deploymentRegions,
      autoDeployEnabled,
      branchProtectionEnabled,
      codeOwnerReviewRequired: codeOwnerReview,
      backupsEnabled,
    });
    showToast('배포 및 워크플로 설정이 저장되었습니다.', 'success');
  };

  const handleApplyToRepos = () => {
    showToast('연결된 모든 리포지토리에 설정을 적용했습니다.', 'success');
  };

  const handleRotateSecrets = () => {
    const nextEnv = {
      ...envSecrets,
      lastRotatedAt: new Date(),
      pendingRenewals: 0,
    };
    setEnvSecrets(nextEnv);
    updateProject(project.id, { envSecrets: nextEnv });
    showToast('환경 변수 암호가 회전되었습니다.', 'success');
  };

  const timelineCopy = project.startDate
    ? `${project.startDate.toLocaleDateString('ko-KR')} ~ ${project.endDate ? project.endDate.toLocaleDateString('ko-KR') : '진행 중'}`
    : '일정 미정';

  const statusCopyMap: Record<typeof project.status, string> = {
    recruiting: '팀 빌딩 중',
    in_progress: '진행 중',
    completed: '완료',
    archived: '아카이브',
  };

  const projectStats = useMemo(
    () => [
      { label: '멤버', value: `${project.members.length}명` },
      { label: '리포지토리', value: `${project.repositories?.length ?? 0}개` },
      { label: '기술 스택', value: `${formData.techStack.length}개` },
    ],
    [project.members.length, project.repositories?.length, formData.techStack.length]
  );

  const watchers = useMemo(() => Math.max(project.members.length * 2, 8), [project.members.length]);

  const criticalAlerts = useMemo(() => {
    if (!project.repositories || project.repositories.length === 0) {
      return [];
    }
    const repoSet = new Set(project.repositories);
    return getMonitoringAlerts().filter(
      (alert) => repoSet.has(alert.repositoryId) && alert.severity === 'critical'
    );
  }, [project.repositories]);

  const memberPositionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    project.members.forEach((member) => {
      if (!member.position) return;
      const key = member.position.toLowerCase().trim();
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return counts;
  }, [project.members]);

  const getFilledCount = useCallback(
    (pos: Position) => {
      const candidates = [
        pos.id,
        pos.title,
        pos.specialization,
        pos.description,
        pos.role,
      ];

      for (const candidate of candidates) {
        if (!candidate) continue;
        const key = candidate.toLowerCase().trim();
        if (memberPositionCounts[key] != null) {
          return memberPositionCounts[key];
        }
      }
      return pos.filled ?? 0;
    },
    [memberPositionCounts]
  );

  const teamInsights = useMemo(() => {
    const totals = positionPlan.reduce(
      (acc, pos) => {
        const filled = getFilledCount(pos);
        acc.totalNeeded += pos.count;
        acc.totalFilled += filled;
        if (pos.count > filled) {
          acc.openRoles.push({ position: pos, filled });
        }
        return acc;
      },
      { totalNeeded: 0, totalFilled: 0, openRoles: [] as Array<{ position: Position; filled: number }> }
    );
    const bottleneck = [...totals.openRoles]
      .sort((a, b) => (b.position.count - b.filled) - (a.position.count - a.filled))[0];
    return {
      totalNeeded: totals.totalNeeded,
      totalFilled: totals.totalFilled,
      openRoles: totals.openRoles,
      bottleneck,
    };
  }, [positionPlan, getFilledCount]);

  const clampNumber = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handlePositionAdjust = (positionId: string, field: 'count' | 'filled', delta: number) => {
    setPositionPlan((prev) =>
      prev.map((pos) => {
        if (pos.id !== positionId) return pos;
        if (field === 'count') {
          const filled = getFilledCount(pos);
          return { ...pos, count: clampNumber(pos.count + delta, filled, 999) };
        }
        return pos;
      })
    );
  };

  const handlePositionMetaChange = (
    positionId: string,
    updates: Partial<Position>
  ) => {
    setPositionPlan((prev) =>
      prev.map((pos) => (pos.id === positionId ? { ...pos, ...updates } : pos))
    );
  };

  const handlePositionInputChange = (positionId: string, rawValue: string) => {
    const numeric = Number(rawValue);
    if (Number.isNaN(numeric)) {
      showToast('숫자를 입력해주세요.', 'error');
      return;
    }
    setPositionPlan((prev) =>
      prev.map((pos) => {
        if (pos.id !== positionId) return pos;
        const filled = getFilledCount(pos);
        return { ...pos, count: clampNumber(numeric, filled, 999) };
      })
    );
  };

  const handlePositionSave = () => {
    updateProject(project.id, { positions: positionPlan });
    showToast('포지션 정보가 업데이트되었습니다.', 'success');
  };

  const handleAddPositionArea = () => {
    const newPosition = {
      id: `position-${Date.now()}`,
      role: 'developer' as const,
      title: '새 역할',
      specialization: 'Frontend',
      count: 1,
      filled: 0,
      requirements: [],
      description: '',
    };
    setPositionPlan((prev) => [...prev, newPosition]);
  };

  const handleRemovePositionArea = (positionId: string) => {
    if (positionPlan.length === 1) {
      showToast('최소 한 개의 역할은 유지해야 합니다.', 'error');
      return;
    }
    setPositionPlan((prev) => prev.filter((pos) => pos.id !== positionId));
  };

  const handleHeadcountTargetApply = (newTarget: number) => {
    if (Number.isNaN(newTarget)) {
      return;
    }
    if (newTarget < teamInsights.totalFilled) {
      showToast(`총 인원은 현재 충원된 ${teamInsights.totalFilled}명보다 작을 수 없습니다.`, 'error');
      setTotalHeadcountTarget(teamInsights.totalNeeded);
      return;
    }
    let delta = newTarget - teamInsights.totalNeeded;
    if (delta === 0) return;
    setPositionPlan((prev) => {
      const updated = prev.map((pos) => ({ ...pos }));
      if (delta > 0) {
        let idx = 0;
        while (delta > 0 && updated.length > 0) {
          updated[idx % updated.length].count += 1;
          delta -= 1;
          idx += 1;
        }
      } else {
        let safety = 1000;
        while (delta < 0 && safety > 0) {
          const candidates = updated.filter((pos) => pos.count > getFilledCount(pos));
          if (candidates.length === 0) break;
          candidates.sort(
            (a, b) =>
              (b.count - getFilledCount(b)) -
              (a.count - getFilledCount(a))
          );
          const target = candidates[0];
          if (!target) break;
          target.count -= 1;
          delta += 1;
          safety -= 1;
        }
      }
      return updated;
    });
    setTotalHeadcountTarget(newTarget);
    showToast('총 정원이 업데이트되었습니다.', 'success');
  };

  const quickToggles = [
    {
      label: '자동 배포',
      description: 'main 브랜치 머지 시 즉시 배포',
      value: autoDeployEnabled,
      onChange: setAutoDeployEnabled,
    },
    {
      label: '브랜치 보호',
      description: '필수 리뷰 + 상태 체크',
      value: branchProtectionEnabled,
      onChange: setBranchProtectionEnabled,
    },
    {
      label: '사고 알림',
      description: '에러 발생 시 Slack 알림',
      value: incidentAlertsEnabled,
      onChange: setIncidentAlertsEnabled,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <header>
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
          <Settings className="h-8 w-8" />
          프로젝트 설정
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{project.name} 프로젝트의 워크플로와 멤버십을 관리합니다.</p>
      </header>

      {criticalAlerts.length > 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-4 border border-red-200 bg-red-50/70 p-4 dark:border-red-900 dark:bg-red-900/20">
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-300">
              보안 경고 · {criticalAlerts.length}건의 critical 알림
            </p>
            <p className="text-xs text-red-700 dark:text-red-200">
              {criticalAlerts[0].repositoryName}에서 {criticalAlerts[0].type} 이슈가 감지되었습니다. 즉시 대응이 필요합니다.
            </p>
          </div>
          <Button size="sm" variant="danger" onClick={() => navigate('/monitoring')}>
            위험 지표 확인
          </Button>
        </Card>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 text-white shadow-lg lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">프로젝트 상태</p>
              <div className="mt-1 flex items-center gap-3 text-2xl font-semibold">
                {statusCopyMap[project.status]}
              </div>
              <p className="mt-2 text-sm text-white/70">{project.description || '아직 설명이 작성되지 않았습니다.'}</p>
            </div>
            <div className="text-right text-sm text-white/70">
              <p>타임라인</p>
              <p className="mt-1 font-semibold text-white">{timelineCopy}</p>
              <p className="mt-2">마지막 업데이트</p>
              <p className="font-semibold text-white">{project.updatedAt.toLocaleDateString('ko-KR')}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {projectStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/75">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              <CalendarClock className="h-4 w-4" />
              {watchers}명이 프로젝트를 팔로우 중
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              <Activity className="h-4 w-4" />
              최근 7일 배포 5회
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1">
              <GitBranch className="h-4 w-4" />
              기본 브랜치 {defaultBranch}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">운영 토글</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">실험적 기능</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">위험도를 낮추고 자동화를 활성화하세요</p>
            </div>
            <Zap className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="mt-5 space-y-4">
            {quickToggles.map((toggle) => (
              <label key={toggle.label} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{toggle.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{toggle.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={toggle.value}
                  onChange={(event) => toggle.onChange(event.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </label>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div>
              <p>릴리즈 채널</p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{releaseChannel.toUpperCase()}</p>
            </div>
            <div>
              <p>활성 리전</p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{deploymentRegions.length}곳</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">프로젝트 프로필</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">기본 정보</h2>
          </div>
          <Button onClick={handleSave}>변경사항 저장</Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              프로젝트 이름
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                placeholder="프로젝트 이름"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              설명
              <textarea
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                placeholder="프로젝트 설명"
              />
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">공개 여부</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {(
                  [
                    { key: 'public', icon: Globe, label: '공개', description: '누구나 열람 가능' },
                    { key: 'private', icon: Lock, label: '비공개', description: '멤버만 접근' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setFormData({ ...formData, visibility: option.key })}
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-left transition',
                      formData.visibility === option.key
                        ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400/70 dark:bg-indigo-500/10'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    )}
                  >
                    <option.icon className="mb-2 h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <p className="font-semibold text-gray-900 dark:text-white">{option.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">기술 스택</p>
              <div className="mt-2">
                <TagInput
                  tags={formData.techStack}
                  onChange={(techStack: string[]) => setFormData((prev) => ({ ...prev, techStack }))}
                  placeholder="기술 스택 입력 (Enter)"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">팀 인사이트</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">역할 충원 현황</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {teamInsights.totalFilled}/{teamInsights.totalNeeded} 채워짐
              </span>
              <Button size="sm" variant="outline" onClick={handlePositionSave}>
                포지션 저장
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400">총 충원</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{teamInsights.totalFilled}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400">남은 자리</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {teamInsights.totalNeeded - teamInsights.totalFilled}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400">모집 역할</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{teamInsights.openRoles.length}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900">
            <label className="flex flex-col text-left text-gray-700 dark:text-gray-300">
              총 정원 목표
              <input
                type="number"
                min={teamInsights.totalFilled}
                value={totalHeadcountTarget}
                onChange={(event) => setTotalHeadcountTarget(Number(event.target.value))}
                className="mt-1 w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
            <Button
              size="sm"
              onClick={() => handleHeadcountTargetApply(Number(totalHeadcountTarget))}
              disabled={Number.isNaN(totalHeadcountTarget)}
            >
              총 인원 반영
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              현재 충원 {teamInsights.totalFilled}명을 기준으로 하향 조정할 수 없습니다.
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {positionPlan.map((role, index) => (
              <div
                key={role.id || index}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <label className="flex-1 text-xs text-gray-500 dark:text-gray-400">
                    모집 분야 이름
                    <input
                      type="text"
                      value={role.title || ''}
                      onChange={(event) => handlePositionMetaChange(role.id, { title: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="예: Developer · Frontend"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">ID: {role.id.slice(0, 6)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePositionArea(role.id)}
                      className="rounded-full border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <label className="flex flex-col">
                    역할 구분
                    <select
                      value={role.role}
                      onChange={(event) => handlePositionMetaChange(role.id, { role: event.target.value as Position['role'] })}
                      className="mt-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col">
                    전문 분야
                    <input
                      list={`specialization-${role.id}`}
                      value={role.specialization || ''}
                      onChange={(event) => handlePositionMetaChange(role.id, { specialization: event.target.value })}
                      className="mt-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Frontend / Backend"
                    />
                    <datalist id={`specialization-${role.id}`}>
                      {specializationPresets.map((preset) => (
                        <option key={preset} value={preset} />
                      ))}
                    </datalist>
                  </label>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <div>
                    <p>역할 총원</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePositionAdjust(role.id, 'count', -1)}
                        className="rounded-full border border-gray-300 p-1 text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        min={getFilledCount(role)}
                        value={role.count}
                        onChange={(event) => handlePositionInputChange(role.id, event.target.value)}
                        className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-center font-semibold text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => handlePositionAdjust(role.id, 'count', 1)}
                        className="rounded-full border border-gray-300 p-1 text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                      총 정원 {role.count}명
                    </p>
                  </div>
                  <div>
                    <p>현재 팀원</p>
                    <div className="mt-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-center font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                      {getFilledCount(role)}명
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                      부족 인원 {Math.max(role.count - getFilledCount(role), 0)}명
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="ghost" onClick={handleAddPositionArea}>
              + 모집 분야 추가
            </Button>
          </div>
          {teamInsights.bottleneck && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              가장 긴급: {teamInsights.bottleneck.position.title || teamInsights.bottleneck.position.role} (
              {Math.max(teamInsights.bottleneck.position.count - teamInsights.bottleneck.filled, 0)}자리 미충원)
            </p>
          )}
        </Card>

        <Card className="p-6">
          <SectionHeader
            eyebrow="환경 변수"
            title="시크릿 & 백업"
            description={`${envSecrets.owner || '보안 담당'} · 마지막 회전 ${
              envSecrets.lastRotatedAt ? new Date(envSecrets.lastRotatedAt).toLocaleString('ko-KR') : '기록 없음'
            }`}
            actions={
              <Button size="sm" variant="outline" onClick={handleRotateSecrets}>
                시크릿 회전
              </Button>
            }
          />
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400">대기 중 재발급</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {envSecrets.pendingRenewals ?? 0}건
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400">연동 대상</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {(envSecrets.integrations ?? ['AWS Secrets Manager']).map((integration) => (
                  <span
                    key={integration}
                    className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            일 1회 자동 백업 {backupsEnabled ? '활성화됨' : '비활성화'} · 볼트 소유자 {envSecrets.owner || '미지정'}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">배포 · 워크플로</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleApplyToRepos}>
                전체 리포에 적용
              </Button>
              <Button size="sm" variant="outline" onClick={handleWorkflowSave}>
                저장
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-4 text-sm">
            <label className="block text-gray-700 dark:text-gray-300">
              릴리즈 채널
              <select
                value={releaseChannel}
                onChange={(event) => setReleaseChannel(event.target.value as ReleaseChannelValue)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              >
                {releaseChannelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} · {option.helper}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-gray-700 dark:text-gray-300">
              기본 브랜치
              <select
                value={defaultBranch}
                onChange={(event) => setDefaultBranch(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              >
                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">배포 리전</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {regionOptions.map((region) => {
                  const selected = deploymentRegions.includes(region);
                  return (
                    <button
                      key={region}
                      onClick={() => handleRegionToggle(region)}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        selected
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                      )}
                    >
                      {region}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-100 dark:divide-gray-700 dark:border-gray-800">
              {[
                {
                  label: '코드 오너 리뷰 필수',
                  description: '코드 오너 Approve 없이는 머지 불가',
                  value: codeOwnerReview,
                  onChange: setCodeOwnerReview,
                },
                {
                  label: '디자인 파일 동기화',
                  description: 'Figma 프레임 변경 시 알림',
                  value: designSync,
                  onChange: setDesignSync,
                },
                {
                  label: '자동 백업',
                  description: 'DB를 하루 1회 스냅샷',
                  value: backupsEnabled,
                  onChange: setBackupsEnabled,
                },
              ].map((item) => (
                <label
                  key={item.label}
                  className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs">{item.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={(event) => item.onChange(event.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">통합 · 알림</h3>
            <Button size="sm" variant="outline" onClick={handleIntegrationSave}>
              동기화
            </Button>
          </div>
          <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Slack 알림</p>
                  <p className="text-xs">#deployments 채널에 배포 로그 전송</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                  연결됨
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">이메일 리포트</p>
                  <p className="text-xs">일간 배포/이슈 현황 리포트</p>
                </div>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                  준비 중
                </span>
              </div>
            </div>
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">완료 이슈 자동 닫기</p>
                <p className="text-xs">PR 머지 시 연결된 이슈를 닫습니다</p>
              </div>
              <input
                type="checkbox"
                checked={autoCloseTickets}
                onChange={(event) => setAutoCloseTickets(event.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </label>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">감사 로그</p>
              <div className="mt-2 space-y-3">
                {auditTrail.map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{entry.actor}</p>
                    </div>
                    <span className="text-xs text-gray-400">{entry.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 멤버 관리 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            멤버 관리
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {project.members.length}명
          </span>
        </div>

        {/* 멤버 초대 */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            새 멤버 초대
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="이메일 주소"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button onClick={handleInviteMember}>
              <UserPlus className="w-4 h-4 mr-2" />
              초대
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            초대 이메일이 전송됩니다. (백엔드 구현 후 지원)
          </p>
        </div>

        {/* 멤버 목록 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  멤버
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  권한
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {project.members.map((member) => {
                const user = getUserById(member.userId);
                if (!user) return null;

                return (
                  <tr key={member.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {member.position}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleChangeRole(member.userId, e.target.value as any)
                        }
                        disabled={member.role === 'owner'}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(member.joinedAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      {member.role !== 'owner' && (
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          제거
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 위험 영역 */}
      <Card className="p-6 border-2 border-red-200 dark:border-red-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              위험 영역
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              이 작업은 되돌릴 수 없습니다
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">프로젝트 아카이브</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                프로젝트를 읽기 전용 상태로 보관합니다
              </p>
            </div>
            <Button variant="secondary" onClick={handleArchive}>
              <Archive className="w-4 h-4 mr-2" />
              아카이브
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">프로젝트 삭제</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                프로젝트와 모든 데이터를 영구적으로 삭제합니다
              </p>
            </div>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectSettingsPage;
