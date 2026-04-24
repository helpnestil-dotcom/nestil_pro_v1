
'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, ExternalLink, Flag, Wrench, Building2, Users, Key, Armchair, Calendar, IndianRupee, Tag, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
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
  const { compareList, toggleCompare, addToRecentlyViewed } = useEngagement();

  const isFavorited = favoriteIds.has(property.id);
  const isComparing = compareList.includes(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id, isFavorited);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(property.id);
  };
  
  const handleCardClick = () => {
    addToRecentlyViewed(property.id);
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] transition-all duration-500"
      onClick={handleCardClick}
    >
      {/* Top Image Section */}
      <Link href={`/properties/${property.id}`} className="relative aspect-[4/3] overflow-hidden block">
        <Image 
          src={imageUrl} 
          alt={`Photo of ${property.title}`} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        {/* BHK Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm border border-white/20">
            <Building2 className="w-3 h-3 text-primary" />
            {property.bhk || '1 BHK'}
          </div>
        </div>

        {/* Heart Icon Button */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-4 right-4 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 backdrop-blur-md z-10 border",
            isFavorited 
              ? "bg-white border-primary/20" 
              : "bg-white/80 border-white/20 hover:bg-white"
          )}
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-all duration-300", 
              isFavorited ? "fill-primary text-primary scale-110" : "text-slate-600"
            )} 
          />
        </motion.button>

        {/* Compare Icon Button */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={handleCompareClick}
          className={cn(
            "absolute top-16 right-4 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 backdrop-blur-md z-10 border",
            isComparing 
              ? "bg-slate-900 border-slate-700 text-white" 
              : "bg-white/80 border-white/20 hover:bg-white text-slate-600"
          )}
        >
          <GitCompare className={cn("h-5 w-5", isComparing && "scale-110")} />
        </motion.button>

        {/* Verification Badge */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest rounded-md shadow-sm">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </div>

        {/* Photos Count */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold rounded-lg border border-white/10">
          <img className="h-3 w-3 opacity-80" width={12} height={12} alt="photos" src="https://img.icons8.com/material-outlined/24/ffffff/camera.png" />
          <span>{rawPhotos.length || 1}</span>
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-slate-50/30">
        {/* Price and Maintenance */}
        <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Asking Price</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{currentPrice}</span>
            </div>
            {property.maintenance && property.maintenance > 0 && (
                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] font-bold border border-indigo-100/50">
                    <Tag className="h-3 w-3" />
                    <span>+₹{property.maintenance}</span>
                </div>
            )}
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-[17px] text-slate-800 line-clamp-1 mb-1 group-hover:text-primary transition-colors duration-300">
            {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-[13px] text-slate-500 mb-5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
            <span className="truncate max-w-[150px]">{property.address || property.city}</span>
            <span className="mx-1 opacity-30">•</span>
            <Link href={`/properties/${property.id}`} className="text-primary hover:text-primary/80 font-bold transition-colors">Details</Link>
        </div>

        {/* Premium Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
            {/* Area */}
            <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm group/spec">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/spec:bg-primary/5 transition-colors">
                    <Expand className="h-4 w-4 text-slate-400 group-hover/spec:text-primary transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-black text-slate-800 truncate">{property.areaSqFt?.toLocaleString('en-IN') || '-'} sqft</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Area</span>
                </div>
            </div>
            {/* Furnishing */}
            <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm group/spec">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover/spec:bg-primary/5 transition-colors">
                    <Armchair className="h-4 w-4 text-slate-400 group-hover/spec:text-primary transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-black text-slate-800 truncate">{property.furnishing || 'Unfurnished'}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Status</span>
                </div>
            </div>
        </div>

        {/* CTA Button */}
        <Link href={`/properties/${property.id}`} className="mt-auto block">
          <Button className="w-full bg-slate-900 hover:bg-primary text-white font-black h-12 rounded-xl shadow-lg shadow-slate-200 hover:shadow-primary/20 transition-all duration-300 group/btn">
            <span className="mr-2">Get Owner Details</span>
            <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
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
