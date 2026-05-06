'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Property } from '@/lib/types';

export function useLocationHierarchy() {
  const firestore = useFirestore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      if (!firestore) return;
      try {
        const snapshot = await getDocs(query(collection(firestore, 'properties'), where('listingStatus', '==', 'approved')));
        setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property)));
      } catch (err) {
        console.error("Failed to fetch locations from DB:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [firestore]);

  const hierarchy = useMemo(() => {
    const data: any = {
      states: new Set<string>(),
      citiesByState: {} as Record<string, Set<string>>,
      localitiesByCity: {} as Record<string, Set<string>>,
      nearbyByLocality: {} as Record<string, Set<string>>
    };

    properties
      .filter(p => (p.state === 'Karnataka' || p.city === 'Bangalore') || (!p.state && p.city === 'Bangalore'))
      .forEach(prop => {
      const state = 'Karnataka'; // Force state to Karnataka
      const city = 'Bangalore'; // Force city to Bangalore
      const locality = prop.address || prop.subLocality || '';
      const nearby = prop.nearbyPlaces?.map(p => p.name) || [];

      data.states.add(state);
      
      if (!data.citiesByState[state]) data.citiesByState[state] = new Set();
      data.citiesByState[state].add(city);

      if (!data.localitiesByCity[city]) data.localitiesByCity[city] = new Set();
      if (locality) data.localitiesByCity[city].add(locality);

      if (locality) {
        if (!data.nearbyByLocality[locality]) data.nearbyByLocality[locality] = new Set();
        nearby.forEach((n: string) => data.nearbyByLocality[locality].add(n));
      }
    });

    return {
      states: Array.from(data.states).sort() as string[],
      citiesByState: Object.fromEntries(Object.entries(data.citiesByState).map(([k, v]) => [k, Array.from(v as any).sort()])) as Record<string, string[]>,
      localitiesByCity: Object.fromEntries(Object.entries(data.localitiesByCity).map(([k, v]) => [k, Array.from(v as any).sort()])) as Record<string, string[]>,
      nearbyByLocality: Object.fromEntries(Object.entries(data.nearbyByLocality).map(([k, v]) => [k, Array.from(v as any).sort()])) as Record<string, string[]>
    };
  }, [properties]);

  return { ...hierarchy, isLoading };
}
