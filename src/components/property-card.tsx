'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, ExternalLink, Flag, Wrench, Building2, Users, Key, Armchair } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();

  const isFavorited = favoriteIds.has(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id, isFavorited);
  };
  
  const rawPhotos = property.photos && property.photos.length > 0 ? property.photos : [];
  const imageUrl = rawPhotos.length > 0 
    ? (typeof rawPhotos[0] === 'string' ? rawPhotos[0] : (rawPhotos[0] as any).url) 
    : 'https://picsum.photos/seed/property/600/400';

  const formatPrice = (p: number) => {
    if (p >= 10000000) {
        const value = p / 10000000;
        return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
    }
    if (p >= 100000) {
        const value = p / 100000;
        return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakhs`;
    }
    return `₹${new Intl.NumberFormat('en-IN').format(p)}`;
  };

  const currentPrice = property.priceOnRequest || !property.price || property.price <= 0 
    ? 'On Request' 
    : formatPrice(property.price);

  return (
    <div className="w-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Header Section */}
      <div className="p-4 bg-[#fcfcfc] border-b border-slate-200 relative">
        <div className="flex justify-between items-start gap-4 pr-12">
          <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors block">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
              {property.title}
              <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />
            </h2>
          </Link>
          <button className="absolute right-4 top-4 border rounded p-1.5 bg-white text-slate-300 hover:text-slate-500 hover:border-slate-300 transition-colors">
            <Flag className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center flex-wrap gap-1 mt-2 text-[15px] text-slate-500">
          <span className="text-slate-600 truncate max-w-[50%]">{property.address || property.subLocality || property.city}</span>
          <span className="mx-1 truncate">{property.city}</span>
          <MapPin className="h-4 w-4 mx-0.5 text-slate-400 shrink-0" />
          <Link href={`/properties/${property.id}`} className="underline underline-offset-2 hover:text-primary decoration-slate-300 transition-colors">
            Explore Nearby
          </Link>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 border-b border-slate-200 text-center divide-x divide-slate-100 py-4 bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-xl text-slate-800 flex items-center gap-1 flex-wrap justify-center">
            {currentPrice}
            {property.maintenance ? (
                <span className="text-sm font-semibold text-indigo-600/80 whitespace-nowrap hidden sm:inline-flex items-center gap-0.5">
                    + {property.maintenance} <Wrench className="h-3 w-3" />
                </span>
            ) : null}
          </div>
          <div className="text-[13px] text-slate-500 mt-0.5">{property.listingFor === 'Sale' ? 'Price' : 'Rent'}</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-xl text-slate-800">
            {property.deposit ? formatPrice(property.deposit) : '-'}
          </div>
          <div className="text-[13px] text-slate-500 mt-0.5">Deposit</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-xl text-slate-800">
            {property.areaSqFt ? `${property.areaSqFt.toLocaleString('en-IN')} sqft` : '-'}
          </div>
          <div className="text-[13px] text-slate-500 mt-0.5">Builtup</div>
        </div>
      </div>

      {/* Bottom Body */}
      <div className="flex flex-col md:flex-row p-4 gap-4 sm:gap-6 bg-white relative items-stretch">
        {/* Image container */}
        <Link href={`/properties/${property.id}`} className="block w-full md:w-[320px] shrink-0 relative aspect-[4/3] overflow-hidden bg-slate-100 group">
          <Image 
            src={imageUrl} 
            alt={`Photo of ${property.title}`} 
            fill 
            sizes="(max-width: 768px) 100vw, 320px"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {/* Badges on image */}
          {property.negotiable && (
            <div className="absolute bottom-3 left-3 bg-[#4BA54A] text-white text-[13px] py-1 px-2.5 font-bold flex items-center gap-1 shadow-sm rounded-sm">
                <span className="bg-white text-[#4BA54A] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">₹</span> 
                Negotiable {property.listingFor === 'Rent' ? 'Rent' : 'Price'}
            </div>
          )}
          <div className="absolute bottom-3 right-3 text-white text-xs font-bold bg-black/60 px-2 py-0.5 rounded-sm tracking-widest backdrop-blur-sm">
            1/{rawPhotos.length || 1}
          </div>
        </Link>

        {/* Details Grid & Actions */}
        <div className="flex-grow flex flex-col justify-between pt-2">
          <div className="grid grid-cols-2 border border-slate-200 rounded-sm bg-white mb-2 md:mb-0 shadow-sm relative overflow-hidden">
            {/* Furnished */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 p-4 border-b border-r border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-2 sm:p-2.5 rounded-full shrink-0">
                <Armchair className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                  <span className="font-semibold text-[14px] sm:text-[15px] text-slate-800 leading-tight block">{property.furnishing || 'Unfurnished'}</span>
                  <span className="text-[12px] sm:text-[13px] text-slate-500 block mt-0.5">Furnishing</span>
              </div>
            </div>
            {/* Apartment Type */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-2 sm:p-2.5 rounded-full shrink-0">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                  <span className="font-semibold text-[14px] sm:text-[15px] text-slate-800 leading-tight block">{property.bhk || (property.propertyType === 'PG / Hostel' ? 'PG Status' : 'Standard')}</span>
                  <span className="text-[12px] sm:text-[13px] text-slate-500 block mt-0.5">Apartment Type</span>
              </div>
            </div>
            {/* Preferred Tenants */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 p-4 border-r border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-2 sm:p-2.5 rounded-full shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                  <span className="font-semibold text-[14px] sm:text-[15px] text-slate-800 leading-tight block">{property.preferredTenants || 'Anyone'}</span>
                  <span className="text-[12px] sm:text-[13px] text-slate-500 block mt-0.5">Preferred Tenants</span>
              </div>
            </div>
            {/* Available From */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
              <div className="bg-slate-100 p-2 sm:p-2.5 rounded-full shrink-0">
                <Key className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                  <span className="font-semibold text-[14px] sm:text-[15px] text-slate-800 leading-tight block">
                    {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Immediately'}
                  </span>
                  <span className="text-[12px] sm:text-[13px] text-slate-500 block mt-0.5">Available From</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex flex-row items-center justify-end gap-3 mt-4 md:absolute md:bottom-4 md:right-4 w-full md:w-auto">
            <Link href={`/properties/${property.id}`} className="flex-grow md:flex-grow-0">
              <Button className="w-full md:w-[280px] bg-[#fb3857] hover:bg-[#e4304e] text-white font-bold h-[46px] rounded-sm shadow-none text-[15px] transition-colors">
                Get Owner Details
              </Button>
            </Link>
            <button 
              onClick={handleFavoriteClick} 
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              className={cn("h-[46px] w-[46px] border border-slate-300 rounded-sm flex items-center justify-center shrink-0 hover:border-slate-400 transition-colors bg-white hover:bg-slate-50",
              isFavorited && "border-[#fb3857] hover:border-[#fb3857] bg-rose-50/50 hover:bg-rose-50")}
            >
              <Heart className={cn("h-5 w-5 text-slate-600 transition-colors", isFavorited && "fill-[#fb3857] text-[#fb3857]")} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="w-full bg-white border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-4 border-b bg-slate-50">
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="grid grid-cols-3 border-b text-center py-4">
        <div className="flex flex-col items-center">
            <Skeleton className="h-6 w-24 mb-1.5" />
            <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex flex-col items-center border-l">
            <Skeleton className="h-6 w-20 mb-1.5" />
            <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex flex-col items-center border-l">
            <Skeleton className="h-6 w-20 mb-1.5" />
            <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row p-4 gap-6 items-stretch">
        <Skeleton className="w-full md:w-[320px] aspect-[4/3] rounded-sm shrink-0" />
        <div className="flex-grow flex flex-col justify-between">
           <Skeleton className="h-40 w-full rounded-sm" />
           <div className="flex justify-end gap-3 mt-4">
              <Skeleton className="h-[46px] flex-grow md:w-[280px] md:flex-grow-0 rounded-sm" />
              <Skeleton className="h-[46px] w-[46px] rounded-sm" />
           </div>
        </div>
      </div>
    </div>
  );
}
