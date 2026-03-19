'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { User, LogOut, LayoutGrid, List, CalendarCheck, Heart } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function DashboardNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
    { href: '/dashboard/my-properties', label: 'My Properties', icon: List },
    { href: '/dashboard/visit-requests', label: 'Visit Requests', icon: CalendarCheck },
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/dashboard/profile', label: 'Profile Settings', icon: User },
  ];

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
