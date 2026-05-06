import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Requirements & Demand Feed | Nestil',
  description: 'Browse active buyer and renter requirements on Nestil. Post your property need and get matched with verified listings in Bangalore, Hyderabad, and across India.',
  keywords: 'property requirements India, buy home demand, rent flat Bangalore, property demand feed, Nestil requirements',
  openGraph: {
    title: 'Property Requirements & Demand Feed | Nestil',
    description: 'Post your property requirement and get matched instantly on Nestil.',
    url: 'https://www.nestil.in/requirements',
    siteName: 'Nestil',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.nestil.in/requirements',
  },
};

export default function RequirementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
