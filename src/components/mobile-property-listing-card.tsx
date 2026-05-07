'use client';

import Image from 'next/image';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { getWatermarkedImageUrl } from '@/lib/utils';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MobilePropertyListingCardProps {
  property: Property;
  index?: number;
}

export function MobilePropertyListingCard({ property, index = 0 }: MobilePropertyListingCardProps) {
  const imageUrl = getWatermarkedImageUrl(property.photos?.[0]) || 'https://picsum.photos/seed/property/400/300';
  const viewingCount = (property.id?.charCodeAt(0) || 5) % 20 + 15;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.21, 1.02, 0.73, 1] }}
      className="w-full bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm mb-6 block transition-all active:scale-[0.98] font-body"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] w-full">
        <Image 
          src={imageUrl} 
          alt={property.title} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-0 z-10">
          <div className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-r-md flex items-center gap-1 shadow-lg">
            Preferred By {property.preferredTenants || 'Everyone'}
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-md text-[#2CB6A2] text-[9px] font-bold px-2.5 py-1 rounded-full border border-[#2CB6A2]/20 shadow-sm">
             {property.pgAvailableFor || 'Unisex'}
          </div>
        </div>

        {/* Viewing Indicator */}
        <div className="absolute bottom-3 left-3 z-10">
           <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg flex items-center gap-1.5 text-white shadow-xl">
             <div className="w-1 h-1 rounded-full bg-emerald-400" />
             <span className="text-[9px] font-semibold whitespace-nowrap">{viewingCount} Viewing Now</span>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold text-slate-900 leading-tight truncate">
              {property.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#2CB6A2]" />
              {property.subLocality || property.city}
            </p>
          </div>
          <div className="text-right shrink-0">
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Starts from</p>
             <div className="flex items-baseline justify-end">
               <span className="text-base font-black text-[#2CB6A2]">₹{property.price?.toLocaleString('en-IN')}</span>
               <span className="text-[10px] font-bold text-slate-400">/mo</span>
             </div>
          </div>
        </div>

        {/* Mini Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#2CB6A2] bg-[#F0F9F8] px-2 py-1 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </div>
           </div>
           <Link 
             href={`/properties/${property.id}`}
             className="text-[#2CB6A2] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border-b border-[#2CB6A2]/30"
           >
             View Details
           </Link>
        </div>

        {/* Action Button - Simplified to View Details */}
        <div className="pt-2">
          <Button 
            className="w-full h-10 rounded-xl bg-[#2CB6A2] hover:bg-[#25A08E] text-white font-black text-[10px] uppercase tracking-[0.1em] shadow-lg shadow-[#2CB6A2]/20 active:scale-95 transition-all"
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
