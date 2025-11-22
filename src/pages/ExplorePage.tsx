import { useState, useMemo } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { mockProjects } from '../lib/mockData';

export default function ExplorePage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const recruitingProjects = useMemo(() => {
    return mockProjects.filter((p) => p.status === 'recruiting');
  }, []);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    recruitingProjects.forEach((p) => {
      p.techStack.forEach((tech) => tags.add(tech));
    });
    return Array.from(tags).slice(0, 10); // Show top 10 tags
  }, [recruitingProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = recruitingProjects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        selectedTags.every((tag) => p.techStack.includes(tag))
      );
    }

    return filtered;
  }, [recruitingProjects, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI 생성 프로젝트 둘러보기</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">AI가 자동으로 생성한 프로젝트 계획을 탐색하고, 관심있는 팀에 합류하세요</p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="프로젝트 또는 기술 스택 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
            />
          </div>
          <button
            onClick={() => showToast('고급 필터 기능은 준비 중입니다', 'info')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            고급 필터
          </button>
        </div>

        {/* Filter Tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              기술 스택 필터
            </h3>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                필터 초기화
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <FilterTag
                key={tag}
                label={tag}
                active={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">조건에 맞는 AI 생성 프로젝트가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-medium">
                <span className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-pulse"></span>
                AI 생성 프로젝트
              </span>
              <span>{filteredProjects.length}개</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <RecruitingProjectCard
                  key={project.id}
                  name={project.name}
                  description={project.description}
                  techStack={project.techStack}
                  openPositions={project.positions.map((pos) => ({
                    role: pos.description || pos.role,
                    count: pos.count - pos.filled,
                  }))}
                  members={project.members.length}
                  onApply={() => showToast('프로젝트 지원 기능은 준비 중입니다', 'info')}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface FilterTagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function FilterTag({ label, active, onClick }: FilterTagProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

interface RecruitingProjectCardProps {
  name: string;
  description: string;
  techStack: string[];
  openPositions: { role: string; count: number }[];
  members: number;
  onApply: () => void;
}

function RecruitingProjectCard({
  name,
  description,
  techStack,
  openPositions,
  members,
  onApply,
}: RecruitingProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-transparent dark:border-gray-700">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Open Positions */}
      <div className="mb-4 space-y-2">
        {openPositions.map((position, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{position.role}</span>
            <span className="text-gray-500 dark:text-gray-400">{position.count}명 모집</span>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Users className="w-4 h-4" />
        <span>{members}명 참여 중</span>
      </div>

      {/* Apply Button */}
      <button
        onClick={onApply}
        className="w-full mt-4 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
      >
        지원하기
      </button>
    </div>
  );
}
