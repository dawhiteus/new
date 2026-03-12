import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AssignOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (email: string) => void;
  taskName?: string;
}

export function AssignOwnerModal({ isOpen, onClose, onAssign, taskName }: AssignOwnerModalProps) {
  const [email, setEmail] = useState('');

  const handleAssign = () => {
    if (email.trim()) {
      onAssign(email.trim());
      setEmail(''); // Clear the form
      onClose();
    }
  };

  const handleCancel = () => {
    setEmail(''); // Clear the form on cancel
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email.trim()) {
      handleAssign();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md p-0 bg-white"
        style={{ 
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle 
            style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: '#374151', 
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px'
            }}
          >
            Assign Owner
          </DialogTitle>
          <DialogDescription 
            style={{ 
              fontSize: '14px', 
              fontWeight: 400, 
              color: '#6B7280', 
              fontFamily: 'Inter, sans-serif',
              margin: 0
            }}
          >
            {taskName 
              ? `Assign "${taskName}" to a team member by entering their email address.`
              : 'Assign this task to a team member by entering their email address.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="space-y-4">
            <div>
              <Label 
                htmlFor="assignee-email"
                className="sr-only"
              >
                Assignee Email
              </Label>
              <Input
                id="assignee-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="someone@email.com"
                className="h-12 px-4 border rounded-lg"
                style={{
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#374151'
                }}
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-12 border border-gray-300 text-gray-700 hover:bg-gray-50"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  borderColor: '#E5E7EB',
                  color: '#374151'
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={!email.trim()}
                className="flex-1 h-12 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: email.trim() ? '#005B94' : '#9CA3AF',
                  border: 'none'
                }}
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}