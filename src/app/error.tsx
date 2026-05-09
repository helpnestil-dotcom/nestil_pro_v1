'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-slate-50 font-sans">
      {/* Background Blobs for brand consistency */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full filter blur-3xl animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-400/10 rounded-full filter blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Animated Icon Container */}
        <div className="inline-flex items-center justify-center p-8 bg-white shadow-xl rounded-[32px] mb-8 animate-in zoom-in duration-500">
            <div className="relative">
                <AlertTriangle className="h-20 w-20 text-rose-500 stroke-[1.5px]" />
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Something went wrong
        </h1>
        
        <p className="text-lg text-slate-500 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 leading-relaxed">
            We encountered an unexpected error while processing your request. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button 
            onClick={() => reset()}
            size="lg" 
            className="rounded-2xl h-14 px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Try again
          </Button>
          
          <Button asChild variant="outline" size="lg" className="rounded-2xl h-14 px-8 font-bold border-slate-200 text-slate-600 hover:bg-slate-100 transition-all hover:scale-[1.02]">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Link>
          </Button>
        </div>

        <div className="mt-16 animate-in fade-in duration-700 delay-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Error Reference</p>
          <code className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500">
            {error.digest || 'Internal Server Error'}
          </code>
        </div>
      </div>

      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0 opacity-50"></div>
    </div>
  );
}
