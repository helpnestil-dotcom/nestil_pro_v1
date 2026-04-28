'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { PropertyRequirement } from '@/lib/types';
import { useMemo } from 'react';

export function useRequirements(filters?: { 
  state?: string, 
  city?: string, 
  area?: string,
  purpose?: string 
}) {
  const firestore = useFirestore();

  const requirementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // We only use orderBy server-side to get the latest first
    // Specific filtering is done client-side to avoid complex index requirements
    return query(collection(firestore, 'property_requirements'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data, isLoading, error } = useCollection<PropertyRequirement>(requirementsQuery);

  const filteredRequirements = useMemo(() => {
    if (!data) return [];
    
    return data.filter(req => {
      // Status filter (internal)
      if (req.status !== 'active') return false;

      // Purpose filter
      if (filters?.purpose && filters.purpose !== 'All' && req.purpose !== filters.purpose) {
        return false;
      }

      // State filter
      if (filters?.state && filters.state !== 'All States' && filters.state !== 'all' && req.state !== filters.state) {
        return false;
      }

      // City filter
      if (filters?.city && filters.city !== 'All Sub Locations' && filters.city !== 'all' && req.city !== filters.city) {
        return false;
      }

      // Area/Locality filter
      if (filters?.area && filters.area !== 'All Localities' && filters.area !== 'all' && req.area !== filters.area) {
        return false;
      }

      return true;
    });
  }, [data, filters?.state, filters?.city, filters?.area, filters?.purpose]);

  return {
    requirements: filteredRequirements,
    isLoading,
    error,
  };
}
