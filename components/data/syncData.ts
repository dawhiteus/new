export interface SyncMessage {
  id: string;
  author: {
    name: string;
    initials: string;
    color: string;
  };
  content: string;
  timestamp: string;
  mentions?: string[];
  reactions?: {
    type: 'like' | 'love' | 'fire';
    count: number;
    users: string[];
  }[];
}

export interface ActiveSync {
  id: string;
  title: string;
  participants: string[];
  dealName?: string;
  licenseId?: string;
  postId: string;
  lastActivity: string;
  unreadCount: number;
  messages: SyncMessage[];
  isUrgent?: boolean;
  isIdle?: boolean;
  idleDays?: number;
  status: 'urgent' | 'idle' | 'active';
}

export interface PastSync {
  id: string;
  title: string;
  participants: string[];
  dealName?: string;
  licenseId?: string;
  postId: string;
  resolvedDate: string;
}

export const initialActiveSyncs: ActiveSync[] = [
  {
    id: 'sync-1',
    title: 'Q4 Lease Renewal Discussion',
    participants: ['Marcus Johnson', 'Sarah Chen', 'Tom Anderson'],
    dealName: 'Tel Tech Downtown',
    licenseId: 'LIC-2024-0047',
    postId: '1',
    lastActivity: '2m ago',
    unreadCount: 2,
    isUrgent: true,
    status: 'urgent',
    messages: [
      { 
        id: 'msg-1',
        author: { name: 'Sarah Chen', initials: 'SC', color: '#00B8C4' },
        content: 'We should finalize terms by Friday. The current lease expires end of Q4.',
        timestamp: '1h ago',
        reactions: [
          { type: 'like', count: 2, users: ['Marcus Johnson', 'Tom Anderson'] }
        ]
      },
      {
        id: 'msg-2',
        author: { name: 'Tom Anderson', initials: 'TA', color: '#28A745' },
        content: 'Agreed. I\'ll reach out to the landlord today to discuss the renewal terms.',
        timestamp: '45m ago',
        reactions: []
      },
      {
        id: 'msg-3',
        author: { name: 'Sarah Chen', initials: 'SC', color: '#00B8C4' },
        content: '@Marcus Johnson can you review the updated proposal before we send it over?',
        timestamp: '2m ago',
        mentions: ['Marcus Johnson'],
        reactions: []
      }
    ]
  },
  {
    id: 'sync-2',
    title: 'Budget Approval for Austin Office',
    participants: ['Marcus Johnson', 'Jennifer Lee'],
    dealName: 'Tel Tech Austin Expansion',
    licenseId: 'LIC-2024-0089',
    postId: '2',
    lastActivity: '3d ago',
    unreadCount: 0,
    isIdle: true,
    idleDays: 3,
    status: 'idle',
    messages: [
      { 
        id: 'msg-4',
        author: { name: 'Jennifer Lee', initials: 'JL', color: '#FFA500' },
        content: 'Waiting on CFO approval for the Austin expansion budget. Should hear back by end of week.',
        timestamp: '3d ago',
        reactions: []
      }
    ]
  },
  {
    id: 'sync-3',
    title: 'Space Tour Coordination',
    participants: ['Marcus Johnson', 'Sarah Chen', 'Alex Martinez'],
    dealName: 'Tel Tech Downtown',
    postId: '3',
    lastActivity: '30m ago',
    unreadCount: 1,
    status: 'active',
    messages: [
      { 
        id: 'msg-5',
        author: { name: 'Alex Martinez', initials: 'AM', color: '#005B94' },
        content: 'Client wants to schedule a tour for next Tuesday at 2pm. Does that work for everyone?',
        timestamp: '2h ago',
        reactions: [
          { type: 'like', count: 1, users: ['Sarah Chen'] }
        ]
      },
      {
        id: 'msg-6',
        author: { name: 'Sarah Chen', initials: 'SC', color: '#00B8C4' },
        content: 'Works for me! I\'ll prepare the presentation materials.',
        timestamp: '1h ago',
        reactions: [
          { type: 'fire', count: 1, users: ['Alex Martinez'] }
        ]
      },
      {
        id: 'msg-7',
        author: { name: 'Alex Martinez', initials: 'AM', color: '#005B94' },
        content: '@Marcus Johnson confirming you\'re available Tuesday 2pm?',
        timestamp: '30m ago',
        mentions: ['Marcus Johnson'],
        reactions: []
      }
    ]
  }
];

export const initialPastSyncs: PastSync[] = [];