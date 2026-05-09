'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import MobileDashboard from './mobile-dashboard';
import DesktopDashboard from './desktop-dashboard';
import { LoaderCircle } from 'lucide-react';

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isMobile === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return isMobile ? <MobileDashboard /> : <DesktopDashboard />;
}

