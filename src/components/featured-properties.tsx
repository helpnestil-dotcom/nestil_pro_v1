'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, limit, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';
import { PropertyCard, PropertyCardSkeleton } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FeaturedProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProperties() {
            try {
                const propertiesCol = collection(db, 'properties');
                const q = query(
                    propertiesCol, 
                    where('listingStatus', '==', 'approved'),
                    orderBy('dateAdded', 'desc'), 
                    limit(24)
                );
                
                const snapshot = await getDocs(q);
                const pool = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        // Handle date fields safely
                        dateAdded: data.dateAdded || new Date().toISOString(),
                    } as Property;
                });

                if (pool.length > 0) {
                    // Shuffle the pool to provide a dynamic "First Impression" on every refresh
                    const shuffled = [...pool].sort(() => Math.random() - 0.5);
                    
                    // Prioritize "Featured" ones but keep it mixed
                    const featured = shuffled.filter(p => p.featured);
                    const nonFeatured = shuffled.filter(p => !p.featured);
                    
                    setProperties([...featured, ...nonFeatured].slice(0, 8));
                }
            } catch (error) {
                console.error("Error fetching featured properties:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProperties();
    }, []);

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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => <PropertyCardSkeleton key={i} />)
                    ) : properties && properties.length > 0 ? (
                        properties.map((prop, index) => <PropertyCard key={prop.id} property={prop} priority={index < 3} />)
                    ) : (
                        <div className="col-span-full text-center py-16 border-dashed border-2 rounded-3xl bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800">No Properties Found</h3>
                            <p className="text-slate-500 mt-2 font-medium">
                                Check back later for new verified listings.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

