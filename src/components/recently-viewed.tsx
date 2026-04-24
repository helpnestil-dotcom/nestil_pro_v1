
'use client';

import React from 'react';
import { useEngagement } from '@/hooks/use-engagement';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, documentId } from 'firebase/firestore';
import { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property-card';
import { History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function RecentlyViewed() {
    const { recentlyViewed } = useEngagement();
    const firestore = useFirestore();

    const rvQuery = useMemoFirebase(() => {
        if (!firestore || recentlyViewed.length === 0) return null;
        return query(
            collection(firestore, 'properties'),
            where(documentId(), 'in', recentlyViewed)
        );
    }, [firestore, recentlyViewed]);

    const { data: properties, isLoading } = useCollection<Property>(rvQuery);

    if (recentlyViewed.length === 0 || (!properties && !isLoading)) return null;

    return (
        <section className="py-20 bg-white">
            <div className="container">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <History className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pick Up Where You Left Off</h2>
                        <p className="text-slate-500 font-medium">Your recently viewed properties</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {isLoading ? (
                        [...Array(4)].map((_, i) => <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-2xl" />)
                    ) : (
                        properties?.map((prop) => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
