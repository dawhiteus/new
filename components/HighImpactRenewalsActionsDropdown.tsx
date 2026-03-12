import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal, Eye, Upload, CreditCard, UserPlus } from 'lucide-react';

interface HighImpactRenewalsActionsDropdownProps {
  renewal: {
    location: string;
    date: string;
    hasOutstandingInvoice?: boolean;
    hasRenewedDocument?: boolean;
  };
  onAction?: (action: string, renewal: any) => void;
}

export function HighImpactRenewalsActionsDropdown({ 
  renewal, 
  onAction = () => {} 
}: HighImpactRenewalsActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: string) => {
    // Log interaction for analytics
    console.log(`Action triggered: ${action} for renewal: ${renewal.location}`);
    onAction(action, renewal);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label={`Actions for ${renewal.location} renewal`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="border border-border rounded-xl shadow-md"
        style={{
          width: '220px',
          padding: '12px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        {/* View License */}
        <DropdownMenuItem
          onClick={() => handleAction('view-license')}
          className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 focus:bg-gray-50"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#1A1A1A',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '8px'
          }}
        >
          <Eye className="h-4 w-4 text-gray-600" />
          <span>View License</span>
        </DropdownMenuItem>

        {/* Upload Updated License - Only show if no renewed document exists */}
        {!renewal.hasRenewedDocument && (
          <DropdownMenuItem
            onClick={() => handleAction('upload-updated-license')}
            className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 focus:bg-gray-50"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#1A1A1A',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px'
            }}
          >
            <Upload className="h-4 w-4 text-gray-600" />
            <span>Upload Updated License</span>
          </DropdownMenuItem>
        )}

        {/* Pay Invoice - Only show if unpaid invoice exists */}
        {renewal.hasOutstandingInvoice && (
          <DropdownMenuItem
            onClick={() => handleAction('pay-invoice')}
            className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 focus:bg-gray-50"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#1A1A1A',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px'
            }}
          >
            <CreditCard className="h-4 w-4 text-gray-600" />
            <span>Pay Invoice</span>
          </DropdownMenuItem>
        )}

        {/* Assign Owner */}
        <DropdownMenuItem
          onClick={() => handleAction('assign-owner')}
          className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 focus:bg-gray-50"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#1A1A1A',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <UserPlus className="h-4 w-4 text-gray-600" />
          <span>Assign Owner</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}