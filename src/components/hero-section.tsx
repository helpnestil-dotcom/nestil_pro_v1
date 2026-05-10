'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Navigation, IndianRupee, Sparkles, User, Calendar, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Property } from '@/lib/types';
import { locationData } from '@/lib/locations';
import { Slider } from './ui/slider';
import { motion } from 'framer-motion';
import { useLocationHierarchy } from '@/hooks/use-location-hierarchy';
import Image from 'next/image';

const SearchWidget = () => {
  const router = useRouter();
  const firestore = useFirestore();
  const { states, citiesByState, localitiesByCity, isLoading: isLoadingLocs } = useLocationHierarchy();

  const [searchTab, setSearchTab] = useState('pg');
  const [state, setState] = useState('all');
  const [district, setDistrict] = useState('all');
  const [locality, setLocality] = useState('all');
  
  const [gender, setGender] = useState('all');
  const [moveIn, setMoveIn] = useState('immediate');
  
  // Budget as a range [min, max]
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 50000]); 
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
    if (searchTab === 'rental') {
        setBudgetRange([0, 200000]); // Max 2 Lac for rent
    } else {
        setBudgetRange([0, 50000]); // Max 50k for PG/Coliving
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
    
    if (searchTab === 'pg') {
        props = props.filter(p => p.propertyType?.includes('PG'));
    } else if (searchTab === 'flatmate' || searchTab === 'coliving') {
        props = props.filter(p => p.propertyType?.includes('Flatmate') || p.propertyType?.includes('Co-living'));
    } else if (searchTab === 'rental') {
        props = props.filter(p => p.listingFor === 'Rent' && !p.propertyType?.includes('PG') && !p.propertyType?.includes('Flatmate'));
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
    
    // Gender
    if (gender !== 'all') {
        props = props.filter(p => p.preferredTenants === 'Anyone' || p.preferredTenants?.toLowerCase() === gender.toLowerCase());
    }
    
    props = props.filter(p => p.price >= budgetRange[0] && p.price <= budgetRange[1]);
    
    return props.length;
  }, [fetchedProperties, searchTab, state, district, locality, budgetRange, gender]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (state && state !== 'all') params.set('state', state);
    if (district && district !== 'all') params.set('keyword', district);
    if (locality && locality !== 'all') params.set('locality', locality);

    if (searchTab === 'pg') {
      params.set('type', 'PG / Hostel');
    } else if (searchTab === 'flatmate') {
        params.set('type', 'Flatmate / Co-living');
    } else if (searchTab === 'coliving') {
        params.set('type', 'Flatmate / Co-living');
    } else if (searchTab === 'rental') {
        params.set('transaction', 'Rent');
    }

    if (gender !== 'all') params.set('tenant', gender);
    
    params.set('minPrice', budgetRange[0].toString());
    params.set('maxPrice', budgetRange[1].toString());

    router.push(`/properties?${params.toString()}`);
  };

  const handleNearMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setTimeout(() => {
                    setState('Karnataka');
                    setDistrict('Bangalore');
                    setIsLocating(false);
                }, 1500);
            },
            (error) => {
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
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative bg-white/90 backdrop-blur-2xl p-5 md:p-6 rounded-[32px] border border-white/40 shadow-xl shadow-slate-200/50 transition-all duration-500">
            <Tabs defaultValue={searchTab} onValueChange={setSearchTab} className="w-full">
                <TabsList className="flex h-14 justify-start p-1.5 bg-slate-100/60 rounded-2xl mb-6 gap-1 overflow-x-auto hide-scrollbar border border-slate-200/50">
                    {[
                      { id: 'pg', label: 'PG / Hostel' },
                      { id: 'flatmate', label: 'Flatmate' },
                      { id: 'coliving', label: 'Co-living' },
                      { id: 'rental', label: 'Rental Homes' }
                    ].map((tab) => (
                        <TabsTrigger 
                            key={tab.id} 
                            value={tab.id} 
                            className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm min-w-[100px] whitespace-nowrap font-bold font-heading text-[12px] uppercase tracking-wider transition-all duration-300"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            
            <div className="flex flex-col gap-5">
                {/* Location Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                        >
                            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Gender Selector */}
                    <div className="relative group/select">
                        <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">Preferred Gender</label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                              <SelectItem value="all" className="font-semibold">Any / Doesn't Matter</SelectItem>
                              <SelectItem value="Male" className="font-semibold">Male</SelectItem>
                              <SelectItem value="Female" className="font-semibold">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Move-in Date */}
                    <div className="relative group/select">
                        <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">Move-in Date</label>
                        <Select value={moveIn} onValueChange={setMoveIn}>
                            <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                <SelectValue placeholder="Immediate" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                              <SelectItem value="immediate" className="font-semibold">Immediate</SelectItem>
                              <SelectItem value="15days" className="font-semibold">Within 15 Days</SelectItem>
                              <SelectItem value="30days" className="font-semibold">Within 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Budget Slider Row */}
                <div className="px-2 pt-2 pb-2">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Budget Range</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-700 border border-slate-200/50">
                                {formatCurrency(budgetRange[0])}
                            </div>
                            <div className="w-2 h-px bg-slate-300" />
                            <div className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white border border-slate-800">
                                {formatCurrency(budgetRange[1])}+
                            </div>
                        </div>
                    </div>
                    <Slider 
                        defaultValue={[0, searchTab === 'rental' ? 200000 : 50000]} 
                        max={searchTab === 'rental' ? 200000 : 50000} 
                        step={searchTab === 'rental' ? 1000 : 500}
                        onValueChange={(vals) => setBudgetRange([vals[0], vals[1] || vals[0]])}
                        className="py-2"
                    />
                </div>
                
                {/* Search Action */}
                <Button 
                    onClick={handleSearch} 
                    className="w-full h-14 bg-primary hover:bg-slate-900 text-white font-bold font-heading text-base rounded-2xl shadow-lg shadow-primary/20 transform transition-all duration-300"
                >
                    <Search className="mr-2 h-5 w-5" /> 
                    Search Now
                </Button>
            </div>
        </div>
    </div>
  );
};

const TrustBadges = () => (
  <div className="flex flex-wrap items-center gap-4 mt-6 ml-2">
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-5 h-5 text-accent-green" />
      <span className="text-sm font-bold text-slate-600">Zero Brokerage</span>
    </div>
    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-5 h-5 text-primary" />
      <span className="text-sm font-bold text-slate-600">100% Verified</span>
    </div>
    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
    <div className="flex items-center gap-2 hidden sm:flex">
      <Sparkles className="w-5 h-5 text-yellow-500" />
      <span className="text-sm font-bold text-slate-600">Premium Stays</span>
    </div>
  </div>
);

const RightHeroVisual = () => (
  <div className="relative w-full aspect-[4/5] lg:aspect-square max-w-[550px] mx-auto hidden lg:block">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 rounded-[40px] overflow-hidden shadow-2xl shadow-primary/10 border border-slate-100"
    >
       <div className="absolute inset-0 bg-slate-100 animate-pulse" /> {/* Placeholder while loading */}
       <Image 
         src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
         alt="Premium Coliving Space"
         fill
         className="object-cover relative z-10"
         priority
       />
       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-20" />
    </motion.div>

    {/* Floating Cards */}
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="absolute bottom-12 -left-8 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-slate-900/10 border border-white flex items-center gap-4 z-30"
    >
       <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center">
         <ShieldCheck className="w-6 h-6 text-accent-green" />
       </div>
       <div>
         <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Verified</p>
         <p className="text-sm font-bold text-slate-900">10k+ Properties</p>
       </div>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="absolute top-1/3 -right-6 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-slate-900/10 border border-white flex items-center gap-4 z-30"
    >
       <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
         <Sparkles className="w-6 h-6 text-primary" />
       </div>
       <div>
         <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Top Rated</p>
         <p className="text-sm font-bold text-slate-900">Co-living Spaces</p>
       </div>
    </motion.div>
  </div>
);

export function HeroSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[calc(100vh-68px)] pt-16 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-[#F8FAFC]">
        {/* Dynamic Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="container relative z-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* LEFT COLUMN */}
                <div className="flex flex-col relative z-20 w-full max-w-[600px] mx-auto lg:mx-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 w-fit"
                    >
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </div>
                        Zero Brokerage Platform
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-black font-heading text-[40px] md:text-[56px] lg:text-[64px] leading-[1.1] tracking-[-0.03em] text-slate-900 mb-8"
                    >
                      Find Your Perfect Stay in <span className="text-primary">Bangalore</span>
                    </motion.h1>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full"
                    >
                        <SearchWidget />
                        <TrustBadges />
                    </motion.div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="w-full">
                    <RightHeroVisual />
                </div>
            </div>
        </div>
    </section>
  );
}
