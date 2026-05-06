import { adminDb } from './src/lib/firebase-admin';

async function analyzeLocations() {
  if (!adminDb) {
    console.error('Admin DB not initialized');
    return;
  }

  const snapshot = await adminDb.collection('properties').where('listingStatus', '==', 'approved').get();
  
  const hierarchy: any = {};

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const state = data.state || 'Unknown';
    const city = data.city || 'Unknown';
    const street = data.address || 'Unknown';
    const subLocality = data.subLocality || '';
    const nearby = (data.nearbyPlaces || []).map((p: any) => p.name);

    if (!hierarchy[state]) hierarchy[state] = {};
    if (!hierarchy[state][city]) hierarchy[state][city] = { streets: new Set(), nearby: new Set() };
    
    hierarchy[state][city].streets.add(street);
    if (subLocality) hierarchy[state][city].streets.add(subLocality);
    
    nearby.forEach((n: string) => hierarchy[state][city].nearby.add(n));
  });

  // Convert sets to arrays for output
  const output: any = {};
  for (const state in hierarchy) {
    output[state] = {};
    for (const city in hierarchy[state]) {
      output[state][city] = {
        streets: Array.from(hierarchy[state][city].streets),
        nearby: Array.from(hierarchy[state][city].nearby)
      };
    }
  }

  console.log(JSON.stringify(output, null, 2));
}

analyzeLocations();
