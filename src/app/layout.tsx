import type { Metadata, Viewport } from 'next';
import Script from 'next/script'; // Import the Script component
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CompareTray } from '@/components/compare-tray';
import { BottomNav } from '@/components/bottom-nav';
import { MobileHeader } from '@/components/mobile-header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300','400','500','600','700','800','900'],
  variable: '--font-body',
});


export const metadata: Metadata = {
  title: 'Nestil | Buy, Rent & Sell Properties in India',
  description:
    'Search, Buy, and Sell premium real estate with zero brokerage fees on Nestil, India\'s fastest growing direct-to-owner property marketplace.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/web-app-manifest-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B132B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body
        className={cn(
          inter.variable,
          "font-body antialiased selection:bg-primary/20 selection:text-primary"
        )}
      >
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            <div className="hidden md:block">
              <Header />
            </div>
            {/* The MobileHeader will be placed inside page.tsx to allow for page-specific headers if needed, 
                but we could also place it here if it's global. Let's keep it global for now. */}
            <div className="md:hidden">
              {/* Mobile Header will be inside pages */}
            </div>
            <main className="flex-grow">{children}</main>
            <div className="hidden md:block">
              <Footer />
            </div>
          </div>
          <CompareTray />
          <BottomNav />
          <Toaster />
        </FirebaseClientProvider>

        {/* PWA Service Worker Registration */}
        <Script id="register-sw">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  // Registration was successful
                }, function(err) {
                  // registration failed
                });
              });
            }
          `}
        </Script>

        {/* Google Analytics Scripts */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-MQPQTZGSDR"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MQPQTZGSDR');
          `}
        </Script>
      </body>
    </html>
  );
}
