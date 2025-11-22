import { cn } from '../../lib/utils';
import { ReactNode } from 'react';

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  cta,
}: {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: any;
  description: string;
  cta?: string;
}) => (
  <div
    key={name}
    className={cn(
      'group relative col-span-3 flex flex-col rounded-xl min-h-[280px] overflow-hidden',
      // light styles
      'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      // dark styles
      'transform-gpu dark:bg-gray-900 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      className
    )}
  >
    <div className="absolute inset-0 overflow-hidden rounded-xl">{background}</div>

    {/* 상단 아이콘 */}
    <div className="pointer-events-none z-10 p-6 pb-0 transition-all duration-300 transform-gpu group-hover:-translate-y-2">
      {Icon && <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 dark:text-neutral-300 transition-all duration-300 ease-in-out group-hover:scale-75" />}
    </div>

    {/* 하단 텍스트 (호버 시 위로 이동) */}
    <div className="pointer-events-none z-10 flex flex-col gap-1 mt-auto p-6 pt-4 transition-all duration-300 transform-gpu group-hover:-translate-y-14">
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {name}
      </h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    {/* 버튼 (호버 시 나타남) */}
    <div
      className={cn(
        'pointer-events-none absolute bottom-0 flex w-full translate-y-full transform-gpu flex-row items-center px-6 pb-6 pt-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'
      )}
    >
      {cta && (
        <button className="pointer-events-auto rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
          {cta}
        </button>
      )}
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);
