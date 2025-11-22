import { useMemo, useCallback, ReactNode } from 'react';
import { Diff, Hunk, parseDiff, tokenize, getChangeKey } from 'react-diff-view';
import type { RenderToken } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import type { GitHubFileChange, PullRequestLineComment } from '../../../types';
import { FileQuestion, AlertTriangle, MessageSquare, Plus } from 'lucide-react';
import { Prism } from 'prism-react-renderer';

const globalPrism = globalThis as unknown as { Prism?: typeof Prism };
if (!globalPrism.Prism) {
  globalPrism.Prism = Prism;
}

const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  json: 'json',
  css: 'css',
  scss: 'css',
  sass: 'css',
  less: 'css',
  md: 'markdown',
  mdx: 'markdown',
  markdown: 'markdown',
  yml: 'yaml',
  yaml: 'yaml',
  html: 'markup',
  htm: 'markup',
  svg: 'markup',
  gql: 'graphql',
  graphql: 'graphql',
  go: 'go',
  rs: 'rust',
  py: 'python',
  kt: 'kotlin',
  kts: 'kotlin',
  swift: 'swift',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  mm: 'objectivec',
  m: 'objectivec',
  sql: 'sql',
  sh: 'clike',
  bash: 'clike',
  zsh: 'clike',
  java: 'clike',
  env: 'clike',
  dotenv: 'clike',
  dockerfile: 'clike',
  vue: 'markup',
  svelte: 'markup',
};

function getLanguageFromFilename(filename: string): string | null {
  const normalized = filename.toLowerCase();
  const basename = normalized.split('/').pop() || normalized;

  if (basename === 'dockerfile') {
    return 'clike';
  }

  const extension = basename.includes('.') ? basename.split('.').pop() : undefined;
  if (extension && EXTENSION_LANGUAGE_MAP[extension]) {
    return EXTENSION_LANGUAGE_MAP[extension];
  }

  if (EXTENSION_LANGUAGE_MAP[basename]) {
    return EXTENSION_LANGUAGE_MAP[basename];
  }

  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type DiffFile = ReturnType<typeof parseDiff>[number];

export type ViewMode = 'unified' | 'split' | 'full';

interface DiffViewerProps {
  file: GitHubFileChange;
  viewMode?: ViewMode;
  className?: string;
  // Inline comment support
  prId?: string;
  lineComments?: PullRequestLineComment[];
  currentUsername?: string;
  currentUserAvatar?: string;
  reviewers?: { username: string; avatarUrl?: string; status: string }[];
  prAuthor?: string;
  onAddLineComment?: (filename: string, lineNumber: number, side: 'left' | 'right', comment: string) => void;
  onResolveComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onLineCommentClick?: (filename: string, lineNumber: number, side: 'left' | 'right') => void;
}

// Unified diff를 파싱하여 react-diff-view가 사용할 수 있는 형식으로 변환
function parsePatch(patch: string): DiffFile[] | null {
  try {
    const files = parseDiff(patch);
    return files;
  } catch (error) {
    console.error('Error parsing patch:', error);
    return null;
  }
}

export default function DiffViewer({
  file,
  viewMode = 'unified',
  className = '',
  prId,
  lineComments = [],
  currentUsername = '',
  currentUserAvatar: _currentUserAvatar,
  reviewers,
  prAuthor,
  onAddLineComment,
  onResolveComment: _onResolveComment,
  onDeleteComment: _onDeleteComment,
  onLineCommentClick,
}: DiffViewerProps) {

  // patch가 없는 경우를 처리
  const diffFiles = useMemo(() => {
    if (!file.patch) {
      return null;
    }

    return parsePatch(file.patch);
  }, [file.patch]);

  const diffFile = diffFiles?.[0] ?? null;
  const language = useMemo(() => getLanguageFromFilename(file.filename), [file.filename]);
  const tokens = useMemo(() => tokenize(diffFile?.hunks ?? [], {}), [diffFile?.hunks]);

  // Helper to get comments for a specific line
  const getCommentsForLine = useCallback((lineNumber: number, side: 'left' | 'right') => {
    return lineComments.filter(
      (c) => c.filename === file.filename && c.lineNumber === lineNumber && c.side === side
    );
  }, [lineComments, file.filename]);

  // Helper to check if a line has comments
  const hasComments = useCallback((lineNumber: number, side: 'left' | 'right') => {
    return getCommentsForLine(lineNumber, side).length > 0;
  }, [getCommentsForLine]);

  // Check if current user is authorized to comment (reviewer or author)
  const canComment = useMemo(() => {
    if (!currentUsername) {
      return false;
    }

    // Must have either callback
    if (!onAddLineComment && !onLineCommentClick) {
      return false;
    }

    // PR author can always comment
    if (prAuthor && currentUsername === prAuthor) {
      return true;
    }

    // Check if user is in reviewers list
    const isReviewer = reviewers?.some(r => r.username === currentUsername) ?? false;
    return isReviewer;
  }, [currentUsername, prAuthor, reviewers, onAddLineComment, onLineCommentClick, prId]);

  // Create widgets for inline comments
  const widgets = useMemo(() => {
    if (!prId || !diffFile) return {};

    const result: Record<string, ReactNode> = {};

    diffFile.hunks.forEach((hunk) => {
      hunk.changes.forEach((change) => {
        let lineNumber: number | undefined;
        let side: 'left' | 'right';

        if (change.type === 'delete') {
          lineNumber = change.lineNumber;
          side = 'left';
        } else if (change.type === 'insert') {
          lineNumber = change.lineNumber;
          side = 'right';
        } else {
          lineNumber = change.newLineNumber;
          side = 'right';
        }

        if (!lineNumber) return;

        const comments = getCommentsForLine(lineNumber, side);

        // Generate the change key using getChangeKey
        const changeKey = getChangeKey(change);

        // Only add widget if user can comment OR there are existing comments
        if (canComment || comments.length > 0) {
          const commentCount = comments.length;
          const widgetClassName = [
            'diff-widget-container',
            commentCount > 0 ? 'has-comments' : '',
          ]
            .filter(Boolean)
            .join(' ');
          const containerClassName = [
            'diff-comment-button-container',
            commentCount > 0 ? 'has-comments' : '',
          ]
            .filter(Boolean)
            .join(' ');
          const buttonClassName = [
            'diff-comment-button',
            commentCount > 0 ? 'has-comments' : '',
          ]
            .filter(Boolean)
            .join(' ');

          result[changeKey] = (
            <div key={`widget-${lineNumber}-${side}`} className={widgetClassName}>
              {/* Comment Button - always rendered, shown on hover via CSS */}
              {canComment && (
                <div className={containerClassName}>
                  <button
                    onClick={() => onLineCommentClick?.(file.filename, lineNumber, side)}
                    className={buttonClassName}
                    title={hasComments(lineNumber, side) ? `${comments.length}개의 코멘트` : '코멘트 추가'}
                    aria-label={hasComments(lineNumber, side) ? `${comments.length}개의 코멘트` : '코멘트 추가'}
                    data-comment-count={commentCount > 0 ? commentCount : undefined}
                  >
                    {hasComments(lineNumber, side) ? (
                      <MessageSquare className="h-2.5 w-2.5" />
                    ) : (
                      <Plus className="h-2.5 w-2.5" />
                    )}
                    <span className="sr-only">
                      {hasComments(lineNumber, side) ? `${comments.length}개의 코멘트` : '코멘트 추가'}
                    </span>
                  </button>
                </div>
              )}

            </div>
          );
        }
      });
    });

    return result;
  }, [
    prId,
    diffFile,
    canComment,
    file.filename,
    onLineCommentClick,
    getCommentsForLine,
    hasComments,
  ]);


  const renderToken = useMemo<RenderToken | undefined>(() => {
    if (!language) {
      return undefined;
    }

    const grammar = Prism.languages[language];

    if (!grammar) {
      return undefined;
    }

    const highlightToken: RenderToken = (token, defaultRender, index) => {
      if (token.type !== 'text' || typeof token.value !== 'string') {
        return defaultRender(token, index);
      }

      const highlighted = Prism.highlight(token.value, grammar, language);
      const safeHtml =
        typeof highlighted === 'string' && highlighted.length > 0
          ? highlighted
          : token.value.length > 0
            ? escapeHtml(token.value)
            : '&nbsp;';

      return (
        <span
          key={index}
          className="diff-code-token"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      );
    };

    return highlightToken;
  }, [language]);

  // 파일 상태에 따른 메시지
  const getStatusMessage = () => {
    switch (file.status) {
      case 'added':
        return { icon: FileQuestion, text: '새로 추가된 파일입니다', color: 'text-green-600 dark:text-green-400' };
      case 'removed':
        return { icon: AlertTriangle, text: '삭제된 파일입니다', color: 'text-red-600 dark:text-red-400' };
      case 'renamed':
        return { icon: FileQuestion, text: `${file.previousFilename} → ${file.filename}으로 이름이 변경되었습니다`, color: 'text-blue-600 dark:text-blue-400' };
      default:
        return null;
    }
  };

  // patch가 없는 경우 처리
  if (!file.patch) {
    const statusMsg = getStatusMessage();

    return (
      <div className={`rounded-md border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {statusMsg && (
            <>
              <statusMsg.icon className={`h-12 w-12 ${statusMsg.color}`} />
              <p className={`text-sm ${statusMsg.color}`}>{statusMsg.text}</p>
            </>
          )}
          <div className="text-gray-600 dark:text-gray-400">
            {file.status === 'added' && (
              <p className="text-sm">
                <span className="text-green-600 dark:text-green-400 font-semibold">+{file.additions}</span> 라인 추가
              </p>
            )}
            {file.status === 'removed' && (
              <p className="text-sm">
                <span className="text-red-600 dark:text-red-400 font-semibold">-{file.deletions}</span> 라인 삭제
              </p>
            )}
            {file.status === 'modified' && file.changes > 0 && (
              <p className="text-sm">
                <span className="text-green-600 dark:text-green-400">+{file.additions}</span>
                {' / '}
                <span className="text-red-600 dark:text-red-400">-{file.deletions}</span>
                {' '}
                ({file.changes} 변경)
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            상세 diff를 보려면 patch 데이터가 필요합니다
          </p>
        </div>
      </div>
    );
  }

  if (!diffFile) {
    return (
      <div className={`rounded-md border border-gray-200 dark:border-gray-700 p-6 text-center ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">Diff를 파싱할 수 없습니다</p>
      </div>
    );
  }

  const diffContent = (
    <div className={`diff-viewer-container ${viewMode === 'full' ? 'full-view' : ''}`}>
      <style>{`
        .diff-viewer-shell {
          width: 100%;
        }
        .diff-viewer-container {
          --diff-font-family: 'JetBrains Mono', 'Fira Code', monospace;
          --diff-background-color: transparent;
          --diff-text-color: rgb(17 24 39);
          --diff-selection-background-color: rgba(59, 130, 246, 0.2);
          --diff-selection-text-color: rgb(17 24 39);
          --diff-gutter-insert-background-color: rgb(220 252 231);
          --diff-gutter-insert-text-color: rgb(21 128 61);
          --diff-gutter-delete-background-color: rgb(254 226 226);
          --diff-gutter-delete-text-color: rgb(185 28 28);
          --diff-gutter-selected-background-color: rgb(226 232 240);
          --diff-gutter-selected-text-color: rgb(30 64 175);
          --diff-code-insert-background-color: rgb(236 253 245);
          --diff-code-insert-text-color: rgb(22 101 52);
          --diff-code-insert-edit-background-color: rgba(34, 197, 94, 0.3);
          --diff-code-delete-background-color: rgb(254 228 226);
          --diff-code-delete-text-color: rgb(153 27 27);
          --diff-code-delete-edit-background-color: rgba(239, 68, 68, 0.35);
          --diff-code-selected-background-color: rgb(226 232 240);
          --diff-code-selected-text-color: rgb(17 24 39);
          --diff-omit-gutter-line-color: rgba(107, 114, 128, 0.65);
          width: 100%;
          position: relative;
        }
        .diff-viewer-container .diff {
          width: 100%;
          table-layout: auto;
        }
        .diff-viewer-container table {
          width: 100%;
          min-width: 100%;
        }
        .diff-viewer-container .diff-code {
          max-width: none;
          white-space: pre;
          word-wrap: normal;
          overflow-wrap: normal;
          width: 100%;
        }
        .dark .diff-viewer-container {
          --diff-background-color: transparent;
          --diff-text-color: rgb(229 231 235);
          --diff-selection-background-color: rgba(96, 165, 250, 0.32);
          --diff-selection-text-color: rgb(248 250 252);
          --diff-gutter-insert-background-color: rgba(34, 197, 94, 0.22);
          --diff-gutter-insert-text-color: rgb(187 247 208);
          --diff-gutter-delete-background-color: rgba(248, 113, 113, 0.22);
          --diff-gutter-delete-text-color: rgb(254 205 211);
          --diff-gutter-selected-background-color: rgba(148, 163, 184, 0.35);
          --diff-gutter-selected-text-color: rgb(191 219 254);
          --diff-code-insert-background-color: rgba(34, 197, 94, 0.18);
          --diff-code-insert-text-color: rgb(220 252 231);
          --diff-code-insert-edit-background-color: rgba(34, 197, 94, 0.35);
          --diff-code-delete-background-color: rgba(248, 113, 113, 0.18);
          --diff-code-delete-text-color: rgb(254 226 226);
          --diff-code-delete-edit-background-color: rgba(248, 113, 113, 0.32);
          --diff-code-selected-background-color: rgba(148, 163, 184, 0.25);
          --diff-code-selected-text-color: rgb(226 232 240);
          --diff-omit-gutter-line-color: rgba(148, 163, 184, 0.5);
        }
        .diff-viewer-container .diff {
          background-color: transparent;
          width: 100%;
        }
        .diff-viewer-container .diff-gutter {
          user-select: none;
          min-width: 3.5rem;
          padding: 0 0.75rem;
          text-align: right;
          border-right: 1px solid rgba(148, 163, 184, 0.35);
          background-color: transparent;
        }
        .dark .diff-viewer-container .diff-gutter {
          border-right-color: rgba(71, 85, 105, 0.55);
        }
        .diff-viewer-container .diff-code {
          padding: 0 0.75rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: var(--diff-text-color);
          width: 100%;
          min-width: 0;
        }
        .dark .diff-viewer-container .diff-code {
          color: var(--diff-text-color);
        }
        .diff-viewer-container .diff-code pre {
          margin: 0;
        }
        .diff-viewer-container .diff-line {
          transition: background-color 0.15s ease;
          position: relative;
        }
        .diff-viewer-container .diff-line:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }
        .dark .diff-viewer-container .diff-line:hover {
          background-color: rgba(96, 165, 250, 0.18);
        }
        .diff-viewer-container .diff-code-insert,
        .diff-viewer-container .diff-code-delete {
          position: relative;
        }
        .diff-viewer-container .diff-code-insert::before,
        .diff-viewer-container .diff-code-delete::before {
          content: '';
          position: absolute;
          top: 2px;
          bottom: 2px;
          left: 0;
          width: 3px;
          border-radius: 9999px;
        }
        .diff-viewer-container .diff-code-insert::before {
          background-color: rgb(34 197 94);
        }
        .diff-viewer-container .diff-code-delete::before {
          background-color: rgb(239 68 68);
        }
        .diff-viewer-container .diff-gutter-omit:before {
          background-color: var(--diff-omit-gutter-line-color);
        }
        .diff-viewer-container .diff-code-token {
          display: inline;
          white-space: inherit;
        }
        .diff-viewer-container .diff-code-token .token.comment,
        .diff-viewer-container .diff-code-token .token.prolog,
        .diff-viewer-container .diff-code-token .token.doctype,
        .diff-viewer-container .diff-code-token .token.cdata {
          color: rgb(100 116 139);
          font-style: italic;
        }
        .dark .diff-viewer-container .diff-code-token .token.comment,
        .dark .diff-viewer-container .diff-code-token .token.prolog,
        .dark .diff-viewer-container .diff-code-token .token.doctype,
        .dark .diff-viewer-container .diff-code-token .token.cdata {
          color: rgb(148 163 184);
        }
        .diff-viewer-container .diff-code-token .token.punctuation {
          color: rgb(71 85 105);
        }
        .dark .diff-viewer-container .diff-code-token .token.punctuation {
          color: rgb(148 163 184);
        }
        .diff-viewer-container .diff-code-token .token.property,
        .diff-viewer-container .diff-code-token .token.tag,
        .diff-viewer-container .diff-code-token .token.boolean,
        .diff-viewer-container .diff-code-token .token.number,
        .diff-viewer-container .diff-code-token .token.constant,
        .diff-viewer-container .diff-code-token .token.symbol,
        .diff-viewer-container .diff-code-token .token.deleted {
          color: rgb(30 64 175);
        }
        .dark .diff-viewer-container .diff-code-token .token.property,
        .dark .diff-viewer-container .diff-code-token .token.tag,
        .dark .diff-viewer-container .diff-code-token .token.boolean,
        .dark .diff-viewer-container .diff-code-token .token.number,
        .dark .diff-viewer-container .diff-code-token .token.constant,
        .dark .diff-viewer-container .diff-code-token .token.symbol,
        .dark .diff-viewer-container .diff-code-token .token.deleted {
          color: rgb(191 219 254);
        }
        .diff-viewer-container .diff-code-token .token.selector,
        .diff-viewer-container .diff-code-token .token.attr-name,
        .diff-viewer-container .diff-code-token .token.string,
        .diff-viewer-container .diff-code-token .token.char,
        .diff-viewer-container .diff-code-token .token.builtin,
        .diff-viewer-container .diff-code-token .token.inserted {
          color: rgb(21 128 61);
        }
        .dark .diff-viewer-container .diff-code-token .token.selector,
        .dark .diff-viewer-container .diff-code-token .token.attr-name,
        .dark .diff-viewer-container .diff-code-token .token.string,
        .dark .diff-viewer-container .diff-code-token .token.char,
        .dark .diff-viewer-container .diff-code-token .token.builtin,
        .dark .diff-viewer-container .diff-code-token .token.inserted {
          color: rgb(134 239 172);
        }
        .diff-viewer-container .diff-code-token .token.operator,
        .diff-viewer-container .diff-code-token .token.entity,
        .diff-viewer-container .diff-code-token .token.url,
        .diff-viewer-container .diff-code-token .language-css .token.string,
        .diff-viewer-container .diff-code-token .style .token.string {
          color: rgb(202 138 4);
        }
        .dark .diff-viewer-container .diff-code-token .token.operator,
        .dark .diff-viewer-container .diff-code-token .token.entity,
        .dark .diff-viewer-container .diff-code-token .token.url,
        .dark .diff-viewer-container .diff-code-token .language-css .token.string,
        .dark .diff-viewer-container .diff-code-token .style .token.string {
          color: rgb(250 204 21);
        }
        .diff-viewer-container .diff-code-token .token.atrule,
        .diff-viewer-container .diff-code-token .token.attr-value,
        .diff-viewer-container .diff-code-token .token.keyword {
          color: rgb(124 58 237);
        }
        .dark .diff-viewer-container .diff-code-token .token.atrule,
        .dark .diff-viewer-container .diff-code-token .token.attr-value,
        .dark .diff-viewer-container .diff-code-token .token.keyword {
          color: rgb(196 181 253);
        }
        .diff-viewer-container .diff-code-token .token.function,
        .diff-viewer-container .diff-code-token .token.class-name {
          color: rgb(220 38 38);
        }
        .dark .diff-viewer-container .diff-code-token .token.function,
        .dark .diff-viewer-container .diff-code-token .token.class-name {
          color: rgb(252 165 165);
        }
        .diff-viewer-container .diff-code-token .token.regex,
        .diff-viewer-container .diff-code-token .token.important,
        .diff-viewer-container .diff-code-token .token.variable {
          color: rgb(217 119 6);
        }
        .dark .diff-viewer-container .diff-code-token .token.regex,
        .dark .diff-viewer-container .diff-code-token .token.important,
        .dark .diff-viewer-container .diff-code-token .token.variable {
          color: rgb(251 191 36);
        }
        .diff-viewer-container .diff-code-token .token.bold {
          font-weight: 600;
        }
        .diff-viewer-container .diff-code-token .token.italic {
          font-style: italic;
        }

        /* Inline widget row reset */
        .diff-viewer-container .diff-widget {
          position: relative;
          height: 0;
        }
        .diff-viewer-container .diff-widget-content {
          position: relative;
          padding: 0;
          height: 0;
          border: none;
        }
        .diff-viewer-container .diff-widget-container {
          position: absolute;
          top: 0.4rem;
          right: 0.5rem;
          transform: translateY(calc(-100% - 0.4rem));
          display: flex;
          justify-content: flex-end;
          z-index: 10;
        }

        /* Comment button styles */
        .diff-comment-button-container {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease, pointer-events 0s 0.15s;
        }
        tr:hover + tr .diff-comment-button-container,
        tr:focus-within + tr .diff-comment-button-container,
        tr:hover .diff-comment-button-container,
        tr:focus-within .diff-comment-button-container,
        .diff-comment-button-container.has-comments {
          opacity: 1;
          pointer-events: auto;
          transition: opacity 0.15s ease, pointer-events 0s;
        }
        .diff-comment-button {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(71, 85, 105, 0.75);
          color: white;
          border: none;
          cursor: pointer;
          pointer-events: auto;
          transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          position: relative;
        }
        .diff-comment-button.has-comments {
          background-color: rgba(37, 99, 235, 0.85);
          color: white;
        }
        .diff-comment-button:hover,
        .diff-comment-button:focus-visible {
          background-color: #2563eb;
          transform: scale(1.06);
          box-shadow: 0 8px 18px rgba(37, 99, 235, 0.22);
        }
        .diff-comment-button:focus-visible {
          outline: 2px solid rgba(37, 99, 235, 0.35);
          outline-offset: 2px;
        }
        .diff-comment-button-container.has-comments .diff-comment-button::after {
          content: attr(data-comment-count);
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 14px;
          height: 14px;
          padding: 0 3px;
          border-radius: 9999px;
          background-color: #2563eb;
          color: white;
          font-size: 9px;
          font-weight: 600;
          display: grid;
          place-items: center;
        }
        .dark .diff-comment-button {
          background-color: rgba(148, 163, 184, 0.75);
          color: rgb(15, 23, 42);
        }
        .dark .diff-comment-button.has-comments {
          background-color: rgba(96, 165, 250, 0.85);
          color: rgb(15, 23, 42);
        }
        .dark .diff-comment-button:hover,
        .dark .diff-comment-button:focus-visible {
          background-color: rgb(59, 130, 246);
          color: rgb(15, 23, 42);
        }
        .diff-viewer-container .diff-line:has(+ tr .diff-widget-container.has-comments) {
          background-color: rgba(37, 99, 235, 0.08);
        }
        .dark .diff-viewer-container .diff-line:has(+ tr .diff-widget-container.has-comments) {
          background-color: rgba(96, 165, 250, 0.12);
        }
      `}</style>

      <Diff
        viewType={viewMode === 'split' ? 'split' : 'unified'}
        diffType={file.status === 'added' ? 'add' : file.status === 'removed' ? 'delete' : 'modify'}
        hunks={diffFile?.hunks || []}
        tokens={tokens}
        renderToken={renderToken}
        gutterType="default"
        widgets={widgets}
      >
        {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
      </Diff>

      {(diffFile.hunks.length || 0) > 5 && (
        <div className="mt-2 text-center">
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            {diffFile.hunks.length || 0}개의 변경 구역 표시됨
          </button>
        </div>
      )}
    </div>
  );

  const diffContainer = (
    <div className="diff-viewer-shell">
      {diffContent}
    </div>
  );

  if (viewMode === 'full') {
    return (
      <div className={className}>
        <div className="mb-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 전체 파일 보기: 변경된 부분이 하이라이트되어 표시됩니다
          </p>
        </div>
        {diffContainer}
      </div>
    );
  }

  return <div className={className}>{diffContainer}</div>;
}
