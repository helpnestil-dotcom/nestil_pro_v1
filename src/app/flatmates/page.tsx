'use client';

import { MobileListingHeader } from '@/components/mobile-listing-header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MapPin, ArrowRight, Utensils, Cigarette, Briefcase, IndianRupee, Heart, Filter, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function FlatmatesPage() {
  const matches = [
    { 
      name: 'Arjun, 27', 
      role: 'Software Engineer', 
      budget: '₹8K - ₹10K', 
      gender: 'Male', 
      location: 'Bellandur', 
      match: '95%',
      lifestyle: ['Non-Veg', 'No Smoking', 'No Drinking']
    },
    { 
      name: 'Karthik, 24', 
      role: 'Data Analyst', 
      budget: '₹7K - ₹9K', 
      gender: 'Male', 
      location: 'Bellandur', 
      match: '92%',
      lifestyle: ['Veg Only', 'Non-Smoker', 'Social Drinker']
    },
    { 
      name: 'Manoj, 25', 
      role: 'UI/UX Designer', 
      budget: '₹8K - ₹11K', 
      gender: 'Male', 
      location: 'Bellandur', 
      match: '90%',
      lifestyle: ['Non-Veg', 'No Smoking', 'No Drinking']
    },
  ];

  const filterCategories = [
    { id: 'budget', label: 'Budget', icon: <IndianRupee className="w-3.5 h-3.5" /> },
    { id: 'food', label: 'Food (Veg)', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'lifestyle', label: 'Habits', icon: <Cigarette className="w-3.5 h-3.5" /> },
    { id: 'work', label: 'Work Type', icon: <Briefcase className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="md:hidden">
        <MobileListingHeader title="Find Flatmate" />
        
        <div className="px-5 py-6 space-y-8">
          {/* Create Profile Banner */}
          <div className="relative bg-primary rounded-3xl p-6 overflow-hidden flex items-center justify-between shadow-xl shadow-primary/20">
            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h2 className="text-white font-black text-xl leading-tight">Create Your Profile</h2>
                <p className="text-white/80 text-xs font-bold">Get better matches</p>
              </div>
              <Link href="/dashboard/profile">
                <Button className="bg-white text-primary font-black px-6 h-10 rounded-xl text-xs hover:bg-white/90 shadow-lg shadow-white/10 active:scale-95 transition-transform">
                  Set Up Profile
                </Button>
              </Link>
            </div>
            <div className="relative w-24 h-24 opacity-80">
              {/* Illustration placeholder */}
              <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">
                <Image src="https://img.icons8.com/color/96/000000/user-male-circle--v1.png" width={80} height={80} alt="profile" />
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> Filter Compatibility
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
              {filterCategories.map((cat) => (
                <button 
                  key={cat.id}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-600 whitespace-nowrap active:bg-primary active:text-white transition-all"
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Matches List */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">Recommended for You</h2>
              <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg">3 Active Today</span>
            </div>

            <div className="space-y-4">
              {matches.map((person) => (
                <div key={person.name} className="p-4 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 relative overflow-hidden border-2 border-white shadow-sm">
                         <Image src={`https://i.pravatar.cc/150?u=${person.name}`} fill sizes="50px" className="object-cover" alt={person.name} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-slate-900 text-[15px]">{person.name}</h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{person.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="px-2.5 py-1.5 bg-primary text-white rounded-xl text-[10px] font-black shadow-lg shadow-primary/20">
                        {person.match} Match
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="outline" className="bg-slate-50/50 border-slate-100 text-[9px] font-bold py-0.5 rounded-lg">
                      {person.budget}
                    </Badge>
                    {person.lifestyle.map(tag => (
                      <Badge key={tag} variant="outline" className="bg-slate-50/50 border-slate-100 text-[9px] font-bold py-0.5 rounded-lg">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {person.location}
                    </div>
                    <Button variant="ghost" className="h-8 text-[11px] font-black text-primary hover:bg-primary/5 rounded-xl">
                      Chat Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full h-14 rounded-2xl border-primary text-primary font-black text-sm hover:bg-primary/5 transition-all">
              View All Matches
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black">Flatmate Matching Coming Soon to Desktop</h1>
          <p className="text-slate-500">Please visit this page on your mobile device for the full experience.</p>
        </div>
      </div>
    </div>
  );
}
