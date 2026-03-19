import { notFound } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Server-side firebase instance
import type { Property } from '@/lib/types';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BedDouble, Bath, Expand, MapPin, Building, School, Hospital, BadgeCheck, Sparkles, Flame, Car, Fish, CalendarClock, PhoneCall, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyContactDetails } from '@/components/property-contact-details';
import { PropertyCard } from '@/components/property-card';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

// This function gets called at build time on the server.
async function getProperty(id: string): Promise<Property | null> {
  const docRef = doc(db, 'properties', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || docSnap.data().listingStatus !== 'approved') {
    return null;
  }
  
  const data = docSnap.data();
  const property: Property = {
    id: docSnap.id,
    ...data,
    postedAt: data.postedAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  } as Property;

  return property;
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
                 postedAt: data.postedAt.toDate().toISOString(),
                 updatedAt: data.updatedAt.toDate().toISOString(),
              } as Property);
          }
      });
      return similar.slice(0, 3);
  } catch (e) {
      console.error("Error fetching similar properties:", e);
      return [];
  }
}

const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
};

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }
  
  const similarProperties = await getSimilarProperties(property);

  const mapUrl = property.googleMapsLink 
    ? property.googleMapsLink 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.address}, ${property.city}, ${property.pincode}`)}`;

  const rawPhotos = property.photos && property.photos.length > 0 ? property.photos : [];
  const propertyPhotos = rawPhotos.map((p: any) => typeof p === 'string' ? p : p.url).filter(Boolean);
  
  // Final fallback if no valid photos found
  if (propertyPhotos.length === 0) {
    propertyPhotos.push('https://picsum.photos/seed/property/1200/800');
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container py-8 max-w-7xl">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
             <div className="flex items-center text-sm text-slate-500 mb-4 font-medium">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <Link href={`/properties?keyword=${property.city}`} className="hover:text-primary transition-colors">{property.city}</Link>
                <span className="mx-2">/</span>
                <span className="text-slate-800 line-clamp-1">{property.title}</span>
             </div>
             
             <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">{property.title}</h1>
                    <div className="flex items-center text-slate-500 font-medium text-base gap-1.5 mt-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{property.address}, {property.city}, {property.pincode}</span>
                    </div>
                </div>
             </div>
        </div>

        {/* Premium Image Gallery (Hero) */}
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-slate-100 mb-10 shadow-sm border border-slate-200/60">
            <Carousel className="w-full">
                <CarouselContent>
                {propertyPhotos.map((photo, index) => (
                    <CarouselItem key={index} className="relative aspect-video md:aspect-[21/9] w-full">
                        <Image
                            src={photo}
                            alt={`${property.title} photo ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 1200px"
                            priority={index === 0}
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                {propertyPhotos.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-slate-800 border-none backdrop-blur-md h-10 w-10 md:h-12 md:w-12" />
                        <CarouselNext className="right-4 bg-white/80 hover:bg-white text-slate-800 border-none backdrop-blur-md h-10 w-10 md:h-12 md:w-12" />
                    </>
                )}
            </Carousel>

            {/* Floating Badges inside Gallery */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10 pointer-events-none">
                <Badge className="bg-white/90 backdrop-blur-md text-slate-900 font-bold border-none px-3 py-1 text-sm shadow-sm uppercase">{property.listingFor}</Badge>
                {property.isNew && (
                    <Badge className="bg-emerald-500/90 backdrop-blur-md text-white font-bold border-none px-3 py-1 shadow-sm">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" /> New Property
                    </Badge>
                )}
                {property.isUrgent && (
                    <Badge className="bg-rose-500/90 backdrop-blur-md text-white font-bold border-none px-3 py-1 shadow-sm">
                        <Flame className="mr-1.5 h-3.5 w-3.5" /> Urgent Sale
                    </Badge>
                )}
            </div>

            {/* Gallery Lightbox Trigger */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="absolute bottom-6 right-6 z-10 bg-white/90 hover:bg-white text-slate-800 font-bold backdrop-blur-md shadow-lg border-none px-5 rounded-xl transition-transform hover:scale-105">
                        <Expand className="mr-2 h-4 w-4" /> View All {propertyPhotos.length} Photos
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl w-11/12 h-[85vh] p-0 rounded-2xl overflow-hidden bg-black border-none">
                    <Carousel className="w-full h-full">
                        <CarouselContent className="h-full">
                        {propertyPhotos.map((photo, index) => (
                            <CarouselItem key={index} className="h-full relative flex items-center justify-center bg-black">
                                <Image
                                    src={photo}
                                    alt={`Full screen photo ${index + 1}`}
                                    fill
                                    className="object-contain"
                                />
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        {propertyPhotos.length > 1 && (
                            <>
                                <CarouselPrevious className="left-4 lg:-left-16 border-white/20 bg-black/50 text-white hover:bg-white hover:text-black" />
                                <CarouselNext className="right-4 lg:-right-16 border-white/20 bg-black/50 text-white hover:bg-white hover:text-black" />
                            </>
                        )}
                    </Carousel>
                </DialogContent>
            </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-10">
                
                {/* Key Overview Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm text-center">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-1"><BedDouble className="h-5 w-5" /></div>
                        <p className="font-extrabold text-xl text-slate-800 leading-none">{property.bhk || '-'}</p>
                        <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Beds</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 md:border-l border-slate-100">
                        <div className="h-10 w-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 mb-1"><Bath className="h-5 w-5" /></div>
                        <p className="font-extrabold text-xl text-slate-800 leading-none">{property.baths || '-'}</p>
                         <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Baths</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1"><Expand className="h-5 w-5" /></div>
                        <p className="font-extrabold text-xl text-slate-800 leading-none">{(property.areaSqFt || 0).toLocaleString('en-IN')}</p>
                         <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Sq. Ft.</p>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                        <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-1"><Building className="h-5 w-5" /></div>
                        <p className="font-extrabold text-xl text-slate-800 leading-none text-center">
                           {property.floor && property.totalFloors ? `${property.floor}/${property.totalFloors}` : (property.floor || '-')}
                        </p>
                        <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Floor</p>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">About this property</h2>
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{property.description || 'No description provided by the owner.'}</p>
                        
                        {/* More key data points */}
                        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-y-4 gap-x-8">
                             <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 font-medium">Property Type</span>
                                <span className="font-bold text-slate-800">{property.propertyType}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 font-medium">Construction</span>
                                <span className="font-bold text-slate-800">{property.constructionStatus || 'N/A'}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 font-medium">Parking</span>
                                <span className="font-bold text-slate-800">{property.vehicleParking || 'N/A'}</span>
                             </div>
                             {property.nonVegAllowed !== undefined && (
                                <div className="flex justify-between border-b border-slate-50 pb-2">
                                    <span className="text-slate-500 font-medium">Non-Veg Food</span>
                                    <span className="font-bold text-slate-800">{property.nonVegAllowed ? 'Allowed' : 'Not Allowed'}</span>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                {(property.amenities && property.amenities.length > 0) && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Amenities</h2>
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {property.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl shrink-0">
                                          <Sparkles className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium text-slate-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Available Timings */}
                {(property.isAvailableAnytime || (property.visitAvailability && property.visitAvailability.length > 0)) && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CalendarClock className="h-6 w-6 text-indigo-500" /> Visit Timings
                        </h2>
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm">
                             {property.isAvailableAnytime ? (
                                <div className="text-center py-4">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3"><BadgeCheck className="h-6 w-6" /></div>
                                    <p className="font-bold text-lg text-slate-800">Anytime Viewing Available</p>
                                    <p className="text-slate-500 mt-1 max-w-sm mx-auto">The owner is highly flexible. Please contact them directly to schedule a speedy visit.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {property.visitAvailability?.map((slot, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="font-bold text-slate-800 mb-1 sm:mb-0 flex items-center"><CalendarClock className="h-4 w-4 mr-2 text-slate-400" /> {slot.day}</span>
                                            <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg">{formatTime(slot.from)} - {formatTime(slot.to)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
            
            {/* Right Column: Sticky Contact Card */}
            <div className="lg:col-span-1 relative">
                <div className="sticky top-24 space-y-6">
                    
                    {/* Price Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-2xl shadow-slate-200/50">
                        {property.listingStatus === 'approved' && (
                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold w-max mb-6">
                                <BadgeCheck className="h-4 w-4" /> Verified Listing
                            </div>
                        )}
                        <p className="text-slate-500 font-bold mb-1 uppercase tracking-wide text-sm">{property.listingFor === 'Rent' ? 'Rent Price' : 'Sale Price'}</p>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                            ₹{(property.price || 0).toLocaleString('en-IN')}
                            {property.listingFor === 'Rent' && <span className="text-xl text-slate-500 font-semibold tracking-normal ml-1">/mo</span>}
                        </h2>
                        
                        <div className="w-full h-px bg-slate-100 my-6"></div>
                        
                        {/* The component below fetches owner contact info securely */}
                        <PropertyContactDetails 
                            propertyId={property.id} 
                            isPaid={!!property.isPaid} 
                            propertyPath={`/properties/${property.id}`}
                        />

                        {/* Map Button Below Contact */}
                         <Button asChild variant="outline" className="w-full mt-4 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-4 w-4 text-emerald-500" /> Open in Google Maps
                            </a>
                        </Button>
                    </div>

                    {/* Trust Banner */}
                    <div className="bg-gradient-to-br from-indigo-500 to-primary rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                         <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                         <h3 className="font-extrabold text-xl mb-2 flex justify-center items-center gap-2"><Sparkles className="h-5 w-5" /> 100% Free Contact</h3>
                         <p className="text-indigo-100 text-sm font-medium leading-relaxed">Nestil connects you directly to the owner. We strictly charge zero brokerage fees forever.</p>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
            <div className="mt-24 pt-10 border-t border-slate-200">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Similar Properties</h2>
                        <p className="text-slate-500 mt-2 font-medium">Other premium listings in {property.city} you might love.</p>
                    </div>
                    <Button asChild variant="ghost" className="hidden md:inline-flex font-bold text-primary hover:bg-primary/5">
                         <Link href={`/properties?keyword=${property.city}`}>View All in {property.city}</Link>
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarProperties.map(prop => (
                         <PropertyCard key={prop.id} property={prop} />
                    ))}
                </div>
                
                <Button asChild variant="outline" className="w-full mt-6 md:hidden font-bold h-12 rounded-xl">
                     <Link href={`/properties?keyword=${property.city}`}>View All in {property.city}</Link>
                </Button>
            </div>
        )}

      </div>
    </div>
  );
}
