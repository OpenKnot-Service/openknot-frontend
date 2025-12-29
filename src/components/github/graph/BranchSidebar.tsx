import { GitBranch, Code, Wrench, Flame, Bug, Tag, CheckCircle2, ChevronRight } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';
import { gitKrakenTheme } from '../../../styles/gitkraken-theme';
import { useState } from 'react';

type BranchType = 'main' | 'develop' | 'feature' | 'hotfix' | 'bugfix' | 'release' | 'other';

interface BranchInfo {
  name: string;
  column: number;
  type: BranchType;
  color: string;
  priority: number;
}

interface BranchSidebarProps {
  branches: BranchInfo[];
  selectedBranch?: string;
  currentBranch?: string;
  onBranchClick: (branchName: string) => void;
}

// Helper function to get branch icon based on type
function getBranchIcon(type: BranchType) {
  switch (type) {
    case 'main':
      return GitBranch;
    case 'develop':
      return Code;
    case 'feature':
      return Wrench;
    case 'hotfix':
      return Flame;
    case 'bugfix':
      return Bug;
    case 'release':
      return Tag;
    default:
      return GitBranch;
  }
}

// Helper function to get branch-specific styles
function getBranchStyles(type: BranchType) {
  switch (type) {
    case 'main':
      return { fontSize: '13px', fontWeight: '700', iconSize: 16 };
    case 'develop':
      return { fontSize: '12px', fontWeight: '600', iconSize: 14 };
    default:
      return { fontSize: '11px', fontWeight: '400', iconSize: 12 };
  }
}

export default function BranchSidebar({
  branches,
  selectedBranch,
  currentBranch,
  onBranchClick,
}: BranchSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="h-full overflow-y-auto"
      style={{
        backgroundColor: gitKrakenTheme.background.secondary,
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
          <GitBranch size={14} />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Branches
          </span>
        </div>
        <ChevronRight
          size={14}
          className={`transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
        />
      </button>

      {/* Branch List */}
      {!isCollapsed && (
        <div className="py-1">
          {branches.map((branch) => {
            const Icon = getBranchIcon(branch.type);
            const styles = getBranchStyles(branch.type);
            const isSelected = branch.name === selectedBranch;
            const isCurrent = branch.name === currentBranch;

            return (
              <button
                key={branch.name}
                onClick={() => onBranchClick(branch.name)}
                className={`
                  w-full flex items-center gap-2 px-3 py-1.5
                  transition-all text-left hover:scale-[1.02]
                  ${isSelected ? 'border-l-2' : 'border-l-2 border-transparent'}
                `}
                style={{
                  backgroundColor: isSelected
                    ? gitKrakenTheme.background.active
                    : 'transparent',
                  borderColor: isSelected ? gitKrakenTheme.accent.blue : 'transparent',
                  color: isSelected
                    ? gitKrakenTheme.text.bright
                    : gitKrakenTheme.text.primary,
                }}
              >
                {/* Color indicator */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: branch.color }}
                />

                {/* Branch icon */}
                <Icon
                  size={styles.iconSize}
                  style={{ color: branch.color }}
                  className="shrink-0"
                />

                {/* Branch name */}
                <Tooltip content={branch.name}>
                  <span
                    className="flex-1 truncate text-gray-900 dark:text-white"
                    style={{
                      fontSize: styles.fontSize,
                      fontWeight: styles.fontWeight,
                    }}
                  >
                    {branch.name}
                  </span>
                </Tooltip>

                {/* Checkout indicator */}
                {isCurrent && (
                  <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
