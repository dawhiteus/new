import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  Link2,
  Zap,
  ChevronRight,
  X,
  Building2,
  DollarSign,
  BarChart2,
  FileText,
  Users,
  Calendar,
  RefreshCw,
  Eye,
  Plus,
  Sparkles,
  Circle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from './ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = 'connected' | 'derived' | 'uploaded' | 'missing' | 'na';
type QuestionCategory = 'liquidity' | 'profitability' | 'growth' | 'forecasting' | 'operations';
type DocTier = 'tier1' | 'tier2' | 'specific';

interface DocItem {
  name: string;
  cadence: string;
  status: DocStatus;
  source?: string;
  lastUpdated?: string;
}

interface CFOQuestion {
  q: string;
  answer?: string;
  answerType: 'data' | 'partial' | 'missing';
  missingSource?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface Metric {
  label: string;
  value: string;
  sub: string;
  color: string;
  trend?: string;
  trendDir?: 'up' | 'down' | 'neutral';
  Icon: React.ElementType;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const BUSINESS_PROFILE = {
  name: 'Acme SaaS Inc.',
  type: 'SaaS / Subscription',
  stage: 'Growing ($1–$10M)',
  funding: 'VC-backed',
  revenueModel: 'Subscription',
  connected: ['QuickBooks', 'Stripe', 'Chase Business Checking', 'Mercury'],
};

const METRICS: Metric[] = [
  {
    label: 'CASH POSITION',
    value: '$485,000',
    sub: 'Across 2 bank accounts',
    color: '#10B981',
    trend: '+$12,400 this month',
    trendDir: 'up',
    Icon: DollarSign,
  },
  {
    label: 'RUNWAY',
    value: '14.2 mo',
    sub: 'At current burn rate',
    color: '#F59E0B',
    trend: 'Down from 15.8 mo',
    trendDir: 'down',
    Icon: Calendar,
  },
  {
    label: 'MONTHLY BURN',
    value: '$34,200',
    sub: '3-month rolling avg',
    color: '#6B7280',
    trend: '+$1,100 vs last month',
    trendDir: 'down',
    Icon: TrendingDown,
  },
  {
    label: 'MoM REVENUE',
    value: '+8.3%',
    sub: '$127,400 this month',
    color: '#005B94',
    trend: 'Up from +6.1% last mo',
    trendDir: 'up',
    Icon: TrendingUp,
  },
];

const TIER1_DOCS: DocItem[] = [
  { name: 'Cash Flow Statement', cadence: 'Monthly', status: 'derived', source: 'Chase + Mercury', lastUpdated: 'Nov 10, 2025' },
  { name: 'Income Statement (P&L)', cadence: 'Monthly', status: 'connected', source: 'QuickBooks', lastUpdated: 'Nov 10, 2025' },
  { name: 'Balance Sheet', cadence: 'Monthly', status: 'connected', source: 'QuickBooks', lastUpdated: 'Nov 10, 2025' },
  { name: 'Cash Runway Model', cadence: 'Rolling', status: 'derived', source: 'Bank + Payroll', lastUpdated: 'Nov 11, 2025' },
  { name: 'AR Aging Report', cadence: 'Weekly', status: 'missing', source: undefined, lastUpdated: undefined },
  { name: 'AP / Bill Schedule', cadence: 'Weekly', status: 'uploaded', source: 'Manual upload', lastUpdated: 'Nov 5, 2025' },
];

const TIER2_DOCS: DocItem[] = [
  { name: 'Budget vs. Actuals', cadence: 'Monthly', status: 'missing', source: undefined, lastUpdated: undefined },
  { name: 'Headcount & Payroll Summary', cadence: 'Monthly', status: 'uploaded', source: 'ADP export', lastUpdated: 'Nov 1, 2025' },
  { name: 'Revenue by Customer / Segment', cadence: 'Monthly', status: 'derived', source: 'Stripe', lastUpdated: 'Nov 10, 2025' },
  { name: 'Expense Breakdown by Category', cadence: 'Monthly', status: 'connected', source: 'QuickBooks', lastUpdated: 'Nov 10, 2025' },
  { name: 'Rolling Forecast (3–6 mo)', cadence: 'Monthly', status: 'missing', source: undefined, lastUpdated: undefined },
];

const SPECIFIC_DOCS: DocItem[] = [
  { name: 'MRR / ARR Dashboard', cadence: 'Monthly', status: 'derived', source: 'Stripe', lastUpdated: 'Nov 11, 2025' },
  { name: 'Churn Report', cadence: 'Monthly', status: 'missing', source: undefined, lastUpdated: undefined },
  { name: 'LTV / CAC Analysis', cadence: 'Quarterly', status: 'missing', source: undefined, lastUpdated: undefined },
];

const CFO_QUESTIONS: Record<QuestionCategory, CFOQuestion[]> = {
  liquidity: [
    {
      q: 'What is our current cash position?',
      answer: '$485,000 across 2 accounts — Chase Business Checking ($412K) and Mercury ($73K). Net change this month: +$12,400.',
      answerType: 'data',
      trendDir: 'up',
    },
    {
      q: 'What is our monthly burn rate?',
      answer: '$34,200/month (3-month rolling average). Up $1,100 vs. prior month, driven by increased contractor spend.',
      answerType: 'data',
      trendDir: 'neutral',
    },
    {
      q: 'How many months of runway do we have?',
      answer: '14.2 months at current burn. Decreased from 15.8 months last month due to slightly higher spend.',
      answerType: 'data',
      trendDir: 'down',
    },
    {
      q: 'What large payments are due in the next 30 days?',
      answer: 'Payroll: $41,200 (due Nov 15) · AWS: $3,800 (due Nov 22) · Office lease: $8,500 (due Dec 1). Total: $53,500.',
      answerType: 'data',
      trendDir: 'neutral',
    },
    {
      q: 'Which receivables are overdue?',
      answer: undefined,
      answerType: 'missing',
      missingSource: 'Connect an invoicing system or upload your AR aging report to answer this.',
    },
  ],
  profitability: [
    {
      q: 'What is our gross margin?',
      answer: '68.4% this month — up from 65.1% last quarter. Improvement driven by reduced hosting costs.',
      answerType: 'data',
      trendDir: 'up',
    },
    {
      q: 'Are we net profitable this month / quarter / YTD?',
      answer: 'Net loss of $4,200 this month. Q4 YTD net loss: $18,400. Operating near break-even — revenue needs to grow ~$5K/mo to turn profitable.',
      answerType: 'data',
      trendDir: 'down',
    },
    {
      q: 'What is our largest expense category?',
      answer: 'Payroll & contractors: $68,400 (54% of revenue). Software & tools: $8,200. Office & facilities: $9,100.',
      answerType: 'data',
      trendDir: 'neutral',
    },
    {
      q: 'Which products / clients / projects are most profitable?',
      answer: 'Enterprise tier: 74% gross margin. Growth tier: 61% gross margin. Starter tier: 38% gross margin (below target).',
      answerType: 'partial',
    },
  ],
  growth: [
    {
      q: 'How does this month\'s revenue compare to last month and last year?',
      answer: 'Nov 2025: $127,400. Oct 2025: $117,600 (+8.3% MoM). Nov 2024: $89,200 (+42.8% YoY).',
      answerType: 'data',
      trendDir: 'up',
    },
    {
      q: 'What is our MoM and YoY growth rate?',
      answer: 'MoM: +8.3% (up from +6.1% last month). YoY: +42.8%. 3-month average MoM: +6.7%.',
      answerType: 'data',
      trendDir: 'up',
    },
    {
      q: 'Are expenses growing faster or slower than revenue?',
      answer: 'Expenses grew +3.3% MoM vs revenue +8.3% MoM — a healthy ratio. YoY: expenses +28% vs revenue +43%.',
      answerType: 'data',
      trendDir: 'up',
    },
  ],
  forecasting: [
    {
      q: 'What will our cash position be in 3 / 6 / 12 months?',
      answer: '3 mo (Feb 2026): ~$443K · 6 mo (May 2026): ~$348K · 12 mo (Nov 2026): ~$122K. At current trajectory, runway pressure begins around Q3 2026.',
      answerType: 'data',
      trendDir: 'down',
    },
    {
      q: 'Can we afford to hire? What\'s the runway impact?',
      answer: 'Hiring 1 senior engineer (~$12K/mo fully loaded) would reduce runway from 14.2 → 10.8 months. 2 hires: 8.7 months. Requires revenue acceleration to sustain.',
      answerType: 'data',
      trendDir: 'neutral',
    },
    {
      q: 'What revenue do we need to break even?',
      answer: '$132,400/month — approximately $5K more than current. At +8.3% MoM growth, this is ~0.5 months away.',
      answerType: 'data',
      trendDir: 'up',
    },
    {
      q: 'When will we need to raise capital or seek a credit line?',
      answer: undefined,
      answerType: 'missing',
      missingSource: 'Upload a budget or financial model to generate a capital needs forecast.',
    },
  ],
  operations: [
    {
      q: 'What % of revenue is payroll?',
      answer: '54% of revenue (Nov 2025). Slightly above the recommended <50% threshold. Has been declining from 61% six months ago.',
      answerType: 'data',
      trendDir: 'up',
    },
    {
      q: 'Are we collecting on time? (DSO)',
      answer: undefined,
      answerType: 'missing',
      missingSource: 'Connect invoicing system to calculate Days Sales Outstanding.',
    },
    {
      q: 'Are any customers a dangerous % of revenue?',
      answer: 'Top customer: 18% of MRR. Top 3 customers: 41% of MRR. Moderate concentration risk — no single customer above 20%.',
      answerType: 'partial',
    },
  ],
};

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; dot: string; Icon: React.ElementType }> = {
  connected: { label: 'Connected', color: '#059669', bg: '#ECFDF5', dot: '#10B981', Icon: Link2 },
  derived:   { label: 'Derived',   color: '#0369A1', bg: '#EFF6FF', dot: '#3B82F6', Icon: Zap },
  uploaded:  { label: 'Uploaded',  color: '#0694A2', bg: '#F0FDFA', dot: '#0694A2', Icon: Upload },
  missing:   { label: 'Missing',   color: '#B91C1C', bg: '#FEF2F2', dot: '#EF4444', Icon: AlertTriangle },
  na:        { label: 'N/A',       color: '#6B7280', bg: '#F9FAFB', dot: '#D1D5DB', Icon: Circle },
};

const QUESTION_TABS: { id: QuestionCategory; label: string }[] = [
  { id: 'liquidity',    label: 'Liquidity' },
  { id: 'profitability', label: 'Profitability' },
  { id: 'growth',       label: 'Growth' },
  { id: 'forecasting',  label: 'Forecasting' },
  { id: 'operations',   label: 'Operations' },
];

const DOC_TABS: { id: DocTier; label: string; count: (docs: DocItem[]) => string }[] = [
  { id: 'tier1',    label: 'Tier 1 — Core',        count: (docs) => `${docs.filter(d => d.status !== 'missing').length}/${docs.length}` },
  { id: 'tier2',    label: 'Tier 2 — Operational',  count: (docs) => `${docs.filter(d => d.status !== 'missing').length}/${docs.length}` },
  { id: 'specific', label: 'SaaS-Specific',          count: (docs) => `${docs.filter(d => d.status !== 'missing').length}/${docs.length}` },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DocRow({ doc }: { doc: DocItem }) {
  const cfg = STATUS_CONFIG[doc.status];
  const { Icon } = cfg;

  return (
    <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
          {doc.name}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          {doc.cadence}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
            color: cfg.color, backgroundColor: cfg.bg,
            borderRadius: '999px', padding: '3px 10px',
          }}
        >
          <Icon className="h-3 w-3" />
          {cfg.label}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
          {doc.source || '—'}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
          {doc.lastUpdated || '—'}
        </span>
      </td>
      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
        {doc.status === 'missing' ? (
          <button
            style={{
              fontSize: '12px', fontWeight: 500, color: '#005B94',
              border: '1px solid #005B94', borderRadius: '6px',
              padding: '4px 10px', background: 'transparent',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Upload className="h-3 w-3" />
            Upload
          </button>
        ) : (
          <button
            style={{
              fontSize: '12px', fontWeight: 500, color: '#374151',
              border: '1px solid #E5E7EB', borderRadius: '6px',
              padding: '4px 10px', background: 'transparent',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Eye className="h-3 w-3" />
            View
          </button>
        )}
      </td>
    </tr>
  );
}

function QuestionCard({ item }: { item: CFOQuestion }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        border: '1px solid #E5E7EB', borderRadius: '10px',
        padding: '16px 20px', backgroundColor: '#FFFFFF',
        cursor: 'pointer', transition: 'box-shadow 0.15s',
        marginBottom: '8px',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          {/* Status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
              backgroundColor:
                item.answerType === 'data'    ? '#10B981' :
                item.answerType === 'partial' ? '#F59E0B' : '#EF4444',
            }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
              {item.q}
            </span>
          </div>

          {/* Answer or CTA */}
          {item.answerType === 'missing' ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', color: '#B91C1C', fontFamily: 'Inter, sans-serif',
              marginLeft: '16px',
            }}>
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {item.missingSource}
            </div>
          ) : (
            <p style={{
              fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif',
              lineHeight: '1.5', marginLeft: '16px',
            }}>
              {item.answer}
            </p>
          )}
        </div>

        {/* Trend icon */}
        {item.trendDir && item.answerType !== 'missing' && (
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            {item.trendDir === 'up' && <ArrowUpRight className="h-4 w-4" style={{ color: '#10B981' }} />}
            {item.trendDir === 'down' && <ArrowDownRight className="h-4 w-4" style={{ color: '#EF4444' }} />}
          </div>
        )}
      </div>

      {/* Ask AI chip */}
      {item.answerType !== 'missing' && (
        <div style={{ marginTop: '10px', marginLeft: '16px' }}>
          <button
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 500, color: '#005B94',
              background: '#EFF6FF', borderRadius: '999px',
              padding: '3px 10px', border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Sparkles className="h-3 w-3" />
            Ask AI for more detail
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF', borderRadius: '16px', width: '480px',
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Modal header */}
        <div style={{ background: 'linear-gradient(135deg, #004A7C, #005B94, #0071B8)', borderRadius: '16px 16px 0 0', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Business Profile
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif', margin: '4px 0 0' }}>
                Tailor your CFO dashboard to your business
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#FFFFFF' }}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '24px' }}>
          {[
            {
              label: 'Revenue Model',
              options: ['Subscription', 'Project-based', 'Product sales', 'Services', 'Mixed'],
              defaultVal: 'Subscription',
            },
            {
              label: 'Business Stage',
              options: ['Pre-revenue', 'Early (under $1M)', 'Growing ($1–$10M)', 'Scaling (over $10M)'],
              defaultVal: 'Growing ($1–$10M)',
            },
            {
              label: 'Cost Structure',
              options: ['Mostly people', 'Mostly COGS', 'Mostly fixed overhead', 'Mixed'],
              defaultVal: 'Mostly people',
            },
            {
              label: 'Funding Status',
              options: ['Bootstrapped', 'VC-backed', 'Debt-financed', 'Mixed'],
              defaultVal: 'VC-backed',
            },
          ].map(({ label, options, defaultVal }) => (
            <div key={label} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '6px' }}>
                {label}
              </label>
              <select
                defaultValue={defaultVal}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid #D1D5DB', fontSize: '14px', fontFamily: 'Inter, sans-serif',
                  color: '#111827', background: '#FFFFFF', outline: 'none',
                }}
              >
                {options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{ padding: '8px 18px', border: '1px solid #D1D5DB', borderRadius: '8px', background: '#FFFFFF', fontSize: '14px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', color: '#374151' }}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              style={{ padding: '8px 18px', border: 'none', borderRadius: '8px', background: '#005B94', fontSize: '14px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', color: '#FFFFFF', fontWeight: 600 }}
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CFODashboard({ isAIDrawerOpen }: { isAIDrawerOpen?: boolean }) {
  const [activeQuestion, setActiveQuestion] = useState<QuestionCategory>('liquidity');
  const [activeDocTab, setActiveDocTab] = useState<DocTier>('tier1');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const docsByTier: Record<DocTier, DocItem[]> = {
    tier1: TIER1_DOCS,
    tier2: TIER2_DOCS,
    specific: SPECIFIC_DOCS,
  };

  const currentDocs = docsByTier[activeDocTab];
  const missingCount = currentDocs.filter(d => d.status === 'missing').length;
  const totalDocs = TIER1_DOCS.length + TIER2_DOCS.length + SPECIFIC_DOCS.length;
  const connectedDocs = [...TIER1_DOCS, ...TIER2_DOCS, ...SPECIFIC_DOCS].filter(d => d.status !== 'missing').length;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F3F4F6',
        fontFamily: 'Inter, sans-serif',
        paddingRight: isAIDrawerOpen ? '424px' : '0',
        transition: 'padding-right 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #004A7C 0%, #005B94 60%, #0071B8 100%)', padding: '28px 32px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.3px', marginBottom: '4px' }}>
              Financial Intelligence
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
              CFO dashboard for {BUSINESS_PROFILE.name}
            </p>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#FFFFFF', fontSize: '14px', fontWeight: 500,
              borderRadius: '8px', padding: '8px 16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <Building2 className="h-4 w-4" />
            Configure Profile
          </button>
        </div>

        {/* Business profile pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[BUSINESS_PROFILE.type, BUSINESS_PROFILE.stage, BUSINESS_PROFILE.funding].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.9)',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '999px', padding: '3px 10px',
              }}
            >
              {tag}
            </span>
          ))}
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', alignSelf: 'center', marginLeft: '4px' }}>
            Connected: {BUSINESS_PROFILE.connected.join(' · ')}
          </span>
        </div>
      </div>

      {/* ── Metric Cards ─────────────────────────────────────────────── */}
      <div style={{ padding: '24px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {METRICS.map((m) => (
            <div
              key={m.label}
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {m.label}
                </span>
                <m.Icon className="h-4 w-4" style={{ color: m.color }} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: m.color, letterSpacing: '-0.5px', marginBottom: '4px' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px' }}>{m.sub}</div>
              {m.trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: m.trendDir === 'up' ? '#10B981' : m.trendDir === 'down' ? '#EF4444' : '#9CA3AF' }}>
                  {m.trendDir === 'up' && <ArrowUpRight className="h-3 w-3" />}
                  {m.trendDir === 'down' && <ArrowDownRight className="h-3 w-3" />}
                  {m.trend}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Document Health + CFO Questions ─────────────────────────── */}
      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', alignItems: 'start' }}>

        {/* Document Health */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Document Health</h2>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                {connectedDocs} of {totalDocs} documents available
              </p>
            </div>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '12px', fontWeight: 500, color: '#005B94',
                border: '1px solid #005B94', borderRadius: '7px',
                padding: '5px 10px', background: 'transparent', cursor: 'pointer',
              }}
            >
              <Plus className="h-3 w-3" />
              Upload
            </button>
          </div>

          {/* Doc tier tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 20px' }}>
            {DOC_TABS.map((tab) => {
              const docs = docsByTier[tab.id];
              const active = activeDocTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocTab(tab.id)}
                  style={{
                    padding: '10px 0', marginRight: '20px',
                    fontSize: '13px', fontWeight: active ? 600 : 400,
                    color: active ? '#005B94' : '#6B7280',
                    background: 'transparent', border: 'none',
                    borderBottom: active ? '2px solid #005B94' : '2px solid transparent',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    color: active ? '#005B94' : '#9CA3AF',
                    backgroundColor: active ? '#EFF6FF' : '#F3F4F6',
                    borderRadius: '999px', padding: '1px 6px',
                  }}>
                    {tab.count(docs)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Missing docs banner */}
          {missingCount > 0 && (
            <div style={{ padding: '10px 20px', backgroundColor: '#FEF2F2', borderBottom: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle className="h-3.5 w-3.5" style={{ color: '#B91C1C', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#B91C1C', fontFamily: 'Inter, sans-serif' }}>
                {missingCount} document{missingCount > 1 ? 's' : ''} missing — some CFO questions can't be answered.
              </span>
            </div>
          )}

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                {['Document', 'Cadence', 'Status', 'Source', 'Updated', ''].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '9px 16px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 600, color: '#9CA3AF',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentDocs.map((doc) => <DocRow key={doc.name} doc={doc} />)}
            </tbody>
          </table>

          {/* Legend */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {(['connected', 'derived', 'uploaded', 'missing'] as DocStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: cfg.dot, display: 'inline-block', flexShrink: 0 }} />
                  {cfg.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* CFO Questions */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>CFO Questions</h2>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Answers derived from your connected sources</p>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: '#6B7280' }}>Answered</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block', marginLeft: '6px' }} />
              <span style={{ fontSize: '12px', color: '#6B7280' }}>Needs data</span>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 20px', overflowX: 'auto' }}>
            {QUESTION_TABS.map((tab) => {
              const active = activeQuestion === tab.id;
              const qs = CFO_QUESTIONS[tab.id];
              const unanswered = qs.filter(q => q.answerType === 'missing').length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveQuestion(tab.id)}
                  style={{
                    padding: '10px 0', marginRight: '20px', whiteSpace: 'nowrap',
                    fontSize: '13px', fontWeight: active ? 600 : 400,
                    color: active ? '#005B94' : '#6B7280',
                    background: 'transparent', border: 'none',
                    borderBottom: active ? '2px solid #005B94' : '2px solid transparent',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {tab.label}
                  {unanswered > 0 && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      color: '#B91C1C', backgroundColor: '#FEF2F2',
                      borderRadius: '999px', padding: '1px 5px',
                    }}>
                      {unanswered}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Question cards */}
          <div style={{ padding: '16px 20px', maxHeight: '520px', overflowY: 'auto' }}>
            {CFO_QUESTIONS[activeQuestion].map((item) => (
              <QuestionCard key={item.q} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Profile modal */}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </div>
  );
}
