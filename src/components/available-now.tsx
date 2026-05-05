'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { MobilePropertyCard } from './mobile-property-card';
import { Property } from '@/lib/types';
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
    
    // Removing limit(6) to avoid requiring a composite index in Firebase
    return q;
  };

  const [value, loading, error] = useCollection(getQuery());

  const properties = value?.docs.slice(0, 6).map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Property)) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-base font-bold text-slate-900">Available Now</h2>
        </div>
        <Button variant="link" asChild className="text-primary font-bold text-xs p-0 h-auto">
          <Link href="/properties">View all</Link>
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
