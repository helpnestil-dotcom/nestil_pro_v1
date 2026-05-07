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
      href: '/properties?category=residential',
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
      href: '/properties?category=pg',
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
            "flex flex-col items-center text-center p-3 rounded-2xl transition-all active:scale-95 border border-transparent shadow-sm",
            cat.bgColor
          )}
        >
          <div className={cn("p-2.5 rounded-2xl bg-white shadow-sm mb-3", cat.iconColor)}>
            <cat.icon className="w-5 h-5" />
          </div>
          <h3 className="text-[10px] font-bold font-heading text-slate-800 leading-tight mb-1">{cat.title}</h3>
          <p className="text-[8px] text-slate-400 font-medium leading-tight">{cat.description}</p>
        </Link>
      ))}
    </div>
  );
}
