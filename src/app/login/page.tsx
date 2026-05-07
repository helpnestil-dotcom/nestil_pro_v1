'use client';

import { useState, useEffect } from 'react';
import MobileLogin from './mobile-login';
import DesktopLogin from './desktop-login';
import { LoaderCircle } from 'lucide-react';

export default function LoginPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the 'lg' breakpoint in Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show a clean loading state while determining the device type to avoid hydration mismatch
  if (isMobile === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return isMobile ? <MobileLogin /> : <DesktopLogin />;
}
