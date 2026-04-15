'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Mail, Phone, Globe, Building, CalendarDays, MapPin, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { BuilderData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const DEMO_BUILDER: BuilderData = {
  id: 'demo-builder',
  companyName: 'Apex Constructions',
  contactPerson: 'Sarah Jenkins',
  email: 'contact@apexconstructions.com',
  phone: '+91 91234 56780',
  website: 'https://apexconstructions.example.com',
  establishedYear: 2005,
  isVerified: true,
  location: 'Hyderabad',
  description: 'Apex Constructions is a premier property development company known for world-class residential and commercial projects built with uncompromising quality.',
  createdAt: new Date().toISOString(),
  rating: 4.8,
  ongoingProjects: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
  ],
};

export default function BuildersPage() {
  const [buildersSnap, loading] = useCollection(query(collection(db, 'builders'), orderBy('createdAt', 'desc')));
  const builders = buildersSnap?.docs.map(d => ({ id: d.id, ...d.data() } as BuilderData)) || [];
  const [locationFilter, setLocationFilter] = useState('');

  const baseBuilders = builders.length > 0 ? builders : [DEMO_BUILDER];
  const displayBuilders = baseBuilders.filter(builder => {
    if (!locationFilter) return true;
    return builder.location?.toLowerCase().includes(locationFilter.toLowerCase());
  });

  if (loading) return <div className="flex justify-center p-24"><Building className="animate-pulse h-12 w-12 text-primary" /></div>;

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Top Builders</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover trusted and top-rated builders developing the finest properties in your area.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10 relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Filter builders by location or city..." 
          className="pl-12 h-12 text-base rounded-full shadow-sm bg-background border-border focus-visible:ring-primary"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBuilders.map(builder => (
          <Card key={builder.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
             <div className="h-32 bg-secondary/30 flex items-center justify-center p-6 border-b border-border">
                {builder.imageUrl ? (
                    <img src={builder.imageUrl} alt={builder.companyName} className="h-20 object-contain" />
                ) : (
                    <div className="flex flex-col items-center">
                        <Award className="h-10 w-10 text-primary/60 mb-2" />
                        <span className="font-bold text-lg text-primary">{builder.companyName}</span>
                    </div>
                )}
             </div>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                  <div>
                      <CardTitle className="text-xl line-clamp-1">{builder.companyName}</CardTitle>
                      {builder.rating !== undefined && (
                          <div className="flex items-center gap-1 mt-1 mb-2 text-amber-500">
                             <Star className="h-4 w-4 fill-amber-500" />
                             <span className="text-sm font-semibold text-foreground/90">{builder.rating}</span>
                          </div>
                      )}
                      <CardDescription className="flex flex-col gap-1 mt-1">
                          <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              Contact: {builder.contactPerson}
                          </span>
                          {builder.location && (
                              <span className="flex items-center gap-1 text-xs">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span className="truncate max-w-[200px]">{builder.location}</span>
                              </span>
                          )}
                      </CardDescription>
                  </div>
                  {builder.isVerified && <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200 shrink-0">Verified</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 border-t pt-4">
               {builder.description && <p className="text-sm text-foreground/80 line-clamp-3">{builder.description}</p>}
              
               <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-primary shrink-0" />
                      <a href={`mailto:${builder.email}`} className="hover:underline truncate">{builder.email}</a>
                  </div>
                  <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-primary shrink-0" />
                      <a href={`tel:${builder.phone}`} className="hover:underline">{builder.phone}</a>
                  </div>
                  {builder.website && (
                    <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-primary shrink-0" />
                        <a href={builder.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary truncate">{builder.website}</a>
                    </div>
                  )}
                  {builder.establishedYear !== undefined && builder.establishedYear > 0 && (
                      <div className="flex items-center">
                          <CalendarDays className="mr-2 h-4 w-4 text-primary shrink-0" />
                          Est. {builder.establishedYear}
                      </div>
                  )}
               </div>

               {builder.ongoingProjects && builder.ongoingProjects.length > 0 && (
                   <div className="pt-4 border-t mt-4 border-border/50">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Ongoing Projects</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                         {builder.ongoingProjects.map((image, idx) => (
                             <img 
                               key={idx} 
                               src={image} 
                               alt={`Project ${idx + 1}`} 
                               className="h-20 w-32 object-cover rounded-lg shrink-0 border border-border shadow-sm transition-transform hover:scale-105 hover:z-10 relative"
                             />
                         ))}
                      </div>
                   </div>
               )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
