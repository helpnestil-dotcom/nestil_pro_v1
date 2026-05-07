'use client';

import { useState, useEffect } from 'react';
import { Home, ClipboardList, Plus, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering anything until mounted on the client
  if (!mounted) return null;

  // Hide on login page, admin pages, and property detail pages (where we have sticky contact actions)
  const isPropertyDetail = pathname?.startsWith('/properties/') && pathname.split('/').length > 2;
  if (pathname === '/login' || pathname?.startsWith('/admin') || pathname === '/user-login' || isPropertyDetail) {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ClipboardList, label: 'Demands', href: '/requirements' },
    { icon: Plus, label: 'Post', href: '/post-property', isCenter: true },
    { icon: Truck, label: 'Shifting', href: '/shift-home' },
    { icon: User, label: 'Profile', href: '/dashboard' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-3xl border-t border-slate-100/50 px-6 pt-3 md:hidden"
      style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-between max-w-md mx-auto relative h-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          if (item.isCenter) {
            return (
              <div key={item.href} className="relative -top-4 flex flex-col items-center">
                <Link
                  href={item.href}
                  className="bg-primary p-3 rounded-[18px] shadow-xl shadow-primary/40 text-white border-4 border-white active:scale-90 transition-transform"
                  aria-label={`Post property`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all active:scale-95",
                isActive ? "text-primary" : "text-slate-400"
              )}
              aria-label={`Go to ${item.label}`}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-primary/10")} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
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
