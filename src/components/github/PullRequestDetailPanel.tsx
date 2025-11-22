import { useMemo, useState } from 'react';
import {
  X,
  GitPullRequest,
  GitBranch,
  User,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  GitCommit,
  FileCode,
  Link as LinkIcon,
  ChevronDown,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { JSX } from 'react';
import type { GitHubPullRequest } from '../../types';
import DiffViewer from './diff/DiffViewer';
import { useGitHub } from '../../contexts/GitHubContext';

interface PullRequestDetailPanelProps {
  pullRequest: GitHubPullRequest | null;
  isOpen: boolean;
  onClose: () => void;
  repositoryUrl?: string;
  currentUsername?: string;
  onReviewRequest?: (pullRequest: GitHubPullRequest) => void;
  onLineCommentClick?: (filename: string, lineNumber: number, side: 'left' | 'right') => void;
}

function renderBody(body: string) {
  const lines = body.split('\n');
  const elements: JSX.Element[] = [];
  let listBuffer: string[] = [];
  let blockIndex = 0;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const keyBase = `list-${blockIndex}`;
    elements.push(
      <ul key={keyBase} className="ml-4 list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
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
        <h4 key={`heading-${idx}`} className="text-sm font-semibold text-gray-900 dark:text-white mt-4 first:mt-0">
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
    elements.push(
      <p key={`paragraph-${idx}`} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {trimmed}
      </p>
    );
  });

  flushList();
  return elements;
}

function getStateBadgeClasses(state: GitHubPullRequest['state']) {
  switch (state) {
    case 'open':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'merged':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

function getReviewerStatusChip(status: GitHubPullRequest['reviewers'][number]['status']) {
  switch (status) {
    case 'approved':
      return {
        label: '승인됨',
        classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    case 'changes_requested':
      return {
        label: '수정 요청',
        classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      };
    case 'commented':
      return {
        label: '코멘트',
        classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      };
    default:
      return {
        label: '보류 중',
        classes: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      };
  }
}

function getCheckStatusMeta(check: GitHubPullRequest['checks'][number]) {
  if (check.status === 'completed') {
    const success = check.conclusion === 'success';
    return {
      icon: success ? CheckCircle2 : AlertCircle,
      classes: success
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
      label: check.conclusion === 'success' ? '성공' : '실패',
    };
  }

  return {
    icon: Clock,
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    label: check.status === 'in_progress' ? '진행 중' : '대기 중',
  };
}

export default function PullRequestDetailPanel({
  pullRequest,
  isOpen,
  onClose,
  repositoryUrl,
  currentUsername,
  onReviewRequest,
  onLineCommentClick,
}: PullRequestDetailPanelProps) {
  const { addLineComment, resolveLineComment, deleteLineComment } = useGitHub();
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const content = useMemo(() => (pullRequest ? renderBody(pullRequest.body) : []), [pullRequest]);

  if (!pullRequest) return null;

  const toggleFileExpansion = (filename: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      return next;
    });
  };

  const getFileCommentCount = (filename: string) => {
    return (pullRequest.lineComments || []).filter(
      (c) => c.filename === filename && !c.resolved
    ).length;
  };

  const githubUrl = repositoryUrl ? `${repositoryUrl}/pull/${pullRequest.number}` : undefined;

  const createdLabel = formatDistanceToNow(pullRequest.createdAt, {
    addSuffix: true,
    locale: ko,
  });

  const updatedLabel = formatDistanceToNow(pullRequest.updatedAt, {
    addSuffix: true,
    locale: ko,
  });

  const reviewerEntry = currentUsername
    ? pullRequest.reviewers.find((reviewer) => reviewer.username === currentUsername)
    : undefined;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 z-50 h-full w-full transform border-l border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${expandedFiles.size > 0 ? 'md:max-w-[90vw] lg:max-w-[85vw]' : 'md:max-w-3xl'}`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pull Request 상세 정보</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100%-4rem)] overflow-y-auto px-4 py-6 md:px-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStateBadgeClasses(pullRequest.state)}`}>
                  {pullRequest.state === 'open' ? 'Open' : pullRequest.state === 'merged' ? 'Merged' : 'Closed'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">#{pullRequest.number}</span>
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200"
                  >
                    GitHub에서 보기
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white break-words">
                {pullRequest.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GitBranch className="h-4 w-4" />
                <span className="font-medium text-gray-900 dark:text-white">{pullRequest.headBranch}</span>
                <span>→</span>
                <span className="font-medium text-gray-900 dark:text-white">{pullRequest.baseBranch}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/40">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">커밋</div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <GitCommit className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                  {pullRequest.commits}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/40">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">파일</div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                  <FileCode className="h-4 w-4 text-purple-500 dark:text-purple-300" />
                  {pullRequest.files.length}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/40">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">추가</div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                  +{pullRequest.additions}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-700/40">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">삭제</div>
                <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-rose-600 dark:text-rose-300">
                  -{pullRequest.deletions}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">참여자</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                      {pullRequest.author.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{pullRequest.author.username}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">작성자</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Author
                  </span>
                </div>

                {pullRequest.assignees.length > 0 && (
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">담당자</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {pullRequest.assignees.map((assignee) => (
                        <span
                          key={assignee}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {assignee}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {pullRequest.reviewers.length > 0 && (
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">리뷰어</div>
                    <div className="mt-3 space-y-2">
                      {pullRequest.reviewers.map((reviewer) => {
                        const { label, classes } = getReviewerStatusChip(reviewer.status);
                        return (
                          <div key={reviewer.username} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                {reviewer.username.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {reviewer.username}
                                </div>
                              </div>
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
              </div>
            )}
          </div>
        </div>

        {pullRequest.reviewActivities && pullRequest.reviewActivities.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">리뷰 히스토리</h4>
            </div>
            <div className="space-y-3">
              {pullRequest.reviewActivities.slice().reverse().map((activity, index) => (
                <div
                  key={`${activity.reviewer}-${activity.submittedAt.getTime()}-${index}`}
                  className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{activity.reviewer}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(activity.submittedAt, { addSuffix: true, locale: ko })}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    상태: {activity.status === 'approved' ? '승인' : activity.status === 'changes_requested' ? '수정 요청' : '코멘트'}
                  </div>
                  {activity.comment && (
                    <p className="mt-2 rounded-md border border-gray-100 bg-gray-50 p-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-700/40 dark:text-gray-300">
                      {activity.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {reviewerEntry && onReviewRequest && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">내 리뷰 상태</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  현재 상태: {reviewerEntry.status === 'pending' ? '대기 중' : reviewerEntry.status === 'approved' ? '승인됨' : reviewerEntry.status === 'changes_requested' ? '수정 요청됨' : '코멘트 남김'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onReviewRequest(pullRequest)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                리뷰 작성하기
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="mb-4 flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">설명</h4>
          </div>
              <div className="space-y-2">{content.length > 0 ? content : (
                <p className="text-sm text-gray-500 dark:text-gray-400">설명 내용이 없습니다.</p>
              )}</div>
            </div>

            {pullRequest.checks.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">검증 상태</h4>
                </div>
                <div className="space-y-3">
                  {pullRequest.checks.map((check) => {
                    const statusMeta = getCheckStatusMeta(check);
                    const StatusIcon = statusMeta.icon;
                    return (
                      <div
                        key={check.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4 text-current" />
                            <span className="font-medium text-gray-900 dark:text-white">{check.name}</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {check.startedAt && (
                              <span>
                                시작: {formatDistanceToNow(check.startedAt, { addSuffix: true, locale: ko })}
                              </span>
                            )}
                            {check.completedAt && (
                              <span className="ml-2">
                                완료: {formatDistanceToNow(check.completedAt, { addSuffix: true, locale: ko })}
                              </span>
                            )}
                          </div>
                          {check.detailsUrl && (
                            <a
                              href={check.detailsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-300"
                            >
                              결과 페이지 열기
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.classes}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pullRequest.files.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <div className="mb-4 flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    변경된 파일 ({pullRequest.files.length})
                  </h4>
                </div>
                <div className="space-y-3">
                  {pullRequest.files.map((file) => {
                    const isExpanded = expandedFiles.has(file.filename);
                    const commentCount = getFileCommentCount(file.filename);

                    return (
                      <div
                        key={file.filename}
                        className="rounded-lg border border-gray-200 overflow-hidden dark:border-gray-700"
                      >
                        {/* File Header */}
                        <button
                          onClick={() => toggleFileExpansion(file.filename)}
                          className="w-full p-3 text-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/40 dark:hover:bg-gray-700/60 transition"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              )}
                              <span className="font-medium text-gray-900 dark:text-white break-all text-left">
                                {file.filename}
                              </span>
                              {commentCount > 0 && (
                                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full flex-shrink-0">
                                  <MessageSquare className="h-3 w-3" />
                                  {commentCount}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  file.status === 'added'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                    : file.status === 'removed'
                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                                    : file.status === 'renamed'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {file.status}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="text-emerald-600 dark:text-emerald-300">+{file.additions}</span>
                                <span className="text-rose-600 dark:text-rose-300">-{file.deletions}</span>
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* File Diff Viewer */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
                            <div className="min-w-full">
                              <DiffViewer
                                file={file}
                                viewMode="unified"
                                prId={pullRequest.id}
                                lineComments={pullRequest.lineComments || []}
                                currentUsername={currentUsername || ''}
                                reviewers={pullRequest.reviewers}
                                prAuthor={pullRequest.author.username}
                                onAddLineComment={(filename, lineNumber, side, comment) =>
                                  addLineComment(pullRequest.id, filename, lineNumber, side, comment)
                                }
                                onResolveComment={resolveLineComment}
                                onDeleteComment={deleteLineComment}
                                onLineCommentClick={onLineCommentClick}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pullRequest.linkedIssues.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <div className="mb-3 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">연결된 이슈</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pullRequest.linkedIssues.map((issueNumber) => (
                    <span
                      key={issueNumber}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      #{issueNumber}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">타임라인</h4>
              </div>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between gap-3">
                  <span>생성</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pullRequest.createdAt.toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>업데이트</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pullRequest.updatedAt.toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{createdLabel}</span>
                  <span>최종 업데이트 {updatedLabel}</span>
                </div>
                {pullRequest.state === 'merged' && pullRequest.mergedAt && (
                  <div className="flex items-center justify-between gap-3">
                    <span>병합</span>
                    <span className="font-medium text-purple-600 dark:text-purple-300">
                      {pullRequest.mergedAt.toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
                {pullRequest.state === 'closed' && pullRequest.closedAt && (
                  <div className="flex items-center justify-between gap-3">
                    <span>닫힘</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pullRequest.closedAt.toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
