import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { GitHubCommit, GitHubBranch } from '../../types';
import { RotateCcw } from 'lucide-react';
import BranchSidebar from './graph/BranchSidebar';
import CommitInfoPanel from './graph/CommitInfoPanel';
import VerticalCommitGraph from './graph/VerticalCommitGraph';
import TopToolbar from './graph/TopToolbar';
import { gitKrakenTheme } from '../../styles/gitkraken-theme';

interface D3CommitGraphProps {
  commits: GitHubCommit[];
  branches: GitHubBranch[];
  onCommitClick?: (commit: GitHubCommit) => void;
  selectedCommitSha?: string;
  filters?: {
    branch?: string;
    author?: string;
  };
}

interface GraphNode {
  commit: GitHubCommit;
  x: number;
  y: number;
  column: number;
  color: string;
  timeIndex: number;
}

// Branch color mapping (light mode / dark mode)
// Dark mode uses brighter neon colors for better visibility
const branchColors: Record<string, { light: string; dark: string }> = {
  main: { light: '#2563eb', dark: '#3b82f6' },      // bright blue
  master: { light: '#2563eb', dark: '#3b82f6' },    // bright blue
  develop: { light: '#9333ea', dark: '#a855f7' },   // bright purple
  development: { light: '#9333ea', dark: '#a855f7' }, // bright purple
};

const featureColors = [
  { light: '#16a34a', dark: '#10b981' },  // bright green
  { light: '#ea580c', dark: '#f97316' },  // bright orange
  { light: '#ec4899', dark: '#ec4899' },  // bright pink
  { light: '#eab308', dark: '#eab308' },  // bright yellow
  { light: '#06b6d4', dark: '#06b6d4' },  // bright cyan
  { light: '#8b5cf6', dark: '#8b5cf6' },  // bright violet
];

function getBranchColor(branchName: string, isDark: boolean): string {
  const normalized = branchName.toLowerCase();

  if (branchColors[normalized]) {
    return isDark ? branchColors[normalized].dark : branchColors[normalized].light;
  }

  // Hash branch name to get consistent color
  let hash = 0;
  for (let i = 0; i < branchName.length; i++) {
    hash = branchName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % featureColors.length;
  return isDark ? featureColors[colorIndex].dark : featureColors[colorIndex].light;
}

// Detect branch type
type BranchType = 'main' | 'develop' | 'feature' | 'hotfix' | 'bugfix' | 'release' | 'other';

function getBranchType(branchName: string): BranchType {
  const normalized = branchName.toLowerCase();

  if (normalized === 'main' || normalized === 'master') return 'main';
  if (normalized === 'develop' || normalized === 'development') return 'develop';
  if (normalized.startsWith('feature/') || normalized.startsWith('feat/')) return 'feature';
  if (normalized.startsWith('hotfix/')) return 'hotfix';
  if (normalized.startsWith('bugfix/') || normalized.startsWith('fix/')) return 'bugfix';
  if (normalized.startsWith('release/')) return 'release';

  return 'other';
}

// Get source branch for a given branch type (Git Flow)
function getSourceBranch(type: BranchType): string | null {
  switch (type) {
    case 'main':
      return null; // Main branch has no source
    case 'develop':
      return 'main'; // Develop branches from main
    case 'feature':
    case 'bugfix':
    case 'release':
      return 'develop'; // Feature/bugfix/release branch from develop
    case 'hotfix':
      return 'main'; // Hotfix branches from main
    default:
      return 'main'; // Other branches default to main
  }
}

// Get branch priority for sorting (lower = higher priority)
function getBranchPriority(type: BranchType): number {
  switch (type) {
    case 'main': return 0;
    case 'develop': return 1;
    case 'release': return 2;
    case 'hotfix': return 3;
    case 'bugfix': return 4;
    case 'feature': return 5;
    default: return 6;
  }
}

export default function D3CommitGraph({
  commits,
  branches,
  onCommitClick,
  selectedCommitSha,
  filters
}: D3CommitGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Filter commits
  const filteredCommits = useMemo(() => {
    let result = [...commits];

    if (filters?.branch) {
      result = result.filter(c => c.branch.includes(filters.branch!));
    }

    if (filters?.author) {
      result = result.filter(c =>
        c.author.name.toLowerCase().includes(filters.author!.toLowerCase()) ||
        c.author.email.toLowerCase().includes(filters.author!.toLowerCase())
      );
    }

    // Sort by date (most recent first)
    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [commits, filters]);

  // Build graph structure
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const commitMap = new Map<string, GraphNode>();
    const columnAssignments = new Map<string, number>();
    let nextColumn = 0;

    // Assign columns to branches
    const assignColumn = (branchName: string): number => {
      if (!columnAssignments.has(branchName)) {
        columnAssignments.set(branchName, nextColumn++);
      }
      return columnAssignments.get(branchName)!;
    };

    // Create nodes
    filteredCommits.forEach((commit, index) => {
      const primaryBranch = commit.branch[0] || 'unknown';
      const column = assignColumn(primaryBranch);
      const color = getBranchColor(primaryBranch, isDark);

      const node: GraphNode = {
        commit,
        x: column * 25 + 30,   // Branch (horizontal) - 25px between branches
        y: index * 28 + 20,    // Time (vertical) - 28px between commits (compact)
        column,
        color,
        timeIndex: index,
      };

      nodes.push(node);
      commitMap.set(commit.sha, node);
    });

    // Create sorted branch list with metadata
    const branchList = Array.from(columnAssignments.entries()).map(([name, column]) => {
      const type = getBranchType(name);
      return {
        name,
        column,
        type,
        color: getBranchColor(name, isDark),
        priority: getBranchPriority(type),
      };
    });

    // Sort branches by priority (main first, then develop, etc.)
    branchList.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.name.localeCompare(b.name);
    });

    // Create virtual parent relationships for orphan commits
    const branchCommits = new Map<string, GitHubCommit[]>();

    // Group commits by branch
    filteredCommits.forEach((commit) => {
      commit.branch.forEach((branchName) => {
        if (!branchCommits.has(branchName)) {
          branchCommits.set(branchName, []);
        }
        branchCommits.get(branchName)!.push(commit);
      });
    });

    // Sort commits within each branch by date (newest first)
    branchCommits.forEach((commits) => {
      commits.sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    // Create virtual parent map
    const virtualParents = new Map<string, string>();

    branchCommits.forEach((commits) => {
      for (let i = 0; i < commits.length - 1; i++) {
        const currentCommit = commits[i]; // newer
        const previousCommit = commits[i + 1]; // older

        // If current commit has no valid parents in commitMap, link to previous commit
        const hasValidParent = currentCommit.parents.some(
          (parentSha) => commitMap.has(parentSha)
        );

        if (!hasValidParent) {
          virtualParents.set(currentCommit.sha, previousCommit.sha);
        }
      }
    });

    // Create branch fork connections
    branchCommits.forEach((commits, branchName) => {
      if (commits.length === 0) return;

      const branchType = getBranchType(branchName);
      const sourceBranchName = getSourceBranch(branchType);

      // Skip if no source branch (e.g., main)
      if (!sourceBranchName) return;

      // Find the oldest commit in this branch
      const oldestCommit = commits[commits.length - 1];

      // Check if it already has a valid parent
      const hasValidParent = oldestCommit.parents.some(
        (parentSha) => commitMap.has(parentSha)
      );

      // If already has parent or virtual parent, skip
      if (hasValidParent || virtualParents.has(oldestCommit.sha)) return;

      // Find source branch commits (try alternatives for main/master, develop/development)
      let sourceCommits = branchCommits.get(sourceBranchName);
      if (!sourceCommits || sourceCommits.length === 0) {
        if (sourceBranchName === 'main') {
          sourceCommits = branchCommits.get('master');
        } else if (sourceBranchName === 'develop') {
          sourceCommits = branchCommits.get('development');
        }
      }

      if (!sourceCommits || sourceCommits.length === 0) return;

      // Find the best fork point in source branch
      // (closest commit before the oldest commit in current branch)
      let forkPoint: GitHubCommit | null = null;

      for (const sourceCommit of sourceCommits) {
        // Fork point should be older than or equal to the branch's oldest commit
        if (sourceCommit.date.getTime() <= oldestCommit.date.getTime()) {
          forkPoint = sourceCommit;
          break; // sourceCommits is sorted newest → oldest
        }
      }

      // If found a fork point, create connection
      if (forkPoint && commitMap.has(forkPoint.sha)) {
        virtualParents.set(oldestCommit.sha, forkPoint.sha);
      }
    });

    return { nodes, commitMap, columnAssignments, branchList, virtualParents };
  }, [filteredCommits, isDark]);

  // Handle zoom reset
  const handleResetZoom = () => {
    setTransform(d3.zoomIdentity);
  };

  // Calculate SVG dimensions for vertical layout
  const COMMIT_SPACING = 28;
  const BRANCH_SPACING = 25;
  const svgWidth = Math.max(800, graphData.branchList.length * BRANCH_SPACING + 200);
  const svgHeight = Math.max(600, graphData.nodes.length * COMMIT_SPACING + 100);

  const currentBranch = branches.find((b) => b.isDefault)?.name || 'main';

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: gitKrakenTheme.background.primary }}
    >
      {/* Top Toolbar */}
      <TopToolbar
        currentRepo="OpenKnot Frontend"
        currentBranch={currentBranch}
        onRepoChange={() => console.log('Repo change clicked')}
        onRefresh={() => console.log('Refresh clicked')}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Branches */}
        <div
          className="w-64 shrink-0 flex flex-col border-r overflow-hidden"
          style={{
            backgroundColor: gitKrakenTheme.background.secondary,
            borderColor: gitKrakenTheme.border.primary,
          }}
        >
          {/* Branch List */}
          <div className="flex-1 overflow-hidden">
            <BranchSidebar
              branches={graphData.branchList}
              selectedBranch={filters?.branch}
              currentBranch={currentBranch}
              onBranchClick={(branchName) => {
                console.log('Branch clicked:', branchName);
              }}
            />
          </div>
        </div>

        {/* Center: Graph Container */}
        <div className="flex-1 min-w-0 relative flex flex-col">
          {/* Reset Zoom Button */}
          <button
            onClick={handleResetZoom}
            className="absolute right-4 top-4 z-10 rounded-md p-2 shadow-lg transition-all hover:scale-110"
            style={{
              backgroundColor: gitKrakenTheme.background.tertiary,
              color: gitKrakenTheme.text.primary,
            }}
            title="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* SVG Container */}
          <div
            ref={containerRef}
            className="flex-1 overflow-hidden"
            style={{
              backgroundColor: gitKrakenTheme.background.primary,
              height: `${svgHeight}px`,
            }}
          >
            <VerticalCommitGraph
              nodes={graphData.nodes}
              commitMap={graphData.commitMap}
              virtualParents={graphData.virtualParents}
              width={svgWidth}
              height={svgHeight}
              isDark={isDark}
              selectedSha={selectedCommitSha}
              onCommitClick={onCommitClick}
              transform={transform}
              onTransformChange={setTransform}
            />
          </div>

          {/* Instructions */}
          <div
            className="px-4 py-2 text-center text-xs border-t"
            style={{
              backgroundColor: gitKrakenTheme.background.tertiary,
              color: gitKrakenTheme.text.secondary,
              borderColor: gitKrakenTheme.border.primary,
            }}
          >
            <span className="hidden sm:inline">Scroll to zoom • Drag to pan • </span>
            Click commit for details
          </div>
        </div>

        {/* Right: Commit Info Panel */}
        <div
          className="w-96 shrink-0 border-l"
          style={{
            backgroundColor: gitKrakenTheme.background.secondary,
            borderColor: gitKrakenTheme.border.primary,
          }}
        >
          <CommitInfoPanel
            nodes={graphData.nodes}
            onCommitClick={onCommitClick}
            selectedSha={selectedCommitSha}
            commitSpacing={COMMIT_SPACING}
          />
        </div>
      </div>
    </div>
  );
}
