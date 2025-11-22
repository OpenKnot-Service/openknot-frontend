import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, GitPullRequest, MessageSquare, FileCode } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useGitHub } from '../../contexts/GitHubContext';
import type { GitHubNotification } from '../../types';

interface GitHubNotificationBadgeProps {
  onNavigateToPR?: (prId: string) => void;
}

export default function GitHubNotificationBadge({
  onNavigateToPR,
}: GitHubNotificationBadgeProps) {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useGitHub();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: GitHubNotification) => {
    markNotificationAsRead(notification.id);
    if (onNavigateToPR) {
      onNavigateToPR(notification.prId);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (notification: GitHubNotification) => {
    switch (notification.type) {
      case 'pr_created':
      case 'pr_approved':
      case 'pr_changes_requested':
      case 'pr_review_requested':
        return GitPullRequest;
      case 'line_comment_added':
      case 'line_comment_replied':
      case 'line_comment_resolved':
        return MessageSquare;
      case 'pr_commented':
        return MessageSquare;
      default:
        return FileCode;
    }
  };

  const getNotificationColor = (notification: GitHubNotification) => {
    switch (notification.type) {
      case 'pr_approved':
        return 'text-green-600 dark:text-green-400';
      case 'pr_changes_requested':
        return 'text-amber-600 dark:text-amber-400';
      case 'line_comment_added':
      case 'line_comment_replied':
        return 'text-blue-600 dark:text-blue-400';
      case 'line_comment_resolved':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        title="알림"
      >
        <Bell className="h-5 w-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              알림 {unreadNotificationCount > 0 && `(${unreadNotificationCount})`}
            </h3>
            <div className="flex items-center gap-1">
              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  title="모두 읽음으로 표시"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  title="모두 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>알림이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification);
                  const iconColor = getNotificationColor(notification);

                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        !notification.read
                          ? 'bg-blue-50/50 dark:bg-blue-900/10'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`text-sm font-medium ${
                              !notification.read
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                            )}
                          </div>

                          {/* PR Info */}
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <span className="font-medium">#{notification.prNumber}</span> {notification.prTitle}
                          </p>

                          {/* File/Line Info for line comments */}
                          {notification.filename && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                              {notification.filename}
                              {notification.lineNumber && ` : ${notification.lineNumber}`}
                            </p>
                          )}

                          {/* Time */}
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDistanceToNow(notification.createdAt, {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </p>
                        </div>

                        {/* Mark as read button */}
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationAsRead(notification.id);
                            }}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            title="읽음으로 표시"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
