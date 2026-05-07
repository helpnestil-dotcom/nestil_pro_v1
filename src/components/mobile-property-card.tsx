'use client';

import Image from 'next/image';
import { Heart, MapPin, BedDouble, Bath, Building, Users, Navigation } from 'lucide-react';
import { cn, getWatermarkedImageUrl } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { useFavorites } from '@/hooks/use-favorites';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MobilePropertyCardProps {
  property: Property;
  index?: number;
}

export function MobilePropertyCard({ property, index = 0 }: MobilePropertyCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorited = favoriteIds.has(property.id);

  const images = property.photos?.length > 0 
    ? property.photos.map(p => getWatermarkedImageUrl(p) || 'https://picsum.photos/seed/property/400/300') 
    : ['https://picsum.photos/seed/property/400/300'];
    
  const viewingCount = (property.id?.charCodeAt(0) || 5) % 20 + 10;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.21, 1.02, 0.73, 1] }}
      className="w-full bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm mb-6 block transition-all active:scale-[0.98] font-body"
    >
      {/* Image Carousel Section */}
      <div className="relative aspect-[16/10] w-full group">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full ml-0">
            {images.map((img, idx) => (
              <CarouselItem key={idx} className="h-full pl-0">
                <div className="relative h-full w-full">
                  <Image 
                    src={img} 
                    alt={`${property.title} - ${idx + 1}`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CarouselPrevious className="relative left-0 bg-white/60 border-none h-8 w-8 backdrop-blur-md text-slate-800" />
            <CarouselNext className="relative right-0 bg-white/40 border-none h-8 w-8 backdrop-blur-md text-slate-800" />
          </div>
        </Carousel>

        {/* Top Left: Preferred Badge */}
        <div className="absolute top-4 left-0 z-10">
          <div className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-r-md flex items-center gap-1.5 shadow-lg">
            <Users className="w-3 h-3 text-[#2CB6A2]" />
            {property.preferredTenants || 'Everyone'}
          </div>
        </div>

        {/* Top Right: Gender & Heart */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
          <div className="bg-white/90 backdrop-blur-md text-[#2CB6A2] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#2CB6A2]/20 shadow-sm flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-[#2CB6A2] animate-pulse" />
             {property.pgAvailableFor || 'Unisex'}
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property.id, isFavorited);
            }}
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 backdrop-blur-md",
              isFavorited ? "bg-red-500 text-white" : "bg-white/80 text-slate-700"
            )}
          >
            <Heart className={cn("w-4.5 h-4.5", isFavorited && "fill-current")} />
          </button>
        </div>

        {/* Bottom Overlay: Viewing Indicator */}
        <div className="absolute bottom-3 left-3 z-10">
           <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg flex items-center gap-2 text-white shadow-xl">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
             <span className="text-[10px] font-bold whitespace-nowrap">{viewingCount} Viewing Now</span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title and Pricing */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight truncate">
              {property.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2CB6A2]" />
              {property.subLocality || property.city}
            </p>
          </div>
          <div className="text-right shrink-0">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Starts from</p>
             <div className="flex items-baseline justify-end gap-0.5">
               <span className="text-lg font-black text-[#2CB6A2]">₹{property.price?.toLocaleString('en-IN')}</span>
               <span className="text-xs font-bold text-slate-400">/mo</span>
             </div>
          </div>
        </div>

        {/* View Directions Link */}
        <div className="flex justify-start border-t border-slate-50 pt-3">
           <Link 
             href={property.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
             target="_blank"
             className="text-[#2CB6A2] text-xs font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
           >
             <Navigation className="w-3.5 h-3.5" />
             View Directions
           </Link>
        </div>

        {/* Amenity & Occupancy Pills */}
        <div className="flex flex-wrap gap-2">
           {(property.attachedBathroom || true) && (
             <div className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-100">
               <Bath className="w-3.5 h-3.5 text-[#2CB6A2]" />
               Washroom
             </div>
           )}
           {property.balcony && (
             <div className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-100">
               <Building className="w-3.5 h-3.5 text-[#2CB6A2]" />
               Balcony
             </div>
           )}
           <div className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5">
             <BedDouble className="w-3.5 h-3.5 text-[#2CB6A2]" />
             Single / Double
           </div>
        </div>

        {/* Action Button - Simplified to View Details */}
        <div className="pt-2">
          <Button 
            className="w-full h-12 rounded-xl bg-[#2CB6A2] hover:bg-[#25A08E] text-white font-black text-xs uppercase tracking-[0.1em] shadow-lg shadow-[#2CB6A2]/20 active:scale-95 transition-all"
            asChild
          >
            <Link href={`/properties/${property.id}`}>
              VIEW DETAILS
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
