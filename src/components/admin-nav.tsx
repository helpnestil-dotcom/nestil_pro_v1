'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { User, LogOut, LayoutGrid, List, MessageSquare, Shield, Truck, Briefcase } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


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
    { href: '/admin/shifting-requests', label: 'Shifting Requests', icon: Truck },
    { href: '/admin/shifting-workers', label: 'Shifting Workers', icon: Briefcase },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { href: '/admin/requirements', label: 'Demand Feed', icon: List },
    { href: '/admin/agents', label: 'Agents', icon: User },
    { href: '/admin/builders', label: 'Builders', icon: Shield },
  ];

  return (
    <nav className="flex flex-col gap-1.5">
       {links.map((link) => {
         const isActive = pathname === link.href;
         const Icon = link.icon;
         
         return (
           <Link 
             key={link.href} 
             href={link.href}
             className={cn(
               "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group",
               isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                : "text-slate-400 hover:text-white hover:bg-slate-900"
             )}
           >
             <Icon className={cn(
               "h-4 w-4 transition-colors",
               isActive ? "text-white" : "text-slate-500 group-hover:text-primary"
             )} />
             {link.label}
             {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
             )}
           </Link>
         );
       })}
       
       <div className="pt-6 mt-6 border-t border-slate-800">
         <button 
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
         >
           <LogOut className="h-4 w-4" />
           Sign Out
         </button>
       </div>
    </nav>
  );
}

