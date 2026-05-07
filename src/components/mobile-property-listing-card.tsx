'use client';

import Image from 'next/image';
import { Heart, MapPin, CheckCircle2 } from 'lucide-react';
import { cn, getWatermarkedImageUrl } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MobilePropertyListingCardProps {
  property: Property;
}

export function MobilePropertyListingCard({ property }: MobilePropertyListingCardProps) {
  const imageUrl = getWatermarkedImageUrl(property.photos?.[0]) || 'https://picsum.photos/seed/property/400/300';
  
  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 mb-5 active:scale-[0.98] transition-all">
        {/* Image Section */}
        <div className="relative aspect-[16/10]">
          <Image 
            src={imageUrl} 
            alt={property.title} 
            fill 
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 right-4">
            <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 shadow-lg border border-white/20">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-xl shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
            <div className="space-y-0.5">
               <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">₹{property.price?.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-bold text-white/80">/mo</span>
               </div>
               <div className="flex items-center gap-1 text-[10px] font-bold text-white/90 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg w-max">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {property.city}
               </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800 leading-tight line-clamp-1">{property.title}</h3>
              <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                {property.address}
              </p>
            </div>
            <div className="bg-primary/5 text-primary text-[10px] font-black px-2.5 py-1 rounded-lg border border-primary/10">
              {property.listingFor?.toUpperCase()}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Type</span>
                <span className="text-xs font-black text-slate-800">{property.bhk || property.propertyType?.split(' ')[0]}</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Area</span>
                <span className="text-xs font-black text-slate-800">{property.areaSqFt} <span className="text-[9px] text-slate-400 font-bold">sqft</span></span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</span>
                <span className="text-xs font-black text-slate-800">{property.furnishing?.split(' ')[0] || 'Semi'}</span>
              </div>
            </div>
            
            <Button className="bg-slate-900 text-white font-black px-6 h-10 rounded-2xl shadow-xl shadow-slate-200 text-[10px] uppercase tracking-wider">
              Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
