
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { locationData as staticLocationData, type State, type District } from '@/lib/locations';

import { useLocationHierarchy } from '@/hooks/use-location-hierarchy';

type Location = {
  state: string;
  district: string;
  locality: string;
  subLocality?: string;
  nearby?: string;
};

export function LocationSelector({ className }: { className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  const { states, citiesByState, localitiesByCity, nearbyByLocality, isLoading } = useLocationHierarchy();

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [selectedSubLocality, setSelectedSubLocality] = useState<string>('');
  const [selectedNearby, setSelectedNearby] = useState<string>('');

  const [savedLocation, setSavedLocation] = useState<Location | null>(null);
  const { toast } = useToast();
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleLocationUpdate = () => {
      try {
        const locationJson = localStorage.getItem('userLocation');
        if (locationJson) {
          const parsedLocation = JSON.parse(locationJson) as Location;
          setSavedLocation(parsedLocation);
        } else {
          const defaultLocation: Location = {
            state: 'Karnataka',
            district: 'Bangalore',
            locality: 'Bellandur',
            subLocality: '',
          };
          localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
          setSavedLocation(defaultLocation);
          window.dispatchEvent(new CustomEvent('location-changed'));
        }
      } catch (error) {
        console.error("Could not parse location from localStorage", error);
      }
    };

    handleLocationUpdate();
    window.addEventListener('location-changed', handleLocationUpdate);
    return () => window.removeEventListener('location-changed', handleLocationUpdate);
  }, []);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedDistrict('');
    setSelectedLocality('');
    setSelectedSubLocality('');
    setSelectedNearby('');
    setStep(2);
  };

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    setSelectedLocality('');
    setSelectedSubLocality('');
    setSelectedNearby('');
    setStep(3);
  };

  const handleLocalityChange = (localityName: string) => {
    setSelectedLocality(localityName);
    setSelectedNearby('');
    setStep(4);
  };

  const saveLocation = () => {
    if (selectedState && selectedDistrict && selectedLocality) {
      const newLocation: Location = {
        state: selectedState,
        district: selectedDistrict,
        locality: selectedLocality,
        subLocality: selectedSubLocality,
        nearby: selectedNearby,
      };
      localStorage.setItem('userLocation', JSON.stringify(newLocation));
      window.dispatchEvent(new CustomEvent('location-changed'));
      setIsModalOpen(false);
      toast({
        title: "Location Updated!",
        description: `Your location has been set to ${newLocation.locality}, ${newLocation.district}.`,
      });
    }
  };
  
  const openModal = () => {
      if (savedLocation) {
        setSelectedState(savedLocation.state);
        setSelectedDistrict(savedLocation.district);
        setSelectedLocality(savedLocation.locality || '');
        setSelectedSubLocality(savedLocation.subLocality || '');
        setSelectedNearby(savedLocation.nearby || '');
        setStep(savedLocation.nearby ? 4 : (savedLocation.locality ? 3 : 2));
      } else {
        setStep(1);
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedLocality('');
        setSelectedSubLocality('');
        setSelectedNearby('');
      }
      setIsModalOpen(true);
  }

  const displayLocation = useMemo(() => {
    if (!isMounted || !savedLocation) {
      return 'Select Location';
    }
    const { district, locality, subLocality, nearby } = savedLocation;
    const mainPart = [nearby, subLocality, locality].filter(Boolean).join(', ');
    return mainPart ? `${mainPart}, ${district}` : district;
  }, [isMounted, savedLocation]);

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-1 text-sm text-foreground/80 hover:text-foreground",
          className
        )}
        onClick={openModal}
      >
        <MapPin className="h-4 w-4 text-primary" />
        <span className="truncate max-w-[100px] md:max-w-[150px]">
          {displayLocation}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800">Select Your Location</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Pick a location as per our database listings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">State</label>
              <Select onValueChange={handleStateChange} value={selectedState}>
                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-200">
                  <SelectValue placeholder={isLoading ? "Loading..." : "Select a state"} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {step >= 2 && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">City / District</label>
                <Select onValueChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedState}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {(citiesByState[selectedState] || []).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step >= 3 && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Street / Locality</label>
                <Select onValueChange={handleLocalityChange} value={selectedLocality} disabled={!selectedDistrict}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select a street" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {(localitiesByCity[selectedDistrict] || []).map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step >= 4 && (nearbyByLocality[selectedLocality] || []).length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Nearby Locations</label>
                <Select onValueChange={setSelectedNearby} value={selectedNearby} disabled={!selectedLocality}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select a nearby spot" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {(nearbyByLocality[selectedLocality] || []).map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                    <SelectItem value="all">Anywhere Nearby</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full h-12 rounded-2xl font-black text-lg bg-slate-900 hover:bg-primary shadow-xl shadow-primary/20 transition-all"
              onClick={saveLocation}
              disabled={!selectedState || !selectedDistrict || !selectedLocality}
            >
              Set My Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
