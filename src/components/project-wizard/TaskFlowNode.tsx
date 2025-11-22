import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Circle, Clock } from 'lucide-react';
import { TaskTreeNode } from '../../types/wizard';
import { TaskFlowNodeData } from '../../lib/reactFlowUtils';

const statusStyles: Record<TaskTreeNode['status'], { bg: string; border: string; text: string }> = {
  todo: {
    bg: 'bg-gray-50 dark:bg-gray-900',
    border: 'border-l-gray-400 dark:border-l-gray-600',
    text: 'text-gray-600 dark:text-gray-400',
  },
  in_progress: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-l-blue-500 dark:border-l-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
  },
  review: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-l-yellow-500 dark:border-l-yellow-400',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  done: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-l-green-500 dark:border-l-green-400',
    text: 'text-green-700 dark:text-green-300',
  },
};

const priorityConfig: Record<TaskTreeNode['priority'], { color: string; label: string }> = {
  low: { color: 'text-green-600 dark:text-green-400', label: 'Low' },
  medium: { color: 'text-yellow-600 dark:text-yellow-400', label: 'Med' },
  high: { color: 'text-orange-600 dark:text-orange-400', label: 'High' },
};

const roleLabel: Record<TaskTreeNode['ownerRole'], string> = {
  developer: '개발',
  designer: '디자인',
  planner: '기획',
  other: '기타',
};

const statusLabel: Record<TaskTreeNode['status'], string> = {
  todo: '대기',
  in_progress: '진행',
  review: '검토',
  done: '완료',
};

function TaskFlowNode({ data, selected }: NodeProps) {
  const taskData = data as unknown as TaskFlowNodeData;
  if (!taskData) return null;

  const style = statusStyles[taskData.status];
  const priority = priorityConfig[taskData.priority];

  return (
    <div
      className={`
        relative w-[200px] min-h-[100px]
        border-l-4 ${style.border}
        rounded-sm shadow-md
        ${style.bg}
        border border-gray-200 dark:border-gray-700
        ${selected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        ${taskData.isHighlighted ? 'ring-2 ring-blue-400 shadow-xl' : ''}
        ${taskData.isDimmed ? 'opacity-30' : 'opacity-100'}
        transition-all duration-200
        hover:shadow-lg
      `}
    >
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white dark:!border-gray-900"
      />

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm font-semibold line-clamp-2 flex-1 ${style.text}`}>
            {taskData.title}
          </h4>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${style.text} bg-white dark:bg-gray-800 whitespace-nowrap`}>
            {statusLabel[taskData.status]}
          </span>
        </div>

        {/* Description */}
        {taskData.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {taskData.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          {/* Priority */}
          <div className="flex items-center gap-1">
            <Circle className={`w-2.5 h-2.5 fill-current ${priority.color}`} />
            <span className="text-gray-600 dark:text-gray-400">{priority.label}</span>
          </div>

          {/* Role & ETA */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span>{roleLabel[taskData.ownerRole]}</span>
            {taskData.etaDays && (
              <>
                <span className="text-gray-400">·</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{taskData.etaDays}일</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white dark:!border-gray-900"
      />
    </div>
  );
}

export default memo(TaskFlowNode);
