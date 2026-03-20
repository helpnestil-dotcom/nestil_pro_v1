import { collection, query, where, limit, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getFeaturedProperties(): Promise<Property[]> {
  const propertiesCol = collection(db, 'properties');
  // Fetch a larger pool of recent approved properties to shuffle from
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
          postedAt: data.postedAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString(),
      } as Property;
  });

  if (pool.length === 0) return [];

  // Shuffle the pool to provide a dynamic "First Impression" on every refresh
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  
  // Prioritize "Featured" ones but keep it mixed
  const featured = shuffled.filter(p => p.featured);
  const nonFeatured = shuffled.filter(p => !p.featured);
  
  return [...featured, ...nonFeatured].slice(0, 6);
}


export async function FeaturedProperties() {
    const properties = await getFeaturedProperties();

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
                    {properties && properties.length > 0 ? (
                        properties.map((prop, index) => <PropertyCard key={prop.id} property={prop} priority={index < 3} />)
                    ) : (
                        <div className="col-span-3 text-center py-10 border-dashed border-2 rounded-lg bg-background">
                            <h3 className="text-xl font-semibold">No Properties Found</h3>
                            <p className="text-muted-foreground mt-2">
                                Check back later for new listings.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
