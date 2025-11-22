import { cn } from '../../lib/utils';
import { ReactNode, CSSProperties } from 'react';

interface ShineBorderProps {
  children: ReactNode;
  className?: string;
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
}

export default function ShineBorder({
  children,
  className,
  borderRadius = 12,
  borderWidth = 2,
  duration = 14,
  color = ['#8B5CF6', '#EC4899', '#F59E0B'],
}: ShineBorderProps) {
  const colorArray = Array.isArray(color) ? color : [color];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl',
        className
      )}
      style={
        {
          '--border-radius': `${borderRadius}px`,
          borderRadius: `${borderRadius}px`,
        } as CSSProperties
      }
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 z-[2] rounded-[inherit] pointer-events-none"
        style={{
          padding: `${borderWidth}px`,
          background: `linear-gradient(var(--shine-angle, 0deg), ${colorArray.join(', ')}, ${colorArray[0]})`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: `shine-border ${duration}s linear infinite`,
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
