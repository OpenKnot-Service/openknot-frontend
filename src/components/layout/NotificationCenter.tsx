import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Check, CheckCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Notification } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, user, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [isClosing, setIsClosing] = useState(false);

  const userNotifications = user?.id
    ? notifications.filter((n) => n.userId === user.id)
    : [];
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  // isOpen이 변경될 때 isClosing 초기화
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    // 애니메이션 시간 (300ms) 후에 실제로 닫기
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const notificationIcons: Record<Notification['type'], string> = {
    task_assigned: '📋',
    pr_requested: '🔀',
    issue_created: '🐛',
    message: '💬',
    invite: '📨',
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Semi-transparent with blur */}
      <div
        className={`fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden flex flex-col transition-transform duration-300 ease-in-out ${
        isClosing ? 'translate-x-full' : 'translate-x-0 animate-slide-in-right'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">알림</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {unreadCount}개의 읽지 않은 알림
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                모두 읽음
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {userNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">알림이 없습니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {userNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  icon={notificationIcons[notification.type]}
                  onMarkAsRead={() => markNotificationAsRead(notification.id)}
                  onClose={handleClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface NotificationItemProps {
  notification: Notification;
  icon: string;
  onMarkAsRead: () => void;
  onClose: () => void;
}

function NotificationItem({ notification, icon, onMarkAsRead, onClose }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead();
    }
    // onClose를 직접 호출하지 않고 부모의 handleClose를 호출해야 하지만,
    // 여기서는 단순히 onClose를 호출 (부모에서 handleClose를 전달해야 함)
    onClose();
  };

  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</h4>
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="읽음으로 표시"
              >
                <Check className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.content}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-500">{timeAgo}</span>
            {notification.link && (
              <Link
                to={notification.link}
                onClick={handleClick}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                자세히 보기 →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

  return new Date(date).toLocaleDateString('ko-KR');
}
