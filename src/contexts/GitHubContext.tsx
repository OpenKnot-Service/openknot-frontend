import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode, useRef } from 'react';
import {
  GitHubRepository,
  GitHubCommit,
  GitHubBranch,
  GitHubPullRequest,
  GitHubIssue,
  GitHubComment,
  RepoViewState,
  NewPullRequestInput,
  PullRequestReviewStatus,
  PullRequestLineComment,
  GitHubNotification,
  GitHubNotificationType,
  NewIssueInput,
  IssueUpdateInput,
  Project,
  GitHubTreeItem,
  GitHubFileContent,
} from '../types';
import {
  getRepositoriesByProjectId,
  getCommitsByRepositoryId,
  getBranchesByRepositoryId,
  getPullRequestsByRepositoryId,
  getIssuesByRepositoryId,
  getFileTreeByRepositoryId,
  getFileContent,
  searchFiles,
} from '../lib/mockData';
import {
  canEditIssue,
  canDeleteIssue,
  canChangeIssueState,
  canManageIssueMetadata,
} from '../utils/issuePermissions';
import { useApp } from './AppContext';

function cloneIssue(issue: GitHubIssue): GitHubIssue {
  return {
    ...issue,
    milestone: issue.milestone
      ? {
          ...issue.milestone,
          dueDate: issue.milestone.dueDate ? new Date(issue.milestone.dueDate) : undefined,
        }
      : undefined,
    comments: issue.comments.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    })),
    createdAt: new Date(issue.createdAt),
    updatedAt: new Date(issue.updatedAt),
    closedAt: issue.closedAt ? new Date(issue.closedAt) : undefined,
  };
}

interface GitHubContextType {
  // Repository management
  repositories: GitHubRepository[];
  selectedRepository: GitHubRepository | null;
  selectRepository: (repoId: string) => void;

  // View state
  selectedView: 'commits' | 'graph' | 'prs' | 'issues' | 'files';
  setSelectedView: (view: 'commits' | 'graph' | 'prs' | 'issues' | 'files') => void;

  // Branch management
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  branches: GitHubBranch[];

  // Data for current repository
  commits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
  issues: GitHubIssue[];
  createIssue: (input: NewIssueInput) => GitHubIssue | null;
  updateIssue: (issueId: string, updates: IssueUpdateInput) => GitHubIssue | null;
  deleteIssue: (issueId: string) => void;
  setIssueState: (issueId: string, state: 'open' | 'closed') => void;
  addIssueComment: (issueId: string, body: string) => GitHubComment | null;
  updateIssueComment: (issueId: string, commentId: string, body: string) => GitHubComment | null;
  deleteIssueComment: (issueId: string, commentId: string) => void;
  createPullRequest: (input: NewPullRequestInput) => GitHubPullRequest | null;
  submitPullRequestReview: (
    pullRequestId: string,
    reviewerUsername: string,
    status: PullRequestReviewStatus,
    comment?: string
  ) => void;

  // Inline comment management
  addLineComment: (
    prId: string,
    filename: string,
    lineNumber: number,
    side: 'left' | 'right',
    comment: string
  ) => void;
  resolveLineComment: (commentId: string) => void;
  deleteLineComment: (commentId: string) => void;

  // Notification management
  notifications: GitHubNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Filter states
  commitFilters: RepoViewState['commitFilters'];
  setCommitFilters: (filters: RepoViewState['commitFilters']) => void;

  prFilters: RepoViewState['prFilters'];
  setPrFilters: (filters: RepoViewState['prFilters']) => void;

  issueFilters: RepoViewState['issueFilters'];
  setIssueFilters: (filters: RepoViewState['issueFilters']) => void;

  // File tree state
  fileTreeState: RepoViewState['fileTreeState'];
  setFileTreeState: (state: RepoViewState['fileTreeState']) => void;

  // File browser
  fileTree: GitHubTreeItem[];
  selectedFile: GitHubFileContent | null;
  loadFileContent: (path: string) => void;
  toggleFilePath: (path: string) => void;
  searchFileTree: (query: string) => GitHubTreeItem[];

  // Search within repositories
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

interface GitHubProviderProps {
  children: ReactNode;
  projectId: string;
  project: Project | null;
}

export function GitHubProvider({ children, projectId, project }: GitHubProviderProps) {
  // Load repositories for the project (memoize to prevent recreating array on every render)
  const repositories = useMemo(() => getRepositoriesByProjectId(projectId), [projectId]);
  const { user } = useApp();
  const currentUserId = user?.id ?? 'guest';
  const currentUsername = user?.githubUsername ?? user?.name ?? '게스트';
  const currentUserAvatar = user?.avatar || user?.profileImageUrl;

  // State management with lazy initialization for selectedRepoId
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(() => {
    const storageKey = `github_lastRepo_${projectId}`;
    const lastRepoId = localStorage.getItem(storageKey);

    // Get repositories for initial check
    const repos = getRepositoriesByProjectId(projectId);

    if (lastRepoId && repos.some(r => r.id === lastRepoId)) {
      return lastRepoId;
    } else if (repos.length > 0) {
      return repos[0].id;
    }
    return null;
  });

  const [selectedView, setSelectedView] = useState<'commits' | 'graph' | 'prs' | 'issues' | 'files'>('graph');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter states
  const [commitFilters, setCommitFilters] = useState<RepoViewState['commitFilters']>({});
  const [prFilters, setPrFilters] = useState<RepoViewState['prFilters']>({
    state: 'all',
  });
  const [issueFilters, setIssueFilters] = useState<RepoViewState['issueFilters']>({
    state: 'all',
    assignee: 'all',
    label: 'all',
    milestone: 'all',
  });
  const [fileTreeState, setFileTreeState] = useState<RepoViewState['fileTreeState']>({
    expandedPaths: [],
  });

  // File browser state
  const [selectedFile, setSelectedFile] = useState<GitHubFileContent | null>(null);

  // Notification state with localStorage persistence
  const [notifications, setNotifications] = useState<GitHubNotification[]>(() => {
    const storageKey = `github_notifications_${projectId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save notifications to localStorage
  useEffect(() => {
    const storageKey = `github_notifications_${projectId}`;
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, projectId]);

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Save selected repository to localStorage
  useEffect(() => {
    if (selectedRepoId) {
      const storageKey = `github_lastRepo_${projectId}`;
      localStorage.setItem(storageKey, selectedRepoId);
    }
  }, [selectedRepoId, projectId]);

  // Get current repository (memoize to avoid recreating on every render)
  const selectedRepository = useMemo(
    () => repositories.find(r => r.id === selectedRepoId) || null,
    [repositories, selectedRepoId]
  );

  // Load data for selected repository (memoize to prevent recreating arrays)
  const branches = useMemo(
    () => (selectedRepoId ? getBranchesByRepositoryId(selectedRepoId) : []),
    [selectedRepoId]
  );
  const commits = useMemo(
    () => (selectedRepoId ? getCommitsByRepositoryId(selectedRepoId) : []),
    [selectedRepoId]
  );
  const pullRequestsCache = useRef<Record<string, GitHubPullRequest[]>>({});
  const issuesCache = useRef<Record<string, GitHubIssue[]>>({});
  const [pullRequests, setPullRequests] = useState<GitHubPullRequest[]>(
    selectedRepoId ? getPullRequestsByRepositoryId(selectedRepoId) : []
  );
  const [issues, setIssues] = useState<GitHubIssue[]>(
    selectedRepoId ? getIssuesByRepositoryId(selectedRepoId).map(cloneIssue) : []
  );

  // Load file tree for selected repository
  const fileTree = useMemo(
    () => (selectedRepoId ? getFileTreeByRepositoryId(selectedRepoId) : []),
    [selectedRepoId]
  );

  useEffect(() => {
    if (selectedRepoId) {
      const cached = pullRequestsCache.current[selectedRepoId];
      if (cached) {
        setPullRequests(cached);
      } else {
        const initial = getPullRequestsByRepositoryId(selectedRepoId);
        pullRequestsCache.current[selectedRepoId] = initial;
        setPullRequests(initial);
      }
    } else {
      setPullRequests([]);
    }
  }, [selectedRepoId]);

  useEffect(() => {
    if (selectedRepoId) {
      const cachedIssues = issuesCache.current[selectedRepoId];
      if (cachedIssues) {
        setIssues(cachedIssues);
      } else {
        const initialIssues = getIssuesByRepositoryId(selectedRepoId).map(cloneIssue);
        issuesCache.current[selectedRepoId] = initialIssues;
        setIssues(initialIssues);
      }
    } else {
      setIssues([]);
    }
  }, [selectedRepoId]);

  // Update default branch when repository changes
  useEffect(() => {
    if (selectedRepository) {
      setSelectedBranch(selectedRepository.defaultBranch);
    }
  }, [selectedRepository?.id, selectedRepository?.defaultBranch]);

  // Helper function to create notifications
  const addNotification = useCallback(
    (
      type: GitHubNotificationType,
      prId: string,
      message: string,
      metadata?: {
        lineCommentId?: string;
        filename?: string;
        lineNumber?: number;
      }
    ) => {
      const pr = pullRequests.find((p) => p.id === prId);
      if (!pr || !selectedRepository) return;

      const newNotification: GitHubNotification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        type,
        prId,
        prNumber: pr.number,
        prTitle: pr.title,
        repositoryId: selectedRepository.id,
        repositoryName: selectedRepository.name,
        from: {
          username: currentUsername,
          avatarUrl: currentUserAvatar,
        },
        message,
        createdAt: new Date(),
        read: false,
        ...metadata,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    },
    [pullRequests, selectedRepository, currentUsername, currentUserAvatar]
  );

  const selectRepository = useCallback((repoId: string) => {
    if (selectedRepoId) {
      pullRequestsCache.current[selectedRepoId] = pullRequests;
      issuesCache.current[selectedRepoId] = issues;
    }
    setSelectedRepoId(repoId);
    // Reset filters when switching repositories
    setCommitFilters({});
    setPrFilters({ state: 'all' });
    setIssueFilters({ state: 'all', assignee: 'all', label: 'all', milestone: 'all' });
    setFileTreeState({ expandedPaths: [] });
  }, [pullRequests, issues, selectedRepoId]);

  const createIssue = useCallback(
    (input: NewIssueInput): GitHubIssue | null => {
      if (!selectedRepository) {
        return null;
      }

      const repoId = selectedRepository.id;
      let created: GitHubIssue | null = null;

      setIssues((prev) => {
        const now = new Date();
        const existingNumbers = prev.map((issue) => issue.number);
        const nextNumber =
          existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
        const milestoneTitle = input.milestone?.trim();

        const newIssue: GitHubIssue = {
          id: `issue-${now.getTime()}-${Math.random()}`,
          repositoryId: repoId,
          number: nextNumber,
          title: input.title,
          body: input.body,
          state: input.state ?? 'open',
          author: {
            username: currentUsername,
            avatarUrl: currentUserAvatar,
          },
          assignees: input.assignees ?? [],
          labels: input.labels ?? [],
          milestone: milestoneTitle
            ? {
                title: milestoneTitle,
              }
            : undefined,
          comments: [],
          createdAt: now,
          updatedAt: now,
          closedAt: input.state === 'closed' ? now : undefined,
        };

        created = newIssue;
        const next = [newIssue, ...prev];
        issuesCache.current[repoId] = next;
        return next;
      });

      return created;
    },
    [selectedRepository, currentUsername, currentUserAvatar]
  );

  const updateIssue = useCallback(
    (issueId: string, updates: IssueUpdateInput): GitHubIssue | null => {
      if (!selectedRepository) {
        return null;
      }

      const repoId = selectedRepository.id;
      let updatedIssue: GitHubIssue | null = null;

      setIssues((prev) => {
        // Find the issue to check permissions
        const targetIssue = prev.find((issue) => issue.id === issueId);
        if (!targetIssue) {
          return prev;
        }

        // Check permissions based on what's being updated
        const isEditingContent = updates.title !== undefined || updates.body !== undefined;
        const isEditingState = updates.state !== undefined;
        const isEditingMetadata =
          updates.assignees !== undefined ||
          updates.labels !== undefined ||
          updates.milestone !== undefined;

        if (isEditingContent) {
          if (!canEditIssue(targetIssue, project, currentUserId, currentUsername)) {
            console.error('Permission denied: Cannot edit this issue');
            return prev;
          }
        }

        if (isEditingState) {
          if (!canChangeIssueState(targetIssue, project, currentUserId, currentUsername)) {
            console.error('Permission denied: Cannot change issue state');
            return prev;
          }
        }

        if (isEditingMetadata) {
          if (!canManageIssueMetadata(targetIssue, project, currentUserId, currentUsername)) {
            console.error('Permission denied: Cannot manage issue metadata');
            return prev;
          }
        }

        const next = prev.map((issue) => {
          if (issue.id !== issueId) {
            return issue;
          }

          const now = new Date();
          const nextState = updates.state ?? issue.state;
          const milestoneTitle =
            updates.milestone === undefined ? issue.milestone?.title : updates.milestone?.trim();

          const nextIssue: GitHubIssue = {
            ...issue,
            title: updates.title !== undefined ? updates.title : issue.title,
            body: updates.body !== undefined ? updates.body : issue.body,
            assignees: updates.assignees !== undefined ? updates.assignees : issue.assignees,
            labels: updates.labels !== undefined ? updates.labels : issue.labels,
            milestone:
              updates.milestone === undefined
                ? issue.milestone
                : milestoneTitle
                  ? {
                      title: milestoneTitle,
                      dueDate:
                        issue.milestone?.title === milestoneTitle ? issue.milestone?.dueDate : undefined,
                    }
                  : undefined,
            state: nextState,
            updatedAt: now,
            closedAt:
              updates.state === undefined
                ? issue.closedAt
                : updates.state === 'closed'
                  ? now
                  : undefined,
          };

          updatedIssue = nextIssue;
          return nextIssue;
        });

        if (updatedIssue) {
          issuesCache.current[repoId] = next;
        }

        return next;
      });

      return updatedIssue;
    },
    [selectedRepository, project, currentUserId, currentUsername]
  );

  const deleteIssue = useCallback(
    (issueId: string) => {
      if (!selectedRepository) {
        return;
      }

      // Check permission: only admins can delete issues
      if (!canDeleteIssue(project, currentUserId)) {
        console.error('Permission denied: Only project admins can delete issues');
        return;
      }

      const repoId = selectedRepository.id;
      setIssues((prev) => {
        const next = prev.filter((issue) => issue.id !== issueId);
        issuesCache.current[repoId] = next;
        return next;
      });
    },
    [selectedRepository, project, currentUserId]
  );

  const setIssueState = useCallback(
    (issueId: string, state: 'open' | 'closed') => {
      updateIssue(issueId, { state });
    },
    [updateIssue]
  );

  const addIssueComment = useCallback(
    (issueId: string, body: string): GitHubComment | null => {
      if (!selectedRepository) {
        return null;
      }

      const repoId = selectedRepository.id;
      let createdComment: GitHubComment | null = null;

      setIssues((prev) => {
        const next = prev.map((issue) => {
          if (issue.id !== issueId) {
            return issue;
          }

          const now = new Date();
          const newComment: GitHubComment = {
            id: `issue-comment-${now.getTime()}-${Math.random()}`,
            author: currentUsername,
            body,
            createdAt: now,
            updatedAt: now,
          };

          createdComment = newComment;

          return {
            ...issue,
            comments: [...issue.comments, newComment],
            updatedAt: now,
          };
        });

        if (createdComment) {
          issuesCache.current[repoId] = next;
        }

        return next;
      });

      return createdComment;
    },
    [selectedRepository, currentUsername]
  );

  const updateIssueComment = useCallback(
    (issueId: string, commentId: string, body: string): GitHubComment | null => {
      if (!selectedRepository) {
        return null;
      }

      const repoId = selectedRepository.id;
      let updatedComment: GitHubComment | null = null;

      setIssues((prev) => {
        const next = prev.map((issue) => {
          if (issue.id !== issueId) {
            return issue;
          }

          let hasComment = false;
          const now = new Date();
          const comments = issue.comments.map((comment) => {
            if (comment.id !== commentId) {
              return comment;
            }

            hasComment = true;
            const nextComment: GitHubComment = {
              ...comment,
              body,
              updatedAt: now,
            };
            updatedComment = nextComment;
            return nextComment;
          });

          if (!hasComment) {
            return issue;
          }

          return {
            ...issue,
            comments,
            updatedAt: now,
          };
        });

        if (updatedComment) {
          issuesCache.current[repoId] = next;
        }

        return next;
      });

      return updatedComment;
    },
    [selectedRepository]
  );

  const deleteIssueComment = useCallback(
    (issueId: string, commentId: string) => {
      if (!selectedRepository) {
        return;
      }

      const repoId = selectedRepository.id;

      setIssues((prev) => {
        const next = prev.map((issue) => {
          if (issue.id !== issueId) {
            return issue;
          }

          const comments = issue.comments.filter((comment) => comment.id !== commentId);
          if (comments.length === issue.comments.length) {
            return issue;
          }

          const now = new Date();
          return {
            ...issue,
            comments,
            updatedAt: now,
          };
        });

        issuesCache.current[repoId] = next;
        return next;
      });
    },
    [selectedRepository]
  );

  const createPullRequest = useCallback(
    (input: NewPullRequestInput): GitHubPullRequest | null => {
      if (!selectedRepository) {
        return null;
      }

      let created: GitHubPullRequest | null = null;
      setPullRequests((prev) => {
        const now = new Date();
        const nextNumber = (prev.length > 0 ? Math.max(...prev.map((pr) => pr.number)) : 0) + 1;

        const newPullRequest: GitHubPullRequest = {
          id: `pr-${now.getTime()}`,
          repositoryId: selectedRepository.id,
          number: nextNumber,
          title: input.title,
          body: input.body,
          state: 'open',
          author: {
            username: currentUsername,
            avatarUrl: currentUserAvatar,
          },
          assignees: input.assignees,
          reviewers: input.reviewers.map((reviewer) => ({
            ...reviewer,
            status: 'pending',
          })),
          labels: input.labels,
          headBranch: input.headBranch,
          baseBranch: input.baseBranch,
          files: [],
          commits: 0,
          additions: 0,
          deletions: 0,
          checks: [],
          linkedIssues: input.linkedIssues ?? [],
          createdAt: now,
          updatedAt: now,
          reviewActivities: [],
        };

        created = newPullRequest;
        const nextList = [newPullRequest, ...prev];
        pullRequestsCache.current[selectedRepository.id] = nextList;

        // Generate notification for PR creation
        setTimeout(() => {
          if (created) {
            addNotification(
              'pr_created',
              created.id,
              `새 PR이 생성되었습니다: ${created.title}`
            );
          }
        }, 100);

        return nextList;
      });

      return created;
    },
    [selectedRepository, addNotification, currentUsername, currentUserAvatar]
  );

  const submitPullRequestReview = useCallback(
    (
      pullRequestId: string,
      reviewerUsername: string,
      status: PullRequestReviewStatus,
      comment?: string
    ) => {
      if (!selectedRepository) {
        return;
      }

      setPullRequests((prev) => {
        const updated = prev
          .map((pr) => {
            if (pr.id !== pullRequestId) {
              return pr;
            }

            const now = new Date();
            let hasReviewer = false;

            const reviewers = pr.reviewers.map((reviewer) => {
              if (reviewer.username === reviewerUsername) {
                hasReviewer = true;
                return {
                  ...reviewer,
                  status,
                };
              }
              return reviewer;
            });

            if (!hasReviewer) {
              reviewers.push({
                username: reviewerUsername,
                avatarUrl: undefined,
                status,
              });
            }

            const updatedActivities = [
              ...(pr.reviewActivities ?? []),
              {
                reviewer: reviewerUsername,
                status,
                comment,
                submittedAt: now,
              },
            ];

            return {
              ...pr,
              reviewers,
              reviewActivities: updatedActivities,
              updatedAt: now,
            };
          })
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        pullRequestsCache.current[selectedRepository.id] = updated;

        // Generate notification for review submission
        setTimeout(() => {
          const pr = updated.find((p) => p.id === pullRequestId);
          if (pr) {
            let notifType: GitHubNotificationType;
            let message: string;

            switch (status) {
              case 'approved':
                notifType = 'pr_approved';
                message = `${reviewerUsername}님이 PR을 승인했습니다`;
                break;
              case 'changes_requested':
                notifType = 'pr_changes_requested';
                message = `${reviewerUsername}님이 변경을 요청했습니다`;
                break;
              case 'commented':
                notifType = 'pr_commented';
                message = `${reviewerUsername}님이 코멘트를 남겼습니다`;
                break;
              default:
                return;
            }

            addNotification(notifType, pullRequestId, message);
          }
        }, 100);

        return updated;
      });
    },
    [selectedRepository, addNotification, currentUsername]
  );

  const addLineComment = useCallback(
    (
      prId: string,
      filename: string,
      lineNumber: number,
      side: 'left' | 'right',
      comment: string
    ) => {
      if (!selectedRepository) {
        return;
      }

      // Server-side permission check: Only PR author and reviewers can add comments
      const pr = pullRequests.find(p => p.id === prId);
      if (!pr) {
        console.error('PR not found');
        return;
      }

      const isAuthor = pr.author.username === currentUsername;
      const isReviewer = pr.reviewers.some(r => r.username === currentUsername);

      if (!isAuthor && !isReviewer) {
        console.error('User not authorized to comment on this PR. Only PR author and registered reviewers can add line comments.');
        return;
      }

      setPullRequests((prev) => {
        const updated = prev.map((pr) => {
          if (pr.id !== prId) {
            return pr;
          }

          const now = new Date();
          const newComment: PullRequestLineComment = {
            id: `comment-${now.getTime()}-${Math.random()}`,
            prId,
            filename,
            lineNumber,
            side,
            reviewer: currentUsername,
            reviewerAvatar: currentUserAvatar,
            comment,
            createdAt: now,
          };

          return {
            ...pr,
            lineComments: [...(pr.lineComments ?? []), newComment],
            updatedAt: now,
          };
        });

        pullRequestsCache.current[selectedRepository.id] = updated;

        // Generate notification for line comment
        setTimeout(() => {
          addNotification(
            'line_comment_added',
            prId,
            `${currentUsername}님이 라인 코멘트를 추가했습니다`,
            {
              filename,
              lineNumber,
            }
          );
        }, 100);

        return updated;
      });
    },
    [selectedRepository, addNotification, pullRequests, currentUsername, currentUserAvatar]
  );

  const resolveLineComment = useCallback(
    (commentId: string) => {
      if (!selectedRepository) {
        return;
      }

      setPullRequests((prev) => {
        const updated = prev.map((pr) => {
          if (!pr.lineComments?.some((c) => c.id === commentId)) {
            return pr;
          }

          const now = new Date();
          return {
            ...pr,
            lineComments: pr.lineComments.map((c) =>
              c.id === commentId
                ? {
                    ...c,
                    resolved: true,
                    resolvedBy: currentUsername,
                    resolvedAt: now,
                  }
                : c
            ),
            updatedAt: now,
          };
        });

        pullRequestsCache.current[selectedRepository.id] = updated;

        // Generate notification for line comment resolution
        setTimeout(() => {
          const pr = updated.find((p) => p.lineComments?.some((c) => c.id === commentId));
          if (pr) {
            const comment = pr.lineComments?.find((c) => c.id === commentId);
            addNotification(
              'line_comment_resolved',
              pr.id,
              `코멘트가 해결되었습니다`,
              {
                lineCommentId: commentId,
                filename: comment?.filename,
                lineNumber: comment?.lineNumber,
              }
            );
          }
        }, 100);

        return updated;
      });
    },
    [selectedRepository, addNotification]
  );

  const deleteLineComment = useCallback(
    (commentId: string) => {
      if (!selectedRepository) {
        return;
      }

      setPullRequests((prev) => {
        const updated = prev.map((pr) => {
          if (!pr.lineComments?.some((c) => c.id === commentId)) {
            return pr;
          }

          const now = new Date();
          return {
            ...pr,
            lineComments: pr.lineComments.filter((c) => c.id !== commentId),
            updatedAt: now,
          };
        });

        pullRequestsCache.current[selectedRepository.id] = updated;
        return updated;
      });
    },
    [selectedRepository]
  );

  // File browser functions
  const loadFileContent = useCallback((path: string) => {
    const content = getFileContent(path);
    if (content) {
      setSelectedFile(content);
      setFileTreeState((prev) => ({
        ...prev,
        selectedFilePath: path,
      }));
    }
  }, []);

  const toggleFilePath = useCallback((path: string) => {
    setFileTreeState((prev) => {
      const isExpanded = prev.expandedPaths.includes(path);
      return {
        ...prev,
        expandedPaths: isExpanded
          ? prev.expandedPaths.filter((p) => p !== path)
          : [...prev.expandedPaths, path],
      };
    });
  }, []);

  const searchFileTree = useCallback(
    (query: string) => {
      return searchFiles(query, fileTree);
    },
    [fileTree]
  );

  return (
    <GitHubContext.Provider
      value={{
        repositories,
        selectedRepository,
        selectRepository,
        selectedView,
        setSelectedView,
        selectedBranch,
        setSelectedBranch,
        branches,
        commits,
        pullRequests,
        issues,
        createIssue,
        updateIssue,
        deleteIssue,
        setIssueState,
        addIssueComment,
        updateIssueComment,
        deleteIssueComment,
        createPullRequest,
        submitPullRequestReview,
        addLineComment,
        resolveLineComment,
        deleteLineComment,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        commitFilters,
        setCommitFilters,
        prFilters,
        setPrFilters,
        issueFilters,
        setIssueFilters,
        fileTreeState,
        setFileTreeState,
        fileTree,
        selectedFile,
        loadFileContent,
        toggleFilePath,
        searchFileTree,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
}
