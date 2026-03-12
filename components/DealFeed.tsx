import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  TrendingUp,
  Upload,
  UserPlus,
  MapPin,
  Trophy,
  XCircle,
  RefreshCw,
  Lightbulb,
  ThumbsUp,
  MessageCircle,
  Filter,
  Bell,
  MoreVertical,
  MoreHorizontal,
  ExternalLink,
  Download,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  Link2,
  Bookmark,
  Pin,
  Copy,
  Flag,
  Trash2,
  Eye,
  Heart,
  Flame,
  Smile,
  Image as ImageIcon,
  TrendingDown,
  ArrowRightCircle,
  Star,
  Plus,
  Edit2,
  Share2,
  User,
  Users,
  Bot,
  Clock,
  X,
  DollarSign,
  Building2,
  Calendar,
  Zap,
  Repeat,
  AlertTriangle,
} from 'lucide-react';
import { SyncCenter } from './SyncCenter';
import { initialActiveSyncs, initialPastSyncs, type ActiveSync, type PastSync } from './data/syncData';
import { AgentCard } from './AgentCard';
import { AgentActivityCounters } from './AgentActivityCounters';

interface Reaction {
  type: 'like' | 'love' | 'fire';
  count: number;
  userReacted?: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
    color: string;
  };
  content: string;
  timestamp: string;
  mentions?: string[];
}

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'task_assigned' | 'stage_change' | 'document_uploaded' | 'deal_created' | 'message_posted' | 'ai_suggestion' | 'broker_reassigned' | 'space_shortlisted' | 'deal_won' | 'deal_lost' | 'team_post' | 'shared_link' | 'casual_message' | 'agent_task_completed' | 'agent_issue_flagged' | 'agent_document_drafted';
  timestamp: string;
  broker: {
    name: string;
    initials: string;
    color: string;
  };
  isAgent?: boolean;
  actionVerb?: string;
  actionText: string;
  dealName?: string;
  dealId?: string;
  stage?: string;
  previousStage?: string;
  status?: 'active' | 'won' | 'lost' | 'pending';
  reactions?: Reaction[];
  comments?: Comment[];
  isPinned?: boolean;
  isFollowing?: boolean;
  licenseId?: string;
  agentAction?: {
    consequence?: string;
    ctaButtons?: Array<{ label: string; variant?: 'primary' | 'secondary' }>;
  };
  details?: {
    taskName?: string;
    dueDate?: string;
    fileName?: string;
    messageContent?: string;
    assignedTo?: string;
    postContent?: string;
    linkUrl?: string;
    linkTitle?: string;
    linkDescription?: string;
    linkImage?: string;
  };
}

const activityData: ActivityItem[] = [
  {
    id: 'casual-1',
    type: 'casual_message',
    timestamp: '30 seconds ago',
    broker: { name: 'Sarah Chen', initials: 'SC', color: '#005B94' },
    actionText: '',
    reactions: [
      { type: 'like', count: 4, userReacted: false },
      { type: 'love', count: 2, userReacted: false },
    ],
    comments: [
      {
        id: 'c1',
        author: { name: 'Marcus Johnson', initials: 'MJ', color: '#28A745' },
        content: 'Thanks! You too! 🎉',
        timestamp: '10 seconds ago',
      }
    ],
    details: {
      postContent: 'Hope everyone had a great weekend! Ready to close some deals this week 💪',
    },
  },
  {
    id: 'post-1',
    type: 'team_post',
    timestamp: '1 minute ago',
    broker: { name: 'Marcus Johnson', initials: 'MJ', color: '#28A745' },
    actionText: '',
    reactions: [
      { type: 'like', count: 2, userReacted: true },
      { type: 'fire', count: 1, userReacted: false },
    ],
    comments: [
      {
        id: 'c2',
        author: { name: 'Jessica Martinez', initials: 'JM', color: '#00B8C4' },
        content: '@Sarah Chen can you share the latest space options?',
        timestamp: '30 seconds ago',
        mentions: ['Sarah Chen'],
      }
    ],
    details: {
      postContent: 'Just wrapped up a great call with Tel Tech. They\'re looking to expand faster than expected - might need to pivot our search to include larger spaces. Thoughts? #teltech #expansion',
    },
  },
  {
    id: 'agent-1',
    type: 'agent_task_completed',
    timestamp: '5 minutes ago',
    broker: { name: 'MarketSourcingAgent', initials: 'MS', color: '#059669' },
    isAgent: true,
    actionVerb: 'completed',
    actionText: 'sourcing task',
    dealName: 'Tel Tech NYC Expansion',
    dealId: 'DL-001',
    status: 'active',
    agentAction: {
      consequence: 'Generated 3 compliant options in Midtown matching tenant requirements',
      ctaButtons: [
        { label: 'Approve', variant: 'primary' },
        { label: 'Request Edits', variant: 'secondary' }
      ]
    },
    reactions: [
      { type: 'like', count: 2, userReacted: false },
    ],
  },
  {
    id: '1',
    type: 'task_completed',
    timestamp: '2 minutes ago',
    broker: { name: 'Sarah Chen', initials: 'SC', color: '#005B94' },
    actionVerb: 'completed',
    actionText: 'task "Send revised proposal"',
    dealName: 'Tel Tech NYC Expansion',
    dealId: 'DL-001',
    stage: 'Proposal',
    status: 'active',
    licenseId: 'LIC-2024-0047',
    reactions: [
      { type: 'like', count: 3, userReacted: false },
    ],
    comments: [
      {
        id: 'c3',
        author: { name: 'David Park', initials: 'DP', color: '#28A745' },
        content: 'Great work! This looks solid.',
        timestamp: '1 minute ago',
      }
    ],
    details: {
      taskName: 'Send revised proposal',
      dueDate: 'Nov 13, 2025',
    },
  },
  {
    id: 'link-1',
    type: 'shared_link',
    timestamp: '15 minutes ago',
    broker: { name: 'Jessica Martinez', initials: 'JM', color: '#00B8C4' },
    actionText: 'shared an article',
    reactions: [
      { type: 'like', count: 5, userReacted: false },
      { type: 'fire', count: 2, userReacted: false },
    ],
    comments: [
      {
        id: 'c4',
        author: { name: 'Marcus Johnson', initials: 'MJ', color: '#28A745' },
        content: 'This is really helpful for our MediaCo pitch',
        timestamp: '10 minutes ago',
      },
      {
        id: 'c5',
        author: { name: 'Sarah Chen', initials: 'SC', color: '#005B94' },
        content: 'Thanks for sharing! Bookmarking this.',
        timestamp: '8 minutes ago',
      }
    ],
    details: {
      postContent: 'Great insights on hybrid workspace trends for 2025. Relevant for our Tel Tech and MediaCo deals.',
      linkUrl: 'https://www.commercialobserver.com/2025/11/hybrid-workspace-trends',
      linkTitle: 'The Future of Hybrid Workspaces: 2025 Trends Report',
      linkDescription: 'New research shows companies are prioritizing flexible office layouts and amenity-rich spaces as they refine their return-to-office strategies.',
      linkImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    },
  },
  {
    id: '2',
    type: 'stage_change',
    timestamp: '18 minutes ago',
    broker: { name: 'Marcus Johnson', initials: 'MJ', color: '#28A745' },
    actionVerb: 'moved',
    actionText: 'deal to Tour Scheduled stage',
    dealName: 'MediaCo Chicago Office',
    dealId: 'DL-008',
    stage: 'Tour Scheduled',
    previousStage: 'Initial Contact',
    status: 'active',
    reactions: [
      { type: 'like', count: 5, userReacted: false },
    ],
    comments: [
      {
        id: 'c6',
        author: { name: 'David Park', initials: 'DP', color: '#28A745' },
        content: 'Nice progress! When is the tour scheduled?',
        timestamp: '15 minutes ago',
      },
      {
        id: 'c7',
        author: { name: 'Marcus Johnson', initials: 'MJ', color: '#28A745' },
        content: '@David Park Next Tuesday at 2pm',
        timestamp: '12 minutes ago',
        mentions: ['David Park'],
      }
    ],
  },
  {
    id: 'agent-2',
    type: 'agent_issue_flagged',
    timestamp: '25 minutes ago',
    broker: { name: 'RiskComplianceAgent', initials: 'RC', color: '#059669' },
    isAgent: true,
    actionVerb: 'flagged',
    actionText: 'escalation',
    dealName: 'MediaCo Chicago Office',
    dealId: 'DL-008',
    status: 'active',
    agentAction: {
      consequence: 'Insurance certificate missing before execution stage — contracting blocked',
      ctaButtons: [
        { label: 'Create Task', variant: 'primary' },
        { label: 'Acknowledge', variant: 'secondary' }
      ]
    },
    reactions: [
      { type: 'like', count: 1, userReacted: false },
    ],
  },
  {
    id: '3',
    type: 'ai_suggestion',
    timestamp: '1 hour ago',
    broker: { name: 'AI Assistant', initials: 'AI', color: '#FFA500' },
    actionVerb: 'suggests',
    actionText: 'following up on deal — 14 days of inactivity',
    dealName: 'MediaCo Chicago Office',
    dealId: 'DL-008',
    stage: 'Tour Scheduled',
    status: 'active',
    reactions: [
      { type: 'like', count: 1, userReacted: false },
    ],
    comments: [],
  },
  {
    id: '4',
    type: 'document_uploaded',
    timestamp: '2 hours ago',
    broker: { name: 'Jessica Martinez', initials: 'JM', color: '#00B8C4' },
    actionVerb: 'uploaded',
    actionText: 'document',
    dealName: 'Tel Tech NYC Expansion',
    dealId: 'DL-001',
    stage: 'Proposal',
    status: 'active',
    reactions: [
      { type: 'like', count: 2, userReacted: false },
    ],
    comments: [],
    details: {
      fileName: 'Lease_Agreement_Draft_v3.pdf',
    },
  },
  {
    id: 'agent-3',
    type: 'agent_document_drafted',
    timestamp: '2 hours ago',
    broker: { name: 'TransactionCoordinatorAgent', initials: 'TC', color: '#059669' },
    isAgent: true,
    actionVerb: 'drafted',
    actionText: 'document',
    dealName: 'Tel Tech NYC Expansion',
    dealId: 'DL-001',
    status: 'active',
    agentAction: {
      consequence: 'Lease_Addendum_v1.docx ready for review',
      ctaButtons: [
        { label: 'Approve', variant: 'primary' },
        { label: 'Request Edits', variant: 'secondary' }
      ]
    },
    reactions: [
      { type: 'like', count: 3, userReacted: false },
    ],
  },
  {
    id: '5',
    type: 'deal_won',
    timestamp: '3 hours ago',
    broker: { name: 'David Park', initials: 'DP', color: '#28A745' },
    actionVerb: 'closed',
    actionText: 'deal as Won! 🎉',
    dealName: 'FinServe Seattle HQ',
    dealId: 'DL-015',
    stage: 'Executed',
    status: 'won',
    isPinned: true,
    reactions: [
      { type: 'like', count: 12, userReacted: false },
      { type: 'love', count: 5, userReacted: false },
      { type: 'fire', count: 8, userReacted: false },
    ],
    comments: [
      {
        id: 'c8',
        author: { name: 'Sarah Chen', initials: 'SC', color: '#005B94' },
        content: 'Congrats David! Amazing work! 🎉',
        timestamp: '2 hours ago',
      },
      {
        id: 'c9',
        author: { name: 'Marcus Johnson', initials: 'MJ', color: '#28A745' },
        content: 'Huge win for the team! 🚀',
        timestamp: '2 hours ago',
      },
      {
        id: 'c10',
        author: { name: 'Jessica Martinez', initials: 'JM', color: '#00B8C4' },
        content: 'Well deserved! Great job leading this one.',
        timestamp: '2 hours ago',
      },
      {
        id: 'c11',
        author: { name: 'David Park', initials: 'DP', color: '#28A745' },
        content: 'Thanks everyone! Couldn\'t have done it without the team support.',
        timestamp: '1 hour ago',
      }
    ],
  },
];

const savedResources = [
  {
    id: 'res-1',
    title: 'The Future of Hybrid Workspaces: 2025 Trends Report',
    url: 'https://www.commercialobserver.com/2025/11/hybrid-workspace-trends',
    savedBy: 'Jessica Martinez',
    date: '2 hours ago',
    tags: ['trends', 'hybrid'],
  },
  {
    id: 'res-2',
    title: 'NYC Commercial Lease Negotiations Guide',
    url: 'https://example.com/lease-guide',
    savedBy: 'Sarah Chen',
    date: '1 day ago',
    tags: ['nyc', 'leases'],
  },
  {
    id: 'res-3',
    title: 'Q4 2024 Office Market Report - Chicago',
    url: 'https://example.com/chicago-report',
    savedBy: 'Marcus Johnson',
    date: '3 days ago',
    tags: ['marketupdate', 'chicago'],
  },
];

const reactionIcons = {
  like: ThumbsUp,
  love: Heart,
  fire: Flame,
};

export function DealFeed() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBroker, setFilterBroker] = useState<string>('all');
  const [agentVisibilityMode, setAgentVisibilityMode] = useState<'all' | 'brokers' | 'agents' | 'running' | 'recommended' | 'review' | 'blocking'>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [pinnedPosts, setPinnedPosts] = useState<Set<string>>(new Set());
  const [showSyncThread, setShowSyncThread] = useState<string | null>(null);
  const [syncMessageInput, setSyncMessageInput] = useState('');
  const [syncMessages, setSyncMessages] = useState<Map<string, Array<{
    id: string;
    author: { name: string; initials: string; color: string };
    message: string;
    timestamp: string;
    mentions?: string[];
  }>>>(new Map());
  const [resolvedSyncs, setResolvedSyncs] = useState<Set<string>>(new Set());
  const [followedPosts, setFollowedPosts] = useState<Set<string>>(new Set());
  const [showMessageModal, setShowMessageModal] = useState<{ postId: string; userName: string; userInitials: string; userColor: string } | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [showCopyConfirmation, setShowCopyConfirmation] = useState<string | null>(null);
  
  // Sync Modal State
  const [showSyncModal, setShowSyncModal] = useState<{ postId: string; dealName?: string; postAuthor: string } | null>(null);
  const [syncTitle, setSyncTitle] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [syncParticipants, setSyncParticipants] = useState<string[]>([]);
  const [syncSuggestedTime, setSyncSuggestedTime] = useState('');
  
  // Sync Center State
  const [activeSyncs, setActiveSyncs] = useState<ActiveSync[]>(initialActiveSyncs);
  const [pastSyncs, setPastSyncs] = useState<PastSync[]>(initialPastSyncs);
  const [syncFilter, setSyncFilter] = useState<'all' | 'mine' | 'team'>('all');
  const [expandedSyncId, setExpandedSyncId] = useState<string | null>(null);
  
  // Post composer state
  const [isComposerExpanded, setIsComposerExpanded] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  // Resource library state
  const [showResourceLibrary, setShowResourceLibrary] = useState(false);
  
  // Sidebar hover states
  const [hoveredDeal, setHoveredDeal] = useState<string | null>(null);
  const [hoveredView, setHoveredView] = useState<string | null>(null);
  
  // Active saved view filter
  const [activeFilter, setActiveFilter] = useState<'all' | 'my-team' | 'my-deals' | 'ai-suggestions' | 'closed-deals' | 'pinned-posts'>('all');
  
  // New view modal state
  const [isNewViewModalOpen, setIsNewViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewActivityType, setNewViewActivityType] = useState('all');
  const [newViewBroker, setNewViewBroker] = useState('all');
  const [newViewClient, setNewViewClient] = useState('all');
  const [newViewStage, setNewViewStage] = useState('all');
  const [newViewKeywords, setNewViewKeywords] = useState('');
  const [newViewPinToSidebar, setNewViewPinToSidebar] = useState(true);
  
  // Custom saved views
  const [customViews, setCustomViews] = useState<Array<{
    id: string;
    name: string;
    filters: {
      activityType: string;
      broker: string;
      client: string;
      stage: string;
      keywords: string;
    };
    pinned: boolean;
  }>>([]);
  
  // Deal filtering
  const [filterByDeal, setFilterByDeal] = useState<string | null>(null);
  
  // Deal sidebar state
  const [selectedDealSidebar, setSelectedDealSidebar] = useState<string | null>(null);

  // Share View modal state
  const [isShareViewModalOpen, setIsShareViewModalOpen] = useState(false);
  const [shareViewEmail, setShareViewEmail] = useState('');
  const [shareViewMessage, setShareViewMessage] = useState('');
  const [selectedViewToShare, setSelectedViewToShare] = useState<string | null>(null);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  
  // Edit View modal state
  const [isEditViewModalOpen, setIsEditViewModalOpen] = useState(false);
  const [editingViewId, setEditingViewId] = useState<string | null>(null);
  
  // Delete View modal state
  const [isDeleteViewModalOpen, setIsDeleteViewModalOpen] = useState(false);
  const [deletingViewId, setDeletingViewId] = useState<string | null>(null);
  
  // License ID state
  const [postLicenseIds, setPostLicenseIds] = useState<Map<string, string>>(new Map());
  const [showLicenseIdModal, setShowLicenseIdModal] = useState<string | null>(null);
  const [licenseIdInput, setLicenseIdInput] = useState('');

  // Initialize demo sync messages and license IDs
  useEffect(() => {
    const demoSyncMessages = new Map();
    demoSyncMessages.set('task-2', [
      {
        id: 'sync-1',
        author: { name: 'Sarah Chen', initials: 'SC', color: '#005B94' },
        message: 'Just reviewed the space. This looks like a great fit for Tel Tech. Can we align on pricing before the client call tomorrow?',
        timestamp: '2 hours ago',
        mentions: []
      },
      {
        id: 'sync-2',
        author: { name: 'Marcus Johnson', initials: 'MJ', color: '#005B94' },
        message: '@Sarah Chen Agreed! I\'ll prepare the proposal with our best rates. Let\'s sync at 2pm today?',
        timestamp: '1 hour ago',
        mentions: ['Sarah Chen']
      }
    ]);
    setSyncMessages(demoSyncMessages);
    
    // Initialize license IDs from activityData
    const initialLicenseIds = new Map<string, string>();
    activityData.forEach(activity => {
      if (activity.licenseId) {
        initialLicenseIds.set(activity.id, activity.licenseId);
      }
    });
    setPostLicenseIds(initialLicenseIds);
  }, []);

  const handlePostSubmit = () => {
    // Handle post submission
    console.log('Post:', postContent, linkUrl);
    setPostContent('');
    setLinkUrl('');
    setIsComposerExpanded(false);
  };
  
  const handleCreateView = () => {
    if (!newViewName.trim()) return;
    
    const newView = {
      id: `custom-${Date.now()}`,
      name: newViewName,
      filters: {
        activityType: newViewActivityType,
        broker: newViewBroker,
        client: newViewClient,
        stage: newViewStage,
        keywords: newViewKeywords,
      },
      pinned: newViewPinToSidebar,
    };
    
    setCustomViews([...customViews, newView]);
    
    // Reset form
    setNewViewName('');
    setNewViewActivityType('all');
    setNewViewBroker('all');
    setNewViewClient('all');
    setNewViewStage('all');
    setNewViewKeywords('');
    setNewViewPinToSidebar(true);
    setIsNewViewModalOpen(false);
  };
  
  const handleShareView = (viewId: string) => {
    setSelectedViewToShare(viewId);
    setIsShareViewModalOpen(true);
  };
  
  const handleShareViewSubmit = () => {
    if (!shareViewEmail.trim()) return;
    
    // Show confirmation
    setShowShareConfirmation(true);
    
    // Reset after delay
    setTimeout(() => {
      setShowShareConfirmation(false);
      setIsShareViewModalOpen(false);
      setShareViewEmail('');
      setShareViewMessage('');
      setSelectedViewToShare(null);
    }, 2000);
  };
  
  const handleEditView = (viewId: string) => {
    setEditingViewId(viewId);
    
    // Pre-fill form with existing view data
    const viewToEdit = customViews.find(v => v.id === viewId);
    if (viewToEdit) {
      setNewViewName(viewToEdit.name);
      setNewViewActivityType(viewToEdit.filters.activityType);
      setNewViewBroker(viewToEdit.filters.broker);
      setNewViewClient(viewToEdit.filters.client);
      setNewViewStage(viewToEdit.filters.stage);
      setNewViewKeywords(viewToEdit.filters.keywords);
      setNewViewPinToSidebar(viewToEdit.pinned);
    }
    
    setIsEditViewModalOpen(true);
  };
  
  const handleUpdateView = () => {
    if (!newViewName.trim() || !editingViewId) return;
    
    setCustomViews(customViews.map(view => 
      view.id === editingViewId
        ? {
            ...view,
            name: newViewName,
            filters: {
              activityType: newViewActivityType,
              broker: newViewBroker,
              client: newViewClient,
              stage: newViewStage,
              keywords: newViewKeywords,
            },
            pinned: newViewPinToSidebar,
          }
        : view
    ));
    
    // Reset form
    setNewViewName('');
    setNewViewActivityType('all');
    setNewViewBroker('all');
    setNewViewClient('all');
    setNewViewStage('all');
    setNewViewKeywords('');
    setNewViewPinToSidebar(true);
    setIsEditViewModalOpen(false);
    setEditingViewId(null);
  };
  
  const handleDeleteView = (viewId: string) => {
    setDeletingViewId(viewId);
    setIsDeleteViewModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (!deletingViewId) return;
    
    setCustomViews(customViews.filter(view => view.id !== deletingViewId));
    setIsDeleteViewModalOpen(false);
    setDeletingViewId(null);
  };

  const getTotalReactions = (reactions?: Reaction[]) => {
    if (!reactions) return 0;
    return reactions.reduce((sum, r) => sum + r.count, 0);
  };
  
  // Filter activity data based on active filter
  const getFilteredActivity = () => {
    const teamMembers = ['Sarah Chen', 'Marcus Johnson', 'Jessica Martinez', 'David Park'];
    const currentUser = 'Sarah Chen'; // In a real app, this would come from auth
    
    if (activeFilter === 'all') {
      return activityData;
    }
    
    if (activeFilter === 'my-team') {
      // Show all posts from team members
      return activityData.filter(item => 
        teamMembers.includes(item.broker.name)
      );
    }
    
    if (activeFilter === 'my-deals') {
      // Show only deals assigned to current user
      return activityData.filter(item => 
        item.broker.name === currentUser
      );
    }
    
    if (activeFilter === 'ai-suggestions') {
      // Show AI-flagged items (tasks, overdue, stalled deals)
      return activityData.filter(item => 
        item.type === 'task_completed' || 
        item.type === 'task_assigned' ||
        item.type === 'deal_update' ||
        (item.details?.taskName && item.details.taskName.includes('follow'))
      );
    }
    
    if (activeFilter === 'closed-deals') {
      // Show won/lost deals from last 30 days
      return activityData.filter(item => 
        item.status === 'won' || item.status === 'lost'
      );
    }
    
    if (activeFilter === 'pinned-posts') {
      // Show only pinned posts
      return activityData.filter(item => item.isPinned === true);
    }
    
    return activityData;
  };
  
  let filteredActivity = getFilteredActivity();
  
  // Apply deal-specific filter if active
  if (filterByDeal) {
    filteredActivity = filteredActivity.filter(item => 
      item.details?.dealName === filterByDeal || 
      item.actionText.includes(filterByDeal)
    );
  }
  
  // Apply search filter if active
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredActivity = filteredActivity.filter(item => {
      // Search in deal names
      const dealNameMatch = item.details?.dealName?.toLowerCase().includes(query);
      
      // Search in client names (extract from deal name)
      const clientMatch = item.details?.dealName?.toLowerCase().includes(query);
      
      // Search in broker names
      const brokerMatch = item.broker?.name?.toLowerCase().includes(query);
      
      // Search in action text
      const actionMatch = item.actionText?.toLowerCase().includes(query);
      
      // Search in deal stages
      const stageMatch = item.details?.stage?.toLowerCase().includes(query);
      
      // Search in task types
      const taskMatch = item.details?.taskType?.toLowerCase().includes(query);
      
      // Search in hashtags (e.g., #followup, #urgent)
      const hashtagMatch = item.actionText?.toLowerCase().includes('#' + query.replace('#', ''));
      
      // Search in mentions (e.g., @Sarah)
      const mentionMatch = item.actionText?.toLowerCase().includes('@' + query.replace('@', ''));
      
      // Search in document names
      const documentMatch = item.details?.documentName?.toLowerCase().includes(query);
      
      return dealNameMatch || clientMatch || brokerMatch || actionMatch || 
             stageMatch || taskMatch || hashtagMatch || mentionMatch || documentMatch;
    });
  }

  // Apply agent visibility mode filter
  if (agentVisibilityMode === 'brokers') {
    filteredActivity = filteredActivity.filter(item => !item.isAgent);
  } else if (agentVisibilityMode === 'agents') {
    filteredActivity = filteredActivity.filter(item => item.isAgent === true);
  } else if (agentVisibilityMode === 'running') {
    filteredActivity = filteredActivity.filter(item => 
      item.isAgent && item.type === 'agent_task_completed' && item.agentAction?.status === 'running'
    );
  } else if (agentVisibilityMode === 'recommended') {
    filteredActivity = filteredActivity.filter(item => 
      item.isAgent && item.agentAction?.status === 'recommended'
    );
  } else if (agentVisibilityMode === 'review') {
    filteredActivity = filteredActivity.filter(item => 
      item.isAgent && (item.type === 'agent_document_drafted' || item.agentAction?.status === 'needs_review')
    );
  } else if (agentVisibilityMode === 'blocking') {
    filteredActivity = filteredActivity.filter(item => 
      item.isAgent && item.type === 'agent_issue_flagged'
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#005B94' }} className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>
              Pulse
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Inter, sans-serif' }}>
              Stay updated on all transaction activity, messages, and movement.
            </p>
          </div>
        </div>
      </div>

      {/* Resource Library Modal */}
      <Dialog open={showResourceLibrary} onOpenChange={setShowResourceLibrary}>
        <DialogContent className="max-w-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '20px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Saved Resources
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Articles, guides, and resources saved by your team
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#6B7280' }} />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="trends">Trends</SelectItem>
                  <SelectItem value="leases">Leases</SelectItem>
                  <SelectItem value="market">Market Updates</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {savedResources.map((resource) => (
                <Card key={resource.id} className="bg-white border hover:shadow-sm transition-shadow" style={{ borderColor: '#E5E7EB' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 hover:underline"
                        style={{ fontSize: '14px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}
                      >
                        {resource.title}
                      </a>
                      <ExternalLink className="h-4 w-4 flex-shrink-0 ml-2" style={{ color: '#6B7280' }} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        Saved by {resource.savedBy} • {resource.date}
                      </span>
                      <div className="flex gap-1">
                        {resource.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="px-2 py-0.5"
                            style={{
                              backgroundColor: '#E5E7EB',
                              color: '#374151',
                              fontSize: '10px',
                              fontWeight: 500,
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* License ID Modal */}
      <Dialog open={showLicenseIdModal !== null} onOpenChange={() => setShowLicenseIdModal(null)}>
        <DialogContent className="max-w-md" style={{ fontFamily: 'Inter, sans-serif' }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '20px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              {postLicenseIds.has(showLicenseIdModal || '') ? 'Edit License ID' : 'Link to License ID'}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Associate this post with a specific license ID for tracking and reference
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="license-id" style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '8px', display: 'block' }}>
                License ID
              </Label>
              <Input
                id="license-id"
                type="text"
                value={licenseIdInput}
                onChange={(e) => setLicenseIdInput(e.target.value)}
                placeholder="e.g., LIC-2024-0047"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (licenseIdInput.trim() && showLicenseIdModal) {
                      const newMap = new Map(postLicenseIds);
                      newMap.set(showLicenseIdModal, licenseIdInput.trim());
                      setPostLicenseIds(newMap);
                      setShowLicenseIdModal(null);
                      setLicenseIdInput('');
                    }
                  }
                }}
                className="w-full"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => {
                  if (licenseIdInput.trim() && showLicenseIdModal) {
                    const newMap = new Map(postLicenseIds);
                    newMap.set(showLicenseIdModal, licenseIdInput.trim());
                    setPostLicenseIds(newMap);
                    setShowLicenseIdModal(null);
                    setLicenseIdInput('');
                  }
                }}
                disabled={!licenseIdInput.trim()}
                className="flex-1"
                style={{
                  backgroundColor: licenseIdInput.trim() ? '#005B94' : '#E5E7EB',
                  color: licenseIdInput.trim() ? '#FFFFFF' : '#9CA3AF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                {postLicenseIds.has(showLicenseIdModal || '') ? 'Update' : 'Link'}
              </Button>
              {postLicenseIds.has(showLicenseIdModal || '') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (showLicenseIdModal) {
                      const newMap = new Map(postLicenseIds);
                      newMap.delete(showLicenseIdModal);
                      setPostLicenseIds(newMap);
                      setShowLicenseIdModal(null);
                      setLicenseIdInput('');
                    }
                  }}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  Remove
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setShowLicenseIdModal(null);
                  setLicenseIdInput('');
                }}
                className="border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="col-span-8">
            {/* Unified Control Bar */}
            <Card className="bg-white border mb-4" style={{ borderColor: '#E5E7EB' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Search Field - 60% width */}
                  <div className="relative flex-[3]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#9CA3AF' }} />
                    <Input
                      type="text"
                      placeholder="Search activity by deal, client, broker, #tag, @mention..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 h-10"
                      style={{ 
                        fontSize: '14px', 
                        fontFamily: 'Inter, sans-serif',
                        borderColor: '#E5E7EB'
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Activity Type Dropdown - 15% width */}
                  <div className="flex-1">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-full h-10" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                        <SelectValue placeholder="All Activity Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activity Types</SelectItem>
                        <SelectItem value="tasks">Tasks Only</SelectItem>
                        <SelectItem value="stages">Stage Changes</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="messages">Messages & Posts</SelectItem>
                        <SelectItem value="deals">Deal Events</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Broker Dropdown - 15% width */}
                  <div className="flex-1">
                    <Select value={filterBroker} onValueChange={setFilterBroker}>
                      <SelectTrigger className="w-full h-10" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                        <SelectValue placeholder="All Brokers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brokers</SelectItem>
                        <SelectItem value="me">My Activity</SelectItem>
                        <SelectItem value="sarah">Sarah Chen</SelectItem>
                        <SelectItem value="marcus">Marcus Johnson</SelectItem>
                        <SelectItem value="jessica">Jessica Martinez</SelectItem>
                        <SelectItem value="david">David Park</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Agent Visibility Mode Dropdown - 15% width */}
                  <div className="flex-1">
                    <Select value={agentVisibilityMode} onValueChange={(value: 'all' | 'brokers' | 'agents') => setAgentVisibilityMode(value)}>
                      <SelectTrigger className="w-full h-10" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                        <SelectValue placeholder="All Activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activity</SelectItem>
                        <SelectItem value="brokers">Broker Activity</SelectItem>
                        <SelectItem value="agents">Agent Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* New Post Button */}
                  <Button
                    onClick={() => setIsComposerExpanded(!isComposerExpanded)}
                    variant="outline"
                    className="h-10 whitespace-nowrap"
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      fontFamily: 'Inter, sans-serif',
                      borderColor: '#005B94',
                      color: '#005B94'
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Post Composer - Only shown when expanded */}
            {isComposerExpanded && (
              <Card className="bg-white border mb-4" style={{ borderColor: '#E5E7EB' }}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share an update, insight, or article with your team... Use @mentions and #hashtags"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      rows={4}
                      maxLength={400}
                      style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                    />
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#6B7280' }} />
                        <Input
                          placeholder="Paste article URL or image link (optional)"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="pl-10"
                          style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        {postContent.length}/400 characters
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsComposerExpanded(false);
                            setPostContent('');
                            setLinkUrl('');
                          }}
                          style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePostSubmit}
                          disabled={!postContent.trim()}
                          style={{
                            backgroundColor: '#005B94',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agent Workflow */}
            <Card className="bg-white border mb-4" style={{ borderColor: '#E5E7EB' }}>
              <CardContent className="p-5">
                {/* Header */}
                <div className="mb-4">
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                    Agent Workflow
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>
                    Autonomous work across your deals requiring visibility or review.
                  </p>
                  
                  {/* Subtle Legend */}
                  <div 
                    className="px-3 py-2 rounded"
                    style={{ 
                      backgroundColor: '#F8F9FA',
                      fontSize: '11px',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.5
                    }}
                  >
                    <span style={{ fontWeight: 500, color: '#374151' }}>Agent states:</span> Running — in progress • Recommended — suggested action • Needs Review — approval required • Escalation — deal blocked or risk detected
                  </div>
                </div>

                <div className="space-y-3">
                  <AgentCard
                    agentName="MarketSourcingAgent"
                    status="Running"
                    severity="informational"
                    activity="Running sourcing analysis for Hudson Yards area"
                    dealName="Tel Tech NYC Expansion"
                    dealStage="Requirement"
                    timestamp="3m ago"
                    estimatedCompletion="Est. completion 2m"
                    onViewDetails={() => {}}
                  />

                  <AgentCard
                    agentName="EngagementMonitorAgent"
                    status="Recommended"
                    severity="suggestion"
                    activity="Client engagement trend declining — suggest follow-up within 48h"
                    dealName="Tel Tech NYC Expansion"
                    dealStage="Evaluate"
                    timestamp="1h ago"
                    onCreateTask={() => {}}
                    onDismiss={() => {}}
                  />

                  <AgentCard
                    agentName="TransactionCoordinatorAgent"
                    status="Needs Review"
                    severity="review"
                    activity="Drafted lease addendum for parking allocation terms"
                    dealName="Tel Tech NYC Expansion"
                    dealStage="Negotiation"
                    timestamp="2h ago"
                    onApprove={() => {}}
                    onRequestEdits={() => {}}
                    onViewOutput={() => {}}
                  />

                  <AgentCard
                    agentName="RiskComplianceAgent"
                    status="Escalation"
                    severity="escalation"
                    activity="Missing insurance certificate — contracting blocked until resolved"
                    dealName="MediaCo Chicago Office"
                    dealStage="Contracting"
                    timestamp="5h ago"
                    consequence="Stage advancement blocked. Required document missing per policy."
                    onCreateTask={() => {}}
                    onAcknowledge={() => {}}
                    onViewDetails={() => {}}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Filter Indicator */}
            {(activeFilter !== 'all' || filterByDeal || searchQuery.trim() || agentVisibilityMode !== 'all') && (
              <div 
                className="flex items-center justify-between px-4 py-2.5 rounded-lg mb-3"
                style={{ 
                  backgroundColor: '#E0F2FE',
                  border: '1px solid #0369A1'
                }}
              >
                <div className="flex items-center gap-2">
                  {searchQuery.trim() ? (
                    <Search className="h-4 w-4" style={{ color: '#0369A1' }} />
                  ) : (
                    <Filter className="h-4 w-4" style={{ color: '#0369A1' }} />
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0369A1', fontFamily: 'Inter, sans-serif' }}>
                    {searchQuery.trim() ? `Search results for "${searchQuery}"` : ''}
                    {!searchQuery.trim() && filterByDeal ? `Showing: ${filterByDeal} Updates` : ''}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'my-team' && 'Showing: Team Activity'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'my-deals' && 'Showing: My Deals Only'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'ai-suggestions' && 'Showing: AI Suggestions'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'closed-deals' && 'Showing: Closed Deals (30d)'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'pinned-posts' && 'Showing: Pinned Posts'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'all' && agentVisibilityMode === 'brokers' && 'Showing: Broker Activity Only'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'all' && agentVisibilityMode === 'agents' && 'Showing: Agent Activity Only'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'all' && agentVisibilityMode === 'running' && 'Showing: Running Tasks'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'all' && agentVisibilityMode === 'recommended' && 'Showing: Recommended Actions'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'all' && agentVisibilityMode === 'review' && 'Showing: Needs Review'}
                    {!searchQuery.trim() && !filterByDeal && activeFilter === 'all' && agentVisibilityMode === 'blocking' && 'Showing: Escalations'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#0369A1', fontFamily: 'Inter, sans-serif' }}>
                    ({filteredActivity.length} {filteredActivity.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setFilterByDeal(null);
                    setSearchQuery('');
                    setAgentVisibilityMode('all');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-white/50 transition-colors"
                  style={{ fontSize: '12px', fontWeight: 500, color: '#0369A1', fontFamily: 'Inter, sans-serif' }}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Clear {searchQuery.trim() ? 'Search' : 'Filter'}
                </button>
              </div>
            )}

            {/* Activity Stream */}
            <div className="space-y-3">
              {filteredActivity.map((activity) => {
                const isExpanded = expandedCard === activity.id;
                const isShowingComments = showComments === activity.id;
                const totalReactions = getTotalReactions(activity.reactions);

                return (
                  <Card 
                    key={activity.id}
                    id={`post-${activity.id}`}
                    className="bg-white border hover:shadow-sm transition-all" 
                    style={{ 
                      borderColor: '#E5E7EB',
                      borderWidth: '1px',
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Avatar */}
                        {activity.isAgent ? (
                          <div 
                            className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#D1FAE5' }}
                          >
                            <Bot className="h-5 w-5" style={{ color: '#059669' }} />
                          </div>
                        ) : (
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback
                              style={{
                                backgroundColor: activity.broker.color,
                                color: '#FFFFFF',
                                fontSize: '12px',
                                fontWeight: 600,
                                fontFamily: 'Inter, sans-serif'
                              }}
                            >
                              {activity.broker.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                {activity.broker.name}
                              </span>
                              {activity.isAgent && (
                                <Badge className="bg-green-600 text-white border-0" style={{ fontSize: '10px', fontWeight: 500 }}>
                                  Agent
                                </Badge>
                              )}
                              {activity.actionVerb && (
                                <>
                                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                    {activity.actionVerb}
                                  </span>
                                  <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                    {activity.actionText}
                                  </span>
                                </>
                              )}
                              {activity.type === 'shared_link' && (
                                <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                  {activity.actionText}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                {activity.timestamp}
                              </span>
                              {/* Pinned indicator badge */}
                              {pinnedPosts.has(activity.id) && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                                  <Pin className="h-3 w-3" style={{ color: '#D97706', fill: '#D97706' }} />
                                  <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                                    Pinned
                                  </span>
                                </div>
                              )}
                              {/* License ID badge */}
                              {postLicenseIds.has(activity.id) && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                                  <FileText className="h-3 w-3" style={{ color: '#005B94' }} />
                                  <span style={{ fontSize: '11px', color: '#005B94', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                                    {postLicenseIds.get(activity.id)}
                                  </span>
                                </div>
                              )}
                              {/* Following indicator badge */}
                              {followedPosts.has(activity.id) && (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E0F2FE', border: '1px solid #BAE6FD' }}>
                                  <Bell className="h-3 w-3" style={{ color: '#005B94', fill: '#005B94' }} />
                                  <span style={{ fontSize: '11px', color: '#005B94', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                                    Following
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Team Post or Casual Message Content */}
                          {(activity.type === 'team_post' || activity.type === 'casual_message') && activity.details?.postContent && (
                            <div className="mb-3">
                              <p style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                                {activity.details.postContent}
                              </p>
                            </div>
                          )}

                          {/* Shared Link Preview */}
                          {activity.type === 'shared_link' && activity.details && (
                            <div className="mb-3">
                              {activity.details.postContent && (
                                <p style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: '12px' }}>
                                  {activity.details.postContent}
                                </p>
                              )}
                              <a
                                href={activity.details.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                style={{ border: '1px solid #E5E7EB' }}
                              >
                                {activity.details.linkImage && (
                                  <img
                                    src={activity.details.linkImage}
                                    alt=""
                                    className="flex-shrink-0 rounded object-cover"
                                    style={{ width: '100px', height: '100px' }}
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif', marginBottom: '4px', lineHeight: 1.4 }}>
                                    {activity.details.linkTitle}
                                  </div>
                                  <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, marginBottom: '8px' }}>
                                    {activity.details.linkDescription}
                                  </p>
                                  <div className="flex items-center gap-1.5">
                                    <ExternalLink className="h-3 w-3" style={{ color: '#9CA3AF' }} />
                                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                      commercialobserver.com
                                    </span>
                                  </div>
                                </div>
                              </a>
                            </div>
                          )}

                          {/* Deal Link & Stage */}
                          {activity.dealName && (
                            <div className="flex items-center gap-2 mb-3">
                              <button
                                className="hover:underline"
                                style={{ fontSize: '15px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {activity.dealName}
                              </button>
                              {activity.stage && (
                                <>
                                  <span style={{ fontSize: '12px', color: '#6B7280' }}>•</span>
                                  {activity.previousStage && (
                                    <>
                                      <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                        {activity.previousStage}
                                      </span>
                                      <ArrowRight className="h-3 w-3" style={{ color: '#6B7280' }} />
                                    </>
                                  )}
                                  <button
                                    className="hover:opacity-80 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Filter by stage
                                    }}
                                  >
                                    <Badge
                                      className="px-2 py-0.5"
                                      style={{
                                        backgroundColor: activity.status === 'won' ? '#28A74515' : activity.status === 'lost' ? '#6B728015' : '#E5E7EB',
                                        color: activity.status === 'won' ? '#28A745' : activity.status === 'lost' ? '#6B7280' : '#374151',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        fontFamily: 'Inter, sans-serif'
                                      }}
                                    >
                                      {activity.stage}
                                    </Badge>
                                  </button>
                                </>
                              )}
                            </div>
                          )}

                          {/* Agent Action Content */}
                          {activity.isAgent && activity.agentAction && (
                            <div className="mb-3">
                              {activity.agentAction.consequence && (
                                <p style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px', lineHeight: 1.5 }}>
                                  {activity.agentAction.consequence}
                                </p>
                              )}
                              {activity.agentAction.ctaButtons && activity.agentAction.ctaButtons.length > 0 && (
                                <div className="flex items-center gap-2">
                                  {activity.agentAction.ctaButtons.map((button, idx) => (
                                    <Button
                                      key={idx}
                                      size="sm"
                                      variant={button.variant === 'secondary' ? 'outline' : 'default'}
                                      className="text-xs"
                                      style={
                                        button.variant === 'primary'
                                          ? {
                                              backgroundColor: '#005B94',
                                              color: '#FFFFFF',
                                              fontSize: '13px',
                                              fontWeight: 500,
                                              fontFamily: 'Inter, sans-serif',
                                            }
                                          : {
                                              fontSize: '13px',
                                              fontWeight: 500,
                                              fontFamily: 'Inter, sans-serif',
                                              color: '#374151',
                                              borderColor: '#E5E7EB',
                                            }
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle CTA action
                                      }}
                                    >
                                      {button.label}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Always Show Details */}
                          {activity.details && (
                            <div 
                              className="mb-3 p-3 rounded-lg" 
                              style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {activity.details.taskName && (
                                <div className="space-y-1">
                                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                    Task: {activity.details.taskName}
                                  </div>
                                  {activity.details.dueDate && (
                                    <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                      Due: {activity.details.dueDate}
                                    </div>
                                  )}
                                  {activity.details.assignedTo && (
                                    <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                      Assigned to: {activity.details.assignedTo}
                                    </div>
                                  )}
                                </div>
                              )}
                              {activity.details.fileName && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" style={{ color: '#005B94' }} />
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                      {activity.details.fileName}
                                    </span>
                                  </div>
                                  <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                    <Download className="h-4 w-4" style={{ color: '#6B7280' }} />
                                  </button>
                                </div>
                              )}
                              {activity.details.messageContent && !activity.details.postContent && (
                                <div style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                                  "{activity.details.messageContent}"
                                </div>
                              )}
                            </div>
                          )}

                          {/* Redesigned Interaction Footer */}
                          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#E5E7EB', marginTop: '12px' }}>
                            {/* Left: Reactions & Comments */}
                            <div className="flex items-center gap-3">
                              {/* Reactions */}
                              <div className="relative">
                                <button 
                                  className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReactionPicker(showReactionPicker === activity.id ? null : activity.id);
                                  }}
                                >
                                  {activity.reactions && activity.reactions.length > 0 ? (
                                    <>
                                      <div className="flex items-center -space-x-1">
                                        {activity.reactions.map((reaction) => {
                                          const Icon = reactionIcons[reaction.type];
                                          return (
                                            <div
                                              key={reaction.type}
                                              className="w-5 h-5 rounded-full flex items-center justify-center"
                                              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
                                            >
                                              <Icon className="h-3 w-3" style={{ 
                                                color: reaction.type === 'like' ? '#005B94' : 
                                                       reaction.type === 'love' ? '#DC2626' : 
                                                       '#F97316' 
                                              }} />
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <span style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                        {totalReactions}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <ThumbsUp className="h-4 w-4" style={{ color: '#6B7280' }} />
                                      <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                        React
                                      </span>
                                    </>
                                  )}
                                </button>
                                {showReactionPicker === activity.id && (
                                  <div className="absolute bottom-full left-0 mb-2 flex gap-1.5 p-2.5 rounded-lg shadow-lg bg-white border" style={{ borderColor: '#E5E7EB', zIndex: 10 }}>
                                    {Object.entries(reactionIcons).map(([type, Icon]) => (
                                      <button
                                        key={type}
                                        className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Toggle reaction
                                          setShowReactionPicker(null);
                                        }}
                                      >
                                        <Icon className="h-5 w-5" style={{ 
                                          color: type === 'like' ? '#005B94' : 
                                                 type === 'love' ? '#DC2626' : 
                                                 '#F97316' 
                                        }} />
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Comments */}
                              <button 
                                className="flex items-center gap-1.5 hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowComments(showComments === activity.id ? null : activity.id);
                                }}
                              >
                                <MessageCircle className="h-4 w-4" style={{ color: '#6B7280' }} />
                                <span style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                  {activity.comments?.length || 0}
                                </span>
                              </button>
                            </div>

                            {/* Right: More Actions */}
                            <div className="flex items-center gap-1">
                              {/* More Actions Menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button 
                                    className="p-1.5 hover:bg-gray-50 rounded transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-4 w-4" style={{ color: '#6B7280' }} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                                  {/* Message User */}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowMessageModal({
                                        postId: activity.id,
                                        userName: activity.broker.name,
                                        userInitials: activity.broker.initials,
                                        userColor: activity.broker.color
                                      });
                                    }}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" style={{ color: '#6B7280' }} />
                                    <span style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                                      Message {activity.broker.name.split(' ')[0]}
                                    </span>
                                  </DropdownMenuItem>
                                  
                                  {/* Start Quick Sync */}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowSyncModal({
                                        postId: activity.id,
                                        dealName: activity.dealName,
                                        postAuthor: activity.broker.name
                                      });
                                    }}
                                  >
                                    <div className="relative mr-2">
                                      <MessageCircle className="h-4 w-4" style={{ color: '#6B7280' }} />
                                      <Zap className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5" style={{ color: '#FFA500' }} />
                                    </div>
                                    <span style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                                      Start Quick Sync
                                    </span>
                                    {activeSyncs.filter(s => s.postId === activity.id).length > 0 && (
                                      <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full" style={{ backgroundColor: '#005B94', color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
                                        {activeSyncs.filter(s => s.postId === activity.id).length}
                                      </span>
                                    )}
                                  </DropdownMenuItem>
                                  
                                  {/* Follow Updates */}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newFollowed = new Set(followedPosts);
                                      if (newFollowed.has(activity.id)) {
                                        newFollowed.delete(activity.id);
                                      } else {
                                        newFollowed.add(activity.id);
                                      }
                                      setFollowedPosts(newFollowed);
                                    }}
                                  >
                                    <Bell 
                                      className="h-4 w-4 mr-2" 
                                      style={{ 
                                        color: followedPosts.has(activity.id) ? '#005B94' : '#6B7280',
                                        fill: followedPosts.has(activity.id) ? '#005B94' : 'none'
                                      }} 
                                    />
                                    <span style={{ 
                                      fontSize: '14px', 
                                      fontFamily: 'Inter, sans-serif',
                                      fontWeight: followedPosts.has(activity.id) ? 600 : 400,
                                      color: followedPosts.has(activity.id) ? '#005B94' : '#374151'
                                    }}>
                                      {followedPosts.has(activity.id) ? 'Following updates' : 'Follow updates'}
                                    </span>
                                  </DropdownMenuItem>
                                  
                                  {/* Pin Post - moved from separate button */}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newPinned = new Set(pinnedPosts);
                                      if (newPinned.has(activity.id)) {
                                        newPinned.delete(activity.id);
                                      } else {
                                        newPinned.add(activity.id);
                                      }
                                      setPinnedPosts(newPinned);
                                    }}
                                  >
                                    <Pin 
                                      className="h-4 w-4 mr-2" 
                                      style={{ 
                                        color: pinnedPosts.has(activity.id) ? '#005B94' : '#6B7280',
                                        fill: pinnedPosts.has(activity.id) ? '#005B94' : 'none'
                                      }} 
                                    />
                                    <span style={{ 
                                      fontSize: '14px', 
                                      fontFamily: 'Inter, sans-serif',
                                      fontWeight: pinnedPosts.has(activity.id) ? 600 : 400,
                                      color: pinnedPosts.has(activity.id) ? '#005B94' : '#374151'
                                    }}>
                                      {pinnedPosts.has(activity.id) ? 'Unpin post' : 'Pin post'}
                                    </span>
                                  </DropdownMenuItem>
                                  
                                  {/* Copy Link */}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Copy link to clipboard
                                      const postUrl = `${window.location.origin}/broker-flow/deals/feed/${activity.id}`;
                                      navigator.clipboard.writeText(postUrl).then(() => {
                                        setShowCopyConfirmation(activity.id);
                                        setTimeout(() => setShowCopyConfirmation(null), 2000);
                                      });
                                    }}
                                  >
                                    <Copy className="h-4 w-4 mr-2" style={{ color: '#6B7280' }} />
                                    <span style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                                      {showCopyConfirmation === activity.id ? 'Link copied!' : 'Copy link to post'}
                                    </span>
                                  </DropdownMenuItem>
                                  
                                  {/* Link to License ID */}
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLicenseIdInput(postLicenseIds.get(activity.id) || '');
                                      setShowLicenseIdModal(activity.id);
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" style={{ color: '#6B7280' }} />
                                    <span style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                                      {postLicenseIds.has(activity.id) ? 'Edit License ID' : 'Link to License ID'}
                                    </span>
                                  </DropdownMenuItem>
                                  
                                  {/* Remove Post - only if user is author (Marcus Johnson) */}
                                  {activity.broker.name === 'Marcus Johnson' && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (confirm('Are you sure you want to remove this post? This action cannot be undone.')) {
                                            // Handle post removal
                                            console.log('Removing post:', activity.id);
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" style={{ color: '#DC2626' }} />
                                        <span style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#DC2626' }}>
                                          Remove post
                                        </span>
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Comments Section */}
                          {isShowingComments && (
                            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                              <div className="space-y-3 mb-3">
                                {activity.comments?.map((comment) => (
                                  <div key={comment.id} className="flex gap-2">
                                    <Avatar className="h-7 w-7 flex-shrink-0">
                                      <AvatarFallback
                                        style={{
                                          backgroundColor: comment.author.color,
                                          color: '#FFFFFF',
                                          fontSize: '10px',
                                          fontWeight: 600,
                                          fontFamily: 'Inter, sans-serif'
                                        }}
                                      >
                                        {comment.author.initials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                          {comment.author.name}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                          {comment.timestamp}
                                        </span>
                                      </div>
                                      <p style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                                        {comment.mentions && comment.mentions.map((mention) => (
                                          <span key={mention} style={{ color: '#005B94', fontWeight: 500 }}>
                                            @{mention}{' '}
                                          </span>
                                        ))}
                                        {comment.content.replace(/@\w+\s+\w+\s*/g, '')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Avatar className="h-7 w-7 flex-shrink-0">
                                  <AvatarFallback
                                    style={{
                                      backgroundColor: '#005B94',
                                      color: '#FFFFFF',
                                      fontSize: '10px',
                                      fontWeight: 600,
                                      fontFamily: 'Inter, sans-serif'
                                    }}
                                  >
                                    You
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex gap-2">
                                  <Input
                                    placeholder="Write a comment... Use @ to mention teammates"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && commentText.trim()) {
                                        // Handle comment post
                                        setCommentText('');
                                      }
                                    }}
                                    style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                                  />
                                  <Button
                                    size="sm"
                                    disabled={!commentText.trim()}
                                    style={{
                                      backgroundColor: '#005B94',
                                      color: '#FFFFFF',
                                      fontSize: '13px',
                                      fontFamily: 'Inter, sans-serif'
                                    }}
                                  >
                                    <Send className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Inline Sync Thread */}
                          {(showSyncThread === activity.id || (syncMessages.get(activity.id) && syncMessages.get(activity.id)!.length > 0 && !resolvedSyncs.has(activity.id))) && (
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                              <div className="space-y-3">
                                {/* Thread Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4" style={{ color: '#005B94' }} />
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                      Sync Thread
                                    </span>
                                    {syncMessages.get(activity.id) && syncMessages.get(activity.id)!.length > 0 && (
                                      <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                        ({syncMessages.get(activity.id)!.length} {syncMessages.get(activity.id)!.length === 1 ? 'message' : 'messages'})
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {syncMessages.get(activity.id) && syncMessages.get(activity.id)!.length > 0 && (
                                      <button
                                        className="px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const newResolved = new Set(resolvedSyncs);
                                          newResolved.add(activity.id);
                                          setResolvedSyncs(newResolved);
                                          setShowSyncThread(null);
                                        }}
                                      >
                                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                                          Mark as Synced
                                        </span>
                                      </button>
                                    )}
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSyncThread(null);
                                      }}
                                    >
                                      <X className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </div>
                                </div>

                                {/* Existing Sync Messages */}
                                {syncMessages.get(activity.id) && syncMessages.get(activity.id)!.length > 0 && (
                                  <div className="space-y-2.5">
                                    {syncMessages.get(activity.id)!.map((msg) => (
                                      <div key={msg.id} className="flex gap-2">
                                        <Avatar className="h-7 w-7 flex-shrink-0">
                                          <AvatarFallback
                                            style={{
                                              backgroundColor: msg.author.color,
                                              color: '#FFFFFF',
                                              fontSize: '10px',
                                              fontWeight: 600,
                                              fontFamily: 'Inter, sans-serif'
                                            }}
                                          >
                                            {msg.author.initials}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                              {msg.author.name}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                              {msg.timestamp}
                                            </span>
                                          </div>
                                          <p style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                            {msg.mentions && msg.mentions.map((mention) => (
                                              <span key={mention} style={{ color: '#005B94', fontWeight: 500 }}>
                                                @{mention}{' '}
                                              </span>
                                            ))}
                                            {msg.message}
                                          </p>
                                        </div>
                                        {msg.author.name === 'Marcus Johnson' && (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-opacity">
                                                <MoreHorizontal className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                                              </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                              <DropdownMenuItem>
                                                <Edit2 className="h-3.5 w-3.5 mr-2" style={{ color: '#6B7280' }} />
                                                <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>Edit</span>
                                              </DropdownMenuItem>
                                              <DropdownMenuItem>
                                                <Trash2 className="h-3.5 w-3.5 mr-2" style={{ color: '#DC2626' }} />
                                                <span style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#DC2626' }}>Delete</span>
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Message Input */}
                                {showSyncThread === activity.id && (
                                  <div className="space-y-2">
                                    <div className="flex gap-2">
                                      <Avatar className="h-7 w-7 flex-shrink-0">
                                        <AvatarFallback
                                          style={{
                                            backgroundColor: '#005B94',
                                            color: '#FFFFFF',
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            fontFamily: 'Inter, sans-serif'
                                          }}
                                        >
                                          You
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <Input
                                          placeholder="Quick sync message... Use @ to mention teammates"
                                          value={syncMessageInput}
                                          onChange={(e) => setSyncMessageInput(e.target.value)}
                                          onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey && syncMessageInput.trim()) {
                                              e.preventDefault();
                                              // Add message to sync thread
                                              const newMessage = {
                                                id: Date.now().toString(),
                                                author: {
                                                  name: 'Marcus Johnson',
                                                  initials: 'MJ',
                                                  color: '#005B94'
                                                },
                                                message: syncMessageInput,
                                                timestamp: 'Just now',
                                                mentions: syncMessageInput.match(/@(\w+\s\w+)/g)?.map(m => m.slice(1))
                                              };
                                              
                                              const newSyncMessages = new Map(syncMessages);
                                              const existingMessages = newSyncMessages.get(activity.id) || [];
                                              newSyncMessages.set(activity.id, [...existingMessages, newMessage]);
                                              setSyncMessages(newSyncMessages);
                                              setSyncMessageInput('');
                                            }
                                          }}
                                          style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}
                                          autoFocus
                                        />
                                      </div>
                                      <Button
                                        size="sm"
                                        disabled={!syncMessageInput.trim()}
                                        onClick={() => {
                                          if (syncMessageInput.trim()) {
                                            // Add message to sync thread
                                            const newMessage = {
                                              id: Date.now().toString(),
                                              author: {
                                                name: 'Marcus Johnson',
                                                initials: 'MJ',
                                                color: '#005B94'
                                              },
                                              message: syncMessageInput,
                                              timestamp: 'Just now',
                                              mentions: syncMessageInput.match(/@(\w+\s\w+)/g)?.map(m => m.slice(1))
                                            };
                                            
                                            const newSyncMessages = new Map(syncMessages);
                                            const existingMessages = newSyncMessages.get(activity.id) || [];
                                            newSyncMessages.set(activity.id, [...existingMessages, newMessage]);
                                            setSyncMessages(newSyncMessages);
                                            setSyncMessageInput('');
                                          }
                                        }}
                                        style={{
                                          backgroundColor: '#005B94',
                                          color: '#FFFFFF',
                                          fontSize: '13px',
                                          fontFamily: 'Inter, sans-serif'
                                        }}
                                      >
                                        <Send className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    
                                    {/* Optional Escalation Buttons */}
                                    <div className="flex items-center gap-2 pl-9">
                                      <button
                                        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Mock Slack integration
                                          alert('Slack integration: This would open a Slack share modal with the sync message and post link.');
                                        }}
                                      >
                                        <MessageSquare className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                                        <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                          Send via Slack
                                        </span>
                                      </button>
                                      <button
                                        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Mock Calendar integration
                                          alert('Calendar integration: This would open a modal to create a short meeting with selected teammates.');
                                        }}
                                      >
                                        <Calendar className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                                        <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                          Schedule via Calendar
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4">
            {/* Today's Stats */}
            <Card className="bg-white border mb-4" style={{ borderColor: '#E5E7EB' }}>
              <CardContent className="p-4">
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  Today's Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      Total Updates
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                      14
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      Deals Moved
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                      3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      Tasks Completed
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#28A745', fontFamily: 'Inter, sans-serif' }}>
                      7
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      New Messages
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#FFA500', fontFamily: 'Inter, sans-serif' }}>
                      5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Deals */}
            <Card className="bg-white border mb-4" style={{ borderColor: '#E5E7EB' }}>
              <CardContent className="p-4">
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  Trending Transactions
                </h3>
                <div className="space-y-2">
                  {/* Tel Tech NYC Expansion */}
                  <div 
                    className="relative group"
                    onMouseEnter={() => setHoveredDeal('tel-tech')}
                    onMouseLeave={() => setHoveredDeal(null)}
                  >
                    <div
                      className="w-full p-3 rounded-lg transition-all cursor-pointer"
                      style={{ 
                        backgroundColor: hoveredDeal === 'tel-tech' ? '#FFFFFF' : '#F8F9FA',
                        border: '1px solid',
                        borderColor: hoveredDeal === 'tel-tech' ? '#E5E7EB' : 'transparent',
                        boxShadow: hoveredDeal === 'tel-tech' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                      }}
                      onClick={() => {
                        setSelectedDealSidebar('tel-tech');
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                            Tel Tech NYC Expansion
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 flex-shrink-0" style={{ color: '#28A745' }} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDealSidebar('tel-tech');
                                }}
                                style={{ fontSize: '13px' }}
                              >
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                View full deal
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <ArrowRight className="h-3.5 w-3.5 mr-2" />
                                Jump to workflow
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <MessageSquare className="h-3.5 w-3.5 mr-2" />
                                Message broker
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <Plus className="h-3.5 w-3.5 mr-2" />
                                Add note
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <p style={{ fontSize: '11px', color: '#374151', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Next: Send revised proposal
                        </p>
                        <Badge 
                          className="text-xs px-1.5 py-0"
                          style={{ 
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            fontSize: '10px',
                            fontWeight: 600
                          }}
                        >
                          Due Today
                        </Badge>
                      </div>
                      <button
                        className="hover:underline"
                        style={{ fontSize: '12px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilterByDeal('Tel Tech NYC Expansion');
                          setActiveFilter('all');
                        }}
                      >
                        8 updates today →
                      </button>
                    </div>
                  </div>

                  {/* MediaCo Chicago Office */}
                  <div 
                    className="relative group"
                    onMouseEnter={() => setHoveredDeal('mediaco')}
                    onMouseLeave={() => setHoveredDeal(null)}
                  >
                    <div
                      className="w-full p-3 rounded-lg transition-all cursor-pointer"
                      style={{ 
                        backgroundColor: hoveredDeal === 'mediaco' ? '#FFFFFF' : '#F8F9FA',
                        border: '1px solid',
                        borderColor: hoveredDeal === 'mediaco' ? '#E5E7EB' : 'transparent',
                        boxShadow: hoveredDeal === 'mediaco' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                      }}
                      onClick={() => {
                        setSelectedDealSidebar('mediaco');
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                            MediaCo Chicago Office
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 flex-shrink-0" style={{ color: '#28A745' }} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDealSidebar('mediaco');
                                }}
                                style={{ fontSize: '13px' }}
                              >
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                View full deal
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <ArrowRight className="h-3.5 w-3.5 mr-2" />
                                Jump to workflow
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <MessageSquare className="h-3.5 w-3.5 mr-2" />
                                Message broker
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <Plus className="h-3.5 w-3.5 mr-2" />
                                Add note
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <p style={{ fontSize: '11px', color: '#374151', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Next: Tour scheduled Tue 2pm
                        </p>
                        <Badge 
                          className="text-xs px-1.5 py-0"
                          style={{ 
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF',
                            fontSize: '10px',
                            fontWeight: 600
                          }}
                        >
                          Tomorrow
                        </Badge>
                      </div>
                      <button
                        className="hover:underline"
                        style={{ fontSize: '12px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilterByDeal('MediaCo Chicago Office');
                          setActiveFilter('all');
                        }}
                      >
                        5 updates today →
                      </button>
                    </div>
                  </div>

                  {/* FinServe Seattle HQ */}
                  <div 
                    className="relative group"
                    onMouseEnter={() => setHoveredDeal('finserve')}
                    onMouseLeave={() => setHoveredDeal(null)}
                  >
                    <div
                      className="w-full p-3 rounded-lg transition-all cursor-pointer"
                      style={{ 
                        backgroundColor: hoveredDeal === 'finserve' ? '#FFFFFF' : '#F8F9FA',
                        border: '1px solid',
                        borderColor: hoveredDeal === 'finserve' ? '#E5E7EB' : 'transparent',
                        boxShadow: hoveredDeal === 'finserve' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
                      }}
                      onClick={() => {
                        setSelectedDealSidebar('finserve');
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                            FinServe Seattle HQ
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowRightCircle className="h-4 w-4 flex-shrink-0" style={{ color: '#FFA500' }} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDealSidebar('finserve');
                                }}
                                style={{ fontSize: '13px' }}
                              >
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                View full deal
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <ArrowRight className="h-3.5 w-3.5 mr-2" />
                                Jump to workflow
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <MessageSquare className="h-3.5 w-3.5 mr-2" />
                                Message broker
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '13px' }}
                              >
                                <Plus className="h-3.5 w-3.5 mr-2" />
                                Add note
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <p style={{ fontSize: '11px', color: '#374151', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Next: Follow up on terms
                        </p>
                        <Badge 
                          className="text-xs px-1.5 py-0"
                          style={{ 
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            fontSize: '10px',
                            fontWeight: 600
                          }}
                        >
                          Overdue
                        </Badge>
                      </div>
                      <button
                        className="hover:underline"
                        style={{ fontSize: '12px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilterByDeal('FinServe Seattle HQ');
                          setActiveFilter('all');
                        }}
                      >
                        3 updates today →
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Views */}
            <Card className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
                    Saved Views
                  </h3>
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all"
                    style={{ 
                      backgroundColor: '#005B94',
                      color: '#FFFFFF'
                    }}
                    onClick={() => {
                      setIsNewViewModalOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      New View
                    </span>
                  </button>
                </div>
                <TooltipProvider>
                  <div className="space-y-1.5">
                    {/* My Team View */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="relative group"
                          onMouseEnter={() => setHoveredView('my-team')}
                          onMouseLeave={() => setHoveredView(null)}
                        >
                          <div 
                            className="w-full rounded-md transition-all cursor-pointer"
                            style={{ 
                              padding: '10px 12px',
                              backgroundColor: activeFilter === 'my-team' ? '#E0F2FE' : (hoveredView === 'my-team' ? '#F8F9FA' : 'transparent'),
                              border: '1px solid',
                              borderColor: activeFilter === 'my-team' ? '#0369A1' : (hoveredView === 'my-team' ? '#E5E7EB' : 'transparent')
                            }}
                            onClick={() => {
                              setActiveFilter('my-team');
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="flex items-center justify-center rounded"
                                  style={{ 
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#E0F2FE',
                                    color: '#0369A1'
                                  }}
                                >
                                  <Users className="h-3 w-3" />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                  My Team
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShareView('my-team');
                                      }}
                                    >
                                      <Share2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Share</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditView('my-team');
                                      }}
                                    >
                                      <Edit2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Edit</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteView('my-team');
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" style={{ color: '#DC2626' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Delete</span>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.3', marginLeft: '28px' }}>
                              4 team members
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                          <p style={{ fontWeight: 600, marginBottom: '4px', color: '#FFFFFF' }}>Active Filters:</p>
                          <ul style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                            <li>• Team: Sarah Chen, Marcus Johnson, Jessica Martinez, David Park</li>
                            <li>• Status: All active deals</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Only My Deals View */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="relative group"
                          onMouseEnter={() => setHoveredView('my-deals')}
                          onMouseLeave={() => setHoveredView(null)}
                        >
                          <div 
                            className="w-full rounded-md transition-all cursor-pointer"
                            style={{ 
                              padding: '10px 12px',
                              backgroundColor: activeFilter === 'my-deals' ? '#F3E8FF' : (hoveredView === 'my-deals' ? '#F8F9FA' : 'transparent'),
                              border: '1px solid',
                              borderColor: activeFilter === 'my-deals' ? '#7C3AED' : (hoveredView === 'my-deals' ? '#E5E7EB' : 'transparent')
                            }}
                            onClick={() => {
                              setActiveFilter('my-deals');
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="flex items-center justify-center rounded"
                                  style={{ 
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#F3E8FF',
                                    color: '#7C3AED'
                                  }}
                                >
                                  <User className="h-3 w-3" />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                  Only My Deals
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShareView('my-deals');
                                      }}
                                    >
                                      <Share2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Share</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditView('my-deals');
                                      }}
                                    >
                                      <Edit2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Edit</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteView('my-deals');
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" style={{ color: '#DC2626' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Delete</span>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.3', marginLeft: '28px' }}>
                              Personal assignments
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                          <p style={{ fontWeight: 600, marginBottom: '4px', color: '#FFFFFF' }}>Active Filters:</p>
                          <ul style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                            <li>• Assignee: You only</li>
                            <li>• Status: Active, Negotiating, Proposal</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* AI Suggestions View */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="relative group"
                          onMouseEnter={() => setHoveredView('ai-suggestions')}
                          onMouseLeave={() => setHoveredView(null)}
                        >
                          <div 
                            className="w-full rounded-md transition-all cursor-pointer"
                            style={{ 
                              padding: '10px 12px',
                              backgroundColor: activeFilter === 'ai-suggestions' ? '#FEF3C7' : (hoveredView === 'ai-suggestions' ? '#F8F9FA' : 'transparent'),
                              border: '1px solid',
                              borderColor: activeFilter === 'ai-suggestions' ? '#D97706' : (hoveredView === 'ai-suggestions' ? '#E5E7EB' : 'transparent')
                            }}
                            onClick={() => {
                              setActiveFilter('ai-suggestions');
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="flex items-center justify-center rounded"
                                  style={{ 
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#FEF3C7',
                                    color: '#D97706'
                                  }}
                                >
                                  <Bot className="h-3 w-3" />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                  AI Suggestions
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShareView('ai-suggestions');
                                      }}
                                    >
                                      <Share2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Share</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditView('ai-suggestions');
                                      }}
                                    >
                                      <Edit2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Edit</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteView('ai-suggestions');
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" style={{ color: '#DC2626' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Delete</span>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.3', marginLeft: '28px' }}>
                              8 flagged actions
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                          <p style={{ fontWeight: 600, marginBottom: '4px', color: '#FFFFFF' }}>Active Filters:</p>
                          <ul style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                            <li>• AI Priority: High urgency follow-ups</li>
                            <li>• Criteria: Overdue replies, stalled deals</li>
                            <li>• Smart reminders enabled</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Closed Deals View */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="relative group"
                          onMouseEnter={() => setHoveredView('closed-deals')}
                          onMouseLeave={() => setHoveredView(null)}
                        >
                          <div 
                            className="w-full rounded-md transition-all cursor-pointer"
                            style={{ 
                              padding: '10px 12px',
                              backgroundColor: activeFilter === 'closed-deals' ? '#DBEAFE' : (hoveredView === 'closed-deals' ? '#F8F9FA' : 'transparent'),
                              border: '1px solid',
                              borderColor: activeFilter === 'closed-deals' ? '#1E40AF' : (hoveredView === 'closed-deals' ? '#E5E7EB' : 'transparent')
                            }}
                            onClick={() => {
                              setActiveFilter('closed-deals');
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="flex items-center justify-center rounded"
                                  style={{ 
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#DBEAFE',
                                    color: '#1E40AF'
                                  }}
                                >
                                  <Clock className="h-3 w-3" />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                  Closed Deals (30d)
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShareView('closed-deals');
                                      }}
                                    >
                                      <Share2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Share</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditView('closed-deals');
                                      }}
                                    >
                                      <Edit2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Edit</span>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-gray-100 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteView('closed-deals');
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" style={{ color: '#DC2626' }} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Delete</span>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.3', marginLeft: '28px' }}>
                              Won & lost (last 30d)
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                          <p style={{ fontWeight: 600, marginBottom: '4px', color: '#FFFFFF' }}>Active Filters:</p>
                          <ul style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                            <li>• Status: Won, Lost</li>
                            <li>• Date Range: Last 30 days</li>
                            <li>• All team members</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Pinned Posts */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="relative group"
                          onMouseEnter={() => setHoveredView('pinned-posts')}
                          onMouseLeave={() => setHoveredView(null)}
                        >
                          <div 
                            className="w-full rounded-md transition-all cursor-pointer"
                            style={{ 
                              padding: '10px 12px',
                              backgroundColor: activeFilter === 'pinned-posts' ? '#FEF3C7' : (hoveredView === 'pinned-posts' ? '#F8F9FA' : 'transparent'),
                              border: '1px solid',
                              borderColor: activeFilter === 'pinned-posts' ? '#F59E0B' : (hoveredView === 'pinned-posts' ? '#E5E7EB' : 'transparent')
                            }}
                            onClick={() => {
                              setActiveFilter('pinned-posts');
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="flex items-center justify-center rounded"
                                  style={{ 
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#FEF3C7',
                                    color: '#F59E0B'
                                  }}
                                >
                                  <Pin className="h-3 w-3" />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                  Pinned Posts
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Share2 className="h-3 w-3" style={{ color: '#6B7280' }} />
                                </button>
                                <button
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" style={{ color: '#6B7280' }} />
                                </button>
                                <button
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" style={{ color: '#DC2626' }} />
                                </button>
                              </div>
                            </div>
                            <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.3', marginLeft: '28px' }}>
                              Posts manually pinned by you
                            </p>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                          <p style={{ fontWeight: 600, marginBottom: '4px', color: '#FFFFFF' }}>Active Filters:</p>
                          <ul style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                            <li>• Only pinned posts</li>
                            <li>• All dates</li>
                            <li>• Manually curated by you</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Custom Views */}
                    {customViews.filter(view => view.pinned).map((view) => (
                      <Tooltip key={view.id}>
                        <TooltipTrigger asChild>
                          <div
                            className="relative group"
                            onMouseEnter={() => setHoveredView(view.id)}
                            onMouseLeave={() => setHoveredView(null)}
                          >
                            <div 
                              className="w-full rounded-md transition-all cursor-pointer"
                              style={{ 
                                padding: '10px 12px',
                                backgroundColor: hoveredView === view.id ? '#F8F9FA' : 'transparent',
                                border: '1px solid',
                                borderColor: hoveredView === view.id ? '#E5E7EB' : 'transparent'
                              }}
                              onClick={() => {
                                // Apply custom view filters
                                console.log('Apply custom view:', view);
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="flex items-center justify-center rounded"
                                    style={{ 
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: '#E0F2FE',
                                      color: '#0369A1'
                                    }}
                                  >
                                    <Filter className="h-3 w-3" />
                                  </div>
                                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                    {view.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleShareView(view.id);
                                        }}
                                      >
                                        <Share2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Share</span>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditView(view.id);
                                        }}
                                      >
                                        <Edit2 className="h-4 w-4" style={{ color: '#6B7280' }} />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Edit</span>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        className="p-1 hover:bg-gray-100 rounded"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteView(view.id);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" style={{ color: '#DC2626' }} />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Delete</span>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                              <p style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.3', marginLeft: '28px' }}>
                                Custom filtered view
                              </p>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <div style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                            <p style={{ fontWeight: 600, marginBottom: '4px', color: '#FFFFFF' }}>Active Filters:</p>
                            <ul style={{ color: '#E5E7EB', lineHeight: '1.5' }}>
                              {view.filters.activityType !== 'all' && <li>• Activity: {view.filters.activityType}</li>}
                              {view.filters.broker !== 'all' && <li>• Broker: {view.filters.broker}</li>}
                              {view.filters.client !== 'all' && <li>• Client: {view.filters.client}</li>}
                              {view.filters.stage !== 'all' && <li>• Stage: {view.filters.stage}</li>}
                              {view.filters.keywords && <li>• Keywords: {view.filters.keywords}</li>}
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Sync Center */}
            <SyncCenter
              activeSyncs={activeSyncs}
              pastSyncs={pastSyncs}
              syncFilter={syncFilter}
              expandedSyncId={expandedSyncId}
              setSyncFilter={setSyncFilter}
              setExpandedSyncId={setExpandedSyncId}
              setShowSyncModal={setShowSyncModal}
              setActiveSyncs={setActiveSyncs}
              setPastSyncs={setPastSyncs}
            />
          </div>
        </div>
      </div>

      {/* Deal Sidebar */}
      <Sheet open={!!selectedDealSidebar} onOpenChange={(open) => !open && setSelectedDealSidebar(null)}>
        <SheetContent className="w-[480px] p-0 overflow-y-auto" style={{ maxWidth: '90vw' }}>
          {selectedDealSidebar && (
            <>
              <SheetHeader className="px-6 py-5 border-b" style={{ borderColor: '#E5E7EB' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <SheetTitle style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                      Tel Tech NYC Expansion
                    </SheetTitle>
                    <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      Tel Tech
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDealSidebar(null)}
                    className="h-8 w-8 p-0 -mt-1 -mr-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>

              <div className="p-6 space-y-6">
                {/* Deal Overview */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Deal Overview
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                      <div className="flex-1">
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Location</div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>New York, NY</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                      <div className="flex-1">
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Workspace Type</div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Private Office • 15 seats</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                      <div className="flex-1">
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Current Stage</div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Negotiation</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                      <div className="flex-1">
                        <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Estimated Value</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>$760,000</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Urgent Task */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4" style={{ color: '#F97316' }} />
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Most Urgent Task
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '10px', lineHeight: '1.4' }}>
                    Send proposal document
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                      <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        Due: November 13, 2025
                      </span>
                    </div>
                    <Badge style={{ backgroundColor: '#005B94', color: 'white', fontSize: '11px', fontWeight: 500, padding: '2px 8px', border: 'none' }}>
                      In Progress
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                    <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      Assigned to: Sarah Chen
                    </span>
                  </div>
                  <Button
                    className="w-full h-9"
                    style={{ 
                      backgroundColor: '#28A745', 
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>

                {/* Quick Actions */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Quick Actions
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-gray-300 h-10 hover:bg-gray-50"
                      style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                    >
                      <span>Advance to Next Stage</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-gray-300 h-10 hover:bg-gray-50"
                      style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                    >
                      <span>Reassign Broker</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-gray-300 h-10 hover:bg-gray-50"
                      style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#005B94' }}
                    >
                      <span>View Full Deal Details</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Sync Modal */}
      <Dialog open={!!showSyncModal} onOpenChange={(open) => !open && setShowSyncModal(null)}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
            <DialogTitle className="text-white" style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
              Start New Sync
            </DialogTitle>
            <DialogDescription className="text-white/90" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              Coordinate quick decisions with your team
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div>
              <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Sync Title *
              </Label>
              <Input
                value={syncTitle}
                onChange={(e) => setSyncTitle(e.target.value)}
                placeholder="e.g., Finalize Q4 lease terms"
                className="mt-1 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Message
              </Label>
              <Textarea
                value={syncMessage}
                onChange={(e) => setSyncMessage(e.target.value)}
                placeholder="What needs to be discussed or decided?"
                className="mt-1 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                rows={4}
              />
            </div>

            <div>
              <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Participants
              </Label>
              <Select onValueChange={(value) => {
                if (!syncParticipants.includes(value)) {
                  setSyncParticipants([...syncParticipants, value]);
                }
              }}>
                <SelectTrigger className="mt-1 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Add team members..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                  <SelectItem value="Marcus Johnson">Marcus Johnson</SelectItem>
                  <SelectItem value="Jennifer Lee">Jennifer Lee</SelectItem>
                  <SelectItem value="Tom Anderson">Tom Anderson</SelectItem>
                </SelectContent>
              </Select>
              {syncParticipants.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {syncParticipants.map((participant, idx) => (
                    <Badge key={idx} className="bg-gray-100 text-gray-700" style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
                      {participant}
                      <button
                        onClick={() => setSyncParticipants(syncParticipants.filter((_, i) => i !== idx))}
                        className="ml-1 hover:text-gray-900"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Suggested Meeting Time (Optional)
              </Label>
              <Input
                type="datetime-local"
                value={syncSuggestedTime}
                onChange={(e) => setSyncSuggestedTime(e.target.value)}
                className="mt-1 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-6 border-t" style={{ borderColor: '#E5E7EB' }}>
            <Button
              variant="outline"
              onClick={() => setShowSyncModal(null)}
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (syncTitle && syncParticipants.length > 0) {
                  const newSync = {
                    id: `sync-${Date.now()}`,
                    title: syncTitle,
                    participants: syncParticipants,
                    dealName: showSyncModal?.dealName,
                    postId: showSyncModal?.postId || 'new',
                    lastActivity: 'Just now',
                    unreadCount: 0,
                    messages: syncMessage ? [
                      { author: 'You', content: syncMessage, timestamp: 'Just now' }
                    ] : []
                  };
                  setActiveSyncs([newSync, ...activeSyncs]);
                  setShowSyncModal(null);
                  setSyncTitle('');
                  setSyncMessage('');
                  setSyncParticipants([]);
                  setSyncSuggestedTime('');
                }
              }}
              disabled={!syncTitle || syncParticipants.length === 0}
              className="text-white"
              style={{ 
                backgroundColor: '#005B94',
                fontSize: '14px', 
                fontWeight: 500, 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              Start Sync
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={!!showMessageModal} onOpenChange={(open) => !open && setShowMessageModal(null)}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
            <DialogTitle className="text-white flex items-center gap-2" style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
              <Avatar className="h-8 w-8">
                <AvatarFallback style={{ backgroundColor: showMessageModal?.userColor || '#005B94', color: 'white', fontSize: '12px', fontWeight: 600 }}>
                  {showMessageModal?.userInitials}
                </AvatarFallback>
              </Avatar>
              Message {showMessageModal?.userName}
            </DialogTitle>
            <DialogDescription className="text-white/90" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              Send a direct message
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            <Textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message..."
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              rows={6}
            />
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-6 border-t" style={{ borderColor: '#E5E7EB' }}>
            <Button
              variant="outline"
              onClick={() => setShowMessageModal(null)}
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log('Sending message:', messageContent);
                setShowMessageModal(null);
                setMessageContent('');
              }}
              disabled={!messageContent}
              className="text-white"
              style={{ 
                backgroundColor: '#005B94',
                fontSize: '14px', 
                fontWeight: 500, 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New View Modal */}
      <Dialog open={isNewViewModalOpen} onOpenChange={setIsNewViewModalOpen}>
        <DialogContent className="max-w-xl p-0">
          <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
            <DialogTitle className="text-white" style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
              Create New View
            </DialogTitle>
            <DialogDescription className="text-white/90" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              Save custom filters for quick access
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div>
              <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                View Name *
              </Label>
              <Input
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="e.g., High Priority Deals"
                className="mt-1 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Activity Type
                </Label>
                <Select value={newViewActivityType} onValueChange={setNewViewActivityType}>
                  <SelectTrigger className="mt-1 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="deal_updates">Deal Updates</SelectItem>
                    <SelectItem value="broker_posts">Broker Posts</SelectItem>
                    <SelectItem value="ai_suggestions">AI Suggestions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Broker
                </Label>
                <Select value={newViewBroker} onValueChange={setNewViewBroker}>
                  <SelectTrigger className="mt-1 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brokers</SelectItem>
                    <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                    <SelectItem value="Marcus Johnson">Marcus Johnson</SelectItem>
                    <SelectItem value="Jennifer Lee">Jennifer Lee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Client
                </Label>
                <Select value={newViewClient} onValueChange={setNewViewClient}>
                  <SelectTrigger className="mt-1 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="Tel Tech">Tel Tech</SelectItem>
                    <SelectItem value="MediaCo">MediaCo</SelectItem>
                    <SelectItem value="StartupX">StartupX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Stage
                </Label>
                <Select value={newViewStage} onValueChange={setNewViewStage}>
                  <SelectTrigger className="mt-1 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Prospecting">Prospecting</SelectItem>
                    <SelectItem value="Tour">Tour</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Contracting">Contracting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Keywords (Optional)
              </Label>
              <Input
                value={newViewKeywords}
                onChange={(e) => setNewViewKeywords(e.target.value)}
                placeholder="Enter keywords to filter by..."
                className="mt-1 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newViewPinToSidebar}
                onChange={(e) => setNewViewPinToSidebar(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Pin to Saved Views
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 pb-6 border-t" style={{ borderColor: '#E5E7EB' }}>
            <Button
              variant="outline"
              onClick={() => {
                setIsNewViewModalOpen(false);
                setNewViewName('');
                setNewViewActivityType('all');
                setNewViewBroker('all');
                setNewViewClient('all');
                setNewViewStage('all');
                setNewViewKeywords('');
                setNewViewPinToSidebar(true);
              }}
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newViewName) {
                  const newView = {
                    id: `view-${Date.now()}`,
                    name: newViewName,
                    filters: {
                      activityType: newViewActivityType,
                      broker: newViewBroker,
                      client: newViewClient,
                      stage: newViewStage,
                      keywords: newViewKeywords,
                    },
                    pinned: newViewPinToSidebar,
                  };
                  setCustomViews([...customViews, newView]);
                  setIsNewViewModalOpen(false);
                  setNewViewName('');
                  setNewViewActivityType('all');
                  setNewViewBroker('all');
                  setNewViewClient('all');
                  setNewViewStage('all');
                  setNewViewKeywords('');
                  setNewViewPinToSidebar(true);
                }
              }}
              disabled={!newViewName}
              className="text-white"
              style={{ 
                backgroundColor: '#005B94',
                fontSize: '14px', 
                fontWeight: 500, 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              Create View
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
