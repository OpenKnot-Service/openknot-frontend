import { GitBranch, Code, Wrench, Flame, Bug, Tag, CheckCircle2 } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

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
  return (
    <div className="h-full overflow-y-auto py-2 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700">
      <h3 className="px-3 mb-2 text-xs font-semibold text-gray-900 dark:text-white">
        Branches
      </h3>
      <div className="space-y-1">
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
                transition-colors text-left
                ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-l-2 border-transparent'
                }
              `}
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
    </div>
  );
}
