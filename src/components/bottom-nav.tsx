'use client';

import { Home, ClipboardList, Plus, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ClipboardList, label: 'Demand Feed', href: '/requirements' },
    { icon: Plus, label: 'Post', href: '/post-property', isCenter: true },
    { icon: Truck, label: 'Shift Home', href: '/shift-home' },
    { icon: User, label: 'Profile', href: '/dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-6 py-3 pb-8 md:hidden">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-10"
              >
                <div className="bg-primary p-3.5 rounded-full shadow-lg shadow-primary/30 text-white border-4 border-white">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-slate-400"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-primary/10")} />
              <span className={cn(
                "text-[10px] font-bold",
                isActive ? "text-primary" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
