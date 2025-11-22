import { useEffect, useMemo, useState } from 'react';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  FileCode,
  Star,
  GitFork,
  AlertCircle,
  Network,
  Menu,
  CheckCircle2,
  User,
  Tag,
  Users,
  MessageCircle,
} from 'lucide-react';
import { useProjectOutletContext } from '../components/layout/ProjectLayout';
import { useApp } from '../contexts/AppContext';
import { GitHubProvider, useGitHub } from '../contexts/GitHubContext';
import { getDeploymentStatus, getMonitoringStatus, getUserById } from '../lib/mockData';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import D3CommitGraph from '../components/github/D3CommitGraph';
import CommitDetailPanel from '../components/github/CommitDetailPanel';
import PullRequestDetailPanel from '../components/github/PullRequestDetailPanel';
import CreatePullRequestModal from '../components/github/CreatePullRequestModal';
import PullRequestReviewDrawer from '../components/github/PullRequestReviewDrawer';
import RepositorySwitcher from '../components/github/RepositorySwitcher';
import GitHubTabs from '../components/github/GitHubTabs';
import BottomSheet from '../components/ui/BottomSheet';
import FileDiffModal from '../components/github/diff/FileDiffModal';
import PullRequestFilterBar, { type PRState, type ReviewStatus } from '../components/github/PullRequestFilterBar';
import IssueFilterBar, { type IssueState } from '../components/github/IssueFilterBar';
import CreateIssueModal from '../components/github/CreateIssueModal';
import GitHubNotificationBadge from '../components/github/GitHubNotificationBadge';
import LineCommentSidebar from '../components/github/LineCommentSidebar';
import IssueDetailPanel from '../components/github/IssueDetailPanel';
import { FileTreeToolbar } from '../components/github/FileTreeToolbar';
import { RepositoryFileTree } from '../components/github/RepositoryFileTree';
import { FileContentViewer } from '../components/github/FileContentViewer';
import { ResizableSplitPane } from '../components/ui/ResizableSplitPane';
import type {
  GitHubCommit,
  GitHubFileChange,
  GitHubPullRequest,
  GitHubIssue,
  PullRequestReviewStatus,
  GitHubTreeItem,
  MonitoringStatus,
} from '../types';
import { copyToClipboard } from '../utils/fileUtils';

type ReviewerOption = {
  username: string;
  name: string;
  avatar?: string;
};

const DEFAULT_ISSUE_LABELS = ['bug', 'enhancement', 'documentation', 'question', 'refactor'];

type RepositoryHealth = 'healthy' | 'degraded' | 'unhealthy';

const normalizeHealthStatus = (
  status?: MonitoringStatus['healthStatus']
): RepositoryHealth | undefined => {
  if (!status) return undefined;
  if (status === 'down') return 'unhealthy';
  if (status === 'healthy' || status === 'degraded') return status;
  return 'healthy';
};

type NormalizedMonitoringStatus =
  | (Omit<MonitoringStatus, 'healthStatus'> & { healthStatus?: RepositoryHealth })
  | null;

function GitHubPageContent() {
  const { project } = useProjectOutletContext();
  const {
    selectedRepository,
    repositories,
    selectRepository,
    selectedView,
    setSelectedView,
    searchQuery,
    setSearchQuery,
    pullRequests,
    issues,
    commits,
    branches,
    createPullRequest,
    submitPullRequestReview,
    addLineComment,
    resolveLineComment,
    deleteLineComment,
    issueFilters,
    setIssueFilters,
    createIssue,
    selectedBranch,
    setSelectedBranch,
    fileTree,
    selectedFile: selectedFileContent,
    loadFileContent,
    toggleFilePath,
    fileTreeState,
  } = useGitHub();
  const { user } = useApp();
  const navigate = useNavigate();
  const currentReviewerUsername = user?.githubUsername ?? user?.name ?? '게스트';
  const currentUserAvatar = user?.avatar || user?.profileImageUrl;
  const currentUserId = user?.id;
  const [selectedCommit, setSelectedCommit] = useState<GitHubCommit | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<GitHubFileChange | null>(null);
  const [selectedPullRequest, setSelectedPullRequest] = useState<GitHubPullRequest | null>(null);
  const [isPullRequestPanelOpen, setIsPullRequestPanelOpen] = useState(false);
  const [isCreatePrModalOpen, setIsCreatePrModalOpen] = useState(false);
  const [reviewDrawerPr, setReviewDrawerPr] = useState<GitHubPullRequest | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [issueSearchQuery, setIssueSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [isIssuePanelOpen, setIsIssuePanelOpen] = useState(false);
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);

  // Line comment sidebar state
  const [commentSidebarData, setCommentSidebarData] = useState<{
    filename: string;
    lineNumber: number;
    side: 'left' | 'right';
  } | null>(null);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);

  // File browser states
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);

  // PR Filter states
  const [prSearchQuery, setPrSearchQuery] = useState('');
  const [prStateFilter, setPrStateFilter] = useState<PRState>('all');
  const [prReviewStatusFilter, setPrReviewStatusFilter] = useState<ReviewStatus>('all');
  const [prAuthorFilter, setPrAuthorFilter] = useState('all');

  const deploymentStatus = selectedRepository ? getDeploymentStatus(selectedRepository.id) : null;
  const monitoringStatus = selectedRepository ? getMonitoringStatus(selectedRepository.id) : null;

  useEffect(() => {
    if (selectedPullRequest) {
      const latest = pullRequests.find((pr) => pr.id === selectedPullRequest.id);
      if (latest && latest !== selectedPullRequest) {
        setSelectedPullRequest(latest);
      }
    }
  }, [pullRequests, selectedPullRequest]);

  useEffect(() => {
    if (reviewDrawerPr) {
      const latest = pullRequests.find((pr) => pr.id === reviewDrawerPr.id);
      if (latest && latest !== reviewDrawerPr) {
        setReviewDrawerPr(latest);
      }
    }
  }, [pullRequests, reviewDrawerPr]);

  useEffect(() => {
    if (selectedIssue) {
      const latest = issues.find((issue) => issue.id === selectedIssue.id);
      if (!latest) {
        setSelectedIssue(null);
        setIsIssuePanelOpen(false);
      } else if (latest !== selectedIssue) {
        setSelectedIssue(latest);
      }
    }
  }, [issues, selectedIssue]);

  const reviewerOptions = useMemo<ReviewerOption[]>(() => {
    const unique = new Map<string, ReviewerOption>();

    if (project) {
      project.members.forEach((member) => {
        const user = getUserById(member.userId);
        if (!user) return;
        const username = user.githubUsername ?? user.name;
        if (!username) return;
        if (!unique.has(username)) {
          unique.set(username, {
            username,
            name: user.name,
            avatar: user.avatar,
          });
        }
      });
    }

    pullRequests.forEach((pr) => {
      const authorUsername = pr.author.username;
      if (!unique.has(authorUsername)) {
        unique.set(authorUsername, {
          username: authorUsername,
          name: authorUsername,
          avatar: pr.author.avatarUrl,
        });
      }

      pr.reviewers.forEach((reviewer) => {
        if (!unique.has(reviewer.username)) {
          unique.set(reviewer.username, {
            username: reviewer.username,
            name: reviewer.username,
            avatar: reviewer.avatarUrl,
          });
        }
      });
    });

    return Array.from(unique.values());
  }, [project, pullRequests]);

  const labelSuggestions = useMemo(() => {
    const set = new Set<string>();
    pullRequests.forEach((pr) => pr.labels.forEach((label) => set.add(label)));
    return Array.from(set);
  }, [pullRequests]);

  // PR Authors for filter dropdown
  const prAuthors = useMemo(() => {
    const set = new Set<string>();
    pullRequests.forEach((pr) => set.add(pr.author.username));
    return Array.from(set);
  }, [pullRequests]);

  const issueAssignees = useMemo(() => {
    const set = new Set<string>();
    issues.forEach((issue) => issue.assignees.forEach((assignee) => set.add(assignee)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [issues]);

  const issueLabels = useMemo(() => {
    const set = new Set<string>();
    issues.forEach((issue) => issue.labels.forEach((label) => set.add(label)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [issues]);

  const issueMilestones = useMemo(() => {
    const set = new Set<string>();
    issues.forEach((issue) => {
      if (issue.milestone?.title) {
        set.add(issue.milestone.title);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [issues]);

  const issueAssigneeOptions = useMemo(() => {
    const set = new Set<string>();
    reviewerOptions.forEach((option) => set.add(option.username));
    issues.forEach((issue) => issue.assignees.forEach((assignee) => set.add(assignee)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [reviewerOptions, issues]);

  const issueLabelSuggestions = useMemo(() => {
    const set = new Set<string>(DEFAULT_ISSUE_LABELS);
    issueLabels.forEach((label) => set.add(label));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [issueLabels]);

  // Filtered PRs
  const filteredPullRequests = useMemo(() => {
    return pullRequests.filter((pr) => {
      // Search filter
      if (prSearchQuery && !pr.title.toLowerCase().includes(prSearchQuery.toLowerCase())) {
        return false;
      }

      // State filter
      if (prStateFilter !== 'all' && pr.state !== prStateFilter) {
        return false;
      }

      // Review status filter
      if (prReviewStatusFilter !== 'all') {
        if (prReviewStatusFilter === 'needs_review') {
          const hasPendingReviews = pr.reviewers.some((r) => r.status === 'pending');
          if (!hasPendingReviews) return false;
        } else if (prReviewStatusFilter === 'approved') {
          const allApproved = pr.reviewers.length > 0 && pr.reviewers.every((r) => r.status === 'approved');
          if (!allApproved) return false;
        } else if (prReviewStatusFilter === 'changes_requested') {
          const hasChangesRequested = pr.reviewers.some((r) => r.status === 'changes_requested');
          if (!hasChangesRequested) return false;
        }
      }

      // Author filter
      if (prAuthorFilter !== 'all' && pr.author.username !== prAuthorFilter) {
        return false;
      }

      return true;
    });
  }, [pullRequests, prSearchQuery, prStateFilter, prReviewStatusFilter, prAuthorFilter]);

  const filteredIssues = useMemo(() => {
    const stateFilter = issueFilters.state ?? 'all';
    const assigneeFilter = issueFilters.assignee ?? 'all';
    const labelFilter = issueFilters.label ?? 'all';
    const milestoneFilter = issueFilters.milestone ?? 'all';
    const query = issueSearchQuery.trim().toLowerCase();

    return issues
      .filter((issue) => {
        if (stateFilter !== 'all' && issue.state !== stateFilter) {
          return false;
        }

        if (assigneeFilter !== 'all' && !issue.assignees.includes(assigneeFilter)) {
          return false;
        }

        if (labelFilter !== 'all' && !issue.labels.includes(labelFilter)) {
          return false;
        }

        if (milestoneFilter !== 'all') {
          if (!issue.milestone || issue.milestone.title !== milestoneFilter) {
            return false;
          }
        }

        if (query) {
          const inTitle = issue.title.toLowerCase().includes(query);
          const inBody = issue.body.toLowerCase().includes(query);
          const inNumber = `#${issue.number}`.includes(query);
          if (!inTitle && !inBody && !inNumber) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [issues, issueFilters, issueSearchQuery]);

  const handleDeepLink = (tab: 'deployment' | 'monitoring') => {
    if (!selectedRepository) return;
    navigate(`/projects/${project.id}/${tab}?repo=${selectedRepository.id}`);
  };

  const handleCommitClick = (commit: GitHubCommit) => {
    setSelectedCommit(commit);
    setIsDetailPanelOpen(true);
  };

  const handleFileClick = (file: GitHubFileChange) => {
    setSelectedFile(file);
    setIsDiffModalOpen(true);
  };

  const getIssueStateMeta = (state: GitHubIssue['state']) => {
    if (state === 'open') {
      return {
        label: 'Open',
        icon: AlertCircle,
        iconClasses: 'text-emerald-500 dark:text-emerald-400',
        badgeClasses: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      };
    }
    return {
      label: 'Closed',
      icon: CheckCircle2,
      iconClasses: 'text-rose-500 dark:text-rose-400',
      badgeClasses: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    };
  };

  const tabs = [
    { id: 'graph', label: 'Branch', icon: Network },
    { id: 'commits', label: 'Commit', icon: GitCommit, count: commits.length },
    { id: 'prs', label: 'Pull Requests', icon: GitPullRequest, count: pullRequests.length },
    { id: 'issues', label: 'Issues', icon: AlertCircle, count: issues.length },
    { id: 'files', label: '파일', icon: FileCode },
  ] as const;

  const handleRepositoryChange = (repoId: string) => {
    selectRepository(repoId);
    setSelectedCommit(null);
    setIsDetailPanelOpen(false);
    setSelectedPullRequest(null);
    setIsPullRequestPanelOpen(false);
    setSelectedFile(null);
    setIsDiffModalOpen(false);
    setIsCreatePrModalOpen(false);
    setReviewDrawerPr(null);
    setIsReviewDrawerOpen(false);
    setIssueSearchQuery('');
    setSelectedIssue(null);
    setIsIssuePanelOpen(false);
  };

  const handleRepositorySelect = (repoId: string) => {
    handleRepositoryChange(repoId);
    setIsBottomSheetOpen(false);
  };

  const handlePullRequestClick = (pr: GitHubPullRequest) => {
    const latest = pullRequests.find((item) => item.id === pr.id) ?? pr;
    setSelectedPullRequest(latest);
    setIsPullRequestPanelOpen(true);
    setSelectedCommit(null);
    setIsDetailPanelOpen(false);
    setReviewDrawerPr(null);
    setIsReviewDrawerOpen(false);
  };

  const handleIssueClick = (issue: GitHubIssue) => {
    const latest = issues.find((item) => item.id === issue.id) ?? issue;
    setSelectedIssue(latest);
    setIsIssuePanelOpen(true);
    setSelectedPullRequest(null);
    setIsPullRequestPanelOpen(false);
    setSelectedCommit(null);
    setIsDetailPanelOpen(false);
  };

  const handleIssueCreate = (data: {
    title: string;
    body: string;
    labels: string[];
    assignees: string[];
    milestone?: string | null;
    state: 'open' | 'closed';
  }) => {
    const created = createIssue({
      title: data.title,
      body: data.body,
      labels: data.labels,
      assignees: data.assignees,
      milestone: data.milestone ?? null,
      state: data.state,
    });

    if (created) {
      setSelectedIssue(created);
      setIsIssuePanelOpen(true);
      return true;
    }

    return false;
  };

  const handleLineCommentClick = (filename: string, lineNumber: number, side: 'left' | 'right') => {
    setCommentSidebarData({ filename, lineNumber, side });
    setIsCommentSidebarOpen(true);
  };

  const handleCommentSidebarClose = () => {
    setIsCommentSidebarOpen(false);
  };

  const handleCreatePullRequest = (data: {
    title: string;
    body: string;
    headBranch: string;
    baseBranch: string;
    reviewers: string[];
    assignees: string[];
    labels: string[];
  }) => {
    const reviewerEntries = data.reviewers.map((username) => {
      const option = reviewerOptions.find((reviewer) => reviewer.username === username);
      return {
        username,
        avatarUrl: option?.avatar,
      };
    });

    const created = createPullRequest({
      title: data.title,
      body: data.body,
      headBranch: data.headBranch,
      baseBranch: data.baseBranch,
      labels: data.labels,
      assignees: data.assignees,
      reviewers: reviewerEntries,
    });

    if (created) {
      setSelectedPullRequest(created);
      setIsPullRequestPanelOpen(true);
    }
  };

  const handleReviewOpen = (pr: GitHubPullRequest) => {
    const latest = pullRequests.find((item) => item.id === pr.id) ?? pr;
    setReviewDrawerPr(latest);
    setIsReviewDrawerOpen(true);
  };

  const handleReviewSubmit = (status: PullRequestReviewStatus, comment: string) => {
    if (!reviewDrawerPr) return;
    submitPullRequestReview(reviewDrawerPr.id, currentReviewerUsername, status, comment);
    setIsReviewDrawerOpen(false);
    setReviewDrawerPr(null);
  };

  const handleIssueStateChange = (state: IssueState) => {
    setIssueFilters({
      ...issueFilters,
      state,
    });
  };

  const handleIssueAssigneeChange = (assignee: string) => {
    setIssueFilters({
      ...issueFilters,
      assignee,
    });
  };

  const handleIssueLabelChange = (label: string) => {
    setIssueFilters({
      ...issueFilters,
      label,
    });
  };

  const handleIssueMilestoneChange = (milestone: string) => {
    setIssueFilters({
      ...issueFilters,
      milestone,
    });
  };

  const resetIssueFilters = () => {
    setIssueFilters({
      state: 'all',
      assignee: 'all',
      label: 'all',
      milestone: 'all',
    });
    setIssueSearchQuery('');
  };

  const normalizedMonitoringStatus: NormalizedMonitoringStatus = useMemo(() => {
    if (!monitoringStatus) return null;
    const { healthStatus, ...rest } = monitoringStatus;
    return {
      ...rest,
      healthStatus: normalizeHealthStatus(healthStatus) as RepositoryHealth | undefined,
    } as NormalizedMonitoringStatus;
  }, [monitoringStatus]);

  return (
    <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
      {/* Mobile: Repository Selector Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedRepository ? selectedRepository.name : '저장소 선택'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {repositories.length}개
          </span>
        </button>
      </div>

      {/* Desktop: Left Sidebar - Repository Switcher */}
      <div className="hidden lg:block lg:w-80 lg:shrink-0">
        <div className="sticky top-6">
          <RepositorySwitcher
            repositories={repositories}
            selectedRepository={selectedRepository}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectRepository={handleRepositoryChange}
            deploymentStatus={deploymentStatus}
            monitoringStatus={normalizedMonitoringStatus}
            onDeploymentClick={() => handleDeepLink('deployment')}
            onMonitoringClick={() => handleDeepLink('monitoring')}
          />
        </div>
      </div>

      {/* Mobile: Bottom Sheet - Repository Switcher */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="저장소 선택"
        maxHeight="85vh"
      >
        <RepositorySwitcher
          repositories={repositories}
          selectedRepository={selectedRepository}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectRepository={handleRepositorySelect}
          deploymentStatus={deploymentStatus}
          monitoringStatus={normalizedMonitoringStatus}
          onDeploymentClick={() => {
            handleDeepLink('deployment');
            setIsBottomSheetOpen(false);
          }}
          onMonitoringClick={() => {
            handleDeepLink('monitoring');
            setIsBottomSheetOpen(false);
          }}
        />
      </BottomSheet>

      {/* Main Content Area */}
      <div className="flex-1 space-y-3 md:space-y-6 min-w-0">
        {selectedRepository ? (
          <>
            {/* Header */}
            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-4 md:p-6 text-white shadow-lg">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold mb-2 truncate">{selectedRepository.fullName}</h1>
                  <p className="text-purple-100 text-sm md:text-base line-clamp-2">{selectedRepository.description}</p>
                  <div className="mt-3 md:mt-4 flex flex-wrap gap-3 md:gap-4 text-sm">
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <Star className="h-4 w-4" />
                      {selectedRepository.stars} stars
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <GitFork className="h-4 w-4" />
                      {selectedRepository.forks} forks
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <GitBranch className="h-4 w-4" />
                      {selectedRepository.defaultBranch}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <GitHubNotificationBadge
                    onNavigateToPR={(prId) => {
                      const pr = pullRequests.find((p) => p.id === prId);
                      if (pr) {
                        handlePullRequestClick(pr);
                      }
                    }}
                  />
                  <a
                    href={selectedRepository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/30 backdrop-blur whitespace-nowrap text-center"
                  >
                    GitHub에서 보기
                  </a>
                </div>
              </div>
            </div>

            {/* View Tabs */}
            <GitHubTabs
              tabs={tabs}
              selectedTab={selectedView}
              onTabChange={(tabId) => setSelectedView(tabId as typeof selectedView)}
            />

            {/* View Content */}
            <div className="rounded-2xl md:rounded-3xl border border-gray-100 bg-white p-4 md:p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {selectedView === 'commits' && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">Commit History</h2>
                  <div className="space-y-3 md:space-y-4">
                    {commits.slice(0, 10).map((commit) => (
                      <div
                        key={commit.sha}
                        onClick={() => handleCommitClick(commit)}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 border-b border-gray-100 pb-3 md:pb-4 last:border-0 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-2 px-2 py-2 rounded-lg transition"
                      >
                        <img
                          src={commit.author.avatarUrl}
                          alt={commit.author.name}
                          className="h-10 w-10 rounded-full shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white line-clamp-2">{commit.message}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {commit.author.name} · {formatDistanceToNow(commit.date, { addSuffix: true, locale: ko })}
                              </p>
                            </div>
                            <code className="text-xs text-gray-500 shrink-0">{commit.sha.substring(0, 7)}</code>
                          </div>
                          {commit.stats && (
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                              <span className="text-green-600">+{commit.stats.additions}</span>
                              {' / '}
                              <span className="text-red-600">-{commit.stats.deletions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedView === 'graph' && (
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">Branch Tree</h2>
                  <D3CommitGraph
                    commits={commits}
                    branches={branches}
                    onCommitClick={handleCommitClick}
                    selectedCommitSha={selectedCommit?.sha}
                  />
                </div>
              )}

              {selectedView === 'prs' && (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2 md:mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Pull Requests</h2>
                    <button
                      type="button"
                      onClick={() => setIsCreatePrModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                      disabled={!selectedRepository}
                    >
                      <GitPullRequest className="h-4 w-4" />
                      새 Pull Request
                    </button>
                  </div>

                  {/* PR Filter Bar */}
                  <div className="mb-4">
                    <PullRequestFilterBar
                      searchQuery={prSearchQuery}
                      onSearchChange={setPrSearchQuery}
                      selectedState={prStateFilter}
                      onStateChange={setPrStateFilter}
                      selectedReviewStatus={prReviewStatusFilter}
                      onReviewStatusChange={setPrReviewStatusFilter}
                      selectedAuthor={prAuthorFilter}
                      onAuthorChange={setPrAuthorFilter}
                      authors={prAuthors}
                    />
                  </div>

                  {/* PR List */}
                  {filteredPullRequests.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                      <GitPullRequest className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        {prSearchQuery || prStateFilter !== 'all' || prReviewStatusFilter !== 'all' || prAuthorFilter !== 'all'
                          ? '필터 조건에 맞는 PR이 없습니다'
                          : 'Pull Request가 없습니다'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      {filteredPullRequests.map((pr) => (
                      <button
                        key={pr.id}
                        type="button"
                        onClick={() => handlePullRequestClick(pr)}
                        className="w-full rounded-lg border border-gray-200 p-3 text-left transition hover:border-gray-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:hover:border-gray-600 md:p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${
                                pr.state === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                pr.state === 'merged' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {pr.state}
                              </span>
                              <h3 className="flex-1 min-w-0 font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {pr.title}
                              </h3>
                              <span className="shrink-0 text-sm text-gray-500">#{pr.number}</span>
                            </div>
                            <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                              {pr.author.username} ·{' '}
                              <span className="inline-block max-w-[100px] truncate align-bottom" title={pr.headBranch}>
                                {pr.headBranch}
                              </span>{' '}
                              →{' '}
                              <span className="inline-block max-w-[100px] truncate align-bottom" title={pr.baseBranch}>
                                {pr.baseBranch}
                              </span>
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {pr.labels.map((label) => (
                                <span
                                  key={label}
                                  className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex shrink-0 -space-x-2 self-end sm:self-start">
                            {pr.reviewers.slice(0, 3).map((reviewer) => (
                              <img
                                key={reviewer.username}
                                src={reviewer.avatarUrl}
                                alt={reviewer.username}
                                className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
                                title={reviewer.username}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                    </div>
                  )}
                </div>
              )}

              {selectedView === 'issues' && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                        Issues
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredIssues.length}건 표시 중 · 전체 {issues.length}건
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCreateIssueModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                      disabled={!selectedRepository}
                    >
                      <AlertCircle className="h-4 w-4" />
                      새 이슈
                    </button>
                  </div>

                  <IssueFilterBar
                    searchQuery={issueSearchQuery}
                    selectedState={(issueFilters.state ?? 'all') as IssueState}
                    selectedAssignee={issueFilters.assignee ?? 'all'}
                    selectedLabel={issueFilters.label ?? 'all'}
                    selectedMilestone={issueFilters.milestone ?? 'all'}
                    assignees={issueAssignees}
                    labels={issueLabels}
                    milestones={issueMilestones}
                    onSearchChange={setIssueSearchQuery}
                    onStateChange={handleIssueStateChange}
                    onAssigneeChange={handleIssueAssigneeChange}
                    onLabelChange={handleIssueLabelChange}
                    onMilestoneChange={handleIssueMilestoneChange}
                    onResetFilters={resetIssueFilters}
                  />

                  <div className="space-y-3 md:space-y-4">
                    {filteredIssues.length > 0 ? (
                      filteredIssues.map((issue) => {
                        const { label, icon: Icon, iconClasses, badgeClasses } = getIssueStateMeta(issue.state);
                        const description = issue.body.split('\n').find((line) => line.trim()) ?? '';

                        return (
                          <button
                            key={issue.id}
                            onClick={() => handleIssueClick(issue)}
                            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-blue-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500/40 md:p-4"
                          >
                            <div className="flex items-start gap-3 md:gap-4">
                              <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700/60">
                                <Icon className={`h-5 w-5 ${iconClasses}`} />
                              </div>
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClasses}`}>
                                    {label}
                                  </span>
                                  <h3 className="min-w-0 flex-1 text-sm font-semibold text-gray-900 dark:text-white md:text-base line-clamp-1">
                                    {issue.title}
                                  </h3>
                                  <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                                    #{issue.number}
                                  </span>
                                </div>

                                {description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {description}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />
                                    {issue.author.username}
                                  </span>
                                  <span>·</span>
                                  <span>
                                    {formatDistanceToNow(issue.updatedAt, {
                                      addSuffix: true,
                                      locale: ko,
                                    })}{' '}
                                    업데이트
                                  </span>
                                  {issue.assignees.length > 0 && (
                                    <>
                                      <span>·</span>
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        {issue.assignees.join(', ')}
                                      </span>
                                    </>
                                  )}
                                  {issue.labels.length > 0 && (
                                    <>
                                      <span>·</span>
                                      <span className="flex items-center gap-1">
                                        <Tag className="h-3.5 w-3.5" />
                                        {issue.labels.join(', ')}
                                      </span>
                                    </>
                                  )}
                                  {issue.comments.length > 0 && (
                                    <>
                                      <span>·</span>
                                      <span className="flex items-center gap-1">
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        {issue.comments.length}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        조건을 만족하는 이슈가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedView === 'files' && (
                <div className="space-y-4">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                    파일 브라우저
                  </h2>

                  {/* File Tree Toolbar */}
                  <FileTreeToolbar
                    currentBranch={selectedBranch}
                    branches={branches}
                    searchQuery={fileSearchQuery}
                    onSearchChange={setFileSearchQuery}
                    onBranchChange={setSelectedBranch}
                    fileTypeFilter={fileTypeFilter}
                    onFileTypeFilterChange={setFileTypeFilter}
                  />

                  {/* Desktop: Resizable Split View, Mobile: Panel View */}
                  <div className="h-[600px]">
                    {/* Mobile View */}
                    <div className="md:hidden h-full">
                      <div className="h-full bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 overflow-hidden">
                        <div className="h-full overflow-auto p-2">
                          <RepositoryFileTree
                            items={fileTree}
                            expandedPaths={fileTreeState.expandedPaths}
                            selectedFilePath={fileTreeState.selectedFilePath}
                            onTogglePath={toggleFilePath}
                            onSelectFile={(file: GitHubTreeItem) => {
                              if (file.type === 'file') {
                                loadFileContent(file.path);
                                setIsFileViewerOpen(true);
                              }
                            }}
                            onFileAction={(action, file) => {
                              switch (action) {
                                case 'view':
                                  loadFileContent(file.path);
                                  setIsFileViewerOpen(true);
                                  break;
                                case 'download':
                                  if (file.downloadUrl) {
                                    window.open(file.downloadUrl, '_blank');
                                  }
                                  break;
                                case 'copy_path':
                                  copyToClipboard(file.path);
                                  break;
                                case 'open_github':
                                  if (selectedRepository) {
                                    window.open(file.htmlUrl, '_blank');
                                  }
                                  break;
                              }
                            }}
                            searchQuery={fileSearchQuery}
                            fileTypeFilter={fileTypeFilter}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Desktop Resizable Split View */}
                    <div className="hidden md:block h-full">
                      <ResizableSplitPane
                        defaultLeftWidth={33}
                        minLeftWidth={20}
                        maxLeftWidth={60}
                        storageKey="github-file-browser-split"
                        leftPane={
                          <div className="h-full bg-white dark:bg-gray-900 rounded-tl rounded-bl border-y border-l border-gray-300 dark:border-gray-700 overflow-hidden">
                            <div className="h-full overflow-auto p-2">
                              <RepositoryFileTree
                                items={fileTree}
                                expandedPaths={fileTreeState.expandedPaths}
                                selectedFilePath={fileTreeState.selectedFilePath}
                                onTogglePath={toggleFilePath}
                                onSelectFile={(file: GitHubTreeItem) => {
                                  if (file.type === 'file') {
                                    loadFileContent(file.path);
                                  }
                                }}
                                onFileAction={(action, file) => {
                                  switch (action) {
                                    case 'view':
                                      loadFileContent(file.path);
                                      break;
                                    case 'download':
                                      if (file.downloadUrl) {
                                        window.open(file.downloadUrl, '_blank');
                                      }
                                      break;
                                    case 'copy_path':
                                      copyToClipboard(file.path);
                                      break;
                                    case 'open_github':
                                      if (selectedRepository) {
                                        window.open(file.htmlUrl, '_blank');
                                      }
                                      break;
                                  }
                                }}
                                searchQuery={fileSearchQuery}
                                fileTypeFilter={fileTypeFilter}
                              />
                            </div>
                          </div>
                        }
                        rightPane={
                          <div className="h-full overflow-hidden">
                            <FileContentViewer
                              file={selectedFileContent}
                              repositoryUrl={selectedRepository?.url}
                            />
                          </div>
                        }
                      />
                    </div>
                  </div>

                  {/* File Content Viewer - Mobile (Bottom Sheet) */}
                  <BottomSheet
                    isOpen={isFileViewerOpen}
                    onClose={() => setIsFileViewerOpen(false)}
                    title={selectedFileContent?.name || '파일 보기'}
                  >
                    <div className="h-[70vh]">
                      <FileContentViewer
                        file={selectedFileContent}
                        repositoryUrl={selectedRepository?.url}
                        onClose={() => setIsFileViewerOpen(false)}
                      />
                    </div>
                  </BottomSheet>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl md:rounded-3xl border border-gray-100 bg-white p-8 md:p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <GitBranch className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
            <h3 className="mt-4 text-base md:text-lg font-semibold text-gray-900 dark:text-white">저장소를 선택하세요</h3>
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
              <span className="hidden lg:inline">왼쪽에서 </span><span className="lg:hidden">위의 버튼에서 </span>저장소를 선택하여 커밋, PR, 이슈를 확인하세요
            </p>
          </div>
        )}
      </div>

      {/* Commit Detail Panel */}
      <CommitDetailPanel
        commit={selectedCommit}
        isOpen={isDetailPanelOpen}
        onClose={() => {
          setIsDetailPanelOpen(false);
          setSelectedCommit(null);
        }}
        onFileClick={handleFileClick}
      />

      <PullRequestDetailPanel
        pullRequest={selectedPullRequest}
        isOpen={isPullRequestPanelOpen}
        onClose={() => {
          setIsPullRequestPanelOpen(false);
          setSelectedPullRequest(null);
        }}
        repositoryUrl={selectedRepository?.url}
        currentUsername={currentReviewerUsername}
        onReviewRequest={handleReviewOpen}
        onLineCommentClick={handleLineCommentClick}
      />

      <IssueDetailPanel
        issue={selectedIssue}
        isOpen={isIssuePanelOpen}
        onClose={() => {
          setIsIssuePanelOpen(false);
          setSelectedIssue(null);
        }}
        repositoryUrl={selectedRepository?.url}
        assigneeOptions={issueAssigneeOptions}
        labelOptions={issueLabelSuggestions}
        milestoneOptions={issueMilestones}
        currentUsername={currentReviewerUsername}
        currentUserId={currentUserId}
        currentProject={project}
      />

      <CreateIssueModal
        isOpen={isCreateIssueModalOpen && !!selectedRepository}
        onClose={() => setIsCreateIssueModalOpen(false)}
        assignees={issueAssigneeOptions}
        labelSuggestions={issueLabelSuggestions}
        milestoneOptions={issueMilestones}
        onSubmit={(data) => {
          const success = handleIssueCreate(data);
          if (success) {
            setIsCreateIssueModalOpen(false);
          }
          return success;
        }}
      />

      <CreatePullRequestModal
        isOpen={isCreatePrModalOpen && !!selectedRepository}
        onClose={() => setIsCreatePrModalOpen(false)}
        branches={branches}
        defaultBaseBranch={selectedRepository?.defaultBranch}
        availableReviewers={reviewerOptions}
        availableLabels={labelSuggestions}
        onSubmit={handleCreatePullRequest}
      />

      <PullRequestReviewDrawer
        pullRequest={reviewDrawerPr}
        isOpen={isReviewDrawerOpen}
        onClose={() => {
          setIsReviewDrawerOpen(false);
          setReviewDrawerPr(null);
        }}
        currentReviewerUsername={currentReviewerUsername}
        onSubmit={handleReviewSubmit}
      />

      {/* File Diff Modal (Desktop) */}
      {selectedCommit && (
        <FileDiffModal
          isOpen={isDiffModalOpen}
          onClose={() => {
            setIsDiffModalOpen(false);
            setSelectedFile(null);
          }}
          files={selectedCommit.files}
          initialFile={selectedFile || undefined}
          commitSha={selectedCommit.sha}
          repositoryUrl={selectedRepository?.url}
        />
      )}

      {/* Line Comment Sidebar */}
      {selectedPullRequest && commentSidebarData && (
        <LineCommentSidebar
          isOpen={isCommentSidebarOpen}
          comments={(selectedPullRequest.lineComments || []).filter(
            (c) =>
              c.filename === commentSidebarData.filename &&
              c.lineNumber === commentSidebarData.lineNumber &&
              c.side === commentSidebarData.side
          )}
          filename={commentSidebarData.filename}
          lineNumber={commentSidebarData.lineNumber}
          side={commentSidebarData.side}
          currentUsername={currentReviewerUsername}
          currentUserAvatar={currentUserAvatar}
          canAddComment={
            currentReviewerUsername === selectedPullRequest.author.username ||
            selectedPullRequest.reviewers.some((r) => r.username === currentReviewerUsername)
          }
          onAddComment={(comment) => {
            if (commentSidebarData) {
              addLineComment(
                selectedPullRequest.id,
                commentSidebarData.filename,
                commentSidebarData.lineNumber,
                commentSidebarData.side,
                comment
              );
            }
          }}
          onResolve={resolveLineComment}
          onDelete={deleteLineComment}
          onClose={handleCommentSidebarClose}
        />
      )}
    </div>
  );
}

export default function GitHubPage() {
  const { project } = useProjectOutletContext();

  return (
    <GitHubProvider projectId={project.id} project={project}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GitHub</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            프로젝트의 모든 저장소를 한 곳에서 관리하세요
          </p>
        </div>
        <GitHubPageContent />
      </div>
    </GitHubProvider>
  );
}
