import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Server, Check } from 'lucide-react';
import { DeploymentStatus } from '../../types';
import { cn } from '../../lib/utils';

interface RepositorySelectorProps {
  repositories: DeploymentStatus[];
  selectedRepositoryId: string | 'all';
  onSelect: (repositoryId: string | 'all') => void;
}

export function RepositorySelector({
  repositories,
  selectedRepositoryId,
  onSelect,
}: RepositorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedRepo = repositories.find((r) => r.repositoryId === selectedRepositoryId);
  const displayName = selectedRepositoryId === 'all' ? '모든 레포지토리' : selectedRepo?.repositoryName || '선택';

  const getRepoTypeColor = (type?: string) => {
    switch (type) {
      case 'frontend':
        return 'text-blue-500 dark:text-blue-400';
      case 'backend':
        return 'text-green-500 dark:text-green-400';
      case 'api':
        return 'text-purple-500 dark:text-purple-400';
      case 'mobile':
        return 'text-orange-500 dark:text-orange-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getStatusIndicator = (status?: 'success' | 'failed' | 'in_progress') => {
    switch (status) {
      case 'success':
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'failed':
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case 'in_progress':
        return <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition min-w-[250px]"
      >
        <div className="flex items-center gap-2">
          <Server className={cn('w-5 h-5', selectedRepo ? getRepoTypeColor(selectedRepo.repositoryType) : 'text-gray-500')} />
          <span className="font-medium text-gray-900 dark:text-white">{displayName}</span>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-gray-500 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[300px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 py-1">
          {/* All Repositories Option */}
          <button
            onClick={() => {
              onSelect('all');
              setIsOpen(false);
            }}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition',
              selectedRepositoryId === 'all' && 'bg-blue-50 dark:bg-blue-900/20'
            )}
          >
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">모든 레포지토리</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  전체 {repositories.length}개 레포지토리
                </div>
              </div>
            </div>
            {selectedRepositoryId === 'all' && <Check className="w-4 h-4 text-blue-600" />}
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          {/* Individual Repositories */}
          {repositories.map((repo) => (
            <button
              key={repo.repositoryId}
              onClick={() => {
                onSelect(repo.repositoryId);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition',
                selectedRepositoryId === repo.repositoryId && 'bg-blue-50 dark:bg-blue-900/20'
              )}
            >
              <div className="flex items-center gap-3">
                <Server className={cn('w-5 h-5', getRepoTypeColor(repo.repositoryType))} />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {repo.repositoryName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {getStatusIndicator(repo.status)}
                    <span>
                      {repo.isDeployed
                        ? `${repo.environment} 환경 배포됨`
                        : '배포되지 않음'}
                    </span>
                  </div>
                </div>
              </div>
              {selectedRepositoryId === repo.repositoryId && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
