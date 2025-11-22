import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export default function KanbanColumn({ id, title, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 min-h-[400px] sm:min-h-[500px] transition-colors ${
        isOver ? 'bg-gray-200 dark:bg-gray-600 ring-2 ring-gray-400 dark:ring-gray-500' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
          ))}
        </div>
      </SortableContext>

      {tasks.length === 0 && (
        <div className="text-center text-gray-400 dark:text-gray-500 py-8">
          <p className="text-sm">태스크가 없습니다</p>
        </div>
      )}
    </div>
  );
}
