import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertTriangle, User, CheckCircle, MoreHorizontal, Clock, Users, ListTodo } from 'lucide-react';
import { TaskActionDropdown } from './TaskActionDropdown';
import { AssignOwnerModal } from './AssignOwnerModal';

interface Task {
  id: string;
  type: 'Setup' | 'Operational';
  task: string;
  trigger: string;
  assignedTo?: {
    name: string;
    initials: string;
  };
  action: string;
  status: 'pending' | 'completed';
  dueDate?: string; // ISO date string e.g. '2026-09-30'
}

const mockTasks: Task[] = [
  {
    id: '1',
    type: 'Operational',
    task: 'Critical Lease Renewal - Tel Tech HQ',
    trigger: 'Campus lease expires Mar 31, 2025 - $23.4M annual impact',
    assignedTo: { name: 'Sarah Chen', initials: 'SC' },
    action: 'Negotiate',
    status: 'pending',
    dueDate: '2026-03-31',
  },
  {
    id: '2',
    type: 'Operational',
    task: 'Compliance Audit - Fire Safety',
    trigger: 'Due Sept 30 - 8 locations require certification',
    assignedTo: { name: 'Michael Torres', initials: 'MT' },
    action: 'Audit',
    status: 'pending',
    dueDate: '2026-09-30',
  },
  {
    id: '3',
    type: 'Operational',
    task: 'Cost Optimization Review',
    trigger: 'Market Rate Analysis - 12 locations above benchmark',
    action: 'Review',
    status: 'pending',
  },
  {
    id: '4',
    type: 'Operational',
    task: 'Process Overdue Payment - London',
    trigger: 'Finance Center payment £2.1M overdue by 15 days',
    assignedTo: { name: 'David Kim', initials: 'DK' },
    action: 'Pay',
    status: 'pending',
    dueDate: '2026-07-01',
  },
  {
    id: '5',
    type: 'Setup',
    task: 'Onboard New Regional Manager',
    trigger: 'APAC expansion - Singapore office opening Q2',
    assignedTo: { name: 'Emma Rodriguez', initials: 'ER' },
    action: 'Setup',
    status: 'pending',
    dueDate: '2026-08-15',
  },
  {
    id: '6',
    type: 'Operational',
    task: 'Space Utilization Assessment',
    trigger: 'Hybrid work policy - 15% underutilization detected',
    action: 'Assess',
    status: 'pending',
  },
  {
    id: '7',
    type: 'Operational',
    task: 'Contract Renegotiation - Atlanta Hub',
    trigger: 'Tel Tech Regional Hub lease 12% above market rate',
    assignedTo: { name: 'Jennifer Walsh', initials: 'JW' },
    action: 'Negotiate',
    status: 'pending',
    dueDate: '2026-07-20',
  },
  {
    id: '8',
    type: 'Setup',
    task: 'Configure ESG Reporting',
    trigger: 'Sustainability metrics required for Q4 board report',
    action: 'Configure',
    status: 'pending',
    dueDate: '2026-12-31',
  },
  {
    id: '9',
    type: 'Operational',
    task: 'Insurance Policy Renewal',
    trigger: 'Global property insurance expires Dec 31',
    assignedTo: { name: 'Roberto Martinez', initials: 'RM' },
    action: 'Renew',
    status: 'pending',
    dueDate: '2026-12-31',
  },
  {
    id: '10',
    type: 'Setup',
    task: 'Integration - HR Systems',
    trigger: 'Occupancy tracking integration with Workday',
    assignedTo: { name: 'Lisa Wong', initials: 'LW' },
    action: 'Integrate',
    status: 'completed',
  },
  {
    id: '11',
    type: 'Setup',
    task: 'Configure Automated Alerts',
    trigger: 'Lease expiration notifications 90/60/30 days',
    assignedTo: { name: 'Marcus Johnson', initials: 'MJ' },
    action: 'Configure',
    status: 'completed',
  },
];

// ── Due date helpers ──────────────────────────────────────────────────────────

type Urgency = 'overdue' | 'soon' | 'upcoming' | 'none';

function getDueDateUrgency(dueDate?: string): Urgency {
  if (!dueDate) return 'none';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 7) return 'soon';
  return 'upcoming';
}

function formatDueDate(dueDate?: string): string {
  if (!dueDate) return '—';
  const d = new Date(dueDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const URGENCY_STYLE: Record<Urgency, React.CSSProperties> = {
  overdue:  { backgroundColor: '#FEE2E2', color: '#991B1B' },
  soon:     { backgroundColor: '#FEF3C7', color: '#92400E' },
  upcoming: { backgroundColor: '#EFF6FF', color: '#1D4ED8' },
  none:     {},
};

interface TasksProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function Tasks({
  onAIAssistantOpen = () => {},
  isAIDrawerOpen = false
}: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState<'pending' | 'completed'>('pending');

  // Calculate metrics
  const setupTasks = tasks.filter(task => task.type === 'Setup');
  const completedSetupTasks = setupTasks.filter(task => task.status === 'completed');
  const setupProgress = (completedSetupTasks.length / setupTasks.length) * 100;
  
  const activeTasks = tasks.filter(task => task.status === 'pending');
  const unassignedTasks = activeTasks.filter(task => !task.assignedTo);
  const myTasks = activeTasks.filter(task => task.assignedTo?.name === 'John Smith'); // Mock current user

  const getTypeBadgeStyle = (type: string) => {
    if (type === 'Setup') {
      return 'bg-gray-500 text-white';
    }
    return 'bg-primary text-primary-foreground';
  };

  // Task action handlers
  const handleMarkComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  const handleReassignTask = (taskId: string) => {
    // In a real app, this would open a user picker modal
    console.log('Reassigning task:', taskId);
    // For demo purposes, just log the action
  };

  const handleDismissTask = (taskId: string) => {
    // Non-destructive dismissal - could add a 'dismissed' status
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleGoToLicense = (taskId: string) => {
    // In a real app, this would navigate to the license details
    console.log('Navigating to license for task:', taskId);
    // For demo purposes, just log the action
  };

  const handleAssignClick = (taskId: string) => {
    setSelectedTaskForAssignment(taskId);
    setShowAssignModal(true);
  };

  const handleAssignOwner = (email: string) => {
    if (selectedTaskForAssignment) {
      // Create a simple user object from email
      const newAssignee = {
        name: email.split('@')[0] || email, // Use email prefix as name
        initials: (email.split('@')[0] || email).substring(0, 2).toUpperCase()
      };

      setTasks(prev => prev.map(task => 
        task.id === selectedTaskForAssignment 
          ? { ...task, assignedTo: newAssignee }
          : task
      ));
      
      console.log('Assigned task', selectedTaskForAssignment, 'to', email);
    }
    setSelectedTaskForAssignment(null);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedTaskForAssignment(null);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setEditDueDate(task.dueDate ?? '');
      setEditStatus(task.status);
    }
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    setTasks(prev => prev.map(t =>
      t.id === editingTask.id
        ? { ...t, dueDate: editDueDate || undefined, status: editStatus }
        : t
    ));
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <PageHeader
        icon={<ListTodo className="h-6 w-6" />}
        title="Tasks"
        subtitle="Review upcoming expirations, overdue payments, and setup tasks that require your attention."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
      />

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Card 
          className="bg-white border-0 shadow-card"
          style={{ borderRadius: '12px' }}
        >
          <CardContent className="p-6">
            {/* Redesigned Summary Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Setup Progress - Spans 2 Columns */}
                <div className="md:col-span-2">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 
                          style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#374151' }}
                        >
                          Setup Progress
                        </h3>
                        <p 
                          className="text-muted-foreground"
                          style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: '#6B7280' }}
                        >
                          {completedSetupTasks.length} of {setupTasks.length} tasks completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-3xl font-bold text-blue-600"
                          style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}
                        >
                          {Math.round(setupProgress)}%
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={setupProgress} 
                      className="h-3"
                      style={{ backgroundColor: '#E5E7EB' }}
                    />
                    <p 
                      className="text-sm text-muted-foreground mt-3"
                      style={{ fontSize: '12px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: '#6B7280' }}
                    >
                      Complete setup tasks to unlock full platform functionality
                    </p>
                  </div>
                </div>

                {/* Active Tasks */}
                <div>
                  <div className="bg-white rounded-lg p-6 border border-gray-200 h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                      <p 
                        style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: '#6B7280' }}
                      >
                        Active Tasks
                      </p>
                      <p 
                        style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#374151', lineHeight: '1' }}
                        className="mt-2"
                      >
                        {activeTasks.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unassigned Tasks */}
                <div>
                  <div className="bg-white rounded-lg p-6 border border-gray-200 h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <p 
                        style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: '#6B7280' }}
                      >
                        Unassigned
                      </p>
                      <p 
                        style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#374151', lineHeight: '1' }}
                        className="mt-2"
                      >
                        {unassignedTasks.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Inbox - Separate Row */}
              <div className="mt-6">
                <div 
                  className="rounded-lg p-6"
                  style={{ backgroundColor: '#005B94' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 
                          style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#FFFFFF' }}
                        >
                          My Inbox ({myTasks.length})
                        </h3>
                        <p 
                          style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: 'rgba(255, 255, 255, 0.9)' }}
                        >
                          Tasks assigned to you
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div 
                          className="text-3xl font-bold"
                          style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#FFFFFF' }}
                        >
                          {myTasks.length}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                      >
                        View All Tasks
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Table */}
            <div>
              <Table>
                <TableHeader>
                  <TableRow 
                    className="border-b"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Type
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Task
                    </TableHead>
                    <TableHead
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Trigger
                    </TableHead>
                    <TableHead
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                    >
                      Due Date
                    </TableHead>
                    <TableHead
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Assigned To
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.filter(task => task.status === 'pending').map((task) => (
                    <TableRow 
                      key={task.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      <TableCell 
                        className="py-4 px-4"
                      >
                        <Badge 
                          className={`text-xs font-medium px-3 py-1 rounded-full ${getTypeBadgeStyle(task.type)}`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {task.type}
                        </Badge>
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {task.task}
                      </TableCell>
                      <TableCell
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        <div
                          title={task.trigger}
                          style={{ width: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {task.trigger}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        {task.dueDate ? (() => {
                          const urgency = getDueDateUrgency(task.dueDate);
                          return (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '3px 10px',
                                borderRadius: 99,
                                fontSize: 13,
                                fontWeight: 500,
                                fontFamily: 'Inter, sans-serif',
                                whiteSpace: 'nowrap',
                                ...URGENCY_STYLE[urgency],
                              }}
                            >
                              {urgency === 'overdue' && <AlertTriangle style={{ width: 12, height: 12, flexShrink: 0 }} />}
                              {formatDueDate(task.dueDate)}
                            </span>
                          );
                        })() : (
                          <span style={{ color: '#9CA3AF', fontSize: 14 }}>—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        {task.assignedTo ? (
                          <span 
                            style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                          >
                            {task.assignedTo.name}
                          </span>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAssignClick(task.id)}
                            className="text-gray-500 border-gray-300 hover:bg-gray-50"
                            style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                          >
                            + Assign
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <TaskActionDropdown
                          taskId={task.id}
                          onMarkComplete={handleMarkComplete}
                          onReassignTask={handleReassignTask}
                          onDismissTask={handleDismissTask}
                          onGoToLicense={handleGoToLicense}
                          onEditTask={handleEditTask}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Empty State for No Tasks */}
            {activeTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎉</div>
                <h3 
                  className="mb-2"
                  style={{ fontSize: '22px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#374151' }}
                >
                  You're all caught up!
                </h3>
                <p 
                  style={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: '#6B7280' }}
                >
                  No pending tasks at this time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={open => { if (!open) setEditingTask(null); }}>
        <DialogContent className="max-w-sm p-0 overflow-hidden" style={{ borderRadius: '12px' }}>
          {/* Blue header */}
          <div style={{ backgroundColor: '#005B94', padding: '16px 20px' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: '18px', fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                Edit Task
              </DialogTitle>
              <DialogDescription style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}>
                {editingTask?.task}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Body */}
          <div style={{ padding: '20px' }} className="space-y-4">

            {/* Status row */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Status</span>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as 'pending' | 'completed')}
                style={{
                  fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif',
                  padding: '3px 24px 3px 10px', borderRadius: '20px',
                  border: '1px solid transparent', cursor: 'pointer',
                  backgroundColor: editStatus === 'completed' ? '#DCFCE7' : '#FEF3C7',
                  color: editStatus === 'completed' ? '#166534' : '#92400E',
                  appearance: 'auto',
                }}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Due Date row */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Due Date</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {editDueDate && getDueDateUrgency(editDueDate) === 'overdue' && (
                  <AlertTriangle style={{ width: 14, height: 14, color: '#EF4444', flexShrink: 0 }} />
                )}
                <input
                  type="date"
                  value={editDueDate}
                  onChange={e => setEditDueDate(e.target.value)}
                  style={{
                    fontSize: '14px', fontFamily: 'Inter, sans-serif',
                    color: editDueDate && getDueDateUrgency(editDueDate) === 'overdue' ? '#EF4444' : '#374151',
                    border: '1px solid #D1D5DB', borderRadius: '6px',
                    padding: '3px 6px', outline: 'none', cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            {/* Assigned To row */}
            {editingTask?.assignedTo && (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Assigned To</span>
                <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{editingTask.assignedTo.name}</span>
              </div>
            )}

            {/* Action chip */}
            {editingTask?.action && (
              <div style={{ backgroundColor: '#EFF6FF', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1D4ED8', fontFamily: 'Inter, sans-serif' }}>
                  {editingTask.action}
                </span>
              </div>
            )}

            {/* Type */}
            {editingTask?.type && (
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Type</p>
                <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{editingTask.type}</p>
              </div>
            )}

            {/* Trigger */}
            {editingTask?.trigger && (
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '2px' }}>Trigger</p>
                <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{editingTask.trigger}</p>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveEdit}
                className="flex-1"
                style={{ padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#005B94', color: '#fff', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="flex-1"
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Owner Modal */}
      <AssignOwnerModal
        isOpen={showAssignModal}
        onClose={handleCloseAssignModal}
        onAssign={handleAssignOwner}
        taskName={
          selectedTaskForAssignment 
            ? tasks.find(t => t.id === selectedTaskForAssignment)?.task
            : undefined
        }
      />
    </div>
  );
}