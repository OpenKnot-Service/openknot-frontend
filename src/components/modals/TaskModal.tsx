import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import TagInput from '../ui/TagInput';
import UserAvatar from '../ui/UserAvatar';
import TaskPreview from '../ui/TaskPreview';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { getUserById } from '../../lib/mockData';
import { Loader2, ChevronDown, Edit3, Eye } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task?: Task; // If provided, edit mode
}

export default function TaskModal({ isOpen, onClose, projectId, task }: TaskModalProps) {
  const { addTask, updateTask, projects } = useApp();
  const { showToast } = useToast();

  const project = projects.find((p) => p.id === projectId);
  const isEditMode = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assigneeId: '',
    dueDate: '',
  });

  const [labels, setLabels] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '',
      });
      setLabels(task.labels);
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assigneeId: '',
        dueDate: '',
      });
      setLabels([]);
    }
    setErrors({});
    setIsSubmitting(false);
  }, [task, isOpen]);

  // 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 제목 검사
    const title = formData.title.trim();
    if (!title) {
      newErrors.title = '태스크 제목을 입력해주세요';
    } else if (title.length < 3) {
      newErrors.title = '제목은 최소 3자 이상이어야 합니다';
    } else if (title.length > 100) {
      newErrors.title = '제목은 최대 100자까지 입력 가능합니다';
    }

    // 마감일 검사 (과거 날짜 방지)
    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.dueDate);
      if (selectedDate < today) {
        newErrors.dueDate = '과거 날짜는 선택할 수 없습니다';
      }
    }

    // 라벨 개수 검사
    if (labels.length > 5) {
      newErrors.labels = '라벨은 최대 5개까지만 추가할 수 있습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // 실제 API 호출 시뮬레이션 (약간의 지연)
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      if (isEditMode && task) {
        updateTask(task.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          status: formData.status,
          priority: formData.priority,
          assigneeId: formData.assigneeId || undefined,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          labels: labels,
        });
        showToast('태스크가 수정되었습니다', 'success');
      } else {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          projectId,
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          status: formData.status,
          priority: formData.priority,
          assigneeId: formData.assigneeId || undefined,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          labels: labels,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        addTask(newTask);
        showToast('태스크가 생성되었습니다', 'success');
      }

      onClose();
    } catch (error) {
      showToast('오류가 발생했습니다', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter로 제출
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isOpen) {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 실시간 에러 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 우선순위 설정
  const priorityOptions = [
    { value: 'low', label: '낮음', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300', icon: '⚪' },
    { value: 'medium', label: '보통', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', icon: '🟢' },
    { value: 'high', label: '높음', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', icon: '🟡' },
    { value: 'urgent', label: '긴급', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', icon: '🔴' },
  ];

  // 자주 사용되는 라벨 제안
  const commonLabels = ['Frontend', 'Backend', 'Design', 'Bug', 'Feature', 'Docs', 'Testing', 'DevOps', 'API', 'UI/UX'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? '태스크 수정' : '새 태스크 만들기'}
      size="lg"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'edit'
              ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          편집
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'preview'
              ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Eye className="w-4 h-4" />
          미리보기
        </button>
      </div>

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <TaskPreview
            title={formData.title}
            description={formData.description}
            priority={formData.priority}
            assigneeId={formData.assigneeId}
            dueDate={formData.dueDate}
            labels={labels}
          />
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← 편집으로 돌아가기
            </button>
          </div>
        </div>
      )}

      {/* Edit Tab (Form) */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            태스크 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="예: 로그인 페이지 구현"
            maxLength={100}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.title ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500`}
          />
          {errors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formData.title.length}/100</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            설명
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="태스크에 대한 상세 설명을 입력하세요"
            rows={4}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            상태
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority - Button Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            우선순위
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, priority: option.value as TaskPriority }))}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-2 ${
                  formData.priority === option.value
                    ? `${option.color} border-gray-900 dark:border-white shadow-sm`
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Assignee - Custom Select with Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            담당자
          </label>
          <div className="relative">
            <select
              name="assigneeId"
              value={formData.assigneeId}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 appearance-none cursor-pointer"
            >
              <option value="">담당자 없음</option>
              {project?.members.map((member) => {
                const user = getUserById(member.userId);
                return user ? (
                  <option key={user.id} value={user.id}>
                    {user.name} - {member.position}
                  </option>
                ) : null;
              })}
            </select>

            {/* Selected User Avatar */}
            {formData.assigneeId && (() => {
              const selectedUser = getUserById(formData.assigneeId);
              return selectedUser ? (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <UserAvatar name={selectedUser.name} size="sm" />
                </div>
              ) : null;
            })()}

            {/* Dropdown Icon */}
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Member List Preview */}
          {project && project.members.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.members.slice(0, 5).map((member) => {
                const user = getUserById(member.userId);
                return user ? (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, assigneeId: user.id }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border-2 ${
                      formData.assigneeId === user.id
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <UserAvatar name={user.name} size="sm" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>
                ) : null;
              })}
              {project.members.length > 5 && (
                <div className="flex items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                  +{project.members.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            마감일
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.dueDate ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
            } bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500`}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.dueDate}</p>}
        </div>

        {/* Labels - TagInput */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            라벨
          </label>
          <TagInput
            tags={labels}
            onChange={(newLabels: string[]) => {
              setLabels(newLabels);
              if (errors.labels && newLabels.length <= 5) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.labels;
                  return next;
                });
              }
            }}
            placeholder="Frontend, Backend, Design..."
            maxTags={5}
            suggestions={commonLabels}
          />
          {errors.labels && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.labels}</p>}
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2 border-t border-gray-200 dark:border-gray-700">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Cmd/Ctrl + Enter</kbd>로 빠르게 저장할 수 있습니다
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>저장 중...</span>
              </>
            ) : (
              <span>{isEditMode ? '수정' : '생성'}</span>
            )}
          </button>
        </div>
      </form>
      )}
    </Modal>
  );
}
