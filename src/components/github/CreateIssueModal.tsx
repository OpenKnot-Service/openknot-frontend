import { FormEvent, useEffect, useMemo, useState } from 'react';
import { X, AlertCircle, Users, Tag, Flag, CheckCircle2 } from 'lucide-react';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignees: string[];
  labelSuggestions: string[];
  milestoneOptions: string[];
  onSubmit: (data: {
    title: string;
    body: string;
    labels: string[];
    assignees: string[];
    milestone?: string | null;
    state: 'open' | 'closed';
  }) => boolean;
}

export default function CreateIssueModal({
  isOpen,
  onClose,
  assignees,
  labelSuggestions,
  milestoneOptions,
  onSubmit,
}: CreateIssueModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState('');
  const [milestone, setMilestone] = useState('');
  const [issueState, setIssueState] = useState<'open' | 'closed'>('open');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setSelectedAssignees([]);
    setSelectedLabels([]);
    setLabelInput('');
    setMilestone('');
    setIssueState('open');
    setError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const combinedLabelSuggestions = useMemo(() => {
    const set = new Set<string>(labelSuggestions);
    selectedLabels.forEach((label) => set.add(label));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [labelSuggestions, selectedLabels]);

  const toggleSelection = (value: string, collection: string[], setCollection: (next: string[]) => void) => {
    if (collection.includes(value)) {
      setCollection(collection.filter((item) => item !== value));
    } else {
      setCollection([...collection, value]);
    }
  };

  const handleAddLabel = () => {
    const trimmed = labelInput.trim();
    if (!trimmed) return;
    if (!selectedLabels.includes(trimmed)) {
      setSelectedLabels([...selectedLabels, trimmed]);
    }
    setLabelInput('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('제목을 입력해주세요.');
      return;
    }

    const success = onSubmit({
      title: trimmedTitle,
      body: body.trim(),
      labels: selectedLabels,
      assignees: selectedAssignees,
      milestone: milestone.trim() ? milestone.trim() : null,
      state: issueState,
    });

    if (success) {
      resetForm();
      onClose();
    } else {
      setError('이슈를 생성하지 못했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <h2 className="text-lg font-semibold">새 Issue 만들기</h2>
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
                  placeholder="예: 로그인 실패 시 에러 메시지 개선"
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
                  placeholder="문제 상황이나 개선이 필요한 내용을 자세히 적어주세요."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  마크다운을 지원합니다.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <CheckCircle2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    상태
                  </label>
                  <select
                    value={issueState}
                    onChange={(event) => setIssueState(event.target.value as 'open' | 'closed')}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Flag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    마일스톤
                  </label>
                  <input
                    type="text"
                    list="issue-milestone-suggestions"
                    value={milestone}
                    onChange={(event) => setMilestone(event.target.value)}
                    placeholder="예: v1.1 릴리스"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <datalist id="issue-milestone-suggestions">
                    {milestoneOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    비워두면 마일스톤이 지정되지 않습니다.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  담당자
                </label>
                {assignees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {assignees.map((assignee) => {
                      const isSelected = selectedAssignees.includes(assignee);
                      return (
                        <button
                          type="button"
                          key={assignee}
                          onClick={() => toggleSelection(assignee, selectedAssignees, setSelectedAssignees)}
                          className={`rounded-full border px-3 py-1 text-sm transition ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300'
                          }`}
                        >
                          {assignee}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700/40 dark:text-gray-300">
                    지정 가능한 담당자가 없습니다. 프로젝트에 구성원을 추가해주세요.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    라벨
                  </label>
                  {selectedLabels.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      선택됨: {selectedLabels.length}개
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {combinedLabelSuggestions.map((label) => {
                    const isSelected = selectedLabels.includes(label);
                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => toggleSelection(label, selectedLabels, setSelectedLabels)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={labelInput}
                    onChange={(event) => setLabelInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleAddLabel();
                      }
                    }}
                    placeholder="새 라벨 입력 후 Enter"
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddLabel}
                    className="rounded-lg border border-blue-500 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-offset-gray-900"
              >
                이슈 생성
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
