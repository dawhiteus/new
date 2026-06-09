import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import type { AnomalyCalloutProps } from './types';

const PALETTE = {
  warning: {
    bg:          '#FFFBEB',
    border:      '#FDE68A',
    accent:      '#F59E0B',
    icon:        '#D97706',
    headline:    '#92400E',
    body:        '#B45309',
    source:      '#9CA3AF',
  },
  info: {
    bg:          '#EFF6FF',
    border:      '#BFDBFE',
    accent:      '#2563EB',
    icon:        '#2563EB',
    headline:    '#1E3A8A',
    body:        '#1D4ED8',
    source:      '#9CA3AF',
  },
} as const;

export function AnomalyCallout({
  headline,
  explanation,
  dataSource,
  severity,
  onDismiss,
}: AnomalyCalloutProps) {
  const [dismissed, setDismissed] = useState(false);
  const p = PALETTE[severity];
  const Icon = severity === 'warning' ? AlertTriangle : Info;

  return (
    // Outer shell handles the height-collapse so the flex gap above/below
    // shrinks smoothly rather than snapping when onDismiss removes the element.
    <div
      style={{
        maxHeight:  dismissed ? 0   : 200,
        opacity:    dismissed ? 0   : 1,
        overflow:   'hidden',
        // max-height drives the layout collapse; opacity leads slightly so the
        // content fades before the gap fully closes.
        transition: 'max-height 280ms ease, opacity 200ms ease',
      }}
      onTransitionEnd={(e) => {
        // Guard against the opacity transition also firing this callback.
        if (dismissed && e.propertyName === 'max-height') onDismiss();
      }}
    >
      {/* Inner card — never changes size; outer shell does the collapsing */}
      <div
        style={{
          display:       'flex',
          alignItems:    'flex-start',
          gap:           10,
          backgroundColor: p.bg,
          border:        `1px solid ${p.border}`,
          borderLeft:    `4px solid ${p.accent}`,
          borderRadius:  10,
          padding:       '12px 14px',
        }}
      >
        <Icon
          style={{
            width: 15, height: 15,
            color: p.icon,
            flexShrink: 0,
            marginTop: 1,
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13, fontWeight: 600,
              color: p.headline,
              marginBottom: 3,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: 12, lineHeight: 1.55,
              color: p.body,
              marginBottom: 5,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {explanation}
          </div>
          <div
            style={{
              fontSize: 11,
              color: p.source,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {dataSource}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          style={{
            display:    'flex',
            alignItems: 'center',
            background: 'none',
            border:     'none',
            padding:    3,
            cursor:     'pointer',
            color:      '#9CA3AF',
            flexShrink: 0,
            borderRadius: 4,
            transition: 'color 120ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#6B7280')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}
