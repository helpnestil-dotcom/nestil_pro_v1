'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import type { PropertyOwner } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const WhatsappIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

export function PropertyContactDetails({ propertyId, isPaid, propertyPath }: { propertyId: string, isPaid: boolean, propertyPath: string }) {
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

  if (isLoading || isUserLoading) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  if (showLoginPrompt) {
    return (
        <Card className="shadow-lg text-center">
            <CardHeader>
                <CardTitle>Contact Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">Please log in to view contact details.</p>
                <Button asChild className="w-full">
                    <Link href={`/login?redirect=${propertyPath}`}>
                        <Phone className="mr-2 h-5 w-5" /> Login to View Contact
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  if (privateDetails) {
    return (
      <Card className="shadow-lg text-center">
        <CardHeader>
            <CardTitle>Contact {privateDetails.isAgent ? "Agent" : "Owner"}</CardTitle>
            <p className="text-xl font-bold text-primary">{privateDetails.name || 'Owner Name'}</p>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-2xl font-bold tracking-widest">{privateDetails.phone || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button asChild size="lg">
                    <a href={`tel:${privateDetails.phone}`}>
                        <Phone className="mr-2 h-5 w-5" /> Call
                    </a>
                </Button>
                <Button asChild size="lg" variant="accent">
                    <a href={`https://wa.me/${(privateDetails.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <WhatsappIcon /> WhatsApp
                    </a>
                </Button>
            </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
