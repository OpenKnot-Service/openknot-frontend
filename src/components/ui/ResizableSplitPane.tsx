import { useState, useRef, useEffect, ReactNode } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizableSplitPaneProps {
  leftPane: ReactNode;
  rightPane: ReactNode;
  defaultLeftWidth?: number; // percentage (0-100)
  minLeftWidth?: number; // percentage
  maxLeftWidth?: number; // percentage
  storageKey?: string; // localStorage key to persist width
}

export function ResizableSplitPane({
  leftPane,
  rightPane,
  defaultLeftWidth = 33,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  storageKey,
}: ResizableSplitPaneProps) {
  // Load saved width from localStorage if available
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= minLeftWidth && parsed <= maxLeftWidth) {
          return parsed;
        }
      }
    }
    return defaultLeftWidth;
  });

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Save width to localStorage when it changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, leftWidth.toString());
    }
  }, [leftWidth, storageKey]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;

    // Calculate new width as percentage
    let newLeftWidth = (mouseX / containerWidth) * 100;

    // Apply min/max constraints
    newLeftWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidth));

    setLeftWidth(newLeftWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex h-full w-full relative">
      {/* Left Pane */}
      <div
        className="h-full overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPane}
      </div>

      {/* Resize Handle */}
      <div
        className="relative flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors group cursor-col-resize select-none"
        style={{ width: '4px' }}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <GripVertical className="w-4 h-4 text-white drop-shadow-md" />
        </div>

        {/* Wider hit area for easier grabbing */}
        <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
      </div>

      {/* Right Pane */}
      <div
        className="h-full overflow-hidden flex-1"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
}
