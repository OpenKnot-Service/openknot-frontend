import dagre from '@dagrejs/dagre';
import { Node, Edge } from '@xyflow/react';
import { TaskTreeNode } from '../types/wizard';

export type TaskFlowNodeData = TaskTreeNode & {
  label: string;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  [key: string]: unknown;
};

export type TaskFlowNode = Node<TaskFlowNodeData>;

export type TaskFlowEdgeData = {
  isHighlighted?: boolean;
  [key: string]: unknown;
};

export type TaskFlowEdge = Edge<TaskFlowEdgeData> & {
  type: 'hierarchy' | 'dependency';
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

/**
 * Convert TaskTreeNode array to React Flow nodes and edges
 */
export function convertToReactFlow(tasks: TaskTreeNode[]): {
  nodes: TaskFlowNode[];
  edges: TaskFlowEdge[];
} {
  const nodes: TaskFlowNode[] = [];
  const edges: TaskFlowEdge[] = [];
  const processedIds = new Set<string>();
  const allNodes: TaskTreeNode[] = []; // Keep reference to all nodes

  // Recursive function to process tree structure
  function processNode(node: TaskTreeNode, parentId?: string) {
    // Skip if already processed (avoid duplicates)
    if (processedIds.has(node.id)) return;
    processedIds.add(node.id);
    allNodes.push(node); // Store for later processing

    // Create React Flow node
    nodes.push({
      id: node.id,
      type: 'task',
      position: { x: 0, y: 0 }, // Will be set by Dagre
      data: {
        ...node,
        label: node.title,
      },
    });

    // Create hierarchy edge (parent-child)
    if (parentId) {
      edges.push({
        id: `hierarchy-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'hierarchy',
        animated: false,
      });
    }

    // Process children recursively
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => processNode(child, node.id));
    }
  }

  // Process all top-level tasks
  tasks.forEach((task) => processNode(task));

  // After all nodes are processed, create dependency edges
  allNodes.forEach((node) => {
    if (node.dependencies && node.dependencies.length > 0) {
      node.dependencies.forEach((depId) => {
        edges.push({
          id: `dependency-${depId}-${node.id}`,
          source: depId,
          target: node.id,
          type: 'dependency',
          animated: false,
        });
      });
    }
  });

  return { nodes, edges };
}

/**
 * Apply Dagre layout to nodes
 */
export function getLayoutedElements(
  nodes: TaskFlowNode[],
  edges: TaskFlowEdge[],
  direction: 'TB' | 'LR' = 'LR'
): {
  nodes: TaskFlowNode[];
  edges: TaskFlowEdge[];
} {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph properties
  dagreGraph.setGraph({
    rankdir: direction, // LR = left to right
    nodesep: 100, // Horizontal spacing between nodes
    ranksep: 80, // Vertical spacing between ranks
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  const layoutedNodes: TaskFlowNode[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        // Dagre returns center position, we need top-left
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Get highlighted node IDs based on hover
 */
export function getHighlightedNodes(
  hoveredNodeId: string | null,
  edges: TaskFlowEdge[]
): Set<string> {
  if (!hoveredNodeId) return new Set();

  const highlighted = new Set<string>();
  highlighted.add(hoveredNodeId);

  // Find connected nodes through edges
  edges.forEach((edge) => {
    if (edge.source === hoveredNodeId) {
      highlighted.add(edge.target);
    }
    if (edge.target === hoveredNodeId) {
      highlighted.add(edge.source);
    }
  });

  return highlighted;
}

/**
 * Get highlighted edge IDs based on hover
 */
export function getHighlightedEdges(
  hoveredNodeId: string | null,
  edges: TaskFlowEdge[]
): Set<string> {
  if (!hoveredNodeId) return new Set();

  const highlighted = new Set<string>();

  edges.forEach((edge) => {
    if (edge.source === hoveredNodeId || edge.target === hoveredNodeId) {
      highlighted.add(edge.id);
    }
  });

  return highlighted;
}
