import { Notification } from '../NotificationCenter';

export const sampleNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'mention',
    title: 'Sarah Chen mentioned you',
    description: 'Sarah mentioned you in a comment on Tel Tech NYC Expansion',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    isRead: false,
    actionLabel: 'View Comment',
    dealId: '1',
  },
  {
    id: 'n2',
    type: 'task',
    title: 'Task due today',
    description: 'Send revised proposal document for Tel Tech NYC Expansion',
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    isRead: false,
    actionLabel: 'Jump to Task',
    dealId: '1',
  },
  {
    id: 'n3',
    type: 'sync',
    title: 'Marcus Rodriguez replied',
    description: 'Marcus replied to "Q4 Lease Renewal Discussion"',
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
    isRead: false,
    actionLabel: 'View Sync',
  },
  {
    id: 'n4',
    type: 'follow',
    title: 'Deal stage updated',
    description: 'Tel Tech Chicago Office moved to Tour stage',
    timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
    isRead: true,
    actionLabel: 'View Deal',
    dealId: '3',
  },
  {
    id: 'n5',
    type: 'mention',
    title: 'Michael Brown mentioned you',
    description: '@David Can you review the space options for Tel Tech Seattle?',
    timestamp: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 hours ago
    isRead: true,
    actionLabel: 'View Comment',
    dealId: '6',
  },
  {
    id: 'n6',
    type: 'task',
    title: 'Task overdue',
    description: 'Schedule tour for Tel Tech Boston office is overdue by 1 day',
    timestamp: new Date(Date.now() - 25 * 60 * 60000).toISOString(), // Yesterday
    isRead: false,
    actionLabel: 'Jump to Task',
    dealId: '4',
  },
  {
    id: 'n7',
    type: 'follow',
    title: 'New activity on followed deal',
    description: 'Tel Tech SF HQ Relocation: New comment added by Sarah Chen',
    timestamp: new Date(Date.now() - 26 * 60 * 60000).toISOString(), // Yesterday
    isRead: true,
    actionLabel: 'View Deal',
    dealId: '2',
  },
  {
    id: 'n8',
    type: 'sync',
    title: 'New sync message',
    description: 'Sarah Chen started a new sync: "Tel Tech Expansion Strategy"',
    timestamp: new Date(Date.now() - 28 * 60 * 60000).toISOString(), // Yesterday
    isRead: true,
    actionLabel: 'View Sync',
  },
  {
    id: 'n9',
    type: 'follow',
    title: 'Deal closed',
    description: 'Tel Tech Austin Office successfully closed! Value: $95,000',
    timestamp: new Date(Date.now() - 48 * 60 * 60000).toISOString(), // 2 days ago
    isRead: true,
    actionLabel: 'View Deal',
    dealId: '5',
  },
  {
    id: 'n10',
    type: 'mention',
    title: 'Emma Wilson mentioned you',
    description: 'Tagged you in negotiation notes for Tel Tech NYC Expansion',
    timestamp: new Date(Date.now() - 50 * 60 * 60000).toISOString(), // 2 days ago
    isRead: true,
    actionLabel: 'View Comment',
    dealId: '1',
  },
];
