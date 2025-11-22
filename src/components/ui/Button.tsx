import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  ariaLabel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, ariaLabel, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-[color:var(--surface)] disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-[1px]';

    const variants = {
      primary:
        'bg-[image:var(--gradient-primary)] text-[color:var(--primary-foreground)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] hover:-translate-y-[1px] active:shadow-[var(--shadow-soft)]',
      secondary:
        'bg-[color:var(--accent)] text-[color:var(--accent-foreground)] border border-[color:var(--border)] hover:bg-[color:var(--background-muted)] hover:-translate-y-[1px]',
      danger:
        'bg-[color:var(--danger)] text-[color:var(--danger-foreground)] shadow-[var(--shadow-soft)] hover:brightness-105 hover:-translate-y-[1px]',
      ghost:
        'text-[color:var(--subtle-foreground)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--accent)] hover:-translate-y-[1px]',
      outline:
        'border border-[color:var(--border-strong)] text-[color:var(--foreground)] bg-[color:var(--surface)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary-strong)] hover:-translate-y-[1px]',
    };

    const sizes = {
      xs: 'px-3 py-1.5 text-[var(--type-scale-xs)] min-h-[2.125rem]',
      sm: 'px-3.5 py-2 text-[var(--type-scale-sm)] min-h-[2.5rem]',
      md: 'px-5 py-2.5 text-[var(--type-scale-md)] min-h-[2.875rem]',
      lg: 'px-6 py-3 text-[var(--type-scale-lg)] min-h-[3.25rem]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-70"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            로딩 중...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
