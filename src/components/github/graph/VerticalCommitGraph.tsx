import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GitHubCommit } from '../../../types';

interface GraphNode {
  commit: GitHubCommit;
  x: number;
  y: number;
  column: number;
  color: string;
  timeIndex: number;
}

interface VerticalCommitGraphProps {
  nodes: GraphNode[];
  commitMap: Map<string, GraphNode>;
  virtualParents: Map<string, string>;
  width: number;
  height: number;
  isDark: boolean;
  selectedSha?: string;
  onCommitClick?: (commit: GitHubCommit) => void;
  transform: d3.ZoomTransform;
  onTransformChange: (transform: d3.ZoomTransform) => void;
}

const NODE_RADIUS = 3;
const SELECTED_NODE_RADIUS = 5;
const LINE_WIDTH = 1;
const BRANCH_SPACING = 25;

export default function VerticalCommitGraph({
  nodes,
  commitMap,
  virtualParents,
  width,
  height,
  isDark,
  selectedSha,
  onCommitClick,
  transform,
  onTransformChange,
}: VerticalCommitGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Set dimensions
    svg.attr('width', width).attr('height', height);

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .translateExtent([
        [-100, -100],
        [width + 100, height + 100],
      ])
      .on('zoom', (event) => {
        onTransformChange(event.transform);
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Create main group
    const g = svg.append('g').attr('transform', transform.toString());

    // Helper function to get parents to render
    const getParentsToRender = (node: GraphNode): string[] => {
      const parentsToRender: string[] = [];

      // Add actual parents
      node.commit.parents.forEach((parentSha) => {
        if (commitMap.has(parentSha)) {
          parentsToRender.push(parentSha);
        }
      });

      // Add virtual parent if no valid parents
      if (parentsToRender.length === 0) {
        const virtualParent = virtualParents.get(node.commit.sha);
        if (virtualParent && commitMap.has(virtualParent)) {
          parentsToRender.push(virtualParent);
        }
      }

      return parentsToRender;
    };

    // Helper function to generate line path
    const generateLinePath = (
      node: GraphNode,
      parent: GraphNode,
      isMerge: boolean
    ): string => {
      const isCrossBranch = Math.abs(node.x - parent.x) > BRANCH_SPACING / 2;

      if (isCrossBranch || isMerge) {
        // Curved line using cubic Bezier (vertical flow)
        const midY = (node.y + parent.y) / 2;
        return `M ${node.x} ${node.y} C ${node.x} ${midY}, ${parent.x} ${midY}, ${parent.x} ${parent.y}`;
      } else {
        // Straight line for same branch
        return `M ${node.x} ${node.y} L ${parent.x} ${parent.y}`;
      }
    };

    // Draw lines between commits
    const lines = g.append('g').attr('class', 'commit-lines');

    nodes.forEach((node) => {
      const parentsToRender = getParentsToRender(node);

      parentsToRender.forEach((parentSha) => {
        const parent = commitMap.get(parentSha);
        if (!parent) return;

        const isMerge = node.commit.parents.length > 1;
        const path = generateLinePath(node, parent, isMerge);

        lines
          .append('path')
          .attr('d', path)
          .attr('stroke', node.color)
          .attr('stroke-width', LINE_WIDTH)
          .attr('fill', 'none')
          .attr('opacity', 0.5); // Brighter for dark mode
      });
    });

    // Draw commit nodes
    const nodeGroup = g.append('g').attr('class', 'commit-nodes');

    nodes.forEach((node) => {
      const group = nodeGroup
        .append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .style('cursor', 'pointer')
        .on('click', () => onCommitClick?.(node.commit));

      const isSelected = node.commit.sha === selectedSha;

      // Node circle
      group
        .append('circle')
        .attr('r', isSelected ? SELECTED_NODE_RADIUS : NODE_RADIUS)
        .attr('fill', isSelected ? node.color : isDark ? '#1f2937' : '#ffffff')
        .attr('stroke', node.color)
        .attr('stroke-width', 2)
        .on('mouseenter', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', SELECTED_NODE_RADIUS + 2)
            .attr('stroke-width', 3);
        })
        .on('mouseleave', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', isSelected ? SELECTED_NODE_RADIUS : NODE_RADIUS)
            .attr('stroke-width', 2);
        });

      // Tooltip
      group
        .append('title')
        .text(
          `${node.commit.message}\n${node.commit.author.name}\n${node.commit.sha.substring(0, 7)}`
        );
    });
  }, [
    nodes,
    commitMap,
    virtualParents,
    width,
    height,
    isDark,
    selectedSha,
    onCommitClick,
    transform,
    onTransformChange,
  ]);

  return <svg ref={svgRef} className="w-full h-full" />;
}
