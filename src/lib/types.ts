
import { Timestamp } from 'firebase/firestore';

// This type is used for PDF generation
export type PropertyOwner = {
  id?: string;
  name: string;
  phone: string;
  isAgent: boolean;
  verified: boolean;
  whatsAppAvailable?: boolean;
};

export type Property = {
  id: string;
  title: string;
  propertyType: string;
  price: number;
  priceOnRequest?: boolean;
  areaSqFt: number;
  address: string;
  subLocality?: string;
  city: string;
  pincode: string;
  description: string;
  photos: string[];
  amenities: string[];
  nonVegAllowed?: boolean;
  vehicleParking?: string;
  nearbyPlaces: {
    name: string;
    distance: string;
  }[];
  beds: number;
  baths: number;
  bhk?: string;
  furnishing?: 'Furnished' | 'Semi-furnished' | 'Unfurnished';
  featured: boolean;
  listingStatus: 'approved' | 'pending' | 'rejected' | 'rented' | 'sold' | 'archived';
  dateAdded: string;
  isNew?: boolean;
  isUrgent?: boolean;
  isAvailableAnytime?: boolean;
  visitAvailability?: { day: string; from: string; to: string }[];

  // Fields from form that were missing
  ownerId: string;
  postedByType: 'Owner' | 'Agent' | 'Builder';
  listingFor: 'Rent' | 'Sale' | 'Lease' | 'PG';
  constructionStatus?: 'Ready to Move' | 'Under Construction';
  rentalStatus?: 'Available' | 'Vacating Soon' | 'Upcoming';
  negotiable?: boolean;
  maintenance?: number;
  deposit?: number;
  availableFrom?: string | null;
  preferredTenants?: 'Family' | 'Bachelor' | 'Anyone';
  isApproved: boolean;
  floor?: string;
  totalFloors?: string;
  facing?: string;
  age?: string;
  plotArea?: number;
  roadWidth?: number;
  dtcpApproved?: boolean;
  postedAt: Timestamp | string; // Can be Timestamp from Firestore or string when serialized
  updatedAt: Timestamp | string; // Can be Timestamp from Firestore or string when serialized
  googleMapsLink?: string;
  isPaid?: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateJoined: string;
  role: 'Owner' | 'Agent' | 'Builder' | 'Visitor';
  listings: number;
};

    
