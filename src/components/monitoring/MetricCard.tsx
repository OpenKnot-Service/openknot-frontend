import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: LucideIcon;
  iconColor?: string;
  status?: 'normal' | 'warning' | 'critical';
  miniChart?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  status = 'normal',
  miniChart,
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      case 'neutral':
        return <Minus className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (status === 'warning') return 'text-yellow-600 dark:text-yellow-400';
    if (status === 'critical') return 'text-red-600 dark:text-red-400';

    switch (trend) {
      case 'up':
        return 'text-red-600 dark:text-red-400';
      case 'down':
        return 'text-green-600 dark:text-green-400';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBorderColor = () => {
    switch (status) {
      case 'warning':
        return 'border-yellow-200/80 dark:border-yellow-800';
      case 'critical':
        return 'border-red-200/80 dark:border-red-800';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusBackground = () => {
    switch (status) {
      case 'warning':
        return 'bg-gradient-to-br from-amber-100/70 via-transparent to-transparent dark:from-amber-500/20';
      case 'critical':
        return 'bg-gradient-to-br from-rose-100/80 via-transparent to-transparent dark:from-rose-500/30';
      default:
        return '';
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 p-4 transition-colors',
          getStatusBorderColor()
        )}
      >
        {status !== 'normal' && (
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-0 opacity-80',
              getStatusBackground()
            )}
          />
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {Icon && <Icon className={cn('w-5 h-5', iconColor)} />}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
            </div>
            {trend && trendValue && (
              <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
                {getTrendIcon()}
                <span>{trendValue}</span>
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
            {unit && <span className="text-lg text-gray-500 dark:text-gray-400">{unit}</span>}
          </div>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}

          {miniChart && <div className="mt-3">{miniChart}</div>}
        </div>
      </div>
    </div>
  );
}
