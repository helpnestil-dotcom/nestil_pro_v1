'use client';

import Image from 'next/image';
import { Heart, MapPin, BedDouble, Bath, Building, Users, Navigation, CheckCircle2, Star, Wifi, UtensilsCrossed, Car } from 'lucide-react';
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
      className="w-full bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 mb-6 block transition-all active:scale-[0.98] font-body"
    >
      {/* 1. Image Carousel Section */}
      <div className="relative aspect-[16/11] w-full group">
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
        </Carousel>

        {/* Top Badges (Top Left) */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="px-3 py-1 bg-white text-slate-900 text-[9px] font-black rounded-full shadow-lg">
            PG / Co-living
          </div>
          <div className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full shadow-lg flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </div>
        </div>

        {/* Heart Icon Button (Top Right) */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property.id, isFavorited);
            }}
            className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-xl active:scale-90"
          >
            <Heart className={cn("w-4.5 h-4.5", isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
          </button>
        </div>

        {/* Bottom Metadata Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
           <div className="flex items-center gap-1 mb-1.5">
              <div className="flex items-center gap-1 bg-amber-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                <Star className="w-2.5 h-2.5 fill-white" />
                4.8
              </div>
           </div>
           <h3 className="text-lg font-black text-white tracking-tight mb-0.5 line-clamp-1">
              {property.title}
           </h3>
           <div className="flex items-center text-white/90 text-[10px] font-bold gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              {property.subLocality || property.city}, {property.city}
           </div>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5 space-y-5">
        <div className="flex justify-between items-start">
           <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">₹{property.price?.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-tight">/ month</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">2 Sharing</p>
           </div>
           <div className="bg-slate-50 text-slate-500 text-[9px] font-black px-2.5 py-1 rounded-full border border-slate-100">
              No Brokerage
           </div>
        </div>

        {/* Amenities Pills */}
        <div className="flex gap-2">
           <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl font-black text-[10px]">
              <Wifi className="w-3 h-3" />
              WiFi
           </div>
           <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl font-black text-[10px]">
              <UtensilsCrossed className="w-3 h-3" />
              Food
           </div>
           <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-black text-[10px]">
              <Car className="w-3 h-3" />
              Parking
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-1">
           <Button variant="secondary" className="flex-1 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-[10px] shadow-none">
              Schedule Visit
           </Button>
           <Button asChild className="flex-1 h-12 rounded-2xl bg-black hover:bg-slate-800 text-white font-black text-[10px] shadow-xl">
              <Link href={`/properties/${property.id}`}>
                 View Details
              </Link>
           </Button>
        </div>
      </div>
    </motion.div>
  );
}
