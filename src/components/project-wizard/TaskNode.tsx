import { Circle } from 'lucide-react';
import { TaskTreeNode } from '../../types/wizard';

interface TaskNodeProps {
  task: TaskTreeNode;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const statusBadge: Record<TaskTreeNode['status'], string> = {
  todo: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
  review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-200',
  done: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200',
};

const priorityDot: Record<TaskTreeNode['priority'], string> = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-orange-500',
};

const roleLabel: Record<TaskTreeNode['ownerRole'], string> = {
  developer: '개발',
  designer: '디자인',
  planner: '기획',
  other: '기타',
};

const statusLabel: Record<TaskTreeNode['status'], string> = {
  todo: '대기',
  in_progress: '진행중',
  review: '검토',
  done: '완료',
};

const priorityLabel: Record<TaskTreeNode['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function TaskNode({
  task,
  isHighlighted = false,
  isDimmed = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TaskNodeProps) {
  return (
    <div
      className={`
        w-56 bg-white border rounded-xl shadow-lg
        dark:bg-gray-900 dark:border-gray-700
        p-4 cursor-pointer
        transition-all duration-200
        ${isHighlighted ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''}
        ${isDimmed ? 'opacity-30' : 'opacity-100'}
        hover:shadow-xl hover:scale-[1.02]
      `}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header: Title + Status Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2">
          {task.title}
        </h4>
        <span
          className={`
            px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap
            ${statusBadge[task.status]}
          `}
        >
          {statusLabel[task.status]}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer: Priority + Role + ETA */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Circle className={`w-2 h-2 fill-current ${priorityDot[task.priority]}`} />
          {priorityLabel[task.priority]}
        </span>
        <span className="truncate ml-2">
          {roleLabel[task.ownerRole]}
          {task.etaDays ? ` · ${task.etaDays}일` : ''}
        </span>
      </div>
    </div>
  );
}
