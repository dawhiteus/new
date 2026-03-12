import React from 'react';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { Badge } from './ui/badge';

interface GlobalHeaderProps {
  unreadCount: number;
  onNotificationClick: () => void;
}

export function GlobalHeader({ unreadCount, onNotificationClick }: GlobalHeaderProps) {
  return (
    <div 
      className="fixed z-30 flex items-center justify-end gap-2 px-6 py-4"
      style={{ 
        top: '0',
        right: '0',
        pointerEvents: 'none'
      }}
    >
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNotificationClick}
        className="h-10 w-10 p-0 rounded-lg relative hover:bg-white/20 transition-colors"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          pointerEvents: 'auto'
        }}
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1.5 -right-1.5 h-5 min-w-5 flex items-center justify-center rounded-full border-2 px-1.5"
            style={{
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}