import { useId, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { MonitoringMetric } from '../../types';
import { cn } from '../../lib/utils';

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  timestamp: Date;
}

interface ResourceChartProps {
  data: MonitoringMetric[];
  metric: 'cpu' | 'memory' | 'disk' | 'network' | 'responseTime';
  label: string;
  color?: string;
  unit?: string;
  alertThreshold?: number;
}

export function ResourceChart({
  data,
  metric,
  label,
  color = '#3b82f6',
  unit = '%',
  alertThreshold,
}: ResourceChartProps) {
  const chartId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const metricValues = useMemo(() => data.map((d) => d[metric]), [data, metric]);
  const firstValue = metricValues[0] ?? 0;
  const currentValue = metricValues.length > 0 ? metricValues[metricValues.length - 1] : 0;
  const avgValue =
    metricValues.length > 0 ? metricValues.reduce((acc, value) => acc + value, 0) / metricValues.length : 0;
  const peakValue = metricValues.length > 0 ? Math.max(...metricValues) : 0;
  const lowValue = metricValues.length > 0 ? Math.min(...metricValues) : 0;
  const change = currentValue - firstValue;
  const changeLabel = change === 0 ? '변화 없음' : `${change > 0 ? '+' : ''}${change.toFixed(1)}${unit}`;

  const changeClasses =
    change > 0
      ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10'
      : change < 0
        ? 'text-rose-600 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10'
        : 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';

  const { points, min, max, coords, ticks, alertThresholdY } = useMemo<{
    points: string;
    min: number;
    max: number;
    coords: ChartPoint[];
    ticks: { y: number; value: number }[];
    alertThresholdY: number | null;
  }>(() => {
    if (data.length === 0) {
      return { points: '', min: 0, max: 100, coords: [], ticks: [], alertThresholdY: null };
    }

    const values = data.map((d) => d[metric]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const padding = (maxVal - minVal) * 0.1 || 10;

    const width = 100;
    const height = 40;

    const xScale = width / (data.length - 1 || 1);
    const yScale = height / (maxVal - minVal + padding * 2 || 1);

    const pointData: ChartPoint[] = data.map((d, i) => {
      const x = i * xScale;
      const y = height - (d[metric] - minVal + padding) * yScale;
      return {
        x,
        y,
        value: d[metric],
        timestamp: d.timestamp instanceof Date ? d.timestamp : new Date(d.timestamp),
      };
    });

    const pathPoints = pointData
      .map((point, i) => {
        return `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`;
      })
      .join(' ');

    const tickCount = 4;
    const tickData = Array.from({ length: tickCount }, (_, idx) => {
      const value = maxVal - ((maxVal - minVal) / (tickCount - 1 || 1)) * idx;
      const y = height - (value - minVal + padding) * yScale;
      return { value, y };
    });

    let alertHeight: number | null = null;
    if (typeof alertThreshold === 'number') {
      const thresholdY = height - (alertThreshold - minVal + padding) * yScale;
      const clampedY = Math.min(Math.max(thresholdY, 0), height);
      alertHeight = clampedY;
    }

    return {
      points: pathPoints,
      min: minVal,
      max: maxVal,
      coords: pointData,
      ticks: tickData,
      alertThresholdY: alertHeight,
    };
  }, [data, metric, alertThreshold]);

  const hoverPoint = hoverIndex !== null ? coords[hoverIndex] : null;
  const tooltipLeft = hoverPoint ? Math.min(Math.max(hoverPoint.x, 8), 92) : null;
  const alertActive =
    typeof alertThreshold === 'number' && metricValues.some((value) => value >= alertThreshold);

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (coords.length === 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const clampedRatio = Math.min(Math.max(relativeX, 0), 1);
    const maxIndex = Math.max(data.length - 1, 1);
    const index = Math.min(data.length - 1, Math.round(clampedRatio * maxIndex));
    setHoverIndex(index);
  };

  const handlePointerLeave = () => {
    setHoverIndex(null);
  };

  const timeLabels = useMemo(() => {
    if (data.length === 0) {
      return [];
    }

    const safeTimestamp = (value: Date | string) => (value instanceof Date ? value : new Date(value));
    const first = safeTimestamp(data[0].timestamp);
    const mid = safeTimestamp(data[Math.floor(data.length / 2)].timestamp);
    const last = safeTimestamp(data[data.length - 1].timestamp);

    return [
      { label: format(first, 'HH:mm'), position: 0 },
      { label: format(mid, 'HH:mm'), position: 50 },
      { label: format(last, 'HH:mm'), position: 100 },
    ];
  }, [data]);

  const hoverValue = hoverPoint ? hoverPoint.value : currentValue;
  const hoverDelta = hoverPoint ? hoverPoint.value - avgValue : null;
  const hoverSeverity =
    hoverPoint && typeof alertThreshold === 'number'
      ? hoverPoint.value >= alertThreshold
        ? 'critical'
        : 'normal'
      : null;
  const hoverTimestampLabel = hoverPoint ? format(hoverPoint.timestamp, 'MM.dd HH:mm:ss') : '';
  const gradientId = `gradient-${chartId}`;
  const lineGradientId = `line-gradient-${chartId}`;
  const backgroundGradientId = `background-${chartId}`;
  const alertGradientId = `alert-gradient-${chartId}`;
  const shadowId = `shadow-${chartId}`;
  const markerShadowId = `marker-shadow-${chartId}`;

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl border border-gray-100/70 bg-gradient-to-b from-white via-slate-50 to-white p-4 shadow-sm dark:border-gray-700/60 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {alertActive && (
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-rose-200/40 via-transparent to-transparent dark:from-rose-500/15" />
        )}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currentValue.toFixed(1)}
                  {unit}
                </span>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-900/40 dark:text-gray-300">
                  평균 {avgValue.toFixed(1)}
                  {unit}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${changeClasses}`}>{changeLabel}</span>
              {typeof alertThreshold === 'number' && (
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                    alertActive
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-100'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'
                  )}
                >
                  기준 {alertThreshold}
                  {unit}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              최고 {peakValue.toFixed(1)}
              {unit}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-400/80" />
              최저 {lowValue.toFixed(1)}
              {unit}
            </span>
          </div>
          <div className="relative mt-4">
            <svg
              viewBox="0 0 100 40"
              className="h-24 w-full"
            preserveAspectRatio="none"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <defs>
              <linearGradient id={backgroundGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.08" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
              <linearGradient id={alertGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
              <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="1" />
              </linearGradient>
              <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={color} floodOpacity="0.15" />
              </filter>
              <filter id={markerShadowId} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor={color} floodOpacity="0.35" />
              </filter>
            </defs>

            <rect x="0" y="0" width="100" height="40" fill={`url(#${backgroundGradientId})`} opacity="0.6" />

            {alertActive && alertThresholdY !== null && alertThresholdY > 0 && (
              <rect
                x="0"
                y="0"
                width="100"
                height={alertThresholdY}
                fill={`url(#${alertGradientId})`}
              />
            )}

            {typeof alertThreshold === 'number' && alertThresholdY !== null && (
              <line
                x1="0"
                y1={alertThresholdY}
                x2="100"
                y2={alertThresholdY}
                stroke="#fb7185"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                opacity="0.8"
              />
            )}

            {ticks.map((tick) => (
              <line
                key={`${tick.value}-${tick.y}`}
                x1="0"
                y1={tick.y}
                x2="100"
                y2={tick.y}
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-gray-200 dark:text-gray-700"
              />
            ))}

            {/* Area fill */}
            {points && (
              <path
                d={`${points} L 100,40 L 0,40 Z`}
                fill={`url(#${gradientId})`}
                strokeWidth="0"
                filter={`url(#${shadowId})`}
              />
            )}

            {/* Line */}
            {points && (
              <path
                d={points}
                fill="none"
                stroke={`url(#${lineGradientId})`}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#${shadowId})`}
              />
            )}

            {/* Hover marker */}
            {hoverPoint && (
              <>
                <rect
                  x={hoverPoint.x - 0.4}
                  y="0"
                  width="0.8"
                  height="40"
                  fill={color}
                  opacity="0.08"
                />
                <line
                  x1={hoverPoint.x}
                  y1="0"
                  x2={hoverPoint.x}
                  y2="40"
                  stroke={color}
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                <rect
                  x={hoverPoint.x - 1.3}
                  y={hoverPoint.y - 1.3}
                  width="2.6"
                  height="2.6"
                  rx="0.4"
                  fill="white"
                  stroke={color}
                  strokeWidth="0.5"
                  transform={`rotate(45 ${hoverPoint.x} ${hoverPoint.y})`}
                  filter={`url(#${markerShadowId})`}
                />
                <rect
                  x={hoverPoint.x - 0.8}
                  y={hoverPoint.y - 0.8}
                  width="1.6"
                  height="1.6"
                  rx="0.2"
                  fill={color}
                  opacity="0.9"
                  transform={`rotate(45 ${hoverPoint.x} ${hoverPoint.y})`}
                />
              </>
            )}
          </svg>
          {hoverPoint && tooltipLeft !== null && (
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute min-w-[150px] rounded-xl border border-gray-100 bg-white/95 p-3 text-xs shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95"
                style={{
                  left: `${tooltipLeft}%`,
                  transform: 'translate(-50%, -125%)',
                }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {hoverTimestampLabel}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {hoverValue.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span>
                    평균 대비 {hoverDelta !== null ? `${hoverDelta >= 0 ? '+' : ''}${hoverDelta.toFixed(1)}${unit}` : '—'}
                  </span>
                  {hoverSeverity && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        hoverSeverity === 'critical'
                          ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-100'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
                      )}
                    >
                      {hoverSeverity === 'critical' ? '임계 초과' : '안정'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
          <div className="relative mt-4 h-4 text-[11px] text-gray-400 dark:text-gray-500">
            {timeLabels.map((tick) => (
              <span
                key={`${tick.label}-${tick.position}`}
                className="absolute -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${tick.position}%` }}
              >
                {tick.label}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>최소 {min.toFixed(1)}{unit}</span>
            {typeof alertThreshold === 'number' && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-semibold',
                  alertActive
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-100'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'
                )}
              >
                기준 {alertThreshold}{unit}
              </span>
            )}
            <span>최대 {max.toFixed(1)}{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
