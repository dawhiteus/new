import React, { useState } from 'react';
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
} from 'lucide-react';
import { MessagingThread } from './MessagingThread';
import { DealTeamSection } from './DealTeamSection';
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

const timelineEvents = [
  { date: '2025-11-10', event: 'Deal moved to Negotiation', user: 'Sarah Chen' },
  { date: '2025-11-08', event: 'Proposal sent to client', user: 'Sarah Chen' },
  { date: '2025-11-05', event: 'Site visit completed', user: 'Sarah Chen' },
  { date: '2025-11-01', event: 'Initial meeting with client', user: 'Sarah Chen' },
  { date: '2025-10-28', event: 'Deal created', user: 'Sarah Chen' },
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

export function DealDetailsModal({ deal, isOpen, onClose }: DealDetailsModalProps) {
  const [newNote, setNewNote] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ category: '', description: '' });
  const [activeTab, setActiveTab] = useState('summary');
  const [expandedStages, setExpandedStages] = useState<string[]>(['lease-negotiation']); // Start with current stage expanded
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'tasks' | 'stages'>('all');
  
  // Task management state
  const [stageTasks, setStageTasks] = useState<Record<string, Task[]>>(stageTasksData);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [newTaskData, setNewTaskData] = useState({
    name: '',
    dueDate: '',
    assignedTo: 'Sarah Chen',
    dependency: '',
    agentInstruction: '',
    expectedOutput: 'Brief / Summary',
    agentTaskType: 'Assess Collection'
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
  
  // Add task handler
  const handleAddTask = () => {
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
      agentTaskType: 'Assess Collection'
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

  // Toggle task completion
  const handleToggleTaskComplete = (stage: string, taskId: string) => {
    const currentTask = stageTasks[stage]?.find(t => t.id === taskId);
    const wasCompleted = currentTask?.status === 'Completed';
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
      toast.success('Task marked complete.');
    }
  };
  
  // Agent insights state - track dismissals
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  
  // Editable form state
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
    primaryContactName: 'James Lee',
    primaryContactEmail: 'jlee@teltech.com',
    dealId: '#TL-NYC-98321',
  });

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
            <TabsList className="grid grid-cols-4 gap-2 bg-white border rounded-lg p-1 h-11" style={{ borderColor: '#E5E7EB' }}>
              <TabsTrigger
                value="summary"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="workflow"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Workflow
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Team
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-md h-9 transition-all"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Documents
              </TabsTrigger>
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
                        Client / Company
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
                          <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                          <SelectItem value="Dedicated Desk">Dedicated Desk</SelectItem>
                          <SelectItem value="Private Office">Private Office</SelectItem>
                          <SelectItem value="Team Suite">Team Suite</SelectItem>
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
                        Size (sq ft)
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
                        Requirement Stage
                      </Label>
                      <Select
                        value={editedDeal.dealStage}
                        onValueChange={(value) => setEditedDeal({ ...editedDeal, dealStage: value })}
                      >
                        <SelectTrigger className="border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Intake">Intake</SelectItem>
                          <SelectItem value="Evaluation">Evaluation</SelectItem>
                          <SelectItem value="Proposal">Proposal</SelectItem>
                          <SelectItem value="Negotiation">Negotiation</SelectItem>
                          <SelectItem value="Contracting">Contracting</SelectItem>
                          <SelectItem value="Execution">Execution</SelectItem>
                        </SelectContent>
                      </Select>
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
                        Broker
                      </Label>
                      <Select
                        value={editedDeal.broker}
                        onValueChange={(value) => setEditedDeal({ ...editedDeal, broker: value })}
                      >
                        <SelectTrigger className="border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                          <SelectItem value="Michael Torres">Michael Torres</SelectItem>
                          <SelectItem value="Jessica Williams">Jessica Williams</SelectItem>
                          <SelectItem value="David Kim">David Kim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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

                    {/* Row 5 */}
                    <div>
                      <Label style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '6px', display: 'block' }}>
                        Primary Contact Name
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
                        Primary Contact Email
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
                      onClick={() => toast.success('Changes saved.')}
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
                          const currentStageIndex = (() => {
                            if (deal.dealStage === 'Intake'       || deal.dealStage === 'Requirement' || deal.dealStage === 'Requirement Identified') return 0;
                            if (deal.dealStage === 'Evaluation'   || deal.dealStage === 'Evaluate'    || deal.dealStage === 'Site Tours Scheduled')    return 1;
                            if (deal.dealStage === 'Proposal'     || deal.dealStage === 'Terms'       || deal.dealStage === 'Proposal Sent')            return 2;
                            if (deal.dealStage === 'Negotiation'  || deal.dealStage === 'Lease Negotiation')                                           return 3;
                            if (deal.dealStage === 'Contracting'  || deal.dealStage === 'Lease Finalization')                                          return 4;
                            if (deal.dealStage === 'Execution'    || deal.dealStage === 'Executed'    || deal.dealStage === 'Lease Executed')           return 5;
                            return 3; // default to Negotiation
                          })();
                          
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
                              title={getTooltipText()}
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
                  const currentStageIndex = (() => {
                    if (deal.dealStage === 'Intake'      || deal.dealStage === 'Requirement' || deal.dealStage === 'Requirement Identified') return 0;
                    if (deal.dealStage === 'Evaluation'  || deal.dealStage === 'Evaluate'    || deal.dealStage === 'Site Tours Scheduled')    return 1;
                    if (deal.dealStage === 'Proposal'    || deal.dealStage === 'Terms'       || deal.dealStage === 'Proposal Sent')            return 2;
                    if (deal.dealStage === 'Negotiation' || deal.dealStage === 'Lease Negotiation')                                           return 3;
                    if (deal.dealStage === 'Contracting' || deal.dealStage === 'Lease Finalization')                                          return 4;
                    if (deal.dealStage === 'Execution'   || deal.dealStage === 'Executed'    || deal.dealStage === 'Lease Executed')           return 5;
                    return 3;
                  })();
                  
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
                              <div className="flex-1 min-w-0">
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
                            
                            {/* Task Output - For agent tasks with output */}
                            {task.taskType === 'agent' && task.agentOutput && (
                              <div className="ml-9 mt-3 p-4 rounded-lg border" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                                <div className="flex items-start gap-2">
                                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {task.expectedOutput && (
                                        <Badge className="bg-gray-100 text-gray-600 border-0" style={{ fontSize: '9px', fontWeight: 500, padding: '2px 8px' }}>
                                          {task.expectedOutput}
                                        </Badge>
                                      )}
                                      {task.executionTimestamp && (
                                        <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                                          {task.executionTimestamp}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1.6', marginBottom: '8px' }}>
                                      {task.agentOutput}
                                    </div>

                                    {/* Collection link */}
                                    {task.collectionUrl && (
                                      <a
                                        href={task.collectionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:underline"
                                        style={{ fontSize: '12px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                                      >
                                        <Eye className="h-3 w-3" />
                                        View Collection
                                      </a>
                                    )}

                                    {/* View Full Output link for non-collection tasks */}
                                    {!task.collectionUrl && (task.agentState === 'completed' || task.agentState === 'needs_review') && (
                                      <a
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        className="flex items-center gap-1 hover:underline"
                                        style={{ fontSize: '12px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                                      >
                                        <Eye className="h-3 w-3" />
                                        View Full Output
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
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
              <DealTeamSection dealId={deal.id} />
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="p-6 mt-0">
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

            {/* Messaging Tab */}
            <TabsContent value="messaging" className="mt-0 h-full">
              <MessagingThread dealId={deal.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>

    {/* Add Task Modal */}
    <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
            Add Task to {selectedStage}
          </DialogTitle>
          <DialogDescription style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Assign work to team members or delegate to an agent for automated execution
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
              onValueChange={(value) => setNewTaskData({ ...newTaskData, assignedTo: value })}
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
                <SelectItem value="Agent">
                  <div className="flex items-center gap-2">
                    <Bot className="h-3.5 w-3.5" />
                    <span>Assign to Agent</span>
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

          {newTaskData.assignedTo === 'Agent' && (
            <>
              {/* Task Type */}
              <div>
                <Label htmlFor="task-type" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Task Type
                </Label>
                <Select 
                  value={newTaskData.agentTaskType} 
                  onValueChange={(value) => setNewTaskData({ ...newTaskData, agentTaskType: value })}
                >
                  <SelectTrigger className="mt-1" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Create Collection">Create Collection</SelectItem>
                    <SelectItem value="Assess Collection">Assess Collection</SelectItem>
                    <SelectItem value="Structured evaluation + decisioning">Structured evaluation + decisioning</SelectItem>
                    <SelectItem value="Define Shortlist">Define Shortlist</SelectItem>
                    <SelectItem value="Schedule tour(s)">Schedule tour(s)</SelectItem>
                    <SelectItem value="Request/review proposal">Request/review proposal</SelectItem>
                    <SelectItem value="Negotiate terms">Negotiate terms</SelectItem>
                    <SelectItem value="Coordinate legal review">Coordinate legal review</SelectItem>
                    <SelectItem value="Contract renegotiation">Contract renegotiation</SelectItem>
                    <SelectItem value="Coordinate execution and signatures">Coordinate execution and signatures</SelectItem>
                    <SelectItem value="Closeout readiness (bridge into License Admin)">Closeout readiness (bridge into License Admin)</SelectItem>
                    <SelectItem value="Exit / replacement execution">Exit / replacement execution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Agent Instruction */}
              <div>
                <Label htmlFor="agent-instruction" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Agent Instruction <span style={{ color: '#DC2626' }}>*</span>
                </Label>
                <Textarea
                  id="agent-instruction"
                  value={newTaskData.agentInstruction}
                  onChange={(e) => setNewTaskData({ ...newTaskData, agentInstruction: e.target.value })}
                  placeholder="Example: Analyze Midtown Manhattan flex office pricing for 5,000 sq ft and identify negotiation leverage points based on current market conditions."
                  className="mt-1 min-h-[80px]"
                  style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                />
                <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
                  Clearly describe the work you're delegating to the agent. Be specific about context and desired outcome.
                </div>
              </div>

              {/* Expected Output */}
              <div>
                <Label htmlFor="expected-output" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Expected Output
                </Label>
                <Select 
                  value={newTaskData.expectedOutput} 
                  onValueChange={(value) => setNewTaskData({ ...newTaskData, expectedOutput: value })}
                >
                  <SelectTrigger className="mt-1" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brief / Summary">Brief / Summary</SelectItem>
                    <SelectItem value="Comparison Table">Comparison Table</SelectItem>
                    <SelectItem value="Shortlist">Shortlist</SelectItem>
                    <SelectItem value="Recommendation">Recommendation</SelectItem>
                    <SelectItem value="Risk Flags">Risk Flags</SelectItem>
                    <SelectItem value="Draft Document">Draft Document</SelectItem>
                  </SelectContent>
                </Select>
                <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
                  Select the format you'd like the agent to deliver the work in.
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#005B94' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                      Agent Will Execute This Work
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                      The agent will complete this task automatically. You'll review and approve the output before advancing the deal stage.
                    </div>
                  </div>
                </div>
              </div>
            </>
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
              disabled={!newTaskData.name || !newTaskData.dueDate || (newTaskData.assignedTo === 'Agent' && !newTaskData.agentInstruction)}
            >
              Add Task
            </Button>
            <Button
              onClick={() => setShowAddTaskModal(false)}
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