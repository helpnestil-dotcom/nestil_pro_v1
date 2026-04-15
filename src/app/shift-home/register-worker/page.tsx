'use client';

import { useState, useEffect } from 'react';
import { Briefcase, User, MapPin, Phone, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function RegisterWorkerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    role: '',
    experience: ''
  });

  const { user } = useUser();

  // Pre-fill user data if logged in
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
    setIsSubmitting(true);

    try {
      // 1. Save worker application
      await addDoc(collection(db, 'shiftingWorkers'), {
        ...formData,
        userId: user?.uid || null,
        registeredAt: serverTimestamp(),
        status: 'pending_verification'
      });

      // 2. If logged in, update user role to Worker
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          role: 'Worker'
        }).catch(err => console.error("Error updating user role:", err));
      }

      setIsSuccess(true);
      toast.success('Registration successful! We will verify your details soon.');
    } catch (error) {
      console.error('Error registering worker:', error);
      toast.error('Failed to register. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-green-100">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">Registration Complete!</h2>
              <p className="text-slate-500">
                Welcome to Nestil! Our team will review your application soon. Since you are registered with <strong>{user?.email}</strong>, you can access your jobs dashboard instantly.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button asChild className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                <Link href="/dashboard">Access Worker Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" className="text-slate-400">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6 -ml-4 text-slate-600 hover:text-indigo-600">
            <Link href="/shift-home">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shift Home
            </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Partner With Us</h1>
                    <p className="text-slate-600">Join Nestil's network of trusted movers and packers to get regular daily jobs in your city.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                    <div className="flex gap-4 items-start">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Steady Income</h3>
                            <p className="text-sm text-slate-500">Get regular shifting jobs and earn based on the work you complete.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Verified Platform</h3>
                            <p className="text-sm text-slate-500">Work securely under Nestil's trusted brand name with verified customers.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2">
                <Card className="shadow-lg border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-2"></div>
                    <CardHeader className="bg-white">
                        <CardTitle className="text-2xl">Worker Registration Form</CardTitle>
                        <CardDescription>Fill in your details to start getting shifting jobs.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="name" className="font-medium flex items-center gap-2">
                                      <User className="w-4 h-4 text-slate-400" /> Full Name *
                                  </Label>
                                  <Input 
                                    id="name" name="name" placeholder="E.g. Ramesh Kumar" required 
                                    value={formData.name} onChange={handleChange}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="phone" className="font-medium flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-slate-400" /> Phone Number *
                                  </Label>
                                  <Input 
                                    id="phone" name="phone" type="tel" placeholder="10-digit number" required 
                                    value={formData.phone} onChange={handleChange}
                                    pattern="[0-9]{10}"
                                  />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium flex items-center gap-2">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    Gmail Address (Google Account) *
                                </Label>
                                <Input 
                                    id="email" name="email" type="email" placeholder="yourname@gmail.com" required 
                                    value={formData.email} onChange={handleChange}
                                />
                                <p className="text-[11px] text-slate-400 italic">This email will be used as your registered ID to access your dashboard.</p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="city" className="font-medium flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-slate-400" /> Preferred Working City *
                              </Label>
                              <Select required onValueChange={(val) => handleSelectChange('city', val)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                                  <SelectItem value="bangalore">Bangalore</SelectItem>
                                  <SelectItem value="chennai">Chennai</SelectItem>
                                  <SelectItem value="mumbai">Mumbai</SelectItem>
                                  <SelectItem value="delhi">Delhi</SelectItem>
                                  <SelectItem value="other">Other (Within AP/TG)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="role" className="font-medium">Primary Role *</Label>
                                  <Select required onValueChange={(val) => handleSelectChange('role', val)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your expertise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="labourer">Labourer / Helper</SelectItem>
                                      <SelectItem value="packer">Expert Packer</SelectItem>
                                      <SelectItem value="driver">Commercial Driver</SelectItem>
                                      <SelectItem value="agency">Moving Agency Owner</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="experience" className="font-medium">Years of Experience *</Label>
                                  <Select required onValueChange={(val) => handleSelectChange('experience', val)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="fresher">Fresher (0 years)</SelectItem>
                                      <SelectItem value="1_to_3">1 - 3 Years</SelectItem>
                                      <SelectItem value="3_to_5">3 - 5 Years</SelectItem>
                                      <SelectItem value="5_plus">5+ Years</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full text-base font-bold bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl">
                                {isSubmitting ? 'Submitting Registration...' : 'Apply Now'}
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
