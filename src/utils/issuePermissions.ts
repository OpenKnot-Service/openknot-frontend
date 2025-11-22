import type { Project, GitHubIssue } from '../types';

/**
 * Get user's role in a project
 */
export function getUserRoleInProject(
  project: Project | null,
  userId: string
): 'owner' | 'admin' | 'member' | 'none' {
  if (!project || !userId) return 'none';

  // Check if user is the project owner
  if (project.ownerId === userId) {
    return 'owner';
  }

  // Check if user is in the members list
  const member = project.members.find((m) => m.userId === userId);
  if (member) {
    return member.role;
  }

  return 'none';
}

/**
 * Check if user is project admin (Owner or Admin role)
 */
export function isProjectAdmin(project: Project | null, userId: string): boolean {
  const role = getUserRoleInProject(project, userId);
  return role === 'owner' || role === 'admin';
}

/**
 * Check if user is the issue author
 */
export function isIssueAuthor(issue: GitHubIssue | null, username: string): boolean {
  if (!issue || !username) return false;
  return issue.author.username === username;
}

/**
 * Check if user can edit issue (title, body)
 * Permission: Issue author + Project admin
 */
export function canEditIssue(
  issue: GitHubIssue | null,
  project: Project | null,
  currentUserId: string,
  currentUsername: string
): boolean {
  if (!issue || !currentUserId || !currentUsername) return false;

  // Issue author can edit
  if (isIssueAuthor(issue, currentUsername)) {
    return true;
  }

  // Project admin can edit any issue
  if (isProjectAdmin(project, currentUserId)) {
    return true;
  }

  return false;
}

/**
 * Check if user can delete issue
 * Permission: Project admin only
 */
export function canDeleteIssue(
  project: Project | null,
  currentUserId: string
): boolean {
  if (!currentUserId) return false;
  return isProjectAdmin(project, currentUserId);
}

/**
 * Check if user can change issue state (open/closed)
 * Permission: Issue author + Project admin
 */
export function canChangeIssueState(
  issue: GitHubIssue | null,
  project: Project | null,
  currentUserId: string,
  currentUsername: string
): boolean {
  if (!issue || !currentUserId || !currentUsername) return false;

  // Issue author can change state
  if (isIssueAuthor(issue, currentUsername)) {
    return true;
  }

  // Project admin can change any issue state
  if (isProjectAdmin(project, currentUserId)) {
    return true;
  }

  return false;
}

/**
 * Check if user can manage issue metadata (assignees, labels, milestone)
 * Permission: Issue author + Project admin
 */
export function canManageIssueMetadata(
  issue: GitHubIssue | null,
  project: Project | null,
  currentUserId: string,
  currentUsername: string
): boolean {
  if (!issue || !currentUserId || !currentUsername) return false;

  // Issue author can manage metadata
  if (isIssueAuthor(issue, currentUsername)) {
    return true;
  }

  // Project admin can manage any issue metadata
  if (isProjectAdmin(project, currentUserId)) {
    return true;
  }

  return false;
}

/**
 * Check if user can manage comment (edit/delete)
 * Permission: Comment author only
 */
export function canManageComment(commentAuthor: string, currentUsername: string): boolean {
  if (!currentUsername || !commentAuthor) return false;
  return commentAuthor === currentUsername;
}
