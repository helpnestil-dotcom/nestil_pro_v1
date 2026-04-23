'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import type { Property } from '@/lib/types';
import { locationData } from '@/lib/locations';
import { Skeleton } from './ui/skeleton';

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
  const [budget, setBudget] = useState('any');
  
  const saleBudgetOptions = [
      { value: "0-3000000", label: "Under ₹30 Lac" },
      { value: "3000000-6000000", label: "₹30 - ₹60 Lac" },
      { value: "6000000-10000000", label: "₹60 Lac - ₹1 Cr" },
      { value: "10000000-Infinity", label: "Above ₹1 Cr" },
  ];

  const rentBudgetOptions = [
      { value: "0-10000", label: "Under ₹10,000" },
      { value: "10000-20000", label: "₹10,000 - ₹20,000" },
      { value: "20000-50000", label: "₹20,000 - ₹50,000" },
      { value: "50000-100000", label: "₹50,000 - ₹1 Lac" },
      { value: "100000-Infinity", label: "Above ₹1 Lac" },
  ];
  
  const budgetOptions = searchTab === 'rent' ? rentBudgetOptions : saleBudgetOptions;

  const propertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let q = query(collection(firestore, 'properties'), where('listingStatus', '==', 'approved'));
    if (district !== 'all') {
      const altDistrict = district.endsWith(' district') ? district.replace(' district', '') : `${district} district`;
      q = query(q, where('city', 'in', [district, altDistrict]));
    }
    return q;
  }, [firestore, district]);

  const { data: fetchedProperties } = useCollection<Property>(propertiesQuery);

  useEffect(() => {
    if (fetchedProperties) {
      setPropertiesFromQuery(fetchedProperties as Property[]);
    }
  }, [fetchedProperties]);



  useEffect(() => {
    setBudget('any');
  }, [searchTab]);

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
    
    if (budget && budget !== 'any') {
      const [min, max] = budget.split('-');
      if (min) {
        params.set('minPrice', min);
      }
      if (max) {
        params.set('maxPrice', max);
      }
    }

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="glass-card p-3 md:p-4 max-w-[850px] rounded-[32px] transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] duration-500">
        <Tabs defaultValue={searchTab} onValueChange={setSearchTab} className="w-full">
            <TabsList className="flex h-12 justify-start p-1.5 bg-slate-100/80 rounded-2xl mb-4 gap-1 overflow-x-auto hide-scrollbar border border-slate-200/50">
                <TabsTrigger value="buy" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm min-w-[100px] whitespace-nowrap font-bold text-slate-500 transition-all duration-300">Buy</TabsTrigger>
                <TabsTrigger value="rent" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm min-w-[100px] whitespace-nowrap font-bold text-slate-500 transition-all duration-300">Rent</TabsTrigger>
                <TabsTrigger value="flatmates" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm min-w-[100px] whitespace-nowrap font-bold text-slate-500 transition-all duration-300">Flatmates</TabsTrigger>
                <TabsTrigger value="commercial" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm min-w-[120px] whitespace-nowrap font-bold text-slate-500 transition-all duration-300">Commercial</TabsTrigger>
                <TabsTrigger value="plot" className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm min-w-[100px] whitespace-nowrap font-bold text-slate-500 transition-all duration-300">Plot / Land</TabsTrigger>
            </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
                    <Select value={state} onValueChange={(val) => { setState(val); setDistrict('all'); }}>
                        <SelectTrigger className="w-full h-14 border-0 bg-transparent shadow-none focus:ring-0 px-4 font-medium text-slate-700">
                            <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                            <SelectItem value="all" className="font-medium text-primary">All States</SelectItem>
                            {locationData.map((s) => (
                                <SelectItem key={s.name} value={s.name} className="font-medium">{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
                    <Select value={district} onValueChange={setDistrict} disabled={state === 'all'}>
                        <SelectTrigger className="w-full h-14 border-0 bg-transparent shadow-none focus:ring-0 px-4 font-medium text-slate-700">
                            <SelectValue placeholder="Select Sub Location" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                            <SelectItem value="all" className="font-medium text-primary">All Sub Locations</SelectItem>
                            {locationData.find(s => s.name === state)?.districts.map((d) => (
                                <SelectItem key={d.name} value={d.name} className="font-medium">{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
                    <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger className="w-full h-14 border-0 bg-transparent shadow-none focus:ring-0 px-4 font-medium text-slate-700">
                            <SelectValue placeholder="Property Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                          <SelectItem value="all" className="font-medium text-primary">All Types</SelectItem>
                          {propertyTypesList.map(type => (
                            <SelectItem key={type} value={type} className="font-medium">{type}</SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
                     <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger className="w-full h-14 border-0 bg-transparent shadow-none focus:ring-0 px-4 font-medium text-slate-700">
                            <SelectValue placeholder="Budget" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                          <SelectItem value="any" className="font-medium text-primary">Any Budget</SelectItem>
                          {budgetOptions.map(option => (
                              <SelectItem key={option.value} value={option.value} className="font-medium">{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="md:w-36 flex-shrink-0">
                <Button onClick={handleSearch} className="w-full h-14 md:h-full bg-gradient-to-r from-primary to-rose-600 text-white font-bold text-lg rounded-2xl hover:shadow-[0_8px_25px_-8px_var(--primary)] hover:scale-[1.02] transform transition-all duration-300">
                    <Search className="mr-2 h-5 w-5" /> 
                    <span className="md:hidden">Search</span>
                </Button>
            </div>
        </div>
    </div>
  );
};

const HeroStats = () => {
    const firestore = useFirestore();
    const [activeListings, setActiveListings] = useState<number | null>(null);

    useEffect(() => {
        const fetchCount = async () => {
            if (!firestore) return;
            try {
                const propertiesCol = collection(firestore, 'properties');
                const q = query(propertiesCol, where('listingStatus', '==', 'approved'));
                const snapshot = await getCountFromServer(q);
                setActiveListings(snapshot.data().count);
            } catch (error) {
                console.error("Error fetching active listings count:", error);
                setActiveListings(12400); // Fallback to original number on error
            }
        };
        fetchCount();
    }, [firestore]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-IN').format(num);
    }
    
    return (
        <div className="flex flex-wrap gap-x-10 gap-y-5 mt-14 min-h-[58px]">
            <div className="flex flex-col min-w-[120px]">
                <div className="text-3xl font-extrabold text-slate-800 leading-tight">
                    {activeListings === null ? (
                        <Skeleton className="h-8 w-24 bg-slate-200" />
                    ) : (
                        `${formatNumber(activeListings)}+`
                    )}
                </div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1.5">Active Listings</div>
            </div>
            <div className="w-px bg-slate-300 self-stretch hidden sm:block"></div>
            <div className="flex flex-col"><div className="text-3xl font-extrabold text-slate-800">26<span>+</span></div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Districts</div></div>
            <div className="w-px bg-slate-300 self-stretch hidden sm:block"></div>
            <div className="flex flex-col"><div className="text-3xl font-extrabold text-slate-800">Direct</div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Owner Contact</div></div>
            <div className="w-px bg-slate-300 self-stretch hidden sm:block"></div>
            <div className="flex flex-col"><div className="text-3xl font-extrabold text-slate-800">100%</div><div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">Free Listing</div></div>
        </div>
    );
};


export function HeroSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[calc(100vh-68px)] py-24 overflow-hidden bg-slate-50">
        {/* Dynamic Blobs */}
        <div className="absolute top-[-100px] right-[-50px] w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-[100px] animate-blob pointer-events-none mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-[-150px] w-[400px] h-[400px] bg-emerald-400/20 rounded-full filter blur-[80px] animate-blob animation-delay-[2000ms] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-[-50px] right-[20%] w-[300px] h-[300px] bg-sky-400/20 rounded-full filter blur-[80px] animate-blob animation-delay-[4000ms] pointer-events-none mix-blend-multiply"></div>

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0"></div>

        <div className="container relative z-10 px-4 mb-2">
            <div className="animate-in-up inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-slate-200/50 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700 mb-8 shadow-sm">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                India's #1 Property Platform
            </div>

            <h1 className="animate-in-up delay-100 font-extrabold text-5xl md:text-6xl lg:text-[72px] leading-[1.1] tracking-[-0.02em] max-w-4xl text-slate-800 mb-6 drop-shadow-sm">
              Discover Your <span className="glow-text">Dream Property</span> Across India
            </h1>
            
            <p className="animate-in-up delay-200 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-12 font-medium">
              List Free. Find Fast. Direct Owner Contact. The smartest way to buy, sell, and rent properties across all major cities of India.
            </p>

            <div className="animate-in-up delay-300">
                <SearchWidget />
            </div>
            
            <div className="animate-in-up delay-400 mt-8 border-t border-slate-200/60 pt-6 max-w-[850px]">
                <HeroStats />
            </div>
        </div>
    </section>
  );
}
