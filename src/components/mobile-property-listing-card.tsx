'use client';

import Image from 'next/image';
import { Heart, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MobilePropertyListingCardProps {
  property: Property;
}

export function MobilePropertyListingCard({ property }: MobilePropertyListingCardProps) {
  const imageUrl = property.photos?.[0] || 'https://picsum.photos/seed/property/400/300';
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm mb-4">
      <div className="relative aspect-[16/9]">
        <Image 
          src={imageUrl} 
          alt={property.title} 
          fill 
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <button className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 shadow-sm">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase rounded-lg shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified
        </div>
      </div>

      <div className="p-5 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">
              ₹{property.price?.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 font-bold">/month</span>
          </div>
          <p className="text-sm font-black text-slate-800">
            {property.bhk} • {property.propertyType}
          </p>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-500">{property.address || property.city}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">1.2 km away</p>
          </div>
        </div>

        <Button className="bg-primary text-white font-black px-8 h-10 rounded-xl shadow-lg shadow-primary/20 text-xs">
          Chat
        </Button>
      </div>
    </div>
  );
}
