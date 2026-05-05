'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bell, User, Search, MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { locationData } from '@/lib/locations';

export function MobileHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationView, setLocationView] = useState<'state' | 'district' | 'locality'>('state');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  const initialCity = searchParams.get('city');
  const initialLocality = searchParams.get('locality');
  const [selectedLocation, setSelectedLocation] = useState(
    initialCity ? `${initialLocality || 'All Areas'}, ${initialCity}` : ''
  );

  const currentStateObj = locationData.find(s => s.name === selectedState);
  const currentDistrictObj = currentStateObj?.districts.find(d => d.name === selectedDistrict);

  const handleStateSelect = (stateName: string) => {
    setSelectedState(stateName);
    setLocationView('district');
  };

  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrict(districtName);
    setLocationView('locality');
  };

  const handleLocalitySelect = (localityName: string) => {
    setSelectedLocation(`${localityName}, ${selectedDistrict}`);
    setIsLocationOpen(false);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set('city', selectedDistrict);
    if (localityName && !localityName.includes('All Areas')) {
      params.set('locality', localityName);
    } else {
      params.delete('locality');
    }
    router.push(`/?${params.toString()}`);

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

  return (
    <header className="px-5 pt-4 pb-6 bg-white space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary tracking-tighter">nestil</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-50">
              <Bell className="w-5 h-5 text-slate-700" />
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 border-2 border-white text-[10px]">
              5
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50">
            <User className="w-5 h-5 text-slate-700" />
          </Button>
        </div>
      </div>

      {/* Greeting & Title */}
      <div className="space-y-1">
        <p className="text-slate-500 font-medium">Hi, Welcome 👋</p>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
          Find your next home,<br />faster in 48hrs.
        </h2>
      </div>

      {/* Location Selector (Replaces Input & 'Use current location') */}
      <div className="space-y-4">
        <Sheet open={isLocationOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <div className="relative group cursor-pointer active:scale-[0.98] transition-transform">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="min-h-[56px] pl-12 pr-12 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-all text-base flex flex-col justify-center">
                {selectedLocation ? (
                  <>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Selected Location</span>
                    <span className="font-bold text-slate-800 leading-tight truncate">{selectedLocation}</span>
                  </>
                ) : (
                  <span className="text-slate-500 font-medium">Select city, area or landmark</span>
                )}
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <MapPin className="h-5 w-5 text-slate-400" />
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
              {locationView === 'state' && locationData.map(state => (
                <button 
                  key={state.name}
                  onClick={() => handleStateSelect(state.name)} 
                  className="flex items-center justify-between w-full p-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-700">{state.name}</span>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ))}

              {locationView === 'district' && currentStateObj?.districts.map(dist => (
                <button 
                  key={dist.name}
                  onClick={() => handleDistrictSelect(dist.name)} 
                  className="flex items-center justify-between w-full p-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-700">{dist.name}</span>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              ))}

              {locationView === 'locality' && currentDistrictObj?.localities.map(loc => (
                <button 
                  key={loc.name}
                  onClick={() => handleLocalitySelect(loc.name)} 
                  className="flex items-center justify-between w-full p-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-700">{loc.name}</span>
                </button>
              ))}

              {locationView === 'locality' && (!currentDistrictObj?.localities || currentDistrictObj.localities.length === 0) && (
                <div className="p-8 text-center text-slate-500 font-medium">
                  No specific localities available.
                  <Button 
                    variant="outline" 
                    className="mt-4 w-full h-12 rounded-xl"
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
    </header>
  );
}
