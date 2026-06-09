import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, ChevronDown, MessageSquare } from 'lucide-react';
import type { CopilotPanelProps } from './types';

export function CopilotPanel({
  isExpanded,
  onToggle,
  messages,
  onSubmit,
}: CopilotPanelProps) {
  const [input, setInput] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  // Keep thread scrolled to bottom when new messages arrive or panel opens.
  useEffect(() => {
    if (isExpanded && threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [isExpanded, messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    onSubmit(q);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const q = input.trim();
      if (!q) return;
      onSubmit(q);
      setInput('');
    }
  };

  // Expand when user focuses the input while collapsed.
  const handleInputFocus = () => {
    if (!isExpanded) onToggle();
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border:          '1px solid #E5E7EB',
        borderRadius:    14,
        overflow:        'hidden',
        fontFamily:      'Inter, sans-serif',
      }}
    >
      {/* ── Message thread (visible only when expanded) ─────────────────── */}
      {isExpanded && hasMessages && (
        <div
          ref={threadRef}
          style={{
            maxHeight:   280,
            overflowY:   'auto',
            padding:     '16px 20px',
            borderBottom:'1px solid #F3F4F6',
            display:     'flex',
            flexDirection:'column',
            gap:          0,
          }}
        >
          {messages.map((msg, i) => {
            const isUser      = msg.role === 'user';
            const isLast      = i === messages.length - 1;
            return (
              <div
                key={i}
                style={{
                  paddingTop:    i === 0 ? 0 : 12,
                  paddingBottom: isLast  ? 0 : 12,
                  borderBottom:  isLast  ? 'none' : '1px solid #F3F4F6',
                }}
              >
                {/* Role label */}
                <div
                  style={{
                    fontSize:       10,
                    fontWeight:     700,
                    letterSpacing:  '0.07em',
                    textTransform:  'uppercase',
                    color:          isUser ? '#9CA3AF' : '#005B94',
                    marginBottom:   5,
                  }}
                >
                  {isUser ? 'You' : 'Copilot'}
                </div>

                {/* Message body — preserve newlines from mock content */}
                <div
                  style={{
                    fontSize:   13,
                    color:      '#111827',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-line',
                    paddingLeft: isUser ? 0 : 10,
                    borderLeft:  isUser ? 'none' : '3px solid #E5E7EB',
                  }}
                >
                  {msg.content}
                </div>

                {/* Citation line — assistant only */}
                {!isUser && msg.citation && (
                  <div
                    style={{
                      fontSize:    11,
                      color:       '#9CA3AF',
                      fontStyle:   'italic',
                      marginTop:   6,
                      paddingLeft: 13, // aligns under border-left content
                    }}
                  >
                    {msg.citation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Input row (always visible) ──────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        style={{
          display:     'flex',
          alignItems:  'center',
          gap:          8,
          padding:     isExpanded ? '10px 12px 10px 14px' : '4px 12px 4px 14px',
          minHeight:   isExpanded ? 52 : 42,
          transition:  'padding 200ms ease, min-height 200ms ease',
        }}
      >
        {/* Toggle / label button */}
        <button
          type="button"
          onClick={onToggle}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:         5,
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            color:      '#6B7280',
            padding:    '4px 6px 4px 0',
            fontSize:   13,
            fontFamily: 'Inter, sans-serif',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <MessageSquare style={{ width: 15, height: 15, flexShrink: 0 }} />
          {!isExpanded && (
            <span style={{ fontSize: 13, color: '#6B7280' }}>Ask about this data</span>
          )}
          <ChevronDown
            style={{
              width:      13,
              height:     13,
              transform:  isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }}
          />
        </button>

        {/* Divider */}
        <div
          style={{
            width:           1,
            height:          20,
            backgroundColor: '#E5E7EB',
            flexShrink:      0,
          }}
        />

        {/* Text input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={isExpanded ? 'Ask a follow-up question...' : 'Type a question...'}
          style={{
            flex:            1,
            height:          34,
            borderRadius:    8,
            border:          '1px solid #E5E7EB',
            padding:         '0 10px',
            fontSize:        13,
            fontFamily:      'Inter, sans-serif',
            color:           '#374151',
            backgroundColor: '#F9FAFB',
            outline:         'none',
            transition:      'border-color 150ms',
          }}
          onFocusCapture={(e) => (e.currentTarget.style.borderColor = '#005B94')}
          onBlurCapture={(e)  => (e.currentTarget.style.borderColor = '#E5E7EB')}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send"
          style={{
            width:           32,
            height:          32,
            borderRadius:    8,
            border:          'none',
            cursor:          input.trim() ? 'pointer' : 'default',
            backgroundColor: input.trim() ? '#005B94' : '#E5E7EB',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            flexShrink:      0,
            transition:      'background-color 150ms',
          }}
        >
          <ArrowUp
            style={{
              width:  14,
              height: 14,
              color:  input.trim() ? '#fff' : '#9CA3AF',
              transition: 'color 150ms',
            }}
          />
        </button>
      </form>
    </div>
  );
}
