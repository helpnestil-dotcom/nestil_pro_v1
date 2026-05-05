import { Metadata } from 'next';
import PropertyListingPage from './listing/PropertyListing';

export const metadata: Metadata = {
  title: 'Verified Properties for Rent & Sale | Zero Brokerage | Nestil',
  description: 'Explore thousands of verified direct-owner properties in Bangalore, Hyderabad, Vijayawada, and Chennai. Filter by BHK, budget, and location.',
  keywords: 'flats for rent Bangalore, apartments for sale Hyderabad, direct owner properties AP, real estate Chennai, Nestil properties',
};

export default function Page() {
  return <PropertyListingPage />;
}
