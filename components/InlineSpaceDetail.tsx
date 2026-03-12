import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  MapPin,
  Building2,
  DollarSign,
  Star,
  Share2,
  FileText,
  Calendar,
  Clock,
  Wifi,
  Users,
  Coffee,
  Car,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface InlineSpaceDetailProps {
  space: Space;
  onBack: () => void;
  onAddToShortlist: (space: Space) => void;
  onAttachToDeal: (space: Space) => void;
  isInShortlist: boolean;
}

const amenityIcons: { [key: string]: any} = {
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

// Helper function to get office images based on space ID
const getSpaceImages = (spaceId: string) => {
  const imageMap: { [key: string]: string[] } = {
    '1': [
      'https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyOTU1MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1548610325-a4e09766d5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb3dvcmtpbmclMjBzcGFjZXxlbnwxfHx8fDE3NjMwMjkyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1703355685952-03ed19f70f51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBjb25mZXJlbmNlJTIwcm9vbXxlbnwxfHx8fDE3NjMwNjk3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    '2': [
      'https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjByZWNlcHRpb24lMjBsb2JieXxlbnwxfHx8fDE3NjMwNjk3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1686100509061-f05807314c38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI5NDcxMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1622126977176-bf029dbf6ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG9mZmljZSUyMGRlc2t8ZW58MXx8fHwxNjMwNjk3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
    '3': [
      'https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwb2ZmaWNlJTIwcm9vbXxlbnwxfHx8fDE3NjMwNjk3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1700727448548-adbdbd12fb39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBsb3VuZ2UlMjBhcmVhfGVufDF8fHx8MTc2MzA2OTc4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjBvZmZpY2UlMjBzcGFjZXxlbnwxfHx8fDE3NjMwNjk3Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
  };
  
  // Return images for the specific space, or use default images
  return imageMap[spaceId] || [
    'https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyOTU1MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1548610325-a4e09766d5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb3dvcmtpbmclMjBzcGFjZXxlbnwxfHx8fDE3NjMwMjkyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1686100509061-f05807314c38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI5NDcxMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];
};

export function InlineSpaceDetail({
  space,
  onBack,
  onAddToShortlist,
  onAttachToDeal,
  isInShortlist,
}: InlineSpaceDetailProps) {
  const spaceImages = getSpaceImages(space.id);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  return (
    <div>
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-4 -ml-2"
        style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Results
      </Button>

      {/* Header */}
      <Card className="bg-white border mb-4" style={{ borderColor: '#E5E7EB' }}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  {space.name}
                </h2>
                <Badge
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  {space.operator}
                </Badge>
              </div>
              <div className="flex items-center gap-2" style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                <MapPin className="h-4 w-4" />
                {space.location}, {space.city}
              </div>
            </div>
          </div>

          {/* Office Images Gallery */}
          <div className="mb-6">
            <div className="w-full h-96 rounded-lg overflow-hidden mb-3">
              <ImageWithFallback
                src={spaceImages[currentImageIndex]}
                alt={`${space.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Image Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {spaceImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? 'border-primary' : 'border-gray-200'
                  }`}
                  style={{
                    borderColor: currentImageIndex === idx ? '#005B94' : '#E5E7EB'
                  }}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${space.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-50 border" style={{ borderColor: '#E5E7EB' }}>
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

            <Card className="bg-gray-50 border" style={{ borderColor: '#E5E7EB' }}>
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

            <Card className="bg-gray-50 border" style={{ borderColor: '#E5E7EB' }}>
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
          <div className="mb-6">
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
              Description
            </h3>
            <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
              {space.description || `Professional ${space.workspaceType.toLowerCase()} space in ${space.location}, ${space.city}. This modern workspace offers ${space.size.toLocaleString()} square feet of flexible office space with premium amenities and convenient access to local transportation and dining options.`}
            </p>
          </div>

          {/* Workspace Type */}
          <div className="mb-6">
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
          <div className="mb-6">
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

          {/* Lease Terms */}
          <div className="mb-6">
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
          <div className="mb-6">
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
          <div className="mb-6">
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

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
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
        </CardContent>
      </Card>
    </div>
  );
}