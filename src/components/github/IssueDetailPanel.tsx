import { useEffect, useMemo, useState, type JSX } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Flag,
  MessageSquare,
  Tag,
  User,
  Users,
  X,
  Pencil,
  Save,
  Trash2,
  Plus,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { GitHubIssue, Project } from '../../types';
import { useGitHub } from '../../contexts/GitHubContext';
import {
  canEditIssue,
  canDeleteIssue,
  canChangeIssueState,
  canManageIssueMetadata,
  canManageComment,
} from '../../utils/issuePermissions';

interface IssueDetailPanelProps {
  issue: GitHubIssue | null;
  isOpen: boolean;
  onClose: () => void;
  repositoryUrl?: string;
  assigneeOptions: string[];
  labelOptions: string[];
  milestoneOptions: string[];
  currentUsername?: string;
  currentUserId?: string;
  currentProject: Project | null;
}

function renderBody(body: string) {
  if (!body.trim()) {
    return null;
  }

  const lines = body.split('\n');
  const elements: JSX.Element[] = [];
  let listBuffer: string[] = [];
  let blockIndex = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const keyBase = `list-${blockIndex}`;
    elements.push(
      <ul
        key={keyBase}
        className="ml-4 list-disc space-y-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      >
        {listBuffer.map((item, idx) => (
          <li key={`${keyBase}-${idx}`}>{item}</li>
        ))}
      </ul>
    );
    listBuffer = [];
    blockIndex += 1;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      blockIndex += 1;
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h4
          key={`heading-${idx}`}
          className="mt-4 text-sm font-semibold text-gray-900 first:mt-0 dark:text-white"
        >
          {trimmed.substring(3)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.substring(2));
      return;
    }

    flushList();

    const parts = trimmed.split(/\*\*(.*?)\*\*/);
    elements.push(
      <p
        key={`paragraph-${idx}`}
        className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      >
        {parts.map((part, partIdx) =>
          partIdx % 2 === 1 ? (
            <strong key={`${idx}-strong-${partIdx}`} className="font-semibold text-gray-900 dark:text-white">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });

  flushList();
  return elements;
}

function getStateMeta(state: GitHubIssue['state']) {
  if (state === 'open') {
    return {
      label: 'Open',
      icon: AlertCircle,
      badgeClasses: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      toggleLabel: '이슈 닫기',
      toggleClasses: 'bg-rose-600 hover:bg-rose-700 text-white',
    };
  }
  return {
    label: 'Closed',
    icon: CheckCircle2,
    badgeClasses: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    toggleLabel: '이슈 다시 열기',
    toggleClasses: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  };
}

export default function IssueDetailPanel({
  issue,
  isOpen,
  onClose,
  repositoryUrl,
  assigneeOptions,
  labelOptions,
  milestoneOptions,
  currentUsername,
  currentUserId,
  currentProject,
}: IssueDetailPanelProps) {
  const { updateIssue, setIssueState, deleteIssue, addIssueComment, updateIssueComment, deleteIssueComment } = useGitHub();

  // Permission checks
  const hasEditPermission = useMemo(() => {
    if (!issue || !currentUserId || !currentUsername) return false;
    return canEditIssue(issue, currentProject, currentUserId, currentUsername);
  }, [issue, currentProject, currentUserId, currentUsername]);

  const hasDeletePermission = useMemo(() => {
    if (!currentUserId) return false;
    return canDeleteIssue(currentProject, currentUserId);
  }, [currentProject, currentUserId]);

  const hasStateChangePermission = useMemo(() => {
    if (!issue || !currentUserId || !currentUsername) return false;
    return canChangeIssueState(issue, currentProject, currentUserId, currentUsername);
  }, [issue, currentProject, currentUserId, currentUsername]);

  const hasMetadataPermission = useMemo(() => {
    if (!issue || !currentUserId || !currentUsername) return false;
    return canManageIssueMetadata(issue, currentProject, currentUserId, currentUsername);
  }, [issue, currentProject, currentUserId, currentUsername]);

  const [titleDraft, setTitleDraft] = useState('');
  const [bodyDraft, setBodyDraft] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [milestoneDraft, setMilestoneDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentBody, setEditingCommentBody] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!issue) return;
    setTitleDraft(issue.title);
    setBodyDraft(issue.body);
    setMilestoneDraft(issue.milestone?.title ?? '');
    setNewLabel('');
    setCommentDraft('');
    setCommentError(null);
    setEditingCommentId(null);
    setEditingCommentBody('');
    setLastSavedAt(null);
  }, [issue?.id]);

  const combinedAssignees = useMemo(() => {
    const set = new Set<string>(assigneeOptions);
    if (issue) {
      issue.assignees.forEach((assignee) => set.add(assignee));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [assigneeOptions, issue?.assignees, issue?.id]);

  const combinedLabels = useMemo(() => {
    const set = new Set<string>(labelOptions);
    if (issue) {
      issue.labels.forEach((label) => set.add(label));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [labelOptions, issue?.labels, issue?.id]);

  const combinedMilestones = useMemo(() => {
    const set = new Set<string>(milestoneOptions);
    if (issue?.milestone?.title) {
      set.add(issue.milestone.title);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [milestoneOptions, issue?.milestone?.title, issue?.id]);

  const bodyPreview = useMemo(() => renderBody(bodyDraft), [bodyDraft]);

  if (!issue) {
    return null;
  }

  const stateMeta = getStateMeta(issue.state);
  const StateIcon = stateMeta.icon;

  const createdLabel = formatDistanceToNow(issue.createdAt, { addSuffix: true, locale: ko });
  const updatedLabel = formatDistanceToNow(issue.updatedAt, { addSuffix: true, locale: ko });

  const detailsChanged = titleDraft.trim() !== issue.title || bodyDraft !== issue.body;
  const canSaveDetails = detailsChanged && titleDraft.trim().length > 0 && hasEditPermission;

  const detailsRecentlySaved = lastSavedAt ? Date.now() - lastSavedAt < 2500 : false;

  const handleSaveDetails = () => {
    if (!canSaveDetails || !hasEditPermission) {
      return;
    }

    const updated = updateIssue(issue.id, {
      title: titleDraft.trim(),
      body: bodyDraft,
    });

    if (updated) {
      setLastSavedAt(Date.now());
    }
  };

  const handleToggleAssignee = (assignee: string) => {
    if (!hasMetadataPermission) {
      return;
    }

    const nextAssignees = issue.assignees.includes(assignee)
      ? issue.assignees.filter((item) => item !== assignee)
      : [...issue.assignees, assignee];

    updateIssue(issue.id, { assignees: nextAssignees });
  };

  const handleToggleLabel = (label: string) => {
    if (!hasMetadataPermission) {
      return;
    }

    const nextLabels = issue.labels.includes(label)
      ? issue.labels.filter((item) => item !== label)
      : [...issue.labels, label];
    updateIssue(issue.id, { labels: nextLabels });
  };

  const handleAddLabel = () => {
    if (!hasMetadataPermission) {
      return;
    }

    const trimmed = newLabel.trim();
    if (!trimmed) return;
    if (issue.labels.includes(trimmed)) {
      setNewLabel('');
      return;
    }
    updateIssue(issue.id, { labels: [...issue.labels, trimmed] });
    setNewLabel('');
  };

  const handleMilestoneSelect = (value: string) => {
    if (!hasMetadataPermission) {
      return;
    }

    if (value === '__none__') {
      updateIssue(issue.id, { milestone: null });
      setMilestoneDraft('');
    } else {
      updateIssue(issue.id, { milestone: value });
      setMilestoneDraft(value);
    }
  };

  const handleMilestoneSave = () => {
    if (!hasMetadataPermission) {
      return;
    }

    const trimmed = milestoneDraft.trim();
    updateIssue(issue.id, { milestone: trimmed ? trimmed : null });
  };

  const handleStateToggle = () => {
    if (!hasStateChangePermission) {
      return;
    }

    const targetState = issue.state === 'open' ? 'closed' : 'open';
    setIssueState(issue.id, targetState);
  };

  const handleDeleteIssue = () => {
    if (!hasDeletePermission) {
      alert('권한이 없습니다. 프로젝트 관리자만 이슈를 삭제할 수 있습니다.');
      return;
    }

    if (window.confirm('이 이슈를 삭제하시겠습니까?')) {
      deleteIssue(issue.id);
      onClose();
    }
  };

  const handleAddComment = () => {
    const trimmed = commentDraft.trim();
    if (!trimmed) {
      setCommentError('코멘트를 입력해주세요.');
      return;
    }

    const created = addIssueComment(issue.id, trimmed);
    if (created) {
      setCommentDraft('');
      setCommentError(null);
    } else {
      setCommentError('코멘트를 추가하지 못했습니다. 다시 시도해주세요.');
    }
  };

  const handleEditComment = (commentId: string, body: string) => {
    setEditingCommentId(commentId);
    setEditingCommentBody(body);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentBody('');
  };

  const handleSaveCommentEdit = () => {
    if (!editingCommentId) return;
    const trimmed = editingCommentBody.trim();
    if (!trimmed) {
      return;
    }

    const updated = updateIssueComment(issue.id, editingCommentId, trimmed);
    if (updated) {
      setEditingCommentId(null);
      setEditingCommentBody('');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteIssueComment(issue.id, commentId);
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setEditingCommentBody('');
    }
  };

  const githubUrl = repositoryUrl ? `${repositoryUrl}/issues/${issue.number}` : undefined;

  // Fixed bug: should check if currentUsername exists AND matches author
  const canManageComments = (author: string) => {
    if (!currentUsername) return false;
    return canManageComment(author, currentUsername);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 z-50 h-full w-full transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 md:max-w-3xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-3 md:p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <StateIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
              이슈 상세 정보
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/30"
              >
                GitHub에서 보기
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {hasStateChangePermission && (
              <button
                onClick={handleStateToggle}
                className={`hidden sm:inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${stateMeta.toggleClasses}`}
              >
                {issue.state === 'open' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {stateMeta.toggleLabel}
              </button>
            )}
            {hasDeletePermission && (
              <button
                onClick={handleDeleteIssue}
                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-3.5rem)] overflow-y-auto p-4 md:h-[calc(100%-4rem)] md:p-6">
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${stateMeta.badgeClasses}`}
                >
                  <StateIcon className="h-4 w-4" />
                  {stateMeta.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">#{issue.number}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {createdLabel} 생성 · 업데이트 {updatedLabel}
                </span>
              </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    제목
                  </label>
                  <input
                    type="text"
                    value={titleDraft}
                    onChange={(event) => setTitleDraft(event.target.value)}
                    disabled={!hasEditPermission}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500 md:min-w-[24rem]"
                  />
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 md:pt-6">
                  {detailsRecentlySaved && (
                    <span className="text-emerald-500 dark:text-emerald-300">저장됨</span>
                  )}
                  <button
                    onClick={handleSaveDetails}
                    disabled={!canSaveDetails}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                      canSaveDetails
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Save className="h-4 w-4" />
                    변경사항 저장
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  설명
                </label>
                <textarea
                  value={bodyDraft}
                  onChange={(event) => setBodyDraft(event.target.value)}
                  disabled={!hasEditPermission}
                  rows={8}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                />
                {bodyPreview && (
                  <div className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-800/70">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      미리보기
                    </h4>
                    <div className="space-y-2">{bodyPreview}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>작성자</span>
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  {issue.author.username}
                </div>
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>생성일</span>
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {issue.createdAt.toLocaleString('ko-KR')}
                </div>
                {issue.closedAt && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Closed at {issue.closedAt.toLocaleString('ko-KR')}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2 md:flex-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    담당자
                  </label>
                  {combinedAssignees.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {combinedAssignees.map((assignee) => {
                        const isSelected = issue.assignees.includes(assignee);
                        return (
                          <button
                            key={assignee}
                            type="button"
                            onClick={() => handleToggleAssignee(assignee)}
                            disabled={!hasMetadataPermission}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300'
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                          >
                            {assignee}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      지정 가능한 담당자가 없습니다.
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:w-64">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Flag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    마일스톤
                  </label>
                  <select
                    value={issue.milestone?.title ?? '__none__'}
                    onChange={(event) => handleMilestoneSelect(event.target.value)}
                    disabled={!hasMetadataPermission}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                  >
                    <option value="__none__">마일스톤 없음</option>
                    {combinedMilestones.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={milestoneDraft}
                      onChange={(event) => setMilestoneDraft(event.target.value)}
                      disabled={!hasMetadataPermission}
                      placeholder="새로운 마일스톤 입력"
                      className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={handleMilestoneSave}
                      disabled={!hasMetadataPermission}
                      className="inline-flex items-center gap-1 rounded-md border border-blue-500 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      적용
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  라벨
                </label>
                <div className="flex flex-wrap gap-2">
                  {issue.labels.length > 0 ? (
                    issue.labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {label}
                        {hasMetadataPermission && (
                          <button
                            type="button"
                            onClick={() => handleToggleLabel(label)}
                            className="rounded-full p-0.5 text-blue-600 transition hover:bg-blue-200/60 dark:text-blue-200 dark:hover:bg-blue-800/40"
                            title="라벨 제거"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">라벨 없음</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {combinedLabels.map((label) => {
                    const isSelected = issue.labels.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleToggleLabel(label)}
                        disabled={!hasMetadataPermission}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(event) => setNewLabel(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleAddLabel();
                      }
                    }}
                    disabled={!hasMetadataPermission}
                    placeholder="새 라벨 입력"
                    className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddLabel}
                    disabled={!hasMetadataPermission}
                    className="rounded-md border border-blue-500 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    라벨 추가
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    코멘트 ({issue.comments.length})
                  </h4>
                </div>
                <button
                  onClick={handleStateToggle}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition sm:hidden ${stateMeta.toggleClasses}`}
                >
                  {stateMeta.toggleLabel}
                </button>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {issue.comments.length > 0 ? (
                  issue.comments.map((comment) => {
                    const isAuthor = canManageComments(comment.author);
                    const isEditing = editingCommentId === comment.id;
                    const createdRelative = formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                      locale: ko,
                    });
                    const updatedRelative =
                      comment.updatedAt.getTime() !== comment.createdAt.getTime()
                        ? formatDistanceToNow(comment.updatedAt, { addSuffix: true, locale: ko })
                        : null;

                    return (
                      <div key={comment.id} className="space-y-2 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {comment.author}
                            </span>
                            <span>·</span>
                            <span>{createdRelative}</span>
                            {updatedRelative && (
                              <>
                                <span>·</span>
                                <span>수정됨 {updatedRelative}</span>
                              </>
                            )}
                          </div>
                          {isAuthor && (
                            <div className="flex items-center gap-2 text-xs">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={handleCancelEditComment}
                                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    취소
                                  </button>
                                  <button
                                    onClick={handleSaveCommentEdit}
                                    disabled={!editingCommentBody.trim()}
                                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition ${
                                      editingCommentBody.trim()
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                    }`}
                                  >
                                    <Save className="h-3.5 w-3.5" />
                                    저장
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditComment(comment.id, comment.body)}
                                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    수정
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-900/30"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    삭제
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <textarea
                            value={editingCommentBody}
                            onChange={(event) => setEditingCommentBody(event.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                            {comment.body}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                    아직 코멘트가 없습니다.
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  새 코멘트 작성
                </label>
                <textarea
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                      event.preventDefault();
                      handleAddComment();
                    }
                  }}
                  rows={4}
                  placeholder="코멘트를 입력하고 Ctrl + Enter 로 등록할 수 있습니다."
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                {commentError && (
                  <p className="mt-2 text-xs text-red-500 dark:text-red-400">{commentError}</p>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleAddComment}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-gray-900"
                  >
                    <MessageSquare className="h-4 w-4" />
                    코멘트 추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
