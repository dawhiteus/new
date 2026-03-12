import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal, Eye, User, DollarSign } from 'lucide-react';

interface PaymentActionsDropdownProps {
  payment: {
    id: number;
    city: string;
    type: string;
    address: string;
    operator: string;
    amountDue: number;
    dueDate: string;
    paymentMethod: string;
    licenseId: string;
    status: 'paid' | 'due_soon' | 'overdue';
    paymentInfo: string;
  };
  onViewDetails: (payment: any) => void;
  onAssignUser: (payment: any) => void;
  onInitiatePayment: (payment: any) => void;
}

export function PaymentActionsDropdown({ 
  payment, 
  onViewDetails, 
  onAssignUser, 
  onInitiatePayment 
}: PaymentActionsDropdownProps) {
  const canInitiatePayment = payment.status === 'due_soon' || payment.status === 'overdue';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-8 w-8 hover:bg-gray-100 data-[state=open]:bg-gray-100"
          style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
          <span className="sr-only">Open payment actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-44 bg-white border border-gray-200 shadow-md rounded-lg p-1"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <DropdownMenuItem
          onClick={() => onViewDetails(payment)}
          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          style={{
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            color: '#374151'
          }}
        >
          <Eye className="h-4 w-4 text-gray-500" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onAssignUser(payment)}
          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          style={{
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            color: '#374151'
          }}
        >
          <User className="h-4 w-4 text-gray-500" />
          Assign to User
        </DropdownMenuItem>

        {canInitiatePayment && (
          <DropdownMenuItem
            onClick={() => onInitiatePayment(payment)}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
            style={{
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              color: '#374151'
            }}
          >
            <DollarSign className="h-4 w-4 text-gray-500" />
            Initiate Payment
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}