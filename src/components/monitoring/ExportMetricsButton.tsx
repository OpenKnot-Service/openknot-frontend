import { useState } from 'react';
import { Download, FileText, FileJson } from 'lucide-react';
import { MonitoringMetric, TimeRange } from '../../types';
import { cn } from '../../lib/utils';

interface ExportMetricsButtonProps {
  data: MonitoringMetric[];
  repositoryName?: string;
  timeRange: TimeRange;
}

export function ExportMetricsButton({
  data,
  repositoryName = 'all-repositories',
  timeRange,
}: ExportMetricsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = [
      'Timestamp',
      'Repository',
      'CPU (%)',
      'Memory (%)',
      'Disk (%)',
      'Network (MB/s)',
      'Response Time (ms)',
      'Request Count',
      'Error Rate (%)',
      'Active Connections',
    ];

    const rows = data.map((metric) => [
      metric.timestamp.toISOString(),
      metric.repositoryName,
      metric.cpu.toFixed(2),
      metric.memory.toFixed(2),
      metric.disk.toFixed(2),
      metric.network.toFixed(2),
      metric.responseTime.toFixed(2),
      metric.requestCount,
      metric.errorRate.toFixed(4),
      metric.activeConnections || 0,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `monitoring-metrics-${repositoryName}-${timeRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
  };

  const exportToJSON = () => {
    if (data.length === 0) return;

    const jsonContent = JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        repositoryName,
        timeRange,
        metrics: data,
      },
      null,
      2
    );

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `monitoring-metrics-${repositoryName}-${timeRange}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
        disabled={data.length === 0}
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">내보내기</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 py-1">
            <button
              onClick={exportToCSV}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left'
              )}
            >
              <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">CSV</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Excel로 열기 가능
                </div>
              </div>
            </button>

            <button
              onClick={exportToJSON}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-left'
              )}
            >
              <FileJson className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">JSON</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  구조화된 데이터
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
