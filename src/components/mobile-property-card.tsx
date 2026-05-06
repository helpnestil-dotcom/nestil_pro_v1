'use client';

import Image from 'next/image';
import { Heart, MapPin, CheckCircle2, BedDouble, Bath, Ruler, Building, Tag, Users, Phone, ChevronRight, Eye, Zap, Flame, MessageSquare } from 'lucide-react';
import { cn, getWatermarkedImageUrl } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { useFavorites } from '@/hooks/use-favorites';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { Button } from '@/components/ui/button';

interface MobilePropertyCardProps {
  property: Property;
}

export function MobilePropertyCard({ property }: MobilePropertyCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorited = favoriteIds.has(property.id);

  const imageUrl = getWatermarkedImageUrl(property.photos?.[0]) || 'https://picsum.photos/seed/property/400/300';
  
  const getPostedTime = (dateInput: any) => {
    if (!dateInput) return 'Recently';
    try {
      if (typeof dateInput === 'string') return formatDistanceToNow(new Date(dateInput), { addSuffix: true });
      if (dateInput.seconds) return formatDistanceToNow(fromUnixTime(dateInput.seconds), { addSuffix: true });
    } catch {
      return 'Recently';
    }
    return 'Recently';
  };

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 mb-5 block transition-all active:scale-[0.98]">
      {/* Image Section */}
      <div className="relative aspect-[16/10] w-full">
        <Image 
          src={imageUrl} 
          alt={property.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        
        {/* Top Right: Heart */}
        <div className="absolute top-3 right-3">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property.id, isFavorited);
            }}
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 backdrop-blur-md",
              isFavorited ? "bg-red-500 text-white" : "bg-white/90 text-slate-700 hover:bg-white"
            )}
          >
            <Heart className={cn("w-4.5 h-4.5", isFavorited && "fill-current")} />
          </button>
        </div>

        {/* Bottom Left over Image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-2xl font-bold font-heading tracking-tight">₹{property.price?.toLocaleString('en-IN') || '30,000'}</span>
              <span className="text-xs font-medium text-white/70">/mo</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 pb-0.5">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-lg">
              <Eye className="w-3 h-3" />
              {(property.id?.charCodeAt(0) || 5) % 10 + 3} viewing
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title and Time */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold font-heading text-slate-800 leading-tight">{property.bhk || '1 BHK'} Flat</h3>
              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">ID: {property.id?.slice(0, 4).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-primary/70" />
              <span className="truncate">{property.address || property.city || 'Manyata, Bengaluru'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-emerald-700 font-bold uppercase">{getPostedTime(property.postedAt || property.dateAdded)}</span>
            </div>
          </div>
        </div>

        {/* 4 Columns Details */}
        <div className="grid grid-cols-4 gap-2 py-1">
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50">
            <BedDouble className="w-4 h-4 text-slate-400 mb-1" />
            <span className="text-xs font-bold text-slate-800">{property.beds || property.bhk?.charAt(0) || '1'}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50">
            <Bath className="w-4 h-4 text-slate-400 mb-1" />
            <span className="text-xs font-bold text-slate-800">{property.baths || '1'}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50">
            <Ruler className="w-4 h-4 text-slate-400 mb-1" />
            <span className="text-xs font-bold text-slate-800">{property.areaSqFt || '650'}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Sqft</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50">
            <Tag className="w-4 h-4 text-slate-400 mb-1" />
            <span className="text-xs font-bold text-slate-800 line-clamp-1 truncate w-full text-center px-1">{(property.furnishing || 'Semi').split(' ')[0]}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Type</span>
          </div>
        </div>

        {/* Owner Profile Section */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 p-0.5 overflow-hidden">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${property.ownerName || 'owner'}`} 
                alt="Owner" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Owner</span>
              <span className="text-xs font-bold text-slate-800 leading-none">{property.ownerName || 'Verified Host'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-violet-600 px-2.5 py-1 bg-violet-50 rounded-full border border-violet-200 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VERIFIED
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Button 
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all"
            asChild
          >
            <Link href={`/properties/${property.id}`}>
              <>
                View Details
                <ChevronRight className="w-4 h-4" />
              </>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
