'use client';

import Image from 'next/image';
import { Heart, MapPin, CheckCircle2, BedDouble, Bath, Ruler, Building, Tag, Users, Phone, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

interface MobilePropertyCardProps {
  property: Property;
}

export function MobilePropertyCard({ property }: MobilePropertyCardProps) {
  const imageUrl = property.photos?.[0] || 'https://picsum.photos/seed/property/400/300';
  
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
    <div className="w-full bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 mb-4 block">
      {/* Image Section */}
      <div className="relative aspect-[16/9] w-full">
        <Image 
          src={imageUrl} 
          alt={property.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Left: Verified */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e] text-white text-[11px] font-bold tracking-wide rounded-full shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VERIFIED
          </div>
        </div>

        {/* Top Right: Heart */}
        <div className="absolute top-4 right-4">
          <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-lg hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Left over Image */}
        <div className="absolute bottom-4 left-4 space-y-2">
          <div className="flex items-baseline gap-1.5 text-white">
            <span className="text-3xl font-black tracking-tight">₹{property.price?.toLocaleString('en-IN') || '30,000'}</span>
            <span className="text-sm font-medium text-white/80">/month</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-medium rounded-full">
            <MapPin className="w-3.5 h-3.5 text-green-400" />
            1.2 km from your location
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4 bg-white">
        {/* Title and Time */}
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-800">{property.bhk || '1 BHK'} Flat</h3>
              <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">ID: NTL-P{property.id?.slice(0, 6).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {property.address || property.city || 'Manyata, Bengaluru'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-full shrink-0">
            <div className="w-1 h-1 rounded-full bg-green-500" />
            <span className="text-[9px] text-slate-600 font-semibold">{getPostedTime(property.postedAt || property.dateAdded)}</span>
          </div>
        </div>

        {/* 4 Columns Details */}
        <div className="grid grid-cols-4 divide-x divide-slate-100 py-2 border-b border-slate-100">
          <div className="flex flex-col items-center gap-1.5 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <BedDouble className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-800">{property.beds || property.bhk?.charAt(0) || '1'}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Bedroom</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-2">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <Bath className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-800">{property.baths || '1'}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Bathroom</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-2">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <Ruler className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-800">{property.areaSqFt || '650'}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Sqft</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 px-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Building className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-800">{property.floor || '2nd'}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Floor</span>
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 pt-1 px-1">
          <div className="flex items-center gap-1.5 text-green-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Property
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {property.furnishing || 'Semi Furnished'}
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {property.preferredTenants || 'Family Preferred'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <a href="tel:+919876543210" className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-primary text-primary font-bold text-xs bg-white hover:bg-primary/5 transition-colors">
            <Phone className="w-3.5 h-3.5" />
            Call Now
          </a>
          <Link href={`/properties/${property.id}`} className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#3b82f6] text-white font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-600 transition-colors">
            View Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
