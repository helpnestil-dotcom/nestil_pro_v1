import type { Metadata } from 'next';
import ShiftHomeClient from './shift-home-client';

export const metadata: Metadata = {
  title: 'Home Relocation & Shifting Services',
  description: 'Book verified packers and movers for a hassle-free home relocation. Professional shifting services with transparent pricing and safe handling of your belongings.',
  keywords: 'packers and movers Bangalore, home relocation services, house shifting India, verified movers, professional packers',
  openGraph: {
    title: 'Safe & Professional Home Relocation Services | Nestil',
    description: 'Relocating to a new home? Book verified professional movers through Nestil for a stress-free shifting experience.',
    images: ['https://www.nestil.in/relocation-og.png'],
  },
};

export default function ShiftHomePage() {
  return <ShiftHomeClient />;
}
