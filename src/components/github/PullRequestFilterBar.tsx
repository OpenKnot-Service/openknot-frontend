import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

type PRState = 'all' | 'open' | 'closed' | 'merged';
type ReviewStatus = 'all' | 'needs_review' | 'approved' | 'changes_requested';

interface PullRequestFilterBarProps {
  onSearchChange: (query: string) => void;
  onStateChange: (state: PRState) => void;
  onReviewStatusChange: (status: ReviewStatus) => void;
  onAuthorChange: (author: string) => void;
  searchQuery: string;
  selectedState: PRState;
  selectedReviewStatus: ReviewStatus;
  selectedAuthor: string;
  authors: string[];
}

export default function PullRequestFilterBar({
  onSearchChange,
  onStateChange,
  onReviewStatusChange,
  onAuthorChange,
  searchQuery,
  selectedState,
  selectedReviewStatus,
  selectedAuthor,
  authors,
}: PullRequestFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const stateOptions: { value: PRState; label: string; color: string }[] = [
    { value: 'all', label: '전체', color: 'gray' },
    { value: 'open', label: 'Open', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'red' },
    { value: 'merged', label: 'Merged', color: 'purple' },
  ];

  const reviewOptions: { value: ReviewStatus; label: string; color: string }[] = [
    { value: 'all', label: '전체', color: 'gray' },
    { value: 'needs_review', label: '리뷰 필요', color: 'yellow' },
    { value: 'approved', label: '승인됨', color: 'green' },
    { value: 'changes_requested', label: '변경 요청', color: 'red' },
  ];

  const hasActiveFilters = selectedState !== 'all' || selectedReviewStatus !== 'all' || selectedAuthor !== 'all';

  const clearFilters = () => {
    onStateChange('all');
    onReviewStatusChange('all');
    onAuthorChange('all');
  };

  return (
    <div className="space-y-3">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="PR 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
            showFilters || hasActiveFilters
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">필터</span>
          {hasActiveFilters && (
            <span className="flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">
              {[selectedState !== 'all', selectedReviewStatus !== 'all', selectedAuthor !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            title="필터 초기화"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-4">
          {/* State Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              상태
            </label>
            <div className="flex flex-wrap gap-2">
              {stateOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => onStateChange(value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    selectedState === value
                      ? `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300 ring-2 ring-${color}-500`
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Review Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              리뷰 상태
            </label>
            <div className="flex flex-wrap gap-2">
              {reviewOptions.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => onReviewStatusChange(value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                    selectedReviewStatus === value
                      ? `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300 ring-2 ring-${color}-500`
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Author Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              작성자
            </label>
            <select
              value={selectedAuthor}
              onChange={(e) => onAuthorChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 작성자</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export type { PRState, ReviewStatus };
