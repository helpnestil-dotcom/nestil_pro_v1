
'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PropertyCard, PropertyCardSkeleton } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, X, Filter, MapPin, Building2, Home, CheckCircle2, RotateCcw, IndianRupee, Sparkles, ChevronRight, LayoutGrid } from 'lucide-react';
import { collection, query, where, DocumentData, Query, orderBy, limit } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { locationData as staticLocationData } from '@/lib/locations';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Metadata } from 'next';

import { MobileListingHeader } from '@/components/mobile-listing-header';
import { MobilePropertyListingCard } from '@/components/mobile-property-listing-card';
import { QuickAlertToggle } from '@/components/quick-alert-toggle';
import { FloatingLocationAlert } from '@/components/floating-location-alert';

const propertyTypesList = [
    '1 BHK Flat', '2 BHK Flat', '3 BHK Flat', 'Independent House', 
    'Villa', 'Row House', 'Duplex', 'Studio Apartment', 'PG / Hostel', 'Flatmate / Co-living', 'Land', 'Plot', 'Commercial properties', 'Godowns', 'Warehouses', 'Agricultural Land'
];

type Location = {
  state: string;
  district: string;
  locality: string;
  subLocality?: string;
};

function PropertySearchComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const getInitialPriceRange = (): [number, number] => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    const maxVal = (max === 'Infinity' || !max) ? 100000000 : parseInt(max, 10);
    return [
      min ? parseInt(min, 10) : 0,
      maxVal,
    ];
  };

  const [listingCategory, setListingCategory] = useState(searchParams.get('category') || 'all');
  const [stateParam, setStateParam] = useState(searchParams.get('state') || 'all');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || 'all');
  const [locality, setLocality] = useState(searchParams.get('locality') || 'all');
  const [transaction, setTransaction] = useState(searchParams.get('transaction') || 'all');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
  const [constructionStatus, setConstructionStatus] = useState(searchParams.get('constructionStatus') || 'all');
  const [rentalStatus, setRentalStatus] = useState(searchParams.get('rentalStatus') || 'all');
  const [genderPreference, setGenderPreference] = useState(searchParams.get('gender') || 'all');
  const [foodFilter, setFoodFilter] = useState('all');
  const [sharingFilter, setSharingFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [immediateMoveIn, setImmediateMoveIn] = useState(searchParams.get('immediate') === 'true');
  const [priceRange, setPriceRange] = useState<[number, number]>(getInitialPriceRange());
  const [headerLocation, setHeaderLocation] = useState<Location | null>(null);
  const [nearbyParam, setNearbyParam] = useState(searchParams.get('nearby') || 'all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  useEffect(() => {
    const handleLocationUpdate = () => {
      try {
        const locationJson = localStorage.getItem('userLocation');
        if (locationJson) {
          setHeaderLocation(JSON.parse(locationJson) as Location);
        } else {
          setHeaderLocation(null);
        }
      } catch (error) {
        console.error("Could not parse location from localStorage", error);
        setHeaderLocation(null);
      }
    };

    handleLocationUpdate();
    window.addEventListener('location-changed', handleLocationUpdate);

    return () => {
      window.removeEventListener('location-changed', handleLocationUpdate);
    };
  }, []);

  const propertiesQuery = useMemo(() => {
    return query(
      collection(db, 'properties'),
      where('listingStatus', '==', 'approved'),
      limit(100)
    );
  }, []);

  const [serverFilteredSnapshot, isLoading, error] = useCollection(propertiesQuery);
  
  const propertiesFromQuery = useMemo(() => {
      if (!serverFilteredSnapshot) return [];
      return serverFilteredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  }, [serverFilteredSnapshot]);

  // Dynamic Hierarchical Location Data
  const locationHierarchy = useMemo(() => {
    const hierarchy: any = {
      states: new Set<string>(),
      citiesByState: {} as Record<string, Set<string>>,
      localitiesByCity: {} as Record<string, Set<string>>,
      nearbyByLocality: {} as Record<string, Set<string>>
    };

    propertiesFromQuery
      .filter(p => (p.state === 'Karnataka' || p.city === 'Bangalore') || (!p.state && p.city === 'Bangalore'))
      .forEach(prop => {
      const state = 'Karnataka';
      const city = 'Bangalore';
      const locality = prop.address || prop.subLocality || '';
      const nearby = prop.nearbyPlaces?.map(p => p.name) || [];

      hierarchy.states.add(state);
      
      if (!hierarchy.citiesByState[state]) hierarchy.citiesByState[state] = new Set();
      hierarchy.citiesByState[state].add(city);

      if (!hierarchy.localitiesByCity[city]) hierarchy.localitiesByCity[city] = new Set();
      if (locality) hierarchy.localitiesByCity[city].add(locality);

      if (locality) {
        if (!hierarchy.nearbyByLocality[locality]) hierarchy.nearbyByLocality[locality] = new Set();
        nearby.forEach((n: string) => hierarchy.nearbyByLocality[locality].add(n));
      }
    });

    return {
      states: Array.from(hierarchy.states).sort() as string[],
      citiesByState: Object.fromEntries(Object.entries(hierarchy.citiesByState).map(([k, v]) => [k, Array.from(v as any).sort()])) as Record<string, string[]>,
      localitiesByCity: Object.fromEntries(Object.entries(hierarchy.localitiesByCity).map(([k, v]) => [k, Array.from(v as any).sort()])) as Record<string, string[]>,
      nearbyByLocality: Object.fromEntries(Object.entries(hierarchy.nearbyByLocality).map(([k, v]) => [k, Array.from(v as any).sort()])) as Record<string, string[]>
    };
  }, [propertiesFromQuery]);

  const availableStates: string[] = locationHierarchy.states;
  const availableCities: string[] = stateParam !== 'all' ? (locationHierarchy.citiesByState[stateParam] || []) : [];
  const availableLocalities: string[] = keyword !== 'all' ? (locationHierarchy.localitiesByCity[keyword] || []) : [];
  const availableNearby: string[] = locality !== 'all' ? (locationHierarchy.nearbyByLocality[locality] || []) : [];
  
  const filteredProperties = useMemo(() => {
    if (!propertiesFromQuery) return [];
    
    let result = propertiesFromQuery;

    if (stateParam !== 'all') {
        result = result.filter(prop => {
            const propState = prop.state || staticLocationData.find(s => s.districts.some(d => d.name === prop.city))?.name || 'Karnataka';
            return propState === stateParam;
        });
    }

    if (listingCategory === 'residential') {
        result = result.filter(prop => prop.propertyType !== 'PG / Hostel' && prop.propertyType !== 'Flatmate / Co-living');
    } else if (listingCategory === 'pg') {
        result = result.filter(prop => prop.propertyType === 'PG / Hostel' || prop.propertyType === 'Flatmate / Co-living');
    }

    if (keyword && keyword !== 'all') {
      const altKeyword = keyword.endsWith(' district') ? keyword.replace(' district', '') : `${keyword} district`;
      result = result.filter(prop => prop.city === keyword || prop.city === altKeyword);
    }

    if (locality !== 'all') {
        result = result.filter(prop => prop.address === locality || prop.subLocality === locality);
    }
    if (nearbyParam !== 'all') {
        result = result.filter(prop => prop.nearbyPlaces?.some(p => p.name === nearbyParam));
    }
    if (transaction !== 'all') {
        result = result.filter(prop => prop.listingFor === transaction);
    }
    if (propertyType !== 'all') {
        result = result.filter(prop => prop.propertyType === propertyType);
    }
    if (constructionStatus !== 'all') {
        result = result.filter(prop => prop.constructionStatus === constructionStatus);
    }
    if (rentalStatus !== 'all') {
        result = result.filter(prop => prop.rentalStatus === rentalStatus);
    }
    if (genderPreference !== 'all') {
        result = result.filter(prop => prop.flatmateGenderPreference === genderPreference);
    }

    if (foodFilter !== 'all') {
        result = result.filter(prop => prop.foodIncluded === (foodFilter === 'Yes'));
    }

    if (sharingFilter !== 'all') {
        result = result.filter(prop => prop.pgSharingPrices?.[sharingFilter as keyof typeof prop.pgSharingPrices] !== undefined);
    }

    if (roomTypeFilter !== 'all') {
        result = result.filter(prop => prop.pgRoomType === roomTypeFilter);
    }

    if (immediateMoveIn) {
        result = result.filter(prop => prop.isImmediateMoveIn === true);
    }
    
    result = result.filter(prop => prop.price >= priceRange[0] && prop.price <= priceRange[1]);
    
    // Sort logic
    result = result.sort((a, b) => {
        const dateA = new Date(a.dateAdded || 0).getTime();
        const dateB = new Date(b.dateAdded || 0).getTime();
        return dateB - dateA;
    });

    return result;
  }, [propertiesFromQuery, listingCategory, stateParam, keyword, locality, nearbyParam, transaction, propertyType, constructionStatus, rentalStatus, genderPreference, priceRange]);

  useEffect(() => {
    setLocality('all');
    setNearbyParam('all');
  }, [keyword]);

  useEffect(() => {
    setNearbyParam('all');
  }, [locality]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [listingCategory, keyword, stateParam, locality, nearbyParam, transaction, propertyType, constructionStatus, rentalStatus, genderPreference, priceRange, foodFilter, sharingFilter, roomTypeFilter, immediateMoveIn]);

  const currentProperties = useMemo(() => {
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    return filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  }, [filteredProperties, currentPage, propertiesPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const handleReset = () => {
    setListingCategory('all');
    setStateParam('all');
    setKeyword('all');
    setLocality('all');
    setTransaction('all');
    setPropertyType('all');
    setConstructionStatus('all');
    setRentalStatus('all');
    setGenderPreference('all');
    setFoodFilter('all');
    setSharingFilter('all');
    setRoomTypeFilter('all');
    setImmediateMoveIn(false);
    setNearbyParam('all');
    setPriceRange([0, 100000000]);
    
    router.push('/properties');
  };

  const FilterControls = (
    <div className="flex flex-col gap-8 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Filter className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Refine Search</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs font-bold text-slate-400 hover:text-primary gap-1.5 transition-colors">
                <RotateCcw className="w-3 h-3" />
                Reset
            </Button>
        </div>

        {/* Transaction Toggle (Segmented Control) */}
        {/* Standard Residential Filters - Hidden for PG/Flatmate */}
        {listingCategory !== 'pg' && propertyType !== 'PG / Hostel' && propertyType !== 'Flatmate / Co-living' && (
            <>
                <div className="space-y-3">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Listing Type</Label>
                    <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                        {['all', 'Rent', 'Sale', 'Lease'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setTransaction(type)}
                                className={cn(
                                    "flex-1 py-2 text-[12px] font-bold rounded-xl transition-all duration-300",
                                    transaction === type 
                                        ? "bg-white text-primary shadow-sm" 
                                        : "text-slate-500 hover:text-slate-700"
                                )}
                            >
                                {type === 'all' ? 'All' : type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Property Type</Label>
                    <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
                        {[
                            { label: 'All', icon: Home, value: 'all' },
                            { label: '1BHK', icon: Building2, value: '1 BHK Flat' },
                            { label: '2BHK', icon: Building2, value: '2 BHK Flat' },
                            { label: '3BHK+', icon: Building2, value: '3 BHK Flat' },
                        ].map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setPropertyType(t.value)}
                                className="flex flex-col items-center gap-2 min-w-[70px]"
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all",
                                    propertyType === t.value 
                                        ? "bg-primary/5 border-primary text-primary" 
                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                )}>
                                    <t.icon className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold",
                                    propertyType === t.value ? "text-primary" : "text-slate-400"
                                )}>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Furnishing</Label>
                    <div className="flex flex-wrap gap-2">
                        {['Any', 'Furnished', 'Semi Furnished', 'Unfurnished'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setRentalStatus(f === 'Any' ? 'all' : f)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[11px] font-bold border transition-all",
                                    (f === 'Any' ? rentalStatus === 'all' : rentalStatus === f)
                                        ? "bg-primary text-white border-primary" 
                                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Construction</Label>
                        <Select value={constructionStatus} onValueChange={setConstructionStatus}>
                            <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-white focus:ring-primary/20 font-bold text-xs">
                                <SelectValue placeholder="Any Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any Status</SelectItem>
                                <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                                <SelectItem value="Under Construction">Under Construction</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </>
        )}

        {/* Location Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Location</Label>
            </div>
            
            <div className="space-y-3">
              <Select value={stateParam} onValueChange={(val) => { setStateParam(val); setKeyword('all'); setLocality('all'); setNearbyParam('all'); }}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-primary/20 hover:border-primary/30 transition-all font-bold">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">All States</SelectItem>
                  {availableStates.map((s) => (
                    <SelectItem key={s} value={s} className="font-semibold">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={keyword} onValueChange={(val) => { setKeyword(val); setLocality('all'); setNearbyParam('all'); }} disabled={stateParam === 'all'}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-primary/20 hover:border-primary/30 transition-all font-bold">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">All Cities</SelectItem>
                  {availableCities.map((c) => (
                    <SelectItem key={c} value={c} className="font-semibold">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locality} onValueChange={(val) => { setLocality(val); setNearbyParam('all'); }} disabled={availableLocalities.length === 0}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-primary/20 hover:border-primary/30 transition-all font-bold">
                        <SelectValue placeholder="All Localities / Streets" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="font-bold">All Localities</SelectItem>
                        {availableLocalities.map((l) => (
                            <SelectItem key={l} value={l} className="font-semibold">{l}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={nearbyParam} onValueChange={setNearbyParam} disabled={availableNearby.length === 0}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-primary/20 hover:border-primary/30 transition-all font-bold">
                        <SelectValue placeholder="All Nearby Locations" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="font-bold">All Nearby Locations</SelectItem>
                        {availableNearby.map((n) => (
                            <SelectItem key={n} value={n} className="font-semibold">{n}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>



        {/* Specialized Filters for PG / Co-living */}
        {(listingCategory === 'pg' || propertyType === 'PG / Hostel' || propertyType === 'Flatmate / Co-living') && (
            <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-800">PG High Conversion Filters</span>
                </div>
                
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Food Included</Label>
                    <div className="flex gap-2">
                        {['all', 'Yes', 'No'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFoodFilter(f)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[11px] font-bold border transition-all",
                                    foodFilter === f 
                                        ? "bg-primary text-white border-primary shadow-md" 
                                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                                )}
                            >
                                {f === 'all' ? 'Any' : f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sharing Mode</Label>
                    <Select value={sharingFilter} onValueChange={setSharingFilter}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white font-bold text-xs">
                            <SelectValue placeholder="Any Sharing" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Sharing</SelectItem>
                            <SelectItem value="single">Single Sharing</SelectItem>
                            <SelectItem value="double">Double Sharing</SelectItem>
                            <SelectItem value="triple">Triple Sharing</SelectItem>
                            <SelectItem value="four">Four Sharing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Near Landmark (Offices)</Label>
                    <Select value={nearbyParam} onValueChange={setNearbyParam} disabled={locality === 'all'}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white font-bold text-xs">
                            <SelectValue placeholder="Select Office/Hub" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Anywhere Near {locality}</SelectItem>
                            {availableNearby.map((n) => (
                                <SelectItem key={n} value={n}>{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        )}

        {(propertyType === 'Flatmate / Co-living' || listingCategory === 'pg') && (
            <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-800">Flatmate High Conversion</span>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Gender Preference</Label>
                    <div className="flex gap-2">
                        {['all', 'Male', 'Female', 'Anyone'].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGenderPreference(g)}
                                className={cn(
                                    "px-3 py-2 rounded-xl text-[10px] font-bold border transition-all",
                                    genderPreference === g 
                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-md" 
                                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                                )}
                            >
                                {g === 'all' ? 'Any' : g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Room Requirement</Label>
                    <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                        <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white font-bold text-xs">
                            <SelectValue placeholder="Private Room?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Room Type</SelectItem>
                            <SelectItem value="Private Room">Private Room</SelectItem>
                            <SelectItem value="Shared Room">Shared Room</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="space-y-0.5">
                        <Label className="text-xs font-bold text-emerald-800">Immediate Move-in</Label>
                        <p className="text-[9px] text-emerald-600 font-medium tracking-tight uppercase">Ready to shift</p>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={immediateMoveIn} 
                        onChange={(e) => setImmediateMoveIn(e.target.checked)}
                        className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                </div>
            </div>
        )}

        {/* Price Range */}
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Price Budget</Label>
                </div>
                <div className="text-[11px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md">
                    Max: ₹{priceRange[1] >= 10000000 ? `${(priceRange[1] / 10000000).toFixed(1)}Cr` : `${(priceRange[1] / 100000).toFixed(1)}L`}
                </div>
            </div>
            
            <Slider
                min={0}
                max={100000000}
                step={50000}
                value={priceRange}
                onValueChange={(value: [number, number]) => setPriceRange(value)}
                className="py-2"
            />
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Min</span>
                    <span className="text-[11px] font-black text-slate-800">₹{priceRange[0].toLocaleString('en-IN')}</span>
                </div>
                <div className="w-4 h-px bg-slate-300" />
                <div className="flex flex-col text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Max</span>
                    <span className="text-[11px] font-black text-slate-800">₹{priceRange[1].toLocaleString('en-IN')}{priceRange[1] === 100000000 ? '+' : ''}</span>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-[#fafbfc] min-h-screen pb-24 md:pb-0">
      {/* Mobile Listing View */}
      <div className="md:hidden">
        <MobileListingHeader 
            title={listingCategory === 'pg' ? 'Find PG / Coliving' : (transaction === 'Rent' ? 'Find Home' : 'Buy Home')} 
            onFilterClick={() => setIsFilterSheetOpen(true)}
            searchValue={keyword}
            onSearchChange={setKeyword}
        />
        
        <div className="px-5 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-black text-slate-900">
                    {isLoading ? 'Searching...' : `${filteredProperties.length}+ Homes Found`}
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    [...Array(3)].map((_, i) => <Skeleton key={i} className="h-[280px] w-full rounded-3xl" />)
                ) : currentProperties.map((prop, index) => (
                    <MobilePropertyListingCard key={prop.id} property={prop} index={index} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Button 
                        variant="outline" 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-full h-14 rounded-2xl border-primary text-primary font-black"
                    >
                        Load More
                    </Button>
                </div>
            )}
        </div>
      </div>

      {/* Desktop Listing View */}
      <div className="hidden md:block container py-12 px-4">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10"
                >
                    <Sparkles className="w-3 h-3" />
                    Smart Matching Active
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            Discovering Spaces <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                        </div>
                    ) : (
                        <><span className="text-primary">{filteredProperties.length}</span> Results Found</>
                    )}
                </h1>
                <p className="text-slate-500 font-medium">Explore handpicked properties verified for quality and direct owner access.</p>
            </div>

            <div className="flex items-center gap-3">
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="md:flex h-12 px-6 rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
                            <Filter className="mr-2 h-4 w-4 text-primary" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 flex flex-col">
                        <div className="p-6 overflow-y-auto flex-grow bg-white">
                            {FilterControls}
                        </div>
                        <div className="p-6 border-t bg-slate-50">
                            <Button className="w-full h-14 bg-slate-900 hover:bg-primary text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all duration-300" onClick={() => setIsFilterSheetOpen(false)}>
                                View {filteredProperties.length} Properties
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    {FilterControls}
                </div>
                
                <QuickAlertToggle 
                    city={keyword}
                    state={stateParam}
                    area={locality}
                    propertyType={propertyType}
                    purpose={transaction}
                    budget={priceRange[1]}
                />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(9)].map((_, i) => <PropertyCardSkeleton key={i} />)}
               </div>
            ) : filteredProperties.length > 0 ? (
              <AnimatePresence mode="popLayout">
                <motion.div 
                    key={transaction + propertyType + keyword}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {currentProperties.map((prop, index) => (
                    <PropertyCard key={prop.id} property={prop} priority={index < 3} />
                  ))}
                </motion.div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-16 pt-10 border-t border-slate-100">
                    <Button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="h-12 rounded-xl font-bold px-6 border-slate-200 hover:bg-primary hover:text-white transition-all"
                    >
                      Previous
                    </Button>
                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCurrentPage(i + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={cn(
                                    "w-12 h-12 rounded-xl font-black text-sm transition-all",
                                    currentPage === i + 1 
                                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                        : "bg-white border border-slate-100 text-slate-400 hover:border-slate-300"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <Button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="h-12 rounded-xl font-bold px-6 border-slate-200 hover:bg-primary hover:text-white transition-all"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            ) : (
               <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 px-6 border-2 border-dashed border-slate-200 rounded-[32px] bg-white mt-6 shadow-sm flex flex-col items-center"
               >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">No Spaces Found</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">We couldn't find any properties matching these filters. Try relaxing your search criteria or get notified when one matches.</p>
                  
                  <QuickAlertToggle 
                    className="max-w-sm mt-8 text-left"
                    city={keyword}
                    state={stateParam}
                    area={locality}
                    propertyType={propertyType}
                    purpose={transaction}
                    budget={priceRange[1]}
                  />

                  <Button variant="link" className="mt-6 text-slate-400 font-bold" onClick={handleReset}>
                    Clear All Filters
                  </Button>
               </motion.div>
            )}
          </main>
        </div>
      </div>
      
      <div className="md:hidden">
        <FloatingLocationAlert />
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
        <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 hidden lg:block"><Skeleton className="h-96 w-full rounded-2xl" /></div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(9)].map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    }>
      <PropertySearchComponent />
    </Suspense>
  )
}
