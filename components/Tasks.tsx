import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Bell, AlertTriangle, User, CheckCircle, MoreHorizontal, Clock, Users, ListTodo } from 'lucide-react';
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
}

const mockTasks: Task[] = [
  {
    id: '1',
    type: 'Operational',
    task: 'Critical Lease Renewal - Tel Tech HQ',
    trigger: 'Campus lease expires Mar 31, 2025 - $23.4M annual impact',
    assignedTo: { name: 'Sarah Chen', initials: 'SC' },
    action: 'Negotiate',
    status: 'pending'
  },
  {
    id: '2',
    type: 'Operational',
    task: 'Compliance Audit - Fire Safety',
    trigger: 'Due Sept 30 - 8 locations require certification',
    assignedTo: { name: 'Michael Torres', initials: 'MT' },
    action: 'Audit',
    status: 'pending'
  },
  {
    id: '3',
    type: 'Operational',
    task: 'Cost Optimization Review',
    trigger: 'Market Rate Analysis - 12 locations above benchmark',
    action: 'Review',
    status: 'pending'
  },
  {
    id: '4',
    type: 'Operational',
    task: 'Process Overdue Payment - London',
    trigger: 'Finance Center payment £2.1M overdue by 15 days',
    assignedTo: { name: 'David Kim', initials: 'DK' },
    action: 'Pay',
    status: 'pending'
  },
  {
    id: '5',
    type: 'Setup',
    task: 'Onboard New Regional Manager',
    trigger: 'APAC expansion - Singapore office opening Q2',
    assignedTo: { name: 'Emma Rodriguez', initials: 'ER' },
    action: 'Setup',
    status: 'pending'
  },
  {
    id: '6',
    type: 'Operational',
    task: 'Space Utilization Assessment',
    trigger: 'Hybrid work policy - 15% underutilization detected',
    action: 'Assess',
    status: 'pending'
  },
  {
    id: '7',
    type: 'Operational',
    task: 'Contract Renegotiation - Atlanta Hub',
    trigger: 'Tel Tech Regional Hub lease 12% above market rate',
    assignedTo: { name: 'Jennifer Walsh', initials: 'JW' },
    action: 'Negotiate',
    status: 'pending'
  },
  {
    id: '8',
    type: 'Setup',
    task: 'Configure ESG Reporting',
    trigger: 'Sustainability metrics required for Q4 board report',
    action: 'Configure',
    status: 'pending'
  },
  {
    id: '9',
    type: 'Operational',
    task: 'Insurance Policy Renewal',
    trigger: 'Global property insurance expires Dec 31',
    assignedTo: { name: 'Roberto Martinez', initials: 'RM' },
    action: 'Renew',
    status: 'pending'
  },
  {
    id: '10',
    type: 'Setup',
    task: 'Integration - HR Systems',
    trigger: 'Occupancy tracking integration with Workday',
    assignedTo: { name: 'Lisa Wong', initials: 'LW' },
    action: 'Integrate',
    status: 'completed'
  },
  {
    id: '11',
    type: 'Setup',
    task: 'Configure Automated Alerts',
    trigger: 'Lease expiration notifications 90/60/30 days',
    assignedTo: { name: 'Marcus Johnson', initials: 'MJ' },
    action: 'Configure',
    status: 'completed'
  }
];

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
                        {task.trigger}
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