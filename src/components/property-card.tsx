'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, ExternalLink, Flag, Wrench, Building2, Users, Key, Armchair, Calendar, IndianRupee, Tag } from 'lucide-react';
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
    <div className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Top Image Section */}
      <Link href={`/properties/${property.id}`} className="relative aspect-[3/2] overflow-hidden block">
        <Image 
          src={imageUrl} 
          alt={`Photo of ${property.title}`} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* BHK Badge */}
        <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
          {property.bhk || '1 BHK'}
        </div>

        {/* Heart Icon Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors backdrop-blur-sm z-10"
        >
          <Heart className={cn("h-4 w-4 text-slate-600 transition-colors", isFavorited && "fill-[#fb3857] text-[#fb3857]")} />
        </button>

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
          <img className="h-3 w-3" width={12} height={12} alt="photos" src="https://img.icons8.com/material-outlined/24/ffffff/camera.png" />
          1/{rawPhotos.length || 1}
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Price and Maintenance */}
        <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold text-slate-900">{currentPrice}</span>
            {property.maintenance && property.maintenance > 0 && (
                <div className="flex items-center gap-1 bg-[#f1f0ff] text-[#6d62ea] px-2 py-0.5 rounded text-[11px] font-semibold">
                    <span>+ ₹{property.maintenance}</span>
                    <Tag className="h-3 w-3" />
                </div>
            )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-[15px] text-slate-800 line-clamp-1 mb-1">
            {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-[13px] text-slate-500 mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{property.address || property.city}</span>
            <span className="mx-1">•</span>
            <Link href={`/properties/${property.id}`} className="text-primary hover:underline font-medium">Explore Nearby</Link>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 border border-slate-100 rounded-lg overflow-hidden bg-slate-50/30 mb-4">
            {/* Area */}
            <div className="p-2 border-b border-r border-slate-100 flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                    <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-slate-800 truncate">{property.areaSqFt?.toLocaleString('en-IN') || '-'} sqft</span>
                    <span className="text-[10px] text-slate-500 leading-none">Builtup</span>
                </div>
            </div>
            {/* Furnishing */}
            <div className="p-2 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                    <Armchair className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-slate-800 truncate">{property.furnishing || 'Unfurnished'}</span>
                    <span className="text-[10px] text-slate-500 leading-none">Furnishing</span>
                </div>
            </div>
            {/* Deposit */}
            <div className="p-2 border-r border-slate-100 flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                    <IndianRupee className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-slate-800 truncate">{property.deposit ? formatPrice(property.deposit) : '-'}</span>
                    <span className="text-[10px] text-slate-500 leading-none">Deposit</span>
                </div>
            </div>
            {/* Available From */}
            <div className="p-2 flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-slate-800 truncate">
                        {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Immediately'}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-none">Available From</span>
                </div>
            </div>
        </div>

        {/* CTA Button */}
        <Link href={`/properties/${property.id}`} className="mt-auto">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 rounded-lg shadow-none text-[14px] transition-colors">
            Get Owner Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="aspect-[3/2] w-full" />
      <div className="p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-2 gap-2 mt-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}

