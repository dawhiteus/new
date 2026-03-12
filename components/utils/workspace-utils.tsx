import React from 'react';
import { Star } from 'lucide-react';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export const renderStars = (rating: number): React.ReactElement[] => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-3 w-3 ${
        index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ));
};