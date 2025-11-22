import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GitHubFileChange } from '../../../types';
import FileTree from './FileTree';
import DiffViewer from './DiffViewer';
import DiffViewerToolbar from './DiffViewerToolbar';

interface FileDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: GitHubFileChange[];
  initialFile?: GitHubFileChange;
  commitSha?: string;
  repositoryUrl?: string;
}

export default function FileDiffModal({
  isOpen,
  onClose,
  files,
  initialFile,
  commitSha,
  repositoryUrl,
}: FileDiffModalProps) {
  const [selectedFile, setSelectedFile] = useState<GitHubFileChange | null>(
    initialFile || (files.length > 0 ? files[0] : null)
  );
  const [viewMode, setViewMode] = useState<'unified' | 'split' | 'full'>('unified');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  const githubUrl = selectedFile && repositoryUrl && commitSha
    ? `${repositoryUrl}/commit/${commitSha}#diff-${selectedFile.filename.replace(/\//g, '-')}`
    : undefined;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Navigate files with arrow keys
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = files.findIndex((f) => f.filename === selectedFile?.filename);

        if (currentIndex === -1) return;

        if (e.key === 'ArrowUp' && currentIndex > 0) {
          setSelectedFile(files[currentIndex - 1]);
        } else if (e.key === 'ArrowDown' && currentIndex < files.length - 1) {
          setSelectedFile(files[currentIndex + 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, files, selectedFile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 m-4 lg:m-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 shrink-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    변경된 파일
                  </h2>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {files.length} files
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* File Tree Sidebar */}
                <div className="w-80 shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
                  <FileTree
                    files={files}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                    searchQuery={fileSearchQuery}
                    onSearchChange={setFileSearchQuery}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                  />
                </div>

                {/* Diff Viewer */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {selectedFile ? (
                    <>
                      {/* Toolbar */}
                      <DiffViewerToolbar
                        fileName={selectedFile.filename}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        showSearch={true}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        githubUrl={githubUrl}
                      />

                      {/* Diff Content */}
                      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                        <DiffViewer
                          file={selectedFile}
                          viewMode={viewMode}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                          파일을 선택하여 변경 사항을 확인하세요
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Keyboard Shortcuts Help (Optional) */}
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50 shrink-0">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    <kbd className="rounded bg-gray-200 px-1.5 py-0.5 font-mono dark:bg-gray-700">
                      Esc
                    </kbd>{' '}
                    닫기
                  </span>
                  <span>
                    <kbd className="rounded bg-gray-200 px-1.5 py-0.5 font-mono dark:bg-gray-700">
                      ↑
                    </kbd>
                    <kbd className="rounded bg-gray-200 px-1.5 py-0.5 font-mono dark:bg-gray-700">
                      ↓
                    </kbd>{' '}
                    파일 이동
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
