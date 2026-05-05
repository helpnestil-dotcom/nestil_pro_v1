'use client';

import Image from 'next/image';
import { Heart, MapPin, CheckCircle2, BedDouble, Bath, Ruler, Building, Tag, Users, Phone, ChevronRight, Eye, Zap, Flame, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { Button } from '@/components/ui/button';

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
        
        {/* Top Left: Verified Owner Badge (Large & Prominent) */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black tracking-[0.15em] rounded-2xl shadow-xl shadow-emerald-500/30 border border-white/20">
            <CheckCircle2 className="w-4 h-4" />
            VERIFIED OWNER
          </div>
        </div>

        {/* Top Right: Heart */}
        <div className="absolute top-4 right-4">
          <button className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow-lg hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Left over Image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-1.5 text-white">
              <span className="text-3xl font-black tracking-tight">₹{property.price?.toLocaleString('en-IN') || '30,000'}</span>
              <span className="text-sm font-medium text-white/80">/month</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              1.2 km from your location
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 pb-0.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-lg animate-bounce">
              <Eye className="w-3.5 h-3.5" />
              {Math.floor(Math.random() * 10) + 3} viewed today
            </div>
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
              <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase">NTL-ID: {property.id?.slice(0, 4).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {property.address || property.city || 'Manyata, Bengaluru'}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-full shrink-0 border border-green-100">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-green-700 font-bold uppercase tracking-tight">{getPostedTime(property.postedAt || property.dateAdded)}</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              <Users className="w-3 h-3" />
              {Math.floor(Math.random() * 15) + 5} people contacted
            </div>
          </div>
        </div>

        {/* Owner Profile Section (Trust Builder) */}
        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 p-0.5 overflow-hidden shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${property.ownerName || 'owner'}`} 
                alt="Owner" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Posted By</span>
              <span className="text-xs font-black text-slate-800 leading-none">{property.ownerName || 'Verified Host'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            Identity Verified
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

        {/* Urgency and Badges Row */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl border border-red-100 animate-pulse">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-wide">Last booked 2 hrs ago • Only few units left!</span>
          </div>

          {/* Single Action Button: View Details */}
          <div className="pt-2">
            <Button 
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              asChild
            >
              <Link href={`/properties/${property.id}`}>
                <>
                  VIEW DETAILS
                  <ChevronRight className="w-4 h-4" />
                </>
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 px-1">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {property.furnishing || 'Semi Furnished'}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {property.preferredTenants || 'All Welcome'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
