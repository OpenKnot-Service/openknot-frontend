import { Search, ExternalLink, X, Rows, Columns, FileText, Sparkles } from 'lucide-react';
import type { ViewMode } from './DiffViewer';

interface DiffViewerToolbarProps {
  fileName: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  githubUrl?: string;
  showAIReview?: boolean;
  onToggleAIReview?: () => void;
  aiReviewEnabled?: boolean;
  onClose?: () => void;
}

export default function DiffViewerToolbar({
  fileName,
  viewMode,
  onViewModeChange,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  githubUrl,
  showAIReview = false,
  onToggleAIReview,
  aiReviewEnabled = false,
  onClose,
}: DiffViewerToolbarProps) {
  const viewModes: { mode: ViewMode; label: string; icon: typeof Rows }[] = [
    { mode: 'unified', label: 'Unified', icon: Rows },
    { mode: 'split', label: 'Split', icon: Columns },
    { mode: 'full', label: 'Full', icon: FileText },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      {/* Left: View Mode Buttons */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          {viewModes.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${
                viewMode === mode
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              } ${mode !== 'unified' ? 'border-l border-gray-200 dark:border-gray-600' : ''}`}
              title={`${label} View`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* File Name */}
        <div className="hidden md:block">
          <span className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {fileName}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        {showSearch && onSearchChange && (
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search in file..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* AI Review Toggle */}
        {showAIReview && onToggleAIReview && (
          <button
            onClick={onToggleAIReview}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
              aiReviewEnabled
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            title="AI 코드 리뷰"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Review</span>
          </button>
        )}

        {/* GitHub Link */}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition"
            title="GitHub에서 보기"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
            title="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
