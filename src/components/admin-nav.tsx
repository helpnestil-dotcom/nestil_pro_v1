'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { User, LogOut, LayoutGrid, List, MessageSquare, Shield } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function AdminNav() {
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
    { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/agents', label: 'Agents', icon: User },
    { href: '/admin/builders', label: 'Builders', icon: Shield },
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
