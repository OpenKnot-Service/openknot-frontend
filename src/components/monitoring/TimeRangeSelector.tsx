import { Clock } from 'lucide-react';
import { TimeRange } from '../../types';
import { cn } from '../../lib/utils';

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ selectedRange, onRangeChange }: TimeRangeSelectorProps) {
  const ranges: { value: TimeRange; label: string }[] = [
    { value: '1h', label: '1시간' },
    { value: '24h', label: '24시간' },
    { value: '7d', label: '7일' },
    { value: '30d', label: '30일' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {ranges.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onRangeChange(value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition',
              selectedRange === value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
