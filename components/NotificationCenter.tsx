import React, { useState } from 'react';
import { X, MessageSquare, Users, CheckSquare, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';

export type NotificationType = 'mention' | 'sync' | 'task' | 'follow';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionLabel: string;
  actionTarget?: string;
  dealId?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
}

const filterTabs: { value: 'all' | NotificationType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'mention', label: 'Mentions' },
  { value: 'task', label: 'Tasks' },
  { value: 'sync', label: 'Syncs' },
  { value: 'follow', label: 'Follows' },
];

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  mention: <MessageSquare className="h-4 w-4" />,
  sync: <Users className="h-4 w-4" />,
  task: <CheckSquare className="h-4 w-4" />,
  follow: <Eye className="h-4 w-4" />,
};

const notificationColors: Record<NotificationType, string> = {
  mention: 'bg-blue-100 text-blue-600',
  sync: 'bg-purple-100 text-purple-600',
  task: 'bg-orange-100 text-orange-600',
  follow: 'bg-green-100 text-green-600',
};

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onNotificationClick,
}: NotificationCenterProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(
    (notif) => activeFilter === 'all' || notif.type === activeFilter
  );

  // Separate notifications into today and earlier
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayNotifications = filteredNotifications.filter((notif) => {
    const notifDate = new Date(notif.timestamp);
    return notifDate >= todayStart;
  });

  const earlierNotifications = filteredNotifications.filter((notif) => {
    const notifDate = new Date(notif.timestamp);
    return notifDate < todayStart;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Notification Panel */}
      <div
        className="fixed top-0 right-0 h-full bg-white z-[70] shadow-2xl animate-in slide-in-from-right duration-300"
        style={{ width: '440px' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: '#E5E7EB' }}
        >
          <div className="flex items-center gap-3">
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.3,
                fontFamily: 'Inter, sans-serif',
                color: '#374151',
              }}
            >
              Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge
                className="bg-red-600 text-white rounded-full h-5 min-w-5 flex items-center justify-center px-2"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-4 w-4" style={{ color: '#6B7280' }} />
          </Button>
        </div>

        {/* Filter Tabs */}
        <div
          className="flex items-center gap-2 px-6 py-3 border-b overflow-x-auto"
          style={{ borderColor: '#E5E7EB' }}
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap',
                activeFilter === tab.value
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                backgroundColor: activeFilter === tab.value ? '#005B94' : 'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <ScrollArea className="h-[calc(100vh-145px)]">
          <div className="px-4 py-2">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div
                  className="rounded-full mb-3 flex items-center justify-center"
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#F8F9FA',
                  }}
                >
                  <CheckSquare className="h-8 w-8" style={{ color: '#6B7280' }} />
                </div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: '#374151',
                    marginBottom: '4px',
                  }}
                >
                  You're all caught up!
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    color: '#6B7280',
                  }}
                >
                  No new notifications
                </p>
              </div>
            ) : (
              <>
                {todayNotifications.length > 0 && (
                  <div className="mb-4">
                    <div className="px-2 py-2">
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif',
                          color: '#6B7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Today
                      </p>
                    </div>
                    <div className="space-y-1">
                      {todayNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onNotificationClick={handleNotificationClick}
                          formatTimestamp={formatTimestamp}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {earlierNotifications.length > 0 && (
                  <div>
                    <div className="px-2 py-2">
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'Inter, sans-serif',
                          color: '#6B7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Earlier
                      </p>
                    </div>
                    <div className="space-y-1">
                      {earlierNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onNotificationClick={handleNotificationClick}
                          formatTimestamp={formatTimestamp}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onNotificationClick: (notification: Notification) => void;
  formatTimestamp: (timestamp: string) => string;
}

function NotificationItem({
  notification,
  onNotificationClick,
  formatTimestamp,
}: NotificationItemProps) {
  return (
    <button
      onClick={() => onNotificationClick(notification)}
      className={cn(
        'w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors relative',
        !notification.isRead && 'bg-blue-50/50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'rounded-lg flex items-center justify-center flex-shrink-0',
            notificationColors[notification.type]
          )}
          style={{ width: '32px', height: '32px' }}
        >
          {notificationIcons[notification.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p
              className={cn(!notification.isRead && 'font-semibold')}
              style={{
                fontSize: '14px',
                fontWeight: notification.isRead ? 500 : 600,
                fontFamily: 'Inter, sans-serif',
                color: '#374151',
                lineHeight: 1.4,
              }}
            >
              {notification.title}
            </p>
            {!notification.isRead && (
              <div
                className="rounded-full flex-shrink-0 mt-1"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#005B94',
                }}
              />
            )}
          </div>
          <p
            style={{
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: '#6B7280',
              lineHeight: 1.5,
              marginBottom: '6px',
            }}
          >
            {notification.description}
          </p>
          <div className="flex items-center justify-between">
            <span
              className="text-primary"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                color: '#005B94',
              }}
            >
              {notification.actionLabel}
            </span>
            <span
              style={{
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                color: '#9CA3AF',
              }}
            >
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}