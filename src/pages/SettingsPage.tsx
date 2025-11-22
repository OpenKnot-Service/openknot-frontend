import { useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import UserAvatar from '../components/ui/UserAvatar';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Globe,
  Shield,
  User,
  CreditCard,
  CalendarClock,
  Smartphone,
  Mail,
  MessageSquare,
  AlarmClock,
  ShieldCheck,
  Settings2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SectionHeader } from '../components/ui/SectionHeader';

type Language = 'ko' | 'en';
type NotificationSettings = {
  taskAssigned: boolean;
  prRequested: boolean;
  issueCreated: boolean;
  message: boolean;
  invite: boolean;
};
type NotificationChannelKey = 'email' | 'push' | 'slack';

const timezoneOptions = [
  { value: 'Asia/Seoul', label: 'UTC+09:00 · 서울' },
  { value: 'America/Los_Angeles', label: 'UTC-08:00 · 샌프란시스코' },
  { value: 'Europe/Berlin', label: 'UTC+01:00 · 베를린' },
] as const;

const recentLoginActivity = [
  { device: 'MacBook Pro · Chrome', location: 'Seoul, KR', timestamp: '오늘 09:12', status: 'success' },
  { device: 'Pixel 8 · Chrome', location: 'Tokyo, JP', timestamp: '어제 22:48', status: 'success' },
  { device: 'Windows · Edge', location: 'Unknown', timestamp: '3일 전', status: 'blocked' },
] as const;

const notificationChannelOptions: Array<{
  key: NotificationChannelKey;
  label: string;
  icon: typeof Mail;
  helper: string;
}> = [
  { key: 'email', label: '이메일', icon: Mail, helper: '최우선 채널' },
  { key: 'push', label: '푸시', icon: Smartphone, helper: '모바일/데스크톱' },
  { key: 'slack', label: 'Slack', icon: MessageSquare, helper: '연동된 워크스페이스' },
];

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const { user, isUserLoading } = useApp();

  const [language, setLanguage] = useState<Language>('ko');
  const [timezone, setTimezone] = useState<(typeof timezoneOptions)[number]['value']>('Asia/Seoul');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    taskAssigned: true,
    prRequested: true,
    issueCreated: true,
    message: true,
    invite: true,
  });
  const [notificationChannels, setNotificationChannels] = useState<Record<NotificationChannelKey, boolean>>({
    email: true,
    push: true,
    slack: false,
  });
  const [quietHours, setQuietHours] = useState({ enabled: false, start: '22:00', end: '08:00' });
  const [betaFeatures, setBetaFeatures] = useState(true);
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState(8);
  const [deviceApprovals, setDeviceApprovals] = useState(true);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // TODO: i18n 라이브러리와 연동
    showToast(
      newLanguage === 'ko' ? '언어가 한국어로 변경되었습니다.' : 'Language changed to English.',
      'success'
    );
  };

  const handleSaveNotifications = () => {
    console.log('Notification settings updated:', {
      notifications,
      notificationChannels,
      quietHours,
    });
    showToast('알림 설정이 저장되었습니다.', 'success');
  };

  const handlePreferenceSave = () => {
    showToast('언어 및 지역 설정이 저장되었습니다.', 'success');
  };

  const handleRegenerateCodes = () => {
    setBackupCodes(10);
    showToast('새로운 백업 코드가 생성되었습니다.', 'success');
  };

  const membershipDays = useMemo(() => {
    if (!user?.createdAt) return '—';
    const diff = Date.now() - user.createdAt.getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [user]);

  if (isUserLoading && !user) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-gray-600 dark:text-gray-300">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 text-gray-600 dark:text-gray-300">
        사용자 정보가 없습니다. 다시 로그인해주세요.
      </div>
    );
  }

  const workspaceStats = useMemo(
    () => [
      { label: '참여 프로젝트', value: '12' },
      { label: '소속 팀', value: '4' },
      { label: '자동화 룰', value: '8' },
    ],
    []
  );

  const planName = 'Pro 플랜';
  const billingCycle = '월 19,000원';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">설정</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          계정 및 애플리케이션 설정을 관리합니다.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-500 p-6 text-white shadow-lg lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar name={user?.name ?? '사용자'} size="lg" className="ring-2 ring-white/40" />
              <div>
                <p className="text-sm uppercase tracking-wide text-white/80">계정 소유자</p>
                <h2 className="text-2xl font-semibold">{user?.name ?? '로그인이 필요합니다'}</h2>
                <p className="text-sm text-white/75">{user?.email ?? ''}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs text-white/80">
                  <User className="h-3.5 w-3.5" />
                  워크스페이스 관리자
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wide text-white/70">플랜</span>
              <div className="mt-1 flex flex-col items-end">
                <span className="text-lg font-semibold">{planName}</span>
                <span className="text-sm text-white/80">{billingCycle}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {workspaceStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-white/80">
              <CalendarClock className="h-4 w-4" />
              가입 {membershipDays}일차
            </span>
            <Button
              variant="secondary"
              onClick={() => showToast('프로필 편집은 추후 제공 예정입니다.', 'info')}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              프로필 관리
            </Button>
            <Button
              onClick={() => showToast('결제 관리는 추후 제공 예정입니다.', 'info')}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              청구 관리
            </Button>
            <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs text-white/80">
              <CreditCard className="h-4 w-4" />
              자동 결제 활성화
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <SectionHeader
            eyebrow="빠른 설정"
            title="환경 설정 스냅샷"
            description="자주 변경하는 옵션을 빠르게 토글하세요"
            actions={<Settings2 className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
          />
          <div className="mt-5 space-y-4">
            <PreferenceToggle
              label="베타 기능 조기 접속"
              description="신규 기능을 누구보다 먼저 사용합니다"
              checked={betaFeatures}
              onChange={setBetaFeatures}
            />
            <PreferenceToggle
              label="자동 업데이트"
              description="새 릴리즈가 있을 때 자동으로 적용"
              checked={autoUpdates}
              onChange={setAutoUpdates}
            />
            <PreferenceToggle
              label="신규 기기 승인 필요"
              description="새 장치에서 로그인 시 승인 요청"
              checked={deviceApprovals}
              onChange={setDeviceApprovals}
            />
          </div>
        </div>
      </section>

      <Card className="p-6">
        <SectionHeader
          eyebrow="디스플레이"
          title="테마 설정"
          description="화면 표시 스타일을 즉시 전환합니다"
          actions={
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 border-2 rounded-lg transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-center font-medium text-gray-900 dark:text-white">라이트</p>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 border-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-center font-medium text-gray-900 dark:text-white">다크</p>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 border-2 rounded-lg transition-all ${
              theme === 'system'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
            <p className="text-center font-medium text-gray-900 dark:text-white">시스템</p>
          </button>
        </div>
      </Card>

      {/* 알림 설정 */}
      <Card className="p-6">
        <SectionHeader
          eyebrow="알림"
          title="알림 설정"
          description="채널과 이벤트 단위로 수신 범위를 제어하세요"
          actions={
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          }
        />

        <div className="grid gap-3 sm:grid-cols-3">
          {notificationChannelOptions.map((channel) => {
            const Icon = channel.icon;
            const isActive = notificationChannels[channel.key];
            return (
              <button
                key={channel.key}
                onClick={() =>
                  setNotificationChannels((prev) => ({
                    ...prev,
                    [channel.key]: !prev[channel.key],
                  }))
                }
                className={cn(
                  'flex flex-col rounded-2xl border p-4 text-left transition',
                  isActive
                    ? 'border-green-200 bg-green-50 dark:border-green-700/60 dark:bg-green-700/10'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4', isActive ? 'text-green-600' : 'text-gray-500')} />
                  <span className="font-semibold text-gray-900 dark:text-white">{channel.label}</span>
                </div>
                <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{channel.helper}</span>
                <span
                  className={cn(
                    'mt-3 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                    isActive
                      ? 'bg-green-600/10 text-green-700 dark:bg-green-500/20 dark:text-green-200'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  )}
                >
                  {isActive ? '활성화됨' : '비활성화'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <AlarmClock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p className="font-semibold text-gray-900 dark:text-white">방해 금지 모드</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                지정한 시간에는 알림을 일시적으로 음소거합니다
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{quietHours.enabled ? '사용 중' : '해제'}</span>
              <input
                type="checkbox"
                checked={quietHours.enabled}
                onChange={(event) =>
                  setQuietHours((prev) => ({ ...prev, enabled: event.target.checked }))
                }
                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </label>
          </div>
          {quietHours.enabled && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                시작
                <input
                  type="time"
                  value={quietHours.start}
                  onChange={(event) =>
                    setQuietHours((prev) => ({ ...prev, start: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
              </label>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                종료
                <input
                  type="time"
                  value={quietHours.end}
                  onChange={(event) =>
                    setQuietHours((prev) => ({ ...prev, end: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {[
            {
              key: 'taskAssigned',
              title: 'Task 할당',
              description: '새로운 Task가 할당되면 알림을 받습니다',
            },
            {
              key: 'prRequested',
              title: 'PR 리뷰 요청',
              description: 'Pull Request 리뷰 요청 시 알림을 받습니다',
            },
            {
              key: 'issueCreated',
              title: '이슈 생성',
              description: '새로운 이슈가 생성되면 알림을 받습니다',
            },
            {
              key: 'message',
              title: '메시지',
              description: '새로운 메시지를 받으면 알림을 받습니다',
            },
            {
              key: 'invite',
              title: '프로젝트 초대',
              description: '프로젝트 초대를 받으면 알림을 받습니다',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-3 transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof NotificationSettings]}
                onChange={(event) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: event.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            기본 채널: {Object.entries(notificationChannels)
              .filter(([, enabled]) => enabled)
              .map(([key]) => notificationChannelOptions.find((opt) => opt.key === key)?.label)
              .filter(Boolean)
              .join(', ')}
          </p>
          <Button onClick={handleSaveNotifications}>
            알림 설정 저장
          </Button>
        </div>
      </Card>

      {/* 언어 설정 */}
      <Card className="p-6">
        <SectionHeader
          eyebrow="언어 및 지역"
          title="언어 설정"
          description="사용할 언어를 선택하세요"
          actions={
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleLanguageChange('ko')}
            className={`p-4 border-2 rounded-lg transition-all text-left ${
              language === 'ko'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <p className="font-medium text-gray-900 dark:text-white">한국어</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Korean</p>
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-4 border-2 rounded-lg transition-all text-left ${
              language === 'en'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <p className="font-medium text-gray-900 dark:text-white">English</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">영어</p>
          </button>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            기본 시간대
            <select
              value={timezone}
              onChange={(event) =>
                setTimezone(event.target.value as (typeof timezoneOptions)[number]['value'])
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Workspace 전반의 날짜/시간 표시에 적용됩니다.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            UI 텍스트 언어와 시간대가 즉시 반영됩니다.
          </span>
          <Button variant="outline" onClick={handlePreferenceSave}>
            언어/지역 저장
          </Button>
        </div>
      </Card>

      {/* 보안 설정 */}
      <Card className="p-6">
        <SectionHeader
          eyebrow="보안"
          title="보안 설정"
          description="계정 보안을 강화하세요"
          actions={
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          }
        />

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">2단계 인증 (권장)</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                OTP 앱 또는 SMS 코드로 로그인을 보호합니다
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{mfaEnabled ? '사용 중' : '해제'}</span>
              <input
                type="checkbox"
                checked={mfaEnabled}
                onChange={(event) => setMfaEnabled(event.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </label>
          </div>
          {mfaEnabled ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                MFA 활성화됨
              </span>
              <span>남은 백업 코드 {backupCodes}개</span>
              <Button size="sm" variant="outline" onClick={handleRegenerateCodes}>
                백업 코드 재생성
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="mt-4"
              onClick={() => showToast('백엔드 연동 후 MFA 설정을 지원합니다.', 'info')}
            >
              MFA 설정 시작
            </Button>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => showToast('백엔드 구현 후 지원될 기능입니다.', 'info')}
            className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="font-semibold text-gray-900 dark:text-white">비밀번호 변경</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">정기적으로 비밀번호를 교체하세요</p>
          </button>
          <button
            onClick={() => showToast('백엔드 구현 후 지원될 기능입니다.', 'info')}
            className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="font-semibold text-gray-900 dark:text-white">로그인 알림</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">새로운 기기 접근 시 알림을 받습니다</p>
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">최근 로그인 기록</h3>
          <div className="mt-3 space-y-3">
            {recentLoginActivity.map((entry) => (
              <div
                key={`${entry.device}-${entry.timestamp}`}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/70 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{entry.device}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {entry.location} · {entry.timestamp}
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
                    entry.status === 'success'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {entry.status === 'success' ? '정상' : '차단'}
                </span>
              </div>
            ))}
          </div>
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

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => showToast('데이터 백업은 추후 제공 예정입니다.', 'info')}
          >
            데이터 내보내기
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                showToast('백엔드 구현 후 지원될 기능입니다.', 'info');
              }
            }}
          >
            계정 삭제
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface PreferenceToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function PreferenceToggle({ label, description, checked, onChange }: PreferenceToggleProps) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-3 transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
      />
    </label>
  );
}

export default SettingsPage;
