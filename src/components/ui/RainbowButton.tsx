import { cn } from '../../lib/utils';

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        'group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg px-8 py-3 font-medium text-white transition-all duration-500',
        'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
        'border-2 border-transparent',
        'hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 hover:border-white/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'animate-gradient-x',
        'before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-indigo-400 before:via-purple-400 before:to-pink-400 before:-z-10 before:animate-gradient-x',
        className
      )}
      {...props}
    >
      {/* Animated gradient border background */}
      <span className="absolute -inset-[2px] rounded-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-75 blur-sm animate-gradient-x -z-10" />

      {/* Animated gradient overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Shimmer effect */}
      <span className="absolute inset-0 flex h-full w-full">
        <span className="relative h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
