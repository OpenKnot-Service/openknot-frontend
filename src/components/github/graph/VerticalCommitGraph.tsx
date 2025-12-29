import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GitHubCommit } from '../../../types';
import {
  generateBranchPath,
  findAncestors,
  getBranchLines,
  type GraphNode as GraphNodeType,
} from '../../../utils/gitGraphUtils';

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
  highlightedBranch?: string | null;
  onCommitClick?: (commit: GitHubCommit) => void;
}

// 시각적 상수
const NODE_RADIUS = 4;
const SELECTED_NODE_RADIUS = 6;
const HOVER_NODE_RADIUS = 8;
const LINE_WIDTH = 1.5;
const BRANCH_SPACING = 25;

// 애니메이션 상수
const TRANSITION_DURATION = 200; // ms
const LINE_HIGHLIGHT_OPACITY = 1.0;
const LINE_DIM_OPACITY = 0.25;
const LINE_NORMAL_OPACITY = 0.8;

export default function VerticalCommitGraph({
  nodes,
  commitMap,
  virtualParents,
  width,
  height,
  isDark,
  selectedSha,
  highlightedBranch,
  onCommitClick,
}: VerticalCommitGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // SVG 크기 설정
    svg.attr('width', width).attr('height', height);

    // 컨테이너의 실제 너비 가져오기 (스크롤 가능한 영역)
    const containerWidth = svgRef.current.parentElement?.clientWidth || width;

    // 메인 그룹 생성 (줌 없이)
    const g = svg.append('g');

    /**
     * 렌더링할 부모 커밋 찾기
     * 실제 부모 우선, 없으면 가상 부모 사용
     */
    const getParentsToRender = (node: GraphNode): string[] => {
      const parentsToRender: string[] = [];

      // 실제 부모 추가
      node.commit.parents.forEach((parentSha) => {
        if (commitMap.has(parentSha)) {
          parentsToRender.push(parentSha);
        }
      });

      // 부모가 없으면 가상 부모 추가
      if (parentsToRender.length === 0) {
        const virtualParent = virtualParents.get(node.commit.sha);
        if (virtualParent && commitMap.has(virtualParent)) {
          parentsToRender.push(virtualParent);
        }
      }

      return parentsToRender;
    };

    /**
     * 선택된 커밋의 조상 경로 계산
     */
    const ancestorSet = selectedSha
      ? findAncestors(
          selectedSha,
          commitMap as Map<string, GraphNodeType>,
          virtualParents
        )
      : new Set<string>();

    // 선택된 커밋도 포함
    if (selectedSha) {
      ancestorSet.add(selectedSha);
    }

    /**
     * 브랜치 라인 그리기
     * 각 라인은 브랜치별로 그룹화되며, hover 시 강조됨
     */
    const linesGroup = g.append('g').attr('class', 'commit-lines');

    // 라인 데이터 생성
    interface LineData {
      id: string; // 고유 ID (node.sha + parent.sha)
      node: GraphNode;
      parent: GraphNode;
      path: string;
      branchName: string;
      isMerge: boolean;
      isInSelectedPath: boolean;
    }

    const lineDataArray: LineData[] = [];

    nodes.forEach((node) => {
      const parentsToRender = getParentsToRender(node);

      parentsToRender.forEach((parentSha) => {
        const parent = commitMap.get(parentSha);
        if (!parent) return;

        const isMerge = node.commit.parents.length > 1;
        const path = generateBranchPath(
          node as GraphNodeType,
          parent as GraphNodeType,
          isMerge,
          BRANCH_SPACING
        );

        const branchName = node.commit.branch[0] || 'unknown';

        // 선택된 경로에 포함되는지 확인
        const isInSelectedPath =
          ancestorSet.has(node.commit.sha) && ancestorSet.has(parent.commit.sha);

        lineDataArray.push({
          id: `${node.commit.sha}-${parent.commit.sha}`,
          node,
          parent,
          path,
          branchName,
          isMerge,
          isInSelectedPath,
        });
      });
    });

    // 라인 렌더링
    linesGroup
      .selectAll('path')
      .data(lineDataArray)
      .enter()
      .append('path')
      .attr('class', (d) => `branch-line branch-${d.branchName.replace(/[^a-zA-Z0-9]/g, '_')}`)
      .attr('d', (d) => d.path)
      .attr('stroke', (d) => d.node.color)
      .attr('stroke-width', LINE_WIDTH)
      .attr('fill', 'none')
      .attr('opacity', (d) => {
        // 선택된 경로는 항상 밝게
        if (d.isInSelectedPath) return LINE_HIGHLIGHT_OPACITY;

        // 브랜치 하이라이트: 선택된 브랜치가 있으면 다른 브랜치는 흐리게
        if (highlightedBranch) {
          return d.branchName === highlightedBranch ? LINE_HIGHLIGHT_OPACITY : LINE_DIM_OPACITY;
        }

        // 기본 opacity
        return LINE_NORMAL_OPACITY;
      })
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('transition', `opacity ${TRANSITION_DURATION}ms ease`);

    /**
     * 커밋 행 배경 (전체 너비) - 맨 뒤에 렌더링
     */
    const rowBgGroup = g.append('g').attr('class', 'commit-row-backgrounds');

    /**
     * 커밋 노드 그리기
     * hover 시 관련 브랜치 라인 강조
     */
    const nodeGroup = g.append('g').attr('class', 'commit-nodes');


    // 배경 먼저 그리기
    nodes.forEach((node, index) => {
      const isSelected = node.commit.sha === selectedSha;

      // 전체 너비 배경 (컨테이너 너비에 맞춤)
      rowBgGroup
        .append('rect')
        .attr('x', 0)
        .attr('y', node.y - 20)
        .attr('width', containerWidth)
        .attr('height', 40)
        .attr('class', `commit-row-bg commit-row-${node.commit.sha}`)
        .style('fill', isSelected
          ? (isDark ? '#1e3a5f' : '#dbeafe')
          : (index % 2 === 0
            ? (isDark ? 'transparent' : 'transparent')
            : (isDark ? '#ffffff05' : '#00000005')))
        .style('cursor', 'pointer')
        .on('click', () => onCommitClick?.(node.commit))
        .on('mouseenter', function() {
          if (!isSelected) {
            d3.select(this).style('fill', isDark ? '#ffffff08' : '#00000008');
          }
        })
        .on('mouseleave', function() {
          if (!isSelected) {
            d3.select(this).style('fill', index % 2 === 0
              ? (isDark ? 'transparent' : 'transparent')
              : (isDark ? '#ffffff05' : '#00000005'));
          }
        });
    });

    nodes.forEach((node) => {
      const group = nodeGroup
        .append('g')
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .attr('class', `commit-node commit-${node.commit.sha}`)
        .style('cursor', 'pointer')
        .on('click', () => onCommitClick?.(node.commit));

      const isSelected = node.commit.sha === selectedSha;

      // 노드 원 그리기
      const circle = group
        .append('circle')
        .attr('r', isSelected ? SELECTED_NODE_RADIUS : NODE_RADIUS)
        .attr('fill', isSelected ? node.color : isDark ? '#1f2937' : '#ffffff')
        .attr('stroke', node.color)
        .attr('stroke-width', 2)
        .attr('class', 'node-circle')
        .style('transition', `all ${TRANSITION_DURATION}ms ease`);

      // Hover 이벤트: 노드 + 브랜치 라인 강조
      group
        .on('mouseenter', function () {
          // 노드 크기 증가
          circle
            .transition()
            .duration(TRANSITION_DURATION)
            .attr('r', HOVER_NODE_RADIUS)
            .attr('stroke-width', 3);

          // 해당 브랜치의 모든 라인 찾기
          const branchCommits = getBranchLines(
            node.commit.sha,
            commitMap as Map<string, GraphNodeType>,
            nodes as GraphNodeType[]
          );

          // 라인 강조/흐리게 처리
          linesGroup.selectAll('path').attr('opacity', function (this: any, d: any) {
            // 선택된 경로는 항상 밝게 유지
            if (d.isInSelectedPath) return LINE_HIGHLIGHT_OPACITY;

            // hover된 브랜치의 라인만 강조
            if (
              branchCommits.has(d.node.commit.sha) ||
              branchCommits.has(d.parent.commit.sha)
            ) {
              return LINE_HIGHLIGHT_OPACITY;
            }

            // 나머지는 흐리게
            return LINE_DIM_OPACITY;
          });
        })
        .on('mouseleave', function () {
          // 노드 원래 크기로
          circle
            .transition()
            .duration(TRANSITION_DURATION)
            .attr('r', isSelected ? SELECTED_NODE_RADIUS : NODE_RADIUS)
            .attr('stroke-width', 2);

          // 라인 원래 opacity로
          linesGroup.selectAll('path').attr('opacity', function (this: any, d: any) {
            if (d.isInSelectedPath) return LINE_HIGHLIGHT_OPACITY;
            return LINE_NORMAL_OPACITY;
          });
        });

      // 커밋 정보 텍스트 렌더링
    });

    // 텍스트를 마지막에 그려서 맨 위에 표시 (한 줄로 간략하게)
    const textGroup = g.append('g').attr('class', 'commit-texts');

    nodes.forEach((node) => {
      // 커밋 메시지 간략화
      const messageText = node.commit.message.length > 60
        ? node.commit.message.substring(0, 60) + '...'
        : node.commit.message;

      // 한 줄로 표시: 메시지 + 작성자 + SHA
      const combinedText = `${messageText}  •  ${node.commit.author.name}  •  ${node.commit.sha.substring(0, 7)}`;

      // 커밋 정보 (오른쪽 정렬, 노드와 같은 높이)
      textGroup
        .append('text')
        .attr('x', containerWidth - 20)
        .attr('y', node.y)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'commit-info')
        .style('fill', isDark ? '#e5e7eb' : '#1f2937')
        .style('font-size', '13px')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .text(combinedText);
    });
  }, [
    nodes,
    commitMap,
    virtualParents,
    width,
    height,
    isDark,
    selectedSha,
    highlightedBranch,
    onCommitClick,
  ]);

  return (
    <svg
      ref={svgRef}
      className="git-graph"
      style={{
        display: 'block',
        // CSS 변수로 테마 색상 전달 (향후 확장용)
        ['--node-radius' as any]: `${NODE_RADIUS}px`,
        ['--line-width' as any]: `${LINE_WIDTH}px`,
      }}
    />
  );
}
