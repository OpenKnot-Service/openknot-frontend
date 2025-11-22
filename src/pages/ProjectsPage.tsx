import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getTasksByProjectId } from '../lib/mockData';
import { ProjectStatus } from '../types';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const userProjects = useMemo(() => {
    if (!user?.id) return projects;
    return projects.filter((p) => p.members.some((m) => m.userId === user.id));
  }, [projects, user?.id]);

  const filteredProjects = useMemo(() => {
    let filtered = userProjects;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [userProjects, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">AI 프로젝트 관리</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">AI가 생성한 프로젝트 계획으로 효율적으로 관리하세요</p>
          </div>
          <button
            onClick={() => navigate('/projects/new')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors whitespace-nowrap shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>AI로 프로젝트 생성</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          >
            <option value="all">전체</option>
            <option value="recruiting">모집 중</option>
            <option value="in_progress">진행 중</option>
            <option value="completed">완료</option>
            <option value="archived">보관됨</option>
          </select>
        </div>

        {/* Filter Summary */}
        {(statusFilter !== 'all' || searchQuery) && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>
              {filteredProjects.length}개의 프로젝트 {statusFilter !== 'all' && `(${statusFilter})`}
            </span>
            {(statusFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                필터 초기화
              </button>
            )}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">참여 중인 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => {
              const projectTasks = getTasksByProjectId(project.id);
              const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
              return (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  description={project.description}
                  status={project.status}
                  members={project.members.length}
                  tasks={{ total: projectTasks.length, completed: completedTasks }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  status: 'recruiting' | 'in_progress' | 'completed' | 'archived';
  members: number;
  tasks: { total: number; completed: number };
}

function ProjectCard({ id, name, description, status, members, tasks }: ProjectCardProps) {
  const statusColors = {
    recruiting: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    in_progress: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    completed: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    archived: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  };

  const statusLabels = {
    recruiting: '모집 중',
    in_progress: '진행 중',
    completed: '완료',
    archived: '보관됨',
  };

  const progressPercentage = tasks.total > 0 ? (tasks.completed / tasks.total) * 100 : 0;

  return (
    <Link to={`/projects/${id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-transparent dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{members}명 참여</span>
          <span>
            {tasks.completed}/{tasks.total} 완료
          </span>
        </div>
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gray-900 dark:bg-gray-300 h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
