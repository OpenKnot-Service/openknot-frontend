import { useState } from 'react';
import { Check, MessageSquare, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { PullRequestLineComment } from '../../../types';

interface InlineCommentThreadProps {
  comments: PullRequestLineComment[];
  filename: string;
  lineNumber: number;
  side: 'left' | 'right';
  currentUsername: string;
  currentUserAvatar?: string;
  canAddComment?: boolean; // Whether the user can add new comments (defaults to true)
  onAddComment: (comment: string) => void;
  onResolve: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onClose?: () => void;
}

export default function InlineCommentThread({
  comments,
  filename: _filename,
  lineNumber,
  side,
  currentUsername,
  currentUserAvatar,
  canAddComment = true,
  onAddComment,
  onResolve,
  onDelete,
  onClose,
}: InlineCommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isResolved = comments.some((c) => c.resolved);
  const canResolve = comments.length > 0 && !isResolved;

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="inline-comment-thread relative isolate rounded-lg border border-slate-200/80 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-700/60 dark:bg-slate-900/80 backdrop-blur overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 bg-slate-50/80 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            <MessageSquare className="h-3.5 w-3.5" />
            {comments.length > 0 ? `${comments.length}개의 코멘트` : '새 코멘트'}
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-300 bg-white/70 px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200">
            라인 {lineNumber} · {side === 'left' ? '이전' : '변경 후'}
          </span>
          {isResolved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Check className="h-3 w-3" />
              Resolved
            </span>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="코멘트 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="inline-comment-thread-body flex-1 min-h-0 space-y-4 overflow-y-auto px-4 py-3 pr-1">
        {/* Existing Comments */}
        {comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((comment) => {
              const cardBase =
                'rounded-lg border px-3.5 py-3 shadow-sm transition-colors';
              const cardStyle = comment.resolved
                ? 'border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-800/60 dark:bg-emerald-900/20'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60';

              return (
                <div key={comment.id} className={`${cardBase} ${cardStyle}`}>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {comment.reviewerAvatar && (
                        <img
                          src={comment.reviewerAvatar}
                          alt={comment.reviewer}
                          className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800"
                        />
                      )}
                      <div className="space-y-0.5">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {comment.reviewer}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDistanceToNow(comment.createdAt, {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </div>
                      </div>
                    </div>

                    {!comment.resolved && comment.reviewer === currentUsername && (
                      <button
                        onClick={() => onDelete(comment.id)}
                        className="text-xs font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-200"
                      >
                        삭제
                      </button>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                    {comment.comment}
                  </p>

                  {comment.resolved && comment.resolvedBy && (
                    <div className="mt-3 border-t border-emerald-200/70 pt-2 text-xs font-medium text-emerald-700 dark:border-emerald-800/50 dark:text-emerald-300">
                      {comment.resolvedBy}님이 해결함
                      {comment.resolvedAt &&
                        ` · ${formatDistanceToNow(comment.resolvedAt, {
                          addSuffix: true,
                          locale: ko,
                        })}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* New Comment Form */}
        {!isResolved && canAddComment && (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {currentUserAvatar && (
                <img
                  src={currentUserAvatar}
                  alt={currentUsername}
                  className="mt-1 h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-800"
                />
              )}
              <div className="flex-1 space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="코멘트를 입력하세요... (⌘+Enter)"
                  rows={4}
                  className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
                />
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  ⌘+Enter 또는 Ctrl+Enter로 빠르게 제출할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                라인 {lineNumber} / {side === 'left' ? '이전 버전' : '변경 후'}
              </span>
              <div className="flex items-center gap-2">
                {canResolve && (
                  <button
                    onClick={() => onResolve(comments[0].id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Resolve
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  {isSubmitting ? '제출 중...' : '코멘트 작성'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message for users without comment permission */}
        {!isResolved && !canAddComment && (
          <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
            리뷰어 또는 작성자만 코멘트를 남길 수 있습니다
          </div>
        )}

        {/* Resolved State Message */}
        {isResolved && (
          <div className="rounded-md border border-emerald-200/70 bg-emerald-50/60 px-4 py-3 text-center text-sm font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-300">
            이 스레드는 해결되었습니다
          </div>
        )}
      </div>
    </div>
  );
}
