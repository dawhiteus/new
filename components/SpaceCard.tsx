import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AlternativeSpace } from './types/workspace-types';
import { formatPrice, renderStars } from './utils/workspace-utils';

interface SpaceCardProps {
  space: AlternativeSpace;
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Card 
      className="bg-white border rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
      style={{ 
        borderColor: '#E5E7EB',
        boxShadow: 'var(--shadow-sm)',
        minWidth: '220px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent className="p-0">
        {/* Space Image */}
        <div 
          className="relative w-full overflow-hidden rounded-t-xl"
          style={{ 
            height: '160px',
            flexShrink: 0 
          }}
        >
          <ImageWithFallback
            src={space.image}
            alt={space.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              className="border-0 text-xs font-medium px-2 py-1 rounded-md"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(4px)'
              }}
            >
              {space.type}
            </Badge>
          </div>
          {/* Capacity Badge (if available) */}
          {space.capacity && (
            <div className="absolute top-3 right-3">
              <Badge 
                className="border-0 text-xs font-medium px-2 py-1 rounded-md"
                style={{ 
                  backgroundColor: '#005B94',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {space.capacity}
              </Badge>
            </div>
          )}
        </div>

        {/* Space Details */}
        <div 
          className="flex-1"
          style={{ 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Name and Rating */}
          <div className="flex items-start justify-between">
            <h3 
              className="font-medium leading-tight flex-1"
              style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#374151',
                fontFamily: 'Inter, sans-serif',
                marginRight: '12px'
              }}
            >
              {space.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              {renderStars(space.rating)}
              <span 
                className="ml-1"
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {space.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: '#6B7280' }} />
            <span 
              style={{
                fontSize: '13px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {space.location}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-auto">
            <span 
              className="font-bold"
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {formatPrice(space.price)}
            </span>
            <span 
              style={{
                fontSize: '12px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              /{space.priceUnit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}