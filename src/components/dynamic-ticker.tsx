'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

const FALLBACK_CITIES = ['Bangalore', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kakinada', 'Rajahmundry'];

export function DynamicTicker() {
    const [cities, setCities] = useState<string[]>(FALLBACK_CITIES);

    useEffect(() => {
        async function fetchCities() {
            try {
                const propertiesCol = collection(db, 'properties');
                const q = query(
                    propertiesCol, 
                    where('listingStatus', '==', 'approved'),
                    limit(100)
                );
                
                const snapshot = await getDocs(q);
                const fetchedCities = snapshot.docs.map(doc => doc.data().city);
                
                const uniqueCities = Array.from(new Set(fetchedCities))
                    .filter((city): city is string => typeof city === 'string' && city.length > 0)
                    .sort();

                if (uniqueCities.length > 0) {
                    setCities(uniqueCities);
                }
            } catch (error) {
                console.error("Error fetching cities for ticker:", error);
            }
        }
        fetchCities();
    }, []);
    
    // Duplicate the list to ensure smooth continuous scrolling
    const scrollCities = [...cities, ...cities, ...cities];

    return (
        <div className="bg-white border-y border-slate-200">
            <div className="container flex items-center gap-6 py-3">
                <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-primary whitespace-nowrap flex-shrink-0 flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    All Cities
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="flex gap-7 animate-ticker whitespace-nowrap">
                        {scrollCities.map((city, i) => (
                            <span key={i} className="text-sm text-slate-500 flex items-center gap-2.5 after:content-['◆'] after:text-slate-200 after:text-[8px]">
                                {city}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

