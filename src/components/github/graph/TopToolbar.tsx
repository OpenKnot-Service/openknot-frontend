import { GitBranch, GitPullRequest, Upload, Download, RefreshCw, Folder } from 'lucide-react';
import { gitKrakenTheme } from '../../../styles/gitkraken-theme';

interface TopToolbarProps {
  currentRepo?: string;
  currentBranch?: string;
  onPull?: () => void;
  onPush?: () => void;
  onFetch?: () => void;
  onRepoChange?: () => void;
}

export default function TopToolbar({
  currentRepo = 'OpenKnot Frontend',
  currentBranch = 'main',
  onPull,
  onPush,
  onFetch,
  onRepoChange,
}: TopToolbarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b"
      style={{
        backgroundColor: gitKrakenTheme.background.tertiary,
        borderColor: gitKrakenTheme.border.primary,
      }}
    >
      {/* Left: Current Repository and Branch */}
      <div className="flex items-center gap-4">
        {/* Repository */}
        <button
          onClick={onRepoChange}
          className="flex items-center gap-2 px-3 py-1.5 rounded transition-colors hover:bg-opacity-80"
          style={{
            backgroundColor: gitKrakenTheme.background.hover,
            color: gitKrakenTheme.text.primary,
          }}
        >
          <Folder size={16} />
          <span className="text-sm font-medium">{currentRepo}</span>
        </button>

        {/* Branch */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded"
          style={{
            backgroundColor: gitKrakenTheme.background.active,
            color: gitKrakenTheme.accent.blue,
          }}
        >
          <GitBranch size={16} />
          <span className="text-sm font-semibold">{currentBranch}</span>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Pull */}
        <button
          onClick={onPull}
          className="flex items-center gap-2 px-3 py-1.5 rounded transition-all hover:scale-105"
          style={{
            backgroundColor: gitKrakenTheme.accent.blue,
            color: gitKrakenTheme.background.primary,
          }}
          title="Pull"
        >
          <Download size={16} />
          <span className="text-sm font-medium">Pull</span>
        </button>

        {/* Push */}
        <button
          onClick={onPush}
          className="flex items-center gap-2 px-3 py-1.5 rounded transition-all hover:scale-105"
          style={{
            backgroundColor: gitKrakenTheme.accent.green,
            color: gitKrakenTheme.background.primary,
          }}
          title="Push"
        >
          <Upload size={16} />
          <span className="text-sm font-medium">Push</span>
        </button>

        {/* Fetch */}
        <button
          onClick={onFetch}
          className="flex items-center gap-1 px-3 py-1.5 rounded transition-colors"
          style={{
            backgroundColor: gitKrakenTheme.background.hover,
            color: gitKrakenTheme.text.primary,
          }}
          title="Fetch"
        >
          <RefreshCw size={16} />
          <span className="text-sm">Fetch</span>
        </button>

        {/* Pull Request */}
        <button
          className="flex items-center gap-1 px-3 py-1.5 rounded transition-colors"
          style={{
            backgroundColor: gitKrakenTheme.background.hover,
            color: gitKrakenTheme.text.primary,
          }}
          title="Pull Request"
        >
          <GitPullRequest size={16} />
          <span className="text-sm">PR</span>
        </button>
      </div>
    </div>
  );
}
