import { ComponentType, useMemo, useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useProjectOutletContext } from '../components/layout/ProjectLayout';
import { cn } from '../lib/utils';

type TrendDirection = 'up' | 'down' | 'stable';
type MetricTone = 'default' | 'warning' | 'danger' | 'success';

interface SecurityMetricProps {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  trend: TrendDirection;
  trendLabel: string;
  tone?: MetricTone;
}

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface VulnerabilityItemProps {
  severity: Severity;
  cveId: string;
  title: string;
  package: string;
  description: string;
  fixVersion: string;
  publishedDate: string;
  affectedProjects: string[];
}

interface RecommendationItemProps {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

interface ScanHistoryItemProps {
  date: string;
  vulnerabilities: number;
  status: 'completed' | 'in_progress' | 'failed';
}

const scanFrequencies = [
  { label: '실시간 (10분)', value: '10m', helper: '10분마다 자동 스캔' },
  { label: '매일 02:00', value: 'daily', helper: '매일 새벽 자동 스캔' },
  { label: '매주 월요일', value: 'weekly', helper: '매주 월요일 02:00' },
] as const;

const scanModeOptions = [
  { value: 'live', label: '실시간 방어', helper: '트래픽 상시 감시' },
  { value: 'scheduled', label: '예약 스캔', helper: '설정된 주기' },
  { value: 'manual', label: '수동 모드', helper: '필요 시 직접 실행' },
] as const;
type ScanMode = (typeof scanModeOptions)[number]['value'];

const riskTrendData = [
  { label: '01-17', total: 22, critical: 4 },
  { label: '01-18', total: 20, critical: 4 },
  { label: '01-19', total: 18, critical: 3 },
  { label: '01-20', total: 15, critical: 3 },
] as const;

const remediationProgressData = [
  { label: 'Critical 패치', completion: 62, eta: '2일 내 처리' },
  { label: 'High 패치', completion: 48, eta: '5일 내 처리' },
  { label: '중요 패키지 업데이트', completion: 35, eta: '7일 내 처리' },
] as const;

const coverageMetrics = [
  { label: '런타임 보호', value: 82, helper: 'IDS/IPS 커버리지', tone: 'warning' as MetricTone },
  { label: '비밀 관리', value: 94, helper: 'kms/secret scan', tone: 'success' as MetricTone },
  { label: '의존성 보안', value: 68, helper: 'SBOM 스캔', tone: 'danger' as MetricTone },
] as const;

const liveThreatFeed = [
  {
    id: 'ALR-9283',
    source: 'Runtime IDS',
    severity: 'critical' as Severity,
    description: 'Production 컨테이너에서 권한 상승 시도가 차단되었습니다.',
    timestamp: '1분 전',
    status: '차단',
  },
  {
    id: 'ALR-9274',
    source: 'WAF',
    severity: 'high' as Severity,
    description: 'API Gateway에서 다수의 SQLi 패턴이 감지되었습니다.',
    timestamp: '12분 전',
    status: '모니터링',
  },
  {
    id: 'ALR-9251',
    source: 'Dependency Bot',
    severity: 'medium' as Severity,
    description: 'react-dom 18.2에서 잠재적 메모리 누수 취약점이 보고되었습니다.',
    timestamp: '32분 전',
    status: '패치 예정',
  },
] as const;

export default function SecurityPage() {
  const { showToast } = useToast();
  const { project } = useProjectOutletContext();
  const [scanMode, setScanMode] = useState<ScanMode>('live');
  const [scanFrequency, setScanFrequency] = useState<(typeof scanFrequencies)[number]['value']>('daily');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | Severity>('all');
  const [lastScan, setLastScan] = useState('2024-01-20 14:30');

  const securityMetrics: SecurityMetricProps[] = [
    {
      label: '총 스캔 항목',
      value: '245',
      icon: Shield,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      trend: 'stable',
      trendLabel: '변동 없음',
      tone: 'default',
    },
    {
      label: '위험 취약점',
      value: '3',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      trend: 'down',
      trendLabel: '전주 대비 -1',
      tone: 'danger',
    },
    {
      label: '경고',
      value: '12',
      icon: Info,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      trend: 'up',
      trendLabel: '전주 대비 +2',
      tone: 'warning',
    },
    {
      label: '안전',
      value: '230',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      trend: 'up',
      trendLabel: '전주 대비 +5',
      tone: 'success',
    },
  ];

  const aiInsights = [
    {
      title: '우선 조치 필요',
      description: 'Express.js 4.17.1의 CVE-2024-1234 취약점이 발견되었습니다. 즉시 업데이트를 권장합니다.',
    },
    {
      title: '보안 개선 제안',
      description: '현재 사용 중인 npm 패키지 12개에서 구 버전이 감지되었습니다. 정기적인 업데이트를 권장합니다.',
    },
  ];

  const vulnerabilities: VulnerabilityItemProps[] = [
    {
      severity: 'critical',
      cveId: 'CVE-2024-1234',
      title: 'Express.js Remote Code Execution',
      package: 'express@4.17.1',
      description: '원격 코드 실행 취약점이 발견되었습니다. 공격자가 임의의 코드를 실행할 수 있습니다.',
      fixVersion: '4.18.0',
      publishedDate: '2024-01-15',
      affectedProjects: ['OpenKnot Backend', 'API Gateway'],
    },
    {
      severity: 'high',
      cveId: 'CVE-2024-5678',
      title: 'React XSS Vulnerability',
      package: 'react@17.0.2',
      description: '크로스 사이트 스크립팅(XSS) 취약점이 발견되었습니다.',
      fixVersion: '17.0.3',
      publishedDate: '2024-01-10',
      affectedProjects: ['OpenKnot Frontend'],
    },
    {
      severity: 'medium',
      cveId: 'CVE-2024-9012',
      title: 'Axios SSRF Vulnerability',
      package: 'axios@0.21.1',
      description: '서버 측 요청 위조(SSRF) 취약점이 발견되었습니다.',
      fixVersion: '0.21.2',
      publishedDate: '2024-01-05',
      affectedProjects: ['OpenKnot Backend'],
    },
    {
      severity: 'low',
      cveId: 'CVE-2024-3456',
      title: 'Lodash Prototype Pollution',
      package: 'lodash@4.17.19',
      description: '프로토타입 오염 취약점이 발견되었습니다.',
      fixVersion: '4.17.21',
      publishedDate: '2023-12-28',
      affectedProjects: ['OpenKnot Backend', 'OpenKnot Frontend'],
    },
  ];

  const recommendations: RecommendationItemProps[] = [
    {
      priority: 'high',
      title: '의존성 업데이트',
      description: '12개의 오래된 패키지를 최신 버전으로 업데이트하세요',
    },
    {
      priority: 'medium',
      title: '보안 헤더 설정',
      description: 'CORS, CSP, HSTS 등 보안 헤더를 적절히 설정하세요',
    },
    {
      priority: 'medium',
      title: '환경 변수 암호화',
      description: '민감한 정보는 환경 변수로 관리하고 암호화하세요',
    },
    {
      priority: 'low',
      title: '코드 정적 분석',
      description: '정기적으로 SAST 도구를 활용한 코드 분석을 수행하세요',
    },
  ];

const scanHistory: ScanHistoryItemProps[] = [
    { date: '2024-01-20 14:30', vulnerabilities: 15, status: 'completed' },
    { date: '2024-01-19 14:30', vulnerabilities: 18, status: 'completed' },
    { date: '2024-01-18 14:30', vulnerabilities: 20, status: 'completed' },
    { date: '2024-01-17 14:30', vulnerabilities: 22, status: 'completed' },
];

  const severityCounts = useMemo(
    () =>
      vulnerabilities.reduce(
        (acc, vuln) => {
          acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
          return acc;
        },
        { critical: 0, high: 0, medium: 0, low: 0 } as Record<Severity, number>
      ),
    [vulnerabilities]
  );

  const severityFilters = [
    { label: '전체', value: 'all', count: vulnerabilities.length },
    { label: 'Critical', value: 'critical', count: severityCounts.critical },
    { label: 'High', value: 'high', count: severityCounts.high },
    { label: 'Medium', value: 'medium', count: severityCounts.medium },
    { label: 'Low', value: 'low', count: severityCounts.low },
  ] as const;

  const filteredVulnerabilities = useMemo(() => {
    if (selectedSeverity === 'all') {
      return vulnerabilities;
    }
    return vulnerabilities.filter((v) => v.severity === selectedSeverity);
  }, [vulnerabilities, selectedSeverity]);

  const selectedFrequency = scanFrequencies.find((freq) => freq.value === scanFrequency);

  const nextScanCopy =
    scanMode === 'manual'
      ? '수동 모드 · 직접 실행 필요'
      : scanMode === 'live'
        ? '실시간 감시 중'
        : selectedFrequency?.helper ?? '';

  const handleManualScan = () => {
    const timestamp = new Date().toLocaleString('ko-KR', {
      hour12: false,
    });
    setLastScan(timestamp);
    showToast('보안 스캔을 실행했습니다', 'success');
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name} 보안</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          CVE/NVD 최신 취약점을 자동 수집하고 프로젝트 의존성과 매칭합니다
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 text-white shadow-lg dark:border-gray-700 lg:col-span-2">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">보안 상태</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl font-bold">주의 필요</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  위험 취약점 3건
                </span>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  {scanMode === 'live'
                    ? '실시간 탐지'
                    : scanMode === 'scheduled'
                      ? '예약 스캔'
                      : '수동 모드'}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/70">
                마지막 스캔 {lastScan} · {nextScanCopy}
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-white/80">
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">
                    스캔 모드
                  </span>
                  <div className="flex rounded-full bg-white/10 p-1 text-[13px] font-semibold">
                    {scanModeOptions.map((mode) => {
                      const active = scanMode === mode.value;
                      return (
                        <button
                          key={mode.value}
                          onClick={() => setScanMode(mode.value)}
                          className={cn(
                            'flex min-w-[110px] flex-col rounded-full px-3 py-1 text-left transition',
                            active
                              ? 'bg-white text-gray-900'
                              : 'text-white/70 hover:text-white'
                          )}
                        >
                          <span>{mode.label}</span>
                          <span className="text-[10px] font-normal text-white/60">{mode.helper}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <label className="flex flex-col text-[11px] font-semibold uppercase tracking-wide text-white/60">
                  실행 주기
                  <select
                    disabled={scanMode !== 'scheduled'}
                    value={scanFrequency}
                    onChange={(event) =>
                      setScanFrequency(event.target.value as (typeof scanFrequencies)[number]['value'])
                    }
                    className={cn(
                      'mt-1 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none transition',
                      scanMode !== 'scheduled' && 'opacity-50'
                    )}
                  >
                    {scanFrequencies.map((frequency) => (
                      <option key={frequency.value} value={frequency.value} className="text-gray-900">
                        {frequency.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleManualScan}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  지금 스캔
                </button>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  AI 추천 패치 4건 대기
                </span>
              </div>
              {scanMode === 'manual' && (
                <p className="text-xs text-white/70">
                  수동 모드에서는 필요 시 직접 스캔을 실행하세요.
                </p>
              )}
            </div>
          </div>
        </div>

        <RiskTrendCard data={riskTrendData} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {securityMetrics.map((metric) => (
          <SecurityMetric key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">보호 커버리지</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">방어 영역별 점검 현황</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">취약 구역을 우선 순위로 리밸런스하세요</p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              평균 {Math.round(coverageMetrics.reduce((acc, metric) => acc + metric.value, 0) / coverageMetrics.length)}%
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {coverageMetrics.map((metric) => (
              <SecurityCoverageGauge key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-slate-900 via-slate-900 to-gray-900 p-6 text-white shadow-lg dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">실시간 위협 피드</p>
              <h2 className="text-xl font-semibold">AI 보호벽 이벤트</h2>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/80">
              최근 1시간
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {liveThreatFeed.map((item) => (
              <ThreatFeedItem key={item.id} {...item} />
            ))}
          </div>
          <p className="mt-4 text-xs text-white/70">
            위협 피드는 WAF · Runtime IDS · SBOM Bot 데이터를 통합하여 우선순위를 계산합니다.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-orange-500 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI 보안 인사이트</h2>
              <p className="text-sm text-white/80">긴급 대응이 필요한 이슈를 AI가 선별합니다</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {aiInsights.map((insight) => (
            <div
              key={insight.title}
              className="rounded-xl border border-white/30 bg-white/15 p-4 text-sm leading-relaxed backdrop-blur"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-white/80">
                {insight.title}
              </div>
              <p className="mt-2 text-white">{insight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">취약점 목록</h2>
          <button
            onClick={() => showToast('취약점 스캔을 시작합니다', 'info')}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            전체 스캔 실행
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pb-4">
          {severityFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedSeverity(filter.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                selectedSeverity === filter.value
                  ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                  : 'border-gray-200 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
              )}
            >
              {filter.label}
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{filter.count}</span>
            </button>
          ))}
        </div>
        <div className="space-y-5">
          {filteredVulnerabilities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              선택한 심각도에 해당하는 취약점이 없습니다.
            </div>
          ) : (
            filteredVulnerabilities.map((vulnerability) => (
              <VulnerabilityItem key={vulnerability.cveId} {...vulnerability} />
            ))
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">보안 권장사항</h2>
          <div className="space-y-3">
            {recommendations.map((recommendation) => (
              <RecommendationItem key={recommendation.title} {...recommendation} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">보안 스캔 히스토리</h2>
          <div className="space-y-3">
            {scanHistory.map((history) => (
              <ScanHistoryItem key={history.date} {...history} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">패치 진행 상황</h2>
          <div className="space-y-4">
            {remediationProgressData.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{item.label}</span>
                  <span className="text-gray-500 dark:text-gray-400">{item.eta}</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all"
                    style={{ width: `${item.completion}%` }}
                  />
                </div>
                <div className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {item.completion}% 완료
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

interface RiskTrendCardProps {
  data: readonly { label: string; total: number; critical: number }[];
}

function RiskTrendCard({ data }: RiskTrendCardProps) {
  if (data.length === 0) {
    return null;
  }

  const width = 100;
  const height = 48;
  const maxTotal = Math.max(...data.map((point) => point.total));
  const scaleX = width / (data.length - 1 || 1);
  const scaleY = height / (maxTotal || 1);

  const areaPoints = data
    .map((point, index) => {
      const x = index * scaleX;
      const y = height - point.total * scaleY;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const criticalLine = data
    .map((point, index) => {
      const x = index * scaleX;
      const y = height - point.critical * scaleY;
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const latest = data[data.length - 1];
  const delta = latest.total - data[0].total;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            위험 추세
          </p>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{latest.total}건</div>
          <div className={cn('text-sm font-semibold', delta <= 0 ? 'text-emerald-500' : 'text-rose-500')}>
            {delta > 0 ? `+${delta}` : delta} 지난 3일
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
          <div>Critical {latest.critical}건</div>
          <div className="mt-1">총 {data.reduce((acc, point) => acc + point.total, 0)}건(4일)</div>
        </div>
      </div>
      <div className="mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trend-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${areaPoints} L ${width},${height} L 0,${height} Z`} fill="url(#trend-gradient)" />
          <path d={areaPoints} fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" />
          <path d={criticalLine} fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
          {data.map((point, index) => {
            const x = index * scaleX;
            const y = height - point.total * scaleY;
            return <circle key={point.label} cx={x} cy={y} r="1.5" fill="#fb7185" />;
          })}
        </svg>
        <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {data.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecurityMetric({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendLabel,
  tone = 'default',
}: SecurityMetricProps) {
  const trendConfig: Record<TrendDirection, { icon: ComponentType<{ className?: string }>; chipBg: string; chipColor: string }> = {
    up: { icon: TrendingUp, chipBg: 'bg-red-100 dark:bg-red-900/25', chipColor: 'text-red-700 dark:text-red-300' },
    down: { icon: TrendingDown, chipBg: 'bg-green-100 dark:bg-green-900/25', chipColor: 'text-green-700 dark:text-green-300' },
    stable: { icon: Minus, chipBg: 'bg-gray-200 dark:bg-gray-700/40', chipColor: 'text-gray-700 dark:text-gray-300' },
  };

  const TrendIcon = trendConfig[trend].icon;
  const toneConfig: Record<MetricTone, { border: string; surface: string; overlay: string }> = {
    default: {
      border: 'border-gray-100 dark:border-gray-700',
      surface: 'bg-white dark:bg-gray-800',
      overlay: 'from-gray-50/80 via-transparent to-transparent dark:from-gray-700/40',
    },
    warning: {
      border: 'border-amber-200/80 dark:border-amber-500/30',
      surface: 'bg-white dark:bg-gray-800',
      overlay: 'from-amber-100/60 via-transparent to-transparent dark:from-amber-500/20',
    },
    danger: {
      border: 'border-rose-200/80 dark:border-rose-500/30',
      surface: 'bg-white dark:bg-gray-800',
      overlay: 'from-rose-100/70 via-transparent to-transparent dark:from-rose-500/25',
    },
    success: {
      border: 'border-emerald-200/70 dark:border-emerald-500/30',
      surface: 'bg-white dark:bg-gray-800',
      overlay: 'from-emerald-100/60 via-transparent to-transparent dark:from-emerald-500/20',
    },
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md',
        toneConfig[tone].border,
        toneConfig[tone].surface
      )}
    >
      <div className={cn('pointer-events-none absolute inset-0 z-0 opacity-80 bg-gradient-to-br', toneConfig[tone].overlay)} />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trendConfig[trend].chipBg} ${trendConfig[trend].chipColor}`}>
            <TrendIcon className="h-4 w-4" />
            {trendLabel}
          </span>
        </div>
        <p className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function VulnerabilityItem({
  severity,
  cveId,
  title,
  package: pkg,
  description,
  fixVersion,
  publishedDate,
  affectedProjects,
}: VulnerabilityItemProps) {
  const severityConfig: Record<
    Severity,
    { surface: string; badge: string; iconBg: string; icon: JSX.Element }
  > = {
    critical: {
      surface: 'border-red-200 dark:border-red-800 bg-white dark:bg-gray-800',
      badge: 'bg-red-600 text-white',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-300" />,
    },
    high: {
      surface: 'border-orange-200 dark:border-orange-800 bg-white dark:bg-gray-800',
      badge: 'bg-orange-500 text-white',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-300" />,
    },
    medium: {
      surface: 'border-yellow-200 dark:border-yellow-800 bg-white dark:bg-gray-800',
      badge: 'bg-yellow-500 text-white',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      icon: <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />,
    },
    low: {
      surface: 'border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800',
      badge: 'bg-blue-500 text-white',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
    },
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md ${severityConfig[severity].surface}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${severityConfig[severity].iconBg}`}>
            {severityConfig[severity].icon}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${severityConfig[severity].badge}`}>
                {severity.toUpperCase()}
              </span>
              <a
                href={`https://nvd.nist.gov/vuln/detail/${cveId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                {cveId}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">{pkg}</span>
              <span className="hidden text-gray-300 dark:text-gray-600 sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {publishedDate}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">수정 버전</span>
              <span className="rounded-md bg-green-100 px-2 py-0.5 font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                {fixVersion}
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-[13rem]">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            영향 프로젝트
          </div>
          <div className="flex flex-wrap gap-2">
            {affectedProjects.map((project) => (
              <span
                key={project}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700/60 dark:text-gray-200"
              >
                {project}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
        <button className="rounded-lg bg-green-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-green-700">
          자동 수정
        </button>
        <button className="rounded-lg bg-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-900 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
          무시
        </button>
      </div>
    </div>
  );
}

function RecommendationItem({ priority, title, description }: RecommendationItemProps) {
  const priorityConfig: Record<
    RecommendationItemProps['priority'],
    { badge: string }
  > = {
    high: { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    medium: { badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    low: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${priorityConfig[priority].badge}`}>
        {priority.toUpperCase()}
      </span>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function ScanHistoryItem({ date, vulnerabilities, status }: ScanHistoryItemProps) {
  const statusConfig: Record<
    ScanHistoryItemProps['status'],
    { icon: ComponentType<{ className?: string }>; label: string; chipBg: string; iconColor: string }
  > = {
    completed: {
      icon: CheckCircle,
      label: '완료',
      chipBg: 'bg-green-100 dark:bg-green-900/25',
      iconColor: 'text-green-600 dark:text-green-300',
    },
    in_progress: {
      icon: Clock,
      label: '진행 중',
      chipBg: 'bg-blue-100 dark:bg-blue-900/25',
      iconColor: 'text-blue-600 dark:text-blue-300',
    },
    failed: {
      icon: XCircle,
      label: '실패',
      chipBg: 'bg-red-100 dark:bg-red-900/25',
      iconColor: 'text-red-600 dark:text-red-300',
    },
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${statusConfig[status].chipBg}`}>
          <StatusIcon className={`h-5 w-5 ${statusConfig[status].iconColor}`} />
        </span>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{date}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{statusConfig[status].label}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-900 dark:text-white">{vulnerabilities}</div>
      <div className="text-xs text-gray-600 dark:text-gray-400">취약점</div>
    </div>
  </div>
  );
}

interface SecurityCoverageGaugeProps {
  label: string;
  value: number;
  helper: string;
  tone: MetricTone;
}

function SecurityCoverageGauge({ label, value, helper, tone }: SecurityCoverageGaugeProps) {
  const toneConfig: Record<MetricTone, { accent: string; surface: string; text: string; valueText: string }> = {
    default: {
      accent: '#6366f1',
      surface: 'from-indigo-500/10',
      text: 'text-gray-900 dark:text-white',
      valueText: 'text-indigo-600 dark:text-indigo-200',
    },
    warning: {
      accent: '#f97316',
      surface: 'from-amber-500/10',
      text: 'text-amber-600 dark:text-amber-200',
      valueText: 'text-amber-600 dark:text-amber-100',
    },
    danger: {
      accent: '#ef4444',
      surface: 'from-rose-500/10',
      text: 'text-rose-600 dark:text-rose-200',
      valueText: 'text-rose-600 dark:text-rose-100',
    },
    success: {
      accent: '#10b981',
      surface: 'from-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-200',
      valueText: 'text-emerald-600 dark:text-emerald-100',
    },
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70', toneConfig[tone].surface)} />
      <div className="relative flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${toneConfig[tone].accent} ${value * 3.6}deg, #e5e7eb 0deg)`,
            }}
          />
          <div
            className={cn(
              'absolute inset-2 flex items-center justify-center rounded-full bg-white text-lg font-semibold shadow-inner dark:bg-gray-950',
              toneConfig[tone].valueText
            )}
          >
            {value}%
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{helper}</p>
          <h3 className={cn('text-lg font-semibold', toneConfig[tone].text)}>{label}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {value >= 90 ? '안정' : value >= 75 ? '주의' : '개선 필요'}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ThreatFeedItemProps {
  id: string;
  source: string;
  severity: Severity;
  description: string;
  timestamp: string;
  status: string;
}

function ThreatFeedItem({ id, source, severity, description, timestamp, status }: ThreatFeedItemProps) {
  const severityConfig: Record<
    Severity,
    { border: string; chipBg: string; chipText: string; badge: string }
  > = {
    critical: {
      border: 'border-rose-500/40 bg-white/5',
      chipBg: 'bg-rose-500/20',
      chipText: 'text-rose-200',
      badge: 'bg-rose-500 text-white',
    },
    high: {
      border: 'border-orange-400/40 bg-white/5',
      chipBg: 'bg-orange-400/20',
      chipText: 'text-orange-100',
      badge: 'bg-orange-400 text-white',
    },
    medium: {
      border: 'border-amber-300/40 bg-white/5',
      chipBg: 'bg-amber-300/20',
      chipText: 'text-amber-100',
      badge: 'bg-amber-300 text-gray-900',
    },
    low: {
      border: 'border-emerald-300/40 bg-white/5',
      chipBg: 'bg-emerald-300/20',
      chipText: 'text-emerald-100',
      badge: 'bg-emerald-300 text-gray-900',
    },
  };

  return (
    <div className={cn('rounded-2xl border px-4 py-3 text-sm shadow-sm', severityConfig[severity].border)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{source}</p>
          <p className="mt-1 text-sm font-semibold text-white">{description}</p>
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', severityConfig[severity].badge)}>
          {status}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-white/70">
        <span className="font-mono text-xs text-white/60">{id}</span>
        <span>{timestamp}</span>
      </div>
      <span
        className={cn(
          'mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
          severityConfig[severity].chipBg,
          severityConfig[severity].chipText
        )}
      >
        {severity.toUpperCase()}
      </span>
    </div>
  );
}
