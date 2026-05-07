'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bell, User, Search, MapPin, ChevronRight, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useUser } from '@/firebase';
import { useLocationHierarchy } from '@/hooks/use-location-hierarchy';
import { motion } from 'framer-motion';

type Location = {
  state: string;
  district: string;
  locality: string;
  subLocality?: string;
  nearby?: string;
};

export function MobileHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const { states, citiesByState, localitiesByCity, isLoading } = useLocationHierarchy();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationView, setLocationView] = useState<'state' | 'district' | 'locality'>('state');
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  const [savedLocation, setSavedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const handleLocationUpdate = () => {
      try {
        const locationJson = localStorage.getItem('userLocation');
        if (locationJson) {
          setSavedLocation(JSON.parse(locationJson));
        }
      } catch (error) {
        console.error("Could not parse location", error);
      }
    };
    handleLocationUpdate();
    window.addEventListener('location-changed', handleLocationUpdate);
    return () => window.removeEventListener('location-changed', handleLocationUpdate);
  }, []);

  const handleStateSelect = (stateName: string) => {
    setSelectedState(stateName);
    setLocationView('district');
  };

  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrict(districtName);
    setLocationView('locality');
  };

  const handleLocalitySelect = (localityName: string) => {
    const newLoc: Location = {
      state: selectedState,
      district: selectedDistrict,
      locality: localityName === 'All Areas' ? '' : localityName,
    };
    
    localStorage.setItem('userLocation', JSON.stringify(newLoc));
    window.dispatchEvent(new CustomEvent('location-changed'));
    setIsLocationOpen(false);

    setTimeout(() => {
      setLocationView('state');
      setSelectedState('');
      setSelectedDistrict('');
    }, 300);
  };

  const handleBack = () => {
    if (locationView === 'locality') setLocationView('district');
    if (locationView === 'district') setLocationView('state');
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsLocationOpen(open);
    if (!open) {
      setTimeout(() => {
        setLocationView('state');
        setSelectedState('');
        setSelectedDistrict('');
      }, 300);
    }
  };

  const displayLocation = savedLocation 
    ? `${savedLocation.locality ? savedLocation.locality + ', ' : ''}${savedLocation.district || 'Select Location'}`
    : 'Select city, area or landmark';

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 1.02, 0.73, 1] }}
      className="px-4 pb-4 bg-white/90 backdrop-blur-xl space-y-5 sticky top-0 z-40 border-b border-slate-100/50"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      {/* Top Nav */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <Home className="w-6 h-6 text-[#2CB6A2]" />
          <h1 className="text-2xl font-black font-heading text-[#2CB6A2] tracking-tighter">nestil</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="relative h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors" aria-label="View notifications">
            <Bell className="w-5 h-5 text-slate-700" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 border-2 border-white text-[10px] font-bold">
              5
            </Badge>
          </Link>
          <Link href="/dashboard" className="h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-100 overflow-hidden flex items-center justify-center transition-colors" aria-label="Go to profile">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-slate-700" />
            )}
          </Link>
        </div>
      </div>

      {/* Greeting & Title */}
      <div className="space-y-0.5 px-1">
        <p className="text-slate-500 text-xs font-bold tracking-wide uppercase">Hi, Welcome 👋</p>
        <h2 className="text-[22px] font-bold font-heading text-slate-900 leading-tight">
          Find your next home,<br />faster in 48hrs.
        </h2>
      </div>

      {/* Location Selector */}
      <div className="space-y-4">
        <Sheet open={isLocationOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <div className="relative group cursor-pointer active:scale-[0.98] transition-transform">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <div className="min-h-[50px] pl-12 pr-12 py-2 rounded-full bg-slate-100/80 border border-transparent hover:border-slate-200 hover:bg-slate-100 transition-all text-base flex flex-col justify-center">
                {savedLocation ? (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 leading-tight">Location</span>
                    <span className="font-bold text-slate-800 leading-tight truncate">{displayLocation}</span>
                  </>
                ) : (
                  <span className="text-slate-400 font-medium tracking-tight">Select city, area or landmark</span>
                )}
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <MapPin className="h-5 w-5 text-primary/40" />
              </div>
            </div>
          </SheetTrigger>
          
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[32px] p-0 flex flex-col">
            <SheetHeader className="p-5 border-b text-left flex flex-row items-center gap-3 space-y-0 shrink-0">
              {locationView !== 'state' && (
                <button onClick={handleBack} className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
              )}
              <SheetTitle className="text-xl font-black tracking-tight text-slate-800">
                {locationView === 'state' ? 'Select State' : locationView === 'district' ? 'Select City/District' : 'Select Locality'}
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto pb-10">
              {isLoading && (
                  <div className="p-8 text-center text-slate-500 font-medium">Loading locations...</div>
              )}
              
              {!isLoading && locationView === 'state' && states.map(state => (
                <button 
                  key={state}
                  onClick={() => handleStateSelect(state)} 
                  className="flex items-center justify-between w-full p-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-700">{state}</span>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ))}

              {!isLoading && locationView === 'district' && (citiesByState[selectedState] || []).map(dist => (
                <button 
                  key={dist}
                  onClick={() => handleDistrictSelect(dist)} 
                  className="flex items-center justify-between w-full p-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-700">{dist}</span>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ))}

              {!isLoading && locationView === 'locality' && (localitiesByCity[selectedDistrict] || []).map(loc => (
                <button 
                  key={loc}
                  onClick={() => handleLocalitySelect(loc)} 
                  className="flex items-center justify-between w-full p-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-700">{loc}</span>
                </button>
              ))}

              {!isLoading && locationView === 'locality' && (
                <div className="p-8 text-center text-slate-500 font-medium border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl"
                    onClick={() => handleLocalitySelect('All Areas')}
                  >
                    Select entire {selectedDistrict}
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

    </motion.header>
  );
}
