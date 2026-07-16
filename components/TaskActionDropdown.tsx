import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal, CheckCircle, UserPlus, X, ExternalLink, CalendarClock } from 'lucide-react';

interface TaskActionDropdownProps {
  taskId: string;
  onMarkComplete?: (taskId: string) => void;
  onReassignTask?: (taskId: string) => void;
  onDismissTask?: (taskId: string) => void;
  onGoToLicense?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
}

export function TaskActionDropdown({
  taskId,
  onMarkComplete,
  onReassignTask,
  onDismissTask,
  onGoToLicense,
  onEditTask,
}: TaskActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 shadow-md p-3 space-y-2"
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        {/* Edit Task */}
        <DropdownMenuItem
          onClick={() => onEditTask?.(taskId)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <CalendarClock className="h-4 w-4 text-blue-600" />
          <span>Edit Task</span>
        </DropdownMenuItem>

        {/* Mark as Complete */}
        <DropdownMenuItem
          onClick={() => onMarkComplete?.(taskId)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Mark as Complete</span>
        </DropdownMenuItem>

        {/* Reassign Task */}
        <DropdownMenuItem
          onClick={() => onReassignTask?.(taskId)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <UserPlus className="h-4 w-4 text-blue-600" />
          <span>Reassign Task</span>
        </DropdownMenuItem>

        {/* Dismiss Task */}
        <DropdownMenuItem
          onClick={() => onDismissTask?.(taskId)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <X className="h-4 w-4 text-gray-600" />
          <span>Dismiss Task</span>
        </DropdownMenuItem>

        {/* Go to License */}
        <DropdownMenuItem
          onClick={() => onGoToLicense?.(taskId)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <ExternalLink className="h-4 w-4 text-blue-600" />
          <span>Go to License</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}