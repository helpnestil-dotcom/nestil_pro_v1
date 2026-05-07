'use client';

import { useState, useEffect } from 'react';
import MobileRequirements from './mobile-requirements';
import DesktopRequirements from './desktop-requirements';
import { LoaderCircle } from 'lucide-react';

export default function RequirementsPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return isMobile ? <MobileRequirements /> : <DesktopRequirements />;
}
