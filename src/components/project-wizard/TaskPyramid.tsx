import { useMemo } from 'react';
import { Circle } from 'lucide-react';
import { TaskTreeNode } from '../../types/wizard';

interface TaskPyramidProps {
  tasks: TaskTreeNode[];
}

type PyramidNode = TaskTreeNode & { depth: number; order: number };

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

const flattenTasks = (nodes: TaskTreeNode[], depth = 0): PyramidNode[] => {
  const result: PyramidNode[] = [];
  nodes.forEach((node, idx) => {
    result.push({ ...node, depth, order: idx });
    if (node.children?.length) {
      result.push(...flattenTasks(node.children, depth + 1));
    }
  });
  return result;
};

export default function TaskPyramid({ tasks }: TaskPyramidProps) {
  const levels = useMemo(() => {
    const flat = flattenTasks(tasks);
    const grouped = flat.reduce<Record<number, PyramidNode[]>>((acc, item) => {
      acc[item.depth] = acc[item.depth] ? [...acc[item.depth], item] : [item];
      return acc;
    }, {});
    const maxDepth = Math.max(...flat.map((n) => n.depth), 0);
    const ordered: PyramidNode[][] = [];
    for (let depth = maxDepth; depth >= 0; depth -= 1) {
      ordered.push((grouped[depth] || []).sort((a, b) => a.order - b.order));
    }
    return ordered;
  }, [tasks]);

  if (!levels.length) return null;

  return (
    <div className="space-y-6">
      {levels.map((level, idx) => (
        <div key={`level-${idx}`}>
          <div className="flex flex-wrap justify-center gap-4">
            {level.map((item) => (
              <div
                key={item.id}
                className="w-full sm:w-60 bg-white border border-gray-200 rounded-xl shadow-md dark:bg-gray-900 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadge[item.status]}`}
                  >
                    {item.status === 'todo' && '대기'}
                    {item.status === 'in_progress' && '진행중'}
                    {item.status === 'review' && '검토'}
                    {item.status === 'done' && '완료'}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Circle className={`w-2 h-2 ${priorityDot[item.priority]}`} />
                    {item.priority === 'high'
                      ? 'High'
                      : item.priority === 'medium'
                      ? 'Medium'
                      : 'Low'}
                  </span>
                  <span>
                    {roleLabel[item.ownerRole]}
                    {item.etaDays ? ` · ${item.etaDays}일` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {idx < levels.length - 1 && (
            <div className="flex justify-center">
              <div className="w-1 h-6 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600 rounded-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
