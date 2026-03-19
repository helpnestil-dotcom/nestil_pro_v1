'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { AdminNav } from '@/components/admin-nav';

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
    <div className="container py-10">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <AdminNav />
        </aside>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
