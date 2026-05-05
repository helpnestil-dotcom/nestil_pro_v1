'use client';

import { ArrowLeft, Heart, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface MobileListingHeaderProps {
  title: string;
  onFilterClick?: () => void;
}

export function MobileListingHeader({ title, onFilterClick }: MobileListingHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-100 px-5 pt-4 pb-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-slate-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full bg-slate-50">
          <Heart className="w-5 h-5 text-slate-700" />
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <Input 
            placeholder="Bellandur, Bengaluru" 
            className="h-11 pl-10 pr-4 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-primary focus-visible:bg-white transition-all text-sm"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={onFilterClick}
          className="h-11 px-4 rounded-xl border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-2 hover:bg-slate-50"
        >
          <Filter className="w-4 h-4 text-slate-400" />
          Filters
        </Button>
      </div>
    </div>
  );
}
