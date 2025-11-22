import type { LucideIcon } from 'lucide-react';

interface TransparentIconProps {
  Icon: LucideIcon;
  lightColor: string;  // Hex color: "#9333ea"
  darkColor: string;   // Hex color: "#c084fc"
  baseOpacity: number; // 0-1 (낮은 값 = 흐림)
  hoverOpacity: number; // 0-1 (hover 시 투명도, 보통 1.0 = 완전 불투명)
  className?: string;
}

export default function TransparentIcon({
  Icon,
  lightColor,
  darkColor,
  baseOpacity,
  hoverOpacity,
  className = '',
}: TransparentIconProps) {
  return (
    <div
      className={`transition-opacity duration-300 group-hover:opacity-[var(--hover-opacity)] ${className}`}
      style={
        {
          opacity: baseOpacity,
          '--hover-opacity': hoverOpacity,
          '--icon-light-color': lightColor,
          '--icon-dark-color': darkColor,
        } as React.CSSProperties
      }
    >
      <Icon
        className="w-full h-full text-[var(--icon-light-color)] dark:text-[var(--icon-dark-color)]"
        strokeWidth={2}
      />
    </div>
  );
}
