import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  align = 'start',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 md:flex-row md:items-start md:justify-between',
        align === 'center' && 'text-center md:text-left',
        className
      )}
    >
      <div className={cn('space-y-1', align === 'center' && 'w-full')}>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {eyebrow}
          </p>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
