import { GitBranch, Folder, RefreshCw } from 'lucide-react';
import { gitKrakenTheme } from '../../../styles/gitkraken-theme';

interface TopToolbarProps {
  currentRepo?: string;
  currentBranch?: string;
  onRepoChange?: () => void;
  onRefresh?: () => void;
}

export default function TopToolbar({
  currentRepo = 'OpenKnot Frontend',
  currentBranch = 'main',
  onRepoChange,
  onRefresh,
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

      {/* Right: Refresh Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 rounded transition-all hover:scale-105"
          style={{
            backgroundColor: gitKrakenTheme.background.hover,
            color: gitKrakenTheme.text.primary,
          }}
          title="새로고침"
        >
          <RefreshCw size={16} />
          <span className="text-sm">Refresh</span>
        </button>
      </div>
    </div>
  );
}
