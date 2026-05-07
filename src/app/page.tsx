import { Metadata } from 'next';
import HomeClient from './home-client';
import { FeaturedProperties } from '@/components/featured-properties';

export const metadata: Metadata = {
  title: 'Nestil | Zero Brokerage Property Platform',
  description: 'Search, buy, and rent verified properties directly from owners with zero brokerage.',
};

export default function Home() {
  return <HomeClient featuredProperties={<FeaturedProperties />} />;
}
