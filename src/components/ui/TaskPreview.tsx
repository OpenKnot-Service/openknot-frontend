import { TaskPriority } from '../../types';
import { Clock } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { getUserById } from '../../lib/mockData';

interface TaskPreviewProps {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  labels: string[];
}

export default function TaskPreview({
  title,
  description,
  priority,
  assigneeId,
  dueDate,
  labels,
}: TaskPreviewProps) {
  const priorityColors = {
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    medium: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    high: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  const priorityLabels = {
    low: '낮음',
    medium: '보통',
    high: '높음',
    urgent: '긴급',
  };

  const priorityIcons = {
    low: '⚪',
    medium: '🟢',
    high: '🟡',
    urgent: '🔴',
  };

  const assignee = assigneeId ? getUserById(assigneeId) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Title & Priority */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg flex-1">
          {title || '제목을 입력하세요'}
        </h3>
        <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5 ${priorityColors[priority]}`}>
          <span>{priorityIcons[priority]}</span>
          {priorityLabels[priority]}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-wrap">
          {description}
        </p>
      )}

      {!description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 italic">
          설명이 없습니다
        </p>
      )}

      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Assignee & Due Date */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          {assignee ? (
            <>
              <UserAvatar name={assignee.name} size="sm" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{assignee.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">담당자 없음</span>
          )}
        </div>

        {/* Due Date */}
        {dueDate && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(dueDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
