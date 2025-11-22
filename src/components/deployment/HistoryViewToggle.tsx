import { List, Clock } from 'lucide-react';
import { DeploymentHistoryView } from '../../types';
import { cn } from '../../lib/utils';

interface HistoryViewToggleProps {
  view: DeploymentHistoryView;
  onViewChange: (view: DeploymentHistoryView) => void;
}

export function HistoryViewToggle({ view, onViewChange }: HistoryViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onViewChange('per-repo')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition',
          view === 'per-repo'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
        title="레포지토리별 보기"
      >
        <List className="w-4 h-4" />
        <span>레포별</span>
      </button>
      <button
        onClick={() => onViewChange('unified')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition',
          view === 'unified'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        )}
        title="통합 타임라인 보기"
      >
        <Clock className="w-4 h-4" />
        <span>타임라인</span>
      </button>
    </div>
  );
}
