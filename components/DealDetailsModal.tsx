import React, { useState, useEffect } from 'react';
import { getCollectionSpaces } from './data/collectionSpaces';
import { toast } from './ui/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Building2,
  DollarSign,
  Calendar,
  User,
  FileText,
  MessageSquare,
  CheckSquare,
  Upload,
  Send,
  Clock,
  MapPin,
  TrendingUp,
  X,
  Hash,
  Mail,
  Users,
  Search,
  Eye,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Sparkles,
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  ThumbsUp,
  XCircle,
  Bot,
  PlayCircle,
  Loader2,
  ExternalLink,
  Minus,
  RefreshCw,
  Share2,
  Bookmark,
} from 'lucide-react';
import { MessagingThread } from './MessagingThread';
import { DealTeamSection, TeamMember, sampleTeamMembers } from './DealTeamSection';
import { SpaceSourcing } from './SpaceSourcing';

interface Deal {
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
  notes?: string;
}

interface DealDetailsModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

interface Task {
  id: string;
  name: string;
  dueDate: string;
  status: string;
  assignedTo: string;
  createdBy?: 'agent' | 'human';
  reviewState?: 'pending' | 'approved' | 'rejected';
  humanName?: string;
  taskType?: 'human' | 'agent' | 'collaborative';
  agentState?: 'queued' | 'running' | 'completed' | 'needs_review';
  agentOutput?: string;
  executionTimestamp?: string;
  agentInstruction?: string;
  expectedOutput?: string;
  agentTaskType?: string;
  generatedReason?: string;
  dependency?: string;
  collectionUrl?: string;
}

interface Document {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedDate: string;
  size: string;
  draftedBy?: 'agent' | 'human';
  reviewState?: 'pending_review' | 'approved' | 'needs_revision';
  version?: number;
}

const sampleTasks: Task[] = [
  {
    id: '1',
    name: 'Send proposal document',
    dueDate: '2025-11-15',
    status: 'In Progress',
    assignedTo: 'Sarah Chen',
  },
  {
    id: '2',
    name: 'Schedule site visit',
    dueDate: '2025-11-18',
    status: 'Pending',
    assignedTo: 'Michael Torres',
  },
  {
    id: '3',
    name: 'Follow up with client',
    dueDate: '2025-11-20',
    status: 'Pending',
    assignedTo: 'Sarah Chen',
  },
];

const stageTasksData: Record<string, Task[]> = {
  'Requirement Identified': [
    {
      id: 'p1',
      name: 'Initial client outreach',
      dueDate: '2025-10-14',
      status: 'Completed',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'p2',
      name: 'Qualify client needs',
      dueDate: '2025-10-17',
      status: 'Completed',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'p3',
      name: 'Draft requirement from brief',
      dueDate: '2025-10-18',
      status: 'Completed',
      assignedTo: 'Requirements Intake Agent',
      taskType: 'agent',
      agentState: 'completed',
      agentTaskType: 'Draft requirement',
      executionTimestamp: 'Oct 19, 2:14 PM',
      agentOutput: 'Requirement draft created with 3 missing details flagged for AT&T Downtown Office Space.',
    },
  ],
  'Site Tours Scheduled': [
    {
      id: 't1',
      name: 'Schedule initial tour',
      dueDate: '2025-10-24',
      status: 'Completed',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 't-agent-1',
      name: 'Build collection for requirement',
      dueDate: '2025-10-25',
      status: 'Completed',
      assignedTo: 'Market Sourcing Agent',
      taskType: 'agent',
      agentState: 'completed',
      agentTaskType: 'Build collection',
      executionTimestamp: 'Oct 26, 3:42 PM',
      agentOutput: 'Collection created for this requirement. 12 candidate spaces identified. Chicago Private Offices 12 spaces Open Collection.',
      collectionUrl: 'https://liquidspace.com/collections/manhattan-private-offices-abc123',
    },
    {
      id: 't-agent-2',
      name: 'Assess collection fit',
      dueDate: '2025-10-26',
      status: 'Completed',
      assignedTo: 'Collection Assessment Agent',
      taskType: 'agent',
      agentState: 'completed',
      agentTaskType: 'Assess collection',
      executionTimestamp: 'Oct 27, 10:18 AM',
      agentOutput: 'Collection assessed against requirement. Strong matches: 2 Partial matches: 4 Weak matches: 6 Top recommendation: Hudson Yards Tower, 4,800 sq ft (96% match).',
      collectionUrl: 'https://liquidspace.com/collections/manhattan-private-offices-abc123',
    },
    {
      id: 't2',
      name: 'Conduct site walkthrough',
      dueDate: '2025-10-27',
      status: 'Completed',
      assignedTo: 'Michael Torres',
    },
  ],
  'Proposal Sent': [
    {
      id: 'pr1',
      name: 'Prepare proposal document',
      dueDate: '2025-11-02',
      status: 'Completed',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'pr2',
      name: 'Review pricing with finance',
      dueDate: '2025-11-05',
      status: 'Completed',
      assignedTo: 'Jennifer Lee',
    },
    {
      id: 'pr3',
      name: 'Send proposal to client',
      dueDate: '2025-11-08',
      status: 'Completed',
      assignedTo: 'Sarah Chen',
    },
  ],
  'Lease Negotiation': [
    {
      id: 'n1',
      name: 'Send proposal document',
      dueDate: '2025-11-14',
      status: 'In Progress',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'n2',
      name: 'Schedule site visit',
      dueDate: '2025-11-17',
      status: 'Not Started',
      assignedTo: 'Michael Torres',
    },
    {
      id: 'n3',
      name: 'Follow up with client',
      dueDate: '2025-11-19',
      status: 'Not Started',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'n4-agent-running',
      name: 'Draft competitive analysis of Manhattan flex office pricing',
      dueDate: '2025-11-16',
      status: 'In Progress',
      assignedTo: 'Agent',
      taskType: 'agent',
      agentState: 'running',
      executionTimestamp: '',
      agentInstruction: 'Analyze Midtown Manhattan flex office pricing for 5,000 sq ft and identify negotiation leverage points based on current market conditions.',
      expectedOutput: 'Comparison Table',
      agentTaskType: 'Assess Collection'
    },
    {
      id: 'n5-agent-completed',
      name: 'Analyze client responsiveness patterns',
      dueDate: '2025-11-15',
      status: 'Completed',
      assignedTo: 'Agent',
      taskType: 'agent',
      agentState: 'completed',
      executionTimestamp: 'Nov 11, 2:34 PM',
      agentOutput: 'Client responds within 6-8 hours on weekdays, typically late afternoon. Email engagement rate: 87%. Recommendation: Schedule follow-ups between 2-4 PM EST.',
      agentInstruction: 'Review all client communication timestamps and identify optimal engagement windows.',
      expectedOutput: 'Brief / Summary',
      agentTaskType: 'Create Collection'
    },
    {
      id: 'n6-agent-review',
      name: 'Prepare negotiation summary with pricing benchmarks',
      dueDate: '2025-11-16',
      status: 'Completed',
      assignedTo: 'Agent',
      taskType: 'agent',
      agentState: 'needs_review',
      executionTimestamp: 'Nov 12, 9:15 AM',
      agentOutput: 'Compiled 3-page brief: market comparables, concession opportunities, risk flags. Ready for review.',
      agentInstruction: 'Compile market pricing benchmarks and identify concession opportunities for 5,000 sq ft flex office in Midtown.',
      expectedOutput: 'Draft Document',
      agentTaskType: 'Negotiate terms'
    },
    {
      id: 'n7-agent-queued',
      name: 'Generate risk assessment for 18-month lease term',
      dueDate: '2025-11-18',
      status: 'Not Started',
      assignedTo: 'Agent',
      taskType: 'agent',
      agentState: 'queued',
      executionTimestamp: '',
      agentInstruction: 'Evaluate market volatility, client financial stability, and lease term risks for an 18-month commitment.',
      expectedOutput: 'Risk Flags',
      agentTaskType: 'Structured evaluation + decisioning'
    },
    {
      id: 'n4-agent',
      name: 'Verify insurance requirements for Hudson Yards location',
      dueDate: '2025-11-16',
      status: 'Not Started',
      assignedTo: 'Sarah Chen',
      createdBy: 'agent',
      reviewState: 'pending',
      humanName: 'Sarah Chen',
      generatedReason: 'Insurance verification is required for this venue before finalizing terms'
    },
    {
      id: 'n8-agent-generated',
      name: 'Schedule follow-up call with Tel Tech',
      dueDate: '2025-11-17',
      status: 'Not Started',
      assignedTo: 'Sarah Chen',
      createdBy: 'agent',
      reviewState: 'pending',
      humanName: 'Sarah Chen',
      generatedReason: 'Client hasn\'t responded in 4 days — proactive check-ins increase close rate by 23%'
    },
    {
      id: 'n9-agent-generated',
      name: 'Draft negotiation prep summary',
      dueDate: '2025-11-18',
      status: 'Not Started',
      assignedTo: 'Agent',
      taskType: 'agent',
      agentState: 'queued',
      createdBy: 'agent',
      reviewState: 'pending',
      agentInstruction: 'Compile negotiation talking points based on market analysis and client preferences.',
      expectedOutput: 'Draft Document',
      agentTaskType: 'Negotiate terms',
      generatedReason: 'Stage duration above average (18 vs 12 days) — prep docs close 31% faster'
    },
  ],
  'Lease Finalization': [
    {
      id: 'c1',
      name: 'Draft contract terms',
      dueDate: '2025-11-25',
      status: 'Not Started',
      assignedTo: 'Jennifer Lee',
    },
    {
      id: 'c2',
      name: 'Legal review',
      dueDate: '2025-11-28',
      status: 'Not Started',
      assignedTo: 'Legal Team',
    },
    {
      id: 'c3',
      name: 'Send contract to client',
      dueDate: '2025-12-01',
      status: 'Not Started',
      assignedTo: 'Sarah Chen',
    },
  ],
  'Lease Executed': [
    {
      id: 'w1',
      name: 'Finalize signatures',
      dueDate: '2025-12-05',
      status: 'Not Started',
      assignedTo: 'Sarah Chen',
    },
    {
      id: 'w2',
      name: 'Onboard client',
      dueDate: '2025-12-08',
      status: 'Not Started',
      assignedTo: 'Operations Team',
    },
    {
      id: 'w3',
      name: 'Schedule move-in',
      dueDate: '2025-12-10',
      status: 'Not Started',
      assignedTo: 'Michael Torres',
    },
  ],
};

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Proposal_TelTech_NYC.pdf',
    uploadedBy: 'Sarah Chen',
    uploadedDate: '2025-11-07',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Floor_Plans.pdf',
    uploadedBy: 'Sarah Chen',
    uploadedDate: '2025-11-04',
    size: '5.1 MB',
  },
  {
    id: '3',
    name: 'Pricing_Sheet.xlsx',
    uploadedBy: 'Michael Torres',
    uploadedDate: '2025-11-02',
    size: '156 KB',
  },
  {
    id: '4-agent',
    name: 'Market_Comp_Analysis_Hudson_Yards.pdf',
    uploadedBy: 'Agent',
    uploadedDate: '2025-11-10',
    size: '1.2 MB',
    draftedBy: 'agent',
  },
];

// ─── Mock collection data (Phase 1 — replaced with real agent output in Phase 3) ─
//
// Tier semantics:
//   Strong  — spaces in the right area with clear alignment to this dimension
//   Partial — spaces in the right area with some alignment; requirement partially met
//   No match (weak) — zero spaces in the collection that could viably satisfy this dimension
//
// fitness_signal derivation:
//   Good  → strong ≥ 1 (collection has at least one genuinely good option)
//   Fair  → strong = 0, partial ≥ 1 (options exist but none are clearly right)
//   Poor  → strong = 0, partial = 0 (collection has no viable candidates at all)
const MOCK_COLLECTION = {
  fitness_signal: 'Good' as const,
  tier_counts: { strong: 4, partial: 6, weak: 2 },
  top_recommendation: { name: 'Hudson Yards Tower', match_pct: 96 },
  gaps: ['No spaces support 24-month term'],
  delta: {
    previous_tier_counts: { strong: 5, partial: 5, weak: 2 },
    summary: '1 space moved from strong to partial following budget reduction.',
  },
  collection: {
    name: 'NYC Private Offices 12',
    spaceCount: 12,
    sourcedBy: 'Market Sourcing Agent',
    sourcedOn: 'Oct 26, 3:42 PM',
    lastAssessed: 'Nov 9, 9:03 AM',
    assessmentsRun: 2,
  },
  criteria: [
    { label: 'Midtown Manhattan', tier: 'Strong'  as 'Strong' | 'Partial' | 'Weak' },
    { label: 'Private office',    tier: 'Strong'  as 'Strong' | 'Partial' | 'Weak' },
    { label: '35–40 people',      tier: 'Partial' as 'Strong' | 'Partial' | 'Weak' },
    { label: '$18,000/mo budget', tier: 'Partial' as 'Strong' | 'Partial' | 'Weak' },
    { label: '4,500–5,000 sq ft', tier: 'Partial' as 'Strong' | 'Partial' | 'Weak' },
    { label: '12–24 mo term',     tier: 'Partial' as 'Strong' | 'Partial' | 'Weak' },
  ],
  criteriaNote: '',
  history: [
    {
      type: 'space_shortlisted',
      title: '3 spaces shortlisted for client review',
      time: 'Nov 14, 11:30 AM',
      desc: 'Hudson Yards Tower, Park Ave Suites, and One Penn Plaza flagged for client review by Matthew Weiner.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
    {
      type: 'collection_shared',
      title: 'Collection shared with client',
      time: 'Nov 13, 3:45 PM',
      desc: 'Collection shared with Sarah Chen at Tel Tech by Matthew Weiner for review and feedback.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
    {
      type: 'requirement_update',
      title: 'Requirement updated · Location narrowed',
      time: 'Nov 12, 2:00 PM',
      desc: 'Target area updated from Midtown Manhattan to Hudson Yards corridor by Sarah Chen. Full resourcing triggered automatically.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
    {
      type: 'resourced',
      title: 'Collection rebuilt',
      time: 'Nov 12, 2:01 PM',
      desc: 'Market Sourcing Agent rebuilt collection for Hudson Yards corridor. 12 prior candidates replaced with 9 tighter-area spaces.',
      delta: { label: 'Strong 4→5 · Partial 6→4', direction: 'up' as const },
    },
    {
      type: 'space_removed',
      title: '2 spaces removed',
      time: 'Nov 11, 10:20 AM',
      desc: 'Rockefeller Center Office and Bryant Park Suite removed by Matthew Weiner — both exceed budget by more than 30%.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
    {
      type: 'space_added',
      title: '1 space added',
      time: 'Nov 10, 9:45 AM',
      desc: 'Industrious Bryant Park added to collection manually by Matthew Weiner.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
    {
      type: 'requirement_update',
      title: 'Requirement updated · Budget reduced',
      time: 'Nov 9, 9:02 AM',
      desc: 'Budget changed from $20,000/mo to $18,000/mo by Sarah Chen. Re-assessment triggered automatically.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
    {
      type: 'reassessment',
      title: 'Re-assessment complete',
      time: 'Nov 9, 9:03 AM',
      desc: '1 space moved from strong to partial following budget reduction. Collection still has 4 strong matches.',
      delta: { label: 'Strong 5→4 · Partial 5→6', direction: 'down' as const },
    },
    {
      type: 'initial_assessment',
      title: 'Initial assessment complete',
      time: 'Oct 28, 10:18 AM',
      desc: '12 spaces assessed. Strong: 5 · Partial: 5 · No match: 2. Top pick: Hudson Yards Tower, 4,800 sq ft (96% match).',
      delta: { label: 'First run', direction: 'neutral' as const },
    },
    {
      type: 'assessment_blocked',
      title: 'Assessment incomplete · Missing data',
      time: 'Oct 27, 4:22 PM',
      desc: 'Initial scoring attempted but sq ft data unavailable for 9 of 12 spaces. Budget and location dimensions scored; capacity and size skipped. Re-attempted Oct 28 with full scoring.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
    {
      type: 'sourced',
      title: 'Collection sourced',
      time: 'Oct 26, 3:42 PM',
      desc: '12 candidate spaces identified for Midtown Manhattan, private office, 4,500–5,000 sq ft. Collection built by Market Sourcing Agent.',
      delta: null as null | { label: string; direction: 'up' | 'down' | 'neutral' },
    },
  ],
};

const TIMELINE_EVENTS: {
  iconBg: string;
  Icon: any;
  title: string;
  desc: string;
  date: string;
  user: string;
}[] = [
  {
    iconBg: '#1D4ED8',
    Icon: TrendingUp,
    title: 'Workflow Stage Changed',
    desc: 'Requirement advanced from Site Tours Scheduled to Proposal & Negotiation.',
    date: 'Nov 14, 2024',
    user: 'matthew@liquidspace.com',
  },
  {
    iconBg: '#5B21B6',
    Icon: Bookmark,
    title: '3 Spaces Shortlisted for Client Review',
    desc: 'Hudson Yards Tower, Park Ave Suites, and One Penn Plaza flagged for client review.',
    date: 'Nov 14, 2024',
    user: 'matthew@liquidspace.com',
  },
  {
    iconBg: '#1D4ED8',
    Icon: Share2,
    title: 'Collection Shared with Client',
    desc: 'Collection shared with Sarah Chen at Tel Tech by Matthew Weiner for review and feedback.',
    date: 'Nov 13, 2024',
    user: 'matthew@liquidspace.com',
  },
  {
    iconBg: '#065F46',
    Icon: Search,
    title: 'Collection Rebuilt',
    desc: 'Market Sourcing Agent rebuilt collection for Hudson Yards corridor. 12 prior candidates replaced with 9 tighter-area spaces.',
    date: 'Nov 12, 2024',
    user: 'Market Sourcing Agent',
  },
  {
    iconBg: '#B45309',
    Icon: RefreshCw,
    title: 'Requirement Updated · Location Narrowed',
    desc: 'Target area updated from Midtown Manhattan to Hudson Yards corridor. Full resourcing triggered automatically.',
    date: 'Nov 12, 2024',
    user: 'sarah.chen@liquidspace.com',
  },
  {
    iconBg: '#6B7280',
    Icon: Minus,
    title: '2 Spaces Removed from Collection',
    desc: 'Rockefeller Center Office and Bryant Park Suite removed — both exceed budget by more than 30%.',
    date: 'Nov 11, 2024',
    user: 'matthew@liquidspace.com',
  },
  {
    iconBg: '#6B7280',
    Icon: Plus,
    title: 'Space Added to Collection',
    desc: 'Industrious Bryant Park added to collection manually.',
    date: 'Nov 10, 2024',
    user: 'matthew@liquidspace.com',
  },
  {
    iconBg: '#065F46',
    Icon: Bot,
    title: 'Re-assessment Complete',
    desc: '1 space moved from strong to partial following budget reduction. Collection still has 4 strong matches.',
    date: 'Nov 9, 2024',
    user: 'Collection Assessment Agent',
  },
  {
    iconBg: '#B45309',
    Icon: RefreshCw,
    title: 'Requirement Updated · Budget Reduced',
    desc: 'Budget changed from $20,000/mo to $18,000/mo. Re-assessment triggered automatically.',
    date: 'Nov 9, 2024',
    user: 'sarah.chen@liquidspace.com',
  },
  {
    iconBg: '#065F46',
    Icon: Bot,
    title: 'Initial Assessment Complete',
    desc: '12 spaces assessed. Strong: 5 · Partial: 5 · No match: 2. Top pick: Hudson Yards Tower, 4,800 sq ft (96% match).',
    date: 'Oct 28, 2024',
    user: 'Collection Assessment Agent',
  },
  {
    iconBg: '#B45309',
    Icon: AlertCircle,
    title: 'Assessment Blocked · Missing Data',
    desc: 'Initial scoring attempted but sq ft data unavailable for 9 of 12 spaces. Budget and location dimensions scored; capacity and size skipped.',
    date: 'Oct 27, 2024',
    user: 'Collection Assessment Agent',
  },
  {
    iconBg: '#065F46',
    Icon: Search,
    title: 'Collection Sourced',
    desc: '12 candidate spaces identified for Midtown Manhattan, private office, 4,500–5,000 sq ft. Collection built by Market Sourcing Agent.',
    date: 'Oct 26, 2024',
    user: 'Market Sourcing Agent',
  },
  {
    iconBg: '#374151',
    Icon: CheckSquare,
    title: 'Task Created · Build Collection',
    desc: '"Build collection for requirement" task assigned to Market Sourcing Agent.',
    date: 'Oct 25, 2024',
    user: 'sarah.chen@liquidspace.com',
  },
  {
    iconBg: '#1D4ED8',
    Icon: TrendingUp,
    title: 'Workflow Stage Changed',
    desc: 'Requirement moved from Requirement Identified to Site Tours Scheduled.',
    date: 'Oct 19, 2024',
    user: 'sarah.chen@liquidspace.com',
  },
  {
    iconBg: '#5B21B6',
    Icon: Users,
    title: 'Team Member Added',
    desc: 'Sarah Chen added to the requirement team.',
    date: 'Oct 15, 2024',
    user: 'matthew@liquidspace.com',
  },
  {
    iconBg: '#1E3A5F',
    Icon: FileText,
    title: 'Requirement Created',
    desc: 'NYC Private Offices requirement created for Tel Tech.',
    date: 'Oct 15, 2024',
    user: 'matthew@liquidspace.com',
  },
];

// Enhanced timeline data grouped by workflow stages
const workflowStages = [
  {
    id: 'requirement-identified',
    name: 'Intake',
    enteredDate: '2025-10-28',
    status: 'completed',
    count: 4,
    items: [
      { 
        id: 12,
        type: 'stage-change',
        title: 'Deal created in Requirement Identified', 
        date: '2025-10-28', 
        user: 'Sarah Chen',
        icon: 'stage'
      },
      { 
        id: 13,
        type: 'action',
        title: 'Initial discovery call with Tel Tech', 
        date: '2025-10-29', 
        user: 'Sarah Chen',
        icon: 'action'
      },
      { 
        id: 14,
        type: 'task',
        title: 'Gather client requirements and budget', 
        status: 'Completed', 
        assignee: 'Sarah Chen', 
        completedDate: '2025-10-30',
        icon: 'task'
      },
      { 
        id: 15,
        type: 'task',
        title: 'Research NYC workspace options', 
        status: 'Completed', 
        assignee: 'Michael Torres', 
        completedDate: '2025-10-31',
        icon: 'task'
      },
    ]
  },
  {
    id: 'site-tours-scheduled',
    name: 'Evaluation',
    enteredDate: '2025-11-01',
    status: 'completed',
    count: 3,
    items: [
      { 
        id: 8,
        type: 'stage-change',
        title: 'Deal moved to Tour', 
        date: '2025-11-01', 
        user: 'Sarah Chen',
        icon: 'stage'
      },
      { 
        id: 9,
        type: 'task',
        title: 'Schedule site visit with Tel Tech team', 
        status: 'Completed', 
        assignee: 'Michael Torres', 
        completedDate: '2025-11-03',
        icon: 'task'
      },
      { 
        id: 10,
        type: 'action',
        title: 'Site visit completed at NYC location', 
        date: '2025-11-05', 
        user: 'Sarah Chen',
        icon: 'action'
      },
    ]
  },
  {
    id: 'proposal-sent',
    name: 'Proposal',
    enteredDate: '2025-11-05',
    status: 'completed',
    count: 4,
    items: [
      { 
        id: 4,
        type: 'stage-change',
        title: 'Deal moved to Proposal', 
        date: '2025-11-05', 
        user: 'Sarah Chen',
        icon: 'stage'
      },
      { 
        id: 5,
        type: 'task',
        title: 'Send proposal document to Tel Tech', 
        status: 'Completed', 
        assignee: 'Sarah Chen', 
        completedDate: '2025-11-08',
        icon: 'task'
      },
      { 
        id: 6,
        type: 'action',
        title: 'Proposal sent to client', 
        date: '2025-11-08', 
        user: 'Sarah Chen',
        icon: 'action'
      },
      { 
        id: 7,
        type: 'task',
        title: 'Follow up on proposal', 
        status: 'Completed', 
        assignee: 'Sarah Chen', 
        completedDate: '2025-11-09',
        icon: 'task'
      },
    ]
  },
  {
    id: 'lease-negotiation',
    name: 'Negotiation',
    enteredDate: '2025-11-10',
    status: 'current',
    count: 4,
    items: [
      { 
        id: 1,
        type: 'stage-change',
        title: 'Deal moved to Negotiation', 
        date: '2025-11-10', 
        user: 'Sarah Chen',
        icon: 'stage'
      },
      { 
        id: 2,
        type: 'task',
        title: 'Review final terms with client', 
        status: 'In Progress', 
        assignee: 'Sarah Chen', 
        dueDate: '2025-11-15',
        icon: 'task'
      },
      { 
        id: 3,
        type: 'task',
        title: 'Negotiate pricing and lease terms', 
        status: 'Pending', 
        assignee: 'Michael Torres', 
        dueDate: '2025-11-18',
        icon: 'task'
      },
      { 
        id: 16,
        type: 'task',
        title: 'Finalize space requirements', 
        status: 'Pending', 
        assignee: 'Sarah Chen', 
        dueDate: '2025-11-16',
        icon: 'task'
      },
    ]
  },
  {
    id: 'lease-finalization',
    name: 'Contracting',
    enteredDate: null,
    status: 'upcoming',
    count: 3,
    items: [
      { 
        id: 17,
        type: 'task',
        title: 'Draft lease agreement', 
        status: 'Not Started', 
        assignee: 'Legal Team', 
        icon: 'task'
      },
      { 
        id: 18,
        type: 'task',
        title: 'Review contract with client', 
        status: 'Not Started', 
        assignee: 'Sarah Chen', 
        icon: 'task'
      },
      { 
        id: 19,
        type: 'task',
        title: 'Finalize contract details', 
        status: 'Not Started', 
        assignee: 'Michael Torres', 
        icon: 'task'
      },
    ]
  },
  {
    id: 'lease-executed',
    name: 'Execution',
    enteredDate: null,
    status: 'upcoming',
    count: 3,
    items: [
      { 
        id: 20,
        type: 'task',
        title: 'Collect signatures', 
        status: 'Not Started', 
        assignee: 'Sarah Chen', 
        icon: 'task'
      },
      { 
        id: 21,
        type: 'task',
        title: 'Process initial payment', 
        status: 'Not Started', 
        assignee: 'Finance Team', 
        icon: 'task'
      },
      { 
        id: 22,
        type: 'task',
        title: 'Onboard client', 
        status: 'Not Started', 
        assignee: 'Customer Success', 
        icon: 'task'
      },
    ]
  },
];

export function DealDetailsModal({ deal, isOpen, onClose, defaultTab }: DealDetailsModalProps) {
  const [newNote, setNewNote] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ category: '', description: '' });
  const [activeTab, setActiveTab] = useState(defaultTab ?? 'summary');

  useEffect(() => {
    if (isOpen) setActiveTab(defaultTab ?? 'summary');
  }, [isOpen, defaultTab]);
  const [expandedStages, setExpandedStages] = useState<string[]>(['lease-negotiation']); // Start with current stage expanded
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'tasks' | 'stages'>('all');
  
  // Task management state
  const [stageTasks, setStageTasks] = useState<Record<string, Task[]>>(stageTasksData);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedStageName, setSelectedStageName] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editTaskStatus, setEditTaskStatus] = useState<string>('Not Started');
  const [newTaskData, setNewTaskData] = useState({
    name: '',
    dueDate: '',
    assignedTo: 'Me',
    dependency: '',
    agentInstruction: '',
    expectedOutput: 'Brief / Summary',
    agentTaskType: '',
    taskType: '',
  });

  // Agent work review handlers
  const handleApproveAgentTask = (stage: string, taskId: string) => {
    setStageTasks(prev => ({
      ...prev,
      [stage]: prev[stage].map(task =>
        task.id === taskId ? { ...task, reviewState: 'approved' as const } : task
      ),
    }));
  };

  const handleRejectAgentTask = (stage: string, taskId: string) => {
    setStageTasks(prev => ({
      ...prev,
      [stage]: prev[stage].filter(task => task.id !== taskId),
    }));
  };
  
  // Toggle stage expansion
  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };
  
  // Task detail / edit handlers
  const handleOpenTaskDetail = (task: any, stage: string) => {
    setEditingTask(task);
    setSelectedStage(stage);
    setIsEditMode(true);
    setEditTaskStatus(task.status || 'Not Started');
    setNewTaskData({
      name: task.name,
      dueDate: task.dueDate || '',
      assignedTo: task.assignedTo || 'Sarah Chen',
      dependency: task.dependency || '',
      agentInstruction: task.agentInstruction || '',
      expectedOutput: task.expectedOutput || 'Brief / Summary',
      agentTaskType: task.agentTaskType || '',
      taskType: task.humanTaskType || '',
    });
    setShowAddTaskModal(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    setStageTasks(prev => ({
      ...prev,
      [selectedStage]: prev[selectedStage].map(t =>
        t.id === editingTask.id
          ? {
              ...t,
              name: newTaskData.name,
              dueDate: newTaskData.dueDate,
              assignedTo: newTaskData.assignedTo,
              dependency: newTaskData.dependency,
              status: editTaskStatus,
              ...(newTaskData.assignedTo === 'Agent' && editTaskStatus === 'Not Started' && {
                agentTaskType: newTaskData.agentTaskType,
              }),
              ...(newTaskData.assignedTo !== 'Agent' && {
                humanTaskType: newTaskData.taskType,
              }),
            }
          : t
      ),
    }));
    setIsEditMode(false);
    setEditingTask(null);
    setShowAddTaskModal(false);
    toast.success(`Task "${newTaskData.name}" updated.`);
  };

  // Add task handler
  const handleAddTask = () => {
    if (isEditMode) { handleUpdateTask(); return; }
    if (!newTaskData.name || !newTaskData.dueDate) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: newTaskData.name,
      dueDate: newTaskData.dueDate,
      status: 'Not Started',
      assignedTo: newTaskData.assignedTo,
      ...(newTaskData.dependency && { dependency: newTaskData.dependency }),
      ...(newTaskData.assignedTo === 'Agent' && {
        taskType: 'agent',
        agentState: 'queued',
        agentInstruction: newTaskData.agentInstruction,
        expectedOutput: newTaskData.expectedOutput,
        agentTaskType: newTaskData.agentTaskType
      })
    };
    
    setStageTasks(prev => ({
      ...prev,
      [selectedStage]: [...(prev[selectedStage] || []), newTask]
    }));
    
    // Reset form
    setNewTaskData({
      name: '',
      dueDate: '',
      assignedTo: 'Sarah Chen',
      dependency: '',
      agentInstruction: '',
      expectedOutput: 'Brief / Summary',
      agentTaskType: '',
      taskType: '',
    });
    setShowAddTaskModal(false);
    toast.success(`Task "${newTaskData.name}" added.`);
  };

  // Delete task handler
  const handleDeleteTask = (stage: string, taskId: string) => {
    setStageTasks(prev => ({
      ...prev,
      [stage]: prev[stage].filter(task => task.id !== taskId)
    }));
    toast.info('Task removed.');
  };

  // Toggle task completion — with auto-advance when last task in current stage is completed
  const handleToggleTaskComplete = (stage: string, taskId: string) => {
    const currentTask = stageTasks[stage]?.find(t => t.id === taskId);
    const wasCompleted = currentTask?.status === 'Completed';

    // Compute new task list synchronously for auto-advance check
    const updatedStageTasks = (stageTasks[stage] || []).map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'Completed' ? 'Not Started' : 'Completed' }
        : task
    );

    setStageTasks(prev => ({
      ...prev,
      [stage]: prev[stage].map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'Completed' ? 'Not Started' : 'Completed' }
          : task
      )
    }));

    if (wasCompleted) {
      toast.info('Task reopened.');
    } else {
      // Check auto-advance: completing this task may finish all tasks in the current stage
      const currentIdx = getStageIdx(currentDealStage);
      const currentStageKey = stageOrderConfig[currentIdx]?.stage;

      if (stage === currentStageKey && currentIdx < stageOrderConfig.length - 1) {
        const prevHadIncomplete = (stageTasks[stage] || []).some(
          t => t.status !== 'Completed' && t.agentState !== 'completed'
        );
        const nowAllComplete = updatedStageTasks.every(
          t => t.status === 'Completed' || t.agentState === 'completed'
        );

        if (prevHadIncomplete && nowAllComplete) {
          const nextStage = stageOrderConfig[currentIdx + 1];
          setCurrentDealStage(nextStage.stage);
          toast.success(`All tasks complete — advancing to ${nextStage.name}.`);
          return;
        }
      }
      toast.success('Task marked complete.');
    }
  };
  
  // Agent insights state - track dismissals
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [showAgentPanel, setShowAgentPanel] = useState(true);

  // Stage navigation state
  const [currentDealStage, setCurrentDealStage] = useState(deal.dealStage);
  const [stageConfirmTarget, setStageConfirmTarget] = useState<{ stage: string; name: string; index: number } | null>(null);

  const stageOrderConfig = [
    { name: 'Intake',      stage: 'Requirement Identified' },
    { name: 'Evaluation',  stage: 'Site Tours Scheduled'   },
    { name: 'Proposal',    stage: 'Proposal Sent'          },
    { name: 'Negotiation', stage: 'Lease Negotiation'      },
    { name: 'Contracting', stage: 'Lease Finalization'     },
    { name: 'Execution',   stage: 'Lease Executed'         },
  ];
  const getStageIdx = (s: string): number => {
    if (s === 'Intake' || s === 'Requirement' || s === 'Requirement Identified') return 0;
    if (s === 'Evaluation' || s === 'Evaluate' || s === 'Site Tours Scheduled') return 1;
    if (s === 'Proposal' || s === 'Terms' || s === 'Proposal Sent') return 2;
    if (s === 'Negotiation' || s === 'Lease Negotiation') return 3;
    if (s === 'Contracting' || s === 'Lease Finalization') return 4;
    if (s === 'Execution' || s === 'Executed' || s === 'Lease Executed') return 5;
    return 3;
  };

  // Editable form state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(sampleTeamMembers);

  const leadBroker = teamMembers.find(m => m.role === 'Lead Broker');

  const [editedDeal, setEditedDeal] = useState({
    dealName: deal.dealName,
    clientName: deal.clientName,
    workspaceType: deal.workspaceType,
    location: deal.city,
    size: deal.size.toString(),
    estValue: deal.estValue.toString(),
    dealStage: deal.dealStage,
    status: deal.status,
    broker: deal.broker,
    createdDate: '2025-10-01',
    expectedCloseDate: '2025-12-01',
    primaryContactName: leadBroker?.name ?? '',
    primaryContactEmail: leadBroker?.email ?? '',
    dealId: '#TL-NYC-98321',
  });

  // Collection tab becomes visible once a Market Sourcing Agent task is complete,
  // or when the modal is opened directly to the collection tab
  const collectionTabVisible = defaultTab === 'collection' || Object.values(stageTasks).some((tasks) =>
    tasks.some(
      (t) =>
        (t.agentTaskType === 'Build collection' || t.agentTaskType === 'Create Collection') &&
        (t.status === 'Completed' || t.agentState === 'completed')
    )
  );

  const signalColor =
    MOCK_COLLECTION.fitness_signal === 'Good'
      ? '#0F6E56'
      : MOCK_COLLECTION.fitness_signal === 'Fair'
      ? '#BA7517'
      : '#E24B4A';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return <Badge className="bg-gray-400 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Draft</Badge>;
      case 'Active':
        return <Badge className="bg-green-600 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Active</Badge>;
      case 'Executed':
        return <Badge style={{ backgroundColor: '#059669', color: 'white', fontSize: '12px', fontWeight: 500 }} className="px-3 py-1 rounded-full">Executed</Badge>;
      case 'Archived':
        return <Badge className="bg-gray-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Archived</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>{status}</Badge>;
    }
  };

  const getTaskBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-600 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Completed</Badge>;
      case 'In Progress':
        return <Badge style={{ backgroundColor: '#005B94', color: 'white', fontSize: '12px', fontWeight: 500 }} className="px-3 py-1 rounded-full">In Progress</Badge>;
      case 'Pending':
        return <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Pending</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>{status}</Badge>;
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-[1600px] !w-[96vw] sm:!max-w-[1600px] md:!max-w-[1600px] lg:!max-w-[1600px] xl:!max-w-[1600px] h-[90vh] flex flex-col p-0 bg-white rounded-2xl shadow-xl"
        style={{ maxWidth: '1600px', width: '96vw' }}
      >
        <DialogDescription className="sr-only">
          Comprehensive deal management interface with sourcing, team collaboration, timeline tracking, tasks, documents, and messaging
        </DialogDescription>
        
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b flex-shrink-0" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="mb-2 text-white" style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                {deal.dealName}
              </DialogTitle>
              <div className="flex items-center gap-3">
                {getStatusBadge(deal.status)}
                <span className="text-white/60">•</span>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Inter, sans-serif' }}>
                  {deal.clientName}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-8 pt-6 pb-4 flex-shrink-0" style={{ backgroundColor: '#F8F9FA' }}>
            <TabsList
              className={`grid ${collectionTabVisible ? 'grid-cols-6' : 'grid-cols-5'} gap-2 bg-white border rounded-lg p-1 h-11`}
              style={{ borderColor: '#E5E7EB' }}
            >
              <TabsTrigger
                value="summary"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="workflow"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                Workflow
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                Team
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                Timeline
              </TabsTrigger>
              {collectionTabVisible && (
                <TabsTrigger
                  value="collection"
                  className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                >
                  Collection
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {/* Summary Tab */}
            <TabsContent value="summary" className="p-6 mt-0">
              {/* Primary Section Header */}
              <div className="mb-3">
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Requirement Details
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  Authoritative summary of client requirements and deal parameters
                </div>
              </div>
              
              <Card className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
                <CardContent className="p-6">
                  {/* Editable Form - 3 Column Grid */}
                  <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                    {/* Row 1 */}
                    <div>
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Requirement Name
                      </Label>
                      <Input
                        value={editedDeal.dealName}
                        onChange={(e) => setEditedDeal({ ...editedDeal, dealName: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div>
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Company
                      </Label>
                      <Input
                        value={editedDeal.clientName}
                        onChange={(e) => setEditedDeal({ ...editedDeal, clientName: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div className="relative">
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Deal ID
                      </Label>
                      <Input
                        value={editedDeal.dealId}
                        onChange={(e) => setEditedDeal({ ...editedDeal, dealId: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {/* Row 2 */}
                    <div className="relative">
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Workspace Type
                      </Label>
                      <Select
                        value={editedDeal.workspaceType}
                        onValueChange={(value) => setEditedDeal({ ...editedDeal, workspaceType: value })}
                      >
                        <SelectTrigger className="border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private Office">Private Office</SelectItem>
                          <SelectItem value="Office Suite">Office Suite</SelectItem>
                          <SelectItem value="Headquarters">Headquarters</SelectItem>
                          <SelectItem value="Coworking">Coworking</SelectItem>
                          <SelectItem value="Meeting Space">Meeting Space</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Location
                      </Label>
                      <Select
                        value={editedDeal.location}
                        onValueChange={(value) => setEditedDeal({ ...editedDeal, location: value })}
                      >
                        <SelectTrigger className="border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="San Francisco">San Francisco</SelectItem>
                          <SelectItem value="Boston">Boston</SelectItem>
                          <SelectItem value="Austin">Austin</SelectItem>
                          <SelectItem value="Chicago">Chicago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative">
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Size Requirement (sq ft)
                      </Label>
                      <Input
                        type="number"
                        value={editedDeal.size}
                        onChange={(e) => setEditedDeal({ ...editedDeal, size: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {/* Row 3 */}
                    <div className="relative">
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Estimated Value ($)
                      </Label>
                      <Input
                        type="number"
                        value={editedDeal.estValue}
                        onChange={(e) => setEditedDeal({ ...editedDeal, estValue: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div className="relative">
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Current Stage
                      </Label>
                      <div
                        className="flex items-center h-10 px-3 rounded-md border border-gray-200 bg-gray-50"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#374151' }}
                      >
                        {editedDeal.dealStage}
                      </div>
                    </div>

                    <div>
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Status
                      </Label>
                      <Select
                        value={editedDeal.status}
                        onValueChange={(value) => setEditedDeal({ ...editedDeal, status: value })}
                      >
                        <SelectTrigger className="border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Executed">Executed</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 4 */}
                    <div>
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Created Date
                      </Label>
                      <Input
                        type="date"
                        value={editedDeal.createdDate}
                        onChange={(e) => setEditedDeal({ ...editedDeal, createdDate: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div className="relative">
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Expected Close Date
                      </Label>
                      <Input
                        type="date"
                        value={editedDeal.expectedCloseDate}
                        onChange={(e) => setEditedDeal({ ...editedDeal, expectedCloseDate: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {/* Row 5 — Lead derived from team */}
                    {/* Row 5 */}
                    <div>
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Lead
                      </Label>
                      <Input
                        value={editedDeal.primaryContactName}
                        onChange={(e) => setEditedDeal({ ...editedDeal, primaryContactName: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Lead Email
                      </Label>
                      <Input
                        type="email"
                        value={editedDeal.primaryContactEmail}
                        onChange={(e) => setEditedDeal({ ...editedDeal, primaryContactEmail: e.target.value })}
                        className="border-gray-300"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-6 pt-4 border-t flex justify-end" style={{ borderColor: '#E5E7EB' }}>
                    <Button
                      className="text-white"
                      onClick={() => {
                        // Upsert the Lead Broker in the team from Summary form values
                        const name = editedDeal.primaryContactName.trim();
                        const email = editedDeal.primaryContactEmail.trim();
                        if (name || email) {
                          const existing = teamMembers.find(m => m.role === 'Lead Broker');
                          if (existing) {
                            setTeamMembers(teamMembers.map(m =>
                              m.role === 'Lead Broker' ? { ...m, name: name || m.name, email: email || m.email } : m
                            ));
                          } else {
                            setTeamMembers([...teamMembers, {
                              id: String(Date.now()),
                              name,
                              email,
                              role: 'Lead Broker',
                              organization: '',
                              type: 'Internal',
                            }]);
                          }
                        }
                        toast.success('Changes saved.');
                      }}
                      style={{
                        backgroundColor: '#005B94',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Section */}
              <Card className="bg-white border mt-4" style={{ borderColor: '#E5E7EB' }}>
                <CardContent className="p-6">
                  <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '8px', display: 'block' }}>
                    Notes
                  </Label>
                  <Textarea
                    placeholder="Add notes about this requirement..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-24 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      className="text-white"
                      onClick={() => {
                        if (newNote.trim()) {
                          setNewNote('');
                          toast.success('Note saved.');
                        }
                      }}
                      style={{
                        backgroundColor: '#005B94',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Save Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflow Tab */}
            <TabsContent value="workflow" className="p-6 mt-0">
              <div className="space-y-4">
                {/* Status Badge + Last Updated - Top Right Metadata */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Workflow Details
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(deal.status)}
                      <span className="text-gray-400">•</span>
                      <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        Last updated: {new Date(deal.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Tasks are the unit of work. Tasks can be completed by people or by agents.
                  </div>
                </div>

                {/* Stage Progress Bar */}
                <Card className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
                  <CardContent className="p-6">
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Requirement Stage Progress
                    </div>
                    
                    {/* Horizontal Stage Progress */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        {[
                          { name: 'Intake',       stage: 'Requirement Identified', count: 4 },
                          { name: 'Evaluation',   stage: 'Site Tours Scheduled',   count: 3 },
                          { name: 'Proposal',     stage: 'Proposal Sent',          count: 4 },
                          { name: 'Negotiation',  stage: 'Lease Negotiation',      count: 4 },
                          { name: 'Contracting',  stage: 'Lease Finalization',     count: 3 },
                          { name: 'Execution',    stage: 'Lease Executed',         count: 3 }
                        ].map((stageItem, index, array) => {
                          const currentStageIndex = getStageIdx(currentDealStage);
                          
                          const isCompleted = index < currentStageIndex;
                          const isCurrent = index === currentStageIndex;
                          const isFuture = index > currentStageIndex;
                          
                          // Tooltip text
                          const getTooltipText = () => {
                            if (isCompleted) {
                              return `${stageItem.name} — Completed`;
                            } else if (isCurrent) {
                              return `${stageItem.name} — Current Stage`;
                            } else {
                              return `${stageItem.name} — Not Started`;
                            }
                          };
                          
                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center flex-1 relative group"
                              style={{ cursor: 'pointer' }}
                              title={getTooltipText()}
                              onClick={() => setStageConfirmTarget({ stage: stageItem.stage, name: stageItem.name, index })}
                            >
                              {/* Connector Line */}
                              {index < array.length - 1 && (
                                <div 
                                  className="absolute top-6 left-1/2 w-full h-0.5"
                                  style={{ 
                                    backgroundColor: isCompleted ? '#28A745' : '#E5E7EB',
                                    zIndex: 0
                                  }}
                                />
                              )}
                              
                              {/* Stage Circle */}
                              <div className="relative z-10 mb-2">
                                {isCompleted ? (
                                  <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: '#28A745' }}
                                  >
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                  </div>
                                ) : isCurrent ? (
                                  <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center border-4 transition-transform group-hover:scale-110"
                                    style={{ 
                                      backgroundColor: '#005B94',
                                      borderColor: '#003F66'
                                    }}
                                  >
                                    <Circle className="h-6 w-6 text-white fill-white" />
                                  </div>
                                ) : (
                                  <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110"
                                    style={{ 
                                      backgroundColor: '#FFFFFF',
                                      borderColor: '#E5E7EB'
                                    }}
                                  >
                                    <Circle className="h-6 w-6" style={{ color: '#9CA3AF' }} />
                                  </div>
                                )}
                              </div>
                              
                              {/* Stage Label */}
                              <div 
                                className="text-center px-1"
                                style={{ 
                                  fontSize: '12px',
                                  fontWeight: isCurrent ? 600 : 500,
                                  color: isCurrent ? '#005B94' : (isCompleted ? '#374151' : '#9CA3AF'),
                                  fontFamily: 'Inter, sans-serif',
                                  maxWidth: '80px'
                                }}
                              >
                                <div>{stageItem.name}</div>
                                <div style={{ fontSize: '11px', marginTop: '2px' }}>{stageItem.count}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>


                {/* All Stage Tasks Sections */}
                {[
                  { name: 'Intake',      stage: 'Requirement Identified', count: 3 },
                  { name: 'Evaluation',  stage: 'Site Tours Scheduled',   count: 3 },
                  { name: 'Proposal',    stage: 'Proposal Sent',          count: 3 },
                  { name: 'Negotiation', stage: 'Lease Negotiation',      count: 7 },
                  { name: 'Contracting', stage: 'Lease Finalization',     count: 3 },
                  { name: 'Execution',   stage: 'Lease Executed',         count: 3 }
                ].map((stageItem) => {
                  const stageTasksList = stageTasks[stageItem.stage] || [];
                  const currentStageIndex = getStageIdx(currentDealStage);
                  
                  const stageIndex = ['Requirement Identified', 'Site Tours Scheduled', 'Proposal Sent', 'Lease Negotiation', 'Lease Finalization', 'Lease Executed'].indexOf(stageItem.stage);
                  const isCompleted = stageIndex < currentStageIndex;
                  const isCurrent = stageIndex === currentStageIndex;
                  
                  return (
                    <Card key={stageItem.stage} className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                              Stage Tasks: {stageItem.name} <span style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', marginLeft: '4px' }}>({stageItem.count})</span>
                            </div>
                            {isCompleted && (
                              <Badge className="bg-green-600 text-white px-2 py-0.5" style={{ fontSize: '10px', fontWeight: 500 }}>
                                Completed
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="text-white"
                            style={{ 
                              backgroundColor: '#005B94',
                              fontSize: '14px', 
                              fontWeight: 500, 
                              fontFamily: 'Inter, sans-serif' 
                            }}
                            onClick={() => {
                              setSelectedStage(stageItem.stage);
                              setSelectedStageName(stageItem.name);
                              setShowAddTaskModal(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Task
                          </Button>
                        </div>

                        {/* Task List */}
                        <div className="space-y-3">
                          {stageTasksList.map((task) => (
                            <div key={task.id}>
                              {/* Task Row */}
                              <div 
                                className="flex items-center gap-4 p-4 rounded-lg border transition-colors"
                                style={{ 
                                  borderColor: '#E5E7EB',
                                  backgroundColor: 'transparent'
                                }}
                              >
                              {/* Checkbox */}
                              <div 
                                className="flex-shrink-0 cursor-pointer"
                                onClick={() => handleToggleTaskComplete(stageItem.stage, task.id)}
                              >
                                {task.status === 'Completed' ? (
                                  <div 
                                    className="w-5 h-5 rounded flex items-center justify-center"
                                    style={{ backgroundColor: '#28A745' }}
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                  </div>
                                ) : (
                                  <div 
                                    className="w-5 h-5 rounded border-2 cursor-pointer hover:border-gray-400"
                                    style={{ borderColor: '#D1D5DB' }}
                                  />
                                )}
                              </div>

                              {/* Task Details */}
                              <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => handleOpenTaskDetail(task, stageItem.stage)}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    style={{ 
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      color: task.status === 'Completed' ? '#9CA3AF' : '#374151',
                                      fontFamily: 'Inter, sans-serif',
                                      textDecoration: task.status === 'Completed' ? 'line-through' : 'none'
                                    }}
                                  >
                                    {task.name}
                                  </div>
                                  {task.agentTaskType && (
                                    <Badge className="bg-blue-100 text-blue-700 border-0" style={{ fontSize: '9px', fontWeight: 500, padding: '2px 6px' }}>
                                      {task.agentTaskType}
                                    </Badge>
                                  )}
                                  {task.createdBy === 'agent' && !task.taskType && (
                                    <Badge className="bg-gray-100 text-gray-600 border-0" style={{ fontSize: '9px', fontWeight: 500, padding: '2px 6px' }}>
                                      Generated by Agent
                                    </Badge>
                                  )}
                                </div>
                                {/* Agent Instruction Preview for Agent Tasks */}
                                {task.taskType === 'agent' && task.agentInstruction && (
                                  <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', fontStyle: 'italic', marginTop: '4px', lineHeight: '1.4' }}>
                                    "{task.agentInstruction.length > 100 ? task.agentInstruction.substring(0, 100) + '...' : task.agentInstruction}"
                                  </div>
                                )}
                                {/* Generated Reason for Agent-Generated Tasks */}
                                {task.createdBy === 'agent' && task.generatedReason && (
                                  <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px', lineHeight: '1.4' }}>
                                    <span style={{ fontWeight: 500, color: '#6B7280' }}>Reason: </span>{task.generatedReason}
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-3 mt-1" style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                  <div className="flex items-center gap-1">
                                    {task.taskType === 'agent' ? (
                                      <Bot className="h-3 w-3" />
                                    ) : (
                                      <User className="h-3 w-3" />
                                    )}
                                    <span>{task.assignedTo}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div className="flex-shrink-0">
                                {task.taskType === 'agent' ? (
                                  <>
                                    {task.agentState === 'queued' && (
                                      <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 500 }}>
                                        Not Started
                                      </Badge>
                                    )}
                                    {task.agentState === 'running' && (
                                      <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1" style={{ fontSize: '11px', fontWeight: 500 }}>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Running
                                      </Badge>
                                    )}
                                    {task.agentState === 'completed' && (
                                      <Badge className="bg-green-600 text-white px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 500 }}>
                                        Completed
                                      </Badge>
                                    )}
                                    {task.agentState === 'needs_review' && (
                                      <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 500 }}>
                                        Needs Review
                                      </Badge>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {task.status === 'Completed' ? (
                                      <Badge className="bg-green-600 text-white px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 500 }}>
                                        Complete
                                      </Badge>
                                    ) : task.status === 'In Progress' ? (
                                      <Badge style={{ backgroundColor: '#005B94', color: 'white', fontSize: '11px', fontWeight: 500 }} className="px-3 py-1 rounded-full">
                                        In Progress
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '11px', fontWeight: 500 }}>
                                        Not Started
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {task.createdBy === 'agent' && task.reviewState === 'pending' ? (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-3 hover:bg-green-50"
                                      onClick={() => handleApproveAgentTask(stageItem.stage, task.id)}
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5 mr-1" style={{ color: '#28A745' }} />
                                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#28A745', fontFamily: 'Inter, sans-serif' }}>
                                        Accept
                                      </span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-3 hover:bg-red-50"
                                      onClick={() => handleRejectAgentTask(stageItem.stage, task.id)}
                                    >
                                      <XCircle className="h-3.5 w-3.5 mr-1" style={{ color: '#DC2626' }} />
                                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#DC2626', fontFamily: 'Inter, sans-serif' }}>
                                        Reject
                                      </span>
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-200"
                                    onClick={() => handleDeleteTask(stageItem.stage, task.id)}
                                  >
                                    <Trash2 className="h-4 w-4" style={{ color: '#DC2626' }} />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                          </div>
                          ))}
                        </div>


                        {/* Task Completion Summary */}
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                          <div className="flex items-center justify-between">
                            <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                              Work Completed
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                              {stageTasksList.filter(t => t.status === 'Completed').length} of {stageTasksList.length} tasks
                            </div>
                          </div>
                          <div className="mt-2 w-full h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                backgroundColor: '#28A745',
                                width: `${stageTasksList.length > 0 ? (stageTasksList.filter(t => t.status === 'Completed').length / stageTasksList.length) * 100 : 0}%`
                              }}
                            />
                          </div>
                        </div>
                        
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Sourcing Tab */}
            <TabsContent value="sourcing" className="mt-0">
              <SpaceSourcing 
                dealId={deal.id} 
                dealName={deal.name}
              />
            </TabsContent>

            {/* Deal Team Tab */}
            <TabsContent value="team" className="mt-0">
              <DealTeamSection dealId={deal.id} teamMembers={teamMembers} onTeamChange={setTeamMembers} />
            </TabsContent>

            {/* Workflow Timeline Tab (legacy — superseded by Timeline tab below) */}
            {false && (
            <TabsContent value="workflow-timeline" className="p-6 mt-0">
              {/* Header with filter */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                    Deal Timeline
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    Activity organized by workflow stage
                  </div>
                </div>
                <Select value={timelineFilter} onValueChange={(value: 'all' | 'tasks' | 'stages') => setTimelineFilter(value)}>
                  <SelectTrigger className="w-48" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="Filter view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="tasks">Only Tasks</SelectItem>
                    <SelectItem value="stages">Only Stage Changes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stage-grouped Timeline */}
              <div className="space-y-4">
                {workflowStages.map((stage, stageIndex) => {
                  const isExpanded = expandedStages.includes(stage.id);
                  const stageIcon = stage.status === 'current' ? Circle : stage.status === 'upcoming' ? AlertCircle : CheckCircle2;
                  const stageColor = stage.status === 'current' ? '#005B94' : stage.status === 'upcoming' ? '#9CA3AF' : '#28A745';
                  
                  return (
                    <Card key={stage.id} className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
                      <CardContent className="p-0">
                        {/* Stage Header - Collapsible */}
                        <button
                          onClick={() => toggleStage(stage.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: stage.status === 'current' ? '#E3F2FD' : stage.status === 'upcoming' ? '#F3F4F6' : '#E8F5E9' }}
                            >
                              {React.createElement(stageIcon, { 
                                className: 'h-4 w-4',
                                style: { color: stageColor }
                              })}
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                  Stage: {stage.name} <span style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', marginLeft: '4px' }}>({stage.count})</span>
                                </span>
                                {stage.status === 'current' && (
                                  <Badge 
                                    className="px-2 py-0.5 rounded-full" 
                                    style={{ backgroundColor: '#005B94', color: 'white', fontSize: '10px', fontWeight: 500 }}
                                  >
                                    CURRENT
                                  </Badge>
                                )}
                                {stage.status === 'upcoming' && (
                                  <Badge 
                                    className="px-2 py-0.5 rounded-full" 
                                    style={{ backgroundColor: '#9CA3AF', color: 'white', fontSize: '10px', fontWeight: 500 }}
                                  >
                                    UPCOMING
                                  </Badge>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                                {stage.enteredDate 
                                  ? `Entered ${new Date(stage.enteredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` 
                                  : 'Not yet reached'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                              {stage.items.length} {stage.items.length === 1 ? 'item' : 'items'}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" style={{ color: '#6B7280' }} />
                            ) : (
                              <ChevronDown className="h-5 w-5" style={{ color: '#6B7280' }} />
                            )}
                          </div>
                        </button>

                        {/* Timeline Items for this stage */}
                        {isExpanded && (
                          <div className="border-t px-4 pb-4" style={{ borderColor: '#E5E7EB' }}>
                            {stage.items.length > 0 ? (
                              <div className="relative pl-8 pt-4">
                                {/* Vertical timeline line */}
                                <div 
                                  className="absolute left-4 top-4 bottom-0 w-0.5"
                                  style={{ backgroundColor: '#E5E7EB' }}
                                />
                                
                                <div className="space-y-4">
                                  {stage.items.map((item: any, itemIndex: number) => {
                                  // Filter based on selection
                                  if (timelineFilter === 'tasks' && item.type !== 'task') return null;
                                  if (timelineFilter === 'stages' && item.type !== 'stage-change') return null;
                                  
                                  let icon;
                                  let iconBg;
                                  let iconColor;
                                  
                                  if (item.type === 'stage-change') {
                                    icon = Target;
                                    iconBg = '#E3F2FD';
                                    iconColor = '#005B94';
                                  } else if (item.type === 'task') {
                                    if (item.status === 'Completed') {
                                      icon = CheckCircle2;
                                      iconBg = '#E8F5E9';
                                      iconColor = '#28A745';
                                    } else if (item.status === 'In Progress') {
                                      icon = Clock;
                                      iconBg = '#E3F2FD';
                                      iconColor = '#005B94';
                                    } else {
                                      icon = AlertCircle;
                                      iconBg = '#FFF3E0';
                                      iconColor = '#FFA500';
                                    }
                                  } else {
                                    icon = Zap;
                                    iconBg = '#F3E5F5';
                                    iconColor = '#9C27B0';
                                  }
                                  
                                  return (
                                    <div key={item.id} className="relative flex gap-4">
                                      {/* Timeline dot */}
                                      <div 
                                        className="absolute -left-8 w-3 h-3 rounded-full border-2 bg-white"
                                        style={{ borderColor: '#E5E7EB', marginTop: '4px' }}
                                      />
                                      
                                      <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                          {/* Icon */}
                                          <div 
                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: iconBg }}
                                          >
                                            {React.createElement(icon, { 
                                              className: 'h-4 w-4',
                                              style: { color: iconColor }
                                            })}
                                          </div>
                                          
                                          {/* Content */}
                                          <div className="flex-1">
                                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                                              {item.title}
                                            </div>
                                            
                                            {/* Metadata */}
                                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                              {item.date && (
                                                <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                                  <Calendar className="h-3 w-3" />
                                                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                              )}
                                              {item.completedDate && (
                                                <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                                  <CheckCircle2 className="h-3 w-3" />
                                                  Completed {new Date(item.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                              )}
                                              {item.dueDate && (
                                                <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                                  <Clock className="h-3 w-3" />
                                                  Due {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                              )}
                                              {item.assignee && (
                                                <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                                  <User className="h-3 w-3" />
                                                  {item.assignee}
                                                </div>
                                              )}
                                              {item.user && (
                                                <div className="flex items-center gap-1" style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                                                  <User className="h-3 w-3" />
                                                  {item.user}
                                                </div>
                                              )}
                                              {item.status && item.type === 'task' && (
                                                <>
                                                  <span style={{ color: '#E5E7EB' }}>•</span>
                                                  {item.status === 'Completed' ? (
                                                    <Badge className="bg-green-600 text-white px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 500 }}>
                                                      ✅ Complete
                                                    </Badge>
                                                  ) : item.status === 'In Progress' ? (
                                                    <Badge style={{ backgroundColor: '#005B94', color: 'white', fontSize: '10px', fontWeight: 500 }} className="px-2 py-0.5 rounded-full">
                                                      ⏳ In Progress
                                                    </Badge>
                                                  ) : item.status === 'Pending' ? (
                                                    <Badge className="bg-orange-500 text-white px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 500 }}>
                                                      ⚠️ Pending
                                                    </Badge>
                                                  ) : (
                                                    <Badge className="bg-gray-500 text-white px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 500 }}>
                                                      {item.status}
                                                    </Badge>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="p-6 text-center" style={{ fontSize: '14px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                No activity in this stage yet
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* AI Timeline Insights */}
              {showAgentPanel && !dismissedInsights.includes('timeline-insights') && (
                <Card className="mt-4 bg-gradient-to-br from-teal-50 to-cyan-50 border" style={{ borderColor: '#CCFBF1' }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#00B8C4' }}>
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                          AI Timeline Analysis
                        </span>
                      </div>
                      <button
                        onClick={() => setDismissedInsights([...dismissedInsights, 'timeline-insights'])}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {/* Velocity Metric */}
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-teal-100">
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                            Deal Velocity
                          </span>
                          <Badge className="bg-green-100 text-green-700 border-0" style={{ fontSize: '10px', fontWeight: 500 }}>
                            Above Average
                          </Badge>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                          This deal is progressing 18% faster than similar deals. Estimated close date: Dec 5 (4 days ahead of schedule).
                        </p>
                      </div>

                      {/* Milestone Prediction */}
                      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-teal-100">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#00B8C4' }} />
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '4px' }}>
                              Next Milestone Prediction
                            </span>
                            <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                              Based on current momentum, expect to reach Contracting stage by Nov 22. Consider scheduling legal review now.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t flex items-center justify-between" style={{ borderColor: '#CCFBF1' }}>
                      <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        Analyzed 42 timeline events
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            )}

            {/* Documents Tab */}
            <TabsContent value="documents" className="p-6 mt-0">
              <div className="mb-4">
                <Button
                  className="text-white"
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    backgroundColor: '#005B94',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              <div className="space-y-1">
                {sampleDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 py-3 px-1 border-b"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <div className="p-1.5 rounded" style={{ backgroundColor: '#F3F4F6' }}>
                      <FileText className="h-4 w-4" style={{ color: '#005B94' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                        {doc.size} • {doc.draftedBy === 'agent' ? 'Generated by Agent' : `Uploaded by ${doc.uploadedBy}`} • {new Date(doc.uploadedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300 flex-shrink-0">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>

            </TabsContent>

            {/* Collection Tab */}
            {collectionTabVisible && (
              <TabsContent value="collection" className="mt-0">
                {(() => {
                  const spaces = getCollectionSpaces(deal.city);
                  const sections = [
                    { key: 'Recommended' as const, color: '#1D9E75' },
                    { key: 'Saved'       as const, color: '#185FA5' },
                    { key: 'Shortlisted' as const, color: '#BA7517' },
                  ];

                  const typeStyle = (type: string): React.CSSProperties => {
                    switch (type) {
                      case 'Office Suite':   return { backgroundColor: '#EFF6FF', color: '#1D4ED8' };
                      case 'Team Office':    return { backgroundColor: '#F5F3FF', color: '#6D28D9' };
                      case 'Coworking':      return { backgroundColor: '#ECFDF5', color: '#065F46' };
                      case 'Private Office': return { backgroundColor: '#FFF7ED', color: '#C2410C' };
                      default:               return { backgroundColor: '#F3F4F6', color: '#374151' };
                    }
                  };

                  const fmtPrice = (p: number) => `$${p >= 1000 ? `${(p / 1000).toFixed(0)}K` : p.toLocaleString()}/mo`;

                  return (
                    <div style={{ fontFamily: 'Inter, sans-serif' }}>
                      {/* Header */}
                      <div style={{ padding: '16px 24px', borderBottom: '1px solid #F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA' }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{deal.city} Workspace Collection</div>
                          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Showing {spaces.length} alternative workspaces</div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6B7280' }}>
                          {sections.map(s => {
                            const count = spaces.filter(sp => sp.category === s.key).length;
                            return count > 0 ? (
                              <span key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: s.color, display: 'inline-block' }} />
                                <span style={{ color: s.color, fontWeight: 600 }}>{count}</span> {s.key}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>

                      {/* Column headers */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 24px', borderBottom: '1px solid #F0F2F5', backgroundColor: '#F8F9FA' }}>
                        <div style={{ width: 52, flexShrink: 0 }} />
                        <div style={{ minWidth: 200, maxWidth: 220, flexShrink: 0, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workspace</div>
                        <div style={{ flex: 1, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</div>
                        <div style={{ flexShrink: 0, width: 120, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</div>
                        <div style={{ minWidth: 90, flexShrink: 0, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacity</div>
                        <div style={{ minWidth: 90, flexShrink: 0, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</div>
                        <div style={{ flexShrink: 0, width: 130, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</div>
                        <div style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amenities</div>
                      </div>

                      {/* Sections */}
                      {sections.map(({ key, color }) => {
                        const group = spaces.filter(s => s.category === key);
                        if (!group.length) return null;
                        return (
                          <div key={key}>
                            {/* Section label */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px 6px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{key}</span>
                              <div style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{group.length}</span>
                            </div>

                            {/* Rows */}
                            {group.map((space) => (
                              <div
                                key={space.id}
                                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px', borderBottom: '1px solid #F3F4F6' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F8FAFF')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                              >
                                {/* Thumbnail */}
                                <img src={space.image} alt={space.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />

                                {/* Name + rating */}
                                <div style={{ minWidth: 200, maxWidth: 220, flexShrink: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{space.name}</div>
                                  <div style={{ fontSize: 12, marginTop: 2 }}>
                                    <span style={{ color: '#F59E0B' }}>{'★'.repeat(Math.floor(space.rating))}</span>
                                    <span style={{ color: '#D1D5DB' }}>{'★'.repeat(5 - Math.floor(space.rating))}</span>
                                    <span style={{ color: '#9CA3AF', marginLeft: 4, fontSize: 11 }}>{space.rating.toFixed(1)}</span>
                                  </div>
                                </div>

                                {/* Address */}
                                <div style={{ flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 1.4, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {space.address}
                                </div>

                                {/* Type */}
                                <div style={{ flexShrink: 0, width: 120 }}>
                                  <span style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 9999, fontSize: 12, fontWeight: 500, ...typeStyle(space.type) }}>
                                    {space.type}
                                  </span>
                                </div>

                                {/* Capacity */}
                                <div style={{ fontSize: 13, color: '#374151', minWidth: 90, flexShrink: 0 }}>{space.capacity}</div>

                                {/* Price */}
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', minWidth: 90, flexShrink: 0 }}>{fmtPrice(space.price)}</div>

                                {/* Availability */}
                                <div style={{ flexShrink: 0, width: 130 }}>
                                  <span style={{
                                    display: 'inline-block', padding: '3px 9px', borderRadius: 9999, fontSize: 12, fontWeight: 500,
                                    ...(space.isAvailable ? { backgroundColor: '#ECFDF5', color: '#065F46' } : { backgroundColor: '#FEF3C7', color: '#92400E' }),
                                  }}>
                                    {space.isAvailable ? 'Available Now' : 'Offline w/ Lease'}
                                  </span>
                                </div>

                                {/* Amenities */}
                                <div style={{ display: 'flex', gap: 4, flexShrink: 0, flexWrap: 'nowrap' }}>
                                  {space.amenities.slice(0, 2).map(a => (
                                    <span key={a} style={{ fontSize: 11, color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: 9999, whiteSpace: 'nowrap' }}>{a}</span>
                                  ))}
                                  {space.amenities.length > 2 && (
                                    <span style={{ fontSize: 11, color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '2px 7px', borderRadius: 9999 }}>+{space.amenities.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </TabsContent>
            )}

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="mt-0">
              <div className="p-6">
                <div className="mb-5">
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Timeline
                  </div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
                    Complete event history for this requirement
                  </div>
                </div>

                <div className="relative">
                  {/* Vertical connecting line */}
                  <div style={{ position: 'absolute', left: 17, top: 18, bottom: 18, width: 2, backgroundColor: '#E5E7EB' }} />

                  <div className="flex flex-col">
                    {TIMELINE_EVENTS.map((evt, idx) => (
                      <div key={idx} className="flex gap-4 pb-5 relative">
                        {/* Icon circle */}
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: evt.iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            position: 'relative',
                            zIndex: 1,
                          }}
                        >
                          <evt.Icon size={15} color="#ffffff" />
                        </div>
                        {/* Event content */}
                        <div className="flex-1 flex justify-between items-start gap-4 pt-1" style={{ minWidth: 0 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>
                              {evt.title}
                            </div>
                            <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: 2, lineHeight: 1.5 }}>
                              {evt.desc}
                            </div>
                          </div>
                          <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: 2 }}>
                            <div style={{ fontSize: '12px', color: '#374151', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                              {evt.date}
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginTop: 1, whiteSpace: 'nowrap' }}>
                              {evt.user}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Messaging Tab */}
            <TabsContent value="messaging" className="mt-0 h-full">
              <MessagingThread dealId={deal.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>

    {/* Stage Change Confirmation Dialog */}
    <Dialog open={!!stageConfirmTarget} onOpenChange={(open) => { if (!open) setStageConfirmTarget(null); }}>
      <DialogContent className="max-w-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#111827', fontFamily: 'Inter, sans-serif' }}>
            Change Stage?
          </DialogTitle>
          <DialogDescription style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
            Set the requirement stage to{' '}
            <span style={{ fontWeight: 600, color: '#111827' }}>{stageConfirmTarget?.name}</span>?
            {' '}Tasks in other stages will remain unchanged.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end mt-2">
          <Button
            variant="outline"
            onClick={() => setStageConfirmTarget(null)}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
          >
            Cancel
          </Button>
          <Button
            className="text-white"
            style={{ backgroundColor: '#005B94', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
            onClick={() => {
              if (stageConfirmTarget) {
                setCurrentDealStage(stageConfirmTarget.stage);
                toast.success(`Stage changed to ${stageConfirmTarget.name}.`);
              }
              setStageConfirmTarget(null);
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Add / Edit Task Modal */}
    <Dialog open={showAddTaskModal} onOpenChange={(open) => {
      setShowAddTaskModal(open);
      if (!open) { setIsEditMode(false); setEditingTask(null); }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
            {isEditMode ? 'Edit Task' : `Add Task to ${selectedStageName}`}
          </DialogTitle>
          <DialogDescription style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            {isEditMode
              ? 'Update task details, reassign, or change status.'
              : 'Assign work to team members or delegate to an agent for automated execution'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="task-name" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Task Name
            </Label>
            <Input
              id="task-name"
              value={newTaskData.name}
              onChange={(e) => setNewTaskData({ ...newTaskData, name: e.target.value })}
              placeholder="Enter task name"
              className="mt-1"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* Status — edit mode only */}
          {isEditMode && (
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Status
              </Label>
              <Select value={editTaskStatus} onValueChange={setEditTaskStatus}>
                <SelectTrigger className="mt-1" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="task-due-date" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Due Date
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={newTaskData.dueDate}
              onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
              className="mt-1"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          
          <div>
            <Label htmlFor="task-assigned-to" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Assigned To
            </Label>
            <Select 
              value={newTaskData.assignedTo} 
              onValueChange={(value) => setNewTaskData({ ...newTaskData, assignedTo: value, agentTaskType: '', taskType: '' })}
            >
              <SelectTrigger className="mt-1" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Me">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span>Assign to Me</span>
                  </div>
                </SelectItem>
                <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                <SelectItem value="Michael Torres">Michael Torres</SelectItem>
                <SelectItem value="Jennifer Lee">Jennifer Lee</SelectItem>
                <SelectItem value="Legal Team">Legal Team</SelectItem>
                <SelectItem value="Operations Team">Operations Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dependency */}
          <div>
            <Label htmlFor="task-dependency" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Dependency
            </Label>
            <Input
              id="task-dependency"
              value={newTaskData.dependency}
              onChange={(e) => setNewTaskData({ ...newTaskData, dependency: e.target.value })}
              placeholder="Enter task dependency (optional)"
              className="mt-1 border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* Task Type */}
          <div>
            <Label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Task Type
            </Label>
              <Select
                value={newTaskData.taskType}
                disabled={isEditMode && editTaskStatus !== 'Not Started'}
                onValueChange={(value) => setNewTaskData({ ...newTaskData, taskType: value })}
              >
                <SelectTrigger className="mt-1" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <div style={{ padding: '4px 8px 2px', fontSize: '10px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', pointerEvents: 'none' }}>
                    Evaluation
                  </div>
                  <SelectItem value="Structured evaluation + decisioning">Structured evaluation + decisioning</SelectItem>
                  <SelectItem value="Define shortlist">Define shortlist</SelectItem>
                  <SelectItem value="Schedule tour(s)">Schedule tour(s)</SelectItem>
                  <div style={{ padding: '6px 8px 2px', fontSize: '10px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', pointerEvents: 'none', borderTop: '1px solid #F3F4F6', marginTop: '4px' }}>
                    Proposal &amp; negotiation
                  </div>
                  <SelectItem value="Request/review proposal">Request/review proposal</SelectItem>
                  <SelectItem value="Negotiate terms">Negotiate terms</SelectItem>
                  <div style={{ padding: '6px 8px 2px', fontSize: '10px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', pointerEvents: 'none', borderTop: '1px solid #F3F4F6', marginTop: '4px' }}>
                    Legal &amp; contracting
                  </div>
                  <SelectItem value="Coordinate legal review">Coordinate legal review</SelectItem>
                  <SelectItem value="Contract renegotiation">Contract renegotiation</SelectItem>
                  <SelectItem value="Coordinate execution and signatures">Coordinate execution and signatures</SelectItem>
                  <div style={{ padding: '6px 8px 2px', fontSize: '10px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', pointerEvents: 'none', borderTop: '1px solid #F3F4F6', marginTop: '4px' }}>
                    Closeout
                  </div>
                  <SelectItem value="Closeout readiness">Closeout readiness (bridge into License Admin)</SelectItem>
                  <SelectItem value="Exit / replacement execution">Exit / replacement execution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          
          {/* Agent output — edit mode only */}
          {isEditMode && editingTask?.agentOutput && (
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Output
                {editingTask.executionTimestamp && (
                  <span style={{ fontSize: '11px', fontWeight: 400, color: '#9CA3AF', marginLeft: '6px' }}>
                    {editingTask.executionTimestamp}
                  </span>
                )}
              </Label>
              <div className="mt-1 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '13px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1.6', marginBottom: editingTask.collectionUrl ? '10px' : '0' }}>
                  {editingTask.agentOutput}
                </div>
                {editingTask.collectionUrl && (
                  <a href={editingTask.collectionUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:underline"
                    style={{ fontSize: '12px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    <Eye className="h-3 w-3" />
                    View Collection
                  </a>
                )}
                {!editingTask.collectionUrl && (editingTask.agentState === 'completed' || editingTask.agentState === 'needs_review') && (
                  <a href="#" onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-1.5 hover:underline"
                    style={{ fontSize: '12px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    <Eye className="h-3 w-3" />
                    View Full Output
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleAddTask}
              className="flex-1 text-white"
              style={{
                backgroundColor: '#005B94',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif'
              }}
              disabled={!newTaskData.name || !newTaskData.dueDate}
            >
              {isEditMode ? 'Save Changes' : 'Add Task'}
            </Button>
            <Button
              onClick={() => { setShowAddTaskModal(false); setIsEditMode(false); setEditingTask(null); }}
              variant="outline"
              className="flex-1"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Upload Documents Modal */}
    <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
      <DialogContent className="max-w-lg p-0">
        <DialogDescription className="sr-only">
          Upload documents for this requirement
        </DialogDescription>
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#111827' }}>
                Upload Documents
              </DialogTitle>
              <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                Upload files for {deal.dealName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUploadModal(false)}
              className="text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Document Category */}
          <div>
            <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Document Category <span style={{ color: '#DC2626' }}>*</span>
            </Label>
            <Select
              value={uploadData.category}
              onValueChange={(value) => setUploadData({ ...uploadData, category: value })}
            >
              <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Floor Plans">Floor Plans</SelectItem>
                <SelectItem value="Pricing">Pricing</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Description <span style={{ color: '#6B7280', fontWeight: 400 }}>(optional)</span>
            </Label>
            <Textarea
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Add a description for this document..."
              className="mt-2 border-gray-300 min-h-[80px]"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* File Drop Zone */}
          <div>
            <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Files <span style={{ color: '#DC2626' }}>*</span>
            </Label>
            <div
              className="mt-2 rounded-xl flex flex-col items-center justify-center py-10 px-6 cursor-pointer hover:bg-blue-50 transition-colors"
              style={{ border: '2px dashed #D1D5DB', backgroundColor: '#F9FAFB' }}
              onClick={() => {/* file picker would open here */}}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: '#EFF6FF' }}
              >
                <Upload className="h-6 w-6" style={{ color: '#005B94' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                Drag and drop files here
              </p>
              <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>
                or click to browse from your computer
              </p>
              <p style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                Supported formats: PDF, DOCX, XLSX, PNG, JPG — Max 25 MB per file
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <Button
            variant="outline"
            onClick={() => setShowUploadModal(false)}
            className="border-gray-300"
            style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </Button>
          <Button
            className="text-white"
            style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            disabled={!uploadData.category}
            onClick={() => {
              setShowUploadModal(false);
              setUploadData({ category: '', description: '' });
              toast.success('Document uploaded successfully.');
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}