'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { User, LogOut, LayoutGrid, List, CalendarCheck, Heart, Truck, CreditCard, Building2, Briefcase } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';

export function DashboardNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const { profile } = useUserProfile();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  const getLinks = () => {
    const baseLinks = [
        { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
    ];

    if (profile?.role === 'Worker') {
        return [
            ...baseLinks,
            { href: '/dashboard/shifting-jobs', label: 'Shifting Jobs', icon: Truck },
            { href: '/dashboard/application', label: 'My Application', icon: Briefcase },
            { href: '/dashboard/profile', label: 'Profile Settings', icon: User },
        ];
    }

    if (profile?.role === 'Agent') {
        return [
            ...baseLinks,
            { href: '/dashboard/my-properties', label: 'My Listings', icon: List },
            { href: '/dashboard/leads', label: 'Lead History', icon: CreditCard },
            { href: '/dashboard/visit-requests', label: 'Visit Requests', icon: CalendarCheck },
            { href: '/favorites', label: 'Favorites', icon: Heart },
            { href: '/dashboard/profile', label: 'Profile Settings', icon: User },
        ];
    }

    if (profile?.role === 'Builder') {
        return [
            ...baseLinks,
            { href: '/dashboard/my-properties', label: 'My Projects', icon: Building2 },
            { href: '/dashboard/visit-requests', label: 'Inquiries', icon: CalendarCheck },
            { href: '/favorites', label: 'Favorites', icon: Heart },
            { href: '/dashboard/profile', label: 'Company Profile', icon: User },
        ];
    }

    // Default Owner/Visitor links
    return [
      ...baseLinks,
      { href: '/dashboard/my-properties', label: 'My Properties', icon: List },
      { href: '/dashboard/visit-requests', label: 'Visit Requests', icon: CalendarCheck },
      { href: '/favorites', label: 'Favorites', icon: Heart },
      { href: '/dashboard/profile', label: 'Profile Settings', icon: User },
    ];
  };

  const links = getLinks();

  return (
    <nav className="flex flex-col gap-2">
       {links.map((link) => (
         <Button
          key={link.href}
          variant={pathname === link.href ? 'secondary' : 'ghost'}
          className="justify-start"
          asChild
        >
          <Link href={link.href}>
            <link.icon className="mr-2 h-4 w-4" />
            {link.label}
          </Link>
        </Button>
       ))}
      <Button variant="ghost" className="justify-start" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
}
