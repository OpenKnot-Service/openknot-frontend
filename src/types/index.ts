export interface User {
  id: string;
  email: string;
  name: string;
  position?: string;
  detailedPosition?: string;
  careerLevel?: string;
  avatar?: string;
  profileImageUrl?: string;
  description?: string;
  githubLink?: string;
  githubId?: number;
  role: 'developer' | 'designer' | 'planner' | 'other';
  skills: string[];
  bio?: string;
  githubUsername?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'recruiting' | 'in_progress' | 'completed' | 'archived';
  visibility: 'public' | 'private';
  techStack: string[];
  positions: Position[];
  members: Member[];
  repositories?: string[]; // Array of GitHubRepository IDs (multi-repo support)
  repositoryGroups?: Record<string, string[]>; // Group name → repo IDs
  startDate?: Date;
  endDate?: Date;
  githubRepo?: string;
  releaseChannel?: 'stable' | 'beta' | 'canary';
  defaultBranch?: string;
  deploymentRegions?: string[];
  autoDeployEnabled?: boolean;
  branchProtectionEnabled?: boolean;
  incidentAlertsEnabled?: boolean;
  codeOwnerReviewRequired?: boolean;
  designSyncEnabled?: boolean;
  backupsEnabled?: boolean;
  autoCloseTickets?: boolean;
  envSecrets?: {
    owner?: string;
    lastRotatedAt?: Date;
    pendingRenewals?: number;
    integrations?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = Project['status'];

export interface Position {
  id: string;
  role: 'developer' | 'designer' | 'planner' | 'other';
  title?: string;
  specialization?: string;
  count: number;
  filled: number;
  requirements: string[];
  description?: string;
}

export interface Member {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  position: string;
  joinedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: Date;
  labels: string[];
  githubIssueNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  projectId?: string;
  content: string;
  type: 'direct' | 'group';
  createdAt: Date;
  readAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'pr_requested' | 'issue_created' | 'message' | 'invite';
  title: string;
  content: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

export interface GitHubPR {
  id: number;
  projectId: string;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  reviewers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: 'kanban' | 'scrum' | 'custom';
  columns: TemplateColumn[];
  isDefault: boolean;
}

export interface TemplateColumn {
  id: string;
  name: string;
  order: number;
  color?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface FileAttachment {
  id: string;
  taskId: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  userId: string;
  action: 'created' | 'updated' | 'status_changed' | 'assignee_changed' | 'comment_added';
  description: string;
  createdAt: Date;
}

// ========== GitHub Integration Types (Multi-Repo Support) ==========

export interface GitHubRepository {
  id: string;
  projectId: string;
  name: string; // e.g., "openknot-frontend"
  fullName: string; // e.g., "owner/openknot-frontend"
  owner: string;
  url: string;
  defaultBranch: string;
  description?: string;
  language: string;
  isPrivate: boolean;

  // Statistics
  stars: number;
  forks: number;
  openPRCount: number;
  openIssueCount: number;

  // Last commit info (cached)
  lastCommitSha?: string;
  lastCommitMessage?: string;
  lastCommitAuthor?: string;
  lastCommitDate?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;

  // UI grouping (optional)
  group?: string; // "backend", "frontend", "infra", etc.
  order?: number; // Display order
}

export interface GitHubBranch {
  name: string;
  sha: string;
  isProtected: boolean;
  isDefault: boolean;
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    date: Date;
  };
  aheadBy?: number; // Commits ahead of default branch
  behindBy?: number; // Commits behind default branch
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  committer: {
    name: string;
    email: string;
  };
  date: Date;
  parents: string[]; // Parent commit SHAs (for merge detection)
  branch: string[]; // Branches this commit belongs to
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files: GitHubFileChange[];
}

export interface GitHubFileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string; // Diff content
  previousFilename?: string; // For renamed files
}

export type PullRequestReviewStatus = 'approved' | 'changes_requested' | 'commented';

export interface PullRequestReviewActivity {
  reviewer: string;
  status: PullRequestReviewStatus;
  comment?: string;
  submittedAt: Date;
}

export interface PullRequestLineComment {
  id: string;
  prId: string;
  filename: string;
  lineNumber: number;
  side: 'left' | 'right'; // left = old version, right = new version
  reviewer: string;
  reviewerAvatar?: string;
  comment: string;
  createdAt: Date;
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface NewPullRequestInput {
  title: string;
  body: string;
  headBranch: string;
  baseBranch: string;
  labels: string[];
  assignees: string[];
  reviewers: {
    username: string;
    avatarUrl?: string;
  }[];
  linkedIssues?: number[];
}

export interface GitHubPullRequest {
  id: string;
  repositoryId: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed' | 'merged';
  author: {
    username: string;
    avatarUrl?: string;
  };
  assignees: string[];
  reviewers: {
    username: string;
    avatarUrl?: string;
    status: 'pending' | 'approved' | 'changes_requested' | 'commented';
  }[];
  labels: string[];

  // Branch info
  headBranch: string;
  baseBranch: string;

  // Changes
  files: GitHubFileChange[];
  commits: number;
  additions: number;
  deletions: number;

  // CI/CD
  checks: GitHubCheckRun[];

  // Linked issues
  linkedIssues: number[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  mergedAt?: Date;
  closedAt?: Date;
  reviewActivities?: PullRequestReviewActivity[];
  lineComments?: PullRequestLineComment[];
}

export interface GitHubCheckRun {
  id: string;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out';
  detailsUrl?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface GitHubIssue {
  id: string;
  repositoryId: string;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  author: {
    username: string;
    avatarUrl?: string;
  };
  assignees: string[];
  labels: string[];
  milestone?: {
    title: string;
    dueDate?: Date;
  };
  comments: GitHubComment[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface GitHubComment {
  id: string;
  author: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewIssueInput {
  title: string;
  body: string;
  labels: string[];
  assignees: string[];
  milestone?: string | null;
  state?: 'open' | 'closed';
}

export interface IssueUpdateInput {
  title?: string;
  body?: string;
  assignees?: string[];
  labels?: string[];
  milestone?: string | null;
  state?: 'open' | 'closed';
}

export interface GitHubFile {
  path: string;
  name: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
  url: string;
  content?: string; // File content (Base64 or plain text)
}

// Repository File Tree Types
export interface GitHubTreeItem {
  path: string;
  name: string;
  type: 'file' | 'dir' | 'blob' | 'tree';
  size: number;
  sha: string;
  url: string;
  htmlUrl: string;
  downloadUrl?: string;
  children?: GitHubTreeItem[]; // For directories
  lastCommit?: {
    message: string;
    author: string;
    date: Date;
    sha: string;
  };
}

export interface GitHubFileContent {
  path: string;
  name: string;
  content: string;
  encoding: 'base64' | 'utf-8';
  size: number;
  sha: string;
  language?: string; // Programming language for syntax highlighting
  lines?: number; // Total number of lines
}

export interface FileTreeAction {
  type: 'view' | 'download' | 'copy_path' | 'open_in_github' | 'view_history' | 'raw';
  label: string;
  icon: string;
}

export interface FileIconConfig {
  extension: string;
  icon: string;
  color: string;
}

export interface FileSearchResult {
  path: string;
  name: string;
  type: 'file' | 'dir';
  matches: {
    type: 'filename' | 'path';
    score: number;
  }[];
}

// UI State Management

export interface RepoViewState {
  selectedRepoId: string;
  selectedBranch: string;
  selectedView: 'commits' | 'prs' | 'issues' | 'files';

  // Filter states
  commitFilters: {
    branch?: string;
    author?: string;
    dateFrom?: Date;
    dateTo?: Date;
    searchQuery?: string;
  };

  prFilters: {
    state: 'all' | 'open' | 'closed' | 'merged';
    author?: string;
    label?: string;
  };

  issueFilters: {
    state: 'all' | 'open' | 'closed';
    assignee?: string;
    label?: string;
    milestone?: string;
  };

  // File browser state
  fileTreeState: {
    commitSha?: string; // View specific commit version
    expandedPaths: string[]; // Expanded folder paths
    selectedFilePath?: string;
  };
}

// Cross-tab Integration Types

export interface DeploymentStatus {
  repositoryId: string;
  repositoryName: string; // e.g., "Frontend", "Backend", "API"
  repositoryType?: 'frontend' | 'backend' | 'api' | 'mobile' | 'other';
  isDeployed: boolean;
  environment?: 'dev' | 'staging' | 'production';
  lastDeployedAt?: Date;
  lastDeployedCommit?: string;
  deploymentUrl?: string;
  status?: 'success' | 'failed' | 'in_progress';
}

export interface DeploymentHistoryItem {
  id: string;
  repositoryId: string;
  repositoryName: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'success' | 'failed' | 'in_progress';
  commitHash: string;
  commitMessage: string;
  branch: string;
  deployedBy: string;
  deployedAt: Date;
  duration?: number; // in seconds
}

export type DeploymentHistoryView = 'per-repo' | 'unified';

export interface BulkDeploymentConfig {
  repositoryIds: string[];
  environment: 'dev' | 'staging' | 'production';
  deployInParallel?: boolean;
}

export interface PipelineStepData {
  name: string;
  status: 'success' | 'failed' | 'in_progress' | 'pending';
  duration?: number; // in seconds
  startedAt?: Date;
  completedAt?: Date;
}

export interface EnvironmentConfigData {
  environment: 'dev' | 'staging' | 'production';
  url: string;
  healthStatus: 'healthy' | 'warning' | 'error';
  lastDeployedAt?: Date;
  version?: string;
}

export interface MonitoringStatus {
  repositoryId: string;
  repositoryName: string;
  repositoryType?: 'frontend' | 'backend' | 'api' | 'mobile' | 'other';
  isMonitored: boolean;
  healthStatus?: 'healthy' | 'degraded' | 'down';
  lastCheckedAt?: Date;
  activeAlerts?: number;
  uptime?: number; // percentage
}

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export interface MonitoringMetric {
  id: string;
  repositoryId: string;
  repositoryName: string;
  timestamp: Date;
  cpu: number; // percentage
  memory: number; // percentage
  disk: number; // percentage
  network: number; // MB/s
  responseTime: number; // ms
  requestCount: number;
  errorRate: number; // percentage
  activeConnections?: number;
}

export interface AggregatedMetrics {
  totalCpu: number;
  totalMemory: number;
  totalDisk: number;
  totalNetwork: number;
  avgResponseTime: number;
  totalRequests: number;
  avgErrorRate: number;
  activeRepositories: number;
  totalAlerts: number;
}

export interface MonitoringAlert {
  id: string;
  repositoryId: string;
  repositoryName: string;
  timestamp: Date;
  type: 'alert' | 'recovery' | 'threshold_breach' | 'service_down' | 'service_up';
  severity: 'info' | 'warning' | 'critical';
  metric?: 'cpu' | 'memory' | 'disk' | 'network' | 'response_time' | 'error_rate';
  message: string;
  value?: number;
  threshold?: number;
  resolved?: boolean;
}

export interface MetricThreshold {
  repositoryId: string;
  metric: 'cpu' | 'memory' | 'disk' | 'network' | 'response_time' | 'error_rate';
  warningThreshold: number;
  criticalThreshold: number;
  enabled: boolean;
}

export interface SecurityStatus {
  repositoryId: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastScannedAt?: Date;
  complianceScore?: number; // 0-100
}

// Common filter type for all tabs
export interface RepoFilter {
  selectedRepos: string[]; // Empty array = all repos
  searchQuery?: string;
  groupBy?: string;
}

// ========== GitHub Notification Types ==========

export type GitHubNotificationType =
  | 'pr_created'
  | 'pr_review_requested'
  | 'pr_approved'
  | 'pr_changes_requested'
  | 'pr_commented'
  | 'line_comment_added'
  | 'line_comment_replied'
  | 'line_comment_resolved';

export interface GitHubNotification {
  id: string;
  type: GitHubNotificationType;
  prId: string;
  prNumber: number;
  prTitle: string;
  repositoryId: string;
  repositoryName: string;
  from: {
    username: string;
    avatarUrl?: string;
  };
  message: string;
  createdAt: Date;
  read: boolean;
  // Optional metadata for specific notification types
  lineCommentId?: string; // For line comment notifications
  filename?: string; // For line comment notifications
  lineNumber?: number; // For line comment notifications
}
