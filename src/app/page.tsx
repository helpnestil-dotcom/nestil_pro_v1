import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'Nestil | Zero Brokerage Property Platform',
  description: 'Search, buy, and rent verified properties directly from owners with zero brokerage. Find flats, houses, PG, and roommates in Bangalore, Hyderabad, and more.',
  keywords: 'zero brokerage flats, direct owner properties, rent house Bangalore, buy flat Hyderabad, Nestil properties, co-living spaces',
  openGraph: {
    title: 'Nestil - India\'s Smartest Property Marketplace',
    description: 'Find verified properties with zero brokerage. Rent, buy, or find a roommate in minutes.',
    images: ['https://www.nestil.in/og-home.png'],
  },
};

export default function Home() {
  return <HomeClient />;
}
