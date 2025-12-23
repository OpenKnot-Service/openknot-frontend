import { ReactNode, useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Tooltip({ content, children, className = '', disabled = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // 툴팁을 트리거 요소 위쪽에 중앙 정렬
      const left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      const top = triggerRect.top - tooltipRect.height - 8; // 8px 간격

      // 화면 밖으로 나가지 않도록 조정
      const adjustedLeft = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));

      setPosition({ top, left: adjustedLeft });
    }
  }, [isVisible]);

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={className}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg pointer-events-none animate-in fade-in duration-200"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
          {/* 화살표 */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
        </div>
      )}
    </>
  );
}
