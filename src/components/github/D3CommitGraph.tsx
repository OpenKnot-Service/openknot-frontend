import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { GitHubCommit, GitHubBranch } from '../../types';
import { RotateCcw, GitBranch, Code, Wrench, Flame, Bug, Tag } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

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
}

// Branch color mapping (light mode / dark mode)
const branchColors: Record<string, { light: string; dark: string }> = {
  main: { light: '#2563eb', dark: '#60a5fa' },      // blue
  master: { light: '#2563eb', dark: '#60a5fa' },    // blue
  develop: { light: '#9333ea', dark: '#c084fc' },   // purple
  development: { light: '#9333ea', dark: '#c084fc' }, // purple
};

const featureColors = [
  { light: '#16a34a', dark: '#4ade80' },  // green
  { light: '#ea580c', dark: '#fb923c' },  // orange
  { light: '#ec4899', dark: '#f472b6' },  // pink
  { light: '#eab308', dark: '#facc15' },  // yellow
  { light: '#06b6d4', dark: '#22d3ee' },  // cyan
  { light: '#8b5cf6', dark: '#a78bfa' },  // violet
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

// Get icon component for branch type
function getBranchIcon(type: BranchType) {
  switch (type) {
    case 'main': return GitBranch;
    case 'develop': return Code;
    case 'feature': return Wrench;
    case 'hotfix': return Flame;
    case 'bugfix': return Bug;
    case 'release': return Tag;
    default: return GitBranch;
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

// Visual hierarchy styles
function getBranchStyles(type: BranchType) {
  switch (type) {
    case 'main':
      return {
        fontSize: '14px',
        fontWeight: '700',
        iconSize: 18,
        bgOpacity: 0.3,
      };
    case 'develop':
      return {
        fontSize: '13px',
        fontWeight: '600',
        iconSize: 16,
        bgOpacity: 0.2,
      };
    default:
      return {
        fontSize: '12px',
        fontWeight: '400',
        iconSize: 14,
        bgOpacity: 0.15,
      };
  }
}

export default function D3CommitGraph({
  commits,
  branches: _branches,
  onCommitClick,
  selectedCommitSha,
  filters
}: D3CommitGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
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
        x: column * 50 + 30,  // 50px between columns, 30px offset
        y: index * 60 + 40,    // 60px between rows, 40px offset
        column,
        color,
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
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition()
        .duration(750)
        .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
      setTransform(d3.zoomIdentity);
    }
  };

  // D3 rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.max(600, graphData.nodes.length * 60 + 80);

    // Clear previous content
    svg.selectAll('*').remove();

    // Set dimensions
    svg.attr('width', width).attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        setTransform(event.transform);
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Create main group
    const g = svg.append('g').attr('transform', transform.toString());

    // Draw lines between commits (parent-child relationships)
    const lines = g.append('g').attr('class', 'commit-lines');

    graphData.nodes.forEach((node) => {
      const parentsToRender: string[] = [];

      // Add actual parents that exist in commitMap
      node.commit.parents.forEach((parentSha) => {
        if (graphData.commitMap.has(parentSha)) {
          parentsToRender.push(parentSha);
        }
      });

      // If no valid parents, add virtual parent
      if (parentsToRender.length === 0) {
        const virtualParent = graphData.virtualParents.get(node.commit.sha);
        if (virtualParent && graphData.commitMap.has(virtualParent)) {
          parentsToRender.push(virtualParent);
        }
      }

      // Draw lines
      parentsToRender.forEach((parentSha) => {
        const parent = graphData.commitMap.get(parentSha);
        if (parent) {
          // Determine if it's a merge (curved line) or normal (straight line)
          const isMerge = node.commit.parents.length > 1;
          const path = isMerge
            ? `M ${node.x} ${node.y} Q ${(node.x + parent.x) / 2} ${(node.y + parent.y) / 2} ${parent.x} ${parent.y}`
            : `M ${node.x} ${node.y} L ${parent.x} ${parent.y}`;

          lines.append('path')
            .attr('d', path)
            .attr('stroke', node.color)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('opacity', 0.6);
        }
      });
    });

    // Draw commit nodes
    const nodeGroup = g.append('g').attr('class', 'commit-nodes');

    graphData.nodes.forEach((node) => {
      const group = nodeGroup.append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .style('cursor', 'pointer')
        .on('click', () => onCommitClick?.(node.commit));

      // Node circle
      const isSelected = node.commit.sha === selectedCommitSha;

      group.append('circle')
        .attr('r', isSelected ? 7 : 5)
        .attr('fill', isSelected ? node.color : (isDark ? '#1f2937' : '#ffffff'))
        .attr('stroke', node.color)
        .attr('stroke-width', 2)
        .on('mouseenter', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 8)
            .attr('stroke-width', 3);
        })
        .on('mouseleave', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', isSelected ? 7 : 5)
            .attr('stroke-width', 2);
        });

      // Commit message (on hover)
      group.append('title')
        .text(`${node.commit.message}\n${node.commit.author.name}\n${node.commit.sha.substring(0, 7)}`);

      // SHA label (to the right of node)
      group.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .attr('font-size', '12px')
        .attr('fill', isDark ? '#9ca3af' : '#6b7280')
        .text(node.commit.sha.substring(0, 7));

      // Commit message (truncated)
      group.append('text')
        .attr('x', 70)
        .attr('y', 5)
        .attr('font-size', '13px')
        .attr('fill', isDark ? '#e5e7eb' : '#111827')
        .text(node.commit.message.length > 50
          ? node.commit.message.substring(0, 50) + '...'
          : node.commit.message);
    });

  }, [graphData, isDark, transform, onCommitClick, selectedCommitSha]);

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
      {/* Branch Legend Panel */}
      <div className="w-full lg:w-48 lg:shrink-0">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 md:p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <h3 className="mb-2 md:mb-3 text-sm font-semibold text-gray-900 dark:text-white">Branches</h3>
          <div className="w-full flex flex-wrap lg:flex-col gap-2 lg:space-y-0">
            {graphData.branchList.map((branch) => {
              const Icon = getBranchIcon(branch.type);
              const styles = getBranchStyles(branch.type);

              return (
                <div
                  key={branch.name}
                  className="group w-full flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-800 overflow-hidden"
                >
                  {/* Color indicator */}
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: branch.color }}
                  />

                  {/* Icon */}
                  <Icon
                    className="shrink-0"
                    size={styles.iconSize}
                    style={{ color: branch.color }}
                  />

                  {/* Branch name with Tooltip */}
                  <Tooltip content={branch.name} className="flex-1 min-w-0">
                    <span
                      className="truncate text-gray-900 dark:text-white block"
                      style={{
                        fontSize: styles.fontSize,
                        fontWeight: styles.fontWeight,
                      }}
                    >
                      {branch.name}
                    </span>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="relative flex-1 min-w-0">
        {/* Reset Zoom Button */}
        <button
          onClick={handleResetZoom}
          className="absolute right-2 md:right-4 top-2 md:top-4 z-10 rounded-md bg-white p-1.5 md:p-2 shadow-md transition hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          title="줌 초기화"
        >
          <RotateCcw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </button>

        {/* SVG Container */}
        <div
          ref={containerRef}
          className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          style={{ minHeight: window.innerWidth < 768 ? '400px' : '600px' }}
        >
          <svg ref={svgRef} />
        </div>

        {/* Instructions */}
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          <span className="hidden sm:inline">마우스 휠로 줌, 드래그로 이동, </span>커밋 클릭으로 상세 정보 보기
        </div>
      </div>
    </div>
  );
}
