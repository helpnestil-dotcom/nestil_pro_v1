'use client';

import React, { useState } from 'react';
import { Bell, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickAlertToggleProps {
  city: string;
  state: string;
  area: string;
  propertyType: string;
  purpose: string;
  budget: number;
  className?: string;
}

export function QuickAlertToggle({ city, state, area, propertyType, purpose, budget, className }: QuickAlertToggleProps) {
  const { user, profile } = useUserProfile();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Skip if mandatory fields are missing
  if (city === 'all' || !city) return null;

  const handleEnableAlerts = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save alerts and get notified.",
        variant: "destructive"
      });
      return;
    }

    if (!firestore) return;

    setIsLoading(true);
    try {
      // 1. Check if an active alert already exists for this user/city/area
      const q = query(
        collection(firestore, 'property_requirements'),
        where('userId', '==', user.uid),
        where('city', '==', city),
        where('area', '==', area === 'all' ? '' : area),
        where('status', '==', 'active')
      );
      
      const existing = await getDocs(q);
      if (!existing.empty) {
          setIsSaved(true);
          toast({ title: "Alert already active", description: `You're already getting alerts for ${area !== 'all' ? area : city}.` });
          setIsLoading(false);
          return;
      }

      // 2. Create a quick requirement (Alert Preference)
      const docData = {
        userId: user.uid,
        name: profile?.name || user.displayName || 'User',
        state: state === 'all' ? 'Karnataka' : state,
        city: city,
        area: area === 'all' ? '' : area,
        propertyType: propertyType === 'all' ? 'Any' : propertyType,
        purpose: purpose === 'all' ? 'Rent' : purpose,
        budget: budget || 50000,
        moveInDate: new Date().toISOString().split('T')[0],
        whatsappNumber: profile?.phone || '', 
        description: `Auto-generated alert for ${city} ${area !== 'all' ? area : ''}`,
        status: 'active', // Mark as active immediately as it's an alert
        createdAt: serverTimestamp(),
        isAlert: true // Flag to distinguish from manual posts if needed
      };

      await addDoc(collection(firestore, 'property_requirements'), docData);
      
      setIsSaved(true);
      toast({
        title: "Alert Activated! 🔔",
        description: `We'll notify you when new ${propertyType !== 'all' ? propertyType : 'properties'} are listed in ${area !== 'all' ? area : city}.`,
      });
    } catch (error) {
      console.error("Error saving alert:", error);
      toast({
        title: "Failed to save alert",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl border border-primary/10 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Stay Updated</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Get instant push notifications when new properties match your search in <span className="font-bold text-primary">{area !== 'all' ? area : city}</span>.
          </p>
        </div>
        <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-primary/5">
            <Bell className="w-5 h-5 text-primary" />
        </div>
      </div>

      <Button
        onClick={handleEnableAlerts}
        disabled={isLoading || isSaved}
        className={cn(
          "w-full mt-4 h-11 rounded-xl font-bold transition-all duration-300",
          isSaved 
            ? "bg-emerald-500 hover:bg-emerald-600 text-white border-0" 
            : "bg-slate-900 hover:bg-primary text-white border-0 shadow-lg shadow-primary/20"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isSaved ? (
          <><CheckCircle2 className="w-4 h-4 mr-2" /> Alerts Active</>
        ) : (
          "Notify Me of New Listings"
        )}
      </Button>
    </div>
  );
}
