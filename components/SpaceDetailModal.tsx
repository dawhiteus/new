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
  Building2,
  Users,
  Wifi,
  Coffee,
  Car,
  Clock,
  Calendar,
  DollarSign,
  Share2,
  Star,
  FileText,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';

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
  image?: string;
  description?: string;
  termFlexibility?: string;
  minLeaseTerm?: string;
  availability?: string;
}

interface SpaceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
  onAddToShortlist: (space: Space) => void;
  onAttachToDeal: (space: Space) => void;
  isInShortlist?: boolean;
}

const amenityIcons: { [key: string]: any } = {
  'WiFi': Wifi,
  'Conference Rooms': Users,
  'Kitchen': Coffee,
  'Parking': Car,
  '24/7 Access': Clock,
  'Reception': Building2,
  'Lounge': Coffee,
  'Event Space': Users,
  'Wellness Room': Users,
};

export function SpaceDetailModal({ 
  isOpen, 
  onClose, 
  space, 
  onAddToShortlist, 
  onAttachToDeal,
  isInShortlist = false 
}: SpaceDetailModalProps) {
  if (!space) return null;

  const IconComponent = amenityIcons[space.amenities[0]] || Building2;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogDescription className="sr-only">
          Detailed information about workspace including pricing, amenities, lease terms, and location
        </DialogDescription>
        
        {/* Header */}
        <DialogHeader className="px-6 py-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#005B94' }}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-white mb-2" style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                {space.name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  className="bg-white/20 text-white px-3 py-1 rounded-full"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  {space.operator}
                </Badge>
              </div>
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

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {/* Image */}
          <div 
            className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center"
            style={{ backgroundColor: '#E3F2FD' }}
          >
            <Building2 className="h-24 w-24" style={{ color: '#005B94', opacity: 0.3 }} />
          </div>

          <div className="p-6 space-y-6">
            {/* Key Details Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2" style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    <DollarSign className="h-4 w-4" />
                    PRICE
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                    ${space.price.toLocaleString()}
                    <span style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>/mo</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
                    ${(space.price / space.size).toFixed(2)}/sq ft
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2" style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    <Building2 className="h-4 w-4" />
                    SIZE
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    {space.size.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
                    square feet
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2" style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    <MapPin className="h-4 w-4" />
                    LOCATION
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    {space.location}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
                    {space.city}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                Description
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                {space.description || `Professional ${space.workspaceType.toLowerCase()} space in ${space.location}, ${space.city}. This modern workspace offers ${space.size.toLocaleString()} square feet of flexible office space with premium amenities and convenient access to local transportation and dining options.`}
              </p>
            </div>

            {/* Workspace Type */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                Workspace Type
              </h3>
              <Badge 
                style={{ backgroundColor: '#005B94', color: 'white', fontSize: '14px', fontWeight: 500 }}
                className="px-4 py-2 rounded-full"
              >
                {space.workspaceType}
              </Badge>
            </div>

            {/* Amenities */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {space.amenities.map((amenity, idx) => {
                  const Icon = amenityIcons[amenity] || Building2;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                      <Icon className="h-5 w-5" style={{ color: '#005B94' }} />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Term Details */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                Lease Terms
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 mt-1" style={{ color: '#005B94' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Minimum Term
                    </div>
                    <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      {space.minLeaseTerm || '12 months'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-1" style={{ color: '#005B94' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Flexibility
                    </div>
                    <div style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                      {space.termFlexibility || 'Month-to-month after initial term'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                Location Map
              </h3>
              <div 
                className="w-full h-64 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#F8F9FA', border: '1px solid #E5E7EB' }}
              >
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-3" style={{ color: '#005B94', opacity: 0.4 }} />
                  <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    Map: {space.location}, {space.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                Availability
              </h3>
              <div className="flex items-center gap-2 p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28A745' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#166534', fontFamily: 'Inter, sans-serif' }}>
                  {space.availability || 'Available for immediate move-in'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-4 flex items-center justify-between" style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}>
          <Button
            variant="outline"
            className="border-gray-300"
            style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share with Client
          </Button>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onAddToShortlist(space)}
              disabled={isInShortlist}
              variant="outline"
              className="border-gray-300"
              style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              {isInShortlist ? (
                <>
                  <Star className="h-4 w-4 mr-2 fill-current" style={{ color: '#FFA500' }} />
                  In Shortlist
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Add to Shortlist
                </>
              )}
            </Button>
            <Button
              onClick={() => onAttachToDeal(space)}
              className="text-white"
              style={{ 
                backgroundColor: '#005B94',
                fontSize: '14px', 
                fontWeight: 500, 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Attach to Deal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}