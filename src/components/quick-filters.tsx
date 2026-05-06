'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function QuickFilters() {
  const budgetFilters = ['₹5K - ₹10K', '₹10K - ₹15K', '₹15K - ₹20K', '₹20K+'];
  const typeFilters = ['1BHK', '2BHK', 'Shared Room', 'PG', 'Studio'];
  const moveInFilters = ['Immediate', 'This Week'];

  return (
    <div className="space-y-4 px-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold font-heading text-slate-900">Quick Filters</h2>
        <Button variant="link" className="text-primary font-bold text-xs p-0 h-auto">View All</Button>
      </div>

      <div className="space-y-3.5 overflow-hidden">
        {/* Budget */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          <span className="text-[10px] font-bold text-slate-400 min-w-[50px] uppercase tracking-wider">Budget</span>
          <div className="flex gap-2">
            {budgetFilters.map((filter, i) => (
              <Button 
                key={filter} 
                variant={i === 1 ? 'default' : 'outline'} 
                className={cn(
                    "h-8 px-4 rounded-xl text-[10px] font-bold whitespace-nowrap",
                    i === 1 ? "shadow-md shadow-primary/20" : "border-slate-200 text-slate-600"
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          <span className="text-[10px] font-bold text-slate-400 min-w-[50px] uppercase tracking-wider">Type</span>
          <div className="flex gap-2">
            {typeFilters.map((filter) => (
              <Button 
                key={filter} 
                variant="outline" 
                className="h-8 px-4 rounded-xl text-[10px] font-bold whitespace-nowrap border-slate-200 text-slate-600"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Move-in */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          <span className="text-[10px] font-bold text-slate-400 min-w-[50px] uppercase tracking-wider">Arrival</span>
          <div className="flex gap-2">
            {moveInFilters.map((filter, i) => (
              <Button 
                key={filter} 
                variant={i === 0 ? 'default' : 'outline'} 
                className={cn(
                    "h-8 px-4 rounded-xl text-[10px] font-bold whitespace-nowrap",
                    i === 0 ? "shadow-md shadow-primary/20" : "border-slate-200 text-slate-600"
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
