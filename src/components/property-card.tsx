
'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, CheckCircle2, Sparkles, Star, Wifi, UtensilsCrossed, Car } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getWatermarkedImageUrl } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { useEngagement } from '@/hooks/use-engagement';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addToRecentlyViewed } = useEngagement();

  const isFavorited = favoriteIds.has(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id, isFavorited);
  };
  
  const handleCardClick = () => {
    addToRecentlyViewed(property.id);
  };
  
  const rawPhotos = property.photos && property.photos.length > 0 ? property.photos : [];
  const photos = rawPhotos.length > 0 ? rawPhotos.map(p => getWatermarkedImageUrl(p)) : ['https://picsum.photos/seed/property/600/400'];
  const imageUrl = photos[0];

  const formatPrice = (p: number) => {
    return `₹${new Intl.NumberFormat('en-IN').format(p)}`;
  };

  const currentPrice = property.priceOnRequest || !property.price || property.price <= 0 
    ? 'On Request' 
    : formatPrice(property.price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-300"
      onClick={handleCardClick}
    >
      {/* 1. Image Section */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={property.title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        
        {/* Overlay Badges (Top Left) */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="px-4 py-1.5 bg-white text-slate-900 text-[10px] font-black rounded-full shadow-lg">
            {property.propertyType?.includes('PG') ? 'PG / Co-living' : property.propertyType}
          </div>
          <div className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </div>
        </div>

        {/* Favorite Button (Top Right) */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-xl z-10 transition-transform active:scale-90"
        >
          <Heart className={cn("h-5 w-5", isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
        </button>

        {/* Bottom Metadata Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
           <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-1 bg-amber-400/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-white" />
                4.8
              </div>
           </div>
           <h3 className="text-xl font-black text-white tracking-tight mb-1 line-clamp-1">
              {property.title}
           </h3>
           <div className="flex items-center text-white/90 text-xs font-bold gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {property.subLocality || property.city}, {property.city}
           </div>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
           <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900">{currentPrice}</span>
                <span className="text-xs font-bold text-slate-400 tracking-tight">/ month</span>
              </div>
              <p className="text-xs font-bold text-slate-400 mt-1">2 Sharing</p>
           </div>
           <div className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-100">
              No Brokerage
           </div>
        </div>

        {/* Amenities Pills */}
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-black text-[11px]">
              <Wifi className="w-3.5 h-3.5" />
              WiFi
           </div>
           <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl font-black text-[11px]">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Food
           </div>
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl font-black text-[11px]">
              <Car className="w-3.5 h-3.5" />
              Parking
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
           <Button variant="secondary" className="flex-1 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs shadow-none">
              Schedule Visit
           </Button>
           <Button asChild className="flex-1 h-14 rounded-2xl bg-black hover:bg-slate-800 text-white font-black text-xs shadow-xl">
              <Link href={`/properties/${property.id}`}>
                 View Details
              </Link>
           </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-end">
            <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-md" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-2 gap-2 mt-2">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

// Additional helper components if needed
function Expand({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21m0 0h4.8M3 21l6-6"/><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/><path d="M3 7.8V3m0 0h4.8M3 3l6 6"/>
        </svg>
    )
}

function GitCompare({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>
        </svg>
    )
}
