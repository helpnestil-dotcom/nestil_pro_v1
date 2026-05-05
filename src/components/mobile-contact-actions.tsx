'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import type { PropertyOwner } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Phone, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const WhatsappIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

export function MobileContactActions({ propertyId, isPaid, propertyPath, title, isRent, price, address, type, bhk, furnishing }: { propertyId: string, isPaid: boolean, propertyPath: string, title: string, isRent: boolean, price: number, address: string, type: string, bhk: string, furnishing: string }) {
  const [privateDetails, setPrivateDetails] = useState<PropertyOwner | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    async function fetchPrivateDetails() {
      if (isUserLoading || !firestore) return;

      setIsLoading(true);

      if (!isPaid) {
        setShowLoginPrompt(false);
        setPrivateDetails(null);
        setIsLoading(false);
        return;
      }
      
      if (!user) {
        setShowLoginPrompt(true);
        setPrivateDetails(null);
        setIsLoading(false);
        return;
      }
      
      setShowLoginPrompt(false);
      const privateDocRef = doc(firestore, 'propertyPrivateDetails', propertyId);
      try {
        const docSnap = await getDoc(privateDocRef);
        if (docSnap.exists()) {
          setPrivateDetails(docSnap.data() as PropertyOwner);
        } else {
          setPrivateDetails(null);
        }
      } catch (error: any) {
        console.error("Error fetching private details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrivateDetails();
  }, [propertyId, isPaid, user, isUserLoading, firestore]);

  const whatsappMessage = encodeURIComponent(
    `🏠 *${title}*\n\n` +
    `💰 *Price:* ₹${(price || 0).toLocaleString('en-IN')}${isRent ? '/mo' : ''}\n` +
    `📍 *Location:* ${address}\n` +
    `🏢 *Type:* ${type} (${bhk || '-'})\n` +
    `🛋️ *Status:* ${furnishing || 'N/A'}\n\n` +
    `🔗 *View Photos & Details:* https://nestil.in${propertyPath}\n\n` +
    `✅ *Verified Listing | 🚫 Zero Brokerage*`
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-5 py-4 pb-8 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {isLoading || isUserLoading ? (
         <div className="flex gap-3">
             <Skeleton className="h-14 flex-1 rounded-2xl" />
             <Skeleton className="h-14 flex-1 rounded-2xl" />
         </div>
      ) : showLoginPrompt ? (
        <Button asChild className="w-full h-14 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20">
            <Link href={`/login?redirect=${propertyPath}`}>
                <Lock className="mr-2 h-5 w-5" /> Login to Contact Owner
            </Link>
        </Button>
      ) : privateDetails ? (
        <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1 h-14 border-slate-200 text-slate-800 font-black rounded-2xl hover:bg-slate-50">
               <a href={`tel:${privateDetails.phone}`}>
                  <Phone className="mr-2 h-5 w-5 text-blue-500" /> Call
               </a>
            </Button>
            <Button asChild className="flex-1 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white font-black rounded-2xl shadow-xl shadow-[#25D366]/20 border-none">
               <a href={`https://wa.me/${(privateDetails.phone || '').replace(/\D/g, '')}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                  <WhatsappIcon /> <span className="ml-2">WhatsApp</span>
               </a>
            </Button>
        </div>
      ) : (
         <div className="text-center w-full py-3 text-sm font-bold text-slate-500">Contact unavailable</div>
      )}
    </div>
  );
}
