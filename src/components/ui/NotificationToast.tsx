import { X } from 'lucide-react';
import { Notification } from '../../types';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

const notificationIcons: Record<Notification['type'], string> = {
  task_assigned: '📋',
  pr_requested: '🔀',
  issue_created: '🐛',
  message: '💬',
  invite: '📨',
};

export default function NotificationToast({
  notification,
  onDismiss,
  onMarkAsRead,
}: NotificationToastProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onDismiss(notification.id);
  };

  const handleStart = (clientX: number, target: HTMLElement) => {
    // X 버튼이나 링크를 클릭한 경우 드래그 시작하지 않음
    if (target.closest('button') || target.closest('a')) {
      return;
    }

    setIsDragging(true);
    startXRef.current = clientX;
    currentXRef.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    currentXRef.current = clientX;
    const deltaX = currentXRef.current - startXRef.current;

    // 오른쪽으로만 드래그 가능
    if (deltaX > 0) {
      setDragX(deltaX);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // 100px 이상 드래그하면 제거
    if (dragX > 100) {
      setIsRemoving(true);
      setTimeout(() => {
        onDismiss(notification.id);
      }, 200);
    } else {
      setDragX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.target as HTMLElement);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleStart(e.touches[0].clientX, e.target as HTMLElement);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const opacity = isRemoving ? 0 : Math.max(0, 1 - dragX / 200);
  const transform = `translateX(${isRemoving ? 400 : dragX}px)`;

  return (
    <div
      className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-[5px] shadow-lg border border-gray-200 dark:border-gray-700 p-4 relative cursor-grab active:cursor-grabbing touch-pan-y overflow-hidden"
      style={{
        transform,
        opacity,
        transition: isDragging ? 'none' : 'all 0.2s ease-out',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'pan-y',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Content */}
      <div className="flex items-start gap-3 pr-6">
        <div className="text-2xl flex-shrink-0">{notificationIcons[notification.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {notification.title}
            </h4>
            {!notification.read && (
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {notification.content}
          </p>
          {notification.link && (
            <Link
              to={notification.link}
              onClick={handleClick}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              자세히 보기 →
            </Link>
          )}
        </div>
      </div>

      {/* Unread Indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
      )}
    </div>
  );
}
