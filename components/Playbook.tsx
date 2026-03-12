import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Search,
  Plus,
  FileText,
  Video,
  CheckSquare,
  Link as LinkIcon,
  Calendar,
  BookOpen,
  Star,
  Clock,
  User,
  Tag,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { PlaybookDetailModal } from './PlaybookDetailModal';
import { CreatePlaybookModal } from './CreatePlaybookModal';

interface PlaybookEntry {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'link' | 'checklist' | 'video' | 'calendar';
  tags: string[];
  lastUpdated: string;
  createdBy: {
    name: string;
    initials: string;
  };
  isPinned?: boolean;
  content?: string;
  externalUrl?: string;
  comments?: number;
  views?: number;
  knowledgeSource?: 'human' | 'agent';
  validationStatus?: 'draft' | 'validated' | 'canonical';
  generatedFromDeal?: string;
  validatedBy?: string;
}

const samplePlaybookEntries: PlaybookEntry[] = [
  {
    id: '1',
    title: 'Tel Tech Deal Qualification Process',
    description: 'Step-by-step guide for qualifying enterprise clients like Tel Tech. Includes discovery questions, budget thresholds, and decision-maker identification.',
    type: 'text',
    tags: ['Process', 'Sales', 'Enterprise'],
    lastUpdated: '2025-11-12',
    createdBy: {
      name: 'Sarah Chen',
      initials: 'SC',
    },
    isPinned: true,
    comments: 8,
    views: 124,
    content: 'Full process documentation here...',
    knowledgeSource: 'human',
  },
  {
    id: '2',
    title: 'Proposal Template - Enterprise Clients',
    description: 'Google Docs template for enterprise workspace proposals. Pre-formatted with pricing tables, terms, and Tel Tech case study.',
    type: 'link',
    tags: ['Template', 'Docs', 'Sales'],
    lastUpdated: '2025-11-10',
    createdBy: {
      name: 'Michael Torres',
      initials: 'MT',
    },
    isPinned: false,
    comments: 3,
    views: 89,
    externalUrl: 'https://docs.google.com/document/d/example',
    knowledgeSource: 'human',
  },
  {
    id: '3',
    title: 'New Broker Onboarding Checklist',
    description: 'Complete 30-day onboarding checklist for new team members. Covers system access, training modules, shadow sessions, and first deal milestones.',
    type: 'checklist',
    tags: ['Training', 'Onboarding', 'HR'],
    lastUpdated: '2025-11-08',
    createdBy: {
      name: 'Sarah Chen',
      initials: 'SC',
    },
    isPinned: true,
    comments: 15,
    views: 256,
    knowledgeSource: 'human',
  },
  {
    id: '4',
    title: 'How to Use AI Assistant for Deal Research',
    description: 'Video walkthrough showing how to leverage the AI Assistant for market research, competitive analysis, and client intelligence gathering.',
    type: 'video',
    tags: ['Training', 'AI', 'HowTo'],
    lastUpdated: '2025-11-05',
    createdBy: {
      name: 'Michael Torres',
      initials: 'MT',
    },
    isPinned: false,
    comments: 22,
    views: 318,
    externalUrl: 'https://www.loom.com/share/example',
    knowledgeSource: 'human',
  },
  {
    id: '5',
    title: 'Legal Review Calendar - Q4 2025',
    description: 'Shared calendar for contract review slots with legal team. Book 30-minute windows for deal contract reviews and compliance checks.',
    type: 'calendar',
    tags: ['Legal', 'Scheduling', 'Compliance'],
    lastUpdated: '2025-11-03',
    createdBy: {
      name: 'Legal Team',
      initials: 'LT',
    },
    isPinned: false,
    comments: 5,
    views: 67,
    externalUrl: 'https://calendar.google.com/example',
    knowledgeSource: 'human',
  },
  {
    id: '6',
    title: 'Objection Handling Framework',
    description: 'Common objections from prospects and proven response frameworks. Includes pricing concerns, competitor comparisons, and contract terms.',
    type: 'text',
    tags: ['Sales', 'Training', 'Process'],
    lastUpdated: '2025-10-28',
    createdBy: {
      name: 'Sarah Chen',
      initials: 'SC',
    },
    isPinned: true,
    comments: 31,
    views: 445,
    knowledgeSource: 'human',
  },
  {
    id: '7',
    title: 'Market Research - NYC Workspace Trends',
    description: 'Q3 2025 market analysis document with pricing trends, occupancy rates, and competitor positioning in NYC metro area.',
    type: 'link',
    tags: ['Research', 'Market', 'Docs'],
    lastUpdated: '2025-10-15',
    createdBy: {
      name: 'Research Team',
      initials: 'RT',
    },
    isPinned: false,
    comments: 12,
    views: 203,
    externalUrl: 'https://drive.google.com/file/d/example',
    knowledgeSource: 'human',
  },
  {
    id: '8',
    title: 'Contract Negotiation Best Practices',
    description: 'Video series covering negotiation tactics, win-win strategies, and deal structuring for complex enterprise agreements.',
    type: 'video',
    tags: ['Training', 'Legal', 'Sales'],
    lastUpdated: '2025-10-10',
    createdBy: {
      name: 'Michael Torres',
      initials: 'MT',
    },
    isPinned: false,
    comments: 18,
    views: 287,
    knowledgeSource: 'human',
  },
  // Agent-Generated Entries
  {
    id: '9',
    title: 'Enterprise Lease Addendum – Parking Allocation Clause (Template)',
    description: 'Standardized addendum language for enterprise clients requiring reserved parking allocations with escalation protections.',
    type: 'text',
    tags: ['Template', 'Legal', 'Enterprise'],
    lastUpdated: '2026-02-08',
    createdBy: {
      name: 'TransactionCoordinatorAgent',
      initials: 'TC',
    },
    isPinned: false,
    comments: 4,
    views: 67,
    content: `**Parking Allocation**. Landlord shall allocate 15 reserved parking spaces for Tenant use located in the building's underground parking facility.

**Escalation**. Parking fees shall not increase more than 3% annually, compounded from the Base Rent commencement date.

**Termination Clause**. If allocation drops below 80% of committed spaces for more than 30 consecutive days, Tenant may terminate this addendum with 60 days written notice.`,
    knowledgeSource: 'agent',
    validationStatus: 'canonical',
    generatedFromDeal: 'Tel Tech NYC Expansion',
    validatedBy: 'Sarah Chen',
  },
  {
    id: '10',
    title: 'Flex Office Pricing Benchmark – Midtown 4,000–6,000 sq ft',
    description: 'Aggregated pricing benchmarks and concession ranges for Midtown private office and team suite inventory.',
    type: 'text',
    tags: ['Research', 'Market', 'Flex'],
    lastUpdated: '2026-02-07',
    createdBy: {
      name: 'MarketSourcingAgent',
      initials: 'MS',
    },
    isPinned: false,
    comments: 7,
    views: 94,
    content: `**Key Insights:**
- Private office premium: +18–25% over dedicated desk
- Typical concessions: 1 month free per 12 months
- Buildout allowance range: $15–$35/sf
- Move-in timeline: 2-4 weeks from contract execution
- Peak pricing: September-November`,
    knowledgeSource: 'agent',
    validationStatus: 'validated',
    generatedFromDeal: 'Tel Tech NYC Expansion',
    validatedBy: 'Sarah Chen',
  },
  {
    id: '11',
    title: 'Insurance Certificate Compliance Checklist – Pre-Execution',
    description: 'Structured checklist to validate insurance compliance before execution stage.',
    type: 'checklist',
    tags: ['Legal', 'Risk', 'Compliance'],
    lastUpdated: '2026-02-06',
    createdBy: {
      name: 'RiskComplianceAgent',
      initials: 'RC',
    },
    isPinned: false,
    comments: 2,
    views: 43,
    content: `✓ COI received from tenant
✓ Named insured includes landlord
✓ Coverage meets minimum $5M aggregate
✓ Waiver of subrogation included
✓ Additional insured endorsement attached
✓ Policy effective dates cover lease term
✓ Certificate holder information accurate`,
    knowledgeSource: 'agent',
    validationStatus: 'canonical',
    generatedFromDeal: 'MediaCo Chicago Office',
    validatedBy: 'Sarah Chen',
  },
  {
    id: '12',
    title: 'Enterprise Expansion Stakeholder Alignment Pattern',
    description: 'Common stakeholder map and approval sequencing for multi-location enterprise expansions.',
    type: 'text',
    tags: ['Process', 'Enterprise', 'Stakeholder'],
    lastUpdated: '2026-02-05',
    createdBy: {
      name: 'StakeholderAlignmentAgent',
      initials: 'SA',
    },
    isPinned: false,
    comments: 9,
    views: 112,
    content: `**Key Pattern:**
1. Finance confirms budget band
2. Legal pre-clears template terms
3. Ops reviews access + move-in timing
4. Executive sign-off after commercial alignment

**Typical Timeline:** 2-3 weeks from initial proposal to executive approval
**Critical Success Factor:** Parallel track legal and financial review to avoid delays`,
    knowledgeSource: 'agent',
    validationStatus: 'draft',
    generatedFromDeal: 'Tel Tech NYC Expansion',
  },
];

export function Playbook() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<PlaybookEntry | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterBroker, setFilterBroker] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEntries = samplePlaybookEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesBroker =
      filterBroker === 'all' || entry.createdBy.name === filterBroker;
    const matchesTeam = filterTeam === 'all'; // Add team logic as needed

    return matchesSearch && matchesType && matchesBroker && matchesTeam;
  });

  const pinnedEntries = filteredEntries.filter((entry) => entry.isPinned);
  const unpinnedEntries = filteredEntries.filter((entry) => !entry.isPinned);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5" style={{ color: '#005B94' }} />;
      case 'link':
        return <LinkIcon className="h-5 w-5" style={{ color: '#00B8C4' }} />;
      case 'checklist':
        return <CheckSquare className="h-5 w-5" style={{ color: '#28A745' }} />;
      case 'video':
        return <Video className="h-5 w-5" style={{ color: '#FFA500' }} />;
      case 'calendar':
        return <Calendar className="h-5 w-5" style={{ color: '#6B7280' }} />;
      default:
        return <FileText className="h-5 w-5" style={{ color: '#374151' }} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Document';
      case 'link':
        return 'External Link';
      case 'checklist':
        return 'Checklist';
      case 'video':
        return 'Video';
      case 'calendar':
        return 'Calendar';
      default:
        return type;
    }
  };

  const PlaybookCard = ({ entry }: { entry: PlaybookEntry }) => (
    <Card
      className="bg-white rounded-xl border-0 hover:shadow-lg transition-all cursor-pointer group"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
      onClick={() => setSelectedEntry(entry)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(entry.type)}
            {entry.isPinned && (
              <Star
                className="h-4 w-4"
                style={{ color: '#FFA500', fill: '#FFA500' }}
              />
            )}
            {entry.knowledgeSource === 'agent' && (
              <Bot
                className="h-4 w-4"
                style={{ color: '#28A745' }}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {entry.validationStatus === 'canonical' && (
              <Badge
                className="px-2 py-0.5 rounded text-white"
                style={{
                  backgroundColor: '#005B94',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                Canonical
              </Badge>
            )}
            {entry.validationStatus === 'validated' && (
              <Badge
                className="px-2 py-0.5 rounded text-white"
                style={{
                  backgroundColor: '#28A745',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                Validated
              </Badge>
            )}
            {entry.validationStatus === 'draft' && entry.knowledgeSource === 'agent' && (
              <Badge
                className="px-2 py-0.5 rounded text-white"
                style={{
                  backgroundColor: '#6B7280',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                Draft
              </Badge>
            )}
            {entry.externalUrl && (
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            )}
          </div>
        </div>

        {entry.knowledgeSource === 'agent' && (
          <div className="mb-2 flex items-center gap-1">
            <Badge
              className="px-2 py-0.5 rounded"
              style={{
                backgroundColor: '#E8F5E9',
                color: '#28A745',
                fontSize: '10px',
                fontWeight: 600,
              }}
            >
              Agent Generated
            </Badge>
            {entry.validatedBy && (
              <span
                style={{
                  fontSize: '10px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                • Validated by {entry.validatedBy}
              </span>
            )}
          </div>
        )}

        <h3
          className="mb-2 group-hover:text-blue-700 transition-colors"
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#374151',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.3',
          }}
        >
          {entry.title}
        </h3>

        <p
          className="mb-4 line-clamp-2"
          style={{
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.5',
          }}
        >
          {entry.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {entry.tags.map((tag) => (
            <Badge
              key={tag}
              className="px-2 py-1 rounded"
              style={{
                backgroundColor: '#F8F9FA',
                color: '#374151',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback
                style={{
                  backgroundColor: entry.knowledgeSource === 'agent' ? '#28A745' : '#005B94',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                {entry.createdBy.initials}
              </AvatarFallback>
            </Avatar>
            <span
              style={{
                fontSize: '12px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {entry.createdBy.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {entry.comments !== undefined && (
              <span
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {entry.comments} comments
              </span>
            )}
            <span
              style={{
                fontSize: '12px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {entry.lastUpdated}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#005B94' }} className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-white mb-2"
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.2',
                }}
              >
                Playbook
              </h1>
              <p
                className="text-white/90"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Reference team knowledge, processes, and shared resources.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-white hover:bg-white/20 transition-colors"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Helper Text */}
        <div
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: '#F0F9FF',
            border: '1px solid #BFDBFE',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#374151',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.5',
            }}
          >
            Playbook entries may be created by team members or generated by agents. Canonical entries are available for agent reference during task execution.
          </p>
        </div>

        {/* Filters and Search */}
        <Card
          className="bg-white rounded-xl border-0 mb-5"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search playbook entries, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger
                  className="w-40 border-gray-300"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                >
                  <SelectValue placeholder="By Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Documents</SelectItem>
                  <SelectItem value="link">External Links</SelectItem>
                  <SelectItem value="checklist">Checklists</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="calendar">Calendars</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBroker} onValueChange={setFilterBroker}>
                <SelectTrigger
                  className="w-40 border-gray-300"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                >
                  <SelectValue placeholder="By Broker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brokers</SelectItem>
                  <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                  <SelectItem value="Michael Torres">Michael Torres</SelectItem>
                  <SelectItem value="Legal Team">Legal Team</SelectItem>
                  <SelectItem value="Research Team">Research Team</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger
                  className="w-40 border-gray-300"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                >
                  <SelectValue placeholder="By Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pinned Entries */}
        {pinnedEntries.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5" style={{ color: '#FFA500', fill: '#FFA500' }} />
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Pinned Resources
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedEntries.map((entry) => (
                <PlaybookCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {/* All Entries */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              All Resources
            </h2>
            <span
              style={{
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedEntries.map((entry) => (
              <PlaybookCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>

        {filteredEntries.length === 0 && (
          <Card
            className="bg-white rounded-xl border-0"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3
                className="mb-2"
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                No entries found
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Try adjusting your filters or create a new entry
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      {selectedEntry && (
        <PlaybookDetailModal
          entry={selectedEntry}
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}

      <CreatePlaybookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}