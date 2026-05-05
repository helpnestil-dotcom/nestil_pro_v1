'use client';

import Image from 'next/image';
import { Heart, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';

interface MobilePropertyCardProps {
  property: Property;
}

export function MobilePropertyCard({ property }: MobilePropertyCardProps) {
  const imageUrl = property.photos?.[0] || 'https://picsum.photos/seed/property/400/300';
  
  return (
    <Link 
      href={`/properties/${property.id}`}
      className="flex-shrink-0 w-[240px] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3]">
        <Image 
          src={imageUrl} 
          alt={property.title} 
          fill 
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <button className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-[8px] font-bold uppercase rounded shadow-sm">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </div>
      </div>

      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-slate-900">
              ₹{property.price?.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">/month</span>
          </div>
        </div>

        <p className="text-[11px] font-bold text-slate-800 line-clamp-1">
          {property.bhk} • {property.propertyType}
        </p>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="truncate">{property.address || property.city}</span>
          </div>
          <p className="text-[9px] text-slate-400 font-medium">
            1.2 km from your location
          </p>
        </div>

        <div className="pt-1 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-[9px] text-slate-400 font-medium">Posted 2 hrs ago</span>
        </div>
      </div>
    </Link>
  );
}
