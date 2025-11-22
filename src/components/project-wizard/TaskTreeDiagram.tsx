import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  NodeMouseHandler,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TaskTreeNode } from '../../types/wizard';
import TaskFlowNode from './TaskFlowNode';
import TaskFlowEdge from './TaskFlowEdge';
import {
  convertToReactFlow,
  getLayoutedElements,
  getHighlightedNodes,
  getHighlightedEdges,
  TaskFlowNode as TaskFlowNodeType,
  TaskFlowEdge as TaskFlowEdgeType,
} from '../../lib/reactFlowUtils';

interface TaskTreeDiagramProps {
  tasks: TaskTreeNode[];
  onTaskClick?: (task: TaskTreeNode) => void;
}

const nodeTypes = {
  task: TaskFlowNode,
} as any;

const edgeTypes = {
  hierarchy: TaskFlowEdge,
  dependency: TaskFlowEdge,
} as any;

export default function TaskTreeDiagram({ tasks, onTaskClick }: TaskTreeDiagramProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Convert tasks to React Flow format and apply layout
  const initialElements = useMemo(() => {
    const { nodes, edges } = convertToReactFlow(tasks);
    return getLayoutedElements(nodes, edges, 'LR');
  }, [tasks]);

  const [nodes, setNodes, onNodesChange] = useNodesState<TaskFlowNodeType>(initialElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<TaskFlowEdgeType>(initialElements.edges);

  // Update nodes and edges when tasks change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = convertToReactFlow(tasks);
    const layouted = getLayoutedElements(newNodes, newEdges, 'LR');
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [tasks, setNodes, setEdges]);

  // Calculate highlighted elements
  const highlightedNodeIds = useMemo(
    () => getHighlightedNodes(hoveredNodeId, edges),
    [hoveredNodeId, edges]
  );

  const highlightedEdgeIds = useMemo(
    () => getHighlightedEdges(hoveredNodeId, edges),
    [hoveredNodeId, edges]
  );

  // Update nodes with highlight/dim state
  const displayNodes: TaskFlowNodeType[] = useMemo(() => {
    return nodes.map((node) => {
      const isHighlighted = highlightedNodeIds.has(node.id);
      const isDimmed = hoveredNodeId !== null && !isHighlighted;

      return {
        ...node,
        data: {
          ...node.data,
          isHighlighted,
          isDimmed,
        },
      };
    });
  }, [nodes, highlightedNodeIds, hoveredNodeId]);

  // Update edges with highlight state
  const displayEdges: TaskFlowEdgeType[] = useMemo(() => {
    return edges.map((edge) => {
      const isHighlighted = highlightedEdgeIds.has(edge.id);

      return {
        ...edge,
        data: {
          ...edge.data,
          isHighlighted,
        },
      };
    });
  }, [edges, highlightedEdgeIds]);

  // Handle node hover
  const onNodeMouseEnter: NodeMouseHandler = useCallback((_, node) => {
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  // Handle node click
  const onNodeClick: NodeMouseHandler<TaskFlowNodeType> = useCallback(
    (_, node) => {
      if (onTaskClick && node.data) {
        onTaskClick(node.data);
      }
    },
    [onTaskClick]
  );

  if (!tasks.length) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
        No tasks to display
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-950 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={4}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
          markerEnd: {
            type: 'arrowclosed',
            width: 20,
            height: 20,
          },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          className="bg-gray-50 dark:bg-gray-950"
        />
        <Controls
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          showInteractive={false}
        />
        <MiniMap
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          nodeColor={(node) => {
            const taskNode = node as Node<TaskFlowNodeType['data']>;
            const status = taskNode.data?.status;
            if (status === 'done') return '#10b981';
            if (status === 'in_progress') return '#3b82f6';
            if (status === 'review') return '#f59e0b';
            return '#9ca3af';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Panel position="top-left" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-xs space-y-1">
            <div className="font-semibold text-gray-900 dark:text-white">AI Task Tree</div>
            <div className="text-gray-600 dark:text-gray-400">
              노드를 드래그하거나 호버하여 종속성을 확인하세요
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
