import { useEffect, useMemo, useState, FormEvent } from 'react';
import { X, GitPullRequest, GitBranch, Tag, Users } from 'lucide-react';
import type { GitHubBranch } from '../../types';

interface ReviewerOption {
  username: string;
  name: string;
  avatar?: string;
}

interface CreatePullRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: GitHubBranch[];
  defaultBaseBranch?: string;
  availableReviewers: ReviewerOption[];
  availableLabels: string[];
  onSubmit: (data: {
    title: string;
    body: string;
    headBranch: string;
    baseBranch: string;
    reviewers: string[];
    assignees: string[];
    labels: string[];
  }) => void;
}

const DEFAULT_LABEL_SUGGESTIONS = ['feature', 'bug', 'enhancement', 'documentation', 'refactor'];

export default function CreatePullRequestModal({
  isOpen,
  onClose,
  branches,
  defaultBaseBranch,
  availableReviewers,
  availableLabels,
  onSubmit,
}: CreatePullRequestModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [baseBranch, setBaseBranch] = useState('');
  const [headBranch, setHeadBranch] = useState('');
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const branchOptions = useMemo(() => branches.map((branch) => branch.name), [branches]);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setBody('');
      setBaseBranch(defaultBaseBranch ?? branches[0]?.name ?? '');
      setHeadBranch(branches.find((branch) => branch.name !== defaultBaseBranch)?.name ?? branches[0]?.name ?? '');
      setSelectedReviewers([]);
      setSelectedAssignees([]);
      setSelectedLabels([]);
      setNewLabel('');
      setError(null);
    } else if (!baseBranch) {
      setBaseBranch(defaultBaseBranch ?? branches[0]?.name ?? '');
      setHeadBranch(branches.find((branch) => branch.name !== defaultBaseBranch)?.name ?? branches[0]?.name ?? '');
    }
  }, [isOpen, branches, defaultBaseBranch, baseBranch]);

  const labelSuggestions = useMemo(() => {
    const combined = new Set([...DEFAULT_LABEL_SUGGESTIONS, ...availableLabels]);
    return Array.from(combined);
  }, [availableLabels]);

  const toggleSelection = (value: string, collection: string[], setCollection: (values: string[]) => void) => {
    if (collection.includes(value)) {
      setCollection(collection.filter((item) => item !== value));
    } else {
      setCollection([...collection, value]);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!headBranch || (headBranch === baseBranch && branchOptions.length > 1)) {
      setError('비교 브랜치는 기준 브랜치와 달라야 합니다.');
      return;
    }

    onSubmit({
      title: title.trim(),
      body: body.trim(),
      headBranch,
      baseBranch,
      reviewers: selectedReviewers,
      assignees: selectedAssignees,
      labels: selectedLabels,
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <GitPullRequest className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <h2 className="text-lg font-semibold">새 Pull Request 만들기</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto px-5 py-6">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  제목<span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="예: feat: 로그인 흐름 리팩터링"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  설명
                </label>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={6}
                  placeholder="변경 사항과 테스트 계획을 작성해주세요."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  마크다운을 지원합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <GitBranch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    기준 브랜치
                  </label>
                  <select
                    value={baseBranch}
                    onChange={(event) => setBaseBranch(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <GitBranch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    비교 브랜치
                  </label>
                  <select
                    value={headBranch}
                    onChange={(event) => setHeadBranch(event.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  라벨
                </label>
                <div className="flex flex-wrap gap-2">
                  {labelSuggestions.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleSelection(label, selectedLabels, setSelectedLabels)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        selectedLabels.includes(label)
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(event) => setNewLabel(event.target.value)}
                    placeholder="새 라벨 입력"
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = newLabel.trim();
                      if (!trimmed) return;
                      if (!selectedLabels.includes(trimmed)) {
                        setSelectedLabels([...selectedLabels, trimmed]);
                      }
                      setNewLabel('');
                    }}
                    className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    추가
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    리뷰어
                  </label>
                  <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    {availableReviewers.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        리뷰어를 추가할 수 있는 멤버가 없습니다.
                      </p>
                    )}
                    {availableReviewers.map((reviewer) => (
                      <button
                        key={reviewer.username}
                        type="button"
                        onClick={() =>
                          toggleSelection(reviewer.username, selectedReviewers, setSelectedReviewers)
                        }
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                          selectedReviewers.includes(reviewer.username)
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="truncate text-left text-gray-700 dark:text-gray-200">
                          {reviewer.name}
                          <span className="ml-1 text-xs text-gray-400">@{reviewer.username}</span>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedReviewers.includes(reviewer.username) ? '선택됨' : '선택'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    담당자
                  </label>
                  <div className="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    {availableReviewers.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        담당자로 지정할 멤버가 없습니다.
                      </p>
                    )}
                    {availableReviewers.map((reviewer) => (
                      <button
                        key={reviewer.username}
                        type="button"
                        onClick={() =>
                          toggleSelection(reviewer.username, selectedAssignees, setSelectedAssignees)
                        }
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                          selectedAssignees.includes(reviewer.username)
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="truncate text-left text-gray-700 dark:text-gray-200">
                          {reviewer.name}
                          <span className="ml-1 text-xs text-gray-400">@{reviewer.username}</span>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedAssignees.includes(reviewer.username) ? '선택됨' : '선택'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Pull Request 생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
