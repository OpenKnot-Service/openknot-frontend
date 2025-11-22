import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { currentUser, getUserById } from '../lib/mockData';
import { Comment, Subtask, FileAttachment, ActivityLog } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import UserAvatar from '../components/ui/UserAvatar';
import TagInput from '../components/ui/TagInput';
import {
  ArrowLeft,
  Calendar,
  User,
  Flag,
  Tag,
  CheckCircle2,
  Circle,
  Send,
  Paperclip,
  File,
  Image,
  X,
  Clock,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';

// 목업 데이터
const mockComments: Comment[] = [
  {
    id: 'comment-1',
    taskId: 'task-1',
    userId: 'user-1',
    content: '로그인 기능 구현 시작했습니다. OAuth 2.0을 사용할 예정입니다.',
    createdAt: new Date('2024-10-05T10:00:00'),
    updatedAt: new Date('2024-10-05T10:00:00'),
  },
  {
    id: 'comment-2',
    taskId: 'task-1',
    userId: 'user-3',
    content: '@김지수 프론트엔드 쪽 연동도 함께 진행하겠습니다!',
    createdAt: new Date('2024-10-05T14:30:00'),
    updatedAt: new Date('2024-10-05T14:30:00'),
  },
];

const mockSubtasks: Subtask[] = [
  {
    id: 'subtask-1',
    taskId: 'task-1',
    title: 'GitHub OAuth 앱 등록',
    completed: true,
    order: 0,
  },
  {
    id: 'subtask-2',
    taskId: 'task-1',
    title: '백엔드 OAuth 엔드포인트 구현',
    completed: true,
    order: 1,
  },
  {
    id: 'subtask-3',
    taskId: 'task-1',
    title: '프론트엔드 로그인 버튼 UI',
    completed: false,
    order: 2,
  },
  {
    id: 'subtask-4',
    taskId: 'task-1',
    title: '토큰 저장 및 관리',
    completed: false,
    order: 3,
  },
];

const mockFiles: FileAttachment[] = [
  {
    id: 'file-1',
    taskId: 'task-1',
    name: 'oauth-flow-diagram.png',
    size: 245000,
    type: 'image/png',
    url: '/mock/oauth-flow.png',
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-10-04T16:00:00'),
  },
  {
    id: 'file-2',
    taskId: 'task-1',
    name: 'api-spec.pdf',
    size: 1200000,
    type: 'application/pdf',
    url: '/mock/api-spec.pdf',
    uploadedBy: 'user-1',
    uploadedAt: new Date('2024-10-05T09:00:00'),
  },
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    taskId: 'task-1',
    userId: 'user-1',
    action: 'created',
    description: 'Task를 생성했습니다',
    createdAt: new Date('2024-10-01T09:00:00'),
  },
  {
    id: 'log-2',
    taskId: 'task-1',
    userId: 'user-1',
    action: 'status_changed',
    description: '상태를 "To Do"에서 "In Progress"로 변경했습니다',
    createdAt: new Date('2024-10-05T10:00:00'),
  },
  {
    id: 'log-3',
    taskId: 'task-1',
    userId: 'user-3',
    action: 'comment_added',
    description: '댓글을 추가했습니다',
    createdAt: new Date('2024-10-05T14:30:00'),
  },
];

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, projects, updateTask, deleteTask } = useApp();
  const { showToast } = useToast();

  const task = tasks.find((t) => t.id === id);
  const project = task ? projects.find((p) => p.id === task.projectId) : null;
  const assignee = task?.assigneeId ? getUserById(task.assigneeId) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const [comments, setComments] = useState<Comment[]>(
    task ? mockComments.filter((c) => c.taskId === task.id) : []
  );
  const [newComment, setNewComment] = useState('');

  const [subtasks, setSubtasks] = useState<Subtask[]>(
    task ? mockSubtasks.filter((s) => s.taskId === task.id) : []
  );
  const [newSubtask, setNewSubtask] = useState('');

  const [files, setFiles] = useState<FileAttachment[]>(
    task ? mockFiles.filter((f) => f.taskId === task.id) : []
  );

  const [activityLogs] = useState<ActivityLog[]>(
    task ? mockActivityLogs.filter((l) => l.taskId === task.id) : []
  );

  if (!task || !project) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Task를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
          </Button>
        </Card>
      </div>
    );
  }

  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  const handleSave = () => {
    if (editedTask) {
      updateTask(task.id, {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
        priority: editedTask.priority,
        labels: editedTask.labels,
        dueDate: editedTask.dueDate,
      });
      showToast('Task가 업데이트되었습니다.', 'success');
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm('정말로 이 Task를 삭제하시겠습니까?')) {
      deleteTask(task.id);
      showToast('Task가 삭제되었습니다.', 'success');
      navigate(`/projects/${task.projectId}`);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      taskId: task.id,
      userId: currentUser.id,
      content: newComment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComments([...comments, comment]);
    setNewComment('');
    showToast('댓글이 추가되었습니다.', 'success');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setSubtasks(
      subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      )
    );
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const subtask: Subtask = {
      id: `subtask-${Date.now()}`,
      taskId: task.id,
      title: newSubtask,
      completed: false,
      order: subtasks.length,
    };
    setSubtasks([...subtasks, subtask]);
    setNewSubtask('');
    showToast('서브태스크가 추가되었습니다.', 'success');
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
    showToast('서브태스크가 제거되었습니다.', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileAttachment[] = Array.from(uploadedFiles).map((file) => ({
      id: `file-${Date.now()}-${file.name}`,
      taskId: task.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: currentUser.id,
      uploadedAt: new Date(),
    }));

    setFiles([...files, ...newFiles]);
    showToast(`${newFiles.length}개 파일이 업로드되었습니다.`, 'success');
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
    showToast('파일이 제거되었습니다.', 'success');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'review':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => navigate(`/projects/${task.projectId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {project.name}
        </Button>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                취소
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task 정보 */}
          <Card className="p-6">
            {isEditing ? (
              <input
                type="text"
                value={editedTask?.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask!, title: e.target.value })
                }
                className="text-2xl font-bold w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none mb-4"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {task.title}
              </h1>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>생성: {new Date(task.createdAt).toLocaleDateString('ko-KR')}</span>
              <span>•</span>
              <span>수정: {new Date(task.updatedAt).toLocaleDateString('ko-KR')}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                설명
              </label>
              {isEditing ? (
                <textarea
                  value={editedTask?.description || ''}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask!, description: e.target.value })
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder="Task 설명을 입력하세요..."
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {task.description || '설명이 없습니다.'}
                </p>
              )}
            </div>
          </Card>

          {/* 서브태스크 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                체크리스트
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedSubtasks}/{subtasks.length} 완료
              </span>
            </div>

            {subtasks.length > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 mb-4">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                >
                  <button
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className="flex-shrink-0"
                  >
                    {subtask.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      subtask.completed
                        ? 'line-through text-gray-500 dark:text-gray-500'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubtask();
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="새 체크리스트 항목 추가..."
              />
              <Button onClick={handleAddSubtask}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* 파일 첨부 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              첨부 파일
            </h2>

            {files.length > 0 && (
              <div className="space-y-2 mb-4">
                {files.map((file) => {
                  const uploader = getUserById(file.uploadedBy);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group"
                    >
                      <div className="flex-shrink-0">
                        {file.type.startsWith('image/') ? (
                          <Image className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <File className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatFileSize(file.size)} • {uploader?.name} •{' '}
                          {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                파일 첨부 (클릭 또는 드래그)
              </span>
            </label>
          </Card>

          {/* 댓글 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              댓글 ({comments.length})
            </h2>

            <div className="space-y-4 mb-4">
              {comments.map((comment) => {
                const author = getUserById(comment.userId);
                if (!author) return null;

                return (
                  <div key={comment.id} className="flex gap-3">
                    <UserAvatar name={author.name} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {author.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <UserAvatar name={currentUser.name} size="sm" />
              <div className="flex-1 flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder="댓글을 입력하세요..."
                />
                <Button onClick={handleAddComment}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* 활동 로그 */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              활동 히스토리
            </h2>

            <div className="space-y-3">
              {activityLogs.map((log) => {
                const user = getUserById(log.userId);
                if (!user) return null;

                return (
                  <div key={log.id} className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{user.name}</span>님이{' '}
                        {log.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(log.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 상태 */}
          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              상태
            </label>
            {isEditing ? (
              <select
                value={editedTask?.status}
                onChange={(e) =>
                  setEditedTask({ ...editedTask!, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            ) : (
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                {task.status === 'done' ? '완료' :
                 task.status === 'in_progress' ? '진행 중' :
                 task.status === 'review' ? '리뷰' : '할 일'}
              </span>
            )}
          </Card>

          {/* 담당자 */}
          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              담당자
            </label>
            {assignee ? (
              <div className="flex items-center gap-2">
                <UserAvatar name={assignee.name} size="sm" />
                <span className="text-gray-900 dark:text-white">{assignee.name}</span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">미정</span>
            )}
          </Card>

          {/* 우선순위 */}
          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Flag className="w-4 h-4" />
              우선순위
            </label>
            {isEditing ? (
              <select
                value={editedTask?.priority}
                onChange={(e) =>
                  setEditedTask({ ...editedTask!, priority: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="low">낮음</option>
                <option value="medium">중간</option>
                <option value="high">높음</option>
                <option value="urgent">긴급</option>
              </select>
            ) : (
              <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority === 'urgent' ? '긴급' :
                 task.priority === 'high' ? '높음' :
                 task.priority === 'medium' ? '중간' : '낮음'}
              </span>
            )}
          </Card>

          {/* 라벨 */}
          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              라벨
            </label>
            {isEditing ? (
              <TagInput
                tags={editedTask?.labels || []}
                onChange={(labels: string[]) =>
                  setEditedTask((prev) => (prev ? { ...prev, labels } : prev))
                }
                placeholder="라벨 입력"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* 마감일 */}
          <Card className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              마감일
            </label>
            {isEditing ? (
              <input
                type="date"
                value={
                  editedTask?.dueDate
                    ? new Date(editedTask.dueDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setEditedTask({
                    ...editedTask!,
                    dueDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : task.dueDate ? (
              <span className="text-gray-900 dark:text-white">
                {new Date(task.dueDate).toLocaleDateString('ko-KR')}
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">설정 안 됨</span>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
