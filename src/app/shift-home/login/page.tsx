'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Truck, ArrowLeft, LoaderCircle, Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function WorkerLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const router = useRouter();
    const { user } = useUser();

    // If already logged in, redirect to dashboard
    if (user) {
        router.replace('/dashboard');
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome back, Partner!');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.code === 'auth/invalid-credential') {
                toast.error('Invalid email or password. Please try again.');
            } else if (error.code === 'auth/user-not-found') {
                toast.error('No account found with this email.');
            } else {
                toast.error('Login failed. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Elegant Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-400/10 rounded-full filter blur-3xl pointer-events-none"></div>
            
            <div className="z-10 w-full max-w-md space-y-8 animate-in-up">
                <div className="text-center">
                    <Link href="/shift-home" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Nestil Shift</span>
                    </Link>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                            <Truck className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-tight">Partner Portal</h1>
                    <p className="text-slate-400 mt-2 font-medium">Log in to manage your shifting jobs</p>
                </div>

                <Card className="bg-white/5 backdrop-blur-3xl border-white/10 shadow-2xl rounded-[32px] overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 w-full"></div>
                    <CardHeader className="pt-8 text-center">
                        <CardTitle className="text-xl text-white">Associate Login</CardTitle>
                        <CardDescription className="text-slate-400">Enter your worker ID and password</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 space-y-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 font-medium flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Registered Email
                                </Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="partner@nestil.in" 
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-300 font-medium flex items-center gap-2">
                                        <Lock className="w-4 h-4" /> Password
                                    </Label>
                                    <Link href="#" className="text-xs text-indigo-400 hover:underline">Forgot password?</Link>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={isLoading} 
                                className="w-full h-12 mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            >
                                {isLoading ? <LoaderCircle className="w-5 h-5 animate-spin mr-2" /> : null}
                                {isLoading ? 'Verifying...' : 'Login to Dashboard'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-white/5 py-6 flex justify-center border-t border-white/5">
                        <p className="text-sm text-slate-400">
                            New Partner? <Link href="/shift-home/register-worker" className="text-indigo-400 font-bold hover:underline">Join the Network</Link>
                        </p>
                    </CardFooter>
                </Card>

                <div className="text-center text-slate-500 text-xs">
                    <p>© 2026 Nestil Technologies. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
