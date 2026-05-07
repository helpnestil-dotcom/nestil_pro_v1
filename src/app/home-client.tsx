'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Zap } from 'lucide-react';

import { HeroSection } from '@/components/hero-section';
import { FeaturedProperties } from '@/components/featured-properties';
import { PropertyCardSkeleton } from '@/components/property-card';
import { FlatmateSection } from '@/components/flatmate-section';
import { DynamicTicker } from '@/components/dynamic-ticker';
import { RecentlyViewed } from '@/components/recently-viewed';

// Mobile Components
import { MobileHeader } from '@/components/mobile-header';
import { CategoryCards } from '@/components/category-cards';
import { QuickFilters } from '@/components/quick-filters';
import { AvailableNow } from '@/components/available-now';
import { PromoBanners } from '@/components/promo-banners';
import { WhyNestil } from '@/components/why-nestil';

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

export default function HomeClient() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 'md' breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="bg-white min-h-screen">
        <Suspense fallback={<div className="h-20 bg-white" />}>
          <MobileHeader />
        </Suspense>
        
        {/* Onboarding Entry Banner */}
        <div className="px-5 mb-6">
          <Link href="/onboarding">
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-5 flex items-center justify-between shadow-xl shadow-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-2">
                   <Zap className="w-4 h-4 text-white fill-white" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/80">New Feature</span>
                </div>
                <h3 className="text-xl font-black text-white leading-tight">Find Your Perfect<br/>Stay in 60 Seconds</h3>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 text-white font-bold text-sm border border-white/30 relative z-10">
                Start Now
              </div>
            </div>
          </Link>
        </div>

        <CategoryCards />
        
        <AvailableNow />

        <div className="px-5 mb-10">
           <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Verified Listings</h2>
              <Link href="/properties" className="text-primary font-bold text-sm">See all</Link>
           </div>
           <FeaturedProperties />
        </div>

        <PromoBanners />

        <div className="px-5 mb-10">
           <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Relocation Made Easy</h2>
              <Link href="/shift-home" className="text-primary font-bold text-sm">Book now</Link>
           </div>
           <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">📦</div>
              <div>
                 <h3 className="font-bold text-slate-800">Packers & Movers</h3>
                 <p className="text-xs text-slate-500 font-medium">Safe & secure shifting starting @ ₹2,999</p>
              </div>
           </div>
        </div>

        <WhyNestil />
        
        <div className="h-24" /> {/* Spacer for BottomNav */}
      </div>
    );
  }

  return (
    <div className="bg-white">
      <HeroSection />
      <FeaturedProperties />
      <DynamicTicker />
      <FlatmateSection />
      <RecentlyViewed />
      <CtaBand />
    </div>
  );
}
