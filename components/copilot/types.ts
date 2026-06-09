import type React from 'react';

// ─── Primitives ───────────────────────────────────────────────────────────────

export type AnomalySeverity = 'info' | 'warning';

export type CopilotContext = 'dashboard' | 'liquidai' | 'hublocator';

// ─── Message thread ───────────────────────────────────────────────────────────

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Muted citation line rendered below assistant messages.
   *  Phase 1: hardcoded. Phase 3: auto-populated from API response metadata. */
  citation?: string;
}

// ─── Component props ──────────────────────────────────────────────────────────

export interface AnomalyCalloutProps {
  headline: string;
  explanation: string;
  /** Short source attribution, e.g. "Based on MonthlyRevenue, Oct 2024" */
  dataSource: string;
  severity: AnomalySeverity;
  onDismiss: () => void;
}

export interface CopilotPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  messages: CopilotMessage[];
  /** Phase 1: no-op. Phase 3: fires Anthropic API call. */
  onSubmit: (query: string) => void;
}

export interface SummaryButtonProps {
  onClick: () => void;
  /** Phase 1: wire up visually. Phase 3: flip true while streaming. */
  isLoading: boolean;
}

export interface AIAssistantProps {
  /** Determines which data context is passed in Phase 2/3. */
  context: CopilotContext;
  /** Phase 2: typed per context. Phase 1: unused. */
  contextData?: Record<string, unknown>;
  children: React.ReactNode;
}
