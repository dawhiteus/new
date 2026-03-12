import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { 
  MoreHorizontal, 
  CheckCircle, 
  UserCheck, 
  FileText, 
  CreditCard, 
  Upload 
} from 'lucide-react';

interface Task {
  type: string;
  trigger: string;
  badgeStyle: string;
}

interface TaskOverviewActionsDropdownProps {
  task: Task;
  onAction: (action: string, task: Task) => void;
}

export function TaskOverviewActionsDropdown({ task, onAction }: TaskOverviewActionsDropdownProps) {
  
  // Determine which actions are available based on task type and context
  const getAvailableActions = () => {
    const actions = [];
    
    // Mark as Complete - available for all tasks
    actions.push({
      id: 'mark-complete',
      label: 'Mark as Complete',
      icon: CheckCircle,
      onClick: () => onAction('mark-complete', task)
    });

    // Assign Owner - available for all tasks
    actions.push({
      id: 'assign-owner',
      label: 'Assign Owner',
      icon: UserCheck,
      onClick: () => onAction('assign-owner', task)
    });

    // View License - available for license-related tasks
    if (task.type === 'Operational' || task.trigger.toLowerCase().includes('license')) {
      actions.push({
        id: 'view-license',
        label: 'View License',
        icon: FileText,
        onClick: () => onAction('view-license', task)
      });
    }

    // Pay Invoice - available for payment-related tasks
    if (task.trigger.toLowerCase().includes('invoice') || task.trigger.toLowerCase().includes('payment')) {
      actions.push({
        id: 'pay-invoice',
        label: 'Pay Invoice',
        icon: CreditCard,
        onClick: () => onAction('pay-invoice', task)
      });
    }

    // Upload Document - available for setup and documentation tasks
    if (task.type === 'Setup' || task.trigger.toLowerCase().includes('document')) {
      actions.push({
        id: 'upload-document',
        label: 'Upload Document',
        icon: Upload,
        onClick: () => onAction('upload-document', task)
      });
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          aria-label="Task actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="rounded-xl border-0 p-3 shadow-md"
        style={{ 
          width: '220px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <div className="space-y-2">
          {availableActions.map((action, index) => (
            <DropdownMenuItem
              key={action.id}
              onClick={action.onClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                color: '#1A1A1A',
                backgroundColor: 'transparent',
                marginBottom: index < availableActions.length - 1 ? '8px' : '0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F8FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#E5F0FF';
                e.currentTarget.style.color = '#0056D2';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F8FF';
                e.currentTarget.style.color = '#1A1A1A';
              }}
            >
              <action.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{action.label}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}