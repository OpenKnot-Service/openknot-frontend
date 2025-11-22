import { Search, Star, GitFork, ExternalLink } from 'lucide-react';
import type { GitHubRepository } from '../../types';

interface RepositorySwitcherProps {
  repositories: GitHubRepository[];
  selectedRepository: GitHubRepository | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectRepository: (id: string) => void;
  deploymentStatus?: {
    isDeployed: boolean;
    environment?: string;
    deploymentUrl?: string;
  } | null;
  monitoringStatus?: {
    isMonitored: boolean;
    healthStatus?: 'healthy' | 'degraded' | 'unhealthy';
  } | null;
  onDeploymentClick?: () => void;
  onMonitoringClick?: () => void;
}

export default function RepositorySwitcher({
  repositories,
  selectedRepository,
  searchQuery,
  setSearchQuery,
  selectRepository,
  deploymentStatus,
  monitoringStatus,
  onDeploymentClick,
  onMonitoringClick,
}: RepositorySwitcherProps) {
  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group repositories by group
  const groupedRepos = filteredRepositories.reduce((acc, repo) => {
    const group = repo.group || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(repo);
    return acc;
  }, {} as Record<string, typeof repositories>);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="저장소 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Repository List */}
      <div className="space-y-6">
        {Object.entries(groupedRepos).map(([group, repos]) => (
          <div key={group}>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {group}
            </h3>
            <div className="space-y-1">
              {repos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => selectRepository(repo.id)}
                  className={`w-full rounded-md p-3 text-left transition ${
                    selectedRepository?.id === repo.id
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {repo.name}
                    </span>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{repo.language}</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {repo.forks}
                    </span>
                    <span className="text-green-600">●{repo.openPRCount}</span>
                    <span className="text-red-600">●{repo.openIssueCount}</span>
                  </div>
                  {repo.lastCommitMessage && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                      {repo.lastCommitMessage.substring(0, 40)}...
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Repository Info Card */}
      {selectedRepository && (
        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">저장소 정보</h4>
          <div className="space-y-2 text-sm">
            {deploymentStatus?.isDeployed && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">배포 환경:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{deploymentStatus.environment}</span>
              </div>
            )}
            {monitoringStatus?.isMonitored && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">상태:</span>
                <span className={`ml-2 ${
                  monitoringStatus.healthStatus === 'healthy' ? 'text-green-600' :
                  monitoringStatus.healthStatus === 'degraded' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {monitoringStatus.healthStatus}
                </span>
              </div>
            )}
            {deploymentStatus?.deploymentUrl && (
              <a
                href={deploymentStatus.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                사이트 방문 <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Deep Link Buttons */}
          {(deploymentStatus?.isDeployed || monitoringStatus?.isMonitored) && (
            <div className="mt-4 space-y-2">
              {deploymentStatus?.isDeployed && onDeploymentClick && (
                <button
                  onClick={onDeploymentClick}
                  className="w-full rounded-md bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                >
                  배포 탭에서 보기
                </button>
              )}
              {monitoringStatus?.isMonitored && onMonitoringClick && (
                <button
                  onClick={onMonitoringClick}
                  className="w-full rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                  모니터링 탭에서 보기
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
