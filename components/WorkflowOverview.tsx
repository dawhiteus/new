import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { 
  Search, 
  Bot,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  X,
  ExternalLink,
  User,
  MapPin,
  Building2,
  Calendar,
  ArrowRight,
  Target,
  Briefcase,
  Plus,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { CreateEditDealModal } from './CreateEditDealModal';

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
  nextTask: {
    name: string;
    dueDate: string;
    assignedTo: string;
    status: string;
  };
}

interface WorkflowOverviewProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
  onNavigateToDeal?: (dealId: string) => void;
}

const sampleDeals: Deal[] = [
  // Requirement Identified
  {
    id: '1',
    dealName: 'MediaCo Chicago Office',
    clientName: 'MediaCo',
    city: 'Chicago, IL',
    workspaceType: 'Private Office',
    dealStage: 'Requirement',
    size: 12,
    estValue: 550000,
    status: 'Active',
    lastUpdated: '2025-11-07',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Initial discovery call',
      dueDate: '2025-11-15',
      assignedTo: 'Sarah Chen',
      status: 'Not Started',
    },
  },
  {
    id: '2',
    dealName: 'FinTech Startup Portland',
    clientName: 'FinTech Startup',
    city: 'Portland, OR',
    workspaceType: 'Hot Desk',
    dealStage: 'Requirement',
    size: 3,
    estValue: 380000,
    status: 'Active',
    lastUpdated: '2025-11-08',
    broker: 'Michael Torres',
    nextTask: {
      name: 'Send intro email',
      dueDate: '2025-11-13',
      assignedTo: 'Michael Torres',
      status: 'Not Started',
    },
  },
  {
    id: '3',
    dealName: 'DesignHub Miami',
    clientName: 'DesignHub',
    city: 'Miami, FL',
    workspaceType: 'Team Suite',
    dealStage: 'Requirement',
    size: 6,
    estValue: 520000,
    status: 'Active',
    lastUpdated: '2025-11-09',
    broker: 'David Kim',
    nextTask: {
      name: 'Schedule discovery meeting',
      dueDate: '2025-11-14',
      assignedTo: 'David Kim',
      status: 'In Progress',
    },
  },
  {
    id: '4',
    dealName: 'EcoSolutions Seattle',
    clientName: 'EcoSolutions',
    city: 'Seattle, WA',
    workspaceType: 'Dedicated Desk',
    dealStage: 'Requirement',
    size: 8,
    estValue: 640000,
    status: 'Active',
    lastUpdated: '2025-11-10',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Research client needs',
      dueDate: '2025-11-16',
      assignedTo: 'Sarah Chen',
      status: 'Not Started',
    },
  },

  // Site Tours Scheduled
  {
    id: '5',
    dealName: 'Tech Ventures SF Office',
    clientName: 'Tech Ventures',
    city: 'San Francisco, CA',
    workspaceType: 'Team Suite',
    dealStage: 'Evaluate',
    size: 8,
    estValue: 790000,
    status: 'Active',
    lastUpdated: '2025-11-09',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Conduct site tour',
      dueDate: '2025-11-13',
      assignedTo: 'Sarah Chen',
      status: 'Not Started',
    },
  },
  {
    id: '6',
    dealName: 'DataCorp Austin Hub',
    clientName: 'DataCorp',
    city: 'Austin, TX',
    workspaceType: 'Private Office',
    dealStage: 'Evaluate',
    size: 20,
    estValue: 1080000,
    status: 'Active',
    lastUpdated: '2025-11-08',
    broker: 'Michael Torres',
    nextTask: {
      name: 'Prepare tour materials',
      dueDate: '2025-11-12',
      assignedTo: 'Michael Torres',
      status: 'Overdue',
    },
  },
  {
    id: '7',
    dealName: 'CloudTech Denver Space',
    clientName: 'CloudTech',
    city: 'Denver, CO',
    workspaceType: 'Team Suite',
    dealStage: 'Evaluate',
    size: 15,
    estValue: 820000,
    status: 'Active',
    lastUpdated: '2025-11-10',
    broker: 'David Kim',
    nextTask: {
      name: 'Confirm tour logistics',
      dueDate: '2025-11-14',
      assignedTo: 'David Kim',
      status: 'In Progress',
    },
  },

  // LOI / Proposal Sent
  {
    id: '8',
    dealName: 'Global Finance Boston Hub',
    clientName: 'Global Finance',
    city: 'Boston, MA',
    workspaceType: 'Dedicated Desk',
    dealStage: 'Terms',
    size: 20,
    estValue: 950000,
    status: 'Active',
    lastUpdated: '2025-11-08',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Follow up with client',
      dueDate: '2025-11-11',
      assignedTo: 'Sarah Chen',
      status: 'Overdue',
    },
  },
  {
    id: '9',
    dealName: 'HealthTech Miami Space',
    clientName: 'HealthTech',
    city: 'Miami, FL',
    workspaceType: 'Private Office',
    dealStage: 'Terms',
    size: 18,
    estValue: 850000,
    status: 'Active',
    lastUpdated: '2025-11-09',
    broker: 'David Kim',
    nextTask: {
      name: 'Answer proposal questions',
      dueDate: '2025-11-15',
      assignedTo: 'David Kim',
      status: 'In Progress',
    },
  },
  {
    id: '10',
    dealName: 'RetailHub NYC',
    clientName: 'RetailHub',
    city: 'New York, NY',
    workspaceType: 'Team Suite',
    dealStage: 'Terms',
    size: 10,
    estValue: 650000,
    status: 'Active',
    lastUpdated: '2025-11-10',
    broker: 'Michael Torres',
    nextTask: {
      name: 'Schedule follow-up call',
      dueDate: '2025-11-13',
      assignedTo: 'Michael Torres',
      status: 'Not Started',
    },
  },
  {
    id: '11',
    dealName: 'LegalTech LA Office',
    clientName: 'LegalTech',
    city: 'Los Angeles, CA',
    workspaceType: 'Private Office',
    dealStage: 'Terms',
    size: 25,
    estValue: 1200000,
    status: 'Active',
    lastUpdated: '2025-11-11',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Send pricing breakdown',
      dueDate: '2025-11-14',
      assignedTo: 'Sarah Chen',
      status: 'In Progress',
    },
  },

  // LOI / Lease Negotiation
  {
    id: '12',
    dealName: 'Tel Tech NYC Expansion',
    clientName: 'Tel Tech',
    city: 'New York, NY',
    workspaceType: 'Private Office',
    dealStage: 'Negotiation',
    size: 15,
    estValue: 760000,
    status: 'Active',
    lastUpdated: '2025-11-10',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Send proposal document',
      dueDate: '2025-11-14',
      assignedTo: 'Sarah Chen',
      status: 'In Progress',
    },
  },
  {
    id: '13',
    dealName: 'ConsultCo Denver Office',
    clientName: 'ConsultCo',
    city: 'Denver, CO',
    workspaceType: 'Dedicated Desk',
    dealStage: 'Negotiation',
    size: 10,
    estValue: 540000,
    status: 'Active',
    lastUpdated: '2025-11-10',
    broker: 'Michael Torres',
    nextTask: {
      name: 'Finalize pricing terms',
      dueDate: '2025-11-17',
      assignedTo: 'Michael Torres',
      status: 'Not Started',
    },
  },
  {
    id: '14',
    dealName: 'BioMed Philadelphia',
    clientName: 'BioMed',
    city: 'Philadelphia, PA',
    workspaceType: 'Private Office',
    dealStage: 'Negotiation',
    size: 22,
    estValue: 1000000,
    status: 'Active',
    lastUpdated: '2025-11-11',
    broker: 'David Kim',
    nextTask: {
      name: 'Review contract terms',
      dueDate: '2025-11-15',
      assignedTo: 'David Kim',
      status: 'In Progress',
    },
  },
  {
    id: '15',
    dealName: 'AdTech San Diego',
    clientName: 'AdTech',
    city: 'San Diego, CA',
    workspaceType: 'Team Suite',
    dealStage: 'Negotiation',
    size: 12,
    estValue: 680000,
    status: 'Active',
    lastUpdated: '2025-11-09',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Address lease concerns',
      dueDate: '2025-11-16',
      assignedTo: 'Sarah Chen',
      status: 'Not Started',
    },
  },

  // Lease Finalization
  {
    id: '16',
    dealName: 'StartupX Austin Space',
    clientName: 'StartupX',
    city: 'Austin, TX',
    workspaceType: 'Hot Desk',
    dealStage: 'Contracting',
    size: 5,
    estValue: 470000,
    status: 'Active',
    lastUpdated: '2025-11-11',
    broker: 'Michael Torres',
    nextTask: {
      name: 'Review contract feedback',
      dueDate: '2025-11-13',
      assignedTo: 'Michael Torres',
      status: 'In Progress',
    },
  },
  {
    id: '17',
    dealName: 'GameDev Portland',
    clientName: 'GameDev',
    city: 'Portland, OR',
    workspaceType: 'Team Suite',
    dealStage: 'Contracting',
    size: 14,
    estValue: 770000,
    status: 'Active',
    lastUpdated: '2025-11-10',
    broker: 'David Kim',
    nextTask: {
      name: 'Follow up on signatures',
      dueDate: '2025-11-14',
      assignedTo: 'David Kim',
      status: 'Not Started',
    },
  },
  {
    id: '18',
    dealName: 'Analytics Phoenix',
    clientName: 'Analytics Corp',
    city: 'Phoenix, AZ',
    workspaceType: 'Private Office',
    dealStage: 'Contracting',
    size: 18,
    estValue: 1000000,
    status: 'Active',
    lastUpdated: '2025-11-11',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Answer legal questions',
      dueDate: '2025-11-15',
      assignedTo: 'Sarah Chen',
      status: 'In Progress',
    },
  },

  // Lease Executed
  {
    id: '19',
    dealName: 'FinTech Seattle HQ',
    clientName: 'FinTech',
    city: 'Seattle, WA',
    workspaceType: 'Team Suite',
    dealStage: 'Executed',
    size: 25,
    estValue: 200000,
    status: 'Closed',
    lastUpdated: '2025-11-05',
    broker: 'David Kim',
    nextTask: {
      name: 'Onboard client',
      dueDate: '2025-11-20',
      assignedTo: 'David Kim',
      status: 'Not Started',
    },
  },
  {
    id: '20',
    dealName: 'EdTech Boston',
    clientName: 'EdTech',
    city: 'Boston, MA',
    workspaceType: 'Private Office',
    dealStage: 'Executed',
    size: 16,
    estValue: 142000,
    status: 'Closed',
    lastUpdated: '2025-11-06',
    broker: 'Sarah Chen',
    nextTask: {
      name: 'Coordinate move-in',
      dueDate: '2025-11-18',
      assignedTo: 'Sarah Chen',
      status: 'In Progress',
    },
  },
  {
    id: '21',
    dealName: 'CyberSec Atlanta',
    clientName: 'CyberSec',
    city: 'Atlanta, GA',
    workspaceType: 'Dedicated Desk',
    dealStage: 'Executed',
    size: 9,
    estValue: 78000,
    status: 'Closed',
    lastUpdated: '2025-11-07',
    broker: 'Michael Torres',
    nextTask: {
      name: 'Complete onboarding',
      dueDate: '2025-11-19',
      assignedTo: 'Michael Torres',
      status: 'Not Started',
    },
  },
];

const stages = [
  'Requirement',
  'Evaluate',
  'Terms',
  'Negotiation',
  'Contracting',
  'Executed',
];

// Draggable Deal Card Component
interface DealCardProps {
  deal: Deal;
  onClick: () => void;
  getTaskUrgencyBadge: (dueDate: string, status: string) => JSX.Element | null;
}

function DealCard({ deal, onClick, getTaskUrgencyBadge }: DealCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'DEAL',
    item: { id: deal.id, currentStage: deal.dealStage },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [deal.id, deal.dealStage]);

  return (
    <div 
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <Card 
        className="bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-move"
        onClick={onClick}
      >
        <CardContent className="p-3">
          {/* Deal Name */}
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px', lineHeight: '1.3' }}>
            {deal.dealName}
          </div>

          {/* Client Name */}
          <div className="flex items-center gap-1.5 mb-3">
            <Building2 className="h-3 w-3 flex-shrink-0" style={{ color: '#9CA3AF' }} />
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              {deal.clientName}
            </span>
          </div>

          {/* Next Step Task Name */}
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '6px', lineHeight: '1.4' }}>
            {deal.nextTask.name}
          </div>

          {/* Consolidated Task Metadata Row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 flex-shrink-0" style={{ color: '#9CA3AF' }} />
              <span 
                style={{ 
                  fontSize: '12px', 
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400
                }}
              >
                {new Date(deal.nextTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            {getTaskUrgencyBadge(deal.nextTask.dueDate, deal.nextTask.status)}
            <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
              •
            </span>
            <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', textTransform: 'capitalize' }}>
              {deal.nextTask.status === 'Not Started' ? 'Not Started' : 
               deal.nextTask.status === 'In Progress' ? 'In Progress' : 
               deal.nextTask.status === 'Overdue' ? 'Overdue' : 
               deal.nextTask.status}
            </span>
          </div>

          {/* Footer: Assigned To | Est. Value */}
          <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 flex-shrink-0" style={{ color: '#9CA3AF' }} />
              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {deal.broker}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
              ${(deal.estValue / 1000).toFixed(0)}K
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Droppable Stage Column Component
interface StageColumnProps {
  stage: string;
  deals: Deal[];
  onDrop: (dealId: string, newStage: string) => void;
  onDealClick: (deal: Deal) => void;
  getTaskUrgencyBadge: (dueDate: string, status: string) => JSX.Element | null;
}

function StageColumn({ stage, deals, onDrop, onDealClick, getTaskUrgencyBadge }: StageColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'DEAL',
    drop: (item: { id: string; currentStage: string }) => {
      if (item.currentStage !== stage) {
        onDrop(item.id, stage);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [stage, onDrop]);

  const isActive = isOver && canDrop;

  return (
    <div className="flex-shrink-0" style={{ width: '300px' }}>
      {/* Column Header */}
      <div className="bg-white rounded-t-lg px-4 py-3 mb-3" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between">
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
            {stage}
          </div>
          <Badge 
            className="bg-gray-100 text-gray-700 border-0"
            style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px' }}
          >
            {deals?.length || 0}
          </Badge>
        </div>
      </div>

      {/* Cards Container */}
      <div 
        ref={drop}
        className="space-y-3 rounded-lg transition-all"
        style={{ 
          minHeight: '400px', 
          maxHeight: '700px', 
          overflowY: 'auto', 
          paddingRight: '4px',
          backgroundColor: isActive ? 'rgba(0, 91, 148, 0.05)' : 'transparent',
          border: isActive ? '2px dashed #005B94' : '2px dashed transparent',
          padding: isActive ? '8px' : '0',
        }}
      >
        {deals?.map(deal => (
          <DealCard 
            key={deal.id}
            deal={deal}
            onClick={() => onDealClick(deal)}
            getTaskUrgencyBadge={getTaskUrgencyBadge}
          />
        ))}
        {(!deals || deals.length === 0) && !isActive && (
          <div 
            className="flex items-center justify-center text-center p-8 rounded-lg border-2 border-dashed border-gray-200"
            style={{ minHeight: '200px' }}
          >
            <p style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
              No deals in this stage
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkflowOverview({ onAIAssistantOpen, isAIDrawerOpen, onNavigateToDeal }: WorkflowOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDeals, setFilterDeals] = useState<'my' | 'all'>('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [deals, setDeals] = useState<Deal[]>(sampleDeals);
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [newBroker, setNewBroker] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Get unique company names from deals
  const uniqueCompanies = Array.from(new Set(sampleDeals.map(deal => deal.clientName))).sort();

  // Calculate metrics
  const totalOpenDeals = deals.filter(d => d.status === 'Active').length;
  const overdueTasks = deals.filter(d => d.nextTask.status === 'Overdue').length;
  const dealsNeedingAction = deals.filter(d => {
    const dueDate = new Date(d.nextTask.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && d.status === 'Active';
  }).length;
  const totalPipelineValue = deals
    .filter(d => d.status === 'Active')
    .reduce((sum, d) => sum + d.estValue, 0);

  // Filter deals
  let filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.dealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBroker = filterDeals === 'my' ? deal.broker === 'Sarah Chen' : true;
    const matchesStage = filterStage === 'all' || deal.dealStage === filterStage;
    const matchesCompany = filterCompany === 'all' || deal.clientName === filterCompany;
    
    return matchesSearch && matchesBroker && matchesStage && matchesCompany;
  });

  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = filteredDeals.filter(d => d.dealStage === stage);
    return acc;
  }, {} as Record<string, Deal[]>);

  const getTaskUrgencyColor = (dueDate: string, status: string) => {
    if (status === 'Overdue') return '#DC2626';
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return '#FFA500';
    if (diffDays <= 3) return '#00B8C4';
    return '#374151';
  };

  const getTaskUrgencyBadge = (dueDate: string, status: string) => {
    if (status === 'Overdue') {
      return (
        <Badge className="bg-red-600 text-white border-0" style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px' }}>
          Overdue
        </Badge>
      );
    }
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return (
        <Badge className="bg-red-600 text-white border-0" style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px' }}>
          Overdue
        </Badge>
      );
    } else if (diffDays <= 1) {
      return (
        <Badge className="bg-orange-500 text-white border-0" style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px' }}>
          Due Today
        </Badge>
      );
    }
    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return (
          <Badge style={{ backgroundColor: '#005B94', color: 'white', fontSize: '11px', fontWeight: 500, padding: '2px 8px', border: 'none' }}>
            In Progress
          </Badge>
        );
      case 'Not Started':
        return (
          <Badge className="bg-orange-500 text-white border-0" style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px' }}>
            Not Started
          </Badge>
        );
      case 'Overdue':
        return (
          <Badge className="bg-red-600 text-white border-0" style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px' }}>
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 text-white border-0" style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px' }}>
            {status}
          </Badge>
        );
    }
  };

  const handleAdvanceStage = (deal: Deal) => {
    setShowAdvanceDialog(true);
  };

  const handleReassign = (deal: Deal) => {
    setNewBroker(deal.broker);
    setShowReassignDialog(true);
  };

  const handleViewFullDeal = (deal: Deal) => {
    console.log('View full deal:', deal.dealName);
    if (onNavigateToDeal) {
      onNavigateToDeal(deal.id);
    }
    // In real app, open deal details modal
  };

  const confirmAdvanceStage = () => {
    if (selectedDeal) {
      const updatedDeals = deals.map(deal => {
        if (deal.id === selectedDeal.id) {
          const currentStageIndex = stages.indexOf(deal.dealStage);
          const nextStageIndex = currentStageIndex + 1;
          if (nextStageIndex < stages.length) {
            return {
              ...deal,
              dealStage: stages[nextStageIndex],
            };
          }
        }
        return deal;
      });
      setDeals(updatedDeals);
    }
    setShowAdvanceDialog(false);
  };

  const confirmReassign = () => {
    if (selectedDeal) {
      const updatedDeals = deals.map(deal => {
        if (deal.id === selectedDeal.id) {
          return {
            ...deal,
            broker: newBroker,
          };
        }
        return deal;
      });
      setDeals(updatedDeals);
    }
    setShowReassignDialog(false);
    setNewBroker('');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#005B94' }} className="px-6 py-6">
          <div className="max-w-[1600px] mx-auto" style={{ paddingRight: '80px' }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                  TransactionFlow
                </h1>
                <p className="text-white/90" style={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>
                  Track all transactions across workflow stages.
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
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Requirement
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-white rounded-lg border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6 text-center">
                <div className="mb-2" style={{ fontSize: '48px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                  {totalOpenDeals}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                  Active Requirements
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-lg border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6 text-center">
                <div className="mb-2" style={{ fontSize: '48px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                  {overdueTasks}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                  Overdue Actions
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-lg border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6 text-center">
                <div className="mb-2" style={{ fontSize: '48px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                  {dealsNeedingAction}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                  Requirements Needing Attention
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-lg border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <CardContent className="p-6 text-center">
                <div className="mb-2" style={{ fontSize: '48px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                  ${(totalPipelineValue / 1000000).toFixed(2)}M
                </div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                  Active Deal Value
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white rounded-lg border-0 mb-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#9CA3AF' }} />
                  <Input
                    placeholder="Search deals by client, city, broker..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-gray-300 h-9"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1">
                  <Button
                    size="sm"
                    onClick={() => setFilterDeals('all')}
                    className={`h-7 px-3 ${
                      filterDeals === 'all' 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'bg-transparent text-gray-600 hover:bg-white/50 shadow-none'
                    }`}
                    style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    All Deals
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setFilterDeals('my')}
                    className={`h-7 px-3 ${
                      filterDeals === 'my' 
                        ? 'bg-white shadow-sm text-gray-900' 
                        : 'bg-transparent text-gray-600 hover:bg-white/50 shadow-none'
                    }`}
                    style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    My Deals
                  </Button>
                </div>

                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="w-40 border-gray-300 h-9" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {stages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="w-40 border-gray-300 h-9" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {uniqueCompanies.map(company => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Kanban Board */}
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {stages.map(stage => (
                <StageColumn 
                  key={stage} 
                  stage={stage} 
                  deals={dealsByStage[stage] || []}
                  onDrop={(dealId, newStage) => {
                    const updatedDeals = deals.map(deal => {
                      if (deal.id === dealId) {
                        return {
                          ...deal,
                          dealStage: newStage,
                        };
                      }
                      return deal;
                    });
                    setDeals(updatedDeals);
                  }}
                  onDealClick={setSelectedDeal}
                  getTaskUrgencyBadge={getTaskUrgencyBadge}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right-Side Drawer */}
        <Sheet open={!!selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)}>
          <SheetContent className="w-[480px] p-0 overflow-y-auto" style={{ maxWidth: '90vw' }}>
            {selectedDeal && (
              <>
                <SheetHeader className="px-6 py-5 border-b" style={{ borderColor: '#E5E7EB' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <SheetTitle style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                        {selectedDeal.dealName}
                      </SheetTitle>
                      <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        {selectedDeal.clientName}
                      </div>
                    </div>
                  </div>
                </SheetHeader>

                <div className="p-6 space-y-6">
                  {/* Deal Overview */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Deal Overview
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                        <div className="flex-1">
                          <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Location</div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{selectedDeal.city}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                        <div className="flex-1">
                          <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Workspace Type</div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{selectedDeal.workspaceType} • {selectedDeal.size} seats</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                        <div className="flex-1">
                          <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Current Stage</div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{selectedDeal.dealStage}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }} />
                        <div className="flex-1">
                          <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Estimated Value</div>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>${selectedDeal.estValue.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Step Summary */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4" style={{ color: '#F97316' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        Most Urgent Task
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '10px', lineHeight: '1.4' }}>
                      {selectedDeal.nextTask.name}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                        <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                          Due: {new Date(selectedDeal.nextTask.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {getStatusBadge(selectedDeal.nextTask.status)}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
                      <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                        Assigned to: {selectedDeal.nextTask.assignedTo}
                      </span>
                    </div>
                    <Button
                      className="w-full h-9"
                      style={{ 
                        backgroundColor: '#28A745', 
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Quick Actions
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-between border-gray-300 h-10 hover:bg-gray-50"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                        onClick={() => handleAdvanceStage(selectedDeal)}
                      >
                        <span>Advance to Next Stage</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-between border-gray-300 h-10 hover:bg-gray-50"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                        onClick={() => handleReassign(selectedDeal)}
                      >
                        <span>Reassign Broker</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-between border-gray-300 h-10 hover:bg-gray-50"
                        style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#005B94' }}
                        onClick={() => handleViewFullDeal(selectedDeal)}
                      >
                        <span>View Full Deal Details</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Advance Stage Confirmation Dialog */}
        <Dialog open={showAdvanceDialog} onOpenChange={setShowAdvanceDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Advance Stage</DialogTitle>
              <DialogDescription style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {selectedDeal ? `Move "${selectedDeal.dealName}" to the next stage in the workflow.` : 'Move the deal to the next stage in the workflow.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAdvanceDialog(false)}
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAdvanceStage}
                style={{ 
                  backgroundColor: '#28A745',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
                className="hover:bg-green-600"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reassign Broker Confirmation Dialog */}
        <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Reassign Broker</DialogTitle>
              <DialogDescription style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Select a broker to reassign this deal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newBroker" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>New Broker</Label>
                <Select value={newBroker} onValueChange={setNewBroker}>
                  <SelectTrigger className="border-gray-300 h-10" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="Select a broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                    <SelectItem value="Michael Torres">Michael Torres</SelectItem>
                    <SelectItem value="David Kim">David Kim</SelectItem>
                    <SelectItem value="Jessica Park">Jessica Park</SelectItem>
                    <SelectItem value="Ryan Martinez">Ryan Martinez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReassignDialog(false);
                  setNewBroker('');
                }}
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReassign}
                disabled={!newBroker}
                style={{ 
                  backgroundColor: '#005B94',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
                className="hover:bg-[#003F66]"
              >
                Reassign Deal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Deal Modal */}
        <CreateEditDealModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </DndProvider>
  );
}