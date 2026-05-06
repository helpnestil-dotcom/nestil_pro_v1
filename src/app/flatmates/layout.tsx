import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Flatmates & Co-Living Spaces | Nestil',
  description: 'Find trusted flatmates and co-living spaces in Bangalore, Hyderabad and across India. Post your flatmate requirement or browse active profiles on Nestil.',
  keywords: 'find flatmate Bangalore, co-living spaces India, flatmate requirements, roommate search Hyderabad, Nestil flatmates',
  openGraph: {
    title: 'Find Flatmates & Co-Living Spaces | Nestil',
    description: 'Connect with verified flatmates looking to share apartments across India.',
    url: 'https://www.nestil.in/flatmates',
    siteName: 'Nestil',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.nestil.in/flatmates',
  },
};

export default function FlatmatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
