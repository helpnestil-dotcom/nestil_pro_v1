'use client';

import { Home, Users, Building2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CategoryCards() {
  const categories = [
    {
      title: 'Find Home',
      description: 'Flats, Apartments, Houses for Rent',
      icon: Home,
      href: '/properties',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Find Flatmate',
      description: 'Find & match perfect flatmates',
      icon: Users,
      href: '/flatmates',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Find PG / Coliving',
      description: 'PGs, Hostels & Coliving spaces',
      icon: Building2,
      href: '/properties?type=PG',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-5">
      {categories.map((cat) => (
        <Link 
          key={cat.title} 
          href={cat.href}
          className={cn(
            "flex flex-col items-center text-center p-4 rounded-2xl transition-all hover:scale-[1.02] border border-transparent hover:border-slate-100",
            cat.bgColor
          )}
        >
          <div className={cn("p-2 rounded-xl bg-white shadow-sm mb-3", cat.iconColor)}>
            <cat.icon className="w-6 h-6" />
          </div>
          <h3 className="text-[11px] font-bold text-slate-800 leading-tight mb-1">{cat.title}</h3>
          <p className="text-[9px] text-slate-500 font-medium leading-tight">{cat.description}</p>
        </Link>
      ))}
    </div>
  );
}
