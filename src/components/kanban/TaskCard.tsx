import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import { Clock, AlertCircle } from 'lucide-react';
import { getUserById } from '../../lib/mockData';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onClick?: () => void;
}

export default function TaskCard({ task, isDragging = false, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  const priorityLabels = {
    low: '낮음',
    medium: '보통',
    high: '높음',
    urgent: '긴급',
  };

  const assignee = task.assigneeId ? getUserById(task.assigneeId) : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  const handleClick = () => {
    // Only trigger onClick if not dragging
    if (onClick && !isDragging) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border border-transparent dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm flex-1">{task.title}</h4>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((label) => (
            <span
              key={label}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        {assignee && (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
              {assignee.name[0]}
            </div>
            <span>{assignee.name}</span>
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
            {isOverdue && <AlertCircle className="w-3 h-3" />}
            <Clock className="w-3 h-3" />
            <span>
              {new Date(task.dueDate).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
