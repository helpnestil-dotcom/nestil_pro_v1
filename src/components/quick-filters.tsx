'use client';

import { Button } from '@/components/ui/button';

export function QuickFilters() {
  const budgetFilters = ['₹5K - ₹10K', '₹10K - ₹15K', '₹15K - ₹20K', '₹20K+'];
  const typeFilters = ['1BHK', '2BHK', 'Shared Room', 'PG', 'Studio'];
  const moveInFilters = ['Immediate', 'This Week'];

  return (
    <div className="space-y-4 px-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Quick filters</h2>
        <Button variant="link" className="text-primary font-bold text-xs p-0 h-auto">View all</Button>
      </div>

      <div className="space-y-3 overflow-hidden">
        {/* Budget */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-500 min-w-[60px] py-2">Budget</span>
          {budgetFilters.map((filter, i) => (
            <Button 
              key={filter} 
              variant={i === 1 ? 'default' : 'outline'} 
              className="h-8 px-4 rounded-lg text-[11px] font-bold whitespace-nowrap border-slate-200"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Type */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-500 min-w-[60px] py-2">Type</span>
          {typeFilters.map((filter) => (
            <Button 
              key={filter} 
              variant="outline" 
              className="h-8 px-4 rounded-lg text-[11px] font-bold whitespace-nowrap border-slate-200"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Move-in */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-500 min-w-[60px] py-2">Move-in</span>
          {moveInFilters.map((filter, i) => (
            <Button 
              key={filter} 
              variant={i === 0 ? 'default' : 'outline'} 
              className="h-8 px-4 rounded-lg text-[11px] font-bold whitespace-nowrap border-slate-200"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
