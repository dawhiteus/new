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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Check } from 'lucide-react';
import { X } from 'lucide-react';

interface PlaybookEntry {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'link' | 'checklist' | 'video' | 'calendar';
  tags: string[];
  lastUpdated: string;
  createdBy: {
    name: string;
    initials: string;
  };
  isPinned?: boolean;
  content?: string;
  externalUrl?: string;
  comments?: number;
  views?: number;
}

interface AddToDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  playbookEntry: PlaybookEntry;
}

const availableDeals = [
  { id: '1', name: 'Tel Tech NYC Expansion', broker: 'Sarah Chen', stage: 'Negotiation' },
  { id: '2', name: 'Global Finance Boston Hub', broker: 'Sarah Chen', stage: 'Proposal' },
  { id: '3', name: 'Tech Ventures SF Office', broker: 'Michael Torres', stage: 'Discovery' },
  { id: '4', name: 'Retail Corp Chicago Space', broker: 'Michael Torres', stage: 'Closed Won' },
  { id: '5', name: 'StartupX Austin HQ', broker: 'Sarah Chen', stage: 'Qualification' },
];

export function AddToDealModal({
  isOpen,
  onClose,
  playbookEntry,
}: AddToDealModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);

  const filteredDeals = availableDeals.filter((deal) =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.broker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDeal = (dealId: string) => {
    if (selectedDeals.includes(dealId)) {
      setSelectedDeals(selectedDeals.filter((id) => id !== dealId));
    } else {
      setSelectedDeals([...selectedDeals, dealId]);
    }
  };

  const handleSubmit = () => {
    // Handle adding entry to selected deals
    console.log('Adding entry to deals:', selectedDeals);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle
                className="text-white"
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.3',
                }}
              >
                Add to Deal
              </DialogTitle>
              <DialogDescription
                className="text-white/90 mt-1"
                style={{
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Associate "{playbookEntry.title}" with one or more deals
              </DialogDescription>
            </div>
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

        <div className="space-y-4 p-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {/* Deal List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredDeals.map((deal) => {
              const isSelected = selectedDeals.includes(deal.id);
              return (
                <button
                  key={deal.id}
                  onClick={() => toggleDeal(deal.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex-1 text-left">
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {deal.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {deal.broker}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        •
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {deal.stage}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className="flex items-center justify-center h-6 w-6 rounded-full"
                      style={{ backgroundColor: '#005B94' }}
                    >
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredDeals.length === 0 && (
            <div className="text-center py-8">
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                No deals found
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p
            style={{
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {selectedDeals.length} {selectedDeals.length === 1 ? 'deal' : 'deals'} selected
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300"
              style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedDeals.length === 0}
              className="text-white"
              style={{
                backgroundColor: '#005B94',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Add to {selectedDeals.length} {selectedDeals.length === 1 ? 'Deal' : 'Deals'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}