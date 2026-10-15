import React from 'react';
import { FileText, UserPlus, Search, SquarePen, Paperclip, RefreshCw, MessageSquare } from 'lucide-react';
import type { TimelineEvent, TimelineEventType } from './data/mvpRequirements';

const FONT = 'Inter, sans-serif';
const INK = '#0F2A3D';

const STYLE: Record<TimelineEventType, { bg: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  created: { bg: '#0D619B', Icon: FileText },
  team: { bg: '#2F55D4', Icon: UserPlus },
  collection: { bg: '#0F5A44', Icon: Search },
  task: { bg: '#2F55D4', Icon: SquarePen },
  document: { bg: '#0D619B', Icon: Paperclip },
  update: { bg: '#0D619B', Icon: RefreshCw },
  note: { bg: '#2F55D4', Icon: MessageSquare },
};

export function RequirementTimelineTab({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <div style={{ padding: '60px 0', textAlign: 'center', color: '#9CA3AF', fontFamily: FONT, fontSize: 15 }}>No activity yet.</div>;
  }
  return (
    <div style={{ fontFamily: FONT }}>
      {events.map((e) => {
        const { bg, Icon } = STYLE[e.type];
        return (
          <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '12px 0 14px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: INK }}>{e.title}</div>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{e.description}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, color: '#6B7280' }}>{e.date}</div>
              <div style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{e.actor}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
