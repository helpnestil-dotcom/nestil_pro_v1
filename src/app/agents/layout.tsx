import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verified Real Estate Agents | Nestil Property Experts',
  description: 'Connect with vetted, expert real estate agents on Nestil. Browse verified agents by location across Bangalore, Hyderabad, Vijayawada and more.',
  keywords: 'real estate agents Bangalore, verified property agents India, Nestil agents, property brokers Hyderabad',
  openGraph: {
    title: 'Verified Real Estate Agents | Nestil',
    description: 'Browse expert real estate agents vetted by Nestil across India.',
    url: 'https://www.nestil.in/agents',
    siteName: 'Nestil',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.nestil.in/agents',
  },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
