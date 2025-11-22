import { useMemo, useState } from 'react';
import { Users, GitBranch, Calendar, Plus, ListTree } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getTasksByProjectId, getUserById } from '../lib/mockData';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskModal from '../components/modals/TaskModal';
import { useProjectOutletContext } from '../components/layout/ProjectLayout';
import TaskTreeDiagram from '../components/project-wizard/TaskTreeDiagram';
import { getMockTaskTree } from '../lib/mockTaskTree';

export default function ProjectDetailPage() {
  const { project, projectTasks } = useProjectOutletContext();
  const { updateTask, tasks } = useApp();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);

  const resolvedTasks = projectTasks.length ? projectTasks : getTasksByProjectId(project.id);

  const inferredType = useMemo(() => {
    const text = `${project.name} ${project.description}`.toLowerCase();
    const stack = project.techStack.map((item) => item.toLowerCase());
    if (text.includes('mobile') || text.includes('앱') || stack.some((s) => s.includes('react native') || s.includes('flutter'))) {
      return 'mobile';
    }
    if (text.includes('desktop') || stack.some((s) => s.includes('electron') || s.includes('tauri'))) {
      return 'desktop';
    }
    return 'web';
  }, [project.description, project.name, project.techStack]);

  const taskTree = useMemo(() => {
    const keywords = project.techStack.slice(0, 3);
    return getMockTaskTree(inferredType, keywords);
  }, [inferredType, project.techStack]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Users className="h-5 w-5" />
            <span>{project.members.length}명 참여 중</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <GitBranch className="h-5 w-5" />
            {project.repositories && project.repositories.length > 0 ? (
              <span>
                {project.repositories.length}개의 저장소 연결됨
              </span>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">GitHub 저장소 미연결</span>
            )}
          </div>
          {project.startDate && (
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5" />
              <span>{new Date(project.startDate).toLocaleDateString('ko-KR')} 시작</span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">기술 스택</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">팀원</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {project.members.map((member) => {
              const user = getUserById(member.userId);
              if (!user) return null;

              return (
                <div
                  key={member.userId}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.position}</p>
                  </div>
                  {member.role === 'owner' && (
                    <span className="rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
                      Owner
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {taskTree.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ListTree className="h-5 w-5" />
              AI Task Tree
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">Mock guide</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            프로젝트 기획과 기술 스택을 기반으로 구성한 태스크 종속성 다이어그램입니다. 노드를 클릭하거나 호버하여
            종속성을 확인할 수 있습니다.
          </p>
          <TaskTreeDiagram tasks={taskTree} />
        </div>
      )}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">태스크 보드</h2>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <Plus className="h-5 w-5" />
            새 태스크
          </button>
        </div>

        <KanbanBoard
          tasks={resolvedTasks}
          onTaskUpdate={updateTask}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setIsTaskModalOpen(true);
          }}
        />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        projectId={project.id}
        task={selectedTask || undefined}
      />
    </div>
  );
}
