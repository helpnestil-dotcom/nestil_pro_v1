'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function QuickFilters() {
  const router = useRouter();
  
  const chips = [
    { label: 'Near Manyata', icon: '🏢' },
    { label: 'Near HSR', icon: '📍' },
    { label: 'Under ₹10k', icon: '💰' },
    { label: 'Girls PG', icon: '👩' },
    { label: 'Boys PG', icon: '👨' },
    { label: 'Single Room', icon: '🛏️' },
    { label: 'Food Included', icon: '🍲' },
    { label: 'AC Room', icon: '❄️' },
    { label: 'Verified', icon: '✅' },
  ];

  const handleChipClick = (label: string) => {
    const params = new URLSearchParams();
    
    if (label.includes('Manyata')) {
      params.set('keyword', 'Manyata');
    } else if (label.includes('HSR')) {
      params.set('keyword', 'HSR Layout');
    } else if (label.includes('10k')) {
      params.set('maxPrice', '10000');
    } else if (label === 'Girls PG') {
      params.set('type', 'PG / Hostel');
      params.set('tenant', 'Female');
    } else if (label === 'Boys PG') {
      params.set('type', 'PG / Hostel');
      params.set('tenant', 'Male');
    } else if (label === 'Single Room') {
      params.set('keyword', 'Single Room');
    } else if (label === 'Food Included') {
      params.set('keyword', 'Food');
    } else if (label === 'AC Room') {
      params.set('keyword', 'AC');
    } else if (label === 'Verified') {
      // By default all approved are verified, but we can set a dummy param
      params.set('verified', 'true');
    }
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="pt-2 pb-6 px-5 w-full overflow-hidden">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 items-center">
        {chips.map((chip, i) => (
          <Button 
            key={chip.label} 
            onClick={() => handleChipClick(chip.label)}
            variant={i === 8 ? 'default' : 'outline'} 
            className={cn(
                "h-9 px-4 rounded-full text-[11px] font-bold whitespace-nowrap gap-1.5 transition-all hover:scale-105 active:scale-95",
                i === 8 ? "bg-accent-green hover:bg-emerald-600 text-white border-transparent shadow-md shadow-accent-green/20" : "bg-white border-slate-200 text-slate-700 shadow-sm"
            )}
          >
            <span>{chip.icon}</span>
            {chip.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
