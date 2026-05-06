import { MetadataRoute } from 'next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

const URL = 'https://www.nestil.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get static routes
  const staticRoutes = [
    { path: '/',                  priority: 1.0, changefreq: 'daily' },
    { path: '/properties',        priority: 0.9, changefreq: 'hourly' },
    { path: '/requirements',      priority: 0.8, changefreq: 'daily' },
    { path: '/flatmates',         priority: 0.8, changefreq: 'daily' },
    { path: '/shift-home',        priority: 0.7, changefreq: 'weekly' },
    { path: '/agents',            priority: 0.7, changefreq: 'weekly' },
    { path: '/builders',          priority: 0.6, changefreq: 'weekly' },
    { path: '/about',             priority: 0.6, changefreq: 'monthly' },
    { path: '/contact',           priority: 0.6, changefreq: 'monthly' },
    { path: '/privacy-policy',    priority: 0.3, changefreq: 'yearly' },
    { path: '/terms-of-service',  priority: 0.3, changefreq: 'yearly' },
  ].map(({ path, priority }) => ({
    url: `${URL}${path}`,
    lastModified: new Date().toISOString(),
    priority,
  }));

  // Get dynamic routes for approved properties
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const propertiesCollectionRef = collection(db, 'properties');
    const q = query(propertiesCollectionRef, where('listingStatus', '==', 'approved'));
    
    const querySnapshot = await getDocs(q);
    propertyRoutes = querySnapshot.docs.map((doc) => {
      const property = doc.data() as Property;
      
      let lastModifiedDate;
      // Handle both Timestamp and string formats for date
      if (property.updatedAt) {
        if (property.updatedAt instanceof Timestamp) {
          lastModifiedDate = property.updatedAt.toDate().toISOString();
        } else if (typeof property.updatedAt === 'string') {
          lastModifiedDate = new Date(property.updatedAt).toISOString();
        } else {
          lastModifiedDate = new Date().toISOString();
        }
      } else {
        lastModifiedDate = new Date().toISOString();
      }
      
      return {
        url: `${URL}/properties/${doc.id}`,
        lastModified: lastModifiedDate,
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Error fetching properties for sitemap:", error);
    // If fetching properties fails, we'll still return the static routes
    // so the sitemap doesn't completely fail.
  }

  return [...staticRoutes, ...propertyRoutes];
}
