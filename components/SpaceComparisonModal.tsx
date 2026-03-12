import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X,
  MapPin,
  DollarSign,
  Maximize2,
  CheckCircle2,
  Download,
  FileText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface Space {
  id: string;
  name: string;
  operator: string;
  price: number;
  size: number;
  location: string;
  city: string;
  workspaceType: string;
  amenities: string[];
}

interface SpaceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: Space[];
}

// NYC Flex Office Market Baseline: $9/sq ft/month
const NYC_MARKET_BASELINE = 9;

// Calculate $/sq ft for a space
const calculatePricePerSqFt = (space: Space): number => {
  return space.price / space.size;
};

// Calculate market rate comparison based on $/sq ft vs baseline
const calculateMarketRateComparison = (space: Space): number => {
  const pricePerSqFt = calculatePricePerSqFt(space);
  const percentDifference = ((pricePerSqFt - NYC_MARKET_BASELINE) / NYC_MARKET_BASELINE) * 100;
  return Math.round(percentDifference);
};

export function SpaceComparisonModal({ isOpen, onClose, spaces }: SpaceComparisonModalProps) {
  // Limit to first 5 spaces for comparison
  const spacesToCompare = spaces.slice(0, 5);

  // Get all unique amenities
  const allAmenities = Array.from(
    new Set(spacesToCompare.flatMap(space => space.amenities))
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="!max-w-[90vw] !w-[90vw] h-[90vh] flex flex-col p-0 gap-0"
        style={{ maxWidth: '90vw', width: '90vw' }}
      >
        <DialogDescription className="sr-only">
          Side-by-side comparison of workspace options including pricing, size, location, and amenities
        </DialogDescription>
        
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b flex-shrink-0" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white" style={{ fontSize: '22px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              Compare Spaces ({spacesToCompare.length})
            </DialogTitle>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto" style={{ backgroundColor: '#F8F9FA' }}>
          <div className="p-8">
            {/* Space Cards Grid */}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${spacesToCompare.length}, minmax(320px, 1fr))` }}>
              {spacesToCompare.map((space) => (
                <div 
                  key={space.id}
                  className="bg-white rounded-xl transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Space Header */}
                  <div className="px-6 pt-6 pb-5 border-b" style={{ borderColor: '#E5E7EB' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1.3', marginBottom: '4px' }}>
                      {space.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      {space.operator}
                    </p>
                  </div>

                  {/* Monthly Price - Highlighted */}
                  <div className="px-6 py-5 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4" style={{ color: '#005B94' }} />
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        Monthly Price
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#005B94', fontFamily: 'Inter, sans-serif', lineHeight: '1' }}>
                      ${space.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '6px' }}>
                      ${(space.price / space.size).toFixed(2)}/sq ft
                    </div>
                    
                    {/* Market Rate Comparison */}
                    {(() => {
                      const marketDiff = calculateMarketRateComparison(space);
                      const isAboveMarket = marketDiff > 0;
                      const diffColor = isAboveMarket ? '#DC2626' : '#28A745';
                      const Icon = isAboveMarket ? TrendingUp : TrendingDown;
                      return (
                        <div 
                          className="mt-3 pt-3 border-t flex items-center gap-1.5"
                          style={{ borderColor: '#E5E7EB' }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: diffColor }} />
                          <span 
                            style={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              color: diffColor,
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            {Math.abs(marketDiff).toFixed(1)}% {isAboveMarket ? 'above' : 'below'} market
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Details Section */}
                  <div className="px-6 py-5 space-y-5 border-b" style={{ borderColor: '#E5E7EB' }}>
                    {/* Size */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Maximize2 className="h-4 w-4" style={{ color: '#005B94' }} />
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          Size
                        </div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', paddingLeft: '24px' }}>
                        {space.size.toLocaleString()} sq ft
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin className="h-4 w-4" style={{ color: '#005B94' }} />
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          Location
                        </div>
                      </div>
                      <div style={{ paddingLeft: '24px' }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                          {space.location}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                          {space.city}
                        </div>
                      </div>
                    </div>

                    {/* Workspace Type */}
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                        Workspace Type
                      </div>
                      <Badge 
                        style={{ backgroundColor: '#005B94', color: 'white', fontSize: '12px', fontWeight: 500 }}
                        className="px-3 py-1.5 rounded-md"
                      >
                        {space.workspaceType}
                      </Badge>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="px-6 py-5">
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
                      Amenities
                    </div>
                    <div className="space-y-2">
                      {allAmenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          {space.amenities.includes(amenity) ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: '#28A745' }} />
                              <span style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                                {amenity}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: '#E5E7EB' }}></div>
                              <span style={{ fontSize: '14px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', lineHeight: '1.4' }}>
                                {amenity}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t px-8 py-5 flex items-center justify-between flex-shrink-0" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Comparing {spacesToCompare.length} space{spacesToCompare.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
              style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}