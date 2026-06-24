import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { toast } from './ui/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Eye,
  FolderOpen,
  FolderPlus,
  TrendingUp,
  FileText,
  CircleDot,
  Zap,
  MapPin,
  Users,
  DollarSign,
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
  Draft:          { backgroundColor: '#0E7490', color: '#FFFFFF' },
  Active:         { backgroundColor: '#16A34A', color: '#FFFFFF' },
  Executed:       { backgroundColor: '#16A34A', color: '#FFFFFF' },
  Archived:       { backgroundColor: '#6B7280', color: '#FFFFFF' },
  Expired:        { backgroundColor: '#6B7280', color: '#FFFFFF' },
  'Expiring Soon':  { backgroundColor: '#D97706', color: '#FFFFFF' },
  'Pending Review': { backgroundColor: '#0E7490', color: '#FFFFFF' },
};

function getStatusBadgeStyle(status: string) {
  return statusBadgeStyles[status] ?? { backgroundColor: '#9CA3AF', color: '#FFFFFF' };
}

// ─── Collection Assessment Mock Data ─────────────────────────────────────────

const MOCK_ASSESSMENTS: Record<string, {
  strong: number;
  partial: number;
  weak: number;
  inMarket: number;
  withinBudget: number;
  sizeMatch: number;
  location: string;
  headcount: string;
  budget: string;
  lastAssessed: string;
  collectionName: string;
}> = {
  '1': {
    strong: 4,
    partial: 6,
    weak: 2,
    inMarket: 8,
    withinBudget: 6,
    sizeMatch: 7,
    location: 'Midtown Manhattan',
    headcount: '35–40 people',
    budget: '$18,000/mo',
    lastAssessed: 'Nov 9, 2024',
    collectionName: 'NYC Executive Suites',
  },
  '3': {
    strong: 2,
    partial: 5,
    weak: 4,
    inMarket: 5,
    withinBudget: 4,
    sizeMatch: 6,
    location: 'Back Bay, Boston',
    headcount: '70–80 people',
    budget: '$32,000/mo',
    lastAssessed: 'Nov 7, 2024',
    collectionName: 'Boston Back Bay Offices',
  },
  '4': {
    strong: 5,
    partial: 3,
    weak: 1,
    inMarket: 7,
    withinBudget: 6,
    sizeMatch: 6,
    location: 'Financial District, SF',
    headcount: '20–25 people',
    budget: '$12,500/mo',
    lastAssessed: 'Nov 5, 2024',
    collectionName: 'SF Financial District Pack',
  },
  '7': {
    strong: 6,
    partial: 4,
    weak: 1,
    inMarket: 9,
    withinBudget: 7,
    sizeMatch: 8,
    location: 'Park Avenue, NYC',
    headcount: '180–200 people',
    budget: '$210,000/mo',
    lastAssessed: 'Nov 12, 2024',
    collectionName: 'NYC Tier-1 Tower Suites',
  },
  '9': {
    strong: 3,
    partial: 5,
    weak: 3,
    inMarket: 6,
    withinBudget: 5,
    sizeMatch: 6,
    location: 'Uptown Dallas',
    headcount: '90–110 people',
    budget: '$88,000/mo',
    lastAssessed: 'Nov 10, 2024',
    collectionName: 'Dallas Premium Offices',
  },
  '11': {
    strong: 7,
    partial: 3,
    weak: 0,
    inMarket: 9,
    withinBudget: 8,
    sizeMatch: 9,
    location: 'Seaport, Boston',
    headcount: '55–65 people',
    budget: '$48,000/mo',
    lastAssessed: 'Nov 11, 2024',
    collectionName: 'Boston Innovation District',
  },
  '15': {
    strong: 4,
    partial: 4,
    weak: 2,
    inMarket: 7,
    withinBudget: 5,
    sizeMatch: 6,
    location: 'Energy Corridor, Houston',
    headcount: '45–55 people',
    budget: '$38,000/mo',
    lastAssessed: 'Nov 8, 2024',
    collectionName: 'Houston Energy Corridor Pack',
  },
};

type CollectionAssessment = (typeof MOCK_ASSESSMENTS)[string];

function generateMockAssessment(deal: Deal, name?: string): CollectionAssessment {
  const strong = deal.size >= 5000 ? 4 : deal.size >= 2000 ? 3 : 2;
  const partial = Math.max(2, 6 - strong);
  const weak = 2;
  const total = strong + partial + weak;
  const seed = Number(deal.id) || 5;
  const inMarket    = Math.max(1, Math.round(total * (0.55 + (seed % 5) * 0.07)));
  const withinBudget = Math.max(1, Math.round(total * (0.45 + (seed % 3) * 0.09)));
  const sizeMatch   = Math.max(1, Math.round(total * (0.50 + (seed % 4) * 0.08)));
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return {
    strong,
    partial,
    weak,
    inMarket,
    withinBudget,
    sizeMatch,
    location: deal.city,
    headcount: `${Math.floor(deal.size / 150)}–${Math.ceil(deal.size / 100)} people`,
    budget: `$${(Math.round(deal.estValue / 1200) * 100).toLocaleString()}/mo`,
    lastAssessed: today,
    collectionName: name || `${deal.city} Collection`,
  };
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_DEALS: Deal[] = [
  {
    id: '1',
    dealName: 'Tel Tech NYC Expansion',
    clientName: 'Tel Tech',
    city: 'New York',
    workspaceType: 'Office Suite',
    dealStage: 'Negotiation',
    size: 5000,
    estValue: 125000,
    status: 'Active',
    lastUpdated: '2026-06-10',
    broker: 'Sarah Chen',
    closeDate: 'Aug 1, 2026',
  },
  {
    id: '7',
    dealName: 'JPMorgan Chase NYC Trading Floor',
    clientName: 'JPMorgan Chase',
    city: 'New York',
    workspaceType: 'Headquarters',
    dealStage: 'Negotiation',
    size: 22000,
    estValue: 2100000,
    status: 'Active',
    lastUpdated: '2026-06-12',
    broker: 'Sarah Chen',
    closeDate: 'Sep 15, 2026',
  },
  {
    id: '8',
    dealName: 'Amazon Seattle HQ Phase 2',
    clientName: 'Amazon',
    city: 'Seattle',
    workspaceType: 'Headquarters',
    dealStage: 'Evaluation',
    size: 18500,
    estValue: 1800000,
    status: 'Active',
    lastUpdated: '2026-06-11',
    broker: 'Michael Torres',
    closeDate: 'Oct 1, 2026',
  },
  {
    id: '9',
    dealName: 'Goldman Sachs Dallas Operations',
    clientName: 'Goldman Sachs',
    city: 'Dallas',
    workspaceType: 'Office Suite',
    dealStage: 'Proposal',
    size: 9800,
    estValue: 920000,
    status: 'Active',
    lastUpdated: '2026-06-09',
    broker: 'Sarah Chen',
    closeDate: 'Sep 30, 2026',
  },
  {
    id: '10',
    dealName: 'Deloitte Chicago Regional Hub',
    clientName: 'Deloitte',
    city: 'Chicago',
    workspaceType: 'Headquarters',
    dealStage: 'Proposal',
    size: 7200,
    estValue: 680000,
    status: 'Active',
    lastUpdated: '2026-06-08',
    broker: 'Michael Torres',
    closeDate: 'Aug 30, 2026',
  },
  {
    id: '11',
    dealName: 'Microsoft Boston Innovation Center',
    clientName: 'Microsoft',
    city: 'Boston',
    workspaceType: 'Office Suite',
    dealStage: 'Contracting',
    size: 5500,
    estValue: 520000,
    status: 'Active',
    lastUpdated: '2026-06-13',
    broker: 'Sarah Chen',
    closeDate: 'Jul 15, 2026',
  },
  {
    id: '12',
    dealName: 'BlackRock NYC Asset Management',
    clientName: 'BlackRock',
    city: 'New York',
    workspaceType: 'Office Suite',
    dealStage: 'Proposal',
    size: 5000,
    estValue: 495000,
    status: 'Active',
    lastUpdated: '2026-06-07',
    broker: 'Jessica Park',
    closeDate: 'Oct 15, 2026',
  },
  {
    id: '13',
    dealName: 'Pfizer Boston Life Sciences Suite',
    clientName: 'Pfizer',
    city: 'Boston',
    workspaceType: 'Coworking',
    dealStage: 'Proposal',
    size: 4200,
    estValue: 420000,
    status: 'Active',
    lastUpdated: '2026-06-06',
    broker: 'Jessica Park',
    closeDate: 'Nov 1, 2026',
  },
  {
    id: '14',
    dealName: 'Johnson & Johnson NYC Advisory Hub',
    clientName: 'Johnson & Johnson',
    city: 'New York',
    workspaceType: 'Private Office',
    dealStage: 'Evaluation',
    size: 4000,
    estValue: 415000,
    status: 'Active',
    lastUpdated: '2026-06-05',
    broker: 'Sarah Chen',
    closeDate: 'Nov 15, 2026',
  },
  {
    id: '15',
    dealName: 'IBM Houston Energy Sector',
    clientName: 'IBM',
    city: 'Houston',
    workspaceType: 'Office Suite',
    dealStage: 'Negotiation',
    size: 4100,
    estValue: 412000,
    status: 'Active',
    lastUpdated: '2026-06-10',
    broker: 'Michael Torres',
    closeDate: 'Aug 20, 2026',
  },
  {
    id: '16',
    dealName: 'Cisco Austin Engineering Center',
    clientName: 'Cisco',
    city: 'Austin',
    workspaceType: 'Office Suite',
    dealStage: 'Negotiation',
    size: 3600,
    estValue: 365000,
    status: 'Active',
    lastUpdated: '2026-06-09',
    broker: 'Michael Torres',
    closeDate: 'Aug 10, 2026',
  },
  {
    id: '17',
    dealName: 'BCG Washington DC Office',
    clientName: 'Boston Consulting Group',
    city: 'Washington DC',
    workspaceType: 'Coworking',
    dealStage: 'Intake',
    size: 3200,
    estValue: 345000,
    status: 'Active',
    lastUpdated: '2026-06-04',
    broker: 'Jessica Park',
    closeDate: 'Dec 1, 2026',
  },
  {
    id: '18',
    dealName: 'Salesforce Miami Hub',
    clientName: 'Salesforce',
    city: 'Miami',
    workspaceType: 'Private Office',
    dealStage: 'Evaluation',
    size: 3000,
    estValue: 310000,
    status: 'Active',
    lastUpdated: '2026-06-03',
    broker: 'Sarah Chen',
    closeDate: 'Nov 30, 2026',
  },
  {
    id: '19',
    dealName: 'Oracle Los Angeles Regional Office',
    clientName: 'Oracle',
    city: 'Los Angeles',
    workspaceType: 'Office Suite',
    dealStage: 'Intake',
    size: 2800,
    estValue: 290000,
    status: 'Active',
    lastUpdated: '2026-06-02',
    broker: 'Michael Torres',
    closeDate: 'Jan 15, 2027',
  },
  {
    id: '20',
    dealName: 'Vanguard Philadelphia Operations',
    clientName: 'Vanguard',
    city: 'Philadelphia',
    workspaceType: 'Headquarters',
    dealStage: 'Contracting',
    size: 2700,
    estValue: 285000,
    status: 'Active',
    lastUpdated: '2026-06-11',
    broker: 'Sarah Chen',
    closeDate: 'Jul 31, 2026',
  },
  {
    id: '21',
    dealName: 'Accenture Denver Technology Hub',
    clientName: 'Accenture',
    city: 'Denver',
    workspaceType: 'Coworking',
    dealStage: 'Intake',
    size: 2400,
    estValue: 245000,
    status: 'Active',
    lastUpdated: '2026-06-01',
    broker: 'Jessica Park',
    closeDate: 'Jan 1, 2027',
  },
  {
    id: '3',
    dealName: 'Global Finance Boston Hub',
    clientName: 'Global Finance Corp',
    city: 'Boston',
    workspaceType: 'Headquarters',
    dealStage: 'Proposal',
    size: 8000,
    estValue: 240000,
    status: 'Active',
    lastUpdated: '2026-06-08',
    broker: 'Sarah Chen',
    closeDate: 'Sep 20, 2026',
  },
  {
    id: '22',
    dealName: 'McKinsey San Francisco Office',
    clientName: 'McKinsey & Company',
    city: 'San Francisco',
    workspaceType: 'Private Office',
    dealStage: 'Intake',
    size: 2200,
    estValue: 240000,
    status: 'Active',
    lastUpdated: '2026-05-30',
    broker: 'Michael Torres',
    closeDate: 'Feb 1, 2027',
  },
  {
    id: '23',
    dealName: 'PwC Seattle Client Center',
    clientName: 'PricewaterhouseCoopers',
    city: 'Seattle',
    workspaceType: 'Office Suite',
    dealStage: 'Evaluation',
    size: 1800,
    estValue: 175000,
    status: 'Active',
    lastUpdated: '2026-05-28',
    broker: 'Jessica Park',
    closeDate: 'Dec 15, 2026',
  },
  {
    id: '5',
    dealName: 'MediaCo Chicago Office',
    clientName: 'MediaCo',
    city: 'Chicago',
    workspaceType: 'Headquarters',
    dealStage: 'Intake',
    size: 4000,
    estValue: 115000,
    status: 'Active',
    lastUpdated: '2026-06-06',
    broker: 'Michael Torres',
    closeDate: 'Feb 1, 2027',
  },
  {
    id: '24',
    dealName: 'KPMG Atlanta Advisory Suite',
    clientName: 'KPMG',
    city: 'Atlanta',
    workspaceType: 'Coworking',
    dealStage: 'Evaluation',
    size: 1100,
    estValue: 110000,
    status: 'Active',
    lastUpdated: '2026-05-27',
    broker: 'Sarah Chen',
    closeDate: 'Jan 31, 2027',
  },
  {
    id: '2',
    dealName: 'Tech Ventures SF Office',
    clientName: 'Tech Ventures',
    city: 'San Francisco',
    workspaceType: 'Coworking',
    dealStage: 'Intake',
    size: 2000,
    estValue: 98000,
    status: 'Active',
    lastUpdated: '2026-06-09',
    broker: 'Michael Torres',
    closeDate: 'Jan 15, 2027',
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
    lastUpdated: '2026-06-11',
    broker: 'Michael Torres',
    closeDate: 'Jul 30, 2026',
  },
  // ── Archived / Executed ──────────────────────────────────────────
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
    lastUpdated: '2026-04-15',
    broker: 'Sarah Chen',
    closeDate: 'Apr 15, 2026',
  },
  {
    id: '25',
    dealName: 'Lyft Portland Office',
    clientName: 'Lyft',
    city: 'Portland',
    workspaceType: 'Coworking',
    dealStage: 'Execution',
    size: 900,
    estValue: 88000,
    status: 'Executed',
    lastUpdated: '2026-03-28',
    broker: 'Michael Torres',
    closeDate: 'Mar 28, 2026',
  },
  {
    id: '26',
    dealName: 'Pinterest Denver Studio',
    clientName: 'Pinterest',
    city: 'Denver',
    workspaceType: 'Private Office',
    dealStage: 'Execution',
    size: 1400,
    estValue: 145000,
    status: 'Archived',
    lastUpdated: '2026-02-14',
    broker: 'Jessica Park',
    closeDate: 'Feb 14, 2026',
  },
  {
    id: '27',
    dealName: 'Stripe Nashville Office',
    clientName: 'Stripe',
    city: 'Nashville',
    workspaceType: 'Office Suite',
    dealStage: 'Execution',
    size: 950,
    estValue: 92000,
    status: 'Executed',
    lastUpdated: '2026-01-31',
    broker: 'Sarah Chen',
    closeDate: 'Jan 31, 2026',
  },
];

// ─── Metric Cards ─────────────────────────────────────────────────────────────

const METRICS = [
  {
    label: 'REQUIREMENT COSTS',
    value: '$10.75M',
    valueColor: '#10B981',
    sub: 'Total estimated cost of active requirements',
    Icon: TrendingUp,
    iconColor: '#10B981',
  },
  {
    label: 'ACTIVE REQUIREMENTS',
    value: '23',
    valueColor: '#0694A2',
    sub: 'Number of requirements currently moving through workflow',
    Icon: FileText,
    iconColor: '#0694A2',
  },
  {
    label: 'COLLECTIONS CREATED',
    value: '47',
    valueColor: '#0369A1',
    sub: 'Total collections generated for requirements',
    Icon: CircleDot,
    iconColor: '#0369A1',
  },
  {
    label: 'AGENT TASKS COMPLETED',
    value: '156',
    valueColor: '#1E3A5F',
    sub: 'Total tasks executed by agents',
    Icon: Zap,
    iconColor: '#1E3A5F',
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

function ActionsMenu({
  onView,
  hasCollection,
}: {
  onView: () => void;
  hasCollection: boolean;
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
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        style={{ color: '#9CA3AF' }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-8 z-50 rounded-lg bg-white py-1 shadow-lg"
          style={{ border: '1px solid #E5E7EB', minWidth: '172px' }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onView(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#374151' }}
          >
            <Eye className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
            View Requirement
          </button>
          {hasCollection && (
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#374151' }}
            >
              <FolderOpen className="h-3.5 w-3.5" style={{ color: '#6B7280' }} />
              View Collection
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function BrokerFlow({ isAIDrawerOpen }: BrokerFlowProps) {
  const [deals] = useState<Deal[]>(SAMPLE_DEALS);
  const [liveAssessments, setLiveAssessments] = useState<Record<string, CollectionAssessment>>({ ...MOCK_ASSESSMENTS });
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailModalTab, setDetailModalTab] = useState<string>('summary');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editDeal, setEditDeal] = useState<Deal | undefined>(undefined);

  const [createTarget, setCreateTarget] = useState<Deal | null>(null);
  const [collectionName, setCollectionName] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [searchParams] = useSearchParams();
  const [injectedDeal, setInjectedDeal] = useState<Deal | null>(null);

  // Read hub-originated requirement from URL params (set by Workplace Strategist)
  useEffect(() => {
    if (searchParams.get('newReq') !== '1') return;
    const reqId  = searchParams.get('reqId')        ?? `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const company = searchParams.get('company')     ?? 'Unknown';
    const city    = searchParams.get('city')        ?? 'Unknown';
    const estValue = parseInt(searchParams.get('estValue') ?? '0', 10);
    const seats    = parseInt(searchParams.get('seats')    ?? '20', 10);
    const wsType   = searchParams.get('workspaceType')     ?? 'Office Suite';
    const today = new Date().toISOString().split('T')[0];
    setInjectedDeal({
      id: reqId,
      dealName: `${company} ${city} Hub Sourcing`,
      clientName: company,
      city,
      workspaceType: wsType,
      dealStage: 'Intake',
      size: seats * 75,
      estValue,
      status: 'Active',
      lastUpdated: today,
      broker: 'Sarah Chen',
    });
    // Clear params from URL so refresh doesn't re-inject
    window.history.replaceState({}, '', window.location.pathname);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cities = Array.from(new Set(deals.map((d) => d.city))).sort();

  // Prepend hub-originated deal at top of page 1 (not subject to filters — always pinned)
  const allDeals = injectedDeal ? [injectedDeal, ...deals] : deals;
  const filtered = allDeals.filter((d) => {
    if (d.id === injectedDeal?.id) return true; // pinned deal always shows
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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [search, stageFilter, statusFilter, cityFilter]);

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
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: '4px' }}>
              <FileText className="h-7 w-7" style={{ color: 'rgba(255,255,255,0.85)' }} />
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.3px',
                }}
              >
                Transactions
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', paddingLeft: '40px' }}>
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
        <div className="max-w-7xl mx-auto grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
        <div className="max-w-7xl mx-auto">
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
                placeholder="Search requirements by company, location, service provider..."
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
            <FilterSelect value={cityFilter}   onChange={setCityFilter}   placeholder="All Locations" options={cities}     />
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                {[
                  { label: 'REQUIREMENT',           width: '22%' },
                  { label: 'COMPANY',               width: '13%' },
                  { label: 'SERVICE PROVIDER',      width: '12%' },
                  { label: 'STATUS',                width: '8%'  },
                  { label: 'STAGE',                 width: '11%' },
                  { label: 'EST. VALUE',            width: '10%' },
                  { label: 'COLLECTION',            width: '14%' },
                  { label: 'ACTIONS',               width: '7%'  },
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
                paginated.map((deal, idx) => (
                  <DealRow
                    key={deal.id}
                    deal={deal}
                    isLast={idx === paginated.length - 1}
                    isNew={deal.id === injectedDeal?.id}
                    onClick={() => openDeal(deal)}
                    assessment={liveAssessments[deal.id]}
                    onCreateCollection={() => {
                      setCreateTarget(deal);
                      setCollectionName('');
                    }}
                    onViewCollection={() => {
                      setSelectedDeal(deal);
                      setDetailModalTab('collection');
                      setIsDetailOpen(true);
                    }}
                  />
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} requirements
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '5px 12px',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: currentPage === 1 ? '#D1D5DB' : '#374151',
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                  }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '32px',
                      height: '32px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: page === currentPage ? '#005B94' : '#E5E7EB',
                      backgroundColor: page === currentPage ? '#005B94' : '#FFFFFF',
                      color: page === currentPage ? '#FFFFFF' : '#374151',
                      cursor: 'pointer',
                      fontWeight: page === currentPage ? 600 : 400,
                    }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '5px 12px',
                    fontSize: '13px',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: currentPage === totalPages ? '#D1D5DB' : '#374151',
                    cursor: currentPage === totalPages ? 'default' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      {selectedDeal && (
        <DealDetailsModal
          deal={selectedDeal}
          isOpen={isDetailOpen}
          onClose={() => { setIsDetailOpen(false); setDetailModalTab('summary'); }}
          defaultTab={detailModalTab}
        />
      )}

      <CreateEditDealModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        deal={editDeal}
      />

      {/* ── New Collection Modal ──────────────────────────────────────── */}
      <Dialog
        open={!!createTarget}
        onOpenChange={(open) => {
          if (!open) { setCreateTarget(null); setCollectionName(''); }
        }}
      >
        <DialogContent
          className="max-w-md"
          style={{ fontFamily: 'Inter, sans-serif', padding: '28px 28px 24px' }}
        >
          <DialogHeader style={{ marginBottom: 20 }}>
            <DialogTitle style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              New Collection
            </DialogTitle>
            <DialogDescription style={{ display: 'none' }}>
              Create a new collection for this requirement
            </DialogDescription>
          </DialogHeader>

          {/* Requirement context */}
          {createTarget && (
            <div style={{
              fontSize: 12,
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
              marginBottom: 16,
              lineHeight: 1.4,
            }}>
              Requirement: <span style={{ fontWeight: 600, color: '#374151' }}>{createTarget.dealName}</span>
            </div>
          )}

          {/* Collection Name input */}
          <Input
            placeholder="Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && collectionName.trim()) {
                e.preventDefault();
                if (!createTarget) return;
                const a = generateMockAssessment(createTarget, collectionName.trim());
                setLiveAssessments(prev => ({ ...prev, [createTarget.id]: a }));
                toast.success(`"${collectionName}" collection created — assessing fit…`);
                setCreateTarget(null);
                setCollectionName('');
              }
            }}
            autoFocus
            style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', marginBottom: 16 }}
          />

          {/* Agent explanation */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 8,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 12,
          }}>
            <Zap size={14} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: '#1E40AF', fontFamily: 'Inter, sans-serif', lineHeight: 1.55, margin: 0 }}>
              <span style={{ fontWeight: 600 }}>The Create Collection Agent</span> will source spaces based on this requirement's metadata — location, headcount, budget, and workspace type.
            </p>
          </div>

          {/* Outcome expectation */}
          <p style={{
            fontSize: 12,
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            Once the collection is ready, a <span style={{ fontWeight: 500, color: '#374151' }}>collection link</span> and <span style={{ fontWeight: 500, color: '#374151' }}>fitness assessment</span> will appear in the Requirements table.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => { setCreateTarget(null); setCollectionName(''); }}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 14 }}
            >
              Cancel
            </Button>
            <Button
              disabled={!collectionName.trim()}
              className="text-white"
              style={{
                backgroundColor: collectionName.trim() ? '#005B94' : undefined,
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
              }}
              onClick={() => {
                if (!createTarget || !collectionName.trim()) return;
                const a = generateMockAssessment(createTarget, collectionName.trim());
                setLiveAssessments(prev => ({ ...prev, [createTarget.id]: a }));
                toast.success(`"${collectionName}" collection created — assessing fit…`);
                setCreateTarget(null);
                setCollectionName('');
              }}
            >
              Create Collection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Deal Row ─────────────────────────────────────────────────────────────────

function DealRow({
  deal,
  isLast,
  isNew,
  onClick,
  assessment,
  onCreateCollection,
  onViewCollection,
}: {
  deal: Deal;
  isLast: boolean;
  isNew?: boolean;
  onClick: () => void;
  assessment: CollectionAssessment | undefined;
  onCreateCollection: () => void;
  onViewCollection: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [assessHovered, setAssessHovered] = useState(false);
  const [assessCardHovered, setAssessCardHovered] = useState(false);
  const [assessRect, setAssessRect] = useState<{ top: number; left: number } | null>(null);
  const stageBadge  = getStageBadgeStyle(deal.dealStage);
  const statusBadge = getStatusBadgeStyle(deal.status);

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? 'none' : '1px solid #E5E7EB',
        backgroundColor: isNew ? (hovered ? '#ECFDF5' : '#F0FDF4') : (hovered ? '#F9FAFB' : '#FFFFFF'),
        cursor: 'pointer',
        transition: 'background-color 0.12s',
      }}
    >
      {/* Transaction Name */}
      <td style={{ padding: '14px 16px' }}>
        <div className="flex items-center gap-2">
          {isNew && (
            <span style={{
              fontSize: '10px', fontWeight: 700, color: '#FFFFFF',
              backgroundColor: '#059669', borderRadius: '4px',
              padding: '1px 6px', letterSpacing: '0.05em', flexShrink: 0,
            }}>
              NEW
            </span>
          )}
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
            {deal.dealName}
          </span>
        </div>
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
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            borderRadius: '999px',
            padding: '4px 12px',
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

      {/* Collection Assessment */}
      <td
        style={{ padding: '14px 16px', position: 'relative' }}
        onMouseEnter={(e) => {
          if (!assessment) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setAssessRect({ top: rect.bottom + 6, left: rect.left });
          setAssessHovered(true);
        }}
        onMouseLeave={() => setAssessHovered(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {assessment ? (
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 9px', borderRadius: 999,
              border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF',
              color: '#1D4ED8', fontSize: 12, fontWeight: 500,
              fontFamily: 'Inter, sans-serif', cursor: 'default',
            }}
          >
            <FolderOpen size={11} style={{ flexShrink: 0 }} />
            {assessment.strong + assessment.partial} spaces
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onCreateCollection(); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 999,
              border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF',
              color: '#6B7280', fontSize: 12, fontWeight: 500,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
            }}
          >
            <FolderPlus size={12} style={{ flexShrink: 0 }} />
            Create
          </button>
        )}
        {(assessHovered || assessCardHovered) && assessment && assessRect && (
          <div
            style={{ position: 'fixed', top: assessRect.top, left: assessRect.left, zIndex: 9999, width: 268, backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,0.14)', overflow: 'hidden' }}
            onMouseEnter={() => setAssessCardHovered(true)}
            onMouseLeave={() => setAssessCardHovered(false)}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: collection name + total space count */}
            <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'Inter, sans-serif', lineHeight: 1.25, marginBottom: 3 }}>
                {assessment.collectionName}
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {assessment.strong + assessment.partial + assessment.weak} spaces total
              </div>
            </div>

            {/* Criteria breakdown */}
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column' as const, gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280' }}>
                  <MapPin size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
                  In {assessment.location}
                </span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{assessment.inMarket} spaces</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280' }}>
                  <DollarSign size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
                  Within {assessment.budget}
                </span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{assessment.withinBudget} spaces</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6B7280' }}>
                  <Users size={11} color="#9CA3AF" style={{ flexShrink: 0 }} />
                  For {assessment.headcount}
                </span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{assessment.sizeMatch} spaces</span>
              </div>
            </div>

            {/* Saved / Shortlisted stats */}
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'stretch' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{assessment.strong + assessment.partial}</div>
                <div style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>Saved</div>
              </div>
              <div style={{ width: 1, backgroundColor: '#E5E7EB', margin: '0 12px', alignSelf: 'stretch' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{assessment.strong}</div>
                <div style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 3 }}>Shortlisted</div>
              </div>
            </div>

            {/* Footer + CTA */}
            <div style={{ padding: '10px 14px 12px' }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>
                Updated {assessment.lastAssessed}
              </div>
              <button
                style={{ width: '100%', padding: '8px 0', backgroundColor: '#005B94', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, borderRadius: 7, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={(e) => { e.stopPropagation(); onViewCollection(); }}
              >
                View Collection
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </td>

      {/* Actions */}
      <td style={{ padding: '14px 8px 14px 0' }} onClick={(e) => e.stopPropagation()}>
        <ActionsMenu
          onView={onClick}
          hasCollection={!!assessment}
        />
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
