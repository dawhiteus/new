import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Eye,
  TrendingUp,
  TrendingDown,
  FileText,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { DealDetailsModal } from './DealDetailsModal';
import { CreateEditDealModal } from './CreateEditDealModal';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AgentCard {
  id: string;
  severity: 'informational' | 'suggestion' | 'needs-review' | 'escalation';
  title: string;
  description: string;
  timestamp: string;
  agent: string;
}

export interface Deal {
  id: string;
  dealName: string;
  clientName: string;
  city: string;
  workspaceType: string;
  dealStage: string;
  size: number;
  estValue: number;
  status: string;
  lastUpdated: string;
  broker: string;
  closeDate?: string;
  notes?: string;
  aiAgents?: AgentCard[];
}

interface BrokerFlowProps {
  onAIAssistantOpen?: (agentCard: AgentCard, deal: Deal) => void;
  isAIDrawerOpen?: boolean;
  highlightedDealId?: string | null;
}

// ─── Stage badge colors ───────────────────────────────────────────────────────

const stageBadgeStyles: Record<string, { backgroundColor: string; color: string }> = {
  Intake:      { backgroundColor: '#1E3A5F', color: '#FFFFFF' },
  Evaluation:  { backgroundColor: '#0369A1', color: '#FFFFFF' },
  Proposal:    { backgroundColor: '#7C3AED', color: '#FFFFFF' },
  Negotiation: { backgroundColor: '#EA580C', color: '#FFFFFF' },
  Contracting: { backgroundColor: '#2563EB', color: '#FFFFFF' },
  Execution:   { backgroundColor: '#059669', color: '#FFFFFF' },
};

function getStageBadgeStyle(stage: string) {
  return stageBadgeStyles[stage] ?? { backgroundColor: '#6B7280', color: '#FFFFFF' };
}

// ─── Status badge colors ──────────────────────────────────────────────────────

const statusBadgeStyles: Record<string, { backgroundColor: string; color: string }> = {
  Draft:    { backgroundColor: '#9CA3AF', color: '#FFFFFF' },
  Active:   { backgroundColor: '#10B981', color: '#FFFFFF' },
  Executed: { backgroundColor: '#059669', color: '#FFFFFF' },
  Archived: { backgroundColor: '#6B7280', color: '#FFFFFF' },
};

function getStatusBadgeStyle(status: string) {
  return statusBadgeStyles[status] ?? { backgroundColor: '#9CA3AF', color: '#FFFFFF' };
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_DEALS: Deal[] = [
  {
    id: '1',
    dealName: 'Tel Tech NYC Expansion',
    clientName: 'Tel Tech',
    city: 'New York',
    workspaceType: 'Dedicated Desk',
    dealStage: 'Negotiation',
    size: 5000,
    estValue: 125000,
    status: 'Active',
    lastUpdated: '2025-11-10',
    broker: 'Sarah Chen',
    closeDate: 'Dec 1, 2025',
  },
  {
    id: '2',
    dealName: 'Tech Ventures SF Office',
    clientName: 'Tech Ventures',
    city: 'San Francisco',
    workspaceType: 'Hot Desk',
    dealStage: 'Intake',
    size: 2000,
    estValue: 98000,
    status: 'Active',
    lastUpdated: '2025-11-09',
    broker: 'Michael Torres',
    closeDate: 'Jan 15, 2026',
  },
  {
    id: '3',
    dealName: 'Global Finance Boston Hub',
    clientName: 'Global Finance Corp',
    city: 'Boston',
    workspaceType: 'Team Suite',
    dealStage: 'Proposal',
    size: 8000,
    estValue: 240000,
    status: 'Active',
    lastUpdated: '2025-11-08',
    broker: 'Sarah Chen',
    closeDate: 'Dec 20, 2025',
  },
  {
    id: '4',
    dealName: 'StartupX Austin Space',
    clientName: 'StartupX',
    city: 'Austin',
    workspaceType: 'Private Office',
    dealStage: 'Contracting',
    size: 1200,
    estValue: 45000,
    status: 'Active',
    lastUpdated: '2025-11-11',
    broker: 'Michael Torres',
    closeDate: 'Nov 30, 2025',
  },
  {
    id: '5',
    dealName: 'MediaCo Chicago Office',
    clientName: 'MediaCo',
    city: 'Chicago',
    workspaceType: 'Team Suite',
    dealStage: 'Intake',
    size: 4000,
    estValue: 115000,
    status: 'Active',
    lastUpdated: '2025-11-06',
    broker: 'Michael Torres',
    closeDate: 'Feb 1, 2026',
  },
  {
    id: '6',
    dealName: 'HealthTech Seattle Workspace',
    clientName: 'HealthTech Inc',
    city: 'Seattle',
    workspaceType: 'Private Office',
    dealStage: 'Execution',
    size: 3000,
    estValue: 75000,
    status: 'Archived',
    lastUpdated: '2025-11-05',
    broker: 'Sarah Chen',
    closeDate: 'Nov 5, 2025',
  },
];

// ─── Metric Cards ─────────────────────────────────────────────────────────────

const METRICS = [
  {
    label: 'PIPELINE VALUE',
    value: '$10.75M',
    valueColor: '#10B981',
    sub: 'Unsigned requirements in progress',
    Icon: TrendingUp,
    iconColor: '#10B981',
  },
  {
    label: 'ACTIVE REQUIREMENTS',
    value: '23',
    valueColor: '#0694A2',
    sub: 'Moving through workflow',
    Icon: FileText,
    iconColor: '#0694A2',
  },
  {
    label: 'AT RISK',
    value: '4',
    valueColor: '#F59E0B',
    sub: 'Require immediate attention',
    Icon: AlertCircle,
    iconColor: '#F59E0B',
  },
  {
    label: 'MEDIAN CLOSE TIME',
    value: '32 days',
    valueColor: '#1E3A5F',
    sub: 'Intake to signed agreement',
    Icon: Clock,
    iconColor: '#3B82F6',
  },
  {
    label: 'VS MARKET RATE',
    value: '−8%',
    valueColor: '#7C3AED',
    sub: 'Below comparable pricing',
    Icon: TrendingDown,
    iconColor: '#EC4899',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEstValue(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
}

const ALL_STAGES = ['Intake', 'Evaluation', 'Proposal', 'Negotiation', 'Contracting', 'Execution'];
const ALL_STATUSES = ['Draft', 'Active', 'Executed', 'Archived'];

// ─── Actions dropdown ─────────────────────────────────────────────────────────

function ActionsMenu({ onView }: { onView: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        style={{ color: '#9CA3AF' }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-8 z-50 rounded-lg bg-white py-1 shadow-lg"
          style={{ border: '1px solid #E5E7EB', minWidth: '170px' }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onView(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#005B94' }}
          >
            <Eye className="h-3.5 w-3.5" />
            View Requirement
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BrokerFlow({ isAIDrawerOpen }: BrokerFlowProps) {
  const [deals] = useState<Deal[]>(SAMPLE_DEALS);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editDeal, setEditDeal] = useState<Deal | undefined>(undefined);

  const cities = Array.from(new Set(deals.map((d) => d.city))).sort();

  const filtered = deals.filter((d) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      d.dealName.toLowerCase().includes(q) ||
      d.clientName.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.broker.toLowerCase().includes(q);
    const matchesStage  = !stageFilter  || d.dealStage === stageFilter;
    const matchesStatus = !statusFilter || d.status    === statusFilter;
    const matchesCity   = !cityFilter   || d.city      === cityFilter;
    return matchesSearch && matchesStage && matchesStatus && matchesCity;
  });

  function openDeal(deal: Deal) {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
  }

  function openEditDeal(deal: Deal) {
    setEditDeal(deal);
    setIsCreateOpen(true);
  }

  function openNewDeal() {
    setEditDeal(undefined);
    setIsCreateOpen(true);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#F3F4F6',
        fontFamily: 'Inter, sans-serif',
        paddingRight: isAIDrawerOpen ? '424px' : '0',
        transition: 'padding-right 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #004A7C 0%, #005B94 60%, #0071B8 100%)',
          padding: '28px 32px 32px',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
                marginBottom: '4px',
              }}
            >
              Transactions
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
              Manage your workspace requirements and track opportunities.
            </p>
          </div>
          <Button
            onClick={openNewDeal}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              padding: '8px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="hover:bg-white/25 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Requirement
          </Button>
        </div>
      </div>

      {/* ── Metric Cards ────────────────────────────────────────────── */}
      <div style={{ padding: '24px 32px 0' }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl bg-white flex flex-col"
              style={{ padding: '18px 20px 14px', border: '1px solid #E5E7EB', minHeight: '116px' }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#9CA3AF',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: m.valueColor,
                  letterSpacing: '-0.5px',
                  marginBottom: '4px',
                  lineHeight: 1.1,
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.4, flex: 1 }}>
                {m.sub}
              </div>
              <div style={{ marginTop: '10px' }}>
                <m.Icon className="h-4 w-4" style={{ color: m.iconColor }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Table Container ─────────────────────────────────────────── */}
      <div style={{ padding: '24px 32px' }}>
        <div
          className="rounded-xl bg-white"
          style={{ border: '1px solid #E5E7EB', overflow: 'hidden' }}
        >
          {/* Search + Filters */}
          <div
            className="flex items-center gap-3"
            style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: '#9CA3AF' }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search deals by client, city, broker..."
                className="w-full rounded-lg pl-9 pr-4 py-2 outline-none"
                style={{
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <FilterSelect value={stageFilter}  onChange={setStageFilter}  placeholder="All Stages"   options={ALL_STAGES}  />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} placeholder="All Statuses" options={ALL_STATUSES} />
            <FilterSelect value={cityFilter}   onChange={setCityFilter}   placeholder="All Cities"   options={cities}     />
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {[
                  { label: 'TRANSACTION NAME', width: '22%' },
                  { label: 'CLIENT NAME',       width: '14%' },
                  { label: 'BROKER',            width: '13%' },
                  { label: 'STATUS',            width: '9%'  },
                  { label: 'STAGE',             width: '11%' },
                  { label: 'EST. VALUE',        width: '10%' },
                  { label: 'LAST UPDATED',      width: '10%' },
                  { label: 'ACTIONS',           width: '6%'  },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      width: col.width,
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#6B7280',
                      letterSpacing: '0.06em',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: '48px 20px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#9CA3AF',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((deal, idx) => (
                  <DealRow
                    key={deal.id}
                    deal={deal}
                    isLast={idx === filtered.length - 1}
                    onClick={() => openDeal(deal)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      {selectedDeal && (
        <DealDetailsModal
          deal={selectedDeal}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}

      <CreateEditDealModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        deal={editDeal}
      />
    </div>
  );
}

// ─── Deal Row ─────────────────────────────────────────────────────────────────

function DealRow({
  deal,
  isLast,
  onClick,
}: {
  deal: Deal;
  isLast: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const stageBadge  = getStageBadgeStyle(deal.dealStage);
  const statusBadge = getStatusBadgeStyle(deal.status);

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? 'none' : '1px solid #E5E7EB',
        backgroundColor: hovered ? '#F9FAFB' : '#FFFFFF',
        cursor: 'pointer',
        transition: 'background-color 0.12s',
      }}
    >
      {/* Transaction Name */}
      <td style={{ padding: '14px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
          {deal.dealName}
        </span>
      </td>

      {/* Client Name */}
      <td style={{ padding: '14px 16px' }}>
        <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
          {deal.clientName}
        </span>
      </td>

      {/* Broker */}
      <td style={{ padding: '14px 16px' }}>
        <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
          {deal.broker}
        </span>
      </td>

      {/* Status Badge */}
      <td style={{ padding: '14px 16px' }}>
        <span
          style={{
            ...statusBadge,
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            borderRadius: '999px',
            padding: '3px 10px',
            whiteSpace: 'nowrap',
          }}
        >
          {deal.status}
        </span>
      </td>

      {/* Stage Badge */}
      <td style={{ padding: '14px 16px' }}>
        <span
          style={{
            ...stageBadge,
            display: 'inline-block',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            borderRadius: '999px',
            padding: '3px 10px',
            whiteSpace: 'nowrap',
          }}
        >
          {deal.dealStage}
        </span>
      </td>

      {/* Est. Value */}
      <td style={{ padding: '14px 16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
          {formatEstValue(deal.estValue)}
        </span>
      </td>

      {/* Last Updated */}
      <td style={{ padding: '14px 16px' }}>
        <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          {deal.lastUpdated}
        </span>
      </td>

      {/* Actions */}
      <td style={{ padding: '14px 8px 14px 0' }} onClick={(e) => e.stopPropagation()}>
        <ActionsMenu onView={onClick} />
      </td>
    </tr>
  );
}

// ─── Filter Select ────────────────────────────────────────────────────────────

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 transition-colors"
        style={{
          border: '1px solid #E5E7EB',
          fontSize: '14px',
          color: value ? '#374151' : '#6B7280',
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        {value || placeholder}
        <ChevronDown className="h-4 w-4" style={{ color: '#9CA3AF' }} />
      </button>
      {open && (
        <div
          className="absolute left-0 top-10 z-30 rounded-lg bg-white py-1 shadow-lg"
          style={{ border: '1px solid #E5E7EB', minWidth: '160px' }}
        >
          <button
            onClick={() => { onChange(''); setOpen(false); }}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              style={{
                fontSize: '13px',
                color: value === opt ? '#005B94' : '#374151',
                fontWeight: value === opt ? 600 : 400,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
