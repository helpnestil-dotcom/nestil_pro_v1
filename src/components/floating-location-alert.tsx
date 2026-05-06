'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, X, Search, Check, Sparkles, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLocationHierarchy } from '@/hooks/use-location-hierarchy';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useFCM } from '@/hooks/use-fcm';
import { useRouter } from 'next/navigation';

export function FloatingLocationAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { localitiesByCity, isLoading: locationsLoading } = useLocationHierarchy();
  const { user, profile } = useUserProfile();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { requestPermission, permission } = useFCM();
  const router = useRouter();

  const bangaloreLocalities = useMemo(() => {
    return localitiesByCity['Bangalore'] || [];
  }, [localitiesByCity]);

  // Provide some popular defaults if loading or empty
  const defaultPopular = ['Bellandur', 'HSR Layout', 'Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'BTM Layout'];
  const displayLocalities = bangaloreLocalities.length > 0 ? bangaloreLocalities : defaultPopular;

  const filteredLocalities = useMemo(() => {
    if (!searchQuery) return displayLocalities;
    return displayLocalities.filter(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [displayLocalities, searchQuery]);

  // Effect to check if user has existing alerts and handle delay
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkExistingAlerts = async () => {
      if (!user || !firestore) {
        setIsVisible(false);
        return;
      }

      try {
        const q = query(
          collection(firestore, 'property_requirements'),
          where('userId', '==', user.uid),
          where('isAlert', '==', true),
          where('status', '==', 'active')
        );
        const snap = await getDocs(q);
        
        // If they don't have any active alerts, show the button after 5 seconds
        if (snap.empty && !hasSaved) {
          timeoutId = setTimeout(() => {
            setIsVisible(true);
          }, 5000); // 5 seconds delay
        } else {
          setIsVisible(false); // Hide if they already have alerts
        }
      } catch (error) {
        console.error("Error checking existing alerts:", error);
      }
    };

    checkExistingAlerts();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, firestore, hasSaved]);

  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(prev => prev.filter(l => l !== location));
    } else {
      if (selectedLocations.length >= 5) {
        toast({ title: 'Limit Reached', description: 'You can select up to 5 locations for alerts.', variant: 'destructive' });
        return;
      }
      setSelectedLocations(prev => [...prev, location]);
    }
  };

  const handleSaveAlerts = async () => {
    if (!user) {
      toast({ title: 'Sign In Required', description: 'Please sign in to set up property alerts.' });
      router.push(`/login?redirect=/properties`);
      return;
    }
    if (!firestore) return;
    if (selectedLocations.length === 0) {
      toast({ title: 'Select a location', description: 'Please select at least 1 location.' });
      return;
    }

    setIsSaving(true);
    try {
      // 1. Request notification permission if not already granted
      if (permission !== 'granted') {
        await requestPermission();
      }

      // 2. Fetch existing active alerts for this user to avoid duplicates
      const q = query(
        collection(firestore, 'property_requirements'),
        where('userId', '==', user.uid),
        where('status', '==', 'active')
      );
      const existingSnap = await getDocs(q);
      const existingAreas = existingSnap.docs.map(doc => doc.data().area);

      let savedCount = 0;

      // Save each location as an alert
      for (const area of selectedLocations) {
        if (existingAreas.includes(area)) continue; // Skip if already have alert

        const docData = {
          userId: user.uid,
          name: profile?.name || user.displayName || 'User',
          state: 'Karnataka',
          city: 'Bangalore',
          area: area,
          propertyType: 'All', // Broad match
          purpose: 'All', // Broad match
          budget: 99999999, // Max budget to catch everything
          moveInDate: new Date().toISOString().split('T')[0],
          whatsappNumber: profile?.phone || '',
          description: `Auto-generated multi-location alert for ${area}`,
          status: 'active',
          createdAt: serverTimestamp(),
          isAlert: true
        };

        await addDoc(collection(firestore, 'property_requirements'), docData);
        savedCount++;
      }

      setHasSaved(true);
      setIsVisible(false); // Immediately hide the button
      toast({
        title: 'Alerts Activated! 🔔',
        description: `You will now receive notifications for ${selectedLocations.length} locations.`,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving alerts:", error);
      toast({ title: 'Failed to save', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (hasSaved || !isVisible) return null;

  return (
    <>
      <div className="fixed bottom-28 right-6 md:bottom-10 md:right-10 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={hasSaved ? {} : {
                boxShadow: ["0px 0px 0px 0px rgba(99, 102, 241, 0.4)", "0px 0px 0px 15px rgba(99, 102, 241, 0)"],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-indigo-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              {hasSaved ? <CheckCircle2 className="w-6 h-6" /> : <BellRing className="w-6 h-6 animate-pulse" />}
              <span className="font-bold text-sm hidden md:inline pr-2">{hasSaved ? 'Alerts Active' : 'Get Alerts'}</span>
            </motion.button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-slate-50/95 backdrop-blur-xl border-slate-200/60 overflow-hidden">
            <DialogHeader className="mb-2">
              <DialogTitle className="flex items-center gap-2 text-2xl font-black text-slate-800">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Top 5 Locations
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium pt-1">
                Select up to 5 areas. We'll send you an instant notification the moment a new property is listed there.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search areas in Bangalore..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-12 rounded-xl bg-white border-slate-200/60 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Areas</span>
                <span className={cn("text-xs font-bold", selectedLocations.length === 5 ? "text-rose-500" : "text-indigo-500")}>
                  {selectedLocations.length} / 5 Selected
                </span>
              </div>

              <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {locationsLoading && displayLocalities === defaultPopular ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {filteredLocalities.map((loc) => {
                        const isSelected = selectedLocations.includes(loc);
                        return (
                          <motion.div
                            key={loc}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <Badge
                              variant="outline"
                              className={cn(
                                "px-4 py-2 text-sm cursor-pointer transition-all duration-200 border",
                                isSelected
                                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-inner"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                              )}
                              onClick={() => toggleLocation(loc)}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 mr-1.5 shrink-0" />}
                              {!isSelected && <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />}
                              {loc}
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {filteredLocalities.length === 0 && (
                      <div className="w-full text-center py-6 text-slate-500 text-sm">
                        No areas found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/60 mt-4">
                <Button
                  onClick={handleSaveAlerts}
                  disabled={selectedLocations.length === 0 || isSaving || hasSaved}
                  className={cn(
                    "w-full h-12 rounded-xl font-bold text-base shadow-lg transition-all duration-300",
                    hasSaved ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25"
                  )}
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : hasSaved ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Saved!</> : 'Activate Notifications'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
