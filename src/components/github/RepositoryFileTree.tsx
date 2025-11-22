import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileImage,
  FileText,
  MoreVertical,
  Download,
  Copy,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { GitHubTreeItem } from '../../types';

interface RepositoryFileTreeProps {
  items: GitHubTreeItem[];
  expandedPaths: string[];
  selectedFilePath?: string;
  onTogglePath: (path: string) => void;
  onSelectFile: (file: GitHubTreeItem) => void;
  onFileAction?: (action: string, file: GitHubTreeItem) => void;
  searchQuery?: string;
  fileTypeFilter?: string;
}

export function RepositoryFileTree({
  items,
  expandedPaths,
  selectedFilePath,
  onTogglePath,
  onSelectFile,
  onFileAction,
  searchQuery,
  fileTypeFilter,
}: RepositoryFileTreeProps) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [actionMenuPath, setActionMenuPath] = useState<string | null>(null);

  // Get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <FileCode className="w-4 h-4 text-blue-500" />;
      case 'json':
      case 'yml':
      case 'yaml':
      case 'toml':
        return <FileJson className="w-4 h-4 text-yellow-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'ico':
        return <FileImage className="w-4 h-4 text-purple-500" />;
      case 'md':
      case 'mdx':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileCode className="w-4 h-4 text-pink-500" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round(bytes / Math.pow(k, i) * 10) / 10} ${sizes[i]}`;
  };

  // Filter items based on search and file type filter
  const filterItems = (items: GitHubTreeItem[]): GitHubTreeItem[] => {
    return items.filter((item) => {
      // Search filter
      if (searchQuery) {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.path.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch && item.type === 'file') return false;
        // For directories, include if any children match
        if (item.type === 'dir' && item.children) {
          const hasMatchingChildren = filterItems(item.children).length > 0;
          if (!hasMatchingChildren && !matchesSearch) return false;
        }
      }

      // File type filter
      if (fileTypeFilter && item.type === 'file') {
        const extensions = fileTypeFilter.split(',');
        const hasMatchingExtension = extensions.some((ext) =>
          item.name.toLowerCase().endsWith(ext.toLowerCase())
        );
        if (!hasMatchingExtension) return false;
      }

      return true;
    });
  };

  // Render tree item
  const renderTreeItem = (item: GitHubTreeItem, depth: number = 0) => {
    const isExpanded = expandedPaths.includes(item.path);
    const isSelected = selectedFilePath === item.path;
    const isHovered = hoveredPath === item.path;
    const showActionMenu = actionMenuPath === item.path;
    const isDirectory = item.type === 'dir' || item.type === 'tree';

    const handleClick = () => {
      if (isDirectory) {
        onTogglePath(item.path);
      } else {
        onSelectFile(item);
      }
    };

    const handleActionClick = (action: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setActionMenuPath(null);
      if (onFileAction) {
        onFileAction(action, item);
      }
    };

    return (
      <div key={item.path}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer group transition ${
            isSelected
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : isHovered
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={handleClick}
          onMouseEnter={() => setHoveredPath(item.path)}
          onMouseLeave={() => setHoveredPath(null)}
        >
          {/* Expand/Collapse Icon */}
          {isDirectory ? (
            <button className="flex-shrink-0 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-5 flex-shrink-0" />
          )}

          {/* File/Folder Icon */}
          <div className="flex-shrink-0">
            {isDirectory ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500" />
              )
            ) : (
              getFileIcon(item.name)
            )}
          </div>

          {/* File Name */}
          <span
            className={`flex-1 text-sm truncate ${
              isSelected
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {item.name}
          </span>

          {/* File Size (for files only) */}
          {!isDirectory && (
            <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
              {formatSize(item.size)}
            </span>
          )}

          {/* Action Menu */}
          {!isDirectory && (
            <div className="relative flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActionMenuPath(showActionMenu ? null : item.path);
                }}
                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
              >
                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              {showActionMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
                  <button
                    onClick={(e) => handleActionClick('view', e)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                  >
                    <Eye className="w-4 h-4" />
                    파일 보기
                  </button>
                  <button
                    onClick={(e) => handleActionClick('download', e)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4" />
                    다운로드
                  </button>
                  <button
                    onClick={(e) => handleActionClick('copy_path', e)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                    경로 복사
                  </button>
                  <button
                    onClick={(e) => handleActionClick('open_github', e)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub에서 열기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Render children if directory is expanded */}
        {isDirectory && isExpanded && item.children && (
          <div>
            {filterItems(item.children).map((child) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredItems = filterItems(items);

  if (filteredItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <File className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">
            {searchQuery || fileTypeFilter ? '검색 결과가 없습니다' : '파일이 없습니다'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {filteredItems.map((item) => renderTreeItem(item))}
    </div>
  );
}
