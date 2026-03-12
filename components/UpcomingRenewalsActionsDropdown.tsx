import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { 
  MoreHorizontal, 
  Eye, 
  Upload, 
  CreditCard, 
  UserCheck 
} from 'lucide-react';

interface UpcomingLicense {
  name: string;
  location: string;
  expirationDate: string;
  sqft: number;
  status: string;
  hasPendingInvoice?: boolean;
  hasRenewalDocument?: boolean;
}

interface UpcomingRenewalsActionsDropdownProps {
  license: UpcomingLicense;
  onAction: (action: string, license: UpcomingLicense) => void;
}

export function UpcomingRenewalsActionsDropdown({ license, onAction }: UpcomingRenewalsActionsDropdownProps) {
  
  // Determine which actions are available based on license status and conditions
  const getAvailableActions = () => {
    const actions = [];
    
    // View License - always available
    actions.push({
      id: 'view-license',
      label: 'View License',
      icon: Eye,
      onClick: () => onAction('view-license', license)
    });

    // Upload Updated License - only if no renewal file is currently attached
    if (!license.hasRenewalDocument) {
      actions.push({
        id: 'upload-updated-license',
        label: 'Upload Updated License',
        icon: Upload,
        onClick: () => onAction('upload-updated-license', license)
      });
    }

    // Pay Invoice - only when a pending invoice exists
    if (license.hasPendingInvoice) {
      actions.push({
        id: 'pay-invoice',
        label: 'Pay Invoice',
        icon: CreditCard,
        onClick: () => onAction('pay-invoice', license)
      });
    }

    // Assign Owner - always available
    actions.push({
      id: 'assign-owner',
      label: 'Assign Owner',
      icon: UserCheck,
      onClick: () => onAction('assign-owner', license)
    });

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
          aria-label="License actions"
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