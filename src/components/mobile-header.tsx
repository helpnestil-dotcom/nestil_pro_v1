'use client';

import { Bell, User, Search, MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function MobileHeader() {
  return (
    <header className="px-5 pt-4 pb-6 bg-white space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary tracking-tighter">nestil</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-50">
              <Bell className="w-5 h-5 text-slate-700" />
            </Button>
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 border-2 border-white text-[10px]">
              5
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50">
            <User className="w-5 h-5 text-slate-700" />
          </Button>
        </div>
      </div>

      {/* Greeting & Title */}
      <div className="space-y-1">
        <p className="text-slate-500 font-medium">Hi, Welcome 👋</p>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
          Find your next home,<br />faster in 48hrs.
        </h2>
      </div>

      {/* Search & Location */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <Input 
            placeholder="Search by area, landmark or city" 
            className="h-14 pl-12 pr-12 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:ring-primary focus-visible:bg-white transition-all text-base"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full h-12 rounded-xl border-slate-200 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
        >
          <Target className="w-4 h-4" />
          Use my current location
        </Button>
      </div>
    </header>
  );
}
