'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useFirebase, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Home, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}>
    <g>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </g>
  </svg>
);

function LoginFormComponent() {
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const servicesReady = !!auth && !!firestore;

  // Redirect logged‑in user
  useEffect(() => {
    if (user) {
      router.replace(searchParams.get('redirect') || '/dashboard');
    }
  }, [user, router, searchParams]);

  // Show spinner while auth state loads
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!servicesReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    if (!auth || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Authentication service not ready.' });
      setIsLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          role: 'Visitor',
          createdAt: serverTimestamp(),
        });
      }
      
      toast({ title: 'Welcome to Nestil!', description: 'You have logged in successfully.' });
      router.push(searchParams.get('redirect') || '/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden w-full">
      {/* Top Gradient Area */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 pt-12 pb-28 px-6 text-white relative flex-shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm px-3.5 py-1.5 rounded-full">
            <Home className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black tracking-widest uppercase">Back Home</span>
          </Link>
          
          <h1 className="text-4xl font-black tracking-tight leading-tight mb-3">
            Welcome to <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">Nestil.</span>
          </h1>
          <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[260px]">
            Join India's most trusted premium property marketplace.
          </p>
        </div>
      </div>

      {/* Bottom Card Area */}
      <div className="flex-1 bg-white -mt-16 rounded-t-[32px] relative z-20 px-6 pt-8 pb-12 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] flex flex-col">
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100/60">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-800">Direct Contact</h4>
               <p className="text-[11px] font-medium text-slate-500">Connect directly with property owners</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100/60">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
               <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-800">Verified Listings</h4>
               <p className="text-[11px] font-medium text-slate-500">100% genuine premium properties</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100/60">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
               <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-800">Zero Brokerage</h4>
               <p className="text-[11px] font-medium text-slate-500">Save maximum on your next move</p>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-6 pt-4">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            className="w-full h-14 bg-white hover:bg-slate-50 text-slate-800 font-black text-[15px] rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 transition-all gap-3"
          >
            {isLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <GoogleIcon className="h-6 w-6" />
            )}
            {isLoading ? 'Authenticating...' : 'Continue with Google'}
          </Button>

          <p className="text-[10px] text-center text-slate-400 leading-relaxed px-4 font-medium">
            By continuing, you agree to Nestil's <Link href="/terms-of-service" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
          </p>

          <div className="pt-2 text-center">
            <Link href="/admin/login" className="text-[10px] font-black text-slate-300 hover:text-slate-400 transition-colors uppercase tracking-[0.2em]">
              Staff Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-white">
        <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <LoginFormComponent />
    </Suspense>
  );
}
