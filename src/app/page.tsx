import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { HeroSection } from '@/components/hero-section';
import { FeaturedProperties } from '@/components/featured-properties';
import { PropertyCardSkeleton } from '@/components/property-card';

export const metadata: Metadata = {
  title: 'Nestil | Buy, Rent & Sell Properties in Andhra Pradesh',
  description: 'Find your dream home in AP instantly. Browse over 12,400+ verified flats, independent houses, plots, and commercial properties across all 26 districts of Andhra Pradesh.',
  keywords: 'properties in Andhra Pradesh, real estate AP, buy flat in Vijayawada, rent house in Visakhapatnam, property portal AP, Nestil',
  openGraph: {
    title: 'Nestil | AP\'s #1 Property Platform',
    description: 'Find verified properties across all 26 districts of Andhra Pradesh.',
    url: 'https://www.nestil.in',
    siteName: 'Nestil',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Ticker = () => (
    <div className="bg-white border-y border-slate-200">
        <div className="container flex items-center gap-6 py-3">
            <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-primary whitespace-nowrap flex-shrink-0 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span></span>
                All Cities
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex gap-7 animate-ticker whitespace-nowrap">
                    {['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Eluru', 'Ongole', 'Anantapur', 'Kadapa', 'Nandyal', 'Srikakulam', 'Vizianagaram', 'Proddutur'].concat(...['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kurnool', 'Kakinada', 'Rajahmundry', 'Eluru', 'Ongole', 'Anantapur', 'Kadapa', 'Nandyal', 'Srikakulam', 'Vizianagaram', 'Proddutur']).map((city, i) => (
                        <span key={i} className="text-sm text-slate-500 flex items-center gap-2.5 after:content-['◆'] after:text-slate-200 after:text-[8px]">{city}</span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CtaBand = () => (
    <div className="py-20">
        <div className="container rounded-2xl p-10 md:p-16 bg-gradient-to-r from-blue-50 to-emerald-50 border border-primary/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-primary/5 pointer-events-none"></div>
            <div className="absolute bottom-[-60px] left-[20%] w-72 h-72 rounded-full bg-emerald-500/5 pointer-events-none"></div>
            <h2 className="font-bold text-3xl md:text-4xl leading-tight text-slate-800 max-w-lg text-center lg:text-left relative z-10">Ready to List Your <span className="glow-text">Property</span> on Nestil?</h2>
            <div className="flex gap-3 flex-shrink-0 relative z-10">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-[#6366F1] text-white font-bold text-base rounded-xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20 transition-all">
                    <Link href="/post-property">List for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-white/50 border-slate-300 text-slate-600 font-semibold text-base rounded-xl hover:border-primary hover:text-primary">
                    <a href="https://wa.me/919492060040" target="_blank" rel="noopener noreferrer">Talk to Us</a>
                </Button>
            </div>
        </div>
    </div>
);

function FeaturedPropertiesSkeleton() {
  return (
    <section className="py-16 md:py-24">
        <div className="container">
             <div className="flex flex-col text-center md:flex-row md:text-left items-center md:items-end justify-between mb-12 gap-y-4">
                <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold tracking-widest uppercase text-primary mb-4">
                        <span className="w-5 h-0.5 bg-primary rounded-full"></span>Featured Listings
                    </div>
                    <h2 className="font-bold text-3xl md:text-4xl leading-tight tracking-tight text-slate-800">
                       Verified Properties<br/>Hand-Picked for <span className="text-primary">You</span>
                    </h2>
                </div>
                <Button variant="outline" asChild className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary gap-1.5 hover:gap-2.5 transition-all md:shrink-0">
                    <Link href="/properties">Browse All →</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)}
            </div>
        </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <Ticker />
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedProperties />
      </Suspense>
      <CtaBand />
    </>
  )
}
