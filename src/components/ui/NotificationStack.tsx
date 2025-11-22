import { useEffect, useState } from 'react';
import { AnimatedList } from './AnimatedList';
import NotificationToast from './NotificationToast';
import { Notification } from '../../types';

interface NotificationStackProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  maxVisible?: number;
  delay?: number;
  autoDismissDelay?: number;
}

export default function NotificationStack({
  notifications,
  onMarkAsRead,
  maxVisible = 3,
  delay = 800,
  autoDismissDelay = 6000,
}: NotificationStackProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 오래된 것부터 최근 순으로 정렬
    const sortedNotifications = [...notifications]
      .filter((n) => !dismissedIds.has(n.id))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // 항상 maxVisible + 1개를 표시 (4번째는 exit용)
    // 가장 오래된 것이 맨 위에, 최근 것이 맨 아래에 표시됨
    const toShow = sortedNotifications.slice(0, maxVisible + 1);

    setVisibleNotifications(toShow);
  }, [notifications, dismissedIds, maxVisible]);

  // 자동으로 알림 제거
  useEffect(() => {
    if (visibleNotifications.length === 0) return;

    // 첫 번째 알림(가장 오래된 것, 맨 위)만 타이머 설정
    const timer = setTimeout(() => {
      if (visibleNotifications.length > 0) {
        handleDismiss(visibleNotifications[0].id);
      }
    }, autoDismissDelay);

    return () => clearTimeout(timer);
  }, [visibleNotifications, autoDismissDelay]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-sm pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatedList delay={delay}>
          {visibleNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={index >= maxVisible ? 'opacity-0' : 'opacity-100'}
              style={{ transition: 'opacity 0.2s' }}
            >
              <NotificationToast
                notification={notification}
                onDismiss={handleDismiss}
                onMarkAsRead={onMarkAsRead}
              />
            </div>
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
