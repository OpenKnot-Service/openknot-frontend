import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Copy } from 'lucide-react';
import { GitHubCommit } from '../../../types';

interface GraphNode {
  commit: GitHubCommit;
  x: number;
  y: number;
  column: number;
  color: string;
  timeIndex: number;
}

interface CommitInfoPanelProps {
  nodes: GraphNode[];
  onCommitClick?: (commit: GitHubCommit) => void;
  selectedSha?: string;
  commitSpacing: number;
}

export default function CommitInfoPanel({
  nodes,
  onCommitClick,
  selectedSha,
  commitSpacing,
}: CommitInfoPanelProps) {
  const handleCopySha = (sha: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sha);
    // Toast notification could be shown here if Toast context is available
  };

  return (
    <div className="h-full overflow-y-auto py-4 bg-gray-50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-700">
      <h3 className="px-4 mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        Commit History
      </h3>
      <div className="space-y-0">
        {nodes.map((node) => {
          const commit = node.commit;
          const isSelected = commit.sha === selectedSha;

          return (
            <div
              key={commit.sha}
              className={`
                px-4 py-3 cursor-pointer
                transition-colors border-l-2
                ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
                }
              `}
              onClick={() => onCommitClick?.(commit)}
              style={{
                minHeight: `${commitSpacing}px`,
              }}
            >
              {/* Commit Message */}
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1.5 line-clamp-2">
                {commit.message}
              </div>

              {/* SHA + Timestamp */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    {commit.sha.substring(0, 7)}
                  </code>
                  <button
                    onClick={(e) => handleCopySha(commit.sha, e)}
                    className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    title="Copy SHA"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <span>
                  {formatDistanceToNow(commit.date, { addSuffix: true, locale: ko })}
                </span>
              </div>

              {/* Author */}
              {commit.author.avatarUrl && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <img
                    src={commit.author.avatarUrl}
                    alt={commit.author.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="truncate">{commit.author.name}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
