import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { SummaryButtonProps } from './types';

/**
 * Secondary action button that lives in the PageHeader children slot.
 * Matches the frosted-glass style of the existing FilterPill components.
 *
 * Phase 1: onClick is a no-op; isLoading shows the spinner state.
 * Phase 3: parent flips isLoading=true while the Anthropic stream is open.
 */
export function SummaryButton({ onClick, isLoading }: SummaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:              6,
        padding:         '7px 14px',
        borderRadius:    8,
        background:      'rgba(255,255,255,0.12)',
        border:          '1px solid rgba(255,255,255,0.22)',
        color:           '#fff',
        fontSize:        13,
        fontWeight:      500,
        cursor:          isLoading ? 'default' : 'pointer',
        whiteSpace:      'nowrap',
        fontFamily:      'Inter, sans-serif',
        opacity:         isLoading ? 0.75 : 1,
        transition:      'opacity 150ms, background 150ms',
      }}
      onMouseEnter={(e) => {
        if (!isLoading)
          e.currentTarget.style.background = 'rgba(255,255,255,0.20)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
      }}
    >
      {isLoading ? (
        // animate-spin is a Tailwind utility; it's always compiled since it's
        // referenced explicitly here. Falls back gracefully if Tailwind isn't
        // processing this file (icon still renders, just doesn't spin).
        <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} />
      ) : (
        <Sparkles style={{ width: 14, height: 14 }} />
      )}
      <span>{isLoading ? 'Generating…' : 'Generate summary'}</span>
    </button>
  );
}
