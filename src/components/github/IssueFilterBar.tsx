import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

export type IssueState = 'all' | 'open' | 'closed';

interface IssueFilterBarProps {
  searchQuery: string;
  selectedState: IssueState;
  selectedAssignee: string;
  selectedLabel: string;
  selectedMilestone: string;
  assignees: string[];
  labels: string[];
  milestones: string[];
  onSearchChange: (query: string) => void;
  onStateChange: (state: IssueState) => void;
  onAssigneeChange: (assignee: string) => void;
  onLabelChange: (label: string) => void;
  onMilestoneChange: (milestone: string) => void;
  onResetFilters: () => void;
}

const inactiveChipClass =
  'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600';

const stateOptions: {
  value: IssueState;
  label: string;
  activeClass: string;
}[] = [
  {
    value: 'all',
    label: '전체',
    activeClass:
      'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-500 ring-2 ring-gray-400/60',
  },
  {
    value: 'open',
    label: 'Open',
    activeClass:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300/60 ring-2 ring-emerald-500/70',
  },
  {
    value: 'closed',
    label: 'Closed',
    activeClass:
      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-300/60 ring-2 ring-rose-500/70',
  },
];

export default function IssueFilterBar({
  searchQuery,
  selectedState,
  selectedAssignee,
  selectedLabel,
  selectedMilestone,
  assignees,
  labels,
  milestones,
  onSearchChange,
  onStateChange,
  onAssigneeChange,
  onLabelChange,
  onMilestoneChange,
  onResetFilters,
}: IssueFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    selectedState !== 'all' ||
    selectedAssignee !== 'all' ||
    selectedLabel !== 'all' ||
    selectedMilestone !== 'all';

  const clearFilters = () => {
    onResetFilters();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="이슈 제목이나 본문으로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            showFilters || hasActiveFilters
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">필터</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              {[
                selectedState !== 'all',
                selectedAssignee !== 'all',
                selectedLabel !== 'all',
                selectedMilestone !== 'all',
              ].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            title="필터 초기화"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        )}
      </div>

      {showFilters && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          {/* State Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              상태
            </label>
            <div className="flex flex-wrap gap-2">
              {stateOptions.map(({ value, label, activeClass }) => (
                <button
                  key={value}
                  onClick={() => onStateChange(value)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    selectedState === value ? activeClass : inactiveChipClass
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee Filter */}
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                담당자
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => onAssigneeChange(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">전체 담당자</option>
                {assignees.map((assignee) => (
                  <option key={assignee} value={assignee}>
                    {assignee}
                  </option>
                ))}
              </select>
            </div>

            {/* Label Filter */}
            <div className="lg:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                라벨
              </label>
              <select
                value={selectedLabel}
                onChange={(e) => onLabelChange(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">전체 라벨</option>
                {labels.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Milestone Filter */}
            <div className="lg:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                마일스톤
              </label>
              <select
                value={selectedMilestone}
                onChange={(e) => onMilestoneChange(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">전체 마일스톤</option>
                {milestones.map((milestone) => (
                  <option key={milestone} value={milestone}>
                    {milestone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
