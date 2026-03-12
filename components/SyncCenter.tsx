import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { 
  RefreshCw, 
  Plus, 
  Building2, 
  Users, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2,
  Repeat,
  AlertCircle,
  Bell,
  MessageSquare,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  ThumbsUp,
  Heart,
  Flame,
  Slack,
  FileText,
  Edit2,
  Link2,
  X
} from 'lucide-react';

interface SyncMessage {
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

interface ActiveSync {
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

interface PastSync {
  id: string;
  title: string;
  participants: string[];
  dealName?: string;
  licenseId?: string;
  postId: string;
  resolvedDate: string;
}

interface SyncCenterProps {
  activeSyncs: ActiveSync[];
  pastSyncs: PastSync[];
  syncFilter: 'all' | 'mine' | 'team';
  expandedSyncId: string | null;
  setSyncFilter: (filter: 'all' | 'mine' | 'team') => void;
  setExpandedSyncId: (id: string | null) => void;
  setShowSyncModal: (modal: { postId: string; dealName?: string; postAuthor: string } | null) => void;
  setActiveSyncs: (syncs: ActiveSync[]) => void;
  setPastSyncs: (syncs: PastSync[]) => void;
}

const reactionIcons = {
  like: ThumbsUp,
  love: Heart,
  fire: Flame,
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = ['#005B94', '#28A745', '#FFA500', '#00B8C4', '#6B7280'];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export function SyncCenter({
  activeSyncs,
  pastSyncs,
  syncFilter,
  expandedSyncId,
  setSyncFilter,
  setExpandedSyncId,
  setShowSyncModal,
  setActiveSyncs,
  setPastSyncs
}: SyncCenterProps) {
  const [showResolved, setShowResolved] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [licenseIdInputs, setLicenseIdInputs] = useState<Record<string, string>>({});
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter syncs based on selected filter
  const filteredSyncs = activeSyncs.filter(sync => {
    // Add logic for 'mine' and 'team' filters as needed
    return true;
  });

  const handleResolve = (sync: ActiveSync) => {
    setPastSyncs([
      {
        id: sync.id,
        title: sync.title,
        participants: sync.participants,
        dealName: sync.dealName,
        licenseId: sync.licenseId,
        postId: sync.postId,
        resolvedDate: 'Just now'
      },
      ...pastSyncs
    ]);
    setActiveSyncs(activeSyncs.filter(s => s.id !== sync.id));
    setExpandedSyncId(null);
  };

  const handleViewPost = (postId: string) => {
    const postElement = document.getElementById(`post-${postId}`);
    if (postElement) {
      postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSendReply = (syncId: string) => {
    const replyText = replyInputs[syncId]?.trim();
    if (!replyText) return;

    const updatedSyncs = activeSyncs.map(sync => {
      if (sync.id === syncId) {
        const newMessage: SyncMessage = {
          id: `msg-${Date.now()}`,
          author: {
            name: 'Marcus Johnson',
            initials: 'MJ',
            color: '#005B94'
          },
          content: replyText,
          timestamp: 'Just now',
          reactions: []
        };
        return {
          ...sync,
          messages: [...sync.messages, newMessage],
          lastActivity: 'Just now',
          unreadCount: 0
        };
      }
      return sync;
    });

    setActiveSyncs(updatedSyncs);
    setReplyInputs(prev => ({ ...prev, [syncId]: '' }));

    // Scroll to bottom
    setTimeout(() => {
      const scrollRef = scrollRefs.current[syncId];
      if (scrollRef) {
        scrollRef.scrollTop = scrollRef.scrollHeight;
      }
    }, 50);
  };

  const handleAddReaction = (syncId: string, messageId: string, reactionType: 'like' | 'love' | 'fire') => {
    const updatedSyncs = activeSyncs.map(sync => {
      if (sync.id === syncId) {
        const updatedMessages = sync.messages.map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions?.find(r => r.type === reactionType);
            if (existingReaction) {
              // Toggle off if user already reacted
              if (existingReaction.users.includes('Marcus Johnson')) {
                return {
                  ...msg,
                  reactions: msg.reactions?.map(r =>
                    r.type === reactionType
                      ? {
                          ...r,
                          count: r.count - 1,
                          users: r.users.filter(u => u !== 'Marcus Johnson')
                        }
                      : r
                  ).filter(r => r.count > 0)
                };
              } else {
                // Add user's reaction
                return {
                  ...msg,
                  reactions: msg.reactions?.map(r =>
                    r.type === reactionType
                      ? { ...r, count: r.count + 1, users: [...r.users, 'Marcus Johnson'] }
                      : r
                  )
                };
              }
            } else {
              // Add new reaction type
              return {
                ...msg,
                reactions: [
                  ...(msg.reactions || []),
                  { type: reactionType, count: 1, users: ['Marcus Johnson'] }
                ]
              };
            }
          }
          return msg;
        });
        return { ...sync, messages: updatedMessages };
      }
      return sync;
    });

    setActiveSyncs(updatedSyncs);
    setShowReactionPicker(null);
  };

  const handleSaveLicenseId = (syncId: string) => {
    const licenseId = licenseIdInputs[syncId]?.trim();
    
    const updatedSyncs = activeSyncs.map(sync => {
      if (sync.id === syncId) {
        return { ...sync, licenseId: licenseId || undefined };
      }
      return sync;
    });

    setActiveSyncs(updatedSyncs);
    setEditingLicenseId(null);
    setLicenseIdInputs(prev => ({ ...prev, [syncId]: '' }));
  };

  const handleRemoveLicenseId = (syncId: string) => {
    const updatedSyncs = activeSyncs.map(sync => {
      if (sync.id === syncId) {
        return { ...sync, licenseId: undefined };
      }
      return sync;
    });

    setActiveSyncs(updatedSyncs);
  };

  const getStatusBadge = (sync: ActiveSync) => {
    if (sync.status === 'urgent') {
      return (
        <Badge className="bg-red-100 text-red-700 border-0 px-2 py-0.5 rounded-md" style={{ fontSize: '10px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
          <AlertCircle className="h-3 w-3 mr-1" />
          URGENT
        </Badge>
      );
    } else if (sync.status === 'idle') {
      return (
        <Badge className="bg-gray-100 text-gray-600 border-0 px-2 py-0.5 rounded-md" style={{ fontSize: '10px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
          IDLE
        </Badge>
      );
    }
    return null;
  };

  const formatTimestamp = (timestamp: string) => {
    // Keep it simple for now - you can enhance this
    return timestamp;
  };

  return (
    <Card className="bg-white border mt-4" style={{ borderColor: '#E5E7EB' }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4" style={{ color: '#005B94' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
              Sync
            </h3>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-3 p-1 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
          {(['all', 'mine', 'team'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSyncFilter(filter)}
              className="flex-1 px-2 py-1.5 rounded-md transition-all"
              style={{
                backgroundColor: syncFilter === filter ? '#FFFFFF' : 'transparent',
                color: syncFilter === filter ? '#005B94' : '#6B7280',
                fontSize: '12px',
                fontWeight: syncFilter === filter ? 600 : 500,
                fontFamily: 'Inter, sans-serif',
                boxShadow: syncFilter === filter ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {filter === 'all' ? 'All' : filter === 'mine' ? 'My Syncs' : 'Team'}
            </button>
          ))}
        </div>

        {/* Active Syncs Section */}
        <div className="space-y-2 mb-3">
          {filteredSyncs.length === 0 ? (
            <div className="text-center py-6">
              <RefreshCw className="h-8 w-8 mx-auto mb-2" style={{ color: '#D1D5DB' }} />
              <p style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                No active syncs
              </p>
              <p style={{ fontSize: '12px', color: '#D1D5DB', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
                Start a sync from posts, tasks, or deals
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSyncs.map((sync) => (
                <div
                  key={sync.id}
                  className="rounded-lg border transition-all"
                  style={{
                    backgroundColor: expandedSyncId === sync.id ? '#FFFFFF' : '#F8F9FA',
                    borderColor: expandedSyncId === sync.id ? '#005B94' : '#E5E7EB',
                    borderWidth: expandedSyncId === sync.id ? '2px' : '1px'
                  }}
                >
                  {/* Collapsed Header */}
                  <div
                    className="p-3 cursor-pointer"
                    onClick={() => setExpandedSyncId(expandedSyncId === sync.id ? null : sync.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                            {sync.title}
                          </span>
                          {getStatusBadge(sync)}
                          {sync.unreadCount > 0 && (
                            <Badge className="bg-blue-600 text-white rounded-full h-5 min-w-5 flex items-center justify-center px-1.5" style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                              {sync.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        {sync.dealName && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Building2 className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                              {sync.dealName}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                              {sync.participants.slice(0, 3).join(', ')}
                              {sync.participants.length > 3 && ` +${sync.participants.length - 3}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                              {sync.messages.length}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                            <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                              {sync.lastActivity}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSyncId(expandedSyncId === sync.id ? null : sync.id);
                        }}
                      >
                        {expandedSyncId === sync.id ? (
                          <ChevronDown className="h-4 w-4" style={{ color: '#6B7280' }} />
                        ) : (
                          <ChevronRight className="h-4 w-4" style={{ color: '#6B7280' }} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Thread View */}
                  {expandedSyncId === sync.id && (
                    <div className="border-t" style={{ borderColor: '#E5E7EB' }}>
                      {/* Messages Thread */}
                      <div
                        ref={(el) => {
                          scrollRefs.current[sync.id] = el;
                        }}
                        className="px-3 py-2 space-y-3 max-h-96 overflow-y-auto"
                        style={{ backgroundColor: '#FAFBFC' }}
                      >
                        {sync.messages.map((message, idx) => (
                          <div key={message.id} className="flex items-start gap-2 group">
                            <Avatar className="h-7 w-7 flex-shrink-0" style={{ backgroundColor: message.author.color }}>
                              <AvatarFallback className="text-white" style={{ fontSize: '11px', fontWeight: 600, backgroundColor: message.author.color }}>
                                {message.author.initials}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-0.5">
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                  {message.author.name}
                                </span>
                                <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                  {message.timestamp}
                                </span>
                              </div>
                              
                              <p style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, marginBottom: '4px' }}>
                                {message.content}
                              </p>
                              
                              {/* Reactions */}
                              <div className="flex items-center gap-2 mt-1">
                                {message.reactions && message.reactions.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    {message.reactions.map((reaction) => {
                                      const Icon = reactionIcons[reaction.type];
                                      const userReacted = reaction.users.includes('Marcus Johnson');
                                      return (
                                        <button
                                          key={reaction.type}
                                          onClick={() => handleAddReaction(sync.id, message.id, reaction.type)}
                                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full hover:bg-white transition-colors"
                                          style={{
                                            backgroundColor: userReacted ? '#E0F2FE' : '#F3F4F6',
                                            border: userReacted ? '1px solid #0284C7' : '1px solid transparent'
                                          }}
                                        >
                                          <Icon className="h-3 w-3" style={{ color: userReacted ? '#0284C7' : '#6B7280' }} />
                                          <span style={{ fontSize: '11px', fontWeight: 500, color: userReacted ? '#0284C7' : '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                            {reaction.count}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                                
                                {/* Add Reaction Button */}
                                <div className="relative">
                                  <button
                                    onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded transition-all"
                                  >
                                    <Smile className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                                  </button>
                                  
                                  {showReactionPicker === message.id && (
                                    <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border p-1.5 flex gap-1 z-10" style={{ borderColor: '#E5E7EB' }}>
                                      {(['like', 'love', 'fire'] as const).map((type) => {
                                        const Icon = reactionIcons[type];
                                        return (
                                          <button
                                            key={type}
                                            onClick={() => handleAddReaction(sync.id, message.id, type)}
                                            className="p-1.5 hover:bg-gray-50 rounded transition-colors"
                                          >
                                            <Icon className="h-4 w-4" style={{ color: '#6B7280' }} />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input */}
                      <div className="p-3 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <textarea
                              value={replyInputs[sync.id] || ''}
                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [sync.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendReply(sync.id);
                                }
                              }}
                              placeholder="Add a reply..."
                              className="w-full px-3 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{
                                fontSize: '13px',
                                fontFamily: 'Inter, sans-serif',
                                borderColor: '#E5E7EB',
                                minHeight: '40px',
                                maxHeight: '120px'
                              }}
                              rows={1}
                            />
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Add emoji">
                              <Smile className="h-4 w-4" style={{ color: '#6B7280' }} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Attach document">
                              <Paperclip className="h-4 w-4" style={{ color: '#6B7280' }} />
                            </button>
                            <Button
                              size="sm"
                              onClick={() => handleSendReply(sync.id)}
                              disabled={!replyInputs[sync.id]?.trim()}
                              className="h-9 px-3"
                              style={{
                                backgroundColor: replyInputs[sync.id]?.trim() ? '#005B94' : '#E5E7EB',
                                color: replyInputs[sync.id]?.trim() ? '#FFFFFF' : '#9CA3AF',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '13px',
                                fontWeight: 600
                              }}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* License ID Section */}
                      <div className="px-3 py-2 border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#FAFBFC' }}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                            License ID:
                          </span>
                          
                          {editingLicenseId === sync.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={licenseIdInputs[sync.id] || sync.licenseId || ''}
                                onChange={(e) => setLicenseIdInputs(prev => ({ ...prev, [sync.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSaveLicenseId(sync.id);
                                  } else if (e.key === 'Escape') {
                                    setEditingLicenseId(null);
                                    setLicenseIdInputs(prev => ({ ...prev, [sync.id]: '' }));
                                  }
                                }}
                                placeholder="Enter license ID..."
                                className="flex-1 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{
                                  fontSize: '12px',
                                  fontFamily: 'Inter, sans-serif',
                                  borderColor: '#E5E7EB',
                                  maxWidth: '200px'
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveLicenseId(sync.id)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Save"
                              >
                                <CheckCircle2 className="h-4 w-4" style={{ color: '#28A745' }} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingLicenseId(null);
                                  setLicenseIdInputs(prev => ({ ...prev, [sync.id]: '' }));
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" style={{ color: '#6B7280' }} />
                              </button>\n                            </div>
                          ) : sync.licenseId ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Badge 
                                className="border px-2 py-0.5 rounded-md" 
                                style={{ 
                                  backgroundColor: '#EFF6FF', 
                                  color: '#005B94', 
                                  borderColor: '#BFDBFE',
                                  fontSize: '12px', 
                                  fontWeight: 600, 
                                  fontFamily: 'Inter, sans-serif' 
                                }}
                              >
                                {sync.licenseId}
                              </Badge>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingLicenseId(sync.id);
                                  setLicenseIdInputs(prev => ({ ...prev, [sync.id]: sync.licenseId || '' }));
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Edit License ID"
                              >
                                <Edit2 className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveLicenseId(sync.id);
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Remove License ID"
                              >
                                <X className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingLicenseId(sync.id);
                                setLicenseIdInputs(prev => ({ ...prev, [sync.id]: '' }));
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                              style={{ fontSize: '12px', color: '#005B94', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              Link License ID
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="px-3 pb-3 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(sync)}
                          className="flex-1 border-gray-300 hover:bg-green-50 hover:border-green-600 hover:text-green-700"
                          style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', height: '32px', fontWeight: 600 }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                          Mark as Resolved
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPost(sync.postId)}
                          className="border-gray-300 hover:bg-gray-50"
                          style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', height: '32px', fontWeight: 600 }}
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          View Post
                        </Button>
                        
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Send to Slack"
                        >
                          <Slack className="h-4 w-4" style={{ color: '#6B7280' }} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start New Sync Button */}
        <div className="pt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
          <Button
            onClick={() => setShowSyncModal({ postId: 'new', postAuthor: 'New Sync' })}
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50"
            style={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              fontFamily: 'Inter, sans-serif',
              color: '#005B94',
              height: '36px'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Start New Sync
          </Button>
        </div>

        {/* Resolved Syncs Section */}
        {pastSyncs.length > 0 && (
          <div className="pt-3 border-t mt-3" style={{ borderColor: '#E5E7EB' }}>
            <button
              onClick={() => setShowResolved(!showResolved)}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: '#28A745' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Resolved Syncs
                </span>
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                  ({pastSyncs.length})
                </span>
              </div>
              <ChevronDown 
                className="h-4 w-4 transition-transform" 
                style={{ 
                  color: '#6B7280',
                  transform: showResolved ? 'rotate(180deg)' : 'rotate(0deg)'
                }} 
              />
            </button>

            {showResolved && (
              <div className="space-y-1.5 mt-2">
                {pastSyncs.slice(0, 5).map((sync) => (
                  <div
                    key={sync.id}
                    className="p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewPost(sync.postId)}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#28A745' }} />
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sync.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {sync.dealName && (
                            <>
                              <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                {sync.dealName}
                              </span>
                              <span style={{ color: '#D1D5DB' }}>•</span>
                            </>
                          )}
                          <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                            Resolved {sync.resolvedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {pastSyncs.length > 5 && (
                  <button
                    className="w-full text-center py-1.5 hover:bg-gray-50 rounded transition-colors"
                    style={{ fontSize: '12px', color: '#005B94', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                  >
                    View all {pastSyncs.length} resolved syncs →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}