'use client';

import { useState, useEffect } from 'react';
import { Briefcase, User, MapPin, Phone, CheckCircle2, ShieldCheck, ArrowLeft, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function RegisterWorkerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    role: '',
    experience: ''
  });

  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSubmitting(true);

    try {
      let currentUserId = user?.uid;
      if (!currentUserId && formData.email && formData.password) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          currentUserId = userCredential.user.uid;
          await updateProfile(userCredential.user, { displayName: formData.name });
          await setDoc(doc(db, 'users', currentUserId), {
            uid: currentUserId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: 'Worker',
            createdAt: serverTimestamp(),
          });
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
             toast.error('Email already in use. Please login.');
             setIsSubmitting(false);
             return;
          }
          throw authError;
        }
      }

      await addDoc(collection(db, 'shiftingWorkers'), {
        ...formData,
        password: '',
        confirmPassword: '',
        userId: currentUserId || null,
        registeredAt: serverTimestamp(),
        status: 'pending_verification'
      });

      // Step 3: Link worker profile to user account and upgrade role
      if (currentUserId) {
        // Use setDoc with merge: true instead of updateDoc to handle cases where 
        // the user doc might not exist yet (common for social logins/new accounts)
        await setDoc(doc(db, 'users', currentUserId), { 
          role: 'Worker',
          lastWorkerRegistration: serverTimestamp() 
        }, { merge: true });
      }

      setIsSuccess(true);
      toast.success('Registration successful!');
    } catch (error: any) {
      console.error('Registration Error:', error);
      // More descriptive error messages for common Firestore issues
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please ensure you are logged in correctly.');
      } else {
        toast.error(error.message || 'Failed to register. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-8 text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Registration Complete!</h2>
            <p className="text-slate-500">Your worker account is ready. Review in progress.</p>
            <Button asChild className="w-full bg-indigo-600">
              <Link href="/dashboard">Access Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6 -ml-4">
          <Link href="/shift-home" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shift Home
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <h1 className="text-3xl font-bold">Partner With Us</h1>
            <p className="text-slate-600">Join Nestil's network of trusted movers.</p>
            <div className="bg-white p-6 rounded-xl border space-y-4 shadow-sm text-sm">
                <div className="flex gap-3"><Briefcase className="w-5 h-5 text-indigo-500" /> Steady Income</div>
                <div className="flex gap-3"><ShieldCheck className="w-5 h-5 text-green-500" /> Verified Platform</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Worker Registration Form</CardTitle>
                <CardDescription>Enter credentials and details below.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Account Security Banner and Fields */}
                  <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Step 1: Account Login</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Gmail/Email Address *</Label>
                        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="partner@gmail.com" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" title="Password"><div className="flex items-center gap-2"><Lock className="w-4 h-4" /> Password {user ? '(Optional)' : '*'}</div></Label>
                            <Input id="password" name="password" type="password" required={!user} value={formData.password} onChange={handleChange} placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password {user ? '(Optional)' : '*'}</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required={!user} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                        </div>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Step 2: Profile Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="10-digit phone" pattern="[0-9]{10}" />
                        </div>
                    </div>
                  </div>

                  {/* Expertise Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred City *</Label>
                      <Select required onValueChange={v => handleSelectChange('city', v)}>
                        <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                        <SelectContent>
                          {['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Other'].map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Role *</Label>
                      <Select required onValueChange={v => handleSelectChange('role', v)}>
                        <SelectTrigger><SelectValue placeholder="Expertise" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="labourer">Labourer</SelectItem>
                          <SelectItem value="packer">Packer</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="agency">Agency Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Experience *</Label>
                    <Select required onValueChange={v => handleSelectChange('experience', v)}>
                      <SelectTrigger><SelectValue placeholder="Years of experience" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fresher">Fresher</SelectItem>
                        <SelectItem value="1_3">1-3 Years</SelectItem>
                        <SelectItem value="3_5">3-5 Years</SelectItem>
                        <SelectItem value="5_plus">5+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold">
                    {isSubmitting ? 'Registering...' : 'Complete Registration'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
