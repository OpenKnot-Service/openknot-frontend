import { useState } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Project, ProjectStatus } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { user, addProject } = useApp();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'recruiting' as ProjectStatus,
    techStack: '',
    githubRepo: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('프로젝트 이름을 입력해주세요', 'warning');
      return;
    }

    if (!formData.description.trim()) {
      showToast('프로젝트 설명을 입력해주세요', 'warning');
      return;
    }

    const techStackArray = formData.techStack
      .split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    if (techStackArray.length === 0) {
      showToast('최소 1개 이상의 기술 스택을 입력해주세요', 'warning');
      return;
    }

    const startDate = formData.startDate ? new Date(formData.startDate) : undefined;
    const endDate = formData.endDate ? new Date(formData.endDate) : undefined;

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      ownerId: user?.id || 'user-1',
      status: formData.status,
      visibility: 'public',
      members: [
        {
          userId: user?.id || 'user-1',
          role: 'owner',
          position: '프로젝트 오너',
          joinedAt: new Date(),
        },
      ],
      techStack: techStackArray,
      startDate,
      endDate,
      githubRepo: formData.githubRepo.trim() || undefined,
      positions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addProject(newProject);
    showToast('프로젝트가 성공적으로 생성되었습니다', 'success');

    // Reset form
    setFormData({
      name: '',
      description: '',
      status: 'recruiting',
      techStack: '',
      githubRepo: '',
      startDate: '',
      endDate: '',
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 프로젝트 만들기" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            프로젝트 이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="예: OpenKnot"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            프로젝트 설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            프로젝트 상태
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          >
            <option value="recruiting">모집 중</option>
            <option value="in_progress">진행 중</option>
            <option value="completed">완료</option>
            <option value="archived">보관됨</option>
          </select>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            기술 스택 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js (쉼표로 구분)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            쉼표(,)로 구분하여 입력하세요
          </p>
        </div>

        {/* GitHub Repo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub 저장소 URL
          </label>
          <input
            type="url"
            name="githubRepo"
            value={formData.githubRepo}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              시작일
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              종료일
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            프로젝트 생성
          </button>
        </div>
      </form>
    </Modal>
  );
}
