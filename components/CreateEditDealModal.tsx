import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { X, Bot, FileText, Upload, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from './ui/toast';

interface CreateEditDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: any;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar',          symbol: '$'   },
  { code: 'EUR', name: 'Euro',               symbol: '€'   },
  { code: 'GBP', name: 'British Pound',      symbol: '£'   },
  { code: 'CAD', name: 'Canadian Dollar',    symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar',  symbol: 'A$'  },
  { code: 'JPY', name: 'Japanese Yen',       symbol: '¥'   },
  { code: 'SGD', name: 'Singapore Dollar',   symbol: 'S$'  },
  { code: 'HKD', name: 'Hong Kong Dollar',   symbol: 'HK$' },
  { code: 'MXN', name: 'Mexican Peso',       symbol: 'MX$' },
  { code: 'BRL', name: 'Brazilian Real',     symbol: 'R$'  },
  { code: 'INR', name: 'Indian Rupee',       symbol: '₹'   },
  { code: 'CNY', name: 'Chinese Yuan',       symbol: '¥'   },
  { code: 'CHF', name: 'Swiss Franc',        symbol: 'CHF' },
  { code: 'AED', name: 'UAE Dirham',         symbol: 'AED' },
];

// Approximate rates to USD (as of mid-2025)
const FX_TO_USD: Record<string, number> = {
  USD: 1,     EUR: 1.09,  GBP: 1.27,  CAD: 0.73,  AUD: 0.65,
  JPY: 0.007, SGD: 0.74,  HKD: 0.13,  MXN: 0.058, BRL: 0.20,
  INR: 0.012, CNY: 0.138, CHF: 1.13,  AED: 0.272,
};

function deriveUSD(amount: string, currency: string): string | null {
  if (currency === 'USD' || !amount) return null;
  const num = parseFloat(amount.replace(/,/g, ''));
  if (isNaN(num)) return null;
  const rate = FX_TO_USD[currency] ?? 1;
  const usd = Math.round(num * rate);
  return `≈ USD $${usd.toLocaleString()}/mo`;
}

export function CreateEditDealModal({ isOpen, onClose, deal }: CreateEditDealModalProps) {
  const [formData, setFormData] = useState({
    dealName:         deal?.dealName || '',
    clientName:       deal?.clientName || '',
    city:             deal?.city || '',
    workspaceType:    deal?.workspaceType || '',
    size:             deal?.size || '',
    currency:         'USD',
    monthlyCost:      deal?.estValue ? String(deal.estValue) : '',
    status:           deal?.status === 'Executed' || deal?.status === 'Archived' ? 'Active' : (deal?.status || 'Active'),
    headcount:        '',
    budget:           '',
    term:             '',
    requirementNotes: '',
  });
  const [showAdditional, setShowAdditional] = useState(false);

  const currencyInfo = CURRENCIES.find(c => c.code === formData.currency) ?? CURRENCIES[0];
  const usdDerived = deriveUSD(formData.monthlyCost, formData.currency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    if (deal) {
      toast.success('Requirement updated successfully.');
    } else {
      toast.success(`Requirement "${formData.dealName}" created.`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogDescription className="sr-only">
          {deal ? 'Edit requirement information including name, company, and workspace requirements' : 'Create a new requirement by entering requirement information, company details, and workspace requirements'}
        </DialogDescription>
        {/* Header */}
        <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white" style={{ fontSize: '22px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              {deal ? 'Edit Requirement' : 'Create New Requirement'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>

          {/* Requirements Intake Agent Panel */}
          <div
            className="rounded-lg mb-6 p-4"
            style={{ backgroundColor: '#F0F7FF', border: '1px solid #BFDBFE' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-4 w-4" style={{ color: '#005B94' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E3A5F', fontFamily: 'Inter, sans-serif' }}>
                Requirements Intake Agent
              </span>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontSize: '10px', fontWeight: 600, backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'Inter, sans-serif' }}
              >
                Agent
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
              Let the agent help you create a structured requirement from:
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info('Coming soon')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors hover:bg-blue-50"
                style={{ fontSize: '12px', fontWeight: 500, color: '#005B94', borderColor: '#BFDBFE', fontFamily: 'Inter, sans-serif', backgroundColor: 'white' }}
              >
                <FileText className="h-3.5 w-3.5" />
                Describe Requirement
              </button>
              <button
                type="button"
                onClick={() => toast.info('Coming soon')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors hover:bg-blue-50"
                style={{ fontSize: '12px', fontWeight: 500, color: '#005B94', borderColor: '#BFDBFE', fontFamily: 'Inter, sans-serif', backgroundColor: 'white' }}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Brief
              </button>
              <button
                type="button"
                onClick={() => toast.info('Coming soon')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors hover:bg-blue-50"
                style={{ fontSize: '12px', fontWeight: 500, color: '#005B94', borderColor: '#BFDBFE', fontFamily: 'Inter, sans-serif', backgroundColor: 'white' }}
              >
                <Building2 className="h-3.5 w-3.5" />
                Use Reference Space
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Requirement Name */}
            <div className="col-span-2">
              <Label htmlFor="dealName" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Requirement Name *
              </Label>
              <Input
                id="dealName"
                value={formData.dealName}
                onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                placeholder="Enter requirement name"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="clientName" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Company *
              </Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="e.g. AT&T"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="city" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Location *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter location"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Workspace Type */}
            <div>
              <Label htmlFor="workspaceType" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Workspace Type *
              </Label>
              <Select
                value={formData.workspaceType}
                onValueChange={(value) => setFormData({ ...formData, workspaceType: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select workspace type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private Office">Private Office</SelectItem>
                  <SelectItem value="Office Suite">Office Suite</SelectItem>
                  <SelectItem value="Headquarters">Headquarters</SelectItem>
                  <SelectItem value="Coworking">Coworking</SelectItem>
                  <SelectItem value="Meeting Space">Meeting Space</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            <div>
              <Label htmlFor="size" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Size Requirement (sq ft) *
              </Label>
              <Input
                id="size"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="Enter required size"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Currency */}
            <div>
              <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Currency *
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} – {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Cost */}
            <div>
              <Label htmlFor="monthlyCost" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Monthly Cost *
              </Label>
              <div className="mt-2 flex rounded-md border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <span style={{
                  display: 'flex', alignItems: 'center', padding: '0 10px',
                  backgroundColor: '#F9FAFB', borderRight: '1px solid #E5E7EB',
                  fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {currencyInfo.symbol}
                </span>
                <input
                  id="monthlyCost"
                  type="number"
                  value={formData.monthlyCost}
                  onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
                  placeholder="0"
                  required
                  style={{
                    flex: 1, border: 'none', outline: 'none', padding: '9px 12px',
                    fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#111827',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
              {usdDerived && (
                <p style={{ marginTop: '5px', fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  {usdDerived}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Status *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Requirement Details — expandable */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowAdditional((v) => !v)}
              className="flex items-center gap-2 w-full py-2 transition-colors hover:text-gray-800"
              style={{ fontSize: '14px', fontWeight: 500, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
            >
              {showAdditional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Additional Requirement Details
            </button>

            {showAdditional && (
              <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                {/* Capacity / Headcount */}
                <div>
                  <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Capacity / Headcount
                  </Label>
                  <Input
                    type="number"
                    value={formData.headcount}
                    onChange={(e) => setFormData({ ...formData, headcount: e.target.value })}
                    placeholder="Enter headcount"
                    className="mt-2 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Budget */}
                <div>
                  <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Budget
                  </Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Enter budget"
                    className="mt-2 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Term */}
                <div>
                  <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Term
                  </Label>
                  <Select
                    value={formData.term}
                    onValueChange={(value) => setFormData({ ...formData, term: value })}
                  >
                    <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                      <SelectItem value="Less than 6 months">Less than 6 months</SelectItem>
                      <SelectItem value="6–12 months">6–12 months</SelectItem>
                      <SelectItem value="12–24 months">12–24 months</SelectItem>
                      <SelectItem value="24+ months">24+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Requirement Notes — full width */}
                <div className="col-span-2">
                  <Label style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Requirement Notes
                  </Label>
                  <Textarea
                    value={formData.requirementNotes}
                    onChange={(e) => setFormData({ ...formData, requirementNotes: e.target.value })}
                    placeholder="Add requirement notes"
                    className="mt-2 border-gray-300 min-h-20"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#E5E7EB' }}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300"
              style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-white"
              style={{
                backgroundColor: '#005B94',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {deal ? 'Save Changes' : 'Create Requirement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
