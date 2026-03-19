
'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { Search, X, Filter } from 'lucide-react';
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


const propertyTypesList = [
    '1 BHK Flat', '2 BHK Flat', '3 BHK Flat', 'Independent House', 
    'Villa', 'Row House', 'Duplex', 'Studio Apartment', 'PG / Hostel', 'Land', 'Plot', 'Commercial properties', 'Godowns', 'Warehouses', 'Agricultural Land'
];

type Location = {
  state: string;
  district: string;
  locality: string;
  subLocality?: string;
};

function PropertySearchComponent() {
  const searchParams = useSearchParams();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const getInitialPriceRange = (): [number, number] => {
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    const maxVal = (max === 'Infinity' || !max) ? 10000000 : parseInt(max, 10);
    return [
      min ? parseInt(min, 10) : 0,
      maxVal > 10000000 ? 10000000 : maxVal,
    ];
  };

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || 'all');
  const [locality, setLocality] = useState(searchParams.get('locality') || 'all');
  const [transaction, setTransaction] = useState(searchParams.get('transaction') || 'all');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
  const [constructionStatus, setConstructionStatus] = useState(searchParams.get('constructionStatus') || 'all');
  const [rentalStatus, setRentalStatus] = useState(searchParams.get('rentalStatus') || 'all');
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

    // Only apply the district (city) filter at the database level to avoid missing composite indexes
    if (keyword && keyword !== 'all') {
      const altKeyword = keyword.endsWith(' district') ? keyword.replace(' district', '') : `${keyword} district`;
      q = query(q, where('city', 'in', [keyword, altKeyword]));
    }
    
    return q;
  }, [keyword]);

  const [serverFilteredSnapshot, isLoading, error] = useCollection(propertiesQuery);
  
  if (error) {
     console.error("Firestore query error:", error);
  }
  
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
    
    const isPriceFiltered = priceRange[0] > 0 || priceRange[1] < 10000000;
    if (isPriceFiltered) {
        if (priceRange[0] > 0) result = result.filter(prop => prop.price >= priceRange[0]);
        if (priceRange[1] < 10000000) result = result.filter(prop => prop.price <= priceRange[1]);
        
        // Sort by price if filtered
        result = result.sort((a, b) => a.price - b.price);
    } else {
        // Default sort by dateAdded descending
        result = result.sort((a, b) => {
            const dateA = new Date(a.dateAdded || 0).getTime();
            const dateB = new Date(b.dateAdded || 0).getTime();
            return dateB - dateA;
        });
    }

    return result;
  }, [propertiesFromQuery, locality, transaction, propertyType, constructionStatus, rentalStatus, priceRange]);

  // Reset locality and page when district changes
  useEffect(() => {
    setLocality('all');
  }, [keyword]);
  
  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, locality, transaction, propertyType, constructionStatus, rentalStatus, priceRange]);

  const currentProperties = useMemo(() => {
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    return filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  }, [filteredProperties, currentPage, propertiesPerPage]);

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);


  const handleReset = () => {
    setKeyword('all');
    setLocality('all');
    setTransaction('all');
    setPropertyType('all');
    setConstructionStatus('all');
    setRentalStatus('all');
    setPriceRange([0, 10000000]);
  };
  
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || 'all');
    setLocality(searchParams.get('locality') || 'all');
    setTransaction(searchParams.get('transaction') || 'all');
    setPropertyType(searchParams.get('type') || 'all');
    setConstructionStatus(searchParams.get('constructionStatus') || 'all');
    setRentalStatus(searchParams.get('rentalStatus') || 'all');
    setPriceRange(getInitialPriceRange());
  }, [searchParams]);


  const FilterControls = (
    <Card className="shadow-none border-none lg:border lg:shadow-sm">
        <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
                Filters
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Reset</span>
                </Button>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="district-select">District</Label>
              <Select value={keyword} onValueChange={setKeyword}>
                <SelectTrigger id="district-select">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {staticLocationData[0].districts.map((d) => (
                    <SelectItem key={d.name} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="locality-select">Locality</Label>
                <Select value={locality} onValueChange={setLocality} disabled={dynamicLocalities.length === 0}>
                    <SelectTrigger id="locality-select">
                    <SelectValue placeholder="All Localities" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Localities</SelectItem>
                    {dynamicLocalities.map((l) => (
                        <SelectItem key={l.name} value={l.name}>
                        {l.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="transaction-type">For</Label>
                <Select value={transaction} onValueChange={setTransaction}>
                    <SelectTrigger id="transaction-type">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Rent / Sale / Lease</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Lease">Lease</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="property-type">Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger id="property-type">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {propertyTypesList.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="construction-status">Construction Status</Label>
              <Select value={constructionStatus} onValueChange={setConstructionStatus}>
                <SelectTrigger id="construction-status">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rental-status">Rental Status</Label>
              <Select value={rentalStatus} onValueChange={setRentalStatus}>
                <SelectTrigger id="rental-status">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Vacating Soon">Vacating Soon</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-2">
                <Label>Price Range</Label>
                <Slider
                    min={0}
                    max={10000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={(value: [number, number]) => setPriceRange(value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}{priceRange[1] === 10000000 ? '+' : ''}</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 h-min">
          {FilterControls}
        </aside>

        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-2xl font-semibold">
                  {isLoading ? 'Searching properties...' : `${filteredProperties.length} Properties Found`}
              </h1>
              
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden w-full sm:w-auto">
                          <Filter className="mr-2 h-4 w-4" />
                          Filters
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 flex flex-col">
                      <div className="p-4 overflow-y-auto flex-grow">
                          {FilterControls}
                      </div>
                      <div className="p-4 border-t bg-background">
                          <Button className="w-full" onClick={() => setIsFilterSheetOpen(false)}>
                              Show {filteredProperties.length} Properties
                          </Button>
                      </div>
                  </SheetContent>
              </Sheet>
          </div>
          
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => <PropertyCardSkeleton key={i} />)}
             </div>
          ) : filteredProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProperties.map((prop, index) => (
                  <PropertyCard key={prop.id} property={prop} priority={index < 3} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
             <div className="text-center py-16 border-dashed border-2 rounded-lg bg-card mt-6">
                <h2 className="text-xl font-semibold">No Properties Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
                <Button variant="outline" className="mt-4" onClick={handleReset}>Clear All Filters</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
        <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 hidden lg:block"><Skeleton className="h-96 w-full" /></div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(12)].map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    }>
      <PropertySearchComponent />
    </Suspense>
  )
}
