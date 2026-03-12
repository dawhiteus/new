import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
  Plus, 
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bot,
  ExternalLink,
  UserPlus,
  Check,
} from 'lucide-react';

interface Task {
  id: string;
  taskName: string;
  dueDate: string;
  status: string;
  assignedTo: string;
  dealName: string;
  dealStage: string;
  workspaceType: string;
  priority: string;
}

interface BrokerTasksProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

const sampleTasks: Task[] = [
  {
    id: '1',
    taskName: 'Send proposal document',
    dueDate: '2025-11-15',
    status: 'In Progress',
    assignedTo: 'Sarah Chen',
    dealName: 'Tel Tech NYC Expansion',
    dealStage: 'Lease Negotiation',
    workspaceType: 'Private Office',
    priority: 'High',
  },
  {
    id: '2',
    taskName: 'Schedule site visit',
    dueDate: '2025-11-18',
    status: 'Not Started',
    assignedTo: 'Sarah Chen',
    dealName: 'Tech Ventures SF Office',
    dealStage: 'Site Tours Scheduled',
    workspaceType: 'Team Suite',
    priority: 'Medium',
  },
  {
    id: '3',
    taskName: 'Follow up with client',
    dueDate: '2025-11-20',
    status: 'Not Started',
    assignedTo: 'Sarah Chen',
    dealName: 'Global Finance Boston Hub',
    dealStage: 'Lease Executed',
    workspaceType: 'Dedicated Desk',
    priority: 'Medium',
  },
  {
    id: '4',
    taskName: 'Prepare lease agreement',
    dueDate: '2025-11-12',
    status: 'Overdue',
    assignedTo: 'Sarah Chen',
    dealName: 'StartupX Austin Space',
    dealStage: 'Lease Finalization',
    workspaceType: 'Hot Desk',
    priority: 'High',
  },
  {
    id: '5',
    taskName: 'Review floor plans',
    dueDate: '2025-11-22',
    status: 'Not Started',
    assignedTo: 'Sarah Chen',
    dealName: 'MediaCo Chicago Office',
    dealStage: 'Prospecting',
    workspaceType: 'Private Office',
    priority: 'Low',
  },
  {
    id: '6',
    taskName: 'Send pricing update',
    dueDate: '2025-11-14',
    status: 'Completed',
    assignedTo: 'Sarah Chen',
    dealName: 'Tech Ventures SF Office',
    dealStage: 'Negotiation',
    workspaceType: 'Team Suite',
    priority: 'Medium',
  },
  {
    id: '7',
    taskName: 'Finalize contract terms',
    dueDate: '2025-11-13',
    status: 'In Progress',
    assignedTo: 'Sarah Chen',
    dealName: 'Tel Tech NYC Expansion',
    dealStage: 'Negotiation',
    workspaceType: 'Private Office',
    priority: 'High',
  },
  {
    id: '8',
    taskName: 'Coordinate move-in date',
    dueDate: '2025-11-25',
    status: 'Not Started',
    assignedTo: 'Sarah Chen',
    dealName: 'Global Finance Boston Hub',
    dealStage: 'Closed Won',
    workspaceType: 'Dedicated Desk',
    priority: 'Medium',
  },
];

export function BrokerTasks({ onAIAssistantOpen, isAIDrawerOpen }: BrokerTasksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterWorkspaceType, setFilterWorkspaceType] = useState('all');
  const [filterDeal, setFilterDeal] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Get current date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Helper function to check if date is today
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };
  
  // Helper function to check if date is upcoming (within next 7 days)
  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  };

  // Calculate stats for current user (Sarah Chen)
  const userTasks = sampleTasks.filter(t => t.assignedTo === 'Sarah Chen');
  const overdueCount = userTasks.filter(t => t.status === 'Overdue').length;
  const dueTodayCount = userTasks.filter(t => isToday(t.dueDate) && t.status !== 'Completed' && t.status !== 'Overdue').length;
  const upcomingCount = userTasks.filter(t => isUpcoming(t.dueDate) && t.status !== 'Completed' && t.status !== 'Overdue').length;
  const totalOpenCount = userTasks.filter(t => t.status !== 'Completed').length;

  // Filter and sort tasks
  let filteredTasks = userTasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.dealName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesStage = filterStage === 'all' || task.dealStage === filterStage;
    const matchesWorkspaceType = filterWorkspaceType === 'all' || task.workspaceType === filterWorkspaceType;
    const matchesDeal = filterDeal === 'all' || task.dealName === filterDeal;
    
    return matchesSearch && matchesStatus && matchesStage && matchesWorkspaceType && matchesDeal;
  });

  // Sort tasks
  filteredTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'stage') {
      return a.dealStage.localeCompare(b.dealStage);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Get unique deal names for filter
  const uniqueDeals = Array.from(new Set(userTasks.map(t => t.dealName))).sort();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-600 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Completed</Badge>;
      case 'In Progress':
        return <Badge style={{ backgroundColor: '#005B94', color: 'white', fontSize: '12px', fontWeight: 500 }} className="px-3 py-1 rounded-full">In Progress</Badge>;
      case 'Not Started':
        return <Badge className="bg-orange-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Not Started</Badge>;
      case 'Overdue':
        return <Badge className="bg-red-600 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>Overdue</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>{status}</Badge>;
    }
  };

  const getDueDateColor = (dueDate: string, status: string) => {
    if (status === 'Completed') return '#6B7280';
    if (status === 'Overdue') return '#DC2626';
    if (isToday(dueDate)) return '#FFA500';
    if (isUpcoming(dueDate)) return '#005B94';
    return '#374151';
  };

  const handleMarkComplete = (taskId: string) => {
    console.log('Mark complete:', taskId);
    // In real app, update task status
  };

  const handleReassign = (taskId: string) => {
    console.log('Reassign:', taskId);
    // In real app, open reassignment dialog
  };

  const handleOpenDeal = (dealName: string) => {
    console.log('Open deal:', dealName);
    // In real app, navigate to deal details
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#005B94' }} className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                My Tasks
              </h1>
              <p className="text-white/90" style={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>
                Everything you're responsible for, across all deals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
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
                New Task
              </Button>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
            <div className="flex items-center justify-start gap-8" style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: 'white' }}>
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ fontSize: '20px', color: '#DC2626' }}>{overdueCount}</span>
                <span>Overdue</span>
              </div>
              <span className="text-white/40">•</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ fontSize: '20px', color: '#FFA500' }}>{dueTodayCount}</span>
                <span>Due Today</span>
              </div>
              <span className="text-white/40">•</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ fontSize: '20px', color: '#00B8C4' }}>{upcomingCount}</span>
                <span>Upcoming</span>
              </div>
              <span className="text-white/40">•</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ fontSize: '20px' }}>{totalOpenCount}</span>
                <span>Total Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters and Search */}
        <Card className="bg-white rounded-xl border-0 mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Search and Sort */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks or deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueDate">Sort by: Due Date</SelectItem>
                    <SelectItem value="stage">Sort by: Stage</SelectItem>
                    <SelectItem value="status">Sort by: Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filters Row */}
              <div className="flex items-center gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-44 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="w-44 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Requirement Identified">Requirement Identified</SelectItem>
                    <SelectItem value="Site Tours Scheduled">Site Tours Scheduled</SelectItem>
                    <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                    <SelectItem value="Lease Negotiation">Lease Negotiation</SelectItem>
                    <SelectItem value="Lease Finalization">Lease Finalization</SelectItem>
                    <SelectItem value="Lease Executed">Lease Executed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterWorkspaceType} onValueChange={setFilterWorkspaceType}>
                  <SelectTrigger className="w-44 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="Workspace Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                    <SelectItem value="Dedicated Desk">Dedicated Desk</SelectItem>
                    <SelectItem value="Private Office">Private Office</SelectItem>
                    <SelectItem value="Team Suite">Team Suite</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterDeal} onValueChange={setFilterDeal}>
                  <SelectTrigger className="w-56 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <SelectValue placeholder="Deal Name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Deals</SelectItem>
                    {uniqueDeals.map(deal => (
                      <SelectItem key={deal} value={deal}>{deal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table or Empty State */}
        {filteredTasks.length === 0 ? (
          <Card className="bg-white rounded-xl border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4" style={{ color: '#28A745' }} />
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>
                No tasks assigned to you
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Looks like you're all caught up!
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white rounded-xl border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}>
                    <TableHead className="uppercase tracking-wide py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Task Name
                    </TableHead>
                    <TableHead className="uppercase tracking-wide py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Deal Name
                    </TableHead>
                    <TableHead className="uppercase tracking-wide py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Stage
                    </TableHead>
                    <TableHead className="uppercase tracking-wide py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Due Date
                    </TableHead>
                    <TableHead className="uppercase tracking-wide py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Status
                    </TableHead>
                    <TableHead className="uppercase tracking-wide py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow 
                      key={task.id} 
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      <TableCell className="py-4 px-6">
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                          {task.taskName}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <button
                          onClick={() => handleOpenDeal(task.dealName)}
                          className="cursor-pointer hover:underline flex items-center gap-1" 
                          style={{ fontSize: '14px', color: '#005B94', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                        >
                          {task.dealName}
                        </button>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge 
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                          style={{ fontSize: '12px', fontWeight: 500 }}
                        >
                          {task.dealStage}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {task.status === 'Overdue' && <AlertCircle className="h-4 w-4" style={{ color: '#DC2626' }} />}
                          {isToday(task.dueDate) && task.status !== 'Overdue' && task.status !== 'Completed' && <Clock className="h-4 w-4" style={{ color: '#FFA500' }} />}
                          <span 
                            style={{ 
                              fontSize: '14px', 
                              fontWeight: task.status === 'Overdue' || isToday(task.dueDate) ? 600 : 400,
                              color: getDueDateColor(task.dueDate, task.status),
                              fontFamily: 'Inter, sans-serif' 
                            }}
                          >
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {getStatusBadge(task.status)}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {task.status !== 'Completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 hover:bg-green-50 hover:border-green-600 hover:text-green-700"
                              onClick={() => handleMarkComplete(task.id)}
                              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-gray-100"
                            onClick={() => handleReassign(task.id)}
                            style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Reassign
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="hover:bg-gray-100"
                            onClick={() => handleOpenDeal(task.dealName)}
                            style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}