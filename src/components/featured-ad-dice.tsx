
'use client';

import React, { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property-card';
import { Loader2, Sparkles, MapPin, Calendar, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function FeaturedAdDice() {
    const firestore = useFirestore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const adsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const now = Timestamp.now();
        return query(
            collection(firestore, 'properties'),
            where('adStatus', '==', 'approved'),
            where('adExpiry', '>', now),
            orderBy('adExpiry', 'desc'),
            limit(10)
        );
    }, [firestore]);

    const { data: ads, isLoading } = useCollection<Property>(adsQuery);

    useEffect(() => {
        if (ads && ads.length > 1) {
            const interval = setInterval(() => {
                setIsFlipping(true);
                setTimeout(() => {
                    setCurrentIndex((prev) => (prev + 1) % ads.length);
                    setIsFlipping(false);
                }, 600); // Animation duration
            }, 5000); // Swap every 5 seconds
            return () => clearInterval(interval);
        }
    }, [ads]);

    if (isLoading) return null;
    if (!ads || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    return (
        <section className="py-12 bg-slate-900 overflow-hidden relative border-y border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,56,87,0.08),transparent_50%)] pointer-events-none"></div>
            
            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left Side: Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                            <Sparkles className="w-3 h-3" /> Exclusive Ads
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Premium Properties <br />
                            <span className="text-primary italic">Live for 24 Hours.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            These hand-picked listings are promoted by Nestil for maximum visibility. Fast-track your search with our top-tier recommendations.
                        </p>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-xs font-semibold">Updated Daily</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-xs font-semibold">Across {currentAd.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: The Dice */}
                    <div className="lg:w-[400px] w-full flex justify-center perspective-[1000px]">
                        <div className={cn(
                            "relative w-full max-w-[340px] transition-all duration-700 ease-in-out transform-gpu",
                            isFlipping ? "rotate-y-[180deg] opacity-0 scale-90" : "rotate-y-0 opacity-100 scale-100"
                        )} style={{ transformStyle: 'preserve-3d' }}>
                            
                            {/* The Ad Card */}
                            <div className="relative group cursor-pointer">
                                {/* Decorative Glow */}
                                <div className="absolute -inset-4 bg-primary/20 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
                                    {/* Ad Badge */}
                                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live Ad</span>
                                    </div>
                                    
                                    <div className="aspect-[4/5] relative">
                                        <img 
                                            src={currentAd.photos?.[0] || 'https://placehold.co/600x800'} 
                                            className="absolute inset-0 w-full h-full object-cover"
                                            alt={currentAd.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                        
                                        {/* Property Info Overlay */}
                                        <div className="absolute bottom-0 inset-x-0 p-8 text-white">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge className="bg-primary text-white border-0 text-[10px] h-5">⭐ Featured</Badge>
                                                <span className="text-xs font-medium text-white/70">{currentAd.bhk} • {currentAd.city}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-1 truncate">{currentAd.title}</h3>
                                            <p className="text-white/60 text-sm mb-4 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {currentAd.address}
                                            </p>
                                            
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Starting from</div>
                                                    <div className="text-2xl font-black text-primary">₹{currentAd.price.toLocaleString('en-IN')}</div>
                                                </div>
                                                <Button size="icon" className="bg-white hover:bg-slate-100 text-black rounded-full h-12 w-12 shadow-lg" asChild>
                                                    <Link href={`/properties/${currentAd.id}`}>
                                                        <ExternalLink className="w-5 h-5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scrolling City Ticker (Subtle Background) */}
            <div className="mt-16 py-6 border-t border-white/5 bg-black/20 backdrop-blur-sm whitespace-nowrap overflow-hidden flex gap-8">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-12 animate-marquee items-center opacity-30">
                        {ads.map(ad => (
                            <div key={ad.id} className="flex items-center gap-3">
                                <span className="text-lg font-black text-white uppercase italic tracking-tighter">{ad.city}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span className="text-sm font-bold text-slate-500 uppercase">Premium Ad</span>
                                <div className="w-12 h-px bg-white/10"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", className)}>
            {children}
        </span>
    );
}
