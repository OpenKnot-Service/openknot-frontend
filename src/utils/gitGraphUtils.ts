/**
 * Git Graph Visualization Utilities
 * 브랜치 트리 라인 렌더링을 위한 좌표 계산 및 경로 생성 로직
 */

export interface Point {
  x: number;
  y: number;
}

export interface GraphNode {
  commit: {
    sha: string;
    parents: string[];
    branch: string[];
    [key: string]: any;
  };
  x: number;
  y: number;
  column: number;
  color: string;
  timeIndex: number;
}

/**
 * 두 점 사이의 거리 계산
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * 브랜치가 교차하는지 확인
 * @param node - 현재 노드
 * @param parent - 부모 노드
 * @param branchSpacing - 브랜치 간격
 */
export function isCrossBranch(
  node: GraphNode,
  parent: GraphNode,
  branchSpacing: number = 25
): boolean {
  return Math.abs(node.x - parent.x) > branchSpacing / 2;
}

/**
 * 직선 경로 생성 (같은 브랜치 내)
 * @param from - 시작점
 * @param to - 끝점
 */
export function createStraightPath(from: Point, to: Point): string {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}

/**
 * 부드러운 곡선 경로 생성 (브랜치 병합/분기)
 * Cubic Bezier Curve 사용
 *
 * @param from - 시작점 (자식 커밋)
 * @param to - 끝점 (부모 커밋)
 * @param curvature - 곡선 강도 (0~1, 기본값 0.5)
 */
export function createCurvedPath(
  from: Point,
  to: Point,
  curvature: number = 0.5
): string {
  // 제어점 계산 (Y축 중간점 기준)
  const midY = from.y + (to.y - from.y) * curvature;

  // Cubic Bezier: M start C cp1x cp1y, cp2x cp2y, end
  // 첫 번째 제어점: from의 x 유지, midY
  // 두 번째 제어점: to의 x 유지, midY
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

/**
 * 고급 곡선 경로 생성 (GitKraken 스타일)
 * S자 곡선으로 더 자연스러운 병합 표현
 *
 * @param from - 시작점
 * @param to - 끝점
 * @param isMerge - 병합 커밋 여부
 */
export function createAdvancedCurvedPath(
  from: Point,
  to: Point,
  isMerge: boolean = false
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // 병합일 경우 더 부드러운 곡선 사용
  if (isMerge) {
    // 3단계 베지어 곡선으로 S자 형태 생성
    const cp1y = from.y + dy * 0.3;
    const cp2y = from.y + dy * 0.7;

    return `M ${from.x} ${from.y}
            C ${from.x} ${cp1y}, ${from.x + dx * 0.3} ${cp1y}, ${from.x + dx * 0.5} ${from.y + dy * 0.5}
            S ${to.x} ${cp2y}, ${to.x} ${to.y}`;
  }

  // 일반 분기는 단순한 곡선
  const midY = from.y + dy * 0.5;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

/**
 * 브랜치 경로 생성 (자동 판단)
 *
 * @param node - 현재 노드
 * @param parent - 부모 노드
 * @param isMerge - 병합 커밋 여부
 * @param branchSpacing - 브랜치 간격
 */
export function generateBranchPath(
  node: GraphNode,
  parent: GraphNode,
  isMerge: boolean = false,
  branchSpacing: number = 25
): string {
  const from: Point = { x: node.x, y: node.y };
  const to: Point = { x: parent.x, y: parent.y };

  // 브랜치 교차 여부 확인
  const crossBranch = isCrossBranch(node, parent, branchSpacing);

  if (crossBranch || isMerge) {
    // 브랜치 간 이동 또는 병합: 곡선 사용
    return createAdvancedCurvedPath(from, to, isMerge);
  } else {
    // 같은 브랜치 내: 직선 사용
    return createStraightPath(from, to);
  }
}

/**
 * 노드의 모든 조상 노드 찾기 (경로 하이라이트용)
 *
 * @param nodeId - 시작 노드 ID
 * @param commitMap - 커밋 맵
 * @param virtualParents - 가상 부모 관계
 * @param maxDepth - 최대 탐색 깊이 (무한 루프 방지)
 */
export function findAncestors(
  nodeId: string,
  commitMap: Map<string, GraphNode>,
  virtualParents: Map<string, string>,
  maxDepth: number = 100
): Set<string> {
  const ancestors = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: nodeId, depth: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    if (depth > maxDepth || visited.has(id)) continue;
    visited.add(id);

    const node = commitMap.get(id);
    if (!node) continue;

    // 실제 부모들
    node.commit.parents.forEach((parentId) => {
      if (commitMap.has(parentId)) {
        ancestors.add(parentId);
        queue.push({ id: parentId, depth: depth + 1 });
      }
    });

    // 가상 부모 (있을 경우)
    if (node.commit.parents.length === 0) {
      const virtualParent = virtualParents.get(id);
      if (virtualParent && commitMap.has(virtualParent)) {
        ancestors.add(virtualParent);
        queue.push({ id: virtualParent, depth: depth + 1 });
      }
    }
  }

  return ancestors;
}

/**
 * 브랜치의 모든 커밋 찾기
 *
 * @param branchName - 브랜치 이름
 * @param nodes - 모든 노드
 */
export function getCommitsInBranch(
  branchName: string,
  nodes: GraphNode[]
): Set<string> {
  const commits = new Set<string>();

  nodes.forEach((node) => {
    if (node.commit.branch.includes(branchName)) {
      commits.add(node.commit.sha);
    }
  });

  return commits;
}

/**
 * 특정 커밋이 속한 브랜치의 모든 라인 찾기
 *
 * @param nodeId - 커밋 ID
 * @param commitMap - 커밋 맵
 * @param nodes - 모든 노드
 */
export function getBranchLines(
  nodeId: string,
  commitMap: Map<string, GraphNode>,
  nodes: GraphNode[]
): Set<string> {
  const node = commitMap.get(nodeId);
  if (!node) return new Set();

  const branchName = node.commit.branch[0];
  if (!branchName) return new Set();

  return getCommitsInBranch(branchName, nodes);
}
