
'use client';

import React, { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Property } from '@/lib/types';
import { Loader2, Sparkles, MapPin, Calendar, ExternalLink, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function FeaturedAdDice() {
    const firestore = useFirestore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

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
                setDirection(1);
                setCurrentIndex((prev) => (prev + 1) % ads.length);
            }, 6000); 
            return () => clearInterval(interval);
        }
    }, [ads]);

    if (isLoading) return null;
    if (!ads || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    const variants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
            scale: 0.8,
            x: direction > 0 ? 100 : -100,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
        exit: (direction: number) => ({
            rotateY: direction > 0 ? -90 : 90,
            opacity: 0,
            scale: 0.8,
            x: direction > 0 ? -100 : 100,
            transition: {
                duration: 0.6
            }
        })
    };

    return (
        <section className="py-20 bg-[#0a0c10] overflow-hidden relative border-y border-white/5">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" 
                />
            </div>
            
            <div className="container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left Side: Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                            <Sparkles className="w-3.5 h-3.5" /> Premium Spotlights
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight"
                        >
                            Elite Listings <br />
                            <span className="bg-gradient-to-r from-primary via-[#ff6b8b] to-primary bg-clip-text text-transparent italic">Verified & Promoted.</span>
                        </motion.h2>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                        >
                            Our most prestigious properties, hand-picked for discerning seekers. Experience maximum visibility for the next 24 hours.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-6"
                        >
                            <div className="flex items-center gap-3 text-slate-300 group">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rotates</span>
                                    <span className="text-sm font-bold">Every 24 Hours</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300 group">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                    <Star className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
                                    <span className="text-sm font-bold">Priority Verified</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: The 3D Dice Card */}
                    <div className="lg:w-[450px] w-full flex justify-center perspective-[2000px]">
                        <div className="relative w-full max-w-[380px] aspect-[4/5]">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentAd.id}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0 transform-gpu"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* The Ad Card */}
                                    <div className="relative h-full w-full group cursor-pointer">
                                        {/* Premium Glow Effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-br from-primary to-blue-600 rounded-[32px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                        
                                        <div className="relative h-full w-full bg-slate-900 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5">
                                            {/* Top Overlay Badges */}
                                            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/10">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Active Ad</span>
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                </div>
                                            </div>
                                            
                                            <div className="h-full w-full relative">
                                                <img 
                                                    src={currentAd.photos?.[0] || 'https://placehold.co/600x800'} 
                                                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                                    alt={currentAd.title}
                                                />
                                                {/* Gradient Overlays */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent opacity-90"></div>
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
                                                
                                                {/* Property Info Overlay */}
                                                <div className="absolute bottom-0 inset-x-0 p-8 text-white">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="px-2.5 py-1 bg-primary rounded-lg text-[10px] font-black uppercase tracking-tighter">Premium</span>
                                                        <span className="text-xs font-bold text-white/80 flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5 text-primary" /> {currentAd.city}
                                                        </span>
                                                    </div>
                                                    
                                                    <h3 className="text-3xl font-black mb-2 leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                                                        {currentAd.title}
                                                    </h3>
                                                    
                                                    <p className="text-white/60 text-sm mb-8 font-medium line-clamp-1">
                                                        {currentAd.address}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                                        <div>
                                                            <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Exclusive Price</div>
                                                            <div className="text-3xl font-black text-white flex items-baseline gap-1">
                                                                <span className="text-primary text-xl italic font-bold">₹</span>
                                                                {currentAd.price.toLocaleString('en-IN')}
                                                            </div>
                                                        </div>
                                                        <Link href={`/properties/${currentAd.id}`}>
                                                            <Button className="bg-white hover:bg-primary hover:text-white text-black rounded-2xl h-14 w-14 shadow-xl transition-all duration-300 group/btn">
                                                                <ArrowRight className="w-6 h-6 transform group-hover/btn:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>

            {/* Premium City Ticker */}
            <div className="mt-20 py-8 border-t border-white/5 bg-white/[0.02] backdrop-blur-md relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-transparent to-[#0a0c10] z-10 pointer-events-none" />
                <div className="whitespace-nowrap flex overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <motion.div 
                            key={i} 
                            animate={{ x: [0, -100 + "%"] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="flex gap-16 items-center px-8"
                        >
                            {ads.map(ad => (
                                <div key={ad.id} className="flex items-center gap-6 group">
                                    <span className="text-xl font-black text-white/20 group-hover:text-primary/50 transition-colors uppercase tracking-tighter italic">
                                        {ad.city}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-primary transition-colors" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                                        Spotlight
                                    </span>
                                    <div className="w-16 h-px bg-white/5" />
                                </div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
