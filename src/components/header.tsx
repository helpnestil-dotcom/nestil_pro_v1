'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Menu, Home, Building2, Activity, Users, Truck, HardHat, LogIn, Info } from 'lucide-react';
import { UserNav } from './user-nav';
import { useState } from 'react';

const NavLogo = () => (
    <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
        <Home className="h-7 w-7 text-primary" />
        <span className="lowercase">nestil.in</span>
    </Link>
)

const WhatsappIcon = ({className}: {className?: string}) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-5", className)}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Do not show header on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }


  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Building2 },
    { href: '/requirements', label: 'Demand Feed', icon: Activity },
    { href: '/properties?transaction=Rent&type=Flatmate+%2F+Co-living', label: 'Flatmates/Coliving', icon: Users },
    { href: '/shift-home', label: 'Shift Home', icon: Truck },
    { href: '/builders', label: 'Builders', icon: HardHat },
    { href: '/shift-home/login', label: 'Partner Login', icon: LogIn },
    { href: '/about', label: 'About', icon: Info },
  ];

  const mobileNavGroups = [
    {
      title: 'Explore',
      links: [
        { href: '/', label: 'Home', icon: Home },
        { href: '/properties', label: 'Properties', icon: Building2 },
      ]
    },
    {
      title: 'Services',
      links: [
        { href: '/requirements', label: 'Demand Feed', icon: Activity },
        { href: '/properties?transaction=Rent&type=Flatmate+%2F+Co-living', label: 'Flatmates/Coliving', icon: Users },
        { href: '/shift-home', label: 'Shift Home', icon: Truck },
        { href: '/builders', label: 'Builders', icon: HardHat },
      ]
    },
    {
      title: 'Partner & Info',
      links: [
        { href: '/shift-home/login', label: 'Partner Login', icon: LogIn },
        { href: '/about', label: 'About', icon: Info },
      ]
    }
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col bg-white/90 backdrop-blur-2xl border-b">
      <div className="flex items-center justify-between h-[68px] px-4 md:px-10">
        {/* Left Side: Logo and Desktop Nav */}
        <div className="flex items-center gap-6">
            <NavLogo />
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex items-center gap-1.5 text-[13px] font-bold transition-all hover:text-primary px-2 py-1.5 rounded-lg hover:bg-slate-50',
                                pathname === link.href ? 'text-primary bg-primary/5' : 'text-slate-600'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>
        </div>

        {/* Right Side: Actions and Mobile Menu */}
        <div className="flex items-center gap-2">
            {/* Desktop version */}
            <Button asChild className="hidden lg:inline-flex !font-bold text-[13px] bg-gradient-to-r from-emerald-500 to-teal-500 border-0 hover:shadow-[0_8px_25px_-8px_rgba(16,185,129,0.5)] hover:scale-[1.02] transform transition-all duration-300 text-white rounded-xl mr-2">
                <Link href="/post-requirement">Post a Need</Link>
            </Button>
            <Button asChild className="hidden md:inline-flex !font-bold text-[13px] bg-gradient-to-r from-primary to-rose-600 border-0 hover:shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.4)] hover:scale-[1.02] transform transition-all duration-300 text-white rounded-xl">
                <Link href="/post-property">+ List Property</Link>
            </Button>
            
            {/* Chat Icon for desktop */}
            <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Contact on WhatsApp"
                className="hidden md:inline-flex text-slate-600 hover:text-emerald-500 hover:bg-emerald-50 transition-colors" 
                asChild
            >
                <Link href="https://wa.me/919492060040" target="_blank" rel="noopener noreferrer" title="Contact on WhatsApp">
                    <WhatsappIcon />
                    <span className="sr-only">Contact on WhatsApp</span>
                </Link>
            </Button>

            {/* Mobile version, visible in the main header */}
            <Button asChild size="sm" className="md:hidden !font-bold text-[12px] px-3 bg-gradient-to-r from-primary to-rose-600 border-0 text-white rounded-lg shadow-md">
                 <Link href="/post-property">+ List Property</Link>
            </Button>

            <UserNav />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-6 mt-6 pb-20 overflow-y-auto max-h-[80vh] px-1">
                        {mobileNavGroups.map((group, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">{group.title}</h4>
                                <div className="flex flex-col gap-1">
                                    {group.links.map(link => {
                                        const Icon = link.icon;
                                        return (
                                            <Link 
                                                key={link.href} 
                                                href={link.href} 
                                                onClick={handleMobileLinkClick}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-semibold transition-all",
                                                    pathname === link.href 
                                                        ? "bg-primary/10 text-primary" 
                                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {link.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                         <div className="border-t pt-4 mt-4 space-y-2">
                             <Button asChild className="w-full justify-start text-lg px-4 py-2 h-auto text-emerald-600" variant="ghost">
                                <Link href="/post-requirement" onClick={handleMobileLinkClick}>
                                    Post a Need
                                </Link>
                             </Button>
                             <Button asChild className="w-full justify-start text-lg px-4 py-2 h-auto" variant="ghost">
                                <Link href="/post-property" onClick={handleMobileLinkClick}>
                                    + List Property
                                </Link>
                             </Button>
                             <Button asChild className="w-full justify-start text-lg px-4 py-2 h-auto" variant="ghost">
                                <Link href="https://wa.me/919492060040" target="_blank" rel="noopener noreferrer" onClick={handleMobileLinkClick}>
                                    <WhatsappIcon className="mr-2 h-5 w-5" />
                                    Contact on WhatsApp
                                </Link>
                             </Button>
                         </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>

      {/* Mobile Subheader */}
      <div className="md:hidden flex items-center gap-3 px-4 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 bg-slate-50/80 backdrop-blur-md">
          <Link href="/requirements" className="flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-extrabold text-slate-700 shadow-sm hover:border-primary hover:text-primary transition-all">
              <Activity className="w-3.5 h-3.5" />
              Demand Feed
          </Link>
          <Link href="/properties?transaction=Rent&type=Flatmate+%2F+Co-living" className="flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-extrabold text-slate-700 shadow-sm hover:border-primary hover:text-primary transition-all">
              <Users className="w-3.5 h-3.5" />
              Flatmates
          </Link>
          <Link href="/shift-home" className="flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-extrabold text-slate-700 shadow-sm hover:border-primary hover:text-primary transition-all">
              <Truck className="w-3.5 h-3.5" />
              Shift Home
          </Link>
      </div>
    </header>
  );
}
