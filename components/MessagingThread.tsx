import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Sparkles, X, ThumbsUp, Bot } from 'lucide-react';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  isAgent?: boolean;
}

interface MessagingThreadProps {
  dealId: string;
}

const sampleMessages: Message[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    content: 'Just had a great call with the Tel Tech team. They\'re very interested in the NYC space and want to move forward with a site visit next week.',
    timestamp: '2025-11-10T14:30:00',
  },
  {
    id: '2',
    author: 'Michael Torres',
    authorInitials: 'MT',
    content: 'That\'s excellent news! I\'ll coordinate with the property manager to schedule the tour. What days work best for them?',
    timestamp: '2025-11-10T15:15:00',
  },
  {
    id: '3',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    content: 'They mentioned Tuesday or Wednesday afternoon. I\'ll send over the proposal draft by end of day today for your review.',
    timestamp: '2025-11-10T15:45:00',
  },
  {
    id: '4',
    author: 'David Kim',
    authorInitials: 'DK',
    content: 'Great work team! Make sure to highlight the flexibility in the lease terms - that\'s been a key selling point for similar tech companies.',
    timestamp: '2025-11-10T16:20:00',
  },
  {
    id: '5',
    author: 'Requirements Intake Agent',
    authorInitials: 'RI',
    content: `I reviewed the current deal requirements for Tel Tech NYC Expansion.

• Capacity aligns with stated headcount (48–52 employees).
• Budget tolerance appears capped at $55k/month.
• No parking requirement specified — confirm if needed.
• Expansion flexibility requested but not defined (recommend clarifying swing space tolerance).

No blocking gaps identified. Recommend confirming expansion clause priority before moving deeper into negotiations.`,
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    isAgent: true,
  },
  {
    id: '6',
    author: 'Market Sourcing Agent',
    authorInitials: 'MS',
    content: `Completed comparative analysis for Midtown/Hudson Yards options (5,000–5,500 sq ft).

Top findings:
• Pricing range: $46,500–$52,800/month
• Concession variance up to 1.5 months free equivalent
• Inventory tight under $48k/month threshold

Industrial-style operators show strongest value-to-amenity ratio.
Recommend shortlisting 2 operators for negotiation leverage.

Collection updated and attached to Sourcing tab.`,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    isAgent: true,
  },
  {
    id: '7',
    author: 'Finance Ops Agent',
    authorInitials: 'FO',
    content: `Financial review complete on latest proposal draft.

• Effective rate after concessions: $49,200/month
• 2.8% above comparable median
• 12-month extension option priced at market

Budget impact remains within approved tolerance band (+4%).
Negotiation leverage exists around TI allowance and early termination flexibility.`,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isAgent: true,
  },
  {
    id: '8',
    author: 'Risk & Compliance Agent',
    authorInitials: 'RC',
    content: `Initial redline review of Lease_Addendum_Draft_v1.docx complete.

Flagged items:
• Indemnification clause extends beyond policy standard
• Insurance minimums exceed client historical coverage
• Assignment clause lacks sublease flexibility language

No critical blockers identified.
Recommend targeted revisions prior to client circulation.`,
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    isAgent: true,
  },
  {
    id: '9',
    author: 'Transaction Coordinator Agent',
    authorInitials: 'TC',
    content: `Workflow status update:

• 2 tasks remaining in Negotiation stage
• Legal review pending
• Proposal revision due in 3 days

At current pace, projected close date remains achievable.
Reminder: Stage advancement requires completion of legal review task.`,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    isAgent: true,
  },
];

export function MessagingThread({ dealId }: MessagingThreadProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showAISuggestion, setShowAISuggestion] = useState(true);
  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  const suggestedResponse = "Thanks for the update! I've reviewed the proposal and it looks good. Let's aim for Tuesday at 2 PM for the site visit. I'll send the calendar invite shortly.";

  const handleUseSuggestion = () => {
    setNewMessage(suggestedResponse);
    setShowAISuggestion(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: 'You',
      authorInitials: 'YO',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(90vh - 340px)' }}>
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            {message.isAgent ? (
              <div 
                className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#D1FAE5' }}
              >
                <Bot className="h-5 w-5" style={{ color: '#059669' }} />
              </div>
            ) : (
              <Avatar className="h-10 w-10 flex-shrink-0" style={{ backgroundColor: '#005B94' }}>
                <AvatarFallback className="text-white" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {message.authorInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  {message.author}
                </span>
                {message.isAgent && (
                  <Badge className="bg-green-600 text-white border-0" style={{ fontSize: '10px', fontWeight: 500 }}>
                    Agent
                  </Badge>
                )}
                <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: message.isAgent ? '#F9FAFB' : '#F8F9FA',
                  fontSize: '14px', 
                  color: '#374151', 
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line',
                  maxWidth: '100%',
                }}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}>
        {/* AI Suggested Response */}
        {showAISuggestion && !dismissedSuggestion && messages.length > 0 && (
          <div className="p-3 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F0F9FF' }}>
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: '#005B94' }}>
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      AI Suggested Response
                    </span>
                    <Badge className="bg-blue-100 text-blue-700 border-0" style={{ fontSize: '10px', fontWeight: 500 }}>
                      Optional
                    </Badge>
                  </div>
                  <button
                    onClick={() => setDismissedSuggestion(true)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.5', marginBottom: '8px' }}>
                  "{suggestedResponse}"
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUseSuggestion}
                    className="px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                    style={{ color: '#005B94', fontFamily: 'Inter, sans-serif' }}
                  >
                    Use this response
                  </button>
                  <button
                    onClick={() => setShowAISuggestion(false)}
                    className="px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors text-gray-600"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4">
          <div className="flex gap-3">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-20 border-gray-300 bg-white resize-none"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="self-end text-white"
              style={{ 
                backgroundColor: '#005B94',
                fontSize: '14px', 
                fontWeight: 500, 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}