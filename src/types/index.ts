export interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  category: string;
  tourPrice: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  features: string[];
}

export interface Booking {
  id: number;
  destinationId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}