'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, Phone, Star, Building2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AgentData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const DEMO_AGENT: AgentData = {
  id: 'demo-agent',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 98765 43210',
  company: 'Prime Real Estate',
  experienceYears: 5,
  isVerified: true,
  location: 'Hyderabad',
  description: 'Specializing in residential properties and luxury apartments with over 5 years of local market experience.',
  createdAt: new Date().toISOString(),
};

export default function AgentsPage() {
  const [agentsSnap, loading] = useCollection(query(collection(db, 'agents'), orderBy('createdAt', 'desc')));
  const agents = agentsSnap?.docs.map(d => ({ id: d.id, ...d.data() } as AgentData)) || [];
  const [locationFilter, setLocationFilter] = useState('');

  const baseAgents = agents.length > 0 ? agents : [DEMO_AGENT];
  const displayAgents = baseAgents.filter(agent => {
    if (!locationFilter) return true;
    return agent.location?.toLowerCase().includes(locationFilter.toLowerCase());
  });

  if (loading) return <div className="flex justify-center p-24"><Users className="animate-pulse h-12 w-12 text-primary" /></div>;

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Verified Agents</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with elite, expert real estate agents vetted by Nestil to find your perfect property.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10 relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Filter agents by location or city..." 
          className="pl-12 h-12 text-base rounded-full shadow-sm bg-background border-border focus-visible:ring-primary"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayAgents.map(agent => (
          <Card key={agent.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center p-6 relative">
               {agent.imageUrl ? (
                 <img src={agent.imageUrl} alt={agent.name} className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-sm absolute -bottom-10" />
               ) : (
                 <div className="h-24 w-24 rounded-full bg-white border-4 border-muted flex items-center justify-center absolute -bottom-10 shadow-sm text-4xl font-bold text-primary/40">
                   {agent.name.charAt(0)}
                 </div>
               )}
            </div>
            <CardHeader className="pt-14 pb-4">
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="text-xl">{agent.name}</CardTitle>
                      {(agent.company || agent.location) && (
                          <div className="flex flex-col text-sm text-muted-foreground mt-1 gap-1">
                              {agent.company && (
                                <div className="flex items-center">
                                  <Building2 className="mr-1 h-3 w-3 shrink-0" />
                                  <span className="truncate max-w-[200px]">{agent.company}</span>
                                </div>
                              )}
                              {agent.location && (
                                <div className="flex items-center">
                                  <MapPin className="mr-1 h-3 w-3 shrink-0" />
                                  <span className="truncate max-w-[200px]">{agent.location}</span>
                                </div>
                              )}
                          </div>
                      )}
                  </div>
                  {agent.isVerified && <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200 shrink-0">Verified</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {agent.description && <p className="text-sm text-muted-foreground line-clamp-3">{agent.description}</p>}
              
               <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-primary" />
                      <a href={`mailto:${agent.email}`} className="hover:underline">{agent.email}</a>
                  </div>
                  <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-primary" />
                      <a href={`tel:${agent.phone}`} className="hover:underline">{agent.phone}</a>
                  </div>
                  {agent.experienceYears !== undefined && agent.experienceYears > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {agent.experienceYears} Years Experience
                      </div>
                  )}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
