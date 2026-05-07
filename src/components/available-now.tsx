'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { MobilePropertyCard } from './mobile-property-card';
import { Property } from '@/lib/types';
import { IndianRupee, Zap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export function AvailableNow() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');

  const getQuery = () => {
    let q = query(
      collection(db, 'properties'),
      where('listingStatus', '==', 'approved')
    );
    
    if (city) {
      q = query(q, where('city', '==', city));
    }
    
    // Limiting to 20 to ensure performance while allowing local filtering/sorting
    q = query(q, limit(20));
    return q;
  };

  const [value, loading, error] = useCollection(getQuery());

  const properties = value?.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Property))
    .sort((a, b) => {
      const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
      const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-100 text-orange-600 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight italic">Available Now</h2>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-8">Freshly posted homes</p>
        </div>
        <Button variant="ghost" asChild className="text-primary font-black text-[11px] p-0 h-auto uppercase tracking-tighter hover:bg-transparent">
          <Link href="/properties">Explore All</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-2">
        {loading ? (
            [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-full h-[300px] rounded-2xl" />
            ))
        ) : properties.length > 0 ? (
            properties.map((p) => (
                <MobilePropertyCard key={p.id} property={p} />
            ))
        ) : (
            <div className="py-10 text-center w-full text-slate-400 text-xs font-bold">
                No properties available right now.
            </div>
        )}
      </div>
    </div>
  );
}
