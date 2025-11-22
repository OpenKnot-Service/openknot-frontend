import { X, GitCommit, User, Calendar, FileCode, ChevronDown, ChevronRight } from 'lucide-react';
import { GitHubCommit, GitHubFileChange } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiffViewer from './diff/DiffViewer';

interface CommitDetailPanelProps {
  commit: GitHubCommit | null;
  isOpen: boolean;
  onClose: () => void;
  onFileClick?: (file: GitHubFileChange) => void;
}

export default function CommitDetailPanel({ commit, isOpen, onClose, onFileClick }: CommitDetailPanelProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  if (!commit) return null;

  const toggleFile = (filename: string) => {
    setExpandedFile(expandedFile === filename ? null : filename);
  };

  const handleFileClick = (file: GitHubFileChange) => {
    // On mobile: Toggle accordion
    // On desktop: Call onFileClick if provided (to open modal)
    if (window.innerWidth >= 1024 && onFileClick) {
      onFileClick(file);
    } else {
      toggleFile(file.filename);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full md:max-w-2xl transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 dark:border-gray-700 dark:bg-gray-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 md:p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">커밋 상세 정보</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-3.5rem)] md:h-[calc(100%-4rem)] overflow-y-auto p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            {/* Commit Message */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white break-words">{commit.message}</h3>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-2">
              {/* Author */}
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>작성자</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {commit.author.avatarUrl && (
                    <img
                      src={commit.author.avatarUrl}
                      alt={commit.author.name}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">{commit.author.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{commit.author.email}</div>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>날짜</span>
                </div>
                <div className="mt-1 font-medium text-gray-900 dark:text-white">
                  {formatDistanceToNow(commit.date, { addSuffix: true, locale: ko })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {commit.date.toLocaleString('ko-KR')}
                </div>
              </div>
            </div>

            {/* SHA and Branches */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">SHA:</span>
                <code className="rounded bg-gray-100 px-2 py-1 text-xs md:text-sm font-mono text-gray-900 dark:bg-gray-700 dark:text-white break-all">
                  {commit.sha}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">브랜치:</span>
                <div className="flex flex-wrap gap-1">
                  {commit.branch.map((branch) => (
                    <span
                      key={branch}
                      className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {branch}
                    </span>
                  ))}
                </div>
              </div>

              {commit.parents.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">부모 커밋:</span>
                  <div className="flex flex-wrap gap-1">
                    {commit.parents.map((parentSha) => (
                      <code
                        key={parentSha}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {parentSha.substring(0, 7)}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            {commit.stats && (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 md:p-4 dark:border-gray-700 dark:bg-gray-700/50">
                <h4 className="mb-2 md:mb-3 text-sm md:text-base font-semibold text-gray-900 dark:text-white">변경 통계</h4>
                <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
                      +{commit.stats.additions}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">추가</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
                      -{commit.stats.deletions}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">삭제</div>
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {commit.stats.total}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">전체</div>
                  </div>
                </div>
              </div>
            )}

            {/* Changed Files */}
            {commit.files && commit.files.length > 0 && (
              <div>
                <div className="mb-2 md:mb-3 flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                    변경된 파일 ({commit.files.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {commit.files.map((file, index) => {
                    const isExpanded = expandedFile === file.filename;

                    return (
                      <div
                        key={index}
                        className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {/* File Header */}
                        <button
                          onClick={() => handleFileClick(file)}
                          className="w-full p-2 md:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                        >
                          <div className="flex items-start gap-2">
                            {/* Expand Icon */}
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="font-mono text-xs md:text-sm text-gray-900 dark:text-white break-all">
                                    {file.filename}
                                  </div>
                                  {file.previousFilename && (
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 break-all">
                                      이전: {file.previousFilename}
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium self-start ${
                                    file.status === 'added'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : file.status === 'removed'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                      : file.status === 'renamed'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {file.status}
                                </span>
                              </div>
                              <div className="mt-2 flex gap-3 text-xs">
                                <span className="text-green-600 dark:text-green-400">+{file.additions}</span>
                                <span className="text-red-600 dark:text-red-400">-{file.deletions}</span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  {file.changes} changes
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Diff Viewer (Accordion) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                              <div className="p-2 md:p-3 bg-gray-50 dark:bg-gray-800/50">
                                <DiffViewer
                                  file={file}
                                  viewMode="unified"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
