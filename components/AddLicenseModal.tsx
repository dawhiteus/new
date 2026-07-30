import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X } from 'lucide-react';
import {
  WORKSPACE_TYPES,
  LICENSE_STATUS_OPTIONS,
  CONTRACT_TYPES,
  RENEWAL_MECHANISMS,
  NOTIFICATION_PERIODS,
  CURRENCIES,
  COUNTRIES,
  PAID_BY_OPTIONS,
  FUNDING_SOURCES,
} from './licenseFieldOptions';

interface AddLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (licenseData: any) => void;
}

const EMPTY_FORM = {
  licenseId: '',
  operator: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: 'UNITED STATES',
  workspaceType: 'Dedicated (External)',
  status: 'Active',
  size: '',
  seats: '',
  contractType: 'Fixed-Term',
  renewalMechanism: 'Not Specified',
  termStart: '',
  termEnd: '',
  notificationPeriod: 'None',
  currency: 'USD - US Dollar',
  monthlyCost: '',
  securityDeposit: '',
  paidBy: 'Customer',
  owner: '',
  fundingSource: '',
};

const fieldStyle = { fontSize: '14px', fontFamily: 'Inter, sans-serif' } as React.CSSProperties;
const labelStyle = { fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '8px', display: 'block' } as React.CSSProperties;
const sectionStyle = { fontSize: '12px', fontWeight: 700, color: '#005B94', textTransform: 'uppercase' as const, letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif', paddingBottom: '6px', borderBottom: '1px solid #E5E7EB' } as React.CSSProperties;

export function AddLicenseModal({ isOpen, onClose, onSave }: AddLicenseModalProps) {
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const set = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    onSave?.(formData);
    onClose();
    setFormData({ ...EMPTY_FORM });
  };

  const handleCancel = () => {
    onClose();
    setFormData({ ...EMPTY_FORM });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0" style={{ borderRadius: '12px', border: 'none' }}>
        <DialogDescription className="sr-only">Add a new external license</DialogDescription>

        {/* Blue header */}
        <div className="px-8 py-5 flex items-center justify-between" style={{ backgroundColor: '#005B94', borderRadius: '12px 12px 0 0' }}>
          <DialogTitle style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
            Add External License
          </DialogTitle>
          <button onClick={onClose} className="text-white/90 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 py-6">

          {/* Basic Information */}
          <div style={{ ...sectionStyle, marginBottom: '16px' }}>Basic Information</div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-5 mb-8">
            <div>
              <Label style={labelStyle}>License Id</Label>
              <Input value={formData.licenseId} onChange={(e) => set('licenseId', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
            <div>
              <Label style={labelStyle}>Operator</Label>
              <Input value={formData.operator} onChange={(e) => set('operator', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
            <div>
              <Label style={labelStyle}>Workspace Type</Label>
              <Select value={formData.workspaceType} onValueChange={(v) => set('workspaceType', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WORKSPACE_TYPES.map(t => <SelectItem key={t} value={t} style={fieldStyle}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Label style={labelStyle}>Address 1</Label>
              <Input value={formData.address1} onChange={(e) => set('address1', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
            <div className="col-span-3">
              <Label style={labelStyle}>Address 2</Label>
              <Input value={formData.address2} onChange={(e) => set('address2', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>

            <div>
              <Label style={labelStyle}>City</Label>
              <Input value={formData.city} onChange={(e) => set('city', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
            <div>
              <Label style={labelStyle}>State</Label>
              <Input value={formData.state} onChange={(e) => set('state', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
            <div>
              <Label style={labelStyle}>Zip</Label>
              <Input value={formData.zip} onChange={(e) => set('zip', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>

            <div>
              <Label style={labelStyle}>Country</Label>
              <Select value={formData.country} onValueChange={(v) => set('country', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => <SelectItem key={c} value={c} style={fieldStyle}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={labelStyle}>Status</Label>
              <Select value={formData.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LICENSE_STATUS_OPTIONS.map(s => <SelectItem key={s} value={s} style={fieldStyle}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={labelStyle}>Size</Label>
              <Input value={formData.size} onChange={(e) => set('size', e.target.value)} placeholder="e.g. 1,023 RSF" className="border-gray-300" style={fieldStyle} />
            </div>

            <div>
              <Label style={labelStyle}>Seats</Label>
              <Input type="number" value={formData.seats} onChange={(e) => set('seats', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
            <div className="col-span-2">
              <Label style={labelStyle}>License Owner</Label>
              <Input value={formData.owner} onChange={(e) => set('owner', e.target.value)} placeholder="name@company.com" className="border-gray-300" style={fieldStyle} />
            </div>
          </div>

          {/* Financial Information */}
          <div style={{ ...sectionStyle, marginBottom: '16px' }}>Financial Information</div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-5 mb-8">
            <div>
              <Label style={labelStyle}>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => set('currency', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => <SelectItem key={c} value={c} style={fieldStyle}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={labelStyle}>Monthly Cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" style={fieldStyle}>$</span>
                <Input type="number" value={formData.monthlyCost} onChange={(e) => set('monthlyCost', e.target.value)} className="border-gray-300 pl-7" style={fieldStyle} />
              </div>
            </div>
            <div>
              <Label style={labelStyle}>Security Deposit</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" style={fieldStyle}>$</span>
                <Input type="number" value={formData.securityDeposit} onChange={(e) => set('securityDeposit', e.target.value)} className="border-gray-300 pl-7" style={fieldStyle} />
              </div>
            </div>

            <div>
              <Label style={labelStyle}>Paid By</Label>
              <Select value={formData.paidBy} onValueChange={(v) => set('paidBy', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAID_BY_OPTIONS.map(p => <SelectItem key={p} value={p} style={fieldStyle}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label style={labelStyle}>Funding Source</Label>
              <Select value={formData.fundingSource} onValueChange={(v) => set('fundingSource', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}>
                  <SelectValue placeholder="Select Funding Source (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {FUNDING_SOURCES.map(f => <SelectItem key={f} value={f} style={fieldStyle}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contract Details */}
          <div style={{ ...sectionStyle, marginBottom: '16px' }}>Contract Details</div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-5">
            <div>
              <Label style={labelStyle}>Contract Type</Label>
              <Select value={formData.contractType} onValueChange={(v) => set('contractType', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map(t => <SelectItem key={t} value={t} style={fieldStyle}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={labelStyle}>Renewal Mechanism</Label>
              <Select value={formData.renewalMechanism} onValueChange={(v) => set('renewalMechanism', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RENEWAL_MECHANISMS.map(r => <SelectItem key={r} value={r} style={fieldStyle}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={labelStyle}>Notification Period</Label>
              <Select value={formData.notificationPeriod} onValueChange={(v) => set('notificationPeriod', v)}>
                <SelectTrigger className="border-gray-300" style={fieldStyle}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_PERIODS.map(n => <SelectItem key={n} value={n} style={fieldStyle}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label style={labelStyle}>Term Start</Label>
              <Input type="date" value={formData.termStart} onChange={(e) => set('termStart', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
            <div>
              <Label style={labelStyle}>Term End</Label>
              <Input type="date" value={formData.termEnd} onChange={(e) => set('termEnd', e.target.value)} className="border-gray-300" style={fieldStyle} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-8 mt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
            <Button onClick={handleSave} style={{ backgroundColor: '#005B94', color: '#FFFFFF', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel} className="border-gray-300" style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#374151' }}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
