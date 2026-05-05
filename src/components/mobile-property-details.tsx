'use client';

import Image from 'next/image';
import { BedDouble, Bath, Expand, MapPin, Share2, Heart, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-white min-h-screen pb-32">
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
      <div className="px-5 pt-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 leading-tight">
            {property.bhk} {property.propertyType}
          </h1>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary">₹{property.price?.toLocaleString('en-IN')}</span>
            <span className="text-sm text-slate-400 font-bold">/month</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            {property.address}, {property.city}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter pt-1 flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            1.1 km from your location
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-4 gap-2 py-4 border-y border-slate-100">
           <div className="flex flex-col items-center gap-1">
             <div className="p-2.5 rounded-2xl bg-slate-50 text-slate-600"><BedDouble className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-900">{property.bhk?.split(' ')[0]} Beds</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <div className="p-2.5 rounded-2xl bg-slate-50 text-slate-600"><Bath className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-900">{property.baths || '2'} Baths</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <div className="p-2.5 rounded-2xl bg-slate-50 text-slate-600"><Expand className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-900">{property.areaSqFt} Sq.ft</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <div className="p-2.5 rounded-2xl bg-slate-50 text-slate-600"><BedDouble className="w-5 h-5" /></div>
             <span className="text-[10px] font-black text-slate-900">{property.furnishing || 'Semi Furnished'}</span>
           </div>
        </div>

        {/* About Property */}
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900">About Property</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {property.description || 'Spacious 2BHK flat with balcony, modular kitchen, power backup, lift and parking.'}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Posted 2 hrs ago</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Property ID. N12345</span>
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
