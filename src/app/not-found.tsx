import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-slate-50">
      {/* Background Blobs for brand consistency */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-3xl animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-sky-400/10 rounded-full filter blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Animated Icon Container */}
        <div className="inline-flex items-center justify-center p-6 bg-white shadow-xl rounded-[32px] mb-8 animate-in-up">
            <div className="relative">
                <Search className="h-16 w-16 text-slate-200 stroke-[1px]" />
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-primary drop-shadow-sm">404</span>
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4 animate-in-up delay-100">
          Oops! Property Not Found
        </h1>
        
        <p className="text-lg text-slate-500 mb-10 animate-in-up delay-200 leading-relaxed">
            The page or property you are looking for might have been sold, removed, or the address was typed incorrectly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in-up delay-300">
          <Button asChild size="lg" className="rounded-2xl h-14 px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            <Link href="/properties">
              <Search className="mr-2 h-5 w-5" />
              Browse Properties
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="rounded-2xl h-14 px-8 font-bold border-slate-200 text-slate-600 hover:bg-slate-100 transition-all hover:scale-[1.02]">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Link>
          </Button>
        </div>

        <div className="mt-16 animate-in-up delay-400">
          <Link href="/contact" className="text-sm font-bold text-primary hover:underline uppercase tracking-widest">
            Need help? Contact Nestil Support
          </Link>
        </div>
      </div>

      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0 opacity-50"></div>
    </div>
  );
}
