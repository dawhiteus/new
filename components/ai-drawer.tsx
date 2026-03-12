import React, { useState } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ChevronRight,
  Bot,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import type { AgentCard, Deal } from './BrokerFlow';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  agentCard?: AgentCard | null;
  dealContext?: Deal | null;
  /** Legacy support for persona-only mode with no agent context */
  aiPersona?: string;
}

// ─── Severity Config ──────────────────────────────────────────────────────────

const severityConfig = {
  informational: {
    bg: '#D4EDDA',
    text: '#28A745',
    border: '#28A745',
    headerBg: '#28A745',
    Icon: CheckCircle,
    label: 'Informational',
  },
  suggestion: {
    bg: '#D6EAF8',
    text: '#005B94',
    border: '#005B94',
    headerBg: '#005B94',
    Icon: Lightbulb,
    label: 'Suggestion',
  },
  'needs-review': {
    bg: '#FFF3CD',
    text: '#B8860B',
    border: '#FFA500',
    headerBg: '#FFA500',
    Icon: AlertTriangle,
    label: 'Needs Review',
  },
  escalation: {
    bg: '#F8D7DA',
    text: '#DC3545',
    border: '#DC3545',
    headerBg: '#DC3545',
    Icon: AlertCircle,
    label: 'Escalation',
  },
};

// ─── Agent-driven analysis content ───────────────────────────────────────────

function getAnalysisContent(card: AgentCard, deal: Deal) {
  switch (card.severity) {
    case 'escalation':
      if (card.title.toLowerCase().includes('competitor')) {
        return {
          summary: `Competitive threat detected on the ${deal.clientName} deal. Immediate executive attention required to protect a ${formatARR(deal.estValue)} opportunity.`,
          analysis: [
            `${deal.clientName} is actively evaluating a competing proposal. Based on intelligence gathered, the evaluation timeline has accelerated significantly.`,
            `The deal is currently in ${deal.dealStage} stage — a stage where competitive pressure is highest as customers approach final selection.`,
            `This deal represents ${formatARR(deal.estValue)} estimated value across the ${deal.city} location.`,
          ],
          recommendations: [
            'Schedule an executive-level call within 48 hours to reinforce relationship and value proposition',
            'Prepare a competitive differentiation brief highlighting LiquidSpace unique capabilities',
            'Consider offering enhanced service terms or pilot expansion to accelerate decision',
            'Involve deal champion to understand competitor\'s specific talking points',
            'Escalate to VP Sales for strategic guidance on competitive response',
          ],
          actions: ['Schedule Executive Call', 'Request Competitive Intel'],
        };
      }
      if (card.title.toLowerCase().includes('budget')) {
        return {
          summary: `Budget risk threatens deal closure. Finance constraints could delay or eliminate a ${formatARR(deal.estValue)} opportunity.`,
          analysis: [
            `${deal.clientName}'s finance team has raised concerns about budget availability for this engagement.`,
            `The deal is in ${deal.dealStage} stage with a targeted close date of ${deal.closeDate ?? deal.lastUpdated}. Budget cycles may not align.`,
            `At ${formatARR(deal.estValue)}, creative commercial structures could resolve the budget impasse.`,
          ],
          recommendations: [
            'Propose phased implementation to spread costs across budget periods',
            'Explore multi-year deal structures with favorable first-year economics',
            'Connect with CFO or budget holder directly to understand constraints',
            'Model alternative license counts that fit within available budget',
            'Confirm whether Q-end timing can accelerate budget approval',
          ],
          actions: ['Model Alternative Pricing', 'Schedule Finance Call'],
        };
      }
      return {
        summary: `This deal requires immediate escalation. ${deal.clientName} at ${formatARR(deal.estValue)} is at significant risk.`,
        analysis: [
          card.description,
          `Current stage: ${deal.dealStage}. Close date: ${deal.closeDate ?? deal.lastUpdated}.`,
          `Broker: ${deal.broker}.`,
        ],
        recommendations: [
          'Escalate to sales leadership immediately',
          'Conduct stakeholder mapping to identify executive sponsors',
          'Re-establish contact within 24 hours',
          'Review deal history for root cause of stall',
        ],
        actions: ['Escalate to Manager', 'Log Customer Contact'],
      };

    case 'needs-review':
      if (card.title.toLowerCase().includes('close date')) {
        return {
          summary: `Deal activity has stalled. The ${deal.closeDate ?? deal.lastUpdated} close date is at risk without immediate intervention.`,
          analysis: [
            `Activity tracking shows a significant gap in customer engagement. Last recorded contact is more than a week ago.`,
            `Deals in ${deal.dealStage} stage typically close within 30-45 days from this point. The current trajectory puts the target date at risk.`,
            `${deal.broker} is the deal broker. Coordination with the full deal team is recommended.`,
          ],
          recommendations: [
            'Re-engage with a personalized outreach referencing specific customer priorities',
            'Send a value summary highlighting ROI from comparable deployments',
            'Confirm whether internal blockers have emerged at the customer',
            'Review mutual action plan and confirm next steps with customer',
          ],
          actions: ['Send Re-engagement Email', 'Update Close Date'],
        };
      }
      if (card.title.toLowerCase().includes('pricing')) {
        return {
          summary: `Pricing approval is blocking deal progression. Internal approval needed before counter-proposal submission.`,
          analysis: [
            `The customer's pricing request falls outside standard discount parameters and requires revenue team authorization.`,
            `Without approval, ${deal.broker} cannot submit the final proposal, creating a customer-visible delay.`,
            `The deal is currently in ${deal.dealStage} stage targeting ${deal.closeDate ?? deal.lastUpdated}.`,
          ],
          recommendations: [
            'Submit pricing approval request through the revenue desk with urgency flag',
            'Prepare business justification: deal size, strategic value, competitive context',
            'Identify whether a standard configuration can meet the customer budget',
            'Set 24-hour SLA expectation with approving manager',
          ],
          actions: ['Submit Approval Request', 'Explore Standard Configs'],
        };
      }
      return {
        summary: `This item requires review before the deal can progress. Timely action will prevent deal delays.`,
        analysis: [card.description],
        recommendations: [
          'Review flagged item and determine resolution path',
          'Coordinate with relevant stakeholders for sign-off',
          'Update deal notes with resolution plan',
        ],
        actions: ['Mark as Reviewed', 'Assign for Resolution'],
      };

    case 'suggestion':
      if (card.title.toLowerCase().includes('expansion') || card.title.toLowerCase().includes('upsell')) {
        return {
          summary: `Revenue expansion opportunity identified. ${deal.clientName} shows strong signals for increased engagement.`,
          analysis: [
            `Usage and engagement data suggests ${deal.clientName} is operating near capacity in their current configuration.`,
            `Historical patterns from similar accounts indicate a ${Math.round(Math.random() * 20 + 20)}% probability of expansion within the next 90 days.`,
            `Current deal value is ${formatARR(deal.estValue)} in the ${deal.city} market.`,
          ],
          recommendations: [
            'Schedule a quarterly business review to present usage analytics',
            'Prepare expansion proposal with incremental pricing for additional sites/licenses',
            'Highlight ROI data from existing usage before proposing expansion',
            'Identify the expansion champion internally at the customer',
          ],
          actions: ['Prepare Expansion Proposal', 'Schedule QBR'],
        };
      }
      return {
        summary: `An opportunity has been identified to improve deal outcomes for ${deal.clientName}.`,
        analysis: [card.description],
        recommendations: [
          'Evaluate the suggestion and determine fit with current deal strategy',
          'Discuss with deal owner and customer champion',
          'Document outcome in deal notes',
        ],
        actions: ['Review Suggestion', 'Update Deal Notes'],
      };

    case 'informational':
    default:
      return {
        summary: `Positive update on the ${deal.clientName} deal. No action required at this time.`,
        analysis: [card.description, `Deal is in ${deal.dealStage} stage with ${deal.broker} as broker.`],
        recommendations: [
          'Review update and ensure deal notes are current',
          'Confirm next steps remain on track',
        ],
        actions: ['Acknowledge', 'View Deal Details'],
      };
  }
}

function formatARR(arr: number): string {
  if (arr >= 1_000_000) return `$${(arr / 1_000_000).toFixed(1)}M`;
  if (arr >= 1_000) return `$${(arr / 1_000).toFixed(0)}K`;
  return `$${arr}`;
}

// ─── Section Component ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div
        className="mb-2 uppercase tracking-wide"
        style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIDrawer({
  isOpen,
  onClose,
  isExpanded,
  onToggleExpand,
  agentCard,
  dealContext,
  aiPersona,
}: AIDrawerProps) {
  const width = isExpanded ? 780 : 420;
  const hasContext = !!(agentCard && dealContext);

  const cfg = hasContext
    ? severityConfig[agentCard.severity]
    : severityConfig['suggestion'];
  const { Icon } = cfg;

  const content = hasContext ? getAnalysisContent(agentCard, dealContext) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0, width }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-0 right-0 h-full z-50 bg-white flex flex-col overflow-hidden"
            style={{
              width,
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              borderLeft: `4px solid ${cfg.border}`,
            }}
          >
            {/* ── Header ─────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid #E5E7EB' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-lg w-9 h-9"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <Icon className="h-5 w-5" style={{ color: cfg.text }} />
                </div>
                <div>
                  <div
                    className="font-semibold leading-tight"
                    style={{ fontSize: '15px', color: '#374151', fontFamily: 'Inter, sans-serif' }}
                  >
                    {hasContext ? agentCard.title : 'AI Assistant'}
                  </div>
                  <div
                    style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                  >
                    {hasContext ? agentCard.agent : 'LiquidAI'}
                    {hasContext && (
                      <span style={{ color: cfg.text }}>
                        {' · '}
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: cfg.bg, color: cfg.text }}
                        >
                          {cfg.label}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* ── Scrollable Body ─────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              {hasContext && content ? (
                <div className="px-5 py-5">
                  {/* Deal context strip */}
                  <div
                    className="flex items-center gap-4 rounded-lg px-4 py-3 mb-5"
                    style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                      <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        {dealContext.clientName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: '#E0F0FF', color: '#005B94', fontFamily: 'Inter, sans-serif' }}
                      >
                        {dealContext.dealStage}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                      <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                        {formatARR(dealContext.estValue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
                      <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        {dealContext.closeDate ?? dealContext.lastUpdated}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <Section title="Summary">
                    <div
                      className="rounded-lg px-4 py-3"
                      style={{ backgroundColor: cfg.bg, borderLeft: `3px solid ${cfg.border}` }}
                    >
                      <p style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                        {content.summary}
                      </p>
                    </div>
                  </Section>

                  {/* Analysis */}
                  <Section title="Analysis">
                    <div className="space-y-2">
                      {content.analysis.map((point, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: cfg.text }} />
                          <p style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.55 }}>
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* Recommendations */}
                  <Section title="Recommended Actions">
                    <div className="space-y-2">
                      {content.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                          style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
                        >
                          <span
                            className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
                            style={{
                              backgroundColor: cfg.text,
                              width: '18px',
                              height: '18px',
                              fontFamily: 'Inter, sans-serif',
                              marginTop: '1px',
                            }}
                          >
                            {i + 1}
                          </span>
                          <p style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                            {rec}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* Data context — only shown in expanded mode */}
                  {isExpanded && (
                    <Section title="Deal Data">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Client', value: dealContext.clientName },
                          { label: 'Est. Value', value: formatARR(dealContext.estValue) },
                          { label: 'Broker', value: dealContext.broker },
                          { label: 'Stage', value: dealContext.dealStage },
                          { label: 'Close Date', value: dealContext.closeDate ?? dealContext.lastUpdated },
                          { label: 'Last Updated', value: dealContext.lastUpdated },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-lg px-3 py-2.5"
                            style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
                          >
                            <div
                              style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                            >
                              {label}
                            </div>
                            <div
                              style={{ fontSize: '14px', color: '#374151', fontWeight: 600, fontFamily: 'Inter, sans-serif', marginTop: '2px' }}
                            >
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Timestamp */}
                  <div
                    className="mt-2 mb-1"
                    style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}
                  >
                    Flagged {agentCard.timestamp} · {agentCard.agent}
                  </div>
                </div>
              ) : (
                /* No-context fallback (generic persona mode) */
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <Bot className="h-12 w-12 mb-4" style={{ color: '#D1D5DB' }} />
                  <p
                    style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                  >
                    LiquidAI Assistant
                  </p>
                  <p
                    className="mt-2"
                    style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                  >
                    Select an agent card from a deal row to see AI-powered analysis and recommendations.
                  </p>
                </div>
              )}
            </div>

            {/* ── Footer Actions ──────────────────────────────── */}
            {hasContext && content && (
              <div
                className="flex-shrink-0 px-5 py-4 flex items-center gap-3"
                style={{ borderTop: '1px solid #E5E7EB', backgroundColor: '#FAFAFA' }}
              >
                {content.actions.map((label, i) => (
                  <Button
                    key={label}
                    variant={i === 0 ? 'default' : 'outline'}
                    className={
                      i === 0
                        ? 'text-white font-medium text-sm'
                        : 'border-gray-300 font-medium text-sm'
                    }
                    style={
                      i === 0
                        ? { backgroundColor: cfg.headerBg, fontFamily: 'Inter, sans-serif' }
                        : { fontFamily: 'Inter, sans-serif' }
                    }
                  >
                    {label}
                  </Button>
                ))}
                <button
                  className="ml-auto text-sm hover:underline"
                  style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                  onClick={onClose}
                >
                  Dismiss
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
