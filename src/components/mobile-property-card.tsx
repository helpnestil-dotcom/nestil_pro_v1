'use client';

import Image from 'next/image';
import { Heart, MapPin, CheckCircle2, Star, Wifi, UtensilsCrossed, Car, Phone, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';
import { cn, getWatermarkedImageUrl } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState, useEffect } from 'react';

interface MobilePropertyCardProps {
  property: Property;
  index?: number;
}

export function MobilePropertyCard({ property, index = 0 }: MobilePropertyCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorited = favoriteIds.has(property.id);

  const images = property.photos?.length > 0 
    ? property.photos.map(p => getWatermarkedImageUrl(p)) 
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'];

  const formatPrice = (p: number) => {
    return `₹${new Intl.NumberFormat('en-IN').format(p)}`;
  };

  const currentPrice = property.priceOnRequest || !property.price || property.price <= 0 
    ? 'On Request' 
    : formatPrice(property.price);

  const whatsappNumber = "919492060040"; 
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi, I'm interested in ${property.title}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm mb-6 transition-all active:scale-[0.98]"
    >
      {/* 1. Image Carousel Section */}
      <div className="relative aspect-[16/11] w-full overflow-hidden">
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

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black rounded-full shadow-lg">
              {property.propertyType?.includes('PG') ? 'PG / Co-living' : property.propertyType}
            </div>
            {property.featured && (
              <div className="px-3 py-1 bg-amber-400 text-white text-[9px] font-black rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-white" />
                Featured
              </div>
            )}
          </div>
          <div className="px-3 py-1 bg-accent-green text-white text-[9px] font-black rounded-full shadow-md flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Verified
          </div>
        </div>

        {/* Save Icon */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id, isFavorited);
          }}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 z-10"
        >
          <Heart className={cn("w-4.5 h-4.5", isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
        </button>
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start">
           <div className="space-y-1 flex-1 pr-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight line-clamp-1">
                {property.title}
              </h3>
              <div className="flex items-center text-slate-500 text-[11px] font-bold gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="line-clamp-1">{property.subLocality || property.city} • 1.2 km away</span>
              </div>
           </div>
           <div className="flex items-center gap-1 bg-slate-50 text-slate-700 text-[9px] font-black px-2 py-1 rounded-lg border border-slate-100 shrink-0">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              4.8
           </div>
        </div>

        {/* Amenities chips */}
        <div className="flex gap-2">
           <div className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-xl font-bold text-[9px] border border-slate-100">
              <Wifi className="w-3 h-3" />
              WiFi
           </div>
           <div className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-xl font-bold text-[9px] border border-slate-100">
              <UtensilsCrossed className="w-3 h-3" />
              Food
           </div>
           <div className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2.5 py-1.5 rounded-xl font-bold text-[9px] border border-slate-100">
              <Car className="w-3 h-3" />
              Parking
           </div>
        </div>
      </div>

      {/* 3. Bottom Section */}
      <div className="p-5 pt-0 mt-auto">
        <div className="flex items-center justify-between py-3.5 border-t border-slate-100 mb-4">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Rent</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-slate-900">{currentPrice}</span>
              <span className="text-[9px] font-bold text-slate-400">/mo</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Deposit</p>
            <p className="text-xs font-bold text-slate-700">₹{property.deposit || '9,999'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full h-12 rounded-xl bg-slate-900 text-white font-black text-xs shadow-md">
            <Link href={`/properties/${property.id}`}>
               View Details
               <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" asChild className="h-11 rounded-xl border-slate-200 text-slate-700 font-bold text-[10px] gap-1.5">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild className="h-11 rounded-xl border-slate-200 text-slate-700 font-bold text-[10px] gap-1.5">
              <a href={`tel:${whatsappNumber}`}>
                <Phone className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                Call
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
