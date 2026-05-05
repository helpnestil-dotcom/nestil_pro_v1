'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderCircle, Shield } from 'lucide-react';
import { AdminNav } from '@/components/admin-nav';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: currentUser, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const adminEmail = 'helpnestil@gmail.com';
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Don't run auth logic until user state is resolved
    if (isUserLoading) {
      return;
    }
    
    const userIsAdmin = currentUser?.email === adminEmail;

    if (userIsAdmin) {
      setIsAuthorized(true);
    } else {
      // If on any admin page other than login, and not an admin, redirect.
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
      setIsAuthorized(false);
    }
  }, [isUserLoading, currentUser, router, adminEmail, pathname]);
  
  // Always allow the login page to render without checks.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // While loading user state, or if not yet authorized, show a loader.
  if (isUserLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If authorized, render the admin layout
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-heading">
      {/* Sidebar - Fixed Height */}
      <aside className="w-64 flex-shrink-0 border-r bg-slate-950 text-slate-300">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2 text-xl font-black text-white tracking-tighter">
              <Shield className="h-6 w-6 text-primary" />
              <span>NESTIL <span className="text-primary italic">PRO</span></span>
            </Link>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 ml-8">Admin Console</p>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <AdminNav />
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
             <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  AD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">Administrator</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Bar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>Admin</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold capitalize">
                {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ')}
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-slate-600 font-bold text-xs hover:bg-slate-100">
                <Link href="/">Back to Website</Link>
              </Button>
              <div className="h-8 w-px bg-slate-200" />
              <div className="relative">
                 <div className="w-2 h-2 bg-rose-500 rounded-full absolute -top-0.5 -right-0.5 border-2 border-white animate-pulse" />
                 <Shield className="w-5 h-5 text-slate-400" />
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

