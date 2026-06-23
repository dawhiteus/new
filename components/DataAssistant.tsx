import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles, Send, ChevronDown } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

const SUMMARY =
  'Adoption reached 84% across 6,840 enrolled employees — up 20% over the past 12 months. ' +
  'Total spend of $639K is led by Atlanta ($83K, 13%) and New York ($52K, 8%). ' +
  'Average cost per reservation is $174. Tuesday drives peak utilization at 9,100 bookings. ' +
  'Legal & Compliance leads activation at 100%; Finance & Risk lags at 67.1%.';

function getResponse(q: string): string {
  const t = q.toLowerCase();
  if (/market|city|atlanta|new york|columbia|spend/.test(t))
    return 'Atlanta leads at $83K total spend — 13% of the portfolio. New York follows at $52K (8%) and Columbia, MD at $31K (5%). These three markets account for 26% of total spend.';
  if (/adoption|growth|trend|increase/.test(t))
    return 'Adoption grew from 70% to 84% over 12 months — a +20% lift. Legal & Compliance is at 100% activation. Finance & Risk is the laggard at 67.1% with a −3.2% trend.';
  if (/team|bu funded|enterprise|group/.test(t))
    return 'Tel Tech Enterprise drives the bulk of activity at 99.2% adoption across 4,820 members. Among functional teams, Legal & Compliance is fully activated; Finance & Risk is at 67.1% and declining.';
  if (/cost|price|average|per reservation|\$174/.test(t))
    return 'The average cost per reservation is $174 across 3,667 total bookings. Atlanta and New York pull the average up — both markets have above-average per-booking spend.';
  if (/engagement|active|monthly|mau/.test(t))
    return 'Monthly active users are at 5,198 — 76% of enrolled employees. Engagement has grown 8.3% month-over-month. Tuesday is the peak booking day; Friday is the lightest.';
  if (/day|week|tuesday|monday|friday|pattern/.test(t))
    return 'Tuesday is the busiest day at 9,100 bookings (+15.7% trend). Friday is lowest at 6,100 (−8.9%). Midweek (Tue–Thu) accounts for roughly 60% of weekly reservations.';
  if (/space|type|meeting|office|desk|focus/.test(t))
    return 'Meeting Rooms are the most booked at 38% of reservations, followed by Private Offices at 28%, Hot Desks at 18%, Focus Rooms at 12%, and Conference Rooms at 5%.';
  if (/review|rating|sentiment|satisfaction/.test(t))
    return 'Average rating is 4.5 out of 5 across all bookings. Sentiment skews strongly positive — the majority of reviews reflect satisfaction with location and workspace quality.';
  return 'I can answer questions about adoption rates, market spend, booking patterns, space types, team performance, or engagement trends. What specifically would you like to explore?';
}

interface DataAssistantProps {
  defaultOpen?: boolean;
}

export function DataAssistant({ defaultOpen = false }: DataAssistantProps) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: SUMMARY }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const onHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragging.current = true;
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', text: getResponse(text) }]);
      setLoading(false);
    }, 650);
  };

  // ── Collapsed pill ────────────────────────────────────────────────────────────
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '10px 18px', borderRadius: 9999,
          backgroundColor: '#005B94', color: '#fff',
          border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
          boxShadow: '0 4px 20px rgba(0,91,148,0.35)',
          transition: 'transform 150ms, box-shadow 150ms',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,91,148,0.45)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,91,148,0.35)';
        }}
      >
        <Sparkles size={13} />
        Ask about this data
      </button>
    );
  }

  // ── Expanded card ─────────────────────────────────────────────────────────────
  const positionStyle: React.CSSProperties = pos
    ? { position: 'fixed', left: pos.x, top: pos.y }
    : { position: 'fixed', right: 28, bottom: 28 };

  return (
    <div
      ref={cardRef}
      style={{
        ...positionStyle,
        zIndex: 1000,
        width: 340,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        fontFamily: 'Inter, sans-serif',
        userSelect: dragging.current ? 'none' : 'auto',
      }}
    >
      {/* Header / drag handle */}
      <div
        onMouseDown={onHeaderMouseDown}
        style={{
          backgroundColor: '#005B94',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'grab',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Sparkles size={13} color="#fff" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Data Assistant</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => setExpanded(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px 5px', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', borderRadius: 5 }}
            title="Minimise"
          >
            <ChevronDown size={15} />
          </button>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => { setExpanded(false); setPos(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px 5px', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', borderRadius: 5 }}
            title="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Message thread */}
      <div style={{
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: 360,
        flexShrink: 0,
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '90%',
              padding: '8px 11px',
              borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              backgroundColor: m.role === 'user' ? '#005B94' : '#F1F5F9',
              color: m.role === 'user' ? '#fff' : '#374151',
              fontSize: 12,
              lineHeight: 1.6,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{
              padding: '8px 12px', borderRadius: '10px 10px 10px 2px',
              backgroundColor: '#F1F5F9', fontSize: 12, color: '#9CA3AF',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ animation: 'pulse 1s infinite' }}>•••</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts — only shown with single message */}
      {messages.length === 1 && (
        <div style={{ padding: '0 12px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            'Which market has the highest spend?',
            'Which team has the lowest adoption?',
            'What is the peak booking day?',
          ].map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              style={{
                textAlign: 'left', padding: '6px 10px', borderRadius: 7,
                border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB',
                fontSize: 11, color: '#374151', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', lineHeight: 1.4,
                transition: 'background-color 100ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '8px 10px 10px',
        borderTop: '1px solid #F3F4F6',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder="Ask a question…"
          style={{
            flex: 1, padding: '7px 10px', borderRadius: 8,
            border: '1px solid #E5E7EB', fontSize: 12,
            fontFamily: 'Inter, sans-serif', outline: 'none',
            color: '#374151', backgroundColor: '#FAFAFA',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            backgroundColor: input.trim() && !loading ? '#005B94' : '#E5E7EB',
            color: input.trim() && !loading ? '#fff' : '#9CA3AF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background-color 150ms',
          }}
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
