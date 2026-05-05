'use client';

import { Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function PromoBanners() {
  return (
    <div className="space-y-4 px-5">
      {/* Flatmate Banner */}
      <div className="relative bg-emerald-50 rounded-2xl p-5 overflow-hidden border border-emerald-100/50">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Find your perfect flatmate</h3>
          </div>
          <p className="text-[11px] text-slate-600 font-medium max-w-[200px]">
            Tell us your preferences and we'll match you with verified flatmates.
          </p>
          
          <div className="flex items-center gap-3">
             <div className="flex -space-x-3 overflow-hidden">
                <Image src="https://i.pravatar.cc/150?u=Arjun, 27" width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-emerald-50 object-cover" alt="Arjun" />
                <Image src="https://i.pravatar.cc/150?u=Karthik, 24" width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-emerald-50 object-cover" alt="Karthik" />
                <Image src="https://i.pravatar.cc/150?u=Manoj, 25" width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-emerald-50 object-cover" alt="Manoj" />
                <div className="flex h-8 w-8 relative z-10 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white ring-2 ring-emerald-50">
                    +12
                </div>
             </div>
             <Button className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] rounded-xl shadow-lg shadow-emerald-200">
                Find Flatmate Matches
             </Button>
          </div>
        </div>
        {/* Floating decorative elements could go here */}
      </div>

      {/* Urgent Banner */}
      <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            <h3 className="font-bold text-slate-900 text-sm">Need a place urgently?</h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Find move-in ready homes available in 24-48 hrs.
          </p>
        </div>
        <Button variant="outline" className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 font-bold text-[11px] hover:bg-white transition-all">
          Find Now
        </Button>
      </div>
    </div>
  );
}
