import React from 'react';
import { Badge } from './ui/badge';
import { Clock, Lightbulb, FileCheck, AlertCircle } from 'lucide-react';

interface AgentActivityCountersProps {
  tasksRunning: number;
  recommendedActions: number;
  outputsAwaitingReview: number;
  activeBlockers: number;
  onFilterRunning?: () => void;
  onFilterRecommended?: () => void;
  onFilterReview?: () => void;
  onFilterBlockers?: () => void;
}

export function AgentActivityCounters({
  tasksRunning,
  recommendedActions,
  outputsAwaitingReview,
  activeBlockers,
  onFilterRunning,
  onFilterRecommended,
  onFilterReview,
  onFilterBlockers,
}: AgentActivityCountersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Tasks Running */}
      <button
        onClick={onFilterRunning}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
        style={{
          borderColor: tasksRunning > 0 ? '#10B981' : '#E5E7EB',
          backgroundColor: tasksRunning > 0 ? '#F0FDF4' : '#FFFFFF',
        }}
      >
        <Clock
          className="h-4 w-4"
          style={{ color: tasksRunning > 0 ? '#10B981' : '#6B7280' }}
        />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#374151',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Running
        </span>
        <Badge
          className="border-0"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: tasksRunning > 0 ? '#10B981' : '#9CA3AF',
            color: '#FFFFFF',
            paddingLeft: '6px',
            paddingRight: '6px',
            minWidth: '20px',
          }}
        >
          {tasksRunning}
        </Badge>
      </button>

      {/* Recommended Actions */}
      <button
        onClick={onFilterRecommended}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
        style={{
          borderColor: recommendedActions > 0 ? '#3B82F6' : '#E5E7EB',
          backgroundColor: recommendedActions > 0 ? '#EFF6FF' : '#FFFFFF',
        }}
      >
        <Lightbulb
          className="h-4 w-4"
          style={{ color: recommendedActions > 0 ? '#3B82F6' : '#6B7280' }}
        />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#374151',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Recommended
        </span>
        <Badge
          className="border-0"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: recommendedActions > 0 ? '#3B82F6' : '#9CA3AF',
            color: '#FFFFFF',
            paddingLeft: '6px',
            paddingRight: '6px',
            minWidth: '20px',
          }}
        >
          {recommendedActions}
        </Badge>
      </button>

      {/* Outputs Awaiting Review */}
      <button
        onClick={onFilterReview}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
        style={{
          borderColor: outputsAwaitingReview > 0 ? '#F59E0B' : '#E5E7EB',
          backgroundColor: outputsAwaitingReview > 0 ? '#FFFBEB' : '#FFFFFF',
        }}
      >
        <FileCheck
          className="h-4 w-4"
          style={{ color: outputsAwaitingReview > 0 ? '#F59E0B' : '#6B7280' }}
        />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#374151',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Needs Review
        </span>
        <Badge
          className="border-0"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: outputsAwaitingReview > 0 ? '#F59E0B' : '#9CA3AF',
            color: '#FFFFFF',
            paddingLeft: '6px',
            paddingRight: '6px',
            minWidth: '20px',
          }}
        >
          {outputsAwaitingReview}
        </Badge>
      </button>

      {/* Active Blockers */}
      <button
        onClick={onFilterBlockers}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
        style={{
          borderColor: activeBlockers > 0 ? '#EF4444' : '#E5E7EB',
          backgroundColor: activeBlockers > 0 ? '#FEF2F2' : '#FFFFFF',
        }}
      >
        <AlertCircle
          className="h-4 w-4"
          style={{ color: activeBlockers > 0 ? '#EF4444' : '#6B7280' }}
        />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#374151',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Escalation
        </span>
        <Badge
          className="border-0"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: activeBlockers > 0 ? '#EF4444' : '#9CA3AF',
            color: '#FFFFFF',
            paddingLeft: '6px',
            paddingRight: '6px',
            minWidth: '20px',
          }}
        >
          {activeBlockers}
        </Badge>
      </button>
    </div>
  );
}
