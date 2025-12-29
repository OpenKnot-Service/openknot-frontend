import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Copy, ChevronRight } from 'lucide-react';
import { GitHubCommit } from '../../../types';
import { gitKrakenTheme } from '../../../styles/gitkraken-theme';
import { useState } from 'react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopySha = (sha: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sha);
    // Toast notification could be shown here if Toast context is available
  };

  return (
    <div
      className="h-full overflow-y-auto"
      style={{ backgroundColor: gitKrakenTheme.background.secondary }}
    >
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-3 py-2 transition-colors hover:bg-opacity-80"
        style={{
          backgroundColor: gitKrakenTheme.background.tertiary,
          color: gitKrakenTheme.text.secondary,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide">
            Commit History
          </span>
        </div>
        <ChevronRight
          size={14}
          className={`transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
        />
      </button>

      {/* Commit List */}
      {!isCollapsed && (
        <div className="space-y-0">
          {nodes.map((node) => {
            const commit = node.commit;
            const isSelected = commit.sha === selectedSha;

            return (
              <div
                key={commit.sha}
                className={`
                  px-3 py-2 cursor-pointer
                  transition-all hover:scale-[1.01] border-l-2
                  ${isSelected ? 'border-l-2' : 'border-l-2 border-transparent'}
                `}
                onClick={() => onCommitClick?.(commit)}
                style={{
                  minHeight: `${commitSpacing}px`,
                  backgroundColor: isSelected
                    ? gitKrakenTheme.background.active
                    : 'transparent',
                  borderColor: isSelected
                    ? gitKrakenTheme.accent.blue
                    : 'transparent',
                }}
              >
                {/* Commit Message */}
                <div
                  className="text-xs font-medium mb-1 line-clamp-2"
                  style={{
                    color: isSelected
                      ? gitKrakenTheme.text.bright
                      : gitKrakenTheme.text.primary,
                  }}
                >
                  {commit.message}
                </div>

                {/* SHA + Timestamp */}
                <div
                  className="flex items-center gap-2 text-[11px]"
                  style={{ color: gitKrakenTheme.text.secondary }}
                >
                  <div className="flex items-center gap-1">
                    <code
                      className="font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: gitKrakenTheme.background.tertiary,
                        color: gitKrakenTheme.accent.cyan,
                      }}
                    >
                      {commit.sha.substring(0, 7)}
                    </code>
                    <button
                      onClick={(e) => handleCopySha(commit.sha, e)}
                      className="p-0.5 rounded transition-colors"
                      style={{
                        color: gitKrakenTheme.text.secondary,
                      }}
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
                  <div
                    className="flex items-center gap-2 mt-2 text-xs"
                    style={{ color: gitKrakenTheme.text.muted }}
                  >
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
      )}
    </div>
  );
}
