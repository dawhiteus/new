import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import {
  FileText,
  Video,
  CheckSquare,
  Link as LinkIcon,
  Calendar,
  Star,
  Share2,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Clock,
  Eye,
  Pin,
  Edit,
  History,
  Send,
  Plus,
  X,
} from 'lucide-react';
import { AddToDealModal } from './AddToDealModal';

interface PlaybookEntry {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'link' | 'checklist' | 'video' | 'calendar';
  tags: string[];
  lastUpdated: string;
  createdBy: {
    name: string;
    initials: string;
  };
  isPinned?: boolean;
  content?: string;
  externalUrl?: string;
  comments?: number;
  views?: number;
}

interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface PlaybookDetailModalProps {
  entry: PlaybookEntry;
  isOpen: boolean;
  onClose: () => void;
}

const sampleComments: Comment[] = [
  {
    id: '1',
    author: { name: 'Michael Torres', initials: 'MT' },
    content: 'This is really helpful! Used this process for the Tech Ventures deal and it worked perfectly.',
    timestamp: '2025-11-11 14:30',
    likes: 5,
  },
  {
    id: '2',
    author: { name: 'Sarah Chen', initials: 'SC' },
    content: 'Updated with the latest budget threshold changes from Q4 planning meeting.',
    timestamp: '2025-11-10 09:15',
    likes: 3,
  },
];

const sampleEditHistory = [
  {
    id: '1',
    editor: 'Sarah Chen',
    action: 'Updated content',
    timestamp: '2025-11-12 10:45',
  },
  {
    id: '2',
    editor: 'Michael Torres',
    action: 'Added new section',
    timestamp: '2025-11-08 16:20',
  },
  {
    id: '3',
    editor: 'Sarah Chen',
    action: 'Created entry',
    timestamp: '2025-10-15 11:00',
  },
];

const relatedDeals = [
  { id: '1', name: 'Tel Tech NYC Expansion', broker: 'Sarah Chen' },
  { id: '2', name: 'Global Finance Boston Hub', broker: 'Sarah Chen' },
];

export function PlaybookDetailModal({
  entry,
  isOpen,
  onClose,
}: PlaybookDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [isPinned, setIsPinned] = useState(entry.isPinned || false);
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddToDealModal, setShowAddToDealModal] = useState(false);

  const getTypeIcon = (type: string, isWhite: boolean = false) => {
    const color = isWhite ? '#FFFFFF' : type === 'text' ? '#005B94' : type === 'link' ? '#00B8C4' : type === 'checklist' ? '#28A745' : type === 'video' ? '#FFA500' : '#6B7280';
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5" style={{ color }} />;
      case 'link':
        return <LinkIcon className="h-5 w-5" style={{ color }} />;
      case 'checklist':
        return <CheckSquare className="h-5 w-5" style={{ color }} />;
      case 'video':
        return <Video className="h-5 w-5" style={{ color }} />;
      case 'calendar':
        return <Calendar className="h-5 w-5" style={{ color }} />;
      default:
        return <FileText className="h-5 w-5" style={{ color }} />;
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto p-0"
        style={{ backgroundColor: '#FFFFFF', maxWidth: '77.76rem' }}
      >
        <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getTypeIcon(entry.type, true)}
                <DialogTitle
                  className="text-white"
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.2',
                  }}
                >
                  {entry.title}
                </DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                View and manage playbook entry details, comments, and related information
              </DialogDescription>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Metadata */}
        <div className="flex items-center justify-between gap-4 py-3 px-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback
                  style={{
                    backgroundColor: '#005B94',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {entry.createdBy.initials}
                </AvatarFallback>
              </Avatar>
              <span
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                {entry.createdBy.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-4 w-4" />
              <span
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Updated {entry.lastUpdated}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Eye className="h-4 w-4" />
              <span
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {entry.views || 0} views
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPinned(!isPinned)}
              className={isPinned ? 'border-orange-500' : 'border-gray-300'}
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              <Pin className={`h-4 w-4 mr-1 ${isPinned ? 'fill-current text-orange-500' : ''}`} />
              {isPinned ? 'Pinned' : 'Pin'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditHistory(!showEditHistory)}
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddToDealModal(true)}
              className="text-white"
              style={{ backgroundColor: '#005B94', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Deal
            </Button>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-6">
          {/* Edit History */}
          {showEditHistory && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3
              className="mb-3"
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Edit History
            </h3>
            <div className="space-y-2">
              {sampleEditHistory.map((edit) => (
                <div key={edit.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {edit.editor}
                    </span>
                    <span
                      className="mx-2"
                      style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {edit.action}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {edit.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="py-4">
          <p
            className="mb-4"
            style={{
              fontSize: '16px',
              color: '#374151',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.6',
            }}
          >
            {entry.description}
          </p>

          {entry.type === 'text' && entry.content && (
            <div
              className="prose max-w-none"
              style={{
                fontSize: '16px',
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.6',
              }}
            >
              <p>{entry.content}</p>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '20px', marginBottom: '12px' }}>
                Key Steps
              </h3>
              <ol className="space-y-2">
                <li>Review client background and industry vertical</li>
                <li>Identify decision-makers and budget authority</li>
                <li>Assess workspace requirements and timeline</li>
                <li>Determine budget range and contract flexibility</li>
                <li>Document discovery findings in CRM</li>
              </ol>
            </div>
          )}

          {entry.type === 'link' && entry.externalUrl && (
            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-6 w-6 text-gray-400" />
                <div>
                  <p
                    className="mb-1"
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    External Resource
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {entry.externalUrl}
                  </p>
                </div>
              </div>
              <Button
                className="text-white"
                style={{
                  backgroundColor: '#005B94',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                }}
                onClick={() => window.open(entry.externalUrl, '_blank')}
              >
                Open Link
              </Button>
            </div>
          )}

          {entry.type === 'checklist' && (
            <div className="space-y-3">
              {[
                'Complete system access setup',
                'Review company handbook and policies',
                'Shadow 3 client calls',
                'Complete CRM training module',
                'Schedule 30-day check-in',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300"
                    style={{ accentColor: '#005B94' }}
                  />
                  <span
                    style={{
                      fontSize: '16px',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}

          {entry.type === 'video' && entry.externalUrl && (
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto mb-4 text-white/60" />
                <p className="text-white/80 mb-4" style={{ fontSize: '16px', fontFamily: 'Inter, sans-serif' }}>
                  Video content
                </p>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  onClick={() => window.open(entry.externalUrl, '_blank')}
                >
                  Watch on Loom
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Related Deals */}
        {relatedDeals.length > 0 && (
          <div className="py-4 border-t border-gray-200">
            <h3
              className="mb-3"
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Related Deals
            </h3>
            <div className="space-y-2">
              {relatedDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {deal.name}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {deal.broker}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Comments Section */}
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5" style={{ color: '#374151' }} />
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Comments ({sampleComments.length})
            </h3>
          </div>

          {/* Comment List */}
          <div className="space-y-4 mb-4">
            {sampleComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    style={{
                      backgroundColor: '#005B94',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {comment.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {comment.author.name}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {comment.timestamp}
                    </span>
                  </div>
                  <p
                    className="mb-2"
                    style={{
                      fontSize: '14px',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.5',
                    }}
                  >
                    {comment.content}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                style={{
                  backgroundColor: '#005B94',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                ME
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                rows={3}
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="text-white"
                style={{
                  backgroundColor: '#005B94',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </div>
        </div>
        {/* End Content Wrapper */}
      </DialogContent>
      <AddToDealModal
        isOpen={showAddToDealModal}
        onClose={() => setShowAddToDealModal(false)}
        playbookEntry={entry}
      />
    </Dialog>
  );
}