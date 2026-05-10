import type { Metadata, Viewport } from 'next';
import Script from 'next/script'; // Import the Script component
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CompareTray } from '@/components/compare-tray';
import { BottomNav } from '@/components/bottom-nav';
import { MobileHeader } from '@/components/mobile-header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
});


export const metadata: Metadata = {
  title: {
    default: 'Nestil | Buy, Rent & Sell Properties | Zero Brokerage',
    template: '%s | Nestil',
  },
  description: 'Search, buy, and rent premium real estate with zero brokerage on Nestil. Direct owner properties in Bangalore, Hyderabad, Vijayawada, and across India.',
  keywords: 'zero brokerage properties, direct owner flats Bangalore, houses for rent Karnataka, property marketplace India, Nestil, buy flat Bangalore',
  metadataBase: new URL('https://www.nestil.in'),
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Nestil | India\'s #1 Zero Brokerage Property Platform',
    description: 'Find verified direct-owner properties across India with zero brokerage.',
    url: 'https://www.nestil.in',
    siteName: 'Nestil',
    type: 'website',
    images: [
      {
        url: 'https://www.nestil.in/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Nestil - Zero Brokerage Property Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nestil | Zero Brokerage Properties India',
    description: 'Buy, rent and sell properties directly from owners across India with zero brokerage.',
    images: ['https://www.nestil.in/web-app-manifest-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.nestil.in',
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
        suppressHydrationWarning
        className={cn(
          inter.variable,
          poppins.variable,
          "font-body antialiased selection:bg-primary/20 selection:text-primary bg-[#FCF8F5]"
        )}
      >
        <FirebaseClientProvider>
          {/* Main App Container with Curved Corners (Desktop Only) */}
          <div className="flex flex-col min-h-[100dvh] overflow-hidden bg-white md:rounded-[32px] md:shadow-2xl md:ring-1 md:ring-slate-100 max-w-full mx-auto relative">
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
