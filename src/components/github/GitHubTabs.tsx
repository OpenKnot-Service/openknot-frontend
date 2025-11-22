import type { LucideIcon } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface GitHubTabsProps {
  tabs: readonly Tab[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
}

export default function GitHubTabs({ tabs, selectedTab, onTabChange }: GitHubTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      {/* Mobile & Tablet: Horizontal scroll */}
      {/* Desktop: Regular flex */}
      <div className="flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition whitespace-nowrap shrink-0 ${
              selectedTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
