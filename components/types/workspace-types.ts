export interface AlternativeSpace {
  id: string;
  name: string;
  image: string;
  price: number;
  priceUnit: string;
  rating: number;
  location: string;
  type: string;
  capacity?: string;
  address?: string;
  bookingMode?: string;
  amenities?: string[];
  isAvailable?: boolean;
}

export interface AlternativeSpacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  licenseName: string;
  spaces: AlternativeSpace[];
  onViewFullCollection: () => void;
}