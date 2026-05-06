'use client';

import { useEffect } from 'react';
import { trackQualifyLead } from '@/lib/analytics';

interface PropertyViewTrackerProps {
  propertyId: string;
  propertyType?: string;
  city?: string;
  price?: number;
  listingFor?: string;
}

/**
 * Invisible client component that fires the GA4 `qualify_lead` event
 * when a user views a property detail page.
 * Used inside the server-rendered PropertyDetailPage.
 */
export function PropertyViewTracker({ propertyId, propertyType, city, price, listingFor }: PropertyViewTrackerProps) {
  useEffect(() => {
    trackQualifyLead({ propertyId, propertyType, city, price, listingFor });
  }, [propertyId]);

  return null; // renders nothing
}
