import { useMemo } from 'react';
import {
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import type { Project, Task } from '../../types';
import { cn } from '../../lib/utils';

export interface ProjectOutletContext {
  project: Project;
  projectTasks: Task[];
}

export function useProjectOutletContext() {
  return useOutletContext<ProjectOutletContext>();
}

const statusColors: Record<Project['status'], string> = {
  recruiting: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  in_progress: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  completed: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  archived: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const statusLabels: Record<Project['status'], string> = {
  recruiting: '모집 중',
  in_progress: '진행 중',
  completed: '완료',
  archived: '보관됨',
};

export default function ProjectLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks } = useApp();

  const project = projects.find((p) => p.id === id);

  const projectTasks = useMemo(() => {
    if (!project) return [];
    return tasks.filter((task) => task.projectId === project.id);
  }, [tasks, project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">프로젝트를 찾을 수 없습니다</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            요청한 프로젝트가 삭제되었거나 존재하지 않습니다.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            프로젝트 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: '개요', to: `/projects/${project.id}`, end: true },
    { label: 'GitHub', to: `/projects/${project.id}/github` },
    { label: '배포', to: `/projects/${project.id}/deployment` },
    { label: '모니터링', to: `/projects/${project.id}/monitoring` },
    { label: '보안', to: `/projects/${project.id}/security` },
    { label: '설정', to: `/projects/${project.id}/settings` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          프로젝트 목록으로
        </button>

        <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                statusColors[project.status]
              )}
            >
              {statusLabels[project.status]}
            </span>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <Outlet context={{ project, projectTasks }} />
        </div>
      </div>
    </div>
  );
}
