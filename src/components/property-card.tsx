'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Heart, Share2, CheckCircle, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/use-favorites';
import { Separator } from '@/components/ui/separator';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();

  const isFavorited = favoriteIds.has(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id, isFavorited);
  };
  
  const rawPhotos = property.photos && property.photos.length > 0 ? property.photos : [];
  const imageUrl = rawPhotos.length > 0 
    ? (typeof rawPhotos[0] === 'string' ? rawPhotos[0] : (rawPhotos[0] as any).url) 
    : 'https://picsum.photos/seed/property/600/400';

  const renderPrice = () => {
    if (property.priceOnRequest || !property.price || property.price <= 0) {
        return <p className="text-xl font-black text-slate-800 tracking-tight">Price on Request</p>;
    }

    const formatSalePrice = (p: number) => {
        if (p >= 10000000) {
            const value = p / 10000000;
            return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
        }
        if (p >= 100000) {
            const value = p / 100000;
            return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakhs`;
        }
        return `₹${new Intl.NumberFormat('en-IN').format(p)}`;
    };
    
    const price = property.listingFor === 'Rent' 
      ? `₹${new Intl.NumberFormat('en-IN').format(property.price)}` 
      : formatSalePrice(property.price);
    
    return (
        <p className="text-2xl font-black tracking-tight text-slate-900 border-l-[3px] border-primary pl-2.5 leading-none">
            {price}
            {property.listingFor === 'Rent' && <span className="text-sm font-semibold text-slate-500 ml-1">/mo</span>}
        </p>
    );
  }
      const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Construct the absolute URL
    const url = `${window.location.origin}/properties/${property.id}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: property.title,
                text: `Check out this property in ${property.city} on Nestil:`,
                url: url,
            });
        } catch (error) {
            console.log("Sharing cancelled or failed", error);
        }
    } else {
        // Fallback for browsers that don't support Web Share API (mostly Desktop)
        navigator.clipboard.writeText(url);
        // Assuming we could add a toast here, but simple alert or copy is fine for fallback
        alert("Property link copied to clipboard!");
    }
  };

  return (
    <div className="group w-full rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400 ease-out flex flex-col h-full overflow-hidden">
      <Link href={`/properties/${property.id}`} className="flex flex-col h-full">
        {/* Image section */}
        <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[3/2]">
          <Image
            src={imageUrl}
            alt={`Photo of ${property.title}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
          {/* Subtle gradient overlay at bottom of image for contrast if needed, or just let badges float */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10"></div>
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
            <Badge className="bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white font-bold tracking-wide shadow-sm uppercase border-white/20">
              {property.listingFor}
            </Badge>
            {property.isNew && (
                <Badge className="bg-emerald-500/90 backdrop-blur-md text-white hover:bg-emerald-500 font-bold border-none shadow-sm">
                    <Sparkles className="mr-1 h-3 w-3" /> New
                </Badge>
            )}
            {property.constructionStatus && (
                <Badge variant="secondary" className="bg-black/40 backdrop-blur-md text-white border-none hover:bg-black/50">
                    {property.constructionStatus}
                </Badge>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 z-20 flex gap-2">
            <button onClick={handleShareClick} title="Share property" className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md text-slate-600 shadow-sm flex items-center justify-center hover:bg-white hover:text-indigo-500 hover:scale-110 transition-all duration-300">
                <Share2 className="h-4 w-4" />
            </button>
            <button onClick={handleFavoriteClick} title="Favorite property" className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md text-slate-600 shadow-sm flex items-center justify-center hover:bg-white hover:text-rose-500 hover:scale-110 transition-all duration-300">
                <Heart className={cn("h-4 w-4", isFavorited && "fill-rose-500 text-rose-500")} />
            </button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            {renderPrice()}
            {property.listingStatus === 'approved' && (
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                </div>
            )}
          </div>
          
          <h3 className="font-bold text-[17px] text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{property.title}</h3>
          
          <p className="flex items-center text-sm font-medium text-slate-500 mt-2.5 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400 mr-1.5" />
            <span className="truncate">{property.address}, {property.city}</span>
          </p>

          <div className="mt-auto pt-5">
              <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                 <div className="flex flex-col items-center justify-center gap-0.5">
                    <p className="font-bold text-sm text-slate-700">{property.beds || '-'}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Beds</p>
                 </div>
                 <div className="flex flex-col items-center justify-center gap-0.5 border-l border-slate-200">
                    <p className="font-bold text-sm text-slate-700">{property.baths || '-'}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Baths</p>
                 </div>
                  <div className="flex flex-col items-center justify-center gap-0.5 border-l border-slate-200">
                    <p className="font-bold text-sm text-slate-700">{property.areaSqFt ? property.areaSqFt.toLocaleString('en-IN') : '-'}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sqft</p>
                 </div>
                  <div className="flex flex-col items-center justify-center gap-0.5 border-l border-slate-200">
                    <p className="font-bold text-sm text-slate-700">{property.floor && property.totalFloors ? `${property.floor}/${property.totalFloors}` : (property.floor || '-')}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Floor</p>
                 </div>
              </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="group w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-2/5" />
            <Skeleton className="h-6 w-1/4 rounded-full" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <Separator className="my-4"/>
        <div className="grid grid-cols-4 gap-2 text-center">
            <div>
                <Skeleton className="h-5 w-6 mx-auto mb-1"/>
                <Skeleton className="h-3 w-10 mx-auto"/>
            </div>
             <div>
                <Skeleton className="h-5 w-6 mx-auto mb-1"/>
                <Skeleton className="h-3 w-10 mx-auto"/>
            </div>
             <div>
                <Skeleton className="h-5 w-8 mx-auto mb-1"/>
                <Skeleton className="h-3 w-12 mx-auto"/>
            </div>
             <div>
                <Skeleton className="h-5 w-6 mx-auto mb-1"/>
                <Skeleton className="h-3 w-10 mx-auto"/>
            </div>
        </div>
      </div>
    </div>
  );
}
