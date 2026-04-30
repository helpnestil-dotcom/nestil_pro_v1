'use client';

import { Suspense, useState, useMemo } from 'react';
import { useRequirements } from '@/hooks/use-requirements';
import { RequirementCard, RequirementCardSkeleton } from '@/components/requirement-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Sparkles, Filter, Plus, RotateCcw, X } from 'lucide-react';
import { locationData as staticLocationData } from '@/lib/locations';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function DemandFeedContent() {
  const [stateParam, setStateParam] = useState('all');
  const [keyword, setKeyword] = useState('all');
  const [locality, setLocality] = useState('all');
  const [purpose, setPurpose] = useState('All');

  const { requirements, isLoading } = useRequirements({ 
    state: stateParam,
    city: keyword,
    area: locality,
    purpose: purpose !== 'All' ? purpose : undefined 
  });

  const activeRequirements = requirements || [];

  const handleReset = () => {
    setStateParam('all');
    setKeyword('all');
    setLocality('all');
    setPurpose('All');
  };

  const dynamicLocalities = useMemo(() => {
    if (!activeRequirements) return [];
    const localitySet = new Set<string>();
    activeRequirements.forEach(req => {
        if (req.area) {
            localitySet.add(req.area);
        }
    });
    return Array.from(localitySet).sort().map(name => ({ name }));
  }, [activeRequirements]);

  const FilterControls = (
    <div className="flex flex-col gap-8 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Filter className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Filters</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs font-bold text-slate-400 hover:text-primary gap-1.5 transition-colors">
                <RotateCcw className="w-3 h-3" />
                Reset
            </Button>
        </div>

        {/* Purpose Toggle */}
        <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Looking To</Label>
            <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 flex-wrap">
                {['All', 'Rent', 'Sale', 'Lease', 'Buy'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setPurpose(type)}
                        className={cn(
                            "flex-1 py-2 text-[12px] font-bold rounded-xl transition-all duration-300",
                            purpose === type 
                                ? "bg-white text-primary shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Location</Label>
            </div>
            
            <div className="space-y-3">
              <Select value={stateParam} onValueChange={(val) => { setStateParam(val); setKeyword('all'); setLocality('all'); }}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">All States</SelectItem>
                  {staticLocationData.map((s) => (
                    <SelectItem key={s.name} value={s.name} className="font-semibold">{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={keyword} onValueChange={(val) => { setKeyword(val); setLocality('all'); }} disabled={stateParam === 'all'}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold">
                  <SelectValue placeholder="All Sub Locations" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">All Sub Locations</SelectItem>
                  {staticLocationData.find(s => s.name === stateParam)?.districts.map((d) => (
                    <SelectItem key={d.name} value={d.name} className="font-semibold">{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locality} onValueChange={setLocality} disabled={keyword === 'all'}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold">
                        <SelectValue placeholder="All Localities" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="font-bold">All Localities</SelectItem>
                        {/* We could use dynamicLocalities here, but usually users want to type or select from known ones. 
                            For now, let's show what's actually in the feed for that city. */}
                        {dynamicLocalities.map((l) => (
                            <SelectItem key={l.name} value={l.name} className="font-semibold">{l.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      <div className="container py-12 px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10"
                >
                    <Sparkles className="w-3 h-3" />
                    Real-time Demand
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                    Demand <span className="text-primary">Feed</span>
                </h1>
                <p className="text-slate-500 font-medium">Browse what people are looking for and contact them directly to close deals faster.</p>
            </div>

            <div className="flex items-center gap-3">
                 <Link href="/post-requirement">
                    <Button className="h-12 px-6 rounded-xl font-black text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform bg-primary">
                        <Plus className="w-5 h-5 mr-2" />
                        Post a Requirement
                    </Button>
                 </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-fit">
            {FilterControls}
          </aside>

          {/* Main Feed Area */}
          <main className="lg:col-span-9">
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(6)].map((_, i) => <RequirementCardSkeleton key={i} />)}
               </div>
            ) : activeRequirements.length > 0 ? (
              <AnimatePresence mode="popLayout">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {activeRequirements.map((req) => (
                    <RequirementCard key={req.id} requirement={req} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
               <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 border-2 border-dashed border-slate-200 rounded-[32px] bg-white mt-6 shadow-sm"
               >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">No Requirements Found</h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">There are currently no active property requirements matching your filters.</p>
                  <Button variant="outline" className="mt-8 h-12 px-8 rounded-xl font-black border-slate-200 hover:bg-primary hover:text-white transition-all" onClick={handleReset}>
                    Clear Filters
                  </Button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <Suspense fallback={
        <div className="container py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 hidden lg:block"><div className="h-96 w-full rounded-2xl bg-slate-100 animate-pulse" /></div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(6)].map((_, i) => <RequirementCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    }>
      <DemandFeedContent />
    </Suspense>
  )
}
