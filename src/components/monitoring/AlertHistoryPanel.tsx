import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Server,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { MonitoringAlert } from '../../types';
import { cn } from '../../lib/utils';

interface AlertHistoryPanelProps {
  alerts: MonitoringAlert[];
  showRepositoryName?: boolean;
}

export function AlertHistoryPanel({ alerts, showRepositoryName = false }: AlertHistoryPanelProps) {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');

  const filteredAlerts = alerts.filter(
    (alert) => severityFilter === 'all' || alert.severity === severityFilter
  );

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service_down':
        return <Server className="w-4 h-4" />;
      case 'service_up':
        return <CheckCircle className="w-4 h-4" />;
      case 'threshold_breach':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
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

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">알림 히스토리</h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">모든 알림</option>
            <option value="critical">위험</option>
            <option value="warning">경고</option>
            <option value="info">정보</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            알림이 없습니다
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn('p-4 rounded-lg border', getSeverityBg(alert.severity))}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {showRepositoryName && (
                      <>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {alert.repositoryName}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      </>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(alert.timestamp)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      {getTypeIcon(alert.type)}
                      <span className="capitalize">{alert.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {alert.message}
                  </p>
                  {alert.value !== undefined && alert.threshold !== undefined && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        값: <span className="font-semibold">{alert.value.toFixed(2)}</span>
                      </span>
                      <span>
                        임계값: <span className="font-semibold">{alert.threshold.toFixed(2)}</span>
                      </span>
                      {alert.metric && (
                        <span className="capitalize">
                          메트릭: <span className="font-semibold">{alert.metric.replace('_', ' ')}</span>
                        </span>
                      )}
                    </div>
                  )}
                  {alert.resolved && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>해결됨</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
