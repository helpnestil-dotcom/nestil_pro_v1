'use client';

import { Suspense, useState, useMemo } from 'react';
import { useRequirements } from '@/hooks/use-requirements';
import { RequirementCard, RequirementCardSkeleton } from '@/components/requirement-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Sparkles, Filter, Plus, RotateCcw, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { locationData as staticLocationData } from '@/lib/locations';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function DemandFeedContent() {
  const [stateParam, setStateParam] = useState('all');
  const [keyword, setKeyword] = useState('all');
  const [locality, setLocality] = useState('all');
  const [purpose, setPurpose] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters = stateParam !== 'all' || keyword !== 'all' || locality !== 'all' || purpose !== 'All';

  return (
    <div className="bg-white min-h-screen pb-28">
      {/* Mobile Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-5 pt-14 pb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> REAL-TIME DEMAND
          </div>
          <h1 className="text-[28px] font-black leading-tight tracking-tight">
            Demand<br />Feed
          </h1>
          <p className="text-white/70 text-sm font-medium leading-relaxed">
            Browse what people are looking for and contact them directly.
          </p>
        </div>
      </div>

      {/* Purpose Toggle */}
      <div className="px-5 pt-5 pb-2">
        <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
          {['All', 'Rent', 'Sale', 'Lease', 'Buy'].map((type) => (
            <button
              key={type}
              onClick={() => setPurpose(type)}
              className={cn(
                "flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all duration-300",
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

      {/* Filter Bar + Post Button */}
      <div className="px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all",
            showFilters || hasActiveFilters
              ? "bg-primary/5 border-primary/20 text-primary"
              : "bg-slate-50 border-slate-200 text-slate-600"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">!</span>
          )}
          <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
        </button>

        <Link href="/post-requirement" className="ml-auto">
          <Button size="sm" className="h-10 px-4 rounded-xl font-bold text-xs bg-primary shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-1.5" />
            Post Requirement
          </Button>
        </Link>
      </div>

      {/* Collapsible Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3">
              {/* Location Filters */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Location</span>
                  </div>
                  {hasActiveFilters && (
                    <button onClick={handleReset} className="text-[10px] font-bold text-primary flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>

                <Select value={stateParam} onValueChange={(val) => { setStateParam(val); setKeyword('all'); setLocality('all'); }}>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-bold text-xs">
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
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-bold text-xs">
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
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-bold text-xs">
                    <SelectValue placeholder="All Localities" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="font-bold">All Localities</SelectItem>
                    {dynamicLocalities.map((l) => (
                      <SelectItem key={l.name} value={l.name} className="font-semibold">{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => setShowFilters(false)} 
                className="w-full h-10 rounded-xl font-bold text-xs bg-primary"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="px-5 pb-3">
        <p className="text-[11px] font-bold text-slate-400">
          {isLoading ? 'Loading...' : `${activeRequirements.length} requirement${activeRequirements.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Feed */}
      <div className="px-5 space-y-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => <RequirementCardSkeleton key={i} />)
        ) : activeRequirements.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
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
            className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <h2 className="text-lg font-black text-slate-800">No Requirements Found</h2>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mt-2 leading-relaxed">
              There are no active property requirements matching your filters.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-6 h-10 px-6 rounded-xl font-bold text-xs border-slate-200" 
              onClick={handleReset}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pt-8">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-14 -mt-14" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-base font-black">Looking for a home?</h3>
            <p className="text-violet-200 text-xs leading-relaxed">
              Post your requirement and let property owners reach out to you directly.
            </p>
            <Button asChild variant="secondary" size="sm" className="rounded-xl font-bold text-xs h-10 w-full">
              <Link href="/post-requirement">Post Your Requirement</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <Suspense fallback={
      <div className="px-5 pt-20 space-y-4">
        {[...Array(4)].map((_, i) => <RequirementCardSkeleton key={i} />)}
      </div>
    }>
      <DemandFeedContent />
    </Suspense>
  )
}
