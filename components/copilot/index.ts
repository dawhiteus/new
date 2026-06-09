// Public API for the copilot layer.
// The dashboard (and future pages) import exclusively from this barrel —
// internal file structure can change in Phase 2/3 without touching consumers.

export { AIAssistant }    from './AIAssistant';
export { SummaryButton }  from './SummaryButton';

// Named type exports for consumers that need to pass props down.
export type {
  CopilotContext,
  CopilotMessage,
  AIAssistantProps,
  SummaryButtonProps,
  AnomalyCalloutProps,
  CopilotPanelProps,
  AnomalySeverity,
} from './types';
