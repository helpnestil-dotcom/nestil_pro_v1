'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, CheckCircle2, Sparkles, Star, Wifi, UtensilsCrossed, Car, Phone, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getWatermarkedImageUrl } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { useEngagement } from '@/hooks/use-engagement';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect } from 'react';
import { getAmenityIcon, getAllPropertyAmenities } from '@/lib/amenities-data';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addToRecentlyViewed } = useEngagement();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

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
  const photos = rawPhotos.length > 0 ? rawPhotos.map(p => getWatermarkedImageUrl(p)) : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'];

  const formatPrice = (p: number) => {
    return `₹${new Intl.NumberFormat('en-IN').format(p)}`;
  };

  const currentPrice = property.priceOnRequest || !property.price || property.price <= 0 
    ? 'On Request' 
    : formatPrice(property.price);

  const whatsappNumber = "919492060040"; // Default contact
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi, I'm interested in ${property.title} (${property.id})`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-500"
      onClick={handleCardClick}
    >
      {/* 1. TOP: Image Carousel Section */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {photos.map((src, index) => (
              <div key={index} className="relative flex-[0_0_100%] h-full">
                <Image 
                  src={src} 
                  alt={`${property.title} - ${index + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={priority && index === 0}
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {photos.slice(0, 5).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
              )} 
            />
          ))}
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black rounded-full shadow-sm">
              {property.propertyType?.includes('PG') ? 'PG / Co-living' : property.propertyType}
            </div>
            {property.featured && (
              <div className="px-3 py-1 bg-amber-400 text-white text-[10px] font-black rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-white" />
                Featured
              </div>
            )}
          </div>
          <div className="px-3 py-1 bg-accent-green text-white text-[10px] font-black rounded-full shadow-sm flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </div>
        </div>

        {/* Save Icon */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm z-10 transition-all hover:scale-110 active:scale-95"
        >
          <Heart className={cn("h-5 w-5 transition-colors", isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
        </button>
      </div>

      {/* 2. MIDDLE: Property Info */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-slate-500 text-xs font-bold gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="line-clamp-1">{property.subLocality || property.city} • 1.2 km away</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-slate-50 text-slate-700 text-[10px] font-black px-2 py-1 rounded-lg border border-slate-100 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            4.8
          </div>
        </div>

        {/* Amenities Chips */}
        <div className="flex flex-wrap gap-2 mt-1 min-h-[30px]">
          {(() => {
            const allAmenities = getAllPropertyAmenities(property);
            return allAmenities.length > 0 ? (
              allAmenities.slice(0, 3).map((amenity) => {
                const Icon = getAmenityIcon(amenity);
                return (
                  <div key={amenity} className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-xl font-bold text-[10px] border border-slate-100">
                    <Icon className="w-3 h-3" />
                    {amenity}
                  </div>
                );
              })
            ) : (
              <div className="text-[10px] text-slate-400 font-medium italic py-1.5 px-1">
                Essential amenities included
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. BOTTOM: Price & Actions */}
      <div className="p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between py-4 border-t border-slate-100 mb-4">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{currentPrice}</span>
              <span className="text-[10px] font-bold text-slate-400">/mo</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Deposit</p>
            <p className="text-sm font-bold text-slate-700">₹{property.deposit || '9,999'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full h-12 rounded-xl bg-slate-900 hover:bg-primary text-white font-black text-xs shadow-md transition-all">
            <Link href={`/properties/${property.id}`}>
               View Details
               <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild className="h-11 rounded-xl border-slate-200 text-slate-700 font-bold text-[11px] gap-1.5 hover:bg-slate-50">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild className="h-11 rounded-xl border-slate-200 text-slate-700 font-bold text-[11px] gap-1.5 hover:bg-slate-50">
              <a href={`tel:${whatsappNumber}`}>
                <Phone className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                Call Owner
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
      <Skeleton className="aspect-[16/11] w-full" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1 mr-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-7 w-16 rounded-xl" />
            <Skeleton className="h-7 w-16 rounded-xl" />
            <Skeleton className="h-7 w-16 rounded-xl" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between">
            <div className="space-y-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-7 w-24" />
            </div>
            <div className="space-y-1 text-right">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-16" />
            </div>
        </div>
        <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
            </div>
        </div>
      </div>
    </div>
  );
}
