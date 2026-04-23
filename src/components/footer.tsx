

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavLogo = () => (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
        <Home className="h-7 w-7" />
        <span className="lowercase">nestil.in</span>
    </Link>
);

const SocialIcon = ({ children, href, ariaLabel }: { children: React.ReactNode; href: string; ariaLabel: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 cursor-pointer transition-colors hover:text-primary transition-all duration-300 border border-slate-800 bg-slate-900/50 hover:border-primary/30">
        {children}
    </a>
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


export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
        <div className="container py-16 px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                {/* Column 1: Brand */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold text-white tracking-tight">
                        <Home className="h-7 w-7 text-primary" />
                        <span className="lowercase">nestil.in</span>
                    </Link>
                    <p className="text-sm text-slate-300 leading-relaxed mt-2 max-w-xs">
                        India's most trusted property marketplace. We connect buyers, sellers, and renters directly with zero brokerage fees. 
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <SocialIcon href="https://wa.me/919492060040" ariaLabel="WhatsApp"><WhatsappIcon className="h-5 w-5" /></SocialIcon>
                        <SocialIcon href="#" ariaLabel="Instagram"><Instagram className="h-5 w-5" /></SocialIcon>
                        <SocialIcon href="#" ariaLabel="Facebook"><Facebook className="h-5 w-5" /></SocialIcon>
                        <SocialIcon href="#" ariaLabel="Youtube"><Youtube className="h-5 w-5" /></SocialIcon>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Quick Links</h3>
                    <nav className="flex flex-col gap-3">
                        <Link href="/properties" className="text-sm text-slate-300 hover:text-primary transition-colors">Search Properties</Link>
                        <Link href="/post-property" className="text-sm text-slate-300 hover:text-primary transition-colors">List Your Property</Link>
                        <Link href="/agents" className="text-sm text-slate-300 hover:text-primary transition-colors">Find Agents</Link>
                        <Link href="/builders" className="text-sm text-slate-300 hover:text-primary transition-colors">Top Builders</Link>
                    </nav>
                </div>

                {/* Column 3: Company */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Company</h3>
                    <nav className="flex flex-col gap-3">
                        <Link href="/about" className="text-sm text-slate-300 hover:text-primary transition-colors">About Us</Link>
                        <Link href="/contact" className="text-sm text-slate-300 hover:text-primary transition-colors">Contact Support</Link>
                        <Link href="/privacy-policy" className="text-sm text-slate-300 hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="text-sm text-slate-300 hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/investors" className="text-sm text-slate-300 hover:text-primary transition-colors font-semibold">Invest in Nestil</Link>
                    </nav>
                </div>

                {/* Column 4: CTA */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-bold tracking-wide uppercase text-sm mb-2">Ready to sell?</h3>
                    <p className="text-sm text-slate-300 mb-2">
                        Get your property in front of thousands of buyers across India today.
                    </p>
                    <Link href="/post-property" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-sm transition-all duration-300 border border-primary/20 w-max">
                        + Post Free Listing
                    </Link>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 text-xs text-slate-500 font-medium">
                <p>© {new Date().getFullYear()} Nestil Technologies Pvt. Ltd. All rights reserved.</p>
                <div className="flex gap-1 items-center">
                     <span>Made with</span>
                     <span className="text-rose-500 mx-1">♥</span>
                     <span>in India</span>
                </div>
            </div>
        </div>
    </footer>
  );
}
