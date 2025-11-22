import { memo } from 'react';
import { EdgeProps, BaseEdge, getSmoothStepPath } from '@xyflow/react';
import { TaskFlowEdgeData } from '../../lib/reactFlowUtils';

function TaskFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  type,
}: EdgeProps) {
  const edgeData = data as unknown as TaskFlowEdgeData;
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  const isHierarchy = type === 'hierarchy';
  const isHighlighted = edgeData?.isHighlighted || false;

  // Style based on edge type
  const edgeStyle: React.CSSProperties = {
    ...style,
    strokeWidth: isHierarchy
      ? (isHighlighted ? 3 : 2)
      : (isHighlighted ? 4 : 3), // Dependency edges thicker
    stroke: isHierarchy
      ? isHighlighted
        ? 'var(--primary-strong)'
        : 'var(--primary)'
      : isHighlighted
      ? '#f97316' // Orange-500
      : '#fb923c', // Orange-400 - bright and visible
    strokeDasharray: isHierarchy ? undefined : '8,4', // Longer dashes for better visibility
    opacity: 1, // Full opacity for all edges
  };

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={edgeStyle}
    />
  );
}

export default memo(TaskFlowEdge);
