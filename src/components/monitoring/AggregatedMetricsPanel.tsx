import { Activity, Cpu, HardDrive, Network, Clock, Server, AlertTriangle } from 'lucide-react';
import { AggregatedMetrics } from '../../types';
import { MetricCard } from './MetricCard';

interface AggregatedMetricsPanelProps {
  metrics: AggregatedMetrics;
}

export function AggregatedMetricsPanel({ metrics }: AggregatedMetricsPanelProps) {
  return (
    <div className="space-y-6">
      {/* System Overview Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">전체 시스템 개요</h2>
            <p className="text-green-100">
              {metrics.activeRepositories}개의 레포지토리가 모니터링 중입니다
            </p>
          </div>
          <Activity className="w-16 h-16 opacity-50" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
            <div className="text-green-100 text-sm mb-1">활성 레포지토리</div>
            <div className="text-2xl font-bold">{metrics.activeRepositories}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
            <div className="text-green-100 text-sm mb-1">평균 응답 시간</div>
            <div className="text-2xl font-bold">{metrics.avgResponseTime.toFixed(0)}ms</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
            <div className="text-green-100 text-sm mb-1">총 요청 수</div>
            <div className="text-2xl font-bold">
              {(metrics.totalRequests / 1000).toFixed(1)}K
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
            <div className="text-green-100 text-sm mb-1">활성 알림</div>
            <div className="text-2xl font-bold">{metrics.totalAlerts}</div>
          </div>
        </div>
      </div>

      {/* Aggregated Resource Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          전체 리소스 사용량 (평균)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="CPU 사용률"
            value={metrics.totalCpu.toFixed(1)}
            unit="%"
            icon={Cpu}
            iconColor="text-blue-600 dark:text-blue-400"
            status={metrics.totalCpu > 80 ? 'critical' : metrics.totalCpu > 60 ? 'warning' : 'normal'}
            trend={metrics.totalCpu > 70 ? 'up' : metrics.totalCpu < 40 ? 'down' : 'neutral'}
            trendValue={`${((Math.random() - 0.5) * 10).toFixed(1)}%`}
          />
          <MetricCard
            title="메모리 사용률"
            value={metrics.totalMemory.toFixed(1)}
            unit="%"
            icon={HardDrive}
            iconColor="text-green-600 dark:text-green-400"
            status={
              metrics.totalMemory > 85 ? 'critical' : metrics.totalMemory > 70 ? 'warning' : 'normal'
            }
            trend={metrics.totalMemory > 75 ? 'up' : 'neutral'}
            trendValue={`${((Math.random() - 0.5) * 10).toFixed(1)}%`}
          />
          <MetricCard
            title="디스크 사용률"
            value={metrics.totalDisk.toFixed(1)}
            unit="%"
            icon={Server}
            iconColor="text-purple-600 dark:text-purple-400"
            status={metrics.totalDisk > 90 ? 'critical' : metrics.totalDisk > 75 ? 'warning' : 'normal'}
            trend="neutral"
          />
          <MetricCard
            title="네트워크 I/O"
            value={metrics.totalNetwork.toFixed(1)}
            unit="MB/s"
            icon={Network}
            iconColor="text-orange-600 dark:text-orange-400"
            status="normal"
            trend="down"
            trendValue="0.3 MB/s"
          />
        </div>
      </div>

      {/* Additional Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          성능 지표 (전체 평균)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="평균 응답 시간"
            value={metrics.avgResponseTime.toFixed(0)}
            unit="ms"
            icon={Clock}
            iconColor="text-blue-600 dark:text-blue-400"
            status={
              metrics.avgResponseTime > 200 ? 'critical' : metrics.avgResponseTime > 100 ? 'warning' : 'normal'
            }
            trend={metrics.avgResponseTime > 100 ? 'up' : 'down'}
            trendValue="5ms"
          />
          <MetricCard
            title="에러율"
            value={metrics.avgErrorRate.toFixed(2)}
            unit="%"
            icon={AlertTriangle}
            iconColor="text-red-600 dark:text-red-400"
            status={metrics.avgErrorRate > 5 ? 'critical' : metrics.avgErrorRate > 1 ? 'warning' : 'normal'}
            trend="down"
            trendValue="0.01%"
          />
          <MetricCard
            title="총 요청 수"
            value={(metrics.totalRequests / 1000).toFixed(1)}
            unit="K"
            icon={Activity}
            iconColor="text-green-600 dark:text-green-400"
            status="normal"
            trend="up"
            trendValue="1.2K"
          />
        </div>
      </div>
    </div>
  );
}
