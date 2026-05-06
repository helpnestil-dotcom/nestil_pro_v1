import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if (!adminDb || !adminMessaging) {
      return NextResponse.json({ error: 'Firebase Admin SDK not initialized.' }, { status: 500 });
    }

    const property = await req.json();
    const { id, title, city, area, price, propertyType, listingFor } = property;

    if (!id || !city || !price) {
      return NextResponse.json({ error: 'Missing required property fields' }, { status: 400 });
    }

    console.log(`Triggering match search for property: ${title} in ${city}, ${area}`);

    // 1. Query property_requirements for matching criteria
    // We filter by city first as it's a strong indicator
    let requirementsQuery = adminDb.collection('property_requirements')
      .where('city', '==', city)
      .where('status', '==', 'active'); // Only notify for active requirements

    const snapshot = await requirementsQuery.get();

    if (snapshot.empty) {
      return NextResponse.json({ message: 'No matching requirements found.' }, { status: 200 });
    }

    const notificationsToSend: { userId: string; tokens: string[]; title: string; body: string }[] = [];

    // 2. Further filtering in memory (Firestore has limits on complex queries)
    for (const doc of snapshot.docs) {
      const reqData = doc.data();
      
      // Match Budget (Requirement budget should be >= property price)
      if (reqData.budget < price) continue;

      // Match Purpose/ListingFor
      // Rent/Sale/Lease etc should align, unless the requirement says 'All'
      if (reqData.purpose && reqData.purpose.toLowerCase() !== 'all' && reqData.purpose.toLowerCase() !== listingFor.toLowerCase()) {
          continue;
      }

      // Match Area (If area is specified in requirement, it must match property area)
      if (reqData.area && reqData.area.toLowerCase() !== 'all') {
        const reqArea = reqData.area.toLowerCase();
        
        // If property has no area data, it cannot match a specific area request
        if (!area) {
            continue;
        }

        const propArea = area.toLowerCase();
        // If the property area is completely different from the requested area, skip it.
        if (!propArea.includes(reqArea) && !reqArea.includes(propArea)) {
            continue;
        }
      }

      // 3. Get User FCM Tokens
      const userDoc = await adminDb.collection('users').doc(reqData.userId).get();
      const userData = userDoc.data();
      const tokens: string[] = userData?.fcmTokens || [];

      if (tokens.length > 0) {
        notificationsToSend.push({
          userId: reqData.userId,
          tokens,
          title: `New Property in ${area || city}! 🏠`,
          body: `${propertyType} matching your requirement is now available at ₹${price.toLocaleString('en-IN')}.`,
        });
      }
    }

    if (notificationsToSend.length === 0) {
      return NextResponse.json({ message: 'No users with registered devices found for this match.' }, { status: 200 });
    }

    // 4. Send notifications
    const results = await Promise.all(notificationsToSend.map(async (notif) => {
      try {
        const message = {
          notification: {
            title: notif.title,
            body: notif.body,
          },
          data: {
            url: `/properties/${id}`,
          },
          tokens: notif.tokens,
        };
        return await adminMessaging.sendEachForMulticast(message);
      } catch (err) {
        console.error(`Failed to send to user ${notif.userId}:`, err);
        return null;
      }
    }));

    return NextResponse.json({ 
      success: true, 
      matchCount: notificationsToSend.length,
      results 
    });

  } catch (error: any) {
    console.error('Error in trigger-match:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
