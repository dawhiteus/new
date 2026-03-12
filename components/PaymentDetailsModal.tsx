import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, MapPin, Calendar, CreditCard, Building2, FileText, DollarSign, Download } from 'lucide-react';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiatePayment?: (paymentData: { paymentMethod: string; paidBy: string }) => void;
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
  } | null;
}

export function PaymentDetailsModal({ isOpen, onClose, onInitiatePayment, payment }: PaymentDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paidBy, setPaidBy] = useState('');
  
  if (!payment) return null;

  // Determine modal state based on payment status
  const isUpcoming = payment.status !== 'due_soon' && payment.status !== 'overdue' && payment.status !== 'paid';
  const isDueOrOverdue = payment.status === 'due_soon' || payment.status === 'overdue';
  const isPaid = payment.status === 'paid';
  
  // Show edit mode for upcoming payments when "Initiate Payment" is clicked
  const showEditableFields = (isDueOrOverdue || isEditMode);
  const canInitiatePayment = !isPaid;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 border-0" 
            style={{ backgroundColor: '#28A745', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Paid
          </Badge>
        );
      case 'due_soon':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 border-0" 
            style={{ backgroundColor: '#FFA500', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Due Soon
          </Badge>
        );
      case 'overdue':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 border-0" 
            style={{ backgroundColor: '#DC3545', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock funding source data - in a real app this would come from the payment data
  const fundingSource = {
    name: 'Corporate Operations Fund',
    type: 'Budget Allocation',
    department: 'Real Estate & Facilities'
  };

  // Payment method options
  const paymentMethodOptions = [
    'ACH Transfer',
    'Wire Transfer', 
    'Credit Card',
    'Check'
  ];

  // Paid by options
  const paidByOptions = [
    'LiquidSpace',
    'CompanyName',
    'Finance Department',
    'Facilities Team'
  ];

  // Handler functions
  const handleInitiatePayment = () => {
    if (isUpcoming) {
      // For upcoming payments, switch to edit mode
      setIsEditMode(true);
      setPaymentMethod(payment.paymentMethod || '');
      setPaidBy('LiquidSpace'); // Default value
    } else {
      // For due/overdue payments, submit the form
      if (onInitiatePayment && paymentMethod && paidBy) {
        onInitiatePayment({ paymentMethod, paidBy });
        handleClose();
      }
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      // Cancel edit mode, return to read-only
      setIsEditMode(false);
      setPaymentMethod('');
      setPaidBy('');
    } else {
      // Close modal
      handleClose();
    }
  };

  const handleClose = () => {
    setIsEditMode(false);
    setPaymentMethod('');
    setPaidBy('');
    onClose();
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would download the receipt
    console.log('Downloading receipt for payment:', payment.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-white"
        style={{ 
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          width: '100%',
          maxWidth: '700px'
        }}
      >
        {/* Sticky Header */}
        <div 
          className="sticky top-0 z-10 bg-primary text-primary-foreground px-8 py-6 rounded-t-xl flex-shrink-0"
          style={{ backgroundColor: '#005B94' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle 
                className="text-white m-0 mb-2"
                style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
              >
                Payment Details
              </DialogTitle>
              <DialogDescription 
                className="text-primary-foreground/90 m-0"
                style={{ fontSize: '14px', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}
              >
                {showEditableFields 
                  ? 'Configure payment settings and initiate payment'
                  : `Complete payment information for ${payment.address}`
                }
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Key Payment Information - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  City
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {payment.city}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Workplace Type
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {payment.type}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Address
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {payment.address}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Payment Start Date
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {formatDate('2024-01-01')} {/* Mock start date */}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Payment Amount
                </div>
                <div 
                  style={{ fontSize: '24px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {formatCurrency(payment.amountDue)}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Status
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(payment.status)}
                  {(isDueOrOverdue) && (
                    <span 
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: payment.status === 'overdue' ? '#DC3545' : '#FFA500',
                        fontFamily: 'Inter, sans-serif' 
                      }}
                    >
                      {payment.status === 'overdue' ? 'Immediate attention required' : 'Action required soon'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Operator
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {payment.operator}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  License ID
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {payment.licenseId}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Payment Frequency
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {payment.paymentInfo}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Due Day
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {formatDate(payment.dueDate)}
                </div>
              </div>

              <div>
                <div 
                  className="mb-2"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  Paid By
                </div>
                <div 
                  style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {isPaid ? 'LiquidSpace Finance' : 'TBD'}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Fields for Due/Overdue or Edit Mode */}
          {showEditableFields && (
            <div className="border-t pt-8" style={{ borderColor: '#E5E7EB' }}>
              <h3 
                className="mb-6"
                style={{ fontSize: '18px', fontWeight: 600, color: '#005B94', fontFamily: 'Inter, sans-serif' }}
              >
                Payment Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block mb-3"
                    style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                  >
                    Payment Method
                  </label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger 
                      className="h-12 border rounded-lg"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        fontSize: '16px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethodOptions.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label 
                    className="block mb-3"
                    style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                  >
                    Paid By
                  </label>
                  <Select value={paidBy} onValueChange={setPaidBy}>
                    <SelectTrigger 
                      className="h-12 border rounded-lg"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        fontSize: '16px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <SelectValue placeholder="Select who will pay" />
                    </SelectTrigger>
                    <SelectContent>
                      {paidByOptions.map((payer) => (
                        <SelectItem key={payer} value={payer}>
                          {payer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Footer */}
        <div 
          className="sticky bottom-0 border-t px-8 py-6 bg-gray-50 flex items-center justify-between" 
          style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}
        >
          {/* Left side - Download Receipt for paid status */}
          <div>
            {isPaid && (
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  fontFamily: 'Inter, sans-serif',
                  borderColor: '#E5E7EB',
                  color: '#374151'
                }}
              >
                <Download className="h-4 w-4" />
                Download Receipt
              </Button>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            {showEditableFields ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    fontFamily: 'Inter, sans-serif',
                    borderColor: '#E5E7EB',
                    color: '#374151'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInitiatePayment}
                  disabled={!paymentMethod || !paidBy}
                  className="px-6 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: (paymentMethod && paidBy) ? '#005B94' : '#9CA3AF',
                    border: 'none'
                  }}
                >
                  Initiate Payment
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    fontFamily: 'Inter, sans-serif',
                    borderColor: '#E5E7EB',
                    color: '#374151'
                  }}
                >
                  Close
                </Button>
                {canInitiatePayment && (
                  <Button
                    onClick={handleInitiatePayment}
                    className="px-6 py-2 text-white"
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#005B94',
                      border: 'none'
                    }}
                  >
                    Initiate Payment
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}