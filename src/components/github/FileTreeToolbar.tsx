import { Search, Filter, GitBranch, X } from 'lucide-react';
import { useState } from 'react';
import { GitHubBranch } from '../../types';

interface FileTreeToolbarProps {
  currentBranch: string;
  branches: GitHubBranch[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBranchChange: (branch: string) => void;
  fileTypeFilter?: string;
  onFileTypeFilterChange?: (filter: string) => void;
}

export function FileTreeToolbar({
  currentBranch,
  branches,
  searchQuery,
  onSearchChange,
  onBranchChange,
  fileTypeFilter,
  onFileTypeFilterChange,
}: FileTreeToolbarProps) {
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const fileTypes = [
    { label: '모든 파일', value: '' },
    { label: 'TypeScript', value: '.ts,.tsx' },
    { label: 'JavaScript', value: '.js,.jsx' },
    { label: 'CSS/Style', value: '.css,.scss,.sass' },
    { label: 'Config', value: '.json,.yml,.yaml,.toml' },
    { label: 'Markdown', value: '.md,.mdx' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-3 md:mb-4">
      {/* Branch Selector */}
      <div className="relative">
        <button
          onClick={() => {
            setShowBranchDropdown(!showBranchDropdown);
            setShowFilterDropdown(false);
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition w-full md:w-auto"
        >
          <GitBranch className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium truncate">
            {currentBranch}
          </span>
        </button>

        {showBranchDropdown && (
          <div className="absolute top-full left-0 mt-1 w-full md:w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {branches.map((branch) => (
              <button
                key={branch.name}
                onClick={() => {
                  onBranchChange(branch.name);
                  setShowBranchDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  branch.name === currentBranch
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate flex-1 min-w-0">{branch.name}</span>
                  {branch.isDefault && (
                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded flex-shrink-0">
                      default
                    </span>
                  )}
                </div>
                {branch.lastCommit && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {branch.lastCommit.message}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="파일 검색..."
          className="w-full pl-10 pr-10 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* File Type Filter */}
      {onFileTypeFilterChange && (
        <div className="relative">
          <button
            onClick={() => {
              setShowFilterDropdown(!showFilterDropdown);
              setShowBranchDropdown(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition w-full md:w-auto ${
              fileTypeFilter
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">
              {fileTypes.find((ft) => ft.value === fileTypeFilter)?.label || '필터'}
            </span>
          </button>

          {showFilterDropdown && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
              {fileTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    onFileTypeFilterChange(type.value);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                    type.value === fileTypeFilter
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
