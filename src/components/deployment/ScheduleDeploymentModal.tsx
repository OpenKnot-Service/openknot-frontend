import { useState } from 'react';
import { X, CalendarClock, Clock, Server, CheckCircle } from 'lucide-react';
import { DeploymentStatus } from '../../types';
import { cn } from '../../lib/utils';

interface ScheduleDeploymentModalProps {
  repositories: DeploymentStatus[];
  onClose: () => void;
  onSchedule: (schedule: ScheduledDeploymentInput) => void;
}

export interface ScheduledDeploymentInput {
  repositoryIds: string[];
  environment: 'dev' | 'staging' | 'production';
  scheduledAt: Date;
  note?: string;
}

export function ScheduleDeploymentModal({ repositories, onClose, onSchedule }: ScheduleDeploymentModalProps) {
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>(repositories[0] ? [repositories[0].repositoryId] : []);
  const [environment, setEnvironment] = useState<'dev' | 'staging' | 'production'>('staging');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [note, setNote] = useState('');

  const toggleRepo = (repoId: string) => {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]
    );
  };

  const isFormValid = selectedRepoIds.length > 0 && scheduleDate && scheduleTime;

  const handleSubmit = () => {
    if (!isFormValid) return;
    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
    onSchedule({
      repositoryIds: selectedRepoIds,
      environment,
      scheduledAt,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-300">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">배포 예약</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">선택한 환경에 정해진 시간에 배포합니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid flex-1 gap-6 overflow-y-auto px-6 py-5 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              레포지토리 선택
            </label>
            <div className="space-y-2">
              {repositories.map((repo) => (
                <label
                  key={repo.repositoryId}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition',
                    selectedRepoIds.includes(repo.repositoryId)
                      ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-500/60 dark:bg-indigo-500/10'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedRepoIds.includes(repo.repositoryId)}
                    onChange={() => toggleRepo(repo.repositoryId)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Server className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{repo.repositoryName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {repo.isDeployed ? `${repo.environment ?? '미정'} 환경 사용 중` : '배포 안 됨'}
                    </p>
                  </div>
                  {selectedRepoIds.includes(repo.repositoryId) && (
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                  )}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              배포 환경
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'dev' as const, label: '개발' },
                { value: 'staging' as const, label: '스테이징' },
                { value: 'production' as const, label: '프로덕션' },
              ].map((env) => (
                <button
                  key={env.value}
                  onClick={() => setEnvironment(env.value)}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm font-semibold transition',
                    environment === env.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                  )}
                >
                  {env.label}
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                날짜
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(event) => setScheduleDate(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </label>
              <label className="text-sm text-gray-600 dark:text-gray-400">
                시간
                <div className="relative mt-1">
                  <Clock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(event) => setScheduleTime(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </label>
            </div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              메모 (선택)
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                placeholder="변경 사항이나 유의할 점을 기록하세요"
              />
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/60">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            선택된 레포지토리 {selectedRepoIds.length}개 · {environment.toUpperCase()} 환경 예약
          </p>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-semibold text-white transition',
              isFormValid ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-400 cursor-not-allowed'
            )}
          >
            예약 등록
          </button>
        </div>
      </div>
    </div>
  );
}
