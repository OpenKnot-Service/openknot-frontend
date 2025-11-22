import { useState } from 'react';
import { X, Settings, Bell, BellOff, Save } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ThresholdConfig {
  metric: string;
  label: string;
  warningThreshold: number;
  criticalThreshold: number;
  enabled: boolean;
  unit: string;
}

interface ThresholdConfigPanelProps {
  onClose: () => void;
  onSave: (thresholds: ThresholdConfig[]) => void;
}

export function ThresholdConfigPanel({ onClose, onSave }: ThresholdConfigPanelProps) {
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([
    {
      metric: 'cpu',
      label: 'CPU 사용률',
      warningThreshold: 70,
      criticalThreshold: 85,
      enabled: true,
      unit: '%',
    },
    {
      metric: 'memory',
      label: '메모리 사용률',
      warningThreshold: 75,
      criticalThreshold: 90,
      enabled: true,
      unit: '%',
    },
    {
      metric: 'disk',
      label: '디스크 사용률',
      warningThreshold: 80,
      criticalThreshold: 95,
      enabled: true,
      unit: '%',
    },
    {
      metric: 'response_time',
      label: '응답 시간',
      warningThreshold: 100,
      criticalThreshold: 200,
      enabled: true,
      unit: 'ms',
    },
    {
      metric: 'error_rate',
      label: '에러율',
      warningThreshold: 1,
      criticalThreshold: 5,
      enabled: true,
      unit: '%',
    },
  ]);

  const updateThreshold = (index: number, field: keyof ThresholdConfig, value: any) => {
    const newThresholds = [...thresholds];
    newThresholds[index] = { ...newThresholds[index], [field]: value };
    setThresholds(newThresholds);
  };

  const handleSave = () => {
    onSave(thresholds);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">임계값 설정</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                리소스 메트릭별 경고 및 위험 임계값을 설정합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {thresholds.map((threshold, index) => (
            <div
              key={threshold.metric}
              className={cn(
                'p-4 rounded-lg border',
                threshold.enabled
                  ? 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{threshold.label}</h3>
                <button
                  onClick={() => updateThreshold(index, 'enabled', !threshold.enabled)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition',
                    threshold.enabled
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  )}
                >
                  {threshold.enabled ? (
                    <>
                      <Bell className="w-4 h-4" />
                      활성화됨
                    </>
                  ) : (
                    <>
                      <BellOff className="w-4 h-4" />
                      비활성화됨
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    경고 임계값
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={threshold.warningThreshold}
                      onChange={(e) =>
                        updateThreshold(index, 'warningThreshold', parseFloat(e.target.value))
                      }
                      disabled={!threshold.enabled}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem]">
                      {threshold.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    위험 임계값
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={threshold.criticalThreshold}
                      onChange={(e) =>
                        updateThreshold(index, 'criticalThreshold', parseFloat(e.target.value))
                      }
                      disabled={!threshold.enabled}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem]">
                      {threshold.unit}
                    </span>
                  </div>
                </div>
              </div>

              {threshold.enabled && (
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  경고: {threshold.warningThreshold}
                  {threshold.unit} 이상 | 위험: {threshold.criticalThreshold}
                  {threshold.unit} 이상
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-300 dark:border-gray-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition font-medium"
          >
            <Save className="w-4 h-4" />
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
