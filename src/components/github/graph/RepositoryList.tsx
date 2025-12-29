import { Folder, FolderGit2, ChevronRight } from 'lucide-react';
import { gitKrakenTheme } from '../../../styles/gitkraken-theme';
import { useState } from 'react';

interface Repository {
  id: string;
  name: string;
  path: string;
  isActive?: boolean;
}

interface RepositoryListProps {
  repositories: Repository[];
  currentRepoId?: string;
  onRepoSelect?: (repoId: string) => void;
}

export default function RepositoryList({
  repositories,
  currentRepoId,
  onRepoSelect,
}: RepositoryListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="border-b"
      style={{
        backgroundColor: gitKrakenTheme.background.secondary,
        borderColor: gitKrakenTheme.border.primary,
      }}
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
          <FolderGit2 size={14} />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Repositories
          </span>
        </div>
        <ChevronRight
          size={14}
          className={`transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
        />
      </button>

      {/* Repository List */}
      {!isCollapsed && (
        <div className="py-1">
          {repositories.map((repo) => {
            const isActive = repo.id === currentRepoId;

            return (
              <button
                key={repo.id}
                onClick={() => onRepoSelect?.(repo.id)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2
                  transition-all hover:bg-opacity-80
                  ${isActive ? 'border-l-2' : ''}
                `}
                style={{
                  backgroundColor: isActive
                    ? gitKrakenTheme.background.active
                    : 'transparent',
                  color: isActive
                    ? gitKrakenTheme.text.bright
                    : gitKrakenTheme.text.primary,
                  borderColor: isActive ? gitKrakenTheme.accent.blue : 'transparent',
                }}
              >
                <Folder
                  size={14}
                  style={{
                    color: isActive
                      ? gitKrakenTheme.accent.blue
                      : gitKrakenTheme.text.secondary,
                  }}
                />
                <div className="flex-1 text-left">
                  <div className="text-xs font-medium truncate">{repo.name}</div>
                  <div
                    className="text-[10px] truncate"
                    style={{ color: gitKrakenTheme.text.muted }}
                  >
                    {repo.path}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
