import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bot, Clock, AlertTriangle, Lightbulb } from 'lucide-react';

export type AgentSeverity = 'informational' | 'suggestion' | 'review' | 'escalation';
export type AgentStatus = 'Running' | 'Completed' | 'Recommended' | 'Needs Review' | 'Escalation';

interface AgentCardProps {
  agentName: string;
  status: AgentStatus;
  severity: AgentSeverity;
  activity: string;
  dealName: string;
  dealStage: string;
  timestamp: string;
  estimatedCompletion?: string;
  consequence?: string;
  onApprove?: () => void;
  onRequestEdits?: () => void;
  onCreateTask?: () => void;
  onDismiss?: () => void;
  onAcknowledge?: () => void;
  onViewDetails?: () => void;
  onViewOutput?: () => void;
}

export function AgentCard({
  agentName,
  status,
  severity,
  activity,
  dealName,
  dealStage,
  timestamp,
  estimatedCompletion,
  consequence,
  onApprove,
  onRequestEdits,
  onCreateTask,
  onDismiss,
  onAcknowledge,
  onViewDetails,
  onViewOutput,
}: AgentCardProps) {
  // Severity-based styling
  const severityConfig = {
    informational: {
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      borderLeft: '1px',
      borderLeftColor: '#E5E7EB',
    },
    suggestion: {
      borderColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      borderLeft: '3px',
      borderLeftColor: '#3B82F6',
    },
    review: {
      borderColor: '#F59E0B',
      backgroundColor: '#FFFEF5',
      borderLeft: '3px',
      borderLeftColor: '#F59E0B',
    },
    escalation: {
      borderColor: '#FCA5A5',
      backgroundColor: '#FFFAFA',
      borderLeft: '3px',
      borderLeftColor: '#EF4444',
    },
  };

  const statusBadgeStyle = {
    Running: { bg: 'bg-green-100', text: 'text-green-700' },
    Completed: { bg: 'bg-gray-100', text: 'text-gray-700' },
    Recommended: { bg: 'bg-blue-100', text: 'text-blue-700' },
    'Needs Review': { bg: 'bg-amber-100', text: 'text-amber-700' },
    Escalation: { bg: 'bg-red-600', text: 'text-white' },
  };

  const isRunning = status === 'Running';
  const isCompleted = status === 'Completed';
  const isRecommended = status === 'Recommended';
  const isNeedsReview = status === 'Needs Review';
  const isEscalation = status === 'Escalation';

  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        borderColor: severityConfig[severity].borderColor,
        backgroundColor: severityConfig[severity].backgroundColor,
        borderLeftWidth: severityConfig[severity].borderLeft,
        borderLeftColor: severityConfig[severity].borderLeftColor,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Agent Icon */}
        <div className="flex-shrink-0">
          <div className="p-1.5 rounded" style={{ backgroundColor: '#D1FAE5' }}>
            <Bot className="h-3.5 w-3.5" style={{ color: '#059669' }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isEscalation && (
              <AlertTriangle
                className="h-3.5 w-3.5 flex-shrink-0"
                style={{ color: '#EF4444' }}
              />
            )}
            {isRecommended && (
              <Lightbulb
                className="h-3.5 w-3.5 flex-shrink-0"
                style={{ color: '#3B82F6' }}
              />
            )}
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {agentName}
            </span>
            <Badge
              className="bg-gray-100 text-gray-700 border-0"
              style={{
                fontSize: '10px',
                fontWeight: 500,
                paddingLeft: '6px',
                paddingRight: '6px',
              }}
            >
              Agent
            </Badge>
            <Badge
              className={`${statusBadgeStyle[status].bg} ${statusBadgeStyle[status].text} border-0 ${isRunning ? 'animate-pulse' : ''}`}
              style={{
                fontSize: '10px',
                fontWeight: 500,
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            >
              {status}
            </Badge>
            <span
              style={{
                fontSize: '12px',
                color: isEscalation ? '#991B1B' : '#9CA3AF',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {timestamp}
            </span>
          </div>

          {/* Activity Description */}
          <p
            style={{
              fontSize: '13px',
              color: '#374151',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px',
              lineHeight: 1.4,
            }}
          >
            {activity}
          </p>

          {/* Consequence/Details */}
          {consequence && (
            <p
              style={{
                fontSize: '12px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '8px',
                lineHeight: 1.4,
              }}
            >
              {consequence}
            </p>
          )}

          {/* Deal Name & Stage */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <button
              className="hover:underline"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#005B94',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {dealName}
            </button>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>•</span>
            <Badge
              className="border-0"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                backgroundColor: '#E5E7EB',
                color: '#374151',
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            >
              {dealStage}
            </Badge>
          </div>

          {/* Estimated Completion (Running only) */}
          {isRunning && estimatedCompletion && (
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-3 w-3" style={{ color: '#6B7280' }} />
              <span
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {estimatedCompletion}
              </span>
            </div>
          )}

          {/* Action Buttons - Based on Severity */}
          
          {/* INFORMATIONAL: Running, Completed */}
          {(isRunning || isCompleted) && severity === 'informational' && onViewDetails && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  color: '#374151',
                  borderColor: '#E5E7EB',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                }}
              >
                View Details
              </Button>
            </div>
          )}

          {/* SUGGESTION: Recommended */}
          {isRecommended && severity === 'suggestion' && (
            <div className="flex items-center gap-2 flex-wrap">
              {onCreateTask && (
                <Button
                  size="sm"
                  onClick={onCreateTask}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    backgroundColor: '#005B94',
                    color: '#FFFFFF',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  Create Task
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDismiss}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    color: '#374151',
                    borderColor: '#E5E7EB',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  Dismiss
                </Button>
              )}
            </div>
          )}

          {/* NEEDS REVIEW: Human Validation Required */}
          {isNeedsReview && severity === 'review' && (
            <div className="flex items-center gap-2 flex-wrap">
              {onApprove && (
                <Button
                  size="sm"
                  onClick={onApprove}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    backgroundColor: '#005B94',
                    color: '#FFFFFF',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  Approve
                </Button>
              )}
              {onRequestEdits && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRequestEdits}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    color: '#374151',
                    borderColor: '#E5E7EB',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  Request Edits
                </Button>
              )}
              {onViewOutput && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewOutput}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    color: '#374151',
                    borderColor: '#E5E7EB',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  View Output
                </Button>
              )}
            </div>
          )}

          {/* ESCALATION: Blocked / Risk */}
          {isEscalation && severity === 'escalation' && (
            <div className="flex items-center gap-2 flex-wrap">
              {onCreateTask && (
                <Button
                  size="sm"
                  onClick={onCreateTask}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    backgroundColor: '#005B94',
                    color: '#FFFFFF',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  Create Task
                </Button>
              )}
              {onAcknowledge && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAcknowledge}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    color: '#374151',
                    borderColor: '#E5E7EB',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  Acknowledge
                </Button>
              )}
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetails}
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    color: '#374151',
                    borderColor: '#E5E7EB',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                >
                  View Details
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}