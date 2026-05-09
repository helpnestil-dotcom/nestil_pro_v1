'use client';

import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-black mb-4">Critical System Error</h1>
            <p className="text-slate-500 mb-8">
              A critical error occurred in the application foundation. Please try refreshing the page.
            </p>
            <Button 
              onClick={() => reset()}
              size="lg" 
              className="rounded-2xl h-14 px-8 font-bold bg-primary text-white"
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Reset Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
