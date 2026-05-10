import { notFound } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Property } from '@/lib/types';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Sparkles, Star, Wifi, UtensilsCrossed, Car, Zap, Camera, Waves, Tv, Wind, ShieldCheck, Dumbbell, Share2, Phone, MessageCircle, ChevronRight, User, Users, CheckCircle2, Shield, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyContactDetails } from '@/components/property-contact-details';
import { PropertyCard } from '@/components/property-card';
import { getWatermarkedImageUrl, cn } from '@/lib/utils';
import { PropertyViewTracker } from '@/components/property-view-tracker';
import { getAllPropertyAmenities, getAmenityIcon } from '@/lib/amenities-data';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await getProperty(params.id);
  if (!property) return { title: 'Property Not Found' };

  const title = `${property.bhk ? property.bhk + ' ' : ''}${property.propertyType} for ${property.listingFor} in ${property.city}`;
  const description = `Explore this ${property.propertyType} in ${property.address}, ${property.city}. Verified listing with zero brokerage.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: property.photos?.[0] ? [property.photos[0]] : [],
    },
  };
}

const parseDate = (dateVal: any) => {
  if (!dateVal) return null;
  if (typeof dateVal === 'string') return new Date(dateVal).toISOString();
  if (typeof dateVal.toDate === 'function') return dateVal.toDate().toISOString();
  if (dateVal.seconds) return new Date(dateVal.seconds * 1000).toISOString();
  return null;
};

async function getProperty(id: string): Promise<Property | null> {
  try {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().listingStatus !== 'approved') {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      postedAt: parseDate(data.postedAt) || new Date().toISOString(),
      updatedAt: parseDate(data.updatedAt) || new Date().toISOString(),
    } as Property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

async function getSimilarProperties(property: Property): Promise<Property[]> {
  try {
      const propertiesRef = collection(db, 'properties');
      const q = query(
        propertiesRef,
        where('listingStatus', '==', 'approved'),
        where('city', '==', property.city),
        limit(4)
      );
      const snapshot = await getDocs(q);
      const similar: Property[] = [];
      snapshot.forEach(docSnap => {
          if (docSnap.id !== property.id) {
              const data = docSnap.data();
              similar.push({
                 id: docSnap.id,
                 ...data,
                 postedAt: parseDate(data.postedAt),
                 updatedAt: parseDate(data.updatedAt),
              } as Property);
          }
      });
      return similar.slice(0, 3);
  } catch (e) {
      return [];
  }
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }
  
  const similarProperties = await getSimilarProperties(property);
  const rawPhotos = property.photos && property.photos.length > 0 ? property.photos : [];
  const propertyPhotos = rawPhotos.map((p: any) => getWatermarkedImageUrl(typeof p === 'string' ? p : p.url)).filter(Boolean);
  if (propertyPhotos.length === 0) {
    propertyPhotos.push('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop');
  }

  const mapUrl = property.googleMapsLink 
    ? property.googleMapsLink 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address}, ${property.city}`)}`;

  const reviews = [
    { name: 'Aditya Raj', rating: 5, comment: 'Amazing place! The food is homely and the maintenance is top-notch.', date: '2 months ago', avatar: 'AR' },
    { name: 'Sneha Kapoor', rating: 4, comment: 'Very secure for girls. The warden is helpful and the rooms are spacious.', date: '1 month ago', avatar: 'SK' },
    { name: 'Rohan Mehta', rating: 5, comment: 'Best co-living experience in Bangalore. WiFi is really fast!', date: '3 weeks ago', avatar: 'RM' },
  ];

  const sharingOptions = [
    { type: 'Single Sharing', price: property.pgSharingPrices?.single || property.price * 1.5 || 15000, icon: User, availability: 'Available' },
    { type: 'Double Sharing', price: property.pgSharingPrices?.double || property.price || 10000, icon: Users, availability: 'Few Left' },
    { type: 'Triple Sharing', price: property.pgSharingPrices?.triple || property.price * 0.8 || 8000, icon: Users, availability: 'Available' },
  ];

  return (
    <>
      <PropertyViewTracker
        propertyId={property.id}
        propertyType={property.propertyType}
        city={property.city}
        price={property.price}
        listingFor={property.listingFor}
      />

      <div className="bg-white min-h-screen pb-20 font-sans">
        {/* 1. STICKY IMAGE GALLERY (FULL WIDTH) */}
        <div className="relative w-full h-[40vh] md:h-[60vh] bg-slate-900 group">
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full ml-0">
              {propertyPhotos.map((photo, index) => (
                <CarouselItem key={index} className="relative w-full h-[40vh] md:h-[60vh] pl-0">
                  <Image
                    src={photo}
                    alt={`${property.title} - ${index + 1}`}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-6 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md h-12 w-12" />
            <CarouselNext className="right-6 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md h-12 w-12" />
          </Carousel>
          
          {/* Gallery Overlay Badges */}
          <div className="absolute top-8 left-8 flex flex-col gap-3 z-10">
            <div className="flex gap-2">
              <Badge className="bg-primary px-4 py-1.5 text-[11px] font-black tracking-widest uppercase border-none shadow-xl">
                {property.propertyType}
              </Badge>
              <Badge className="bg-accent-green px-4 py-1.5 text-[11px] font-black tracking-widest uppercase border-none shadow-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </Badge>
            </div>
            {property.featured && (
              <Badge className="bg-amber-400 w-fit px-4 py-1.5 text-[11px] font-black tracking-widest uppercase border-none shadow-xl flex items-center gap-1.5 text-slate-900">
                <Sparkles className="w-3.5 h-3.5 fill-slate-900" /> Featured
              </Badge>
            )}
          </div>
        </div>

        <div className="container max-w-7xl px-4 md:px-6 -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION 1: OVERVIEW */}
              <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em]">
                      <Sparkles className="w-4 h-4" />
                      Premium Stay
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {property.address}, {property.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-400/10 text-amber-600 px-5 py-3 rounded-2xl flex flex-col items-center border border-amber-200/50">
                      <div className="flex items-center gap-1 font-black text-2xl">
                        <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        4.8
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-70">120 Reviews</span>
                    </div>
                    <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-primary transition-all">
                      <Share2 className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING BREAKDOWN */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Pricing Details</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 md:p-5 rounded-[24px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                    <p className="text-xl md:text-2xl font-black text-slate-900">₹{(property.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-50 p-4 md:p-5 rounded-[24px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Deposit</p>
                    <p className="text-xl md:text-2xl font-black text-slate-900">₹{(property.deposit || property.price * 2 || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-50 p-4 md:p-5 rounded-[24px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Maintenance</p>
                    <p className="text-xl md:text-2xl font-black text-slate-900">₹{property.maintenance || 'Included'}</p>
                  </div>
                  <div className="bg-slate-50 p-4 md:p-5 rounded-[24px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Food Charges</p>
                    <p className="text-xl md:text-2xl font-black text-slate-900">{property.foodIncluded ? 'Included' : '₹2,500/mo'}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: AMENITIES GRID */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Premium Amenities</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                  {(() => {
                    const allAmenities = getAllPropertyAmenities(property);
                    return allAmenities.length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {allAmenities.map((amenity, i) => {
                          const Icon = getAmenityIcon(amenity);
                          return (
                            <div key={i} className="flex flex-col items-center gap-2 group">
                              <div className="w-12 h-12 rounded-[16px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider text-center group-hover:text-slate-900 transition-colors leading-tight">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-3">
                          <Shield className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">Essential utilities and amenities provided.</p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* SECTION 4: ROOM TYPES */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Sharing Options</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="flex flex-col gap-3">
                  {sharingOptions.map((room, i) => (
                    <div key={i} className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[14px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <room.icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <p className="text-sm font-black text-slate-900 leading-none">{room.type}</p>
                          <Badge className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border-none",
                            room.availability === 'Available' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                          )}>
                            {room.availability}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">₹{room.price.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] font-bold text-slate-400">/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: MAP SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Location & Surroundings</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm p-2">
                  <div className="relative w-full aspect-video md:aspect-[24/9] rounded-[18px] overflow-hidden">
                    <iframe 
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3!2d77.6!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzAwLjAiTiA3N8KwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin`}
                      className="w-full h-full grayscale opacity-80"
                      allowFullScreen={true}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900">Premium Location</p>
                          <p className="text-[10px] font-bold text-slate-500">Bangalore, Karnataka</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: REVIEWS */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Tenant Experiences</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {reviews.map((review, i) => (
                    <div key={i} className="min-w-[280px] md:min-w-[340px] bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                            {review.avatar}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{review.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(review.rating)].map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (SIDEBAR) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="bg-slate-900 rounded-[24px] p-6 md:p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] bg-white/10 w-fit px-3 py-1 rounded-lg">
                      <ShieldCheck className="w-4 h-4" />
                      Zero Brokerage
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Rent starts from</p>
                      <h2 className="text-5xl font-black tracking-tight leading-none">
                        ₹{(property.price || 0).toLocaleString('en-IN')}
                        <span className="text-xl text-slate-400 font-bold ml-1">/mo</span>
                      </h2>
                    </div>
                    
                    <div className="h-px bg-white/10 w-full" />
                    
                    <PropertyContactDetails 
                        propertyId={property.id} 
                        isPaid={!!property.isPaid} 
                        propertyPath={`/properties/${property.id}`}
                    />

                    <div className="space-y-3 pt-2">
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                         <Calendar className="w-4 h-4 text-primary" />
                         Available for Immediate Move-in
                       </div>
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                         <Clock className="w-4 h-4 text-primary" />
                         Anytime Viewing Access
                       </div>
                    </div>
                  </div>
                </div>

                {/* Trust Card */}
                <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200/60 text-center">
                  <div className="w-16 h-16 rounded-[20px] bg-white flex items-center justify-center text-primary mx-auto mb-4 shadow-sm">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">Nestil Safe Stay</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">Verified owners, direct contact & zero broker fees. Guaranteed 48-hour home search.</p>
                </div>
              </div>
            </div>

          </div>

          {/* SIMILAR PROPERTIES */}
          {similarProperties.length > 0 && (
            <div className="mt-24 space-y-10">
               <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Similar Stays in {property.city}</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {similarProperties.slice(0, 3).map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
