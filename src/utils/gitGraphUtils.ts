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
 * GitKraken 스타일 각진 경로 (꺾이는 부분만 round)
 * Quadratic Bezier 곡선으로 코너 둥글기 구현
 *
 * @param from - 시작점 (자식 커밋)
 * @param to - 끝점 (부모 커밋)
 * @param cornerRadius - 코너 둥글기 (기본값 8)
 */
export function createAngularPath(
  from: Point,
  to: Point,
  cornerRadius: number = 8
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const midY = from.y + dy * 0.5;

  // 수평 이동이 없으면 직선
  if (Math.abs(dx) < 1) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  // 코너 반경이 경로보다 크면 조정
  const r = Math.min(cornerRadius, Math.abs(dy) * 0.25, Math.abs(dx) * 0.5);

  // GitKraken 스타일: 직각으로 꺾이되 코너는 둥글게
  // 1. 시작점에서 첫 번째 코너 직전까지 수직
  // 2. Q 명령어로 둥근 코너 (수직→수평 전환)
  // 3. 두 번째 코너 직전까지 수평
  // 4. Q 명령어로 둥근 코너 (수평→수직 전환)
  // 5. 끝점까지 수직

  const direction = dx > 0 ? 1 : -1;

  return `M ${from.x} ${from.y}
          L ${from.x} ${midY - r}
          Q ${from.x} ${midY} ${from.x + direction * r} ${midY}
          L ${to.x - direction * r} ${midY}
          Q ${to.x} ${midY} ${to.x} ${midY + r}
          L ${to.x} ${to.y}`;
}

/**
 * 고급 각진 경로 (병합 시 2단계 꺾임)
 * Quadratic Bezier 곡선으로 코너 둥글기 구현
 *
 * @param from - 시작점
 * @param to - 끝점
 * @param isMerge - 병합 커밋 여부
 * @param cornerRadius - 코너 둥글기 (기본값 8)
 */
export function createAdvancedAngularPath(
  from: Point,
  to: Point,
  isMerge: boolean = false,
  cornerRadius: number = 8
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // 수평 이동이 없으면 직선
  if (Math.abs(dx) < 1) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  // 코너 반경 조정
  const r = Math.min(cornerRadius, Math.abs(dy) * 0.15, Math.abs(dx) * 0.5);
  const direction = dx > 0 ? 1 : -1;

  // 병합이든 일반 분기든 동일한 직각 경로 사용
  const midY = from.y + dy * 0.5;

  return `M ${from.x} ${from.y}
          L ${from.x} ${midY - r}
          Q ${from.x} ${midY} ${from.x + direction * r} ${midY}
          L ${to.x - direction * r} ${midY}
          Q ${to.x} ${midY} ${to.x} ${midY + r}
          L ${to.x} ${to.y}`;
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
    // 브랜치 간 이동 또는 병합: 각진 경로 사용
    return createAdvancedAngularPath(from, to, isMerge);
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
