import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface MiniMapNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MiniMapProps {
  // Bounds of the full content
  contentBounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  // Current viewport transform
  currentTransform: d3.ZoomTransform;
  // Container dimensions
  containerWidth: number;
  containerHeight: number;
  // Nodes to display
  nodes?: MiniMapNode[];
  // Callback when user clicks/drags on minimap
  onViewportChange: (x: number, y: number) => void;
}

const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 150;
const MINIMAP_PADDING = 10;

export default function MiniMap({
  contentBounds,
  currentTransform,
  containerWidth,
  containerHeight,
  nodes = [],
  onViewportChange,
}: MiniMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const contentWidth = contentBounds.maxX - contentBounds.minX;
  const contentHeight = contentBounds.maxY - contentBounds.minY;

  // Scale to fit content in minimap
  const scale = Math.min(
    (MINIMAP_WIDTH - MINIMAP_PADDING * 2) / contentWidth,
    (MINIMAP_HEIGHT - MINIMAP_PADDING * 2) / contentHeight
  );

  // Calculate viewport rectangle in minimap coordinates
  const viewportWidth = (containerWidth / currentTransform.k) * scale;
  const viewportHeight = (containerHeight / currentTransform.k) * scale;

  const viewportX =
    MINIMAP_PADDING +
    ((-currentTransform.x / currentTransform.k - contentBounds.minX) * scale);
  const viewportY =
    MINIMAP_PADDING +
    ((-currentTransform.y / currentTransform.k - contentBounds.minY) * scale);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const handleInteraction = (event: MouseEvent | any) => {
      const [mx, my] = d3.pointer(event, svgRef.current);

      // Convert minimap coordinates to content coordinates
      const contentX = ((mx - MINIMAP_PADDING) / scale) + contentBounds.minX;
      const contentY = ((my - MINIMAP_PADDING) / scale) + contentBounds.minY;

      onViewportChange(contentX, contentY);
    };

    // Handle both click and drag on minimap
    const drag = d3.drag<SVGSVGElement, unknown>()
      .on('start', handleInteraction)
      .on('drag', handleInteraction);

    svg.call(drag);

    // Also handle simple clicks
    svg.on('click', handleInteraction);

    return () => {
      svg.on('.drag', null);
      svg.on('click', null);
    };
  }, [scale, contentBounds, onViewportChange]);

  return (
    <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
      <svg
        ref={svgRef}
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="cursor-pointer"
      >
        {/* Background */}
        <rect
          width={MINIMAP_WIDTH}
          height={MINIMAP_HEIGHT}
          fill="var(--background)"
          opacity={0.95}
        />

        {/* Content bounds */}
        <rect
          x={MINIMAP_PADDING}
          y={MINIMAP_PADDING}
          width={contentWidth * scale}
          height={contentHeight * scale}
          fill="var(--surface)"
          stroke="var(--border)"
          strokeWidth={1}
          opacity={0.5}
        />

        {/* Nodes */}
        {nodes.map((node, idx) => {
          const nodeX = MINIMAP_PADDING + ((node.x - contentBounds.minX) * scale);
          const nodeY = MINIMAP_PADDING + ((node.y - contentBounds.minY) * scale);
          const nodeW = node.width * scale;
          const nodeH = node.height * scale;

          return (
            <rect
              key={idx}
              x={nodeX}
              y={nodeY}
              width={Math.max(nodeW, 2)}
              height={Math.max(nodeH, 2)}
              fill="var(--primary)"
              opacity={0.6}
              rx={1}
            />
          );
        })}

        {/* Viewport rectangle */}
        <rect
          x={viewportX}
          y={viewportY}
          width={viewportWidth}
          height={viewportHeight}
          fill="var(--primary)"
          stroke="var(--primary-strong)"
          strokeWidth={2}
          opacity={0.3}
          rx={2}
        />
      </svg>

      {/* Label */}
      <div className="absolute top-1 left-2 text-[10px] font-medium text-gray-600 dark:text-gray-400 pointer-events-none">
        Mini Map
      </div>
    </div>
  );
}
