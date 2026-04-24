
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
import { collection, query, where, DocumentData, Query, orderBy } from 'firebase/firestore';
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
    const maxVal = (max === 'Infinity' || !max) ? 10000000 : parseInt(max, 10);
    return [
      min ? parseInt(min, 10) : 0,
      maxVal,
    ];
  };

  const [stateParam, setStateParam] = useState(searchParams.get('state') || 'all');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || 'all');
  const [locality, setLocality] = useState(searchParams.get('locality') || 'all');
  const [transaction, setTransaction] = useState(searchParams.get('transaction') || 'all');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
  const [constructionStatus, setConstructionStatus] = useState(searchParams.get('constructionStatus') || 'all');
  const [rentalStatus, setRentalStatus] = useState(searchParams.get('rentalStatus') || 'all');
  const [genderPreference, setGenderPreference] = useState(searchParams.get('gender') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>(getInitialPriceRange());
  const [headerLocation, setHeaderLocation] = useState<Location | null>(null);
  
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
    let q: Query<DocumentData> = query(
      collection(db, 'properties'),
      where('listingStatus', '==', 'approved')
    );

    if (keyword && keyword !== 'all') {
      const altKeyword = keyword.endsWith(' district') ? keyword.replace(' district', '') : `${keyword} district`;
      q = query(q, where('city', 'in', [keyword, altKeyword]));
    }
    
    return q;
  }, [keyword]);

  const [serverFilteredSnapshot, isLoading, error] = useCollection(propertiesQuery);
  
  const propertiesFromQuery = useMemo(() => {
      if (!serverFilteredSnapshot) return [];
      return serverFilteredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
  }, [serverFilteredSnapshot]);

  const dynamicLocalities = useMemo(() => {
    if (!propertiesFromQuery) return [];
    const localitySet = new Set<string>();
    propertiesFromQuery.forEach(prop => {
        if (prop.address) {
            localitySet.add(prop.address);
        }
    });
    return Array.from(localitySet).sort().map(name => ({ name }));
  }, [propertiesFromQuery]);
  
  const filteredProperties = useMemo(() => {
    if (!propertiesFromQuery) return [];
    
    let result = propertiesFromQuery;

    if (stateParam !== 'all') {
        result = result.filter(prop => {
            const propState = prop.state || staticLocationData.find(s => s.districts.some(d => d.name === prop.city))?.name || 'Andhra Pradesh';
            return propState === stateParam;
        });
    }

    if (locality !== 'all') {
        result = result.filter(prop => prop.address === locality);
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
    
    result = result.filter(prop => prop.price >= priceRange[0] && prop.price <= priceRange[1]);
    
    // Sort logic
    result = result.sort((a, b) => {
        const dateA = new Date(a.dateAdded || 0).getTime();
        const dateB = new Date(b.dateAdded || 0).getTime();
        return dateB - dateA;
    });

    return result;
  }, [propertiesFromQuery, stateParam, locality, transaction, propertyType, constructionStatus, rentalStatus, genderPreference, priceRange]);

  useEffect(() => {
    setLocality('all');
  }, [keyword]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, stateParam, locality, transaction, propertyType, constructionStatus, rentalStatus, genderPreference, priceRange]);

  const currentProperties = useMemo(() => {
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    return filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  }, [filteredProperties, currentPage, propertiesPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const handleReset = () => {
    setStateParam('all');
    setKeyword('all');
    setLocality('all');
    setTransaction('all');
    setPropertyType('all');
    setConstructionStatus('all');
    setRentalStatus('all');
    setGenderPreference('all');
    setPriceRange([0, 10000000]);
    
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

        {/* Location Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Location</Label>
            </div>
            
            <div className="space-y-3">
              <Select value={stateParam} onValueChange={(val) => { setStateParam(val); setKeyword('all'); }}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-primary/20 hover:border-primary/30 transition-all font-bold">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">All States</SelectItem>
                  {staticLocationData.map((s) => (
                    <SelectItem key={s.name} value={s.name} className="font-semibold">{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={keyword} onValueChange={setKeyword} disabled={stateParam === 'all'}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-primary/20 hover:border-primary/30 transition-all font-bold">
                  <SelectValue placeholder="All Sub Locations" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">All Sub Locations</SelectItem>
                  {staticLocationData.find(s => s.name === stateParam)?.districts.map((d) => (
                    <SelectItem key={d.name} value={d.name} className="font-semibold">{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locality} onValueChange={setLocality} disabled={dynamicLocalities.length === 0}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white/50 focus:ring-primary/20 hover:border-primary/30 transition-all font-bold">
                        <SelectValue placeholder="All Localities" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="font-bold">All Localities</SelectItem>
                        {dynamicLocalities.map((l) => (
                            <SelectItem key={l.name} value={l.name} className="font-semibold">{l.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Property Type Grid Chips */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Property Type</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                {['all', '1 BHK Flat', '2 BHK Flat', '3 BHK Flat', 'Villa', 'Independent House', 'Land', 'Office'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setPropertyType(t === 'Office' ? 'Commercial properties' : t)}
                        className={cn(
                            "px-3 py-2.5 rounded-xl text-[11px] font-black border transition-all text-center",
                            (propertyType === t || (t === 'Office' && propertyType === 'Commercial properties'))
                                ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                        )}
                    >
                        {t === 'all' ? 'Everything' : t}
                    </button>
                ))}
            </div>
            {propertyType !== 'all' && !['1 BHK Flat', '2 BHK Flat', '3 BHK Flat', 'Villa', 'Independent House', 'Land', 'Commercial properties'].includes(propertyType) && (
                 <div className="mt-2 p-3 bg-primary/5 border border-primary/10 rounded-xl text-[11px] font-black text-primary flex items-center justify-between">
                    <span>Selected: {propertyType}</span>
                    <button onClick={() => setPropertyType('all')}><X className="w-3 h-3" /></button>
                 </div>
            )}
        </div>

        {/* Status Section */}
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

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Availability</Label>
              <Select value={rentalStatus} onValueChange={setRentalStatus}>
                <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-white focus:ring-primary/20 font-bold text-xs">
                  <SelectValue placeholder="Any Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Vacating Soon">Vacating Soon</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>

        {/* Price Range */}
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Price Budget</Label>
                </div>
                <div className="text-[11px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md">
                    Max: ₹{(priceRange[1] / 100000).toFixed(1)}L
                </div>
            </div>
            
            <Slider
                min={0}
                max={10000000}
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
                    <span className="text-[11px] font-black text-slate-800">₹{priceRange[1].toLocaleString('en-IN')}{priceRange[1] === 10000000 ? '+' : ''}</span>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      <div className="container py-12 px-4">
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
                        <Button variant="outline" className="lg:hidden h-12 px-6 rounded-xl border-slate-200 bg-white font-bold text-slate-700 shadow-sm">
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
            {FilterControls}
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
                    className="text-center py-24 border-2 border-dashed border-slate-200 rounded-[32px] bg-white mt-6 shadow-sm"
               >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">No Spaces Found</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">We couldn't find any properties matching these filters. Try relaxing your search criteria.</p>
                  <Button variant="outline" className="mt-8 h-12 px-8 rounded-xl font-black border-slate-200 hover:bg-primary hover:text-white transition-all" onClick={handleReset}>
                    Clear All Filters
                  </Button>
              </motion.div>
            )}
          </main>
        </div>
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
