/**
 * Nestil GA4 Event Tracking
 * Maps platform actions to the Key Events defined in Google Analytics:
 *  - qualify_lead       : User views a property detail page or clicks "Get Details"
 *  - close_convert_lead : User actually sees/uses owner contact info (phone/WhatsApp)
 *  - purchase           : User buys credits / unlocks a premium listing
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/** Fire a GA4 event safely (does nothing if gtag not loaded) */
function fireEvent(eventName: string, params?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  } catch (e) {
    // Silently ignore tracking errors — never break user experience
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// qualify_lead — user is engaged and interested in a property
// ─────────────────────────────────────────────────────────────────────────────
export function trackQualifyLead(params: {
  propertyId: string;
  propertyType?: string;
  city?: string;
  price?: number;
  listingFor?: string;
}) {
  fireEvent('qualify_lead', {
    property_id: params.propertyId,
    property_type: params.propertyType || 'unknown',
    city: params.city || 'unknown',
    value: params.price || 0,
    listing_for: params.listingFor || 'unknown',
    currency: 'INR',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// close_convert_lead — user sees owner contact info (phone/WhatsApp revealed)
// ─────────────────────────────────────────────────────────────────────────────
export function trackCloseConvertLead(params: {
  propertyId: string;
  contactType: 'phone' | 'whatsapp';
  propertyType?: string;
  city?: string;
  price?: number;
}) {
  fireEvent('close_convert_lead', {
    property_id: params.propertyId,
    contact_type: params.contactType,
    property_type: params.propertyType || 'unknown',
    city: params.city || 'unknown',
    value: params.price || 0,
    currency: 'INR',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// purchase — user buys credits or unlocks a premium feature
// ─────────────────────────────────────────────────────────────────────────────
export function trackPurchase(params: {
  transactionId: string;
  value: number;
  itemName?: string;
}) {
  fireEvent('purchase', {
    transaction_id: params.transactionId,
    value: params.value,
    currency: 'INR',
    items: [{ item_name: params.itemName || 'Credits', price: params.value }],
  });
}
