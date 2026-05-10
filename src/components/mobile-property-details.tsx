'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BedDouble, Bath, Expand, MapPin, Share2, Heart, ArrowLeft, CheckCircle2, Tag, User, Users, UtensilsCrossed, Soup, Wifi, Zap, Camera, Waves, Tv, Wind, ShieldCheck, Car, Dumbbell, Building, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { UserNav } from './user-nav';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn, getWatermarkedImageUrl } from '@/lib/utils';
import { Property } from '@/lib/types';
import { MobileContactActions } from '@/components/mobile-contact-actions';
import { MobilePropertyCard } from '@/components/mobile-property-card';
import { getAllPropertyAmenities, getAmenityIcon } from '@/lib/amenities-data';

interface MobilePropertyDetailsProps {
  property: Property;
  similarProperties?: Property[];
}

export function MobilePropertyDetails({ property, similarProperties = [] }: MobilePropertyDetailsProps) {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const photos = (property.photos && property.photos.length > 0) 
    ? property.photos.map(p => getWatermarkedImageUrl(p)) 
    : ['https://picsum.photos/seed/property/800/600'];
    
  const isPG = property.listingFor === 'PG';


  return (
    <div className="bg-slate-50 min-h-screen pb-40">
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
          <UserNav />
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
        <div className="absolute bottom-14 left-5 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase rounded-lg shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-8 space-y-8 bg-white rounded-t-[40px] -mt-10 relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        
        {/* 1. Price & Title Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {property.bhk && !property.title?.includes(property.bhk) ? `${property.bhk} ` : ''}
              {property.title || property.propertyType}
            </h1>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shrink-0">
               <CheckCircle2 className="w-3 h-3" />
               APPROVED
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-primary tracking-tighter">₹{property.price?.toLocaleString('en-IN')}</span>
            <span className="text-sm text-slate-400 font-bold tracking-tight">{property.listingFor === 'Sale' ? '' : '/month'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
            </div>
            {property.subLocality || property.city}, {property.city}
          </div>
          
          {property.smartTags && property.smartTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {property.smartTags.map(tag => (
                <span key={tag} className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-100/50">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. Key Details (Specs Grid) */}
        <div className="grid grid-cols-4 gap-3 p-1">
           <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
             <BedDouble className="w-5 h-5 text-indigo-600" />
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">{property.bhk?.split(' ')[0] || '1'} BHK</span>
           </div>
           <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
             <Bath className="w-5 h-5 text-cyan-600" />
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">{property.baths || '2'} Bath</span>
           </div>
           <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
             <Tag className="w-5 h-5 text-amber-600" />
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">{property.furnishing || 'Semi'}</span>
           </div>
           <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
             <Building className="w-5 h-5 text-emerald-600" />
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-tighter text-center">Floor {property.floor || '2'}</span>
           </div>
        </div>

        {/* 3. Amenities Section */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Amenities</h2>
            <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
          </div>
          
          <div className="grid grid-cols-3 gap-y-6 gap-x-4">
            {(() => {
              const allAmenities = getAllPropertyAmenities(property);
              return allAmenities.length > 0 ? (
                allAmenities.map((amenity, i) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter text-center leading-tight">{amenity}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Essential utilities included</p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 4. Rooms & Pricing (PG Details) */}
        {isPG && (
            <div className="space-y-8">
                {/* Food Details Banner */}
                {property.foodIncluded && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Food Excellence</h2>
                            <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-[32px] p-6 text-white shadow-xl shadow-orange-200/50 relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md">
                                            <UtensilsCrossed className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Homely Meals</span>
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">Food Included</h3>
                                    <p className="text-orange-50 text-[11px] font-medium opacity-90 max-w-[200px]">Healthy & hygienic North & South Indian meals served daily.</p>
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                    <Soup className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sharing & Pricing Section */}
                {property.pgSharingPrices && Object.values(property.pgSharingPrices).some(price => price !== undefined && price > 0) && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Sharing & Pricing</h2>
                            <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries({
                                single: { label: '1 Sharing', icon: User },
                                double: { label: '2 Sharing', icon: Users },
                                triple: { label: '3 Sharing', icon: Users },
                                four: { label: '4 Sharing', icon: Users },
                                five: { label: '5+ Sharing', icon: Users }
                            }).map(([key, info]) => {
                                const price = (property.pgSharingPrices as any)?.[key];
                                if (!price) return null;
                                const Icon = info.icon;
                                
                                return (
                                    <div 
                                        key={key}
                                        className="relative group p-4 rounded-[24px] bg-white border-2 border-slate-100 hover:border-primary/30 transition-all shadow-sm active:scale-95"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-primary group-hover:bg-primary/10 transition-all flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.label}</p>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-lg font-black text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">/mo</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* 5. About Property */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">About Property</h2>
            <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
          </div>
          <p className="text-sm text-slate-600 leading-[1.6] font-medium">
            {property.description || 'This premium property features modern design, spacious layouts, and high-quality finishes throughout. Perfect for residents looking for comfort and style.'}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Availability</span>
                <span className="text-[11px] font-black text-slate-800">Immediate Move-in</span>
             </div>
             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Deposit</span>
                <span className="text-[11px] font-black text-slate-800">1 Month Rent</span>
             </div>
          </div>
        </div>

        {/* 6. Location & Map Section */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Location Details</h2>
            <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
          </div>
          
          <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200">
            <Image 
              src="https://maps.googleapis.com/maps/api/staticmap?center=Bangalore&zoom=14&size=600x300&key=YOUR_API_KEY" // Placeholder
              alt="Map Location" 
              fill 
              className="object-cover blur-[2px] opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/20 mb-4 animate-bounce">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <p className="text-slate-900 font-black text-sm mb-4">{property.address}, {property.city}</p>
              <Button asChild className="rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-50 border-none shadow-lg">
                <a 
                  href={property.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address || '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
             {[
               { label: 'Metro Station', value: '2.5 km away' },
               { label: 'Tech Park', value: '1.2 km away' },
               { label: 'Supermarket', value: '500m away' }
             ].map((item, i) => (
               <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                 <span className="text-xs font-black text-slate-800">{item.value}</span>
               </div>
             ))}
          </div>
        </div>

        {/* 7. Reviews Section (Placeholder) */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Tenant Experience</h2>
            <div className="h-[2px] flex-1 bg-slate-50 rounded-full" />
          </div>
          
          <div className="bg-slate-50 rounded-[32px] p-8 text-center border-2 border-dashed border-slate-200">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Sparkles key={i} className="w-5 h-5 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-sm font-black text-slate-900 mb-2">Be the first to review!</p>
            <p className="text-[11px] text-slate-500 font-medium">Verified tenants can share their experience here soon.</p>
          </div>
        </div>

        {/* 8. Safety & Trust (ID Checked) */}
        <div className="bg-emerald-50 rounded-[32px] p-6 border border-emerald-100">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
               <h4 className="text-sm font-black text-slate-900">Verified by Nestil</h4>
               <p className="text-[11px] text-slate-500 font-medium leading-tight mt-1">This property and owner ID have been physically verified by our team for your safety.</p>
             </div>
          </div>
        </div>
        
        <div className="flex justify-center pb-6">
          <span className="text-[10px] text-slate-300 font-black tracking-[0.3em] uppercase">End of Details</span>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="px-5 py-12 border-t border-slate-100 bg-slate-50">
          <div className="space-y-1 mb-6">
            <h2 className="text-2xl font-black text-slate-900">Similar Picks</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Handpicked for you in {property.city}</p>
          </div>
          <div className="flex flex-col gap-6">
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
