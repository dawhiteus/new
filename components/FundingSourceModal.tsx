import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';

interface FundingSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FundingSourceFormData) => void;
  initialData?: Partial<FundingSourceFormData>;
  isEditing?: boolean;
}

interface FundingSourceFormData {
  name: string;
  type: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
}

export function FundingSourceModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  isEditing = false 
}: FundingSourceModalProps) {
  const [formData, setFormData] = useState<FundingSourceFormData>({
    name: initialData?.name || '',
    type: initialData?.type || '',
    bankName: initialData?.bankName || '',
    accountNumber: initialData?.accountNumber || '',
    routingNumber: initialData?.routingNumber || '',
    accountType: initialData?.accountType || '',
  });

  const handleInputChange = (field: keyof FundingSourceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[75vh] flex flex-col p-0 bg-white rounded-2xl shadow-xl">
        {/* Blue Header - Fixed */}
        <div className="bg-primary text-primary-foreground px-8 py-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle 
              className="text-white m-0"
              style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
            >
              Funding Source Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Add or edit funding source information including bank details and account type.
            </DialogDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose()}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div 
          className="flex-1 overflow-y-auto px-8 py-6 min-h-0 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#e5e7eb #f8f9fa'
          }}
        >
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f8f9fa;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e5e7eb;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #d1d5db;
            }
          `}</style>

          <div className="space-y-6">
            {/* Row 1: Name and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label 
                  htmlFor="name"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#005B94'
                  }}
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="NYC Ops Account"
                  className="h-10 border rounded-md px-3"
                  style={{ 
                    borderColor: '#e5e7eb', 
                    fontSize: '16px', 
                    fontWeight: 400, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="type"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#005B94'
                  }}
                >
                  Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger 
                    className="h-10 border rounded-md"
                    style={{ 
                      borderColor: '#e5e7eb', 
                      fontSize: '16px', 
                      fontWeight: 400, 
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <SelectValue placeholder="Marketplace Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct-billing">Direct Billing</SelectItem>
                    <SelectItem value="corporate-card">Corporate Card</SelectItem>
                    <SelectItem value="budget-allocation">Budget Allocation</SelectItem>
                    <SelectItem value="purchase-order">Purchase Order</SelectItem>
                    <SelectItem value="marketplace-account">Marketplace Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Bank Name and Account Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label 
                  htmlFor="bankName"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#005B94'
                  }}
                >
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Bank of America"
                  className="h-10 border rounded-md px-3"
                  style={{ 
                    borderColor: '#e5e7eb', 
                    fontSize: '16px', 
                    fontWeight: 400, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="accountNumber"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#005B94'
                  }}
                >
                  Account Number
                </Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="5483980"
                  className="h-10 border rounded-md px-3"
                  style={{ 
                    borderColor: '#e5e7eb', 
                    fontSize: '16px', 
                    fontWeight: 400, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            {/* Row 3: Routing Number and Account Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label 
                  htmlFor="routingNumber"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#005B94'
                  }}
                >
                  Routing Number
                </Label>
                <Input
                  id="routingNumber"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                  placeholder="5483980"
                  className="h-10 border rounded-md px-3"
                  style={{ 
                    borderColor: '#e5e7eb', 
                    fontSize: '16px', 
                    fontWeight: 400, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="accountType"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    fontFamily: 'Inter, sans-serif', 
                    color: '#005B94'
                  }}
                >
                  Account Type
                </Label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                  <SelectTrigger 
                    className="h-10 border rounded-md"
                    style={{ 
                      borderColor: '#e5e7eb', 
                      fontSize: '16px', 
                      fontWeight: 400, 
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <SelectValue placeholder="Business Checking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business-checking">Business Checking</SelectItem>
                    <SelectItem value="business-savings">Business Savings</SelectItem>
                    <SelectItem value="personal-checking">Personal Checking</SelectItem>
                    <SelectItem value="personal-savings">Personal Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Extra spacing at bottom for better scroll experience */}
            <div className="h-6"></div>
          </div>
        </div>

        {/* Footer with Action Buttons - Fixed */}
        <div className="border-t px-8 py-4 bg-gray-50 flex-shrink-0" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-2 border rounded-md"
              style={{ 
                borderColor: '#e5e7eb',
                color: '#374151',
                fontSize: '14px', 
                fontWeight: 500, 
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 py-2 text-white rounded-md"
              style={{ 
                backgroundColor: '#005B94', 
                fontSize: '14px', 
                fontWeight: 500, 
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}