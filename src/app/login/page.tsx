'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { LoaderCircle, Home, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="w-full max-w-[420px] animate-in-up">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="bg-primary rounded-xl p-2.5 transition-transform group-hover:rotate-12 duration-300 shadow-lg shadow-primary/20">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span className="text-3xl font-black text-slate-800 tracking-tight lowercase">nestil.in</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Classic UI Access</h1>
        <p className="text-slate-500 mt-2 font-medium">Step into Andhra's elite property marketplace</p>
      </div>

      <div className="glass-card p-8 rounded-[32px] border-white/50 backdrop-blur-2xl">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Direct contact with property owners</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
             <ShieldCheck className="h-4 w-4 text-primary" />
             <span>100% Verified premium listings</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
             <Zap className="h-4 w-4 text-amber-500" />
             <span>Zero brokerage, maximum savings</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            className="w-full h-14 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md py-4 gap-3"
          >
            {isLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <GoogleIcon className="h-6 w-6" />
            )}
            {isLoading ? 'Processing...' : 'Continue with Google'}
          </Button>

          <p className="text-[11px] text-center text-slate-400 px-4 leading-relaxed mt-6">
            By joining, you agree to our <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center flex flex-col gap-4 animate-in-up delay-200">
          <Link href="/admin/login" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
            — Staff Admin Portal —
          </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 overflow-hidden py-20">
      {/* Background elements to match Hero */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-3xl animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-sky-400/10 rounded-full filter blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0 opacity-50"></div>

      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<LoaderCircle className="h-12 w-12 animate-spin text-primary" />}>
          <LoginFormComponent />
        </Suspense>
      </div>
    </div>
  );
}
