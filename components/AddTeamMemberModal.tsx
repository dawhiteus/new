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

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: any) => void;
}

export function AddTeamMemberModal({ isOpen, onClose, onAdd }: AddTeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organization: '',
    email: '',
    phone: '',
    type: 'Internal' as 'Internal' | 'External',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: '',
      role: '',
      organization: '',
      email: '',
      phone: '',
      type: 'Internal',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0">
        <DialogDescription className="sr-only">
          Add a new team member to the deal by entering their name, role, organization, and contact information
        </DialogDescription>
        {/* Header */}
        <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}>
          <div className="flex items-center justify-between">
            <DialogTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Add Team Member
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Role *
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead Broker">Lead Broker</SelectItem>
                  <SelectItem value="Client Contact">Client Contact</SelectItem>
                  <SelectItem value="Legal Counsel">Legal Counsel</SelectItem>
                  <SelectItem value="Deal Coordinator">Deal Coordinator</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Organization */}
            <div>
              <Label htmlFor="organization" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Organization *
              </Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Enter organization"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Type *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'Internal' | 'External') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-2 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <Label htmlFor="phone" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone (optional)"
                className="mt-2 border-gray-300"
                style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
              />
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
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}