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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { X } from 'lucide-react';
import { toast } from './ui/toast';

interface CreateEditDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: any;
}

export function CreateEditDealModal({ isOpen, onClose, deal }: CreateEditDealModalProps) {
  const [formData, setFormData] = useState({
    dealName: deal?.dealName || '',
    clientName: deal?.clientName || '',
    city: deal?.city || '',
    workspaceType: deal?.workspaceType || '',
    dealStage: deal?.dealStage || 'Intake',
    size: deal?.size || '',
    estValue: deal?.estValue || '',
    status: deal?.status || 'Active',
    broker: deal?.broker || '',
  });

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
          {deal ? 'Edit requirement information including name, client, stage, and estimated value' : 'Create a new requirement by entering requirement information, client details, and workspace requirements'}
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
        <form onSubmit={handleSubmit} className="p-6">
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

            {/* Client Name */}
            <div>
              <Label htmlFor="clientName" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Client Name *
              </Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Enter client name"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city"
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
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                  <SelectItem value="Dedicated Desk">Dedicated Desk</SelectItem>
                  <SelectItem value="Private Office">Private Office</SelectItem>
                  <SelectItem value="Team Suite">Team Suite</SelectItem>
                  <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Requirement Stage */}
            <div>
              <Label htmlFor="dealStage" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Requirement Stage *
              </Label>
              <Select
                value={formData.dealStage}
                onValueChange={(value) => setFormData({ ...formData, dealStage: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intake">Intake</SelectItem>
                  <SelectItem value="Evaluation">Evaluation</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Contracting">Contracting</SelectItem>
                  <SelectItem value="Execution">Execution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            <div>
              <Label htmlFor="size" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Size (sq ft) *
              </Label>
              <Input
                id="size"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="Enter size"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Estimated Value */}
            <div>
              <Label htmlFor="estValue" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Estimated Value ($) *
              </Label>
              <Input
                id="estValue"
                type="number"
                value={formData.estValue}
                onChange={(e) => setFormData({ ...formData, estValue: e.target.value })}
                placeholder="Enter estimated value"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Broker */}
            <div>
              <Label htmlFor="broker" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Broker *
              </Label>
              <Select
                value={formData.broker}
                onValueChange={(value) => setFormData({ ...formData, broker: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select broker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                  <SelectItem value="Michael Torres">Michael Torres</SelectItem>
                  <SelectItem value="David Kim">David Kim</SelectItem>
                  <SelectItem value="Jennifer Lee">Jennifer Lee</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="Executed">Executed</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
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