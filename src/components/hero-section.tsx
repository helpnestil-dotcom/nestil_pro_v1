
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

const propertyTypesList = [
    '1 BHK Flat', '2 BHK Flat', '3 BHK Flat', 'Independent House', 
    'Villa', 'Row House', 'Duplex', 'Studio Apartment', 'PG / Hostel', 'Flatmate / Co-living', 'Land', 'Plot', 'Commercial properties', 'Godowns', 'Warehouses', 'Agricultural Land'
];

const SearchWidget = () => {
  const router = useRouter();
  const [propertiesFromQuery, setPropertiesFromQuery] = useState<Property[]>([]);
  const firestore = useFirestore();

  const [searchTab, setSearchTab] = useState('buy');
  const [state, setState] = useState('all');
  const [district, setDistrict] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  
  // Budget as a range [min, max]
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 100000000]); // Default max 10Cr
  const [isLocating, setIsLocating] = useState(false);

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

    if (district !== 'all') {
      const altDistrict = district.endsWith(' district') ? district.replace(' district', '') : `${district} district`;
      props = props.filter(p => p.city === district || p.city === altDistrict);
    }

    // Apply client-side filters for instant count
    if (propertyType !== 'all') {
        props = props.filter(p => p.propertyType === propertyType);
    }
    
    props = props.filter(p => p.price >= budgetRange[0] && p.price <= budgetRange[1]);
    
    return props.length;
  }, [fetchedProperties, propertyType, budgetRange, searchTab, district]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (state && state !== 'all') {
      params.set('state', state);
    }

    if (district && district !== 'all') {
      params.set('keyword', district);
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
                // For now, we'll simulate finding "Bangalore" if the user is in a certain range, 
                // or just show a message.
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
                            className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md min-w-[100px] whitespace-nowrap font-black text-[13px] uppercase tracking-wider transition-all duration-300"
                        >
                            {tab === 'buy' ? 'Buy' : tab === 'rent' ? 'Rent' : tab === 'flatmates' ? 'Flatmates' : tab === 'commercial' ? 'Office' : 'Plots'}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            
            <div className="flex flex-col gap-6">
                {/* Main Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Location Selectors */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative group/select">
                            <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">State</label>
                            <Select value={state} onValueChange={(val) => { setState(val); setDistrict('all'); }}>
                                <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                    <SelectItem value="all" className="font-bold text-primary italic">All of India</SelectItem>
                                    {locationData.map((s) => (
                                        <SelectItem key={s.name} value={s.name} className="font-semibold">{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="relative group/select">
                            <label className="absolute left-4 top-2 text-[9px] font-black uppercase text-slate-400 tracking-widest z-10">Sub Location</label>
                            <Select value={district} onValueChange={setDistrict} disabled={state === 'all'}>
                                <SelectTrigger className="w-full h-16 pt-5 border-slate-200/60 bg-white/50 rounded-2xl shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all font-bold text-slate-800">
                                    <SelectValue placeholder="Choose District" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                    <SelectItem value="all" className="font-bold text-primary italic">Entire State</SelectItem>
                                    {locationData.find(s => s.name === state)?.districts.map((d) => (
                                        <SelectItem key={d.name} value={d.name} className="font-semibold">{d.name}</SelectItem>
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
                        className="w-full sm:w-56 h-16 bg-slate-900 hover:bg-primary text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-200 hover:shadow-primary/30 transform transition-all duration-300 group/search"
                    >
                        <Search className="mr-3 h-6 w-6 transform group-hover/search:scale-110 transition-transform" /> 
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
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100 text-[12px] font-black uppercase tracking-[0.25em] text-theme1 mb-6 md:mb-12"
            >
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme2 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-theme2"></span>
                </div>
                Premium Real Estate Network
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-black text-[38px] md:text-[64px] lg:text-[72px] leading-[1.05] tracking-[-0.02em] max-w-4xl text-theme1 mb-4 md:mb-8 line-clamp-2"
            >
              <span style={{ background: 'linear-gradient(90deg, #FF4D6D, #7B61FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Homes</span> Made Simple
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[18px] md:text-[22px] text-[#64748B] max-w-2xl leading-relaxed mb-8 md:mb-16 font-medium"
            >
              Verified owners, direct contact, zero brokerage.
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
