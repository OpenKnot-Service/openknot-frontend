import { useState, useMemo, useEffect } from 'react';
import { Cpu, HardDrive, Network, Clock, Server, Settings, RotateCw, AlertTriangle } from 'lucide-react';
import { useProjectOutletContext } from '../components/layout/ProjectLayout';
import { useToast } from '../contexts/ToastContext';
import { RepositorySelector } from '../components/deployment/RepositorySelector';
import { TimeRangeSelector } from '../components/monitoring/TimeRangeSelector';
import { MetricCard } from '../components/monitoring/MetricCard';
import { ResourceChart } from '../components/monitoring/ResourceChart';
import { AggregatedMetricsPanel } from '../components/monitoring/AggregatedMetricsPanel';
import { AlertHistoryPanel } from '../components/monitoring/AlertHistoryPanel';
import { ThresholdConfigPanel } from '../components/monitoring/ThresholdConfigPanel';
import { ExportMetricsButton } from '../components/monitoring/ExportMetricsButton';
import {
  getAllProjectMonitoring,
  getMonitoringMetrics,
  getAggregatedMetrics,
  getMonitoringAlerts,
  updateLiveMetrics,
} from '../lib/mockData';
import { TimeRange } from '../types';
import { cn } from '../lib/utils';

const REFRESH_INTERVAL_OPTIONS = [
  { label: '1초', value: 1000 },
  { label: '2초', value: 2000 },
  { label: '5초', value: 5000 },
  { label: '10초', value: 10000 },
  { label: '30초', value: 30000 },
];
const DEFAULT_REFRESH_INTERVAL = 5000;

const MONITORING_MODES = [
  { value: 'live', label: '실시간 모니터링', helper: '자동 새로고침' },
  { value: 'manual', label: '수동 모드', helper: '직접 새로고침' },
] as const;
type MonitoringMode = (typeof MONITORING_MODES)[number]['value'];

const RESOURCE_CHART_THRESHOLDS: Record<'cpu' | 'memory' | 'responseTime' | 'network' | 'disk', number> = {
  cpu: 80,
  memory: 80,
  responseTime: 200,
  network: 80,
  disk: 90,
};
type ResourceMetricKey = keyof typeof RESOURCE_CHART_THRESHOLDS;

const RESOURCE_LABELS: Record<ResourceMetricKey, string> = {
  cpu: 'CPU 사용률',
  memory: '메모리 사용률',
  responseTime: '응답 시간',
  network: '네트워크 I/O',
  disk: '디스크 사용률',
};

const RESOURCE_UNITS: Record<ResourceMetricKey, string> = {
  cpu: '%',
  memory: '%',
  responseTime: 'ms',
  network: 'MB/s',
  disk: '%',
};

const getResourceStatus = (value: number, threshold: number): 'normal' | 'warning' | 'critical' => {
  if (value >= threshold) return 'critical';
  if (value >= threshold * 0.85) return 'warning';
  return 'normal';
};

type ResourceAlert = {
  metric: ResourceMetricKey;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
};

const formatResourceValue = (metric: ResourceMetricKey, value: number) => {
  if (metric === 'responseTime') {
    return value.toFixed(0);
  }
  if (metric === 'network') {
    return value.toFixed(1);
  }
  return value.toFixed(1);
};

type ResourceBreachEvent = ResourceAlert & {
  timestamp: Date;
};

export default function MonitoringPage() {
  const { project } = useProjectOutletContext();
  const { showToast } = useToast();

  // Get all monitoring statuses for this project
  const monitoringStatuses = useMemo(
    () => getAllProjectMonitoring(project.id),
    [project.id]
  );

  // Convert to deployment status format for RepositorySelector
  const repositoriesForSelector = useMemo(
    () =>
      monitoringStatuses.map((ms) => ({
        repositoryId: ms.repositoryId,
        repositoryName: ms.repositoryName,
        repositoryType: ms.repositoryType,
        isDeployed: ms.isMonitored,
        status: ms.healthStatus === 'healthy' ? ('success' as const) : ms.healthStatus === 'degraded' ? ('in_progress' as const) : ('failed' as const),
      })),
    [monitoringStatuses]
  );

  // State
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string | 'all'>(
    monitoringStatuses.length > 0 ? monitoringStatuses[0].repositoryId : 'all'
  );
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [monitoringMode, setMonitoringMode] = useState<MonitoringMode>('live');
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL);
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Counter to force re-render
  const [historyMetricFilter, setHistoryMetricFilter] = useState<ResourceMetricKey | 'all'>('all');
  const [historySeverityFilter, setHistorySeverityFilter] = useState<'all' | 'warning' | 'critical'>('all');

  const isAllSelected = selectedRepositoryId === 'all';
  const selectedMonitoring = monitoringStatuses.find((m) => m.repositoryId === selectedRepositoryId);
  const isLiveMode = monitoringMode === 'live';
  const alertContextLabel = isAllSelected
    ? '전체 레포지토리'
    : selectedMonitoring?.repositoryName ?? '선택된 레포지토리';

  // Get metrics for selected repository
  const metricsData = useMemo(() => {
    if (isAllSelected) {
      // For all repositories, get metrics from all monitored repos
      const allMetrics = monitoringStatuses
        .filter((m) => m.isMonitored)
        .flatMap((m) => getMonitoringMetrics(m.repositoryId, timeRange));
      return allMetrics;
    }
    return getMonitoringMetrics(selectedRepositoryId, timeRange);
  }, [selectedRepositoryId, timeRange, isAllSelected, monitoringStatuses, refreshTrigger]);

  // Get aggregated metrics when "all" is selected
  const aggregatedMetrics = useMemo(() => {
    if (isAllSelected) {
      return getAggregatedMetrics(project.id);
    }
    return null;
  }, [isAllSelected, project.id, refreshTrigger]);

  // Get current metrics (latest data point)
  const currentMetrics = useMemo(() => {
    if (metricsData.length === 0) return null;
    if (isAllSelected) {
      // Return aggregated current metrics
      return aggregatedMetrics ? {
        cpu: aggregatedMetrics.totalCpu,
        memory: aggregatedMetrics.totalMemory,
        disk: aggregatedMetrics.totalDisk,
        network: aggregatedMetrics.totalNetwork,
        responseTime: aggregatedMetrics.avgResponseTime,
        errorRate: aggregatedMetrics.avgErrorRate,
      } : null;
    }
    return metricsData[metricsData.length - 1];
  }, [metricsData, isAllSelected, aggregatedMetrics]);

  const resourceAlerts = useMemo<ResourceAlert[]>(() => {
    if (!currentMetrics) return [];
    const snapshot = currentMetrics as Partial<Record<ResourceMetricKey, number>>;
    return (Object.entries(RESOURCE_CHART_THRESHOLDS) as Array<[ResourceMetricKey, number]>)
      .map(([metricKey, threshold]) => {
        const value = snapshot[metricKey];
        if (typeof value !== 'number') return null;
        if (value < threshold * 0.85) return null;
        return {
          metric: metricKey,
          threshold,
          value,
          severity: value >= threshold ? 'critical' : 'warning',
        } satisfies ResourceAlert;
      })
      .filter(Boolean) as ResourceAlert[];
  }, [currentMetrics]);

  const resourceBreachHistory = useMemo<ResourceBreachEvent[]>(() => {
    if (metricsData.length === 0) return [];
    const recentSamples = metricsData.slice(-40);
    const events: ResourceBreachEvent[] = [];
    recentSamples.forEach((sample) => {
      const timestamp = sample.timestamp instanceof Date ? sample.timestamp : new Date(sample.timestamp);
      (Object.entries(RESOURCE_CHART_THRESHOLDS) as Array<[ResourceMetricKey, number]>).forEach(
        ([metricKey, threshold]) => {
          const value = sample[metricKey];
          if (typeof value !== 'number') return;
          if (value >= threshold) {
            events.push({
              metric: metricKey,
              threshold,
              value,
              timestamp,
              severity: value >= threshold * 1.1 ? 'critical' : 'warning',
            });
          }
        }
      );
    });
    return events.slice(-12).reverse();
  }, [metricsData]);

  const filteredBreachHistory = useMemo(() => {
    return resourceBreachHistory.filter((event) => {
      if (historyMetricFilter !== 'all' && event.metric !== historyMetricFilter) return false;
      if (historySeverityFilter !== 'all' && event.severity !== historySeverityFilter) return false;
      return true;
    });
  }, [resourceBreachHistory, historyMetricFilter, historySeverityFilter]);

  const hasCriticalAlert = resourceAlerts.some((alert) => alert.severity === 'critical');

  // Get alerts
  const alerts = useMemo(() => {
    if (isAllSelected) {
      return getMonitoringAlerts();
    }
    return getMonitoringAlerts(selectedRepositoryId);
  }, [selectedRepositoryId, isAllSelected]);

  const selectedIntervalLabel = useMemo(() => {
    const match = REFRESH_INTERVAL_OPTIONS.find((option) => option.value === refreshInterval);
    if (match) return match.label;
    return `${Math.round(refreshInterval / 1000)}초`;
  }, [refreshInterval]);

  const handleIntervalChange = (newInterval: number) => {
    setRefreshInterval(newInterval);
    setLastRefresh(new Date());
  };

  const handleManualRefresh = () => {
    updateLiveMetrics();
    setLastRefresh(new Date());
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleHistoryExport = () => {
    if (filteredBreachHistory.length === 0) {
      showToast('내보낼 경보 데이터가 없습니다', 'info');
      return;
    }
    const header = ['timestamp', 'metric', 'value', 'threshold', 'severity'];
    const rows = filteredBreachHistory.map((event) => [
      event.timestamp.toISOString(),
      RESOURCE_LABELS[event.metric],
      formatResourceValue(event.metric, event.value),
      event.threshold,
      event.severity,
    ]);
    const csv = [header, ...rows]
      .map((columns) =>
        columns
          .map((column) => `"${String(column).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resource-breaches-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('경보 히스토리를 CSV로 내보냈습니다', 'success');
  };

  // Auto refresh with live metric updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      updateLiveMetrics();
      setLastRefresh(new Date());
      setRefreshTrigger((prev) => prev + 1);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLiveMode, refreshInterval]);

  useEffect(() => {
    if (!isLiveMode) return;
    updateLiveMetrics();
    setLastRefresh(new Date());
    setRefreshTrigger((prev) => prev + 1);
  }, [isLiveMode]);

  const handleThresholdSave = (_thresholds: any[]) => {
    showToast('임계값이 저장되었습니다', 'success');
  };

  if (monitoringStatuses.length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.name} 모니터링
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            실시간으로 리소스 사용량과 성능을 모니터링합니다
          </p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-12 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-center">
          <Server className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            모니터링 가능한 레포지토리가 없습니다
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
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.name} 모니터링
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            실시간으로 리소스 사용량과 성능을 모니터링합니다
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <RepositorySelector
              repositories={repositoriesForSelector}
              selectedRepositoryId={selectedRepositoryId}
              onSelect={setSelectedRepositoryId}
            />
            <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                모드
              </span>
              <div className="flex rounded-2xl border border-gray-200 bg-white p-1 text-sm font-semibold dark:border-gray-700 dark:bg-gray-900">
                {MONITORING_MODES.map((mode) => {
                  const active = monitoringMode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => setMonitoringMode(mode.value)}
                      className={cn(
                        'flex min-w-[120px] flex-col rounded-2xl px-3 py-1.5 text-left transition',
                        active
                          ? 'bg-gradient-to-br from-emerald-500/90 to-green-500 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                      )}
                    >
                      <span className="flex items-center gap-1 text-xs">
                        {mode.value === 'live' && (
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        )}
                        {mode.label}
                      </span>
                      <span className={cn('text-[11px] font-normal', active ? 'text-white/80' : 'text-gray-400 dark:text-gray-500')}>
                        {mode.helper}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex flex-col text-xs text-gray-600 dark:text-gray-300">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                업데이트 주기
              </span>
              <select
                value={refreshInterval}
                onChange={(event) => handleIntervalChange(Number(event.target.value))}
                disabled={!isLiveMode}
                className={cn(
                  'mt-1 rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition',
                  isLiveMode
                    ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
                )}
              >
                {REFRESH_INTERVAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {!isLiveMode && (
              <button
                onClick={handleManualRefresh}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <RotateCw className="h-4 w-4 text-emerald-500" />
                지금 새로고침
              </button>
            )}

            <ExportMetricsButton
              data={metricsData}
              repositoryName={isAllSelected ? 'all-repositories' : selectedMonitoring?.repositoryName}
              timeRange={timeRange}
            />

            <button
              onClick={() => setShowThresholdConfig(true)}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
              임계값 설정
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              isLiveMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            )}
          />
          <span>
            {isLiveMode ? '실시간 업데이트 중' : '수동 모드'} · 마지막 업데이트: {lastRefresh.toLocaleTimeString()} ·{' '}
            {isLiveMode ? '주기' : '선택된 주기'}: {selectedIntervalLabel}
          </span>
        </div>
      </div>

      {/* Aggregated Metrics (All Repositories) */}
      {isAllSelected && aggregatedMetrics && (
        <AggregatedMetricsPanel metrics={aggregatedMetrics} />
      )}

      {/* Individual Repository Metrics */}
      {!isAllSelected && selectedMonitoring && currentMetrics && (
        <>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              현재 리소스 사용량
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="CPU 사용률"
                value={currentMetrics.cpu.toFixed(1)}
                unit="%"
                subtitle={`기준 ${RESOURCE_CHART_THRESHOLDS.cpu}%`}
                icon={Cpu}
                iconColor="text-blue-600 dark:text-blue-400"
                status={getResourceStatus(currentMetrics.cpu, RESOURCE_CHART_THRESHOLDS.cpu)}
                trend={currentMetrics.cpu > RESOURCE_CHART_THRESHOLDS.cpu ? 'up' : currentMetrics.cpu < 40 ? 'down' : 'neutral'}
                trendValue={`${((Math.random() - 0.5) * 10).toFixed(1)}%`}
              />
              <MetricCard
                title="메모리 사용률"
                value={currentMetrics.memory.toFixed(1)}
                unit="%"
                subtitle={`기준 ${RESOURCE_CHART_THRESHOLDS.memory}%`}
                icon={HardDrive}
                iconColor="text-green-600 dark:text-green-400"
                status={getResourceStatus(currentMetrics.memory, RESOURCE_CHART_THRESHOLDS.memory)}
                trend={currentMetrics.memory > RESOURCE_CHART_THRESHOLDS.memory ? 'up' : 'neutral'}
                trendValue={`${((Math.random() - 0.5) * 10).toFixed(1)}%`}
              />
              <MetricCard
                title="디스크 사용률"
                value={currentMetrics.disk.toFixed(1)}
                unit="%"
                subtitle={`기준 ${RESOURCE_CHART_THRESHOLDS.disk}%`}
                icon={Server}
                iconColor="text-purple-600 dark:text-purple-400"
                status={getResourceStatus(currentMetrics.disk, RESOURCE_CHART_THRESHOLDS.disk)}
                trend="neutral"
              />
              <MetricCard
                title="네트워크 I/O"
                value={currentMetrics.network.toFixed(1)}
                unit="MB/s"
                subtitle={`기준 ${RESOURCE_CHART_THRESHOLDS.network} MB/s`}
                icon={Network}
                iconColor="text-orange-600 dark:text-orange-400"
                status={getResourceStatus(currentMetrics.network, RESOURCE_CHART_THRESHOLDS.network)}
                trend={currentMetrics.network > RESOURCE_CHART_THRESHOLDS.network ? 'up' : 'down'}
                trendValue={`${(Math.random() * 0.8).toFixed(1)} MB/s`}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              성능 지표
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard
                title="평균 응답 시간"
                value={currentMetrics.responseTime.toFixed(0)}
                unit="ms"
                subtitle={`기준 ${RESOURCE_CHART_THRESHOLDS.responseTime}ms`}
                icon={Clock}
                iconColor="text-blue-600 dark:text-blue-400"
                status={getResourceStatus(currentMetrics.responseTime, RESOURCE_CHART_THRESHOLDS.responseTime)}
                trend={currentMetrics.responseTime > RESOURCE_CHART_THRESHOLDS.responseTime ? 'up' : 'down'}
                trendValue="5ms"
              />
              <MetricCard
                title="에러율"
                value={currentMetrics.errorRate.toFixed(2)}
                unit="%"
                icon={Clock}
                iconColor="text-red-600 dark:text-red-400"
                status={
                  currentMetrics.errorRate > 5
                    ? 'critical'
                    : currentMetrics.errorRate > 1
                      ? 'warning'
                      : 'normal'
                }
                trend="down"
                trendValue="0.01%"
              />
            </div>
          </div>
        </>
      )}

      {resourceAlerts.length > 0 && (
        <div
          className={cn(
            'rounded-3xl border p-5 shadow-sm bg-gradient-to-br',
            hasCriticalAlert
              ? 'from-rose-50 via-white to-white border-rose-200 dark:from-rose-500/10 dark:via-gray-900 dark:border-rose-500/30'
              : 'from-amber-50 via-white to-white border-amber-200 dark:from-amber-500/10 dark:via-gray-900 dark:border-amber-500/30'
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                실시간 경보
              </p>
              <div className="mt-1 flex items-center gap-2 text-gray-900 dark:text-white">
                <AlertTriangle
                  className={cn(
                    'h-4 w-4',
                    hasCriticalAlert ? 'text-rose-500' : 'text-amber-500'
                  )}
                />
                <p className="text-base font-semibold">
                  {hasCriticalAlert ? '임계 초과 지표 감지' : '주의 수준 접근'}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {alertContextLabel}에서 {resourceAlerts.length}개 지표가 기준치에 도달했습니다.
              </p>
            </div>
            <button
              onClick={() => setShowThresholdConfig(true)}
              className="rounded-xl border border-white/40 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            >
              임계값 조정
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {resourceAlerts.map((alert) => (
              <div
                key={alert.metric}
                className="rounded-2xl border border-white/60 bg-white/80 p-3 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900/70"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {RESOURCE_LABELS[alert.metric]}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                      alert.severity === 'critical'
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-100'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100'
                    )}
                  >
                    {alert.severity === 'critical' ? '임계' : '주의'}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2 text-gray-900 dark:text-white">
                  <span className="text-2xl font-bold">
                    {formatResourceValue(alert.metric, alert.value)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {RESOURCE_UNITS[alert.metric]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  기준 {alert.threshold}
                  {RESOURCE_UNITS[alert.metric]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {resourceBreachHistory.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                최근 임계 돌파 히스토리
              </p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                마지막 {resourceBreachHistory.length}건 중 표시
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-gray-500 dark:text-gray-400">
                지표
                <select
                  value={historyMetricFilter}
                  onChange={(event) =>
                    setHistoryMetricFilter(event.target.value as ResourceMetricKey | 'all')
                  }
                  className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="all">전체</option>
                  {Object.entries(RESOURCE_LABELS).map(([metricKey, label]) => (
                    <option key={metricKey} value={metricKey}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                심각도
                <select
                  value={historySeverityFilter}
                  onChange={(event) =>
                    setHistorySeverityFilter(event.target.value as 'all' | 'warning' | 'critical')
                  }
                  className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="all">전체</option>
                  <option value="critical">임계</option>
                  <option value="warning">주의</option>
                </select>
              </label>
              <button
                onClick={handleHistoryExport}
                disabled={filteredBreachHistory.length === 0}
                className={cn(
                  'rounded-xl border px-3 py-1.5 text-sm font-semibold transition',
                  filteredBreachHistory.length === 0
                    ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-600'
                    : 'border-gray-900 text-gray-900 hover:bg-gray-50 dark:border-gray-200 dark:text-gray-100 dark:hover:bg-gray-900/60'
                )}
              >
                CSV 내보내기
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {alertContextLabel} · {filteredBreachHistory.length}건 표시 중
          </p>
          <div className="mt-4 space-y-3">
            {filteredBreachHistory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                선택한 조건에 해당하는 경보가 없습니다.
              </div>
            ) : (
              filteredBreachHistory.map((event) => (
                <div
                  key={`${event.metric}-${event.timestamp.toISOString()}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                        event.severity === 'critical'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-100'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100'
                      )}
                    >
                      {event.severity === 'critical' ? '임계' : '주의'}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {RESOURCE_LABELS[event.metric]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        기준 {event.threshold}
                        {RESOURCE_UNITS[event.metric]} 초과
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {formatResourceValue(event.metric, event.value)}
                      {RESOURCE_UNITS[event.metric]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.timestamp.toLocaleTimeString()} 발생
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Time Series Charts */}
      {metricsData.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            리소스 사용량 추이
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceChart
              data={metricsData}
              metric="cpu"
              label="CPU 사용률"
              color="#3b82f6"
              unit="%"
              alertThreshold={RESOURCE_CHART_THRESHOLDS.cpu}
            />
            <ResourceChart
              data={metricsData}
              metric="memory"
              label="메모리 사용률"
              color="#10b981"
              unit="%"
              alertThreshold={RESOURCE_CHART_THRESHOLDS.memory}
            />
            <ResourceChart
              data={metricsData}
              metric="responseTime"
              label="응답 시간"
              color="#f59e0b"
              unit="ms"
              alertThreshold={RESOURCE_CHART_THRESHOLDS.responseTime}
            />
            <ResourceChart
              data={metricsData}
              metric="network"
              label="네트워크 I/O"
              color="#8b5cf6"
              unit="MB/s"
              alertThreshold={RESOURCE_CHART_THRESHOLDS.network}
            />
          </div>
        </div>
      )}

      {/* Alert History */}
      {alerts.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <AlertHistoryPanel alerts={alerts} showRepositoryName={isAllSelected} />
        </div>
      )}

      {/* Threshold Config Panel */}
      {showThresholdConfig && (
        <ThresholdConfigPanel
          onClose={() => setShowThresholdConfig(false)}
          onSave={handleThresholdSave}
        />
      )}
    </div>
  );
}
