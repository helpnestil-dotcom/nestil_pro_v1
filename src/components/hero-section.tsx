
'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Navigation, IndianRupee, Sparkles, Filter, Home, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Property } from '@/lib/types';
import { locationData } from '@/lib/locations';
import { Slider } from './ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationHierarchy } from '@/hooks/use-location-hierarchy';

const propertyTypesList = [
    '1 BHK Flat', '2 BHK Flat', '3 BHK Flat', 'Independent House', 
    'Villa', 'Row House', 'Duplex', 'Studio Apartment', 'PG / Hostel', 'Flatmate / Co-living', 'Land', 'Plot', 'Commercial properties', 'Godowns', 'Warehouses', 'Agricultural Land'
];

const SearchWidget = () => {
  const router = useRouter();
  const firestore = useFirestore();
  const { states, citiesByState, localitiesByCity, isLoading: isLoadingLocs } = useLocationHierarchy();

  const [searchTab, setSearchTab] = useState('buy');
  const [state, setState] = useState('all');
  const [district, setDistrict] = useState('all');
  const [locality, setLocality] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  
  // Budget as a range [min, max]
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 100000000]); // Default max 10Cr
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Sync with global user location
    const handleLocationSync = () => {
      try {
        const locationJson = localStorage.getItem('userLocation');
        if (locationJson) {
          const loc = JSON.parse(locationJson);
          if (loc.state) setState(loc.state);
          if (loc.district) setDistrict(loc.district);
          if (loc.locality) setLocality(loc.locality);
        }
      } catch (error) {
        console.error("Could not sync location", error);
      }
    };
    handleLocationSync();
    window.addEventListener('location-changed', handleLocationSync);
    return () => window.removeEventListener('location-changed', handleLocationSync);
  }, []);

  useEffect(() => {
    // Reset budget range when tab changes
    if (searchTab === 'rent') {
        setBudgetRange([0, 200000]); // Max 2 Lac for rent
    } else {
        setBudgetRange([0, 100000000]); // Max 10 Cr for sale
    }
  }, [searchTab]);

  const propertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'properties'), where('listingStatus', '==', 'approved'));
  }, [firestore]);

  const { data: fetchedProperties, isLoading: isQueryLoading } = useCollection<Property>(propertiesQuery);

  const filteredCount = useMemo(() => {
    if (!fetchedProperties) return 0;
    let props = fetchedProperties;
    
    if (searchTab === 'buy') {
        props = props.filter(p => p.listingFor === 'Sale');
    } else if (searchTab === 'rent') {
        props = props.filter(p => p.listingFor === 'Rent');
    } else if (searchTab === 'commercial') {
        props = props.filter(p => p.propertyType === 'Commercial properties');
    } else if (searchTab === 'plot') {
        props = props.filter(p => p.propertyType === 'Plot');
    } else if (searchTab === 'flatmates') {
        props = props.filter(p => p.propertyType === 'Flatmate / Co-living');
    }

    if (state !== 'all') {
        props = props.filter(p => p.state === state);
    }

    if (district !== 'all') {
      props = props.filter(p => p.city === district);
    }

    if (locality !== 'all') {
        props = props.filter(p => p.address === locality || p.subLocality === locality);
    }

    // Apply client-side filters for instant count
    if (propertyType !== 'all') {
        props = props.filter(p => p.propertyType === propertyType);
    }
    
    props = props.filter(p => p.price >= budgetRange[0] && p.price <= budgetRange[1]);
    
    return props.length;
  }, [fetchedProperties, propertyType, budgetRange, searchTab, state, district, locality]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (state && state !== 'all') {
      params.set('state', state);
    }

    if (district && district !== 'all') {
      params.set('keyword', district);
    }

    if (locality && locality !== 'all') {
        params.set('locality', locality);
    }

    if (searchTab === 'buy') {
      params.set('transaction', 'Sale');
    } else if (searchTab === 'rent') {
      params.set('transaction', 'Rent');
    } else if (searchTab === 'commercial') {
      params.set('type', 'Commercial properties');
    } else if (searchTab === 'plot') {
      params.set('type', 'Plot');
    } else if (searchTab === 'flatmates') {
        params.set('transaction', 'Rent');
        params.set('type', 'Flatmate / Co-living');
    }

    if (propertyType !== 'all') {
      params.set('type', propertyType);
    }
    
    params.set('minPrice', budgetRange[0].toString());
    params.set('maxPrice', budgetRange[1].toString());

    router.push(`/properties?${params.toString()}`);
  };

  const handleNearMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app, we would use reverse geocoding here.
                // For now, we'll simulate finding "Bangalore"
                setTimeout(() => {
                    setState('Karnataka');
                    setDistrict('Bangalore');
                    setIsLocating(false);
                }, 1500);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setIsLocating(false);
            }
        );
    } else {
        setIsLocating(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(1)} Lac`;
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="relative z-20 group">
        {/* Glow effect around widget */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative bg-white/80 backdrop-blur-2xl p-4 md:p-6 max-w-[950px] rounded-[40px] border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500">
            <Tabs defaultValue={searchTab} onValueChange={setSearchTab} className="w-full">
                <TabsList className="flex h-14 justify-start p-1.5 bg-slate-100/50 rounded-2xl mb-6 gap-1 overflow-x-auto hide-scrollbar border border-slate-200/50">
                    {['buy', 'rent', 'flatmates', 'commercial', 'plot'].map((tab) => (
                        <TabsTrigger 
                            key={tab} 
                            value={tab} 
                            className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md min-w-[100px] whitespace-nowrap font-bold font-heading text-[12px] uppercase tracking-wider transition-all duration-300"
                        >
                            {tab === 'buy' ? 'Buy' : tab === 'rent' ? 'Rent' : tab === 'flatmates' ? 'Flatmates' : tab === 'commercial' ? 'Office' : 'Plots'}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            
            <div className="flex flex-col gap-6">
                {/* Main Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Location Selectors */}
                    <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative group/select">
                            <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">State</label>
                            <Select value={state} onValueChange={(val) => { setState(val); setDistrict('all'); setLocality('all'); }}>
                                <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                    <SelectValue placeholder={isLoadingLocs ? "Loading..." : "Select State"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                    <SelectItem value="all" className="font-bold text-primary italic">All Regions</SelectItem>
                                    {states.map((s) => (
                                        <SelectItem key={s} value={s} className="font-semibold">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="relative group/select">
                            <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">City</label>
                            <Select value={district} onValueChange={(val) => { setDistrict(val); setLocality('all'); }} disabled={state === 'all'}>
                                <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                    <SelectValue placeholder="Choose City" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                    <SelectItem value="all" className="font-bold text-primary italic">Entire State</SelectItem>
                                    {(citiesByState[state] || []).map((c) => (
                                        <SelectItem key={c} value={c} className="font-semibold">{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="relative group/select">
                            <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">Area / Street</label>
                            <Select value={locality} onValueChange={setLocality} disabled={district === 'all'}>
                                <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                    <SelectValue placeholder="Locality" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                    <SelectItem value="all" className="font-bold text-primary italic">All Areas</SelectItem>
                                    {(localitiesByCity[district] || []).map((l) => (
                                        <SelectItem key={l} value={l} className="font-semibold">{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button 
                                onClick={handleNearMe}
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:bg-primary/10 rounded-full"
                                title="Locate me"
                            >
                                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="relative group/select">
                        <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">Property Category</label>
                        <Select value={propertyType} onValueChange={setPropertyType}>
                            <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100 max-h-[300px]">
                              <SelectItem value="all" className="font-bold text-primary italic">Everything</SelectItem>
                              {propertyTypesList.map(type => (
                                <SelectItem key={type} value={type} className="font-semibold">{type}</SelectItem>
                              ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Budget Slider Row */}
                <div className="px-2 pt-2 pb-4">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <IndianRupee className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Budget Range</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-black text-slate-700 border border-slate-200/50">
                                {formatCurrency(budgetRange[0])}
                            </div>
                            <div className="w-3 h-px bg-slate-300" />
                            <div className="px-3 py-1 bg-slate-900 rounded-lg text-sm font-black text-white border border-slate-800">
                                {formatCurrency(budgetRange[1])}+
                            </div>
                        </div>
                    </div>
                    <Slider 
                        defaultValue={[0, searchTab === 'rent' ? 200000 : 100000000]} 
                        max={searchTab === 'rent' ? 200000 : 100000000} 
                        step={searchTab === 'rent' ? 500 : 100000}
                        onValueChange={(vals) => setBudgetRange([vals[0], vals[1] || vals[0]])}
                        className="py-4"
                    />
                </div>
                
                {/* Search Action + Instant Count */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <div className="flex-1 flex items-center gap-4 px-6 h-16 bg-slate-50 rounded-2xl border border-slate-100">
                        {isQueryLoading ? (
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-slate-600">
                                    <span className="text-primary text-lg font-black">{filteredCount}</span> Properties matching your taste
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <Button 
                        onClick={handleSearch} 
                        className="w-full sm:w-56 h-16 bg-slate-900 hover:bg-primary text-white font-bold font-heading text-lg rounded-2xl shadow-xl shadow-slate-200 hover:shadow-primary/30 transform transition-all duration-300 group/search"
                    >
                        <Search className="mr-3 h-5 w-5 transform group-hover/search:scale-110 transition-transform" /> 
                        Search Now
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};



export function HeroSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[calc(100vh-68px)] pt-16 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-[#F8FAFC]">
        {/* Modern Dynamic Blobs */}
        <div className="absolute top-[-150px] right-[-100px] w-[600px] h-[600px] bg-theme2/10 rounded-full filter blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-theme3/10 rounded-full filter blur-[100px] animate-pulse delay-700 pointer-events-none"></div>

        {/* High-end Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

        <div className="container relative z-10 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-6 md:mb-10"
            >
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </div>
                Premium Real Estate Network
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold font-heading text-[42px] md:text-[68px] lg:text-[76px] leading-[1.1] tracking-[-0.03em] max-w-4xl text-slate-900 mb-6"
            >
              Moving to a new city?<br/>
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Find your home, flatmate & community</span> in one place.
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10 md:mb-14 font-medium"
            >
              Verified owners, direct contact & zero brokerage. Your complete 48-hour home search guide.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <SearchWidget />
            </motion.div>
        </div>
    </section>
  );
}
