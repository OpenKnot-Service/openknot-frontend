import { useState } from 'react';
import { X, Rocket, AlertTriangle, Server, CheckCircle } from 'lucide-react';
import { DeploymentStatus, BulkDeploymentConfig } from '../../types';
import { cn } from '../../lib/utils';

interface BulkDeploymentPanelProps {
  repositories: DeploymentStatus[];
  onClose: () => void;
  onDeploy: (config: BulkDeploymentConfig) => void;
}

export function BulkDeploymentPanel({ repositories, onClose, onDeploy }: BulkDeploymentPanelProps) {
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState<'dev' | 'staging' | 'production'>('staging');
  const [deployInParallel, setDeployInParallel] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleRepository = (repoId: string) => {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRepoIds.length === repositories.length) {
      setSelectedRepoIds([]);
    } else {
      setSelectedRepoIds(repositories.map((r) => r.repositoryId));
    }
  };

  const handleDeploy = () => {
    if (selectedRepoIds.length === 0) return;

    onDeploy({
      repositoryIds: selectedRepoIds,
      environment: selectedEnvironment,
      deployInParallel,
    });
    onClose();
  };

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

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-red-500 hover:bg-red-600';
      case 'staging':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'dev':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">일괄 배포</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                여러 레포지토리를 한 번에 배포합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showConfirmation ? (
          /* Confirmation Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">배포 확인</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedRepoIds.length}개의 레포지토리를{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedEnvironment === 'production'
                  ? '프로덕션'
                  : selectedEnvironment === 'staging'
                    ? '스테이징'
                    : '개발'}{' '}
                환경
              </span>
              에 배포하시겠습니까?
              {selectedEnvironment === 'production' && (
                <span className="block mt-2 text-red-600 dark:text-red-500 font-medium">
                  ⚠️ 프로덕션 환경에 배포됩니다!
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                취소
              </button>
              <button
                onClick={handleDeploy}
                className={cn(
                  'px-6 py-2.5 text-white rounded-lg transition font-medium',
                  getEnvironmentColor(selectedEnvironment)
                )}
              >
                배포 시작
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Repository Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    레포지토리 선택
                  </label>
                  <button
                    onClick={toggleSelectAll}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedRepoIds.length === repositories.length ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                <div className="space-y-2">
                  {repositories.map((repo) => (
                    <label
                      key={repo.repositoryId}
                      className={cn(
                        'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition',
                        selectedRepoIds.includes(repo.repositoryId)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRepoIds.includes(repo.repositoryId)}
                        onChange={() => toggleRepository(repo.repositoryId)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <Server className={cn('w-5 h-5', getRepoTypeColor(repo.repositoryType))} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {repo.repositoryName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {repo.isDeployed ? `현재: ${repo.environment} 환경` : '배포 없음'}
                        </div>
                      </div>
                      {selectedRepoIds.includes(repo.repositoryId) && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Environment Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  배포 환경
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'dev' as const, label: '개발', color: 'blue' },
                    { value: 'staging' as const, label: '스테이징', color: 'yellow' },
                    { value: 'production' as const, label: '프로덕션', color: 'red' },
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedEnvironment(value)}
                      className={cn(
                        'p-3 rounded-lg border-2 font-medium transition',
                        selectedEnvironment === value
                          ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`
                          : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deploy Options */}
              <div>
                <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <input
                    type="checkbox"
                    checked={deployInParallel}
                    onChange={(e) => setDeployInParallel(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">병렬 배포</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      모든 레포지토리를 동시에 배포합니다 (더 빠름)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-300 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedRepoIds.length}개 레포지토리 선택됨
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  취소
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  disabled={selectedRepoIds.length === 0}
                  className={cn(
                    'px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium transition',
                    selectedRepoIds.length === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:from-purple-600 hover:to-blue-600'
                  )}
                >
                  배포 진행
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
