import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, FileCode, FilePlus, FileMinus, FileEdit, Search, Filter } from 'lucide-react';
import type { GitHubFileChange } from '../../../types';

interface FileTreeProps {
  files: GitHubFileChange[];
  selectedFile: GitHubFileChange | null;
  onSelectFile: (file: GitHubFileChange) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filterStatus?: string[];
  onFilterChange?: (filters: string[]) => void;
}

// 파일을 폴더별로 그룹화
function groupFilesByFolder(files: GitHubFileChange[]) {
  const tree: Record<string, GitHubFileChange[]> = {};

  files.forEach((file) => {
    const parts = file.filename.split('/');
    if (parts.length === 1) {
      // 루트 파일
      if (!tree['_root']) tree['_root'] = [];
      tree['_root'].push(file);
    } else {
      // 폴더 안의 파일
      const folder = parts.slice(0, -1).join('/');
      if (!tree[folder]) tree[folder] = [];
      tree[folder].push(file);
    }
  });

  return tree;
}

// 파일 상태별 아이콘
function getFileIcon(status: string) {
  switch (status) {
    case 'added':
      return FilePlus;
    case 'removed':
      return FileMinus;
    case 'modified':
      return FileEdit;
    default:
      return FileCode;
  }
}

// 파일 상태별 색상
function getStatusColor(status: string) {
  switch (status) {
    case 'added':
      return 'text-green-600 dark:text-green-400';
    case 'removed':
      return 'text-red-600 dark:text-red-400';
    case 'modified':
      return 'text-blue-600 dark:text-blue-400';
    case 'renamed':
      return 'text-purple-600 dark:text-purple-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

export default function FileTree({
  files,
  selectedFile,
  onSelectFile,
  searchQuery = '',
  onSearchChange,
  filterStatus = [],
  onFilterChange,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // 검색 및 필터링
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // 검색 필터
      if (searchQuery && !file.filename.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 상태 필터
      if (filterStatus.length > 0 && !filterStatus.includes(file.status)) {
        return false;
      }

      return true;
    });
  }, [files, searchQuery, filterStatus]);

  // 폴더별로 그룹화
  const groupedFiles = useMemo(() => groupFilesByFolder(filteredFiles), [filteredFiles]);

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const toggleFilter = (status: string) => {
    if (!onFilterChange) return;

    if (filterStatus.includes(status)) {
      onFilterChange(filterStatus.filter((s) => s !== status));
    } else {
      onFilterChange([...filterStatus, status]);
    }
  };

  const statusFilters = [
    { value: 'modified', label: 'Modified', color: 'blue' },
    { value: 'added', label: 'Added', color: 'green' },
    { value: 'removed', label: 'Removed', color: 'red' },
    { value: 'renamed', label: 'Renamed', color: 'purple' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
        {/* Search */}
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Filter Button */}
        {onFilterChange && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md transition"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter by status
            {filterStatus.length > 0 && (
              <span className="ml-auto bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs">
                {filterStatus.length}
              </span>
            )}
          </button>
        )}

        {/* Filter Options */}
        {showFilters && onFilterChange && (
          <div className="flex flex-wrap gap-2 pt-2">
            {statusFilters.map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => toggleFilter(value)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition ${
                  filterStatus.includes(value)
                    ? `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-300`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* File Count */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {filteredFiles.length} of {files.length} files
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedFiles).map(([folder, folderFiles]) => {
          const isExpanded = expandedFolders.has(folder) || folder === '_root';
          const isRoot = folder === '_root';

          return (
            <div key={folder}>
              {/* Folder Header */}
              {!isRoot && (
                <button
                  onClick={() => toggleFolder(folder)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="font-mono text-xs">{folder}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {folderFiles.length}
                  </span>
                </button>
              )}

              {/* Files */}
              {isExpanded && (
                <div className={isRoot ? '' : 'ml-4'}>
                  {folderFiles.map((file) => {
                    const Icon = getFileIcon(file.status);
                    const colorClass = getStatusColor(file.status);
                    const fileName = file.filename.split('/').pop() || file.filename;
                    const isSelected = selectedFile?.filename === file.filename;

                    return (
                      <button
                        key={file.filename}
                        onClick={() => onSelectFile(file)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${colorClass}`} />
                        <span className="font-mono text-xs truncate flex-1 text-left">
                          {fileName}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-xs text-green-600 dark:text-green-400">
                            +{file.additions}
                          </span>
                          <span className="text-xs text-red-600 dark:text-red-400">
                            -{file.deletions}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredFiles.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FileCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files found</p>
          </div>
        )}
      </div>
    </div>
  );
}
