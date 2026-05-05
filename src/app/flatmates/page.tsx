'use client';

import { MobileListingHeader } from '@/components/mobile-listing-header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

export default function FlatmatesPage() {
  const matches = [
    { name: 'Arjun, 27', role: 'Software Engineer', budget: '₹8K - ₹10K', gender: 'Male', location: 'Bellandur', match: '95%' },
    { name: 'Karthik, 24', role: 'Data Analyst', budget: '₹7K - ₹9K', gender: 'Male', location: 'Bellandur', match: '92%' },
    { name: 'Manoj, 25', role: 'UI/UX Designer', budget: '₹8K - ₹11K', gender: 'Male', location: 'Bellandur', match: '90%' },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
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
              <Button className="bg-white text-primary font-black px-6 h-10 rounded-xl text-xs hover:bg-white/90">
                Create Profile
              </Button>
            </div>
            <div className="relative w-24 h-24 opacity-80">
              {/* Illustration placeholder */}
              <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center">
                <Image src="https://img.icons8.com/color/96/000000/user-male-circle--v1.png" width={80} height={80} alt="profile" />
              </div>
            </div>
          </div>

          {/* Matches List */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900">Matches for you</h2>
            </div>

            <div className="space-y-4">
              {matches.map((person) => (
                <div key={person.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 relative overflow-hidden">
                       <Image src={`https://i.pravatar.cc/150?u=${person.name}`} fill sizes="50px" className="object-cover" alt={person.name} />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-black text-slate-900 text-[15px]">{person.name}</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{person.role}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] font-black text-slate-700">{person.budget} • {person.gender}</span>
                        <span className="text-[10px] font-bold text-slate-400">• {person.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-2 py-1 bg-green-50 text-green-600 rounded text-[9px] font-black">
                      {person.match} Match
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
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
