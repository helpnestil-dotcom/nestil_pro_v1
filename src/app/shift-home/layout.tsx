import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Shifting Services | Book Packers & Movers | Nestil',
  description: 'Book trusted packers and movers for home shifting in Bangalore and across India. Compare quotes, read reviews, and shift with confidence on Nestil.',
  keywords: 'home shifting Bangalore, packers movers Karnataka, house relocation India, Nestil shift home',
  openGraph: {
    title: 'Home Shifting Services | Nestil Packers & Movers',
    description: 'Book verified packers and movers for home relocation across India with Nestil.',
    url: 'https://www.nestil.in/shift-home',
    siteName: 'Nestil',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.nestil.in/shift-home',
  },
};

export default function ShiftHomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
