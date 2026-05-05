'use client';

import Image from 'next/image';
import { BedDouble, Bath, Expand, MapPin, Share2, Heart, ArrowLeft, CheckCircle2, Tag, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Property } from '@/lib/types';
import { MobileContactActions } from '@/components/mobile-contact-actions';
import { MobilePropertyCard } from '@/components/mobile-property-card';

interface MobilePropertyDetailsProps {
  property: Property;
  similarProperties?: Property[];
}

export function MobilePropertyDetails({ property, similarProperties = [] }: MobilePropertyDetailsProps) {
  const router = useRouter();
  const photos = property.photos || ['https://picsum.photos/seed/property/800/600'];

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      {/* Sticky Header with Actions */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 pointer-events-none">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-white/80 backdrop-blur-md shadow-sm pointer-events-auto"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Button>
        <div className="flex items-center gap-2 pointer-events-auto">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/80 backdrop-blur-md shadow-sm">
            <Share2 className="w-5 h-5 text-slate-700" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/80 backdrop-blur-md shadow-sm">
            <Heart className="w-5 h-5 text-slate-700" />
          </Button>
        </div>
      </div>

      {/* Property ID Badge (Floating) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-slate-900/80 backdrop-blur-md text-[9px] font-black text-white px-3 py-1 rounded-full border border-white/20 tracking-[0.2em] shadow-lg flex items-center gap-2">
          NTL-ID: {property.id?.slice(0, 8).toUpperCase()}
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full aspect-[4/3] bg-slate-100">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {photos.map((photo, i) => (
              <CarouselItem key={i} className="h-full relative">
                <Image src={photo} alt={`${property.title} - ${i}`} fill sizes="100vw" className="object-cover" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-4 left-5 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase rounded-lg shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 space-y-6 bg-white rounded-t-[40px] -mt-10 relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {property.bhk} {property.propertyType}
            </h1>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
               <CheckCircle2 className="w-3 h-3" />
               APPROVED
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-primary">₹{property.price?.toLocaleString('en-IN')}</span>
            <span className="text-sm text-slate-400 font-bold tracking-tight">/month</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
            </div>
            {property.address}, {property.city}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-4 gap-3 py-6 border-y border-slate-50">
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100/50"><BedDouble className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">{property.bhk?.split(' ')[0]} BHK</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-100/50"><Bath className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">{property.baths || '2'} Bath</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50"><Expand className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">{property.areaSqFt} Sqft</span>
           </div>
           <div className="flex flex-col items-center gap-2">
             <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50"><Tag className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">{property.furnishing || 'Semi'}</span>
           </div>
        </div>

        {/* About Property */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">About Property</h2>
            <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
          </div>
          <p className="text-sm text-slate-600 leading-[1.6] font-medium">
            {property.description || 'This premium property features modern design, spacious layouts, and high-quality finishes throughout. Perfect for families looking for comfort and style.'}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
             <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Availability</span>
                <span className="text-[11px] font-black text-slate-800">Immediately</span>
             </div>
             <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Facing</span>
                <span className="text-[11px] font-black text-slate-800">East Facing</span>
             </div>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Last updated 2 hrs ago</span>
            </div>
            <span className="text-[10px] text-slate-300 font-black tracking-widest">#{property.id?.slice(0, 6).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="px-5 py-8 border-t border-slate-100 bg-slate-50">
          <h2 className="text-xl font-black text-slate-900 mb-4">Similar Properties</h2>
          <div className="flex flex-col gap-4">
            {similarProperties.map((prop) => (
              <MobilePropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions */}
      <MobileContactActions 
          propertyId={property.id || ''} 
          isPaid={!!property.isPaid} 
          propertyPath={`/properties/${property.id}`}
          title={property.title || 'Property'}
          isRent={property.listingFor === 'Rent'}
          price={property.price || 0}
          address={`${property.address}, ${property.city}`}
          type={property.propertyType || ''}
          bhk={property.bhk || ''}
          furnishing={property.furnishing || 'N/A'}
      />
    </div>
  );
}
