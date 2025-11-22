import { useState, useRef, useEffect } from 'react';
import { Check, MessageSquare, X, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { PullRequestLineComment } from '../../types';

interface LineCommentSidebarProps {
  isOpen: boolean;
  comments: PullRequestLineComment[];
  filename: string;
  lineNumber: number;
  side: 'left' | 'right';
  currentUsername: string;
  currentUserAvatar?: string;
  canAddComment?: boolean;
  onAddComment: (comment: string) => void;
  onResolve: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onClose: () => void;
}

export default function LineCommentSidebar({
  isOpen,
  comments,
  filename,
  lineNumber,
  side,
  currentUsername,
  currentUserAvatar,
  canAddComment = true,
  onAddComment,
  onResolve,
  onDelete,
  onClose,
}: LineCommentSidebarProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOneLine, setIsOneLine] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isResolved = comments.some((c) => c.resolved);
  const canResolve = comments.length > 0 && !isResolved;

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get accurate scrollHeight
      textarea.style.height = 'auto';

      // Calculate new height based on scrollHeight
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 40; // 1 line height
      const maxHeight = 120; // 5 lines height

      // Set height within min/max bounds
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;

      // Update button position state
      setIsOneLine(scrollHeight <= 40);
    }
  }, [newComment]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment(''); // Auto-resize will reset height via useEffect
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter to submit (like chat UX), Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[59]"
          onClick={onClose}
          style={{ marginTop: 'var(--header-height, 0px)' }}
        />

        {/* Sidebar */}
        <aside
          className="fixed top-0 right-0 h-screen w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col z-[60]"
          style={{ marginTop: 'var(--header-height, 0px)' }}
        >
        {/* Header */}
        <div className="flex-shrink-0 flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/80 px-5 py-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                라인 코멘트
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono truncate" title={filename}>
                {filename}
              </p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  라인 {lineNumber}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {side === 'left' ? '이전 버전' : '변경 후'}
                </span>
                {isResolved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <Check className="h-3 w-3" />
                    Resolved
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="사이드바 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comments List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => {
                const cardBase = 'rounded-md border px-4 py-3 shadow-sm transition-colors';
                const cardStyle = comment.resolved
                  ? 'border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-800/60 dark:bg-emerald-900/20'
                  : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60';

                return (
                  <div key={comment.id} className={`${cardBase} ${cardStyle}`}>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {comment.reviewerAvatar && (
                          <img
                            src={comment.reviewerAvatar}
                            alt={comment.reviewer}
                            className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900"
                          />
                        )}
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
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
                          className="text-xs font-medium text-rose-500 transition hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
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
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                아직 코멘트가 없습니다
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                첫 코멘트를 남겨보세요
              </p>
            </div>
          )}
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4">
          {!isResolved && canAddComment && (
            <div className="space-y-3">
              {/* Resolve Button - Above textarea */}
              {canResolve && (
                <button
                  onClick={() => onResolve(comments[0].id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                >
                  <Check className="h-4 w-4" />
                  Resolve
                </button>
              )}

              {/* Textarea with inline send button */}
              <div className="flex items-start gap-3">
                {currentUserAvatar && (
                  <img
                    src={currentUserAvatar}
                    alt={currentUsername}
                    className="mt-1 h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 flex-shrink-0"
                  />
                )}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="코멘트 입력..."
                    className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-900/40 transition-all duration-200 ease-in-out overflow-y-auto"
                    style={{
                      minHeight: '40px',
                      maxHeight: '120px',
                    }}
                  />
                  {/* Send Button - Inside textarea */}
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || isSubmitting}
                    className={`absolute right-2 p-2 rounded-md transition-all duration-200 ${
                      !newComment.trim() || isSubmitting
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95'
                    }`}
                    style={{
                      top: isOneLine ? '50%' : 'auto',
                      bottom: isOneLine ? 'auto' : '8px',
                      transform: isOneLine ? 'translateY(-50%)' : 'none',
                    }}
                    title={isSubmitting ? '전송 중...' : 'Enter로 전송, Shift+Enter로 줄바꿈'}
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Keyboard shortcut hint */}
              <p className="text-xs text-slate-400 dark:text-slate-500 pl-12">
                💡 Enter로 전송, Shift+Enter로 줄바꿈
              </p>
            </div>
          )}

          {/* Message for users without comment permission */}
          {!isResolved && !canAddComment && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              리뷰어 또는 작성자만 코멘트를 남길 수 있습니다
            </div>
          )}

          {/* Resolved State Message */}
          {isResolved && (
            <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/60 px-4 py-3 text-center text-sm font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-300">
              이 스레드는 해결되었습니다
            </div>
          )}
        </div>
        </aside>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed inset-0 z-[60] flex items-end">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Sheet */}
        <div className="relative w-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl flex flex-col animate-slide-up">
          {/* Handle */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-700 px-4 pb-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  라인 코멘트
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono truncate">
                  {filename}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    라인 {lineNumber}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {side === 'left' ? '이전' : '변경 후'}
                  </span>
                  {isResolved && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <Check className="h-3 w-3" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Same content as desktop */}
            {comments.length > 0 && (
              <div className="space-y-3">
                {comments.map((comment) => {
                  const cardBase = 'rounded-md border px-3.5 py-3 shadow-sm';
                  const cardStyle = comment.resolved
                    ? 'border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-800/60 dark:bg-emerald-900/20'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60';

                  return (
                    <div key={comment.id} className={`${cardBase} ${cardStyle}`}>
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          {comment.reviewerAvatar && (
                            <img
                              src={comment.reviewerAvatar}
                              alt={comment.reviewer}
                              className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900"
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
                            className="text-xs font-medium text-rose-500 hover:text-rose-600"
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
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!isResolved && canAddComment && (
              <div className="space-y-3">
                {/* Resolve Button - Above textarea */}
                {canResolve && (
                  <button
                    onClick={() => onResolve(comments[0].id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Resolve
                  </button>
                )}

                {/* Textarea with inline send button */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="코멘트 입력..."
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 transition-all duration-200 ease-in-out overflow-y-auto"
                    style={{
                      minHeight: '40px',
                      maxHeight: '120px',
                    }}
                  />
                  {/* Send Button - Inside textarea */}
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || isSubmitting}
                    className={`absolute right-2 p-2 rounded-md transition-all duration-200 ${
                      !newComment.trim() || isSubmitting
                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95'
                    }`}
                    style={{
                      top: isOneLine ? '50%' : 'auto',
                      bottom: isOneLine ? 'auto' : '8px',
                      transform: isOneLine ? 'translateY(-50%)' : 'none',
                    }}
                    title={isSubmitting ? '전송 중...' : 'Enter로 전송, Shift+Enter로 줄바꿈'}
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-600 dark:border-t-blue-400" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Keyboard shortcut hint */}
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  💡 Enter로 전송, Shift+Enter로 줄바꿈
                </p>
              </div>
            )}

            {comments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  아직 코멘트가 없습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
